import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }

        const user = findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
