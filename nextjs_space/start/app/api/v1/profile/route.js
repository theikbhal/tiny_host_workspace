import { NextResponse } from 'next/server';
import { readSites } from '@/lib/db';

export async function GET() {
    try {
        const sites = readSites();
        return NextResponse.json({
            success: true,
            data: {
                links: sites.map(p => p.link),
                quotaUsed: 5,
                quotaLimit: 1024
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
