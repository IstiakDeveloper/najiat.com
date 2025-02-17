import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Head, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Trash2,
    Edit,
    PlusCircle,
    Eye,
    EyeOff,
    Star,
    StarOff,
} from "lucide-react";

// Inline Card Components (similar to previous implementations)
const Card = ({ children, className = "" }) => (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className = "" }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
        {children}
    </div>
);

const CardTitle = ({ children, className = "" }) => (
    <h3
        className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    >
        {children}
    </h3>
);

const CardContent = ({ children, className = "" }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }) => (
    <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
);

// Inline Button Component
const Button = ({
    children,
    variant = "default",
    size = "default",
    className = "",
    ...props
}) => {
    const variantStyles = {
        default: "bg-blue-500 text-white hover:bg-blue-600",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        destructive: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizeStyles = {
        default: "px-4 py-2 rounded",
        icon: "p-2 rounded-full",
    };

    return (
        <button
            className={`
                inline-flex items-center justify-center
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                transition-colors
                focus:outline-none
                disabled:opacity-50
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
};

// Inline Input Component
const Input = ({ className = "", ...props }) => (
    <input
        className={`
            block w-full px-3 py-2
            border border-gray-300 rounded-md
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${className}
        `}
        {...props}
    />
);

// Inline Select Component
const Select = ({
    value,
    onValueChange,
    children,
    className = "",
    ...props
}) => (
    <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={`
            block w-full px-3 py-2
            border border-gray-300 rounded-md
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${className}
        `}
        {...props}
    >
        {children}
    </select>
);

// Inline Checkbox Component
const Checkbox = ({ checked, onCheckedChange, className = "" }) => (
    <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className={`
            rounded border-gray-300 text-blue-600
            focus:ring-blue-500
            ${className}
        `}
    />
);

// Inline Table Components
const Table = ({ children, className = "" }) => (
    <table className={`w-full ${className}`}>{children}</table>
);

const TableHeader = ({ children, className = "" }) => (
    <thead className={`border-b ${className}`}>{children}</thead>
);

const TableBody = ({ children, className = "" }) => (
    <tbody className={`divide-y ${className}`}>{children}</tbody>
);

const TableRow = ({ children, className = "" }) => (
    <tr className={`hover:bg-gray-50 ${className}`}>{children}</tr>
);

const TableHead = ({ children, className = "" }) => (
    <th
        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    >
        {children}
    </th>
);

const TableCell = ({ children, className = "" }) => (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);

const BookIndex = () => {
    const { books, filters, authors, categories } = usePage().props;

    const [selectedBooks, setSelectedBooks] = useState([]);
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [featured, setFeatured] = useState(filters.featured || "");
    const [authorFilter, setAuthorFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(
                route("admin.books.index"),
                {
                    search,
                    status,
                    featured,
                    author: authorFilter,
                    category: categoryFilter,
                },
                { preserveState: true }
            );
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, status, featured, authorFilter, categoryFilter]);

    // Toggle book selection
    const toggleBookSelection = (bookId) => {
        setSelectedBooks((prev) =>
            prev.includes(bookId)
                ? prev.filter((id) => id !== bookId)
                : [...prev, bookId]
        );
    };

    // Select all books
    const toggleSelectAll = () => {
        setSelectedBooks(
            selectedBooks.length === books.data.length
                ? []
                : books.data.map((book) => book.id)
        );
    };

    // Bulk action handler
    const handleBulkAction = (action) => {
        if (selectedBooks.length === 0) {
            alert("Please select books");
            return;
        }

        router.post(route("admin.books.bulk-actions"), {
            action,
            books: selectedBooks,
        });
    };

    return (
        <AdminLayout>
            <Head title="Book Management" />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Books</CardTitle>
                        <Link href={route("admin.books.create")}>
                            <Button variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Book
                            </Button>
                        </Link>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Search and Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Input
                            placeholder="Search books..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Select value={status} onValueChange={setStatus}>
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select>
                        <Select value={featured} onValueChange={setFeatured}>
                            <option value="">All Featured</option>
                            <option value="yes">Featured</option>
                            <option value="no">Not Featured</option>
                        </Select>
                    </div>

                    {/* Advanced Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Select
                            value={authorFilter}
                            onValueChange={setAuthorFilter}
                        >
                            <option value="">All Authors</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                        </Select>
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Bulk Actions */}
                    {selectedBooks.length > 0 && (
                        <div className="flex items-center space-x-2 mb-4">
                            <Button
                                variant="destructive"
                                onClick={() => handleBulkAction("delete")}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleBulkAction("activate")}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Activate
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleBulkAction("deactivate")}
                            >
                                <EyeOff className="mr-2 h-4 w-4" />
                                Deactivate
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleBulkAction("feature")}
                            >
                                <Star className="mr-2 h-4 w-4" />
                                Feature
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleBulkAction("unfeature")}
                            >
                                <StarOff className="mr-2 h-4 w-4" />
                                Unfeature
                            </Button>
                        </div>
                    )}

                    {/* Book Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Checkbox
                                        checked={
                                            selectedBooks.length ===
                                            books.data.length
                                        }
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {books.data.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedBooks.includes(
                                                book.id
                                            )}
                                            onCheckedChange={() =>
                                                toggleBookSelection(book.id)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {book.cover_image && (
                                                <img
                                                    src={`/storage/${book.cover_image}`}
                                                    alt={book.title}
                                                    className="w-10 h-10 mr-3 rounded object-cover"
                                                />
                                            )}
                                            {book.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>{book.author?.name}</TableCell>
                                    <TableCell>{book.category?.name}</TableCell>
                                    <TableCell>
                                        ${book.price.toFixed(2)}
                                        {book.discount_percentage > 0 && (
                                            <span className="text-green-600 ml-1">
                                                ({book.discount_percentage}%
                                                off)
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{book.stock_quantity}</TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                book.is_active
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {book.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                        {book.is_featured && (
                                            <Star className="inline ml-2 w-4 h-4 text-yellow-500" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                        <Link
                                                href={route(
                                                    "admin.books.show",
                                                    book.id
                                                )}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link
                                                href={route(
                                                    "admin.books.edit",
                                                    book.id
                                                )}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "Are you sure you want to delete this book?"
                                                        )
                                                    ) {
                                                        router.delete(
                                                            route(
                                                                "admin.books.destroy",
                                                                book.id
                                                            )
                                                        );
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>

                {/* Pagination */}
                <CardFooter>
                    <div className="flex justify-between items-center w-full">
                        <span className="text-sm text-gray-600">
                            Showing {books.from || 0} to {books.to || 0} of{" "}
                            {books.total} entries
                        </span>
                        <div className="flex items-center space-x-2">
                            {books.links.map((link, index) => {
                                if (!link.url) return null;

                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`
                                            flex items-center justify-center
                                            w-10 h-10 rounded-md
                                            text-sm
                                            ${
                                                link.active
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-white text-gray-700 border"
                                            }
                                            hover:bg-gray-100
                                        `}
                                        preserveState
                                    >
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </AdminLayout>
    );
};

export default BookIndex;
