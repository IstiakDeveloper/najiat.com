import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Trash2, Edit, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Inline Card Component
const Card = ({ children, className = '' }) => (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
        {children}
    </div>
);

// Inline CardHeader Component
const CardHeader = ({ children, className = '' }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
        {children}
    </div>
);

// Inline CardTitle Component
const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
        {children}
    </h3>
);

// Inline CardContent Component
const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 pt-0 ${className}`}>
        {children}
    </div>
);

// Inline CardFooter Component
const CardFooter = ({ children, className = '' }) => (
    <div className={`flex items-center p-6 pt-0 ${className}`}>
        {children}
    </div>
);

// Inline Button Component
const Button = ({
    children,
    variant = 'default',
    size = 'default',
    className = '',
    ...props
}) => {
    const variantStyles = {
        default: 'bg-blue-500 text-white hover:bg-blue-600',
        outline: 'border border-gray-300 hover:bg-gray-100',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
    };

    const sizeStyles = {
        default: 'px-4 py-2 rounded',
        icon: 'p-2 rounded-full',
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
const Input = ({ className = '', ...props }) => (
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
    placeholder,
    children,
    className = ''
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
    >
        {children}
    </select>
);

// Inline Select Item Component
const SelectItem = ({ value, children }) => (
    <option value={value}>{children}</option>
);

// Inline Checkbox Component
const Checkbox = ({
    checked,
    onCheckedChange,
    className = ''
}) => (
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
const Table = ({ children, className = '' }) => (
    <table className={`w-full ${className}`}>{children}</table>
);

const TableHeader = ({ children, className = '' }) => (
    <thead className={`border-b ${className}`}>{children}</thead>
);

const TableBody = ({ children, className = '' }) => (
    <tbody className={`divide-y ${className}`}>{children}</tbody>
);

const TableRow = ({ children, className = '' }) => (
    <tr className={`hover:bg-gray-50 ${className}`}>{children}</tr>
);

const TableHead = ({ children, className = '' }) => (
    <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
        {children}
    </th>
);

const TableCell = ({ children, className = '' }) => (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);

const CategoryIndex = () => {
    const {
        categories,
        filters
    } = usePage().props;

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    // Debounced search to prevent excessive API calls
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(route('admin.categories.index'),
                { search, status },
                { preserveState: true }
            );
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, status]);

    // Toggle category selection
    const toggleCategorySelection = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Select all categories
    const toggleSelectAll = () => {
        setSelectedCategories(
            selectedCategories.length === categories.data.length
                ? []
                : categories.data.map(category => category.id)
        );
    };

    // Bulk action handler
    const handleBulkAction = (action) => {
        if (selectedCategories.length === 0) {
            alert('Please select categories');
            return;
        }

        router.post(route('admin.categories.bulk-actions'), {
            action,
            categories: selectedCategories
        });
    };

    return (
        <AdminLayout>
            <Head title="Categories Management" />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Categories</CardTitle>
                        <Link href={route('admin.categories.create')}>
                            <Button variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Category
                            </Button>
                        </Link>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Search and Filter */}
                    <div className="flex gap-4 mb-4">
                        <Input
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-grow"
                        />
                        <Select
                            value={status}
                            onValueChange={setStatus}
                            className="w-48"
                        >
                            <SelectItem value="">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </Select>
                    </div>

                    {/* Bulk Actions */}
                    {selectedCategories.length > 0 && (
                        <div className="flex items-center space-x-2 mb-4">
                            <Button
                                variant="destructive"
                                onClick={() => handleBulkAction('delete')}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleBulkAction('activate')}
                            >
                                Activate
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleBulkAction('deactivate')}
                            >
                                Deactivate
                            </Button>
                        </div>
                    )}

                    {/* Category Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Checkbox
                                        checked={
                                            selectedCategories.length === categories.data.length
                                        }
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.data.map(category => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedCategories.includes(category.id)}
                                            onCheckedChange={() => toggleCategorySelection(category.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.slug}</TableCell>
                                    <TableCell>
                                        <span className={
                                            category.is_active
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }>
                                            {category.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(category.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={route('admin.categories.edit', category.id)}
                                            >
                                                <Button variant="outline" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this category?')) {
                                                        router.delete(route('admin.categories.destroy', category.id));
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
                            Showing {categories.from || 0} to {categories.to || 0} of {categories.total} entries
                        </span>
                        <div className="flex items-center space-x-2">
                            {categories.links.map((link, index) => {
                                // Skip rendering if no URL (first/last page indicators)
                                if (!link.url) return null;

                                // Check if it's a previous/next page link
                                const isPrev = link.label.includes('Previous');
                                const isNext = link.label.includes('Next');

                                // Render prev/next links differently
                                if (isPrev || isNext) {
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            disabled={!link.url}
                                            className={`
                                                flex items-center justify-center
                                                w-10 h-10 rounded-md
                                                ${link.active
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white text-gray-700 border'}
                                                ${!link.url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                                            `}
                                            preserveState
                                        >
                                            {isPrev ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                        </Link>
                                    );
                                }

                                // Render page number links
                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`
                                            flex items-center justify-center
                                            w-10 h-10 rounded-md
                                            text-sm
                                            ${link.active
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white text-gray-700 border'}
                                            hover:bg-gray-100
                                        `}
                                        preserveState
                                    >
                                        <div dangerouslySetInnerHTML={{ __html: link.label }} />
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

export default CategoryIndex;
