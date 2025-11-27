import { NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request) {
    // Update session for Supabase Auth
    const response = await updateSession(request);

    // Existing Subdomain Logic
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    const isLocalhost = hostname.includes('localhost');

    let isSubdomain = false;
    let subdomain = '';

    if (isLocalhost) {
        const parts = hostname.split('.');
        if (parts.length > 1 && !hostname.startsWith('localhost')) {
            isSubdomain = true;
            subdomain = parts[0];
        }
    } else {
        if (hostname.endsWith('.simplhost.com') && hostname !== 'simplhost.com' && hostname !== 'www.simplhost.com') {
            isSubdomain = true;
            subdomain = hostname.replace('.simplhost.com', '');
        }
    }

    if (isSubdomain && subdomain) {
        const newUrl = new URL(`/sites/${subdomain}${url.pathname}`, request.url);
        return NextResponse.rewrite(newUrl);
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
