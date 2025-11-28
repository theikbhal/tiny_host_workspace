import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(new URL("/login?error=no_code", req.url));
    }

    const supabase = await createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        console.error("Auth error:", error);
        return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
}
