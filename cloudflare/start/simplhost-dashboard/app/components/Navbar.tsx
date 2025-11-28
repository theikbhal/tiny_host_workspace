"use client";
import Link from "next/link";

export default function Navbar() {
    return (
        <div
            style={{
                padding: "15px 40px",
                background: "#000",
                borderBottom: "1px solid #222",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <h2 style={{ color: "#fff" }}>SimplHost</h2>

            <div style={{ display: "flex", gap: 20 }}>
                <Link href="/" style={linkStyle}>Home</Link>
                <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
            </div>
        </div>
    );
}

const linkStyle = {
    color: "#aaa",
    textDecoration: "none",
    fontSize: "16px",
};
