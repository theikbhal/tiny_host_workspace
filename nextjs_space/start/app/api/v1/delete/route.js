import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import fs from 'fs';
import path from 'path';

const BASE_SITE_DOMAIN = process.env.BASE_SITE_DOMAIN || 'simplhost.com';
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export async function DELETE(request) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const domain = formData.get('domain');

        if (!domain) {
            return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
        }

        // Delete from Supabase
        const { error: deleteError } = await supabase
            .from('sites')
            .delete()
            .eq('domain', domain)
            .eq('user_id', user.id);

        if (deleteError) {
            return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
        }

        // Delete files from uploads directory
        const siteDir = path.join(UPLOADS_DIR, domain);
        if (fs.existsSync(siteDir)) {
            fs.rmSync(siteDir, { recursive: true, force: true });
        }

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
