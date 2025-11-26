import { NextResponse } from 'next/server';
import { readSites, writeSites } from '@/lib/db';
import { processUploadedFile } from '@/lib/file-utils';
import { v4 as uuidv4 } from 'uuid';

const BASE_SITE_DOMAIN = process.env.BASE_SITE_DOMAIN || 'simplhost.com';

function buildSiteUrl(projectId, req) {
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const host = `${projectId}.${BASE_SITE_DOMAIN}`;
    return `${proto}://${host}`;
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('files');
        const domain = formData.get('domain');
        const userId = formData.get('userId');
        const siteSettings = formData.get('siteSettings');

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const projectId = domain || uuidv4();
        const link = buildSiteUrl(projectId, request);

        const result = await processUploadedFile(file, projectId);

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

        const sites = readSites();
        const newSite = {
            id: projectId,
            userId: userId || null,
            domain: projectId,
            link: link,
            status: 'active',
            fileType: result.type,
            settings: siteSettings ? JSON.parse(siteSettings) : {},
            createdAt: new Date().toISOString()
        };

        sites.push(newSite);
        writeSites(sites);

        return NextResponse.json({
            success: true,
            data: {
                link: link,
                status: 'active',
                profile: {
                    quotaUsed: 5,
                    quotaLimit: 1024
                }
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error: ' + error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('files');
        const domain = formData.get('domain');
        const siteSettings = formData.get('siteSettings');

        if (!domain) {
            return NextResponse.json({ success: false, error: 'Domain is required for update' }, { status: 400 });
        }

        const projectId = domain;
        const link = buildSiteUrl(projectId, request);
        let fileType = null;

        if (file) {
            const result = await processUploadedFile(file, projectId);
            if (!result.success) {
                return NextResponse.json({ success: false, error: result.error }, { status: 500 });
            }
            fileType = result.type;
        }

        const sites = readSites();
        const siteIndex = sites.findIndex(s => s.domain === projectId);

        if (siteIndex !== -1) {
            sites[siteIndex] = {
                ...sites[siteIndex],
                link: link,
                status: 'active',
                fileType: fileType || sites[siteIndex].fileType,
                settings: siteSettings ? JSON.parse(siteSettings) : (sites[siteIndex].settings || {}),
                updatedAt: new Date().toISOString()
            };
            writeSites(sites);
        }

        return NextResponse.json({
            success: true,
            data: {
                link: link,
                status: 'active',
                profile: {
                    quotaUsed: 5,
                    quotaLimit: 1024
                }
            }
        });

    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error: ' + error.message }, { status: 500 });
    }
}
