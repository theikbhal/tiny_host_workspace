import { NextResponse } from "next/server";

type Todo = {
    id: number;
    text: string;
    completed: boolean;
    createdAt: number;
};

// In-memory store (resets when server restarts)
let todos: Todo[] = [];
let nextId = 1;

// GET /api/todos  -> list all todos
export async function GET() {
    const sorted = [...todos].sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json(sorted);
}

// POST /api/todos  -> create new todo { text }
export async function POST(req: Request) {
    const body = await req.json().catch(() => null) as { text?: string } | null;
    const text = body?.text?.trim();

    if (!text) {
        return NextResponse.json(
            { error: "Text is required" },
            { status: 400 }
        );
    }

    const todo: Todo = {
        id: nextId++,
        text,
        completed: false,
        createdAt: Date.now(),
    };

    todos.push(todo);
    return NextResponse.json(todo, { status: 201 });
}

// PATCH /api/todos  -> update completed flag { id, completed }
export async function PATCH(req: Request) {
    const body = await req.json().catch(() => null) as { id?: number; completed?: boolean } | null;
    const id = body?.id;
    const completed = body?.completed;

    if (typeof id !== "number" || typeof completed !== "boolean") {
        return NextResponse.json(
            { error: "id (number) and completed (boolean) are required" },
            { status: 400 }
        );
    }

    const todo = todos.find((t) => t.id === id);
    if (!todo) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    todo.completed = completed;
    return NextResponse.json(todo);
}

// DELETE /api/todos?id=123
export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    const id = idParam ? Number(idParam) : NaN;

    if (!idParam || Number.isNaN(id)) {
        return NextResponse.json(
            { error: "Valid id query param is required" },
            { status: 400 }
        );
    }

    const before = todos.length;
    todos = todos.filter((t) => t.id !== id);

    if (todos.length === before) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
