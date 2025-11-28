"use client";

import { useState } from "react";
import JSZip from "jszip";
import { v4 as uuid } from "uuid";

export default function Home() {
  const [subdomain, setSubdomain] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file || !subdomain) return alert("Missing fields");

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subdomain", subdomain);

    const data = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const res = await data.json();
    setStatus(res.message);
  };

  return (
    <div className="min-h-screen p-10 bg-black text-white">
      <h1 className="text-3xl mb-6 font-bold">SimplHost Upload</h1>

      <input
        placeholder="subdomain (example: hello)"
        className="p-2 text-black mb-4 w-full"
        onChange={(e) => setSubdomain(e.target.value)}
      />

      <input
        type="file"
        className="mb-4"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        className="bg-purple-600 px-6 py-2 rounded"
      >
        Upload
      </button>

      <p className="mt-4">{status}</p>
    </div>
  );
}
