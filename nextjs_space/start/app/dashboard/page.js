'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Dashboard() {
    const router = useRouter();
    const supabase = createClient();
    const fileInputRef = useRef(null);
    const [domain, setDomain] = useState('');
    const [file, setFile] = useState(null);
    const [activeTab, setActiveTab] = useState('create');
    const [isUploading, setIsUploading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [uploadedLink, setUploadedLink] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            } else {
                setUser(session.user);
            }
        };
        checkUser();
    }, [router, supabase]);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            if (!domain && activeTab === 'create') {
                const name = selectedFile.name.split('.')[0];
                setDomain(name.replace(/[^a-zA-Z0-9_-]/g, ''));
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleLaunch = async () => {
        if (!file || !domain || !user) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('files', file);
        formData.append('domain', domain);
        formData.append('userId', user.id);

        try {
            const method = activeTab === 'update' ? 'PUT' : 'POST';
            const res = await fetch('/api/v1/upload', {
                method: method,
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setUploadedLink(data.data.link);
                setShowSuccess(true);
                setFile(null);
                if (activeTab === 'create') setDomain('');
            } else {
                alert('Upload failed: ' + data.error);
            }
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(uploadedLink);
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    if (!user) return null;

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-5">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 p-4 text-center font-medium cursor-pointer transition-colors ${activeTab === 'create' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => setActiveTab('create')}
                    >
                        Create Site
                    </button>
                    <button
                        className={`flex-1 p-4 text-center font-medium cursor-pointer transition-colors ${activeTab === 'update' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => setActiveTab('update')}
                    >
                        Update Site
                    </button>
                </div>

                <div className="p-8">
                    <div className="mb-6">
                        <label className="block text-sm text-gray-500 mb-2">Domain</label>
                        <div className="flex border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                            <input
                                type="text"
                                className="flex-1 p-3 border-none outline-none text-base"
                                placeholder="mydomain"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                            />
                            <span className="bg-gray-100 text-gray-500 p-3 text-sm flex items-center">.simplhost.com</span>
                        </div>
                    </div>

                    {!file ? (
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer mb-4 hover:border-primary hover:bg-blue-50 transition-all"
                            onClick={handleUploadClick}
                        >
                            <div className="text-5xl mb-4 text-gray-300">📁</div>
                            <div className="text-gray-400 text-sm mb-2">Drag & drop zip file here</div>
                            <div className="text-gray-300 text-xs">(index.html & assets)</div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg mb-4">
                            <span className="text-2xl">📦</span>
                            <span className="flex-1 text-sm text-gray-700 truncate">{file.name}</span>
                            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".zip,.html,.htm"
                        onChange={handleFileChange}
                    />

                    <button
                        className="w-full p-3 bg-white border-2 border-gray-200 rounded-lg text-gray-500 text-sm cursor-pointer hover:border-primary hover:text-primary transition-colors mb-4"
                        onClick={handleUploadClick}
                    >
                        Upload ZIP
                    </button>

                    <div className="text-center text-sm text-gray-400 mb-6">
                        Or <a href="#" onClick={(e) => { e.preventDefault(); alert('Coming soon!') }} className="text-gray-500 underline">use our template</a>
                    </div>

                    <button
                        className="w-full p-4 bg-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!file || !domain || isUploading}
                        onClick={handleLaunch}
                    >
                        {isUploading ? (activeTab === 'update' ? 'Updating...' : 'Launching...') : (activeTab === 'update' ? 'Update Site' : 'Launch')}
                    </button>
                </div>
            </div>

            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
                    <div className="bg-white rounded-xl p-8 max-w-sm w-[90%] text-center relative">
                        <button onClick={() => setShowSuccess(false)} className="absolute top-4 right-4 bg-transparent border-none text-2xl text-gray-400 cursor-pointer">✕</button>
                        <h2 className="text-3xl font-bold mb-4">BOOM!</h2>
                        <div className="text-6xl mb-4">🎉</div>
                        <a href={uploadedLink} target="_blank" className="text-lg text-primary no-underline block mb-2 break-all">{uploadedLink}</a>
                        <div className="text-gray-500 text-sm mb-6">is live for the next 7 days</div>
                        <button onClick={() => window.open(uploadedLink, '_blank')} className="w-full p-4 bg-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer hover:bg-blue-700 mb-2">View Site</button>
                        <button onClick={copyLink} className="w-full p-4 bg-white text-primary border-2 border-primary rounded-lg text-base font-semibold cursor-pointer hover:bg-blue-50">Copy Link</button>
                    </div>
                </div>
            )}
        </div>
    );
}
