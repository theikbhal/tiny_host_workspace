'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignOut = async () => {
        if (confirm('Are you sure you want to sign out?')) {
            await supabase.auth.signOut();
            router.push('/');
            router.refresh();
        }
    };

    if (!mounted) return null;

    return (
        <nav className="bg-white/95 backdrop-blur-sm px-4 md:px-8 py-4 shadow-sm sticky top-0 z-50">
            <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 text-gray-800 text-xl font-bold no-underline">
                    <span className="text-2xl">⚡</span>
                    <span>SimplHost</span>
                </Link>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-gray-600"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-8">
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
                    <div className="flex items-center gap-4">
                        {user ? (
                            <button onClick={handleSignOut} className="bg-red-100 text-red-600 text-sm font-semibold px-5 py-2 rounded-full hover:bg-red-200 transition-colors border-none cursor-pointer">Sign Out</button>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-600 text-sm font-semibold no-underline hover:text-primary">Log in</Link>
                                <Link href="/register" className="bg-white text-primary border-2 border-primary px-6 py-2 rounded-md text-sm font-semibold hover:bg-primary hover:text-white transition-colors">Sign Up Free</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
                    <div className="flex flex-col gap-2">
                        {user ? (
                            <>
                                <Link href="/dashboard" className={`text-gray-600 text-sm font-semibold px-4 py-3 rounded-md hover:bg-gray-100 ${pathname === '/dashboard' ? 'bg-blue-100 text-blue-700' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                                <Link href="/manage-sites" className={`text-gray-600 text-sm font-semibold px-4 py-3 rounded-md hover:bg-gray-100 ${pathname === '/manage-sites' ? 'bg-blue-100 text-blue-700' : ''}`} onClick={() => setMenuOpen(false)}>Manage Sites</Link>
                                <Link href="/api-keys" className={`text-gray-600 text-sm font-semibold px-4 py-3 rounded-md hover:bg-gray-100 ${pathname === '/api-keys' ? 'bg-blue-100 text-blue-700' : ''}`} onClick={() => setMenuOpen(false)}>API Keys</Link>
                                <button onClick={handleSignOut} className="bg-red-100 text-red-600 text-sm font-semibold px-4 py-3 rounded-md hover:bg-red-200 transition-colors border-none cursor-pointer text-left">Sign Out</button>
                            </>
                        ) : (
                            <>
                                <Link href="/blog" className="text-gray-600 text-sm font-semibold px-4 py-3 rounded-md hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Blog</Link>
                                <Link href="/faq" className="text-gray-600 text-sm font-semibold px-4 py-3 rounded-md hover:bg-gray-100" onClick={() => setMenuOpen(false)}>FAQ</Link>
                                <Link href="/pricing" className="text-gray-600 text-sm font-semibold px-4 py-3 rounded-md hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Pricing</Link>
                                <Link href="/login" className="text-gray-600 text-sm font-semibold px-4 py-3 rounded-md hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Log in</Link>
                                <Link href="/register" className="bg-primary text-white px-4 py-3 rounded-md text-sm font-semibold text-center" onClick={() => setMenuOpen(false)}>Sign Up Free</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
