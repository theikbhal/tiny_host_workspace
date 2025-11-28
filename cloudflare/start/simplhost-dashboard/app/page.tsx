"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [subdomain, setSubdomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !subdomain) return alert("Missing inputs");

    setLoading(true);
    setUrl("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subdomain", subdomain);

    const res = await fetch("/api/sites", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data?.url) {
      setUrl(data.url);
    }
  }

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.logo}>SimplHost</div>
        <div style={styles.navLinks}>
          <Link href="/" style={styles.link}>Home</Link>
          <Link href="/dashboard" style={styles.link}>Dashboard</Link>
          <Link href="/login" style={styles.link}>Login</Link>
        </div>

      </nav>

      {/* HERO */}
      <main style={styles.wrapper}>
        <h1 style={styles.heroTitle}>Deploy Static Sites Instantly</h1>
        <p style={styles.heroSubtitle}>
          Upload a ZIP or HTML file and deploy within seconds.
        </p>

        <Link href="/dashboard" style={styles.dashboardBtn}>
          Open Dashboard →
        </Link>

        <div style={styles.divider}></div>

        {/* QUICK DEPLOY */}
        <h2 style={styles.title}>Quick Deploy</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter subdomain (ex: demo123)"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            style={styles.input}
          />

          <input
            type="file"
            accept=".zip,.html"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            {loading ? "Uploading..." : "Deploy Site"}
          </button>
        </form>

        {url && (
          <div style={styles.result}>
            ✅ Live URL:
            <a href={url} target="_blank" style={styles.liveLink}>
              {url}
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "white",
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

  wrapper: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "80px",
  },
  heroTitle: { fontSize: "44px", marginBottom: "10px" },
  heroSubtitle: { opacity: 0.7, marginBottom: "30px" },

  dashboardBtn: {
    background: "#111",
    color: "#3b82f6",
    padding: "12px 20px",
    borderRadius: "10px",
    textDecoration: "none",
    border: "1px solid #333",
    marginBottom: "40px",
  },

  divider: {
    width: "50px",
    height: "2px",
    background: "#222",
    marginBottom: "30px",
  },

  title: { fontSize: "26px", marginBottom: "20px" },

  form: {
    width: "320px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    background: "#111",
    border: "1px solid #333",
    color: "white",
  },

  button: {
    background: "#3b82f6",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },

  result: { marginTop: "25px", textAlign: "center" as const },

  liveLink: {
    display: "block",
    color: "#22c55e",
    marginTop: "6px",
    textDecoration: "underline",
  },
};
