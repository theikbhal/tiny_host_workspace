import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function DELETE(req: Request) {
    try {
        // Get user session
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const subdomain = url.searchParams.get("subdomain");
        const id = url.searchParams.get("id");

        if (!subdomain || !id) {
            return NextResponse.json({ error: "Missing subdomain or id" }, { status: 400 });
        }

        // Delete from Supabase (only if user owns it)
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/sites?id=eq.${id}&user_id=eq.${session.user.id}`,
            {
                method: "DELETE",
                headers: {
                    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                },
            }
        );

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to delete from database" }, { status: 500 });
        }

        // TODO: Also delete from Cloudflare Worker storage if needed
        // For now, just delete from database

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Delete failed:", err);
        return NextResponse.json(
            { error: err.message || "Delete failed" },
            { status: 500 }
        );
    }
}
