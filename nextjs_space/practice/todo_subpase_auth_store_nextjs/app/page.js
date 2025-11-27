"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
    const [user, setUser] = useState(null);
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data?.user || null);
        };
        loadUser();
    }, []);

    async function signInWithGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: "http://localhost:3000" },
        });
    }

    async function signUpWithEmail() {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) alert(error.message);
        else alert("Check your email for verification link ✅");
    }

    async function signInWithEmail() {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) alert(error.message);
    }

    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
    }

    async function loadTodos() {
        const res = await fetch("/api/todos");
        const data = await res.json();
        setTodos(data);
    }

    async function addTodo(e) {
        e.preventDefault();

        await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        setText("");
        loadTodos();
    }

    useEffect(() => {
        if (user) {
            loadTodos();
        }
    }, [user]);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>SimpleHost</h1>

            {!user ? (
                <div style={styles.card}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />

                    <button onClick={signInWithEmail} style={styles.btn}>
                        Login
                    </button>

                    <button onClick={signUpWithEmail} style={styles.btnSecondary}>
                        Register
                    </button>

                    <hr style={styles.hr} />

                    <button onClick={signInWithGoogle} style={styles.googleBtn}>
                        Sign in with Google
                    </button>
                </div>
            ) : (
                <div style={styles.card}>
                    <p style={styles.user}>Logged in as: {user.email}</p>
                    <button onClick={signOut} style={styles.logoutBtn}>
                        Logout
                    </button>

                    <hr style={styles.hr} />

                    <h2 style={styles.todoTitle}>Todo App</h2>

                    <form onSubmit={addTodo} style={styles.form}>
                        <input
                            placeholder="Enter todo..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={styles.input}
                        />
                        <button style={styles.btn}>Add</button>
                    </form>

                    <ul style={styles.todoList}>
                        {todos.map((t) => (
                            <li key={t.id} style={styles.todoItem}>
                                {t.text}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        background: "#020617",
        padding: "30px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
    },
    title: {
        fontSize: "28px",
        marginBottom: "20px",
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "10px",
        background: "#020617",
        border: "1px solid #1e293b",
        borderRadius: "6px",
        color: "white",
    },
    btn: {
        width: "100%",
        padding: "12px",
        marginBottom: "10px",
        background: "#2563eb",
        border: "none",
        borderRadius: "6px",
        color: "white",
        cursor: "pointer",
    },
    btnSecondary: {
        width: "100%",
        padding: "12px",
        marginBottom: "10px",
        background: "#334155",
        border: "none",
        borderRadius: "6px",
        color: "white",
        cursor: "pointer",
    },
    googleBtn: {
        width: "100%",
        padding: "12px",
        background: "#dc2626",
        border: "none",
        borderRadius: "6px",
        color: "white",
        cursor: "pointer",
    },
    logoutBtn: {
        background: "#dc2626",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "none",
        color: "white",
        cursor: "pointer",
    },
    user: { fontSize: "14px", color: "#94a3b8" },
    hr: { margin: "20px 0", borderColor: "#1e293b" },
    todoTitle: { fontSize: "20px", marginBottom: "10px" },
    form: { display: "flex", gap: "8px" },
    todoList: { marginTop: "10px" },
    todoItem: {
        background: "#020617",
        marginBottom: "6px",
        padding: "8px",
        borderRadius: "6px",
    },
};
