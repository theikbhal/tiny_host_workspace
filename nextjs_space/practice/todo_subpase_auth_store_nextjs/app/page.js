"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
    const [user, setUser] = useState(null);
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data?.user || null);
        });
    }, []);

    async function loadTodos() {
        const res = await fetch("/api/todos");
        const data = await res.json();
        setTodos(data);
    }

    useEffect(() => {
        if (user) loadTodos();
    }, [user]);

    async function addTodo(e) {
        e.preventDefault();

        await fetch("/api/todos", {
            method: "POST",
            body: JSON.stringify({ text }),
        });

        setText("");
        loadTodos();
    }

    async function toggleTodo(todo) {
        await fetch("/api/todos", {
            method: "PUT",
            body: JSON.stringify({
                id: todo.id,
                completed: !todo.completed,
            }),
        });

        loadTodos();
    }

    async function removeTodo(id) {
        await fetch("/api/todos", {
            method: "DELETE",
            body: JSON.stringify({ id }),
        });

        loadTodos();
    }

    async function signIn() {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: "http://localhost:3000" },
        });
    }

    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
    }

    return (
        <div style={styles.container}>
            <h1>SimpleHost</h1>

            {!user ? (
                <button onClick={signIn} style={styles.btn}>
                    Sign in with Google
                </button>
            ) : (
                <>
                    <p style={styles.email}>{user.email}</p>
                    <button onClick={signOut} style={styles.btn}>Logout</button>

                    <h2>Todo App</h2>

                    <form onSubmit={addTodo} style={styles.form}>
                        <input
                            placeholder="Enter todo..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={styles.input}
                            required
                        />
                        <button style={styles.btn}>Add</button>
                    </form>

                    <ul style={styles.list}>
                        {todos.map((t) => (
                            <li key={t.id} style={styles.item}>
                                <span
                                    onClick={() => toggleTodo(t)}
                                    style={{
                                        ...styles.text,
                                        textDecoration: t.completed ? "line-through" : "none",
                                        color: t.completed ? "#888" : "#fff",
                                    }}
                                >
                                    {t.text}
                                </span>

                                <button
                                    onClick={() => removeTodo(t.id)}
                                    style={styles.delete}
                                >
                                    ❌
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "30px",
        fontFamily: "system-ui",
    },
    btn: {
        background: "#1f2937",
        color: "white",
        padding: "10px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        marginTop: "10px",
    },
    email: {
        marginTop: "10px",
        opacity: 0.7,
    },
    form: {
        display: "flex",
        gap: "10px",
        marginTop: "20px",
    },
    input: {
        flex: 1,
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #333",
        background: "#111",
        color: "#fff",
    },
    list: {
        marginTop: "20px",
        padding: 0,
        listStyle: "none",
    },
    item: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#111",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "10px",
    },
    text: {
        cursor: "pointer",
    },
    delete: {
        background: "transparent",
        border: "none",
        fontSize: "18px",
        cursor: "pointer",
    },
};
