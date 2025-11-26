import { NextResponse } from 'next/server';

export function middleware(request) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Check if it's a subdomain
    // We assume main domain is simplhost.com or localhost:3000
    // If it's NOT simplhost.com, www.simplhost.com, localhost:3000, then it's a subdomain (or custom domain)

    const isLocalhost = hostname.includes('localhost');
    const rootDomain = isLocalhost ? 'localhost:3000' : 'simplhost.com';

    // Clean hostname (remove port if not localhost logic, but localhost usually has port)
    // For localhost:3000, we want to check if it's sub.localhost:3000

    let isSubdomain = false;
    let subdomain = '';

    if (isLocalhost) {
        // sub.localhost:3000
        const parts = hostname.split('.');
        // localhost:3000 has 1 part (before :)? No, split by dot.
        // localhost is 1 part.
        // sub.localhost is 2 parts.
        if (parts.length > 1 && !hostname.startsWith('localhost')) {
            isSubdomain = true;
            subdomain = parts[0];
        }
    } else {
        // sub.simplhost.com
        if (hostname.endsWith('.simplhost.com') && hostname !== 'simplhost.com' && hostname !== 'www.simplhost.com') {
            isSubdomain = true;
            subdomain = hostname.replace('.simplhost.com', '');
        }
    }

    if (isSubdomain && subdomain) {
        // Rewrite to /sites/[subdomain]/[path]
        // We need to preserve the path
        const newUrl = new URL(`/sites/${subdomain}${url.pathname}`, request.url);
        return NextResponse.rewrite(newUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
