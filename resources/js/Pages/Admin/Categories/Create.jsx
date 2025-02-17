import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

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

// Inline Textarea Component
const Textarea = ({ className = '', ...props }) => (
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

// Inline Switch Component
const Switch = ({
    checked,
    onCheckedChange,
    className = ''
}) => (
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
                ${checked ? 'bg-blue-500' : 'bg-gray-300'}
                relative transition-colors duration-200
            `}
        >
            <div
                className={`
                    absolute top-1 left-1
                    w-4 h-4 rounded-full
                    bg-white
                    transform transition-transform duration-200
                    ${checked ? 'translate-x-4' : 'translate-x-0'}
                `}
            />
        </div>
    </label>
);

const CategoryCreate = () => {
    const { data, setData, errors, processing } = useForm({
        name: '',
        description: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post(route('admin.categories.store'), data);
    };

    return (
        <AdminLayout>
            <Head title="Create New Category" />

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Create New Category</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Category Name
                            </label>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter category name"
                                className="mt-1"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <Textarea
                                value={data.description || ''}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter category description (optional)"
                                className="mt-1"
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked)}
                            />
                            <label className="text-sm font-medium">
                                Active Category
                            </label>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                        <Link href={route('admin.categories.index')}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            Create Category
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </AdminLayout>
    );
};

export default CategoryCreate;
