<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Author;
use App\Models\Category;
use App\Services\BookMediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BookController extends Controller
{
    protected $bookMediaService;

    public function __construct(BookMediaService $bookMediaService)
    {
        $this->bookMediaService = $bookMediaService;
    }

    /**
     * Display a listing of books
     */
    public function index(Request $request)
    {
        $books = Book::query()
            ->with(['author', 'category'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%")
                    ->orWhereHas('author', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('is_active', $status === 'active');
            })
            ->when($request->input('featured'), function ($query, $featured) {
                $query->where('is_featured', $featured === 'yes');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Books/Index', [
            'books' => $books,
            'filters' => $request->only(['search', 'status', 'featured']),
            'authors' => Author::all(['id', 'name']),
            'categories' => Category::all(['id', 'name'])
        ]);
    }

    /**
     * Show the form for creating a new book
     */
    public function create()
    {
        return Inertia::render('Admin/Books/Create', [
            'authors' => Author::all(['id', 'name']),
            'categories' => Category::all(['id', 'name'])
        ]);
    }

    /**
     * Store a newly created book
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|unique:books,title|max:255',
                'description' => 'nullable|string|max:5000',
                'price' => 'required|numeric|min:0',
                'stock_quantity' => 'required|integer|min:0',
                'isbn' => 'nullable|unique:books,isbn|max:20',
                'page_count' => 'nullable|integer|min:1',
                'publication_date' => 'nullable|date',
                'language' => 'nullable|string|max:50',
                'discount_percentage' => 'nullable|numeric|min:0|max:100',
                'author_id' => 'nullable|exists:authors,id',
                'new_author_name' => 'nullable|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'is_featured' => 'nullable|boolean',
                'is_active' => 'nullable|boolean',
                'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'preview_pdf' => 'nullable|mimes:pdf|max:10240'
            ]);

            // Explicitly handle boolean conversion
            $validated['is_featured'] = filter_var(
                $request->input('is_featured', false),
                FILTER_VALIDATE_BOOLEAN
            );
            $validated['is_active'] = filter_var(
                $request->input('is_active', true),
                FILTER_VALIDATE_BOOLEAN
            );

            if (!empty($validated['new_author_name'])) {
                // Create new author
                $author = Author::create([
                    'name' => $validated['new_author_name']
                ]);
                $validated['author_id'] = $author->id;
            } elseif (empty($validated['author_id'])) {
                throw new \Exception('An author must be selected or created');
            }

            // Generate unique slug
            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $count = 1;

            // Ensure unique slug
            while (Book::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }
            $validated['slug'] = $slug;

            // Handle file uploads
            if ($request->hasFile('cover_image')) {
                $coverImagePath = $request->file('cover_image')->store('books/covers', 'public');
                $validated['cover_image'] = $coverImagePath;
            }

            if ($request->hasFile('preview_pdf')) {
                $previewPdfPath = $request->file('preview_pdf')->store('books/previews', 'public');
                $validated['preview_pdf'] = $previewPdfPath;
            }

            // Ensure boolean values
            $validated['is_featured'] = $validated['is_featured'] ?? false;
            $validated['is_active'] = $validated['is_active'] ?? true;

            // Convert numeric fields
            $validated['price'] = floatval($validated['price']);
            $validated['stock_quantity'] = intval($validated['stock_quantity']);
            $validated['discount_percentage'] = floatval($validated['discount_percentage'] ?? 0);

            $book = Book::create($validated);

            return redirect()->route('admin.books.index')
                ->with('success', 'Book created successfully.');
        } catch (\Exception $e) {
            // Log the full error for debugging
            \Log::error('Book creation error: ' . $e->getMessage());

            return back()->withErrors(['error' => 'Failed to create book. ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function suggestAuthors(Request $request)
    {
        try {
            $query = $request->input('query');

            // Validate input
            if (empty($query) || strlen($query) < 2) {
                return response()->json([]);
            }

            $authors = Author::where('name', 'LIKE', "%{$query}%")
                ->limit(10)
                ->get(['id', 'name']);

            return response()->json($authors);
        } catch (\Exception $e) {
            // Log the error
            \Log::error('Author suggestion error: ' . $e->getMessage());

            // Return a proper JSON error response
            return response()->json([
                'error' => 'Failed to fetch author suggestions',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Display the specified book
     */
    public function show(Book $book)
    {
        // Eager load relationships to prevent N+1 queries
        $book->load(['author', 'category']);

        return Inertia::render('Admin/Books/Show', [
            'book' => $book
        ]);
    }

    /**
     * Show the form for editing a book
     */
    public function edit(Book $book)
    {
        $book->load(['author', 'category']);

        return Inertia::render('Admin/Books/Edit', [
            'book' => $book,
            'authors' => Author::all(['id', 'name']),
            'categories' => Category::all(['id', 'name'])
        ]);
    }

    /**
     * Update the specified book
     */
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title' => [
                'required',
                'max:255',
                Rule::unique('books', 'title')->ignore($book->id)
            ],
            'description' => 'nullable|string|max:5000',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'isbn' => [
                'nullable',
                'max:20',
                Rule::unique('books', 'isbn')->ignore($book->id)
            ],
            'page_count' => 'nullable|integer|min:1',
            'publication_date' => 'nullable|date',
            'language' => 'nullable|string|max:50',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'author_id' => 'required|exists:authors,id',
            'category_id' => 'required|exists:categories,id',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'preview_pdf' => 'nullable|mimes:pdf|max:10240'
        ]);

        // Update slug if title changes
        if ($book->title !== $validated['title']) {
            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $count = 1;

            // Ensure unique slug
            while (Book::where('slug', $slug)->where('id', '!=', $book->id)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }
            $validated['slug'] = $slug;
        }

        // Handle file uploads
        if ($request->hasFile('cover_image')) {
            // Delete old image if exists
            if ($book->cover_image) {
                $this->bookMediaService->deleteOldMedia($book->cover_image);
            }
            $validated['cover_image'] = $this->bookMediaService
                ->uploadCoverImage($request->file('cover_image'));
        }

        if ($request->hasFile('preview_pdf')) {
            // Delete old PDF if exists
            if ($book->preview_pdf) {
                $this->bookMediaService->deleteOldMedia($book->preview_pdf);
            }
            $validated['preview_pdf'] = $this->bookMediaService
                ->uploadPreviewPdf($request->file('preview_pdf'));
        }

        $book->update($validated);

        return redirect()->route('admin.books.index')
            ->with('success', 'Book updated successfully.');
    }

    /**
     * Delete the specified book
     */
    public function destroy(Book $book)
    {
        // Delete associated media files
        if ($book->cover_image) {
            $this->bookMediaService->deleteOldMedia($book->cover_image);
        }
        if ($book->preview_pdf) {
            $this->bookMediaService->deleteOldMedia($book->preview_pdf);
        }

        $book->delete();

        return redirect()->route('admin.books.index')
            ->with('success', 'Book deleted successfully.');
    }

    /**
     * Bulk actions for books
     */
    public function bulkActions(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:activate,deactivate,feature,unfeature,delete',
            'books' => 'required|array|exists:books,id'
        ]);

        $books = Book::whereIn('id', $validated['books']);

        switch ($validated['action']) {
            case 'activate':
                $books->update(['is_active' => true]);
                $message = 'Selected books activated.';
                break;
            case 'deactivate':
                $books->update(['is_active' => false]);
                $message = 'Selected books deactivated.';
                break;
            case 'feature':
                $books->update(['is_featured' => true]);
                $message = 'Selected books featured.';
                break;
            case 'unfeature':
                $books->update(['is_featured' => false]);
                $message = 'Selected books unfeatured.';
                break;
            case 'delete':
                // Delete associated media files
                $booksToDelete = $books->get();
                foreach ($booksToDelete as $book) {
                    if ($book->cover_image) {
                        $this->bookMediaService->deleteOldMedia($book->cover_image);
                    }
                    if ($book->preview_pdf) {
                        $this->bookMediaService->deleteOldMedia($book->preview_pdf);
                    }
                }
                $books->delete();
                $message = 'Selected books deleted.';
                break;
        }

        return redirect()->route('admin.books.index')
            ->with('success', $message);
    }
}
