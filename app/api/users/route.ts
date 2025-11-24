import { NextResponse } from 'next/server';
import { getDB, saveDB, User, Role } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role, avatarUrl } = body;

        // Auth check: Only CEO/Admin can create users
        const cookieStore = await cookies();
        const currentUserId = cookieStore.get('userId')?.value;
        const db = getDB();
        const currentUser = db.users.find(u => u.id === currentUserId);

        if (!currentUser || currentUser.role !== 'CEO') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Check if email exists
        if (db.users.find(u => u.email === email)) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            password, // In real app, hash this
            role: role as Role,
            avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };

        db.users.push(newUser);
        saveDB(db);

        return NextResponse.json({ success: true, user: newUser });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
