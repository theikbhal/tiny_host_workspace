export default async function NotePage({ params }) {
    const res = await fetch(`http://localhost:3000/api/notes?id=${params.id}`, {
        cache: "no-store",
    });

    const note = await res.json();

    if (!note?.text) {
        return <h1>❌ Note not found</h1>;
    }

    return (
        <main style={{ padding: 20, fontFamily: "Arial" }}>
            <h1>📝 Shared Note</h1>
            <p>{note.text}</p>
        </main>
    );
}
