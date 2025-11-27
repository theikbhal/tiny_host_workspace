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
    <main className="text-center pt-8 pb-4 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        The simplest way to host & share your web project
      </h1>

      <div className="bg-white rounded-lg p-6 shadow-xl max-w-2xl mx-auto mb-4">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex border-2 border-gray-200 rounded-md overflow-hidden focus-within:border-primary transition-colors">
            <input
              type="text"
              className="flex-1 px-3 py-2 border-none outline-none text-sm"
              placeholder="link-name"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <span className="bg-primary text-white px-3 py-2 text-sm font-semibold flex items-center">
              .simplhost.com ▼
            </span>
          </div>
        </div>

        <div className="flex gap-4 mb-4 border-b-2 border-gray-200">
          <button className="pb-2 px-4 text-sm font-semibold text-primary border-b-2 border-primary -mb-0.5 bg-transparent cursor-pointer">HTML</button>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer mb-3 hover:border-primary hover:bg-blue-50 transition-all"
          onClick={handleUploadClick}
        >
          {file ? (
            <>
              <div className="text-4xl mb-2">📦</div>
              <div className="text-gray-600 text-sm mb-1">{file.name}</div>
            </>
          ) : (
            <>
              <div className="text-4xl mb-2 text-gray-400">📁 📄</div>
              <div className="text-gray-600 text-sm mb-1">Drag & drop zip or single file here</div>
              <div className="text-gray-400 text-xs">Or</div>
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
          className="w-full py-3 bg-primary text-white border-none rounded-lg text-base font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={handleLaunch}
        >
          Upload
        </button>
      </div>


    </main>
  );
}
