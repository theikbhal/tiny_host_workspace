'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [domain, setDomain] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!domain) {
        const name = selectedFile.name.split('.')[0];
        setDomain(name.replace(/[^a-zA-Z0-9_-]/g, ''));
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleLaunch = () => {
    // Redirect to login page as per original functionality
    router.push('/login');
  };

  const handleTemplateClick = (e) => {
    e.preventDefault();
    alert('Template feature coming soon!');
  };

  return (
    <main className="text-center pt-16 pb-8 px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        The simplest way to host &<br />share your web project
      </h1>
      <p className="text-gray-500 text-lg mb-12">🌷 Used by thousands across the web</p>

      <div className="bg-white rounded-xl p-8 shadow-xl max-w-2xl mx-auto mb-8">
        <div className="flex gap-2 mb-6">
          <div className="flex-1 flex border-2 border-gray-200 rounded-md overflow-hidden focus-within:border-primary transition-colors">
            <input
              type="text"
              className="flex-1 px-4 py-3 border-none outline-none text-base"
              placeholder="link-name"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <span className="bg-primary text-white px-4 py-3 font-semibold flex items-center">
              .simplhost.com ▼
            </span>
          </div>
        </div>

        <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
          <button className="pb-3 px-6 font-semibold text-primary border-b-2 border-primary -mb-0.5 bg-transparent cursor-pointer">HTML</button>
          <button className="pb-3 px-6 font-semibold text-gray-500 bg-transparent cursor-pointer hover:text-gray-700">PDF</button>
          <button className="pb-3 px-6 font-semibold text-gray-500 bg-transparent cursor-pointer hover:text-gray-700">Templates</button>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer mb-4 hover:border-primary hover:bg-blue-50 transition-all"
          onClick={handleUploadClick}
        >
          {file ? (
            <>
              <div className="text-5xl mb-4">📦</div>
              <div className="text-gray-600 mb-2">{file.name}</div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4 text-gray-400">📁 📄</div>
              <div className="text-gray-600 mb-2">Drag & drop zip or single file here</div>
              <div className="text-gray-400 text-sm">Or</div>
            </>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".zip,.html,.htm"
          onChange={handleFileChange}
        />

        <button
          className="bg-white text-gray-600 border-2 border-gray-200 px-6 py-3 rounded-md cursor-pointer text-sm mb-4 hover:bg-gray-50 w-full md:w-auto"
          onClick={handleUploadClick}
        >
          Upload file
        </button>

        <div className="text-center text-sm text-gray-500 mb-6">
          Or <a href="#" onClick={handleTemplateClick} className="text-primary underline">use our template</a>
        </div>

        <button
          className="w-full py-4 bg-primary text-white border-none rounded-lg text-lg font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={handleLaunch}
        >
          Upload
        </button>
      </div>

      <div className="max-w-xs mx-auto p-6 bg-yellow-50 rounded-lg text-sm text-yellow-900 italic">
        "perfect for sharing quick web updates with clients. it's just a simple, hassle-free way to host prototypes."
        <div className="mt-2 font-semibold not-italic">- Phil Delvecchio, Hayday Group</div>
      </div>
    </main>
  );
}
