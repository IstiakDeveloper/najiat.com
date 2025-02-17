import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Book,
    Users,
    Settings,
    Menu,
    X,
    ShoppingCart,
    LogOut,
    Bell,
    Search,
    User
} from 'lucide-react';

// Sidebar Navigation Component
const Sidebar = ({ isOpen, onClose }) => {
    const { url } = usePage();
    const { auth } = usePage().props;

    const menuItems = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            // href: route('admin.dashboard'),
            active: url.startsWith('/admin/dashboard')
        },
        {
            label: 'Books',
            icon: Book,
            href: route('admin.books.index'),
            active: url.startsWith('/admin/books')
        },
        {
            label: 'Categories',
            icon: Book,
            href: route('admin.categories.index'),
            active: url.startsWith('/admin/categories')
        },
        {
            label: 'Users',
            icon: Users,
            // href: route('admin.users.index'),
            active: url.startsWith('/admin/users')
        },
        {
            label: 'Orders',
            icon: ShoppingCart,
            // href: route('admin.orders.index'),
            active: url.startsWith('/admin/orders')
        }
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full w-64
                    bg-white shadow-lg border-r
                    transform transition-transform duration-300
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0
                `}
            >
                {/* Close button for mobile */}
                <button
                    className="lg:hidden absolute top-4 right-4 z-50"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Logo and Brand */}
                <div className="p-6 border-b">
                    <Link
                        // href={route('admin.dashboard')}
                        className="flex items-center space-x-3"
                    >
                        <img
                            src="/logo.png"
                            alt="Admin Logo"
                            className="h-10 w-10"
                        />
                        <span className="text-2xl font-bold text-gray-800">
                            Admin Panel
                        </span>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={`
                                        flex items-center p-2 rounded-lg
                                        transition-colors duration-200
                                        ${item.active
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                                    `}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

// Topbar Component
const Topbar = ({ onMenuToggle }) => {
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement global search functionality
        console.log('Searching:', searchQuery);
    };

    return (
        <header
            className="
                sticky top-0 z-40
                bg-white
                border-b shadow-sm
            "
        >
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden"
                    onClick={onMenuToggle}
                >
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex-grow max-w-xl mx-4 hidden md:block"
                >
                    <div className="relative">
                        <input
                            type="search"
                            placeholder="Search anything..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="
                                w-full pl-10 pr-4 py-2
                                rounded-lg border border-gray-300
                                focus:outline-none
                                focus:ring-2 focus:ring-blue-500
                            "
                        />
                        <Search
                            className="
                                absolute left-3 top-1/2
                                transform -translate-y-1/2
                                text-gray-400
                            "
                        />
                    </div>
                </form>

                {/* Right Side Icons */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <button
                        className="
                            relative p-2 rounded-full
                            hover:bg-gray-100
                        "
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span
                            className="
                                absolute top-0 right-0
                                bg-red-500 text-white
                                rounded-full px-1 text-xs
                            "
                        >
                            3
                        </span>
                    </button>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="
                                flex items-center space-x-2
                                hover:bg-gray-100
                                p-2 rounded-lg
                            "
                        >
                            <img
                                src={auth.user.avatar || '/default-avatar.png'}
                                alt={auth.user.name}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="hidden md:block text-gray-800">
                                {auth.user.name}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div
                                className="
                                    absolute right-0 mt-2 w-48
                                    bg-white
                                    rounded-lg shadow-lg
                                    border
                                    z-50
                                "
                            >
                                <Link
                                    // href={route('admin.profile')}
                                    className="
                                        flex items-center p-3
                                        hover:bg-gray-100
                                        text-gray-700
                                    "
                                >
                                    <User className="w-4 h-4 mr-2 text-gray-600" />
                                    Profile
                                </Link>
                                <Link
                                    // href={route('admin.settings')}
                                    className="
                                        flex items-center p-3
                                        hover:bg-gray-100
                                        text-gray-700
                                    "
                                >
                                    <Settings className="w-4 h-4 mr-2 text-gray-600" />
                                    Settings
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    className="
                                        flex items-center p-3
                                        hover:bg-gray-100
                                        text-red-600
                                    "
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

// Main Admin Layout
const AdminLayout = ({ children }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    // Handle responsive design
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            {/* Sidebar */}
            <Sidebar
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <Topbar onMenuToggle={toggleMobileSidebar} />

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t p-4 text-center">
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;
