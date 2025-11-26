'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userName', data.user.name);
                localStorage.setItem('userId', data.user.id);
                router.push('/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-5">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-10">
                <Link href="/" className="flex items-center justify-center gap-2 text-gray-800 text-2xl font-bold no-underline mb-8">
                    <span className="text-3xl">⚡</span>
                    <span>SimplHost</span>
                </Link>

                <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Welcome Back</h1>
                <p className="text-center text-gray-500 mb-8 text-sm">Sign in to your account to continue</p>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-primary transition-colors"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3.5 bg-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="flex items-center my-6 text-gray-400 text-sm">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="px-4">OR</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div className="text-center text-gray-500 text-sm">
                    Don't have an account? <Link href="/register" className="text-primary font-semibold no-underline hover:underline">Create one</Link>
                </div>
            </div>
        </div>
    );
}
