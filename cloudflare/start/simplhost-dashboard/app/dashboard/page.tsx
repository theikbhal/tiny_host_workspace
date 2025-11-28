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

    useEffect(() => {
        fetch("/api/sites")
            .then((res) => res.json())
            .then((data) => setSites(data));
    }, []);

    async function deleteSite(subdomain: string, id: number) {
        const ok = confirm(`Delete ${subdomain}?`);
        if (!ok) return;

        await fetch(`/api/delete?subdomain=${subdomain}&id=${id}`, {
            method: "DELETE"
        });

        setSites((prev) => prev.filter((s) => s.id !== id));
    }

    return (
        <div style={{ padding: 40, fontFamily: "sans-serif" }}>
            <h1>Your Hosted Sites</h1>

            <table border={1} cellPadding={10}>
                <thead>
                    <tr>
                        <th>Subdomain</th>
                        <th>URL</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sites.map((site) => (
                        <tr key={site.id}>
                            <td>{site.subdomain}</td>
                            <td>
                                <a href={`https://${site.domain}`} target="_blank">
                                    https://{site.domain}
                                </a>
                            </td>
                            <td>{new Date(site.created_at).toLocaleString()}</td>
                            <td>
                                <button
                                    onClick={() => deleteSite(site.subdomain, site.id)}
                                    style={{ color: "red" }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
