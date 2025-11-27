'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function ManageSites() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState(null);
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('active');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            } else {
                setUser(session.user);
                loadSites(session.user.id);
            }
        };
        checkUser();
    }, [router, supabase]);

    const loadSites = async (userId) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('sites')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading sites:', error);
        } else {
            setSites(data || []);
        }
        setLoading(false);
    };

    const deleteSite = async (domain) => {
        if (!confirm(`Are you sure you want to delete ${domain}?`)) return;

        const formData = new FormData();
        formData.append('domain', domain);

        const res = await fetch('/api/v1/delete', {
            method: 'DELETE',
            body: formData
        });

        const data = await res.json();
        if (data.success) {
            loadSites(user.id);
        } else {
            alert('Failed to delete site: ' + data.error);
        }
    };

    const filteredSites = sites.filter(site => site.status === filter);

    if (!user) return null;

    return (
        <div className="min-h-[calc(100vh-80px)] p-4 md:p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Sites</h1>
                <Link href="/dashboard" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center">
                    Create New Site
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
                <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${filter === 'active' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setFilter('active')}
                >
                    Live ({sites.filter(s => s.status === 'active').length})
                </button>
                <button
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${filter === 'archived' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => setFilter('archived')}
                >
                    Archive ({sites.filter(s => s.status === 'archived').length})
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading sites...</div>
            ) : filteredSites.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">No {filter} sites found</p>
                    <Link href="/dashboard" className="text-primary hover:underline">Create your first site</Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredSites.map((site) => (
                        <div key={site.id} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 break-words">{site.domain}.simplhost.com</h3>
                                    <a
                                        href={site.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm mb-2 block break-all"
                                    >
                                        {site.link} ↗
                                    </a>
                                    <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-sm text-gray-500">
                                        <span>Type: {site.file_type || 'N/A'}</span>
                                        <span>Created: {new Date(site.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <Link
                                        href={`/dashboard?edit=${site.domain}`}
                                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold flex-1 md:flex-initial text-center"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => deleteSite(site.domain)}
                                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold flex-1 md:flex-initial"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
