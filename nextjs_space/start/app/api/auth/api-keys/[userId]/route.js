import { NextResponse } from 'next/server';
import { readUsers } from '@/lib/db';

export async function GET(request, { params }) {
    try {
        const { userId } = await params;

        const users = readUsers();
        const user = users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            apiKeys: user.apiKeys || []
        });

    } catch (error) {
        console.error('List API keys error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
