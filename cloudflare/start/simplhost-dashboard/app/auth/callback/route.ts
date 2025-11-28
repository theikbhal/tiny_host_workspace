import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);

    const code = url.searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(new URL("/login?error=no_code", req.url));
    }

    // After Supabase login, just redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
}
