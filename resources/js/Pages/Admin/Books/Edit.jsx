import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Edit as EditIcon, PlusCircle, Trash2 } from "lucide-react";

// Reusable Inline Components (similar to previous implementations)
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

const Textarea = ({ className = "", ...props }) => (
    <textarea
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

const Switch = ({ checked, onCheckedChange, className = "" }) => (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="hidden"
        />
        <div
            className={`
                w-10 h-6 rounded-full
                ${checked ? "bg-blue-500" : "bg-gray-300"}
                relative transition-colors duration-200
            `}
        >
            <div
                className={`
                    absolute top-1 left-1
                    w-4 h-4 rounded-full
                    bg-white
                    transform transition-transform duration-200
                    ${checked ? "translate-x-4" : "translate-x-0"}
                `}
            />
        </div>
    </label>
);

const BookEdit = ({ book, authors, categories }) => {
    const [formData, setFormData] = useState({
        title: book.title || "",
        description: book.description || "",
        price: book.price || "",
        stock_quantity: book.stock_quantity || "",
        isbn: book.isbn || "",
        page_count: book.page_count || "",
        publication_date: book.publication_date || "",
        language: book.language || "",
        discount_percentage: book.discount_percentage || "",
        author_id: book.author_id || "",
        category_id: book.category_id || "",
        is_featured: book.is_featured ?? false,
        is_active: book.is_active ?? true,
        cover_image: null,
        preview_pdf: null,
        _method: "PUT",
    });

    const [errors, setErrors] = useState({});
    const [previews, setPreviews] = useState({
        cover_image: book.cover_image ? `/storage/${book.cover_image}` : null,
        preview_pdf: book.preview_pdf ? `/storage/${book.preview_pdf}` : null,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            // Handle file uploads
            if (name === "cover_image" || name === "preview_pdf") {
                const file = files[0];
                setFormData((prev) => ({
                    ...prev,
                    [name]: file,
                }));

                // Create preview
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setPreviews((prev) => ({
                            ...prev,
                            [name]: reader.result,
                        }));
                    };
                    reader.readAsDataURL(file);
                }
            }
        } else {
            // Handle other input changes
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Remove existing image/pdf
    const handleRemoveFile = (fileType) => {
        setFormData((prev) => ({
            ...prev,
            [fileType]: null,
            [`remove_${fileType}`]: true,
        }));
        setPreviews((prev) => ({
            ...prev,
            [fileType]: null,
        }));
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create form data for file upload
        const submitData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== "") {
                submitData.append(key, formData[key]);
            }
        });

        router.post(route("admin.books.update", book.id), submitData, {
            onError: (errorBag) => {
                setErrors(errorBag);
            },
        });
    };

    // Delete book
    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this book?")) {
            router.delete(route("admin.books.destroy", book.id));
        }
    };

    return (
        <AdminLayout>
            <Head title={`Edit Book: ${book.title}`} />

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>
                                <div className="flex items-center">
                                    <EditIcon className="mr-3 w-6 h-6 text-blue-600" />
                                    Edit Book
                                </div>
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <Link href={route("admin.books.create")}>
                                    <Button variant="outline" size="default">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add New Book
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="default"
                                    type="button"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Book
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Book Title *
                                </label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter book title"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ISBN
                                </label>
                                <Input
                                    type="text"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleChange}
                                    placeholder="Enter ISBN"
                                />
                                {errors.isbn && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.isbn}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter book description"
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Pricing and Stock */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price *
                                </label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    step="0.01"
                                    required
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <Input
                                    type="number"
                                    name="stock_quantity"
                                    value={formData.stock_quantity}
                                    onChange={handleChange}
                                    placeholder="Enter stock quantity"
                                    required
                                />
                                {errors.stock_quantity && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.stock_quantity}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount Percentage
                                </label>
                                <Input
                                    type="number"
                                    name="discount_percentage"
                                    value={formData.discount_percentage}
                                    onChange={handleChange}
                                    placeholder="Enter discount %"
                                    max="100"
                                />
                                {errors.discount_percentage && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.discount_percentage}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Author *
                                </label>
                                <Select
                                    name="author_id"
                                    value={formData.author_id}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            author_id: value,
                                        }))
                                    }
                                    required
                                >
                                    <option value="">Select Author</option>
                                    {authors.map((author) => (
                                        <option
                                            key={author.id}
                                            value={author.id}
                                        >
                                            {author.name}
                                        </option>
                                    ))}
                                </Select>
                                {errors.author_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.author_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <Select
                                    name="category_id"
                                    value={formData.category_id}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            category_id: value,
                                        }))
                                    }
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </Select>
                                {errors.category_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Language
                                </label>
                                <Input
                                    type="text"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    placeholder="Enter language"
                                />
                                {errors.language && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.language}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* File Upload Section with Remove Option */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cover Image
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-grow">
                                        <Input
                                            type="file"
                                            name="cover_image"
                                            onChange={handleChange}
                                            accept="image/*"
                                        />
                                    </div>
                                    {previews.cover_image && (
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={previews.cover_image}
                                                alt="Cover Preview"
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() =>
                                                    handleRemoveFile(
                                                        "cover_image"
                                                    )
                                                }
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                {errors.cover_image && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.cover_image}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preview PDF
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-grow">
                                        <Input
                                            type="file"
                                            name="preview_pdf"
                                            onChange={handleChange}
                                            accept=".pdf"
                                        />
                                    </div>
                                    {previews.preview_pdf && (
                                        <div className="flex items-center space-x-2">
                                            <a
                                                href={previews.preview_pdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View PDF
                                            </a>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() =>
                                                    handleRemoveFile(
                                                        "preview_pdf"
                                                    )
                                                }
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                {errors.preview_pdf && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.preview_pdf}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                        <Link href={route("admin.books.index")}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={Object.keys(errors).length > 0}
                        >
                            Update Book
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </AdminLayout>
    );
};

export default BookEdit;
