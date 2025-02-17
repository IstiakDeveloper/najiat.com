import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import {
    Book,
    Menu,
    X,
    ShoppingCart,
    User,
    Search,
    Heart,
    LogIn,
    UserPlus
} from 'lucide-react';

// Navigation Component
const Navigation = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { label: 'Home', href: route('home') },
        { label: 'Books', href: route('books.index') },
        { label: 'Categories', href: route('categories.index') },
        { label: 'About', href: route('about') },
        { label: 'Contact', href: route('contact') }
    ];

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Book className="h-8 w-8 text-blue-600 mr-2" />
                            <span className="text-2xl font-bold text-gray-800">
                                BookStore
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        {/* Search */}
                        <button className="text-gray-600 hover:text-blue-600">
                            <Search className="h-5 w-5" />
                        </button>

                        {/* Wishlist */}
                        <Link
                            href=""
                            className="text-gray-600 hover:text-blue-600"
                        >
                            <Heart className="h-5 w-5" />
                        </Link>

                        {/* Cart */}
                        <Link
                            href=""
                            className="text-gray-600 hover:text-blue-600"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </Link>

                        {/* User Actions */}
                        <div className="flex items-center space-x-2">
                            <Link
                                href={route('login')}
                                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                            >
                                <LogIn className="h-5 w-5" />
                                <span>Login</span>
                            </Link>
                            <Link
                                href={route('register')}
                                className="flex items-center space-x-1 text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
                            >
                                <UserPlus className="h-5 w-5" />
                                <span>Register</span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-gray-600 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Actions */}
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="flex items-center px-4 space-x-3">
                                <Link
                                    href=""
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    <Heart className="h-5 w-5" />
                                </Link>
                                <Link
                                    href=""
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                </Link>
                            </div>
                            <div className="mt-3 space-y-1">
                                <Link
                                    href={route('login')}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="block px-4 py-2 text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// Footer Component
const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: 'Facebook',
            icon: () => (
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
            href: '#'
        },
        {
            name: 'Twitter',
            icon: () => (
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            ),
            href: '#'
        },
        {
            name: 'Instagram',
            icon: () => (
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126-.667-.667-1.335-1.079-2.126-1.384-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.17-.061-1.816-.256-2.236-.421-.577-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.164-.42-.358-1.065-.421-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.063-1.17.257-1.814.421-2.234.209-.57.479-.96.9-1.381.419-.419.802-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.795.646-1.44 1.44-1.44.793-.001 1.44.645 1.44 1.44z" />
                </svg>
            ),
            href: '#'
        }
    ];

    const footerLinks = [
        { label: 'About Us', href: route('about') },
        { label: 'Contact', href: route('contact') },
        { label: 'Privacy Policy', href: route('privacy') },
        { label: 'Terms of Service', href: route('terms') }
    ];

    return (
        <footer className="bg-gray-100 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center mb-4">
                            <Book className="h-8 w-8 text-blue-600 mr-2" />
                            <span className="text-xl font-bold text-gray-800">
                                BookStore
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Discover, Read, Explore. Your ultimate online bookstore.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <link.icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Stay Updated
                        </h4>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Contact Us
                        </h4>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <span className="font-medium">Email:</span> support@bookstore.com
                            </li>
                            <li>
                                <span className="font-medium">Phone:</span> +1 (555) 123-4567
                            </li>
                            <li>
                                <span className="font-medium">Address:</span> 123 Book Lane, Reading City
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t text-center text-gray-600">
                    <p>
                        © {currentYear} BookStore. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

// Main Guest Layout Component
const GuestLayout = ({ children, title = 'BookStore' }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Head title={title} />

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default GuestLayout;
