import { NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const { userId, name } = await request.json();

        if (!userId || !name) {
            return NextResponse.json({ success: false, error: 'User ID and key name are required' }, { status: 400 });
        }

        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const newKey = {
            id: uuidv4(),
            key: 'sk_' + uuidv4().replace(/-/g, ''),
            name: name,
            createdAt: new Date().toISOString()
        };

        if (!users[userIndex].apiKeys) {
            users[userIndex].apiKeys = [];
        }

        users[userIndex].apiKeys.push(newKey);
        writeUsers(users);

        return NextResponse.json({
            success: true,
            apiKey: newKey
        }, { status: 201 });

    } catch (error) {
        console.error('Create API key error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
