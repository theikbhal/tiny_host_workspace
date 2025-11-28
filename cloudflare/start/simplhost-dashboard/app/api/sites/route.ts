import { NextResponse } from "next/server";
import JSZip from "jszip";

export const runtime = "nodejs";

// ✅ CHANGE THIS to your worker URL
const WORKER_UPLOAD_URL =
    "https://calm-rice-1449.simplhost.workers.dev/upload";

export async function POST(req: Request) {
    try {
        const form = await req.formData();

        const file = form.get("file") as File;
        const subdomain = form.get("subdomain") as string;

        if (!file || !subdomain) {
            return NextResponse.json({ error: "Missing file or subdomain" }, { status: 400 });
        }

        // Convert file to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // ✅ Rebuild form-data for Worker
        const workerForm = new FormData();
        const blob = new Blob([buffer]);
        workerForm.append("subdomain", subdomain);
        workerForm.append("file", blob, file.name);

        // ✅ Send to Worker
        const uploadRes = await fetch(WORKER_UPLOAD_URL, {
            method: "POST",
            body: workerForm
        });

        const result = await uploadRes.json();

        if (!uploadRes.ok) {
            return NextResponse.json({ error: result }, { status: 500 });
        }

        // ✅ Save to Supabase
        await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/sites`,
            {
                method: "POST",
                headers: {
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                    "Content-Type": "application/json",
                    Prefer: "return=minimal"
                },
                body: JSON.stringify({
                    subdomain,
                    domain: `${subdomain}.simplhost.com`,
                    created_at: new Date().toISOString()
                })
            }
        );

        return NextResponse.json({
            success: true,
            url: `https://${subdomain}.simplhost.com`
        });

    } catch (err: any) {
        console.error("Upload failed:", err);
        return NextResponse.json(
            { error: err.message || "Upload failed" },
            { status: 500 }
        );
    }
}


export async function GET() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/sites?select=*`,
        {
            headers: {
                apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
        }
    );

    const data = await res.json();
    return NextResponse.json(data);
}
