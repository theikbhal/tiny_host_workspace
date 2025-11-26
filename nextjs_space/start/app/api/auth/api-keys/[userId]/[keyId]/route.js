import { NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/db';

export async function DELETE(request, { params }) {
    try {
        const { userId, keyId } = await params;

        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        if (!users[userIndex].apiKeys) {
            return NextResponse.json({ success: false, error: 'Key not found' }, { status: 404 });
        }

        const initialLength = users[userIndex].apiKeys.length;
        users[userIndex].apiKeys = users[userIndex].apiKeys.filter(k => k.id !== keyId);

        if (users[userIndex].apiKeys.length === initialLength) {
            return NextResponse.json({ success: false, error: 'Key not found' }, { status: 404 });
        }

        writeUsers(users);

        return NextResponse.json({
            success: true,
            message: 'API key deleted successfully'
        });

    } catch (error) {
        console.error('Delete API key error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
