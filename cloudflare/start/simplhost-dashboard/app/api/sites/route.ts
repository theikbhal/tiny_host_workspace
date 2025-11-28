import { NextResponse } from "next/server";
import JSZip from "jszip";
import { createClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

// ✅ CHANGE THIS to your worker URL
const WORKER_UPLOAD_URL =
    "https://calm-rice-1449.simplhost.workers.dev/upload";

export async function POST(req: Request) {
    try {
        // Get user session
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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



        // ✅ Save to Supabase using authenticated client
        const { error: insertError } = await supabase
            .from("sites")
            .insert({
                user_id: session.user.id,
                domain: subdomain, // DB 'domain' column stores the subdomain
                link: `https://${subdomain}.simplhost.com`, // DB 'link' column stores full URL
                created_at: new Date().toISOString()
            });

        if (insertError) {
            console.error("Supabase insert failed:", insertError);
            // Return error to client so they know DB save failed
            return NextResponse.json(
                { error: "Site deployed but failed to save to database: " + insertError.message },
                { status: 500 }
            );
        }

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
    try {
        // Get user session
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch only user's sites
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/sites?user_id=eq.${session.user.id}&select=*&order=created_at.desc`,
            {
                headers: {
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                },
            }
        );

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: any) {
        console.error("Fetch sites failed:", err);
        return NextResponse.json(
            { error: err.message || "Failed to fetch sites" },
            { status: 500 }
        );
    }
}
