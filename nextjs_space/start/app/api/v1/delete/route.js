import { NextResponse } from 'next/server';
import { readSites, writeSites } from '@/lib/db';

const BASE_SITE_DOMAIN = process.env.BASE_SITE_DOMAIN || 'simplhost.com';

export async function DELETE(request) {
    try {
        const formData = await request.formData();
        const domain = formData.get('domain');

        if (!domain) {
            return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
        }

        const sites = readSites();
        const filteredSites = sites.filter(s => s.domain !== domain);
        writeSites(filteredSites);

        const deletedUrl = `https://${domain}.${BASE_SITE_DOMAIN}`;

        return NextResponse.json({
            success: true,
            data: {
                links: [deletedUrl],
                quotaUsed: 5,
                quotaLimit: 1024
            }
        });

    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
