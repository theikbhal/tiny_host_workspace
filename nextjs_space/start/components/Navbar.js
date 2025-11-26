'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const userId = localStorage.getItem('userId');
        if (userId) {
            setUser({ id: userId });
        }
    }, []);

    const handleSignOut = () => {
        if (confirm('Are you sure you want to sign out?')) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
        }
    };

    // Prevent hydration mismatch by rendering nothing until mounted, 
    // or render a skeleton/default state. For simplicity, we'll render default (logged out) 
    // and update after mount, but that causes layout shift. 
    // Better to render null or a loading state if critical, but for this simple app, 
    // we can just render.

    if (!mounted) return null; // Or return a skeleton

    return (
        <nav className="bg-white/95 backdrop-blur-sm px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2 text-gray-800 text-xl font-bold no-underline">
                    <span className="text-2xl">⚡</span>
                    <span>SimplHost</span>
                </Link>
                <div className="flex gap-4">
                    {user ? (
                        <>
                            <Link href="/dashboard" className={`text-gray-600 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-800 transition-colors ${pathname === '/dashboard' ? 'bg-blue-100 text-blue-700' : ''}`}>Dashboard</Link>
                            <Link href="/manage-sites" className={`text-gray-600 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-800 transition-colors ${pathname === '/manage-sites' ? 'bg-blue-100 text-blue-700' : ''}`}>Manage Sites</Link>
                            <Link href="/api-keys" className={`text-gray-600 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-800 transition-colors ${pathname === '/api-keys' ? 'bg-blue-100 text-blue-700' : ''}`}>API Keys</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/blog" className="text-gray-600 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-800 transition-colors">Blog</Link>
                            <Link href="/faq" className="text-gray-600 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-800 transition-colors">FAQ</Link>
                            <Link href="/pricing" className="text-gray-600 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-100 hover:text-gray-800 transition-colors">Pricing</Link>
                        </>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-4">
                {user ? (
                    <button onClick={handleSignOut} className="bg-red-100 text-red-600 text-sm font-semibold px-5 py-2 rounded-full hover:bg-red-200 transition-colors border-none cursor-pointer flex items-center">Sign Out</button>
                ) : (
                    <>
                        <Link href="/login" className="text-gray-600 text-sm font-semibold no-underline hover:text-primary">Log in</Link>
                        <Link href="/register" className="bg-white text-primary border-2 border-primary px-6 py-2 rounded-md text-sm font-semibold hover:bg-primary hover:text-white transition-colors">Sign Up Free</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
