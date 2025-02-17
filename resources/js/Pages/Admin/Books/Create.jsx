import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { PlusCircle, Upload, Search } from "lucide-react";

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

const BookCreate = ({ authors, categories }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        stock_quantity: "",
        isbn: "",
        page_count: "",
        publication_date: "",
        language: "",
        discount_percentage: "",
        author_id: "",
        new_author_name: "", // New field for creating author
        category_id: "",
        is_featured: false,
        is_active: true,
        cover_image: null,
        preview_pdf: null,
    });

    const [errors, setErrors] = useState({});
    const [previews, setPreviews] = useState({
        cover_image: null,
        preview_pdf: null,
    });
    const [authorSuggestions, setAuthorSuggestions] = useState([]);
    const [isCustomAuthor, setIsCustomAuthor] = useState(false);

    const handleAuthorSearch = async (query) => {
        if (query.length > 2) {
            try {
                const response = await fetch(
                    route('admin.authors.suggest', { query }),
                    {
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const suggestions = await response.json();

                // Check if the response is valid
                if (Array.isArray(suggestions)) {
                    setAuthorSuggestions(suggestions);
                } else {
                    console.error('Invalid response format:', suggestions);
                    setAuthorSuggestions([]);
                }
            } catch (error) {
                console.error("Error fetching author suggestions:", error);

                // Optionally show a user-friendly error
                setAuthorSuggestions([]);
            }
        } else {
            // Clear suggestions if query is too short
            setAuthorSuggestions([]);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            // File upload logic (previous implementation)
            if (name === "cover_image" || name === "preview_pdf") {
                const file = files[0];
                setFormData((prev) => ({
                    ...prev,
                    [name]: file,
                }));

                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews((prev) => ({
                        ...prev,
                        [name]: reader.result,
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            // Regular input handling
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));

            // Trigger author suggestions if searching for author
            if (name === "new_author_name") {
                handleAuthorSearch(value);
            }
        }
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create form data for file upload
        const submitData = new FormData();

        // Explicitly convert boolean values
        submitData.append("is_featured", formData.is_featured ? "1" : "0");
        submitData.append("is_active", formData.is_active ? "1" : "0");

        // Add other form data
        Object.keys(formData).forEach((key) => {
            if (key !== "is_featured" && key !== "is_active") {
                if (formData[key] !== null && formData[key] !== "") {
                    submitData.append(key, formData[key]);
                }
            }
        });

        router.post(route("admin.books.store"), submitData, {
            onError: (errorBag) => {
                console.error("Server validation errors:", errorBag);
                setErrors(errorBag);
            },
            onSuccess: () => {
                // Reset form
                setFormData({
                    title: "",
                    description: "",
                    price: "",
                    stock_quantity: "",
                    isbn: "",
                    page_count: "",
                    publication_date: "",
                    language: "",
                    discount_percentage: "",
                    author_id: "",
                    category_id: "",
                    is_featured: false,
                    is_active: true,
                    cover_image: null,
                    preview_pdf: null,
                });
                setPreviews({
                    cover_image: null,
                    preview_pdf: null,
                });
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Create New Book" />

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>
                                <div className="flex items-center">
                                    <PlusCircle className="mr-3 w-6 h-6 text-blue-600" />
                                    Create New Book
                                </div>
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Basic Information */}
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
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={isCustomAuthor}
                                        onCheckedChange={(checked) => {
                                            setIsCustomAuthor(checked);
                                            // Reset author fields
                                            setFormData((prev) => ({
                                                ...prev,
                                                author_id: "",
                                                new_author_name: "",
                                            }));
                                        }}
                                    />
                                    <span className="text-sm">
                                        Create New Author
                                    </span>
                                </div>

                                {!isCustomAuthor ? (
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
                                ) : (
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            name="new_author_name"
                                            value={formData.new_author_name}
                                            onChange={handleChange}
                                            placeholder="Enter new author name"
                                            required
                                        />
                                        {authorSuggestions.length > 0 && (
                                            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
                                                {authorSuggestions.map(
                                                    (author) => (
                                                        <div
                                                            key={author.id}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {
                                                                setFormData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        new_author_name:
                                                                            author.name,
                                                                    })
                                                                );
                                                                setAuthorSuggestions(
                                                                    []
                                                                );
                                                            }}
                                                        >
                                                            {author.name}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {errors.author_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.author_id}
                                    </p>
                                )}
                                {errors.new_author_name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.new_author_name}
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

                        {/* File Uploads */}
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
                                        <img
                                            src={previews.cover_image}
                                            alt="Cover Preview"
                                            className="w-20 h-20 object-cover rounded"
                                        />
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
                                        <div className="flex items-center text-blue-600">
                                            <Upload className="mr-2" />
                                            PDF Uploaded
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

                        {/* Publication and Status */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Publication Date
                                </label>
                                <Input
                                    type="date"
                                    name="publication_date"
                                    value={formData.publication_date}
                                    onChange={handleChange}
                                />
                                {errors.publication_date && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.publication_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Page Count
                                </label>
                                <Input
                                    type="number"
                                    name="page_count"
                                    value={formData.page_count}
                                    onChange={handleChange}
                                    placeholder="Enter page count"
                                />
                                {errors.page_count && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.page_count}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Status Toggles */}
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            is_active: checked,
                                        }))
                                    }
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Active Book
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={formData.is_featured}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            is_featured: checked,
                                        }))
                                    }
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Featured Book
                                </label>
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
                            Create Book
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </AdminLayout>
    );
};

export default BookCreate;
