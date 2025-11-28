import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    // If there's a code, use PKCE flow
    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error("Auth error:", error);
            return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
        }

        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If no code, tokens might be in hash (implicit flow)
    // Redirect to a client-side page to handle hash tokens
    return NextResponse.redirect(new URL("/auth/callback/client", req.url));
}
