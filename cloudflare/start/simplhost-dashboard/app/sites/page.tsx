"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Site = {
    id: number;
    domain: string; // This stores the subdomain
    link: string;   // This stores the full URL
    created_at: string;
};

export default function ManageSites() {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function init() {
            // Check auth
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.push("/login");
                return;
            }

            // Load sites
            await loadSites();
        }
        init();
    }, [router]);

    async function loadSites() {
        setLoading(true);
        const res = await fetch("/api/sites");
        const data = await res.json();
        setSites(data);
        setLoading(false);
    }

    async function deleteSite(domain: string, id: number) {
        if (!confirm(`Delete ${domain}?`)) return;

        await fetch(`/api/delete?subdomain=${domain}&id=${id}`, {
            method: "DELETE",
        });

        setSites((prev) => prev.filter((s) => s.id !== id));
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>Manage Sites</h1>

                {loading ? (
                    <p style={{ opacity: 0.6 }}>Loading...</p>
                ) : sites.length === 0 ? (
                    <div style={styles.empty}>
                        <p style={{ fontSize: "16px", opacity: 0.7 }}>No sites deployed yet.</p>
                        <a href="/dashboard" style={styles.deployLink}>Deploy your first site →</a>
                    </div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Subdomain</th>
                                <th style={styles.th}>URL</th>
                                <th style={styles.th}>Created</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sites.map((site) => (
                                <tr key={site.id}>
                                    <td style={styles.td}>{site.domain}</td>
                                    <td style={styles.td}>
                                        <a
                                            href={site.link}
                                            target="_blank"
                                            style={styles.link}
                                        >
                                            {site.link}
                                        </a>
                                    </td>
                                    <td style={styles.td}>
                                        {new Date(site.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <a
                                                href={site.link}
                                                target="_blank"
                                                style={styles.viewBtn}
                                            >
                                                View
                                            </a>
                                            <button
                                                onClick={() => deleteSite(site.domain, site.id)}
                                                style={styles.deleteBtn}
                                            >
                                                Delete
                                            </button>
                                        </div>
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
        paddingTop: "40px",
        paddingBottom: "40px",
    },
    container: {
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "0 20px",
    },
    title: {
        fontSize: "32px",
        marginBottom: "30px",
    },
    empty: {
        textAlign: "center" as const,
        padding: "60px 20px",
        background: "#111",
        borderRadius: "12px",
    },
    deployLink: {
        display: "inline-block",
        marginTop: "20px",
        color: "#3b82f6",
        textDecoration: "none",
        fontSize: "16px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse" as const,
        background: "#111",
        borderRadius: "12px",
        overflow: "hidden",
    },
    th: {
        padding: "16px",
        borderBottom: "1px solid #333",
        textAlign: "left" as const,
        fontSize: "14px",
        fontWeight: 600,
        color: "#aaa",
    },
    td: {
        padding: "16px",
        borderBottom: "1px solid #222",
        fontSize: "14px",
    },
    link: {
        color: "#3b82f6",
        textDecoration: "none",
    },
    viewBtn: {
        color: "#fff",
        textDecoration: "none",
        fontSize: "14px",
        background: "#333",
        padding: "6px 12px",
        borderRadius: "6px",
        display: "inline-block",
    },
    deleteBtn: {
        background: "#ff4242",
        border: "none",
        color: "#fff",
        borderRadius: "6px",
        padding: "6px 12px",
        cursor: "pointer",
        fontSize: "14px",
    },
};
