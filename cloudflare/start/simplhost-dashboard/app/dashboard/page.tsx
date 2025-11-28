"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Link from "next/link";

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

    useEffect(() => {
        async function protect() {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                window.location.href = "/login";
            }
        }
        protect();
        // loadSites();
    }, []);

    async function loadSites() {
        const res = await fetch("/api/sites");
        const data = await res.json();
        setSites(data);
    }

    async function deploySite() {
        if (!file || !subdomain) {
            alert("Enter subdomain and choose a ZIP");
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

    async function deleteSite(subdomain: string, id: number) {
        if (!confirm(`Delete ${subdomain}?`)) return;

        await fetch(`/api/delete?subdomain=${subdomain}&id=${id}`, {
            method: "DELETE",
        });

        setSites((prev) => prev.filter((s) => s.id !== id));
    }

    return (
        <div style={styles.page}>
            {/* NAV */}
            <nav style={styles.nav}>
                <div style={styles.logo}>SimplHost</div>
                <div style={styles.navLinks}>
                    <Link href="/" style={styles.link}>Home</Link>
                    <Link href="/dashboard" style={styles.link}>Dashboard</Link>
                </div>
            </nav>

            {/* UPLOAD CARD */}
            <div style={styles.card}>
                <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>

                <input
                    placeholder="Subdomain"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={styles.input}
                />

                <button onClick={deploySite} style={styles.button} disabled={loading}>
                    {loading ? "Deploying..." : "Deploy Site"}
                </button>

                {liveURL && (
                    <div style={styles.liveBox}>
                        ✅ Live URL:
                        <a href={liveURL} target="_blank" style={styles.liveLink}>
                            {liveURL}
                        </a>
                    </div>
                )}
            </div>

            {/* SITES TABLE */}
            <div style={styles.tableWrap}>
                <h2>Your Sites</h2>

                {sites.length === 0 ? (
                    <p style={{ opacity: 0.6 }}>No sites deployed yet.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Subdomain</th>
                                <th style={styles.th}>URL</th>
                                <th style={styles.th}>Created</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sites.map((site) => (
                                <tr key={site.id}>
                                    <td style={styles.td}>{site.subdomain}</td>
                                    <td style={styles.td}>
                                        <a
                                            href={`https://${site.domain}`}
                                            target="_blank"
                                            style={{ color: "#4da3ff" }}
                                        >
                                            {site.domain}
                                        </a>
                                    </td>
                                    <td style={styles.td}>
                                        {new Date(site.created_at).toLocaleString()}
                                    </td>
                                    <td style={styles.td}>
                                        <button
                                            onClick={() => deleteSite(site.subdomain, site.id)}
                                            style={styles.deleteBtn}
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

const styles = {
    page: {
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        fontFamily: "system-ui",
    },
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: "1px solid #222",
    },
    logo: { fontSize: "20px", fontWeight: "bold" },
    navLinks: { display: "flex", gap: "20px" },
    link: { color: "#ccc", textDecoration: "none" },

    card: {
        margin: "60px auto 20px",
        width: "420px",
        background: "#111",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 0 20px rgba(255,255,255,0.05)",
    },

    input: {
        width: "100%",
        padding: "14px",
        borderRadius: "12px",
        background: "#000",
        border: "1px solid #333",
        color: "white",
        marginBottom: "12px",
    },

    button: {
        width: "100%",
        padding: "14px",
        borderRadius: "12px",
        background: "#3b82f6",
        color: "white",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
    },

    liveBox: {
        marginTop: "16px",
        color: "#7CFF9E",
    },

    liveLink: {
        display: "block",
        color: "#7CFF9E",
        marginTop: "6px",
    },

    tableWrap: {
        maxWidth: "900px",
        margin: "30px auto",
        padding: "0 20px",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        background: "#111",
        borderRadius: "12px",
    },

    th: {
        padding: "12px",
        borderBottom: "1px solid #333",
        textAlign: "left" as const,
        fontSize: "14px",
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #222",
        fontSize: "14px",
    },

    deleteBtn: {
        background: "#ff4242",
        border: "none",
        color: "#fff",
        borderRadius: "8px",
        padding: "6px 12px",
        cursor: "pointer",
    },
};
