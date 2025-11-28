"use client";
import Link from "next/link";

export default function Navbar() {
    return (
        <div
            style={{
                padding: "16px 32px",
                background: "#000",
                borderBottom: "1px solid #222",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Link href="/" style={{ textDecoration: "none" }}>
                <h2 style={{ color: "#fff", fontSize: "18px", margin: 0 }}>SimplHost</h2>
            </Link>

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <Link href="/" style={linkStyle}>Home</Link>
                <Link href="/login" style={loginStyle}>Login</Link>
                <Link href="/login" style={signupStyle}>Sign up free</Link>
            </div>
        </div>
    );
}

const linkStyle = {
    color: "#aaa",
    textDecoration: "none",
    fontSize: "14px",
};

const loginStyle = {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
};

const signupStyle = {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
    background: "#3b82f6",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: 600,
};
