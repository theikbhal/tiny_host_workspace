"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
};

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load todos on first render
  useEffect(() => {
    refreshTodos();
  }, []);

  async function refreshTodos() {
    try {
      setError(null);
      const res = await fetch("/api/todos");
      const data = (await res.json()) as Todo[];
      setTodos(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load todos");
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to add todo");
      }

      const todo = (await res.json()) as Todo;
      setTodos((prev) => [todo, ...prev]);
      setNewText("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to add todo");
    } finally {
      setLoading(false);
    }
  }

  async function toggleTodo(id: number, completed: boolean) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to update todo");
      }

      const updated = (await res.json()) as Todo;
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update todo");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteTodo(id: number) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/todos?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to delete todo");
      }

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete todo");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-center">
            📝 Next.js Todo (TS)
          </h1>
          <p className="text-sm text-zinc-400 text-center mt-1">
            Add, check / uncheck, delete. Mobile-first.
          </p>
        </header>

        {/* Add form */}
        <form
          onSubmit={handleAdd}
          className="flex gap-2 mb-4 w-full"
        >
          <input
            type="text"
            placeholder="What do you need to do?"
            className="flex-1 rounded-lg px-3 py-2 text-sm bg-zinc-900 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !newText.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 disabled:bg-blue-900 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        {error && (
          <div className="mb-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Todo list */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 divide-y divide-zinc-800">
          {todos.length === 0 ? (
            <div className="p-4 text-sm text-zinc-500 text-center">
              No todos yet. Add your first one 👆
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => toggleTodo(todo.id, !todo.completed)}
                  disabled={busyId === todo.id}
                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${todo.completed
                      ? "bg-green-500 border-green-500"
                      : "border-zinc-500"
                    }`}
                >
                  {todo.completed && (
                    <span className="text-[10px] font-bold text-zinc-900">
                      ✓
                    </span>
                  )}
                </button>

                <span
                  className={`flex-1 text-sm ${todo.completed ? "line-through text-zinc-500" : ""
                    }`}
                >
                  {todo.text}
                </span>

                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  disabled={busyId === todo.id}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
