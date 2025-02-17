import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Book,
    User,
    BookOpen,
    Calendar,
    Tag,
    DollarSign,
    Star,
    Eye,
    FileText,
    Edit,
    Trash2
} from 'lucide-react';

// Reusable Card Component
const Card = ({ children, className = '' }) => (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
        {children}
    </div>
);

// Reusable Button Component
const Button = ({
    children,
    variant = 'default',
    className = '',
    ...props
}) => {
    const variantStyles = {
        default: 'bg-blue-500 text-white hover:bg-blue-600',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
    };

    return (
        <button
            className={`
                inline-flex items-center justify-center
                px-4 py-2 rounded
                transition-colors
                ${variantStyles[variant]}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
};

// Detail Row Component
const DetailRow = ({ icon: Icon, label, value, highlight = false }) => (
    <div className="flex items-center space-x-4 py-2 border-b last:border-b-0">
        <div className="flex items-center space-x-3 w-1/3">
            <Icon className={`w-5 h-5 ${highlight ? 'text-blue-600' : 'text-gray-500'}`} />
            <span className="font-medium text-gray-700">{label}</span>
        </div>
        <div className={`w-2/3 ${highlight ? 'text-blue-600 font-semibold' : 'text-gray-800'}`}>
            {value || 'N/A'}
        </div>
    </div>
);

const BookShow = ({ book }) => {
    // Calculate discounted price
    const discountedPrice = book.price * (1 - (book.discount_percentage / 100));

    return (
        <AdminLayout>
            <Head title={`Book Details: ${book.title}`} />

            <div className="grid md:grid-cols-3 gap-6">
                {/* Book Cover and Actions */}
                <Card className="md:col-span-1 p-6">
                    <div className="flex flex-col items-center space-y-6">
                        {book.cover_image ? (
                            <img
                                src={`/storage/${book.cover_image}`}
                                alt={book.title}
                                className="w-full max-w-xs rounded-lg shadow-md object-cover"
                            />
                        ) : (
                            <div className="w-full max-w-xs h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                                <Book className="w-16 h-16 text-gray-500" />
                            </div>
                        )}

                        <div className="flex space-x-4 w-full">
                            <Link href={route('admin.books.edit', book.id)} className="w-full">
                                <Button variant="outline" className="w-full">
                                    <Edit className="mr-2 w-4 h-4" />
                                    Edit Book
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this book?')) {
                                        router.delete(route('admin.books.destroy', book.id));
                                    }
                                }}
                            >
                                <Trash2 className="mr-2 w-4 h-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Book Details */}
                <Card className="md:col-span-2 p-6">
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">{book.title}</h1>

                        <DetailRow
                            icon={BookOpen}
                            label="ISBN"
                            value={book.isbn}
                        />

                        <DetailRow
                            icon={User}
                            label="Author"
                            value={book.author?.name}
                            highlight
                        />

                        <DetailRow
                            icon={Tag}
                            label="Category"
                            value={book.category?.name}
                        />

                        <DetailRow
                            icon={DollarSign}
                            label="Pricing"
                            value={`$${book.price.toFixed(2)} ${book.discount_percentage > 0 ? `(${book.discount_percentage}% off)` : ''}`}
                            highlight
                        />

                        {book.discount_percentage > 0 && (
                            <DetailRow
                                icon={DollarSign}
                                label="Discounted Price"
                                value={`$${discountedPrice.toFixed(2)}`}
                                highlight
                            />
                        )}

                        <DetailRow
                            icon={Calendar}
                            label="Publication Date"
                            value={book.publication_date ?
                                new Date(book.publication_date).toLocaleDateString() :
                                'Not specified'
                            }
                        />

                        <DetailRow
                            icon={BookOpen}
                            label="Page Count"
                            value={book.page_count}
                        />

                        <DetailRow
                            icon={FileText}
                            label="Language"
                            value={book.language}
                        />

                        <div className="flex items-center space-x-4 mt-4">
                            <div className="flex items-center space-x-2">
                                <Star className={`w-5 h-5 ${book.is_featured ? 'text-yellow-500' : 'text-gray-400'}`} />
                                <span>Featured Book</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Eye className={`w-5 h-5 ${book.is_active ? 'text-green-500' : 'text-red-500'}`} />
                                <span>{book.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Description and Additional Info */}
                <Card className="md:col-span-3 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {book.description || 'No description available.'}
                    </p>

                    {book.preview_pdf && (
                        <div className="mt-6">
                            <a
                                href={`/storage/${book.preview_pdf}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <FileText className="mr-2 w-5 h-5" />
                                View Preview PDF
                            </a>
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
};

export default BookShow;
