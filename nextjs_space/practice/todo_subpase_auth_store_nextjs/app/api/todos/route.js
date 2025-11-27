import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET todos
export async function GET() {
    const { data } = await supabase
        .from("todos")
        .select("*")
        .order("id", { ascending: false });

    return Response.json(data || []);
}

// ADD todo
export async function POST(req) {
    const { text } = await req.json();

    await supabase.from("todos").insert([
        { text, completed: false }
    ]);

    return Response.json({ success: true });
}

// UPDATE completed
export async function PUT(req) {
    const { id, completed } = await req.json();

    await supabase
        .from("todos")
        .update({ completed })
        .eq("id", id);

    return Response.json({ success: true });
}

// DELETE todo
export async function DELETE(req) {
    const { id } = await req.json();

    await supabase
        .from("todos")
        .delete()
        .eq("id", id);

    return Response.json({ success: true });
}
