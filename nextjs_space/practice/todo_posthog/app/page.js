"use client";

import { posthog } from "../lib/posthog";
import { useState, useEffect } from "react";

export default function Home() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  posthog.capture("page_loaded");


  async function saveNote() {
    if (!note.trim()) return;

    const res = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify({ note }),
    });

    const data = await res.json();
    setNote("");
    loadNotes();
  }

  async function loadNotes() {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
  }

  useEffect(() => {
    loadNotes();

  }, []);

  return (
    <main style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>📝 Notes Share App</h1>

      <input
        placeholder="Write your note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 10 }}
      />

      <button onClick={saveNote} style={{ padding: 10 }}>
        Save Note
      </button>

      <ul style={{ marginTop: 20 }}>
        {notes.map((n) => (
          <li key={n.id} style={{ marginBottom: 10 }}>
            <div>{n.text}</div>
            <a
              href={`/note/${n.id}`}
              target="_blank"
              style={{ fontSize: 12, color: "blue" }}
            >
              View / Share → /note/{n.id}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
