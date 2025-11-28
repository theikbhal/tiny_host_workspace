"use client";

import { useEffect, useState } from "react";

type Site = {
    id: number;
    subdomain: string;
    domain: string;
    created_at: string;
};

export default function Dashboard() {
    const [sites, setSites] = useState<Site[]>([]);
    const [subdomain, setSubdomain] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [liveURL, setLiveURL] = useState("");

    // Fetch sites
    useEffect(() => {
        loadSites();
    }, []);

    async function loadSites() {
        const res = await fetch("/api/sites");
        const data = await res.json();
        setSites(data);
    }

    // Deploy site
    async function deploySite() {
        if (!file || !subdomain) {
            alert("Please enter subdomain and choose a zip file");
            return;
        }

        setLoading(true);
        setLiveURL("");

        const form = new FormData();
        form.append("subdomain", subdomain);
        form.append("file", file);

        const res = await fetch("/api/sites", {
            method: "POST",
            body: form,
        });

        const data = await res.json();
        setLoading(false);

        if (data.success) {
            setLiveURL(data.url);
            setSubdomain("");
            setFile(null);
            loadSites();
        } else {
            alert("Upload failed");
        }
    }

    // Delete site
    async function deleteSite(subdomain: string, id: number) {
        const ok = confirm(`Delete ${subdomain}?`);
        if (!ok) return;

        await fetch(`/api/delete?subdomain=${subdomain}&id=${id}`, {
            method: "DELETE",
        });

        setSites((prev) => prev.filter((s) => s.id !== id));
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#000",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                padding: 40,
                fontFamily: "system-ui",
            }}
        >
            {/* Upload Card */}
            <div
                style={{
                    width: 420,
                    background: "#111",
                    borderRadius: 12,
                    padding: 30,
                    boxShadow: "0 0 20px rgba(255,255,255,0.05)",
                }}
            >
                <h1 style={{ marginBottom: 20 }}>SimplHost Dashboard</h1>

                <input
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    placeholder="Enter subdomain (ex: demo123)"
                    style={inputStyle}
                />

                <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={inputStyle}
                />

                <button
                    onClick={deploySite}
                    disabled={loading}
                    style={buttonStyle}
                >
                    {loading ? "Deploying..." : "Deploy Site"}
                </button>

                {liveURL && (
                    <div style={{ marginTop: 15, color: "#7CFF9E" }}>
                        ✅ Live URL: <br />
                        <a href={liveURL} target="_blank" style={{ color: "#7CFF9E" }}>
                            {liveURL}
                        </a>
                    </div>
                )}
            </div>

            {/* Sites List */}
            <div style={{ marginTop: 50, width: "100%", maxWidth: 900 }}>
                <h2 style={{ marginBottom: 10 }}>Your Sites</h2>

                {sites.length === 0 ? (
                    <p style={{ opacity: 0.6 }}>No sites deployed yet.</p>
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: 10,
                            background: "#111",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}
                    >
                        <thead>
                            <tr style={{ background: "#222" }}>
                                <th style={thStyle}>Subdomain</th>
                                <th style={thStyle}>URL</th>
                                <th style={thStyle}>Created</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sites.map((site) => (
                                <tr key={site.id}>
                                    <td style={tdStyle}>{site.subdomain}</td>
                                    <td style={tdStyle}>
                                        <a
                                            href={`https://${site.domain}`}
                                            target="_blank"
                                            style={{ color: "#4da3ff" }}
                                        >
                                            {site.domain}
                                        </a>
                                    </td>
                                    <td style={tdStyle}>
                                        {new Date(site.created_at).toLocaleString()}
                                    </td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() =>
                                                deleteSite(site.subdomain, site.id)
                                            }
                                            style={{
                                                background: "red",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 6,
                                                padding: "6px 12px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #333",
    background: "#000",
    color: "#fff",
    marginBottom: "15px",
    fontSize: "16px",
};

const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
};

const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #333",
    fontSize: "14px",
};

const tdStyle: React.CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #222",
    fontSize: "14px",
};
