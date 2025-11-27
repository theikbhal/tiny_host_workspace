let notes = [];

function generateId() {
    return Math.random().toString(36).substring(2, 10);
}

export async function POST(req) {
    const body = await req.json();

    const newNote = {
        id: generateId(),
        text: body.note,
        createdAt: new Date(),
    };

    notes.push(newNote);

    return Response.json(newNote);
}

export async function GET(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
        const note = notes.find((n) => n.id === id);
        return Response.json(note || {});
    }

    return Response.json(notes);
}
