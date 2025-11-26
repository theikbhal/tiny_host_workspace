import { NextResponse } from 'next/server';
import { readUsers, writeUsers, findUserByEmail } from '@/lib/db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ success: false, error: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: uuidv4(),
            email: email.toLowerCase(),
            password: hashedPassword,
            name: name || email.split('@')[0],
            createdAt: new Date().toISOString(),
            projects: [],
            apiKeys: []
        };

        const users = readUsers();
        users.push(newUser);

        if (!writeUsers(users)) {
            return NextResponse.json({ success: false, error: 'Failed to save user data' }, { status: 500 });
        }

        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({
            success: true,
            message: 'User registered successfully',
            user: userWithoutPassword
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
