import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's sites from Supabase
        const { data: sites, error } = await supabase
            .from('sites')
            .select('link')
            .eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: {
                links: sites ? sites.map(s => s.link) : [],
                quotaUsed: sites ? sites.length : 0,
                quotaLimit: 1024
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
