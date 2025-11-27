import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
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
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('files');
        const domain = formData.get('domain');
        const siteSettings = formData.get('siteSettings');

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        if (!domain) {
            return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
        }

        const projectId = domain;
        const link = buildSiteUrl(projectId, request);

        // Check if domain already exists
        const { data: existingSite } = await supabase
            .from('sites')
            .select('id')
            .eq('domain', projectId)
            .single();

        if (existingSite) {
            return NextResponse.json({ success: false, error: 'Domain already exists' }, { status: 409 });
        }

        const result = await processUploadedFile(file, projectId);

        if (!result.success) {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

        // Insert into Supabase
        const { data: newSite, error: insertError } = await supabase
            .from('sites')
            .insert({
                user_id: user.id,
                domain: projectId,
                link: link,
                status: 'active',
                file_type: result.type,
                settings: siteSettings ? JSON.parse(siteSettings) : {}
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
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
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error: ' + error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

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

        // Update in Supabase
        const updateData = {
            link: link,
            status: 'active',
            settings: siteSettings ? JSON.parse(siteSettings) : {}
        };

        if (fileType) {
            updateData.file_type = fileType;
        }

        const { data: updatedSite, error: updateError } = await supabase
            .from('sites')
            .update(updateData)
            .eq('domain', projectId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
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
