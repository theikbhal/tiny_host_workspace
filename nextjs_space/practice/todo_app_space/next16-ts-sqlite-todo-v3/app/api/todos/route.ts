// app/api/todos/route.ts
import { NextResponse } from "next/server";
import db, { TodoRow } from "@/lib/db";

export const runtime = "nodejs"; // ensure Node runtime (not edge)

type Todo = {
    id: number;
    text: string;
    completed: boolean;
    createdAt: number;
};

function mapRow(row: TodoRow): Todo {
    return {
        id: row.id,
        text: row.text,
        completed: row.completed === 1,
        createdAt: row.created_at,
    };
}

// GET /api/todos -> list all
export async function GET() {
    const rows = db
        .prepare<TodoRow>("SELECT id, text, completed, created_at FROM todos ORDER BY created_at DESC")
        .all();
    const todos = rows.map(mapRow);
    return NextResponse.json(todos);
}

// POST /api/todos -> { text }
export async function POST(req: Request) {
    const body = (await req.json().catch(() => null)) as { text?: string } | null;
    const text = body?.text?.trim();

    if (!text) {
        return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const now = Date.now();

    const insertStmt = db.prepare(
        "INSERT INTO todos (text, completed, created_at) VALUES (?, ?, ?)"
    );
    const result = insertStmt.run(text, 0, now);

    const selectStmt = db.prepare<TodoRow>(
        "SELECT id, text, completed, created_at FROM todos WHERE id = ?"
    );
    const row = selectStmt.get(result.lastInsertRowid as number);

    if (!row) {
        return NextResponse.json({ error: "Failed to fetch new todo" }, { status: 500 });
    }

    return NextResponse.json(mapRow(row), { status: 201 });
}

// PATCH /api/todos -> { id, completed }
export async function PATCH(req: Request) {
    const body = (await req.json().catch(() => null)) as
        | { id?: number; completed?: boolean }
        | null;

    if (typeof body?.id !== "number" || typeof body?.completed !== "boolean") {
        return NextResponse.json(
            { error: "id (number) and completed (boolean) are required" },
            { status: 400 }
        );
    }

    const completedInt = body.completed ? 1 : 0;

    const updateStmt = db.prepare(
        "UPDATE todos SET completed = ? WHERE id = ?"
    );
    const result = updateStmt.run(completedInt, body.id);

    if (result.changes === 0) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    const selectStmt = db.prepare<TodoRow>(
        "SELECT id, text, completed, created_at FROM todos WHERE id = ?"
    );
    const row = selectStmt.get(body.id);

    if (!row) {
        return NextResponse.json({ error: "Todo not found after update" }, { status: 404 });
    }

    return NextResponse.json(mapRow(row));
}

// DELETE /api/todos?id=123
export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    const id = idParam ? Number(idParam) : NaN;

    if (!idParam || Number.isNaN(id)) {
        return NextResponse.json(
            { error: "Valid id query parameter ?id= is required" },
            { status: 400 }
        );
    }

    const deleteStmt = db.prepare("DELETE FROM todos WHERE id = ?");
    const result = deleteStmt.run(id);

    if (result.changes === 0) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
