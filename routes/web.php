<?php

use App\Http\Controllers\Admin\BookController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('admin.dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('admin/authors/suggest', [BookController::class, 'suggestAuthors'])
    ->name('admin.authors.suggest');

Route::prefix('admin')->name('admin.')->middleware(['auth'])->group(function () {
    // Category Routes
    Route::resource('categories', CategoryController::class)
        ->except(['show'])
        ->names([
            'index' => 'categories.index',
            'create' => 'categories.create',
            'store' => 'categories.store',
            'edit' => 'categories.edit',
            'update' => 'categories.update',
            'destroy' => 'categories.destroy'
        ]);

    // Bulk actions route
    Route::post('categories/bulk-actions', [
        CategoryController::class,
        'bulkActions'
    ])->name('categories.bulk-actions');


    Route::resource('books', BookController::class)
        ->names([
            'index' => 'books.index',
            'create' => 'books.create',
            'store' => 'books.store',
            'show' => 'books.show',
            'edit' => 'books.edit',
            'update' => 'books.update',
            'destroy' => 'books.destroy'
        ]);

    // Bulk actions route for books
    Route::post('books/bulk-actions', [
        BookController::class,
        'bulkActions'
    ])->name('books.bulk-actions');


});


// In web.php
Route::get('/', [BookController::class, 'index'])->name('home');
Route::get('/books', [BookController::class, 'index'])->name('books.index');
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/about', [BookController::class, 'about'])->name('about');
Route::get('/contact', [BookController::class, 'contact'])->name('contact');
Route::get('/privacy', [BookController::class, 'privacy'])->name('privacy');
Route::get('/terms', [BookController::class, 'terms'])->name('terms');

require __DIR__.'/auth.php';
