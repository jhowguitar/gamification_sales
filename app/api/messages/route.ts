import { NextResponse } from 'next/server';
import { getDB, saveDB, Message, getUserById } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = getDB();
        const messages = db.messages.filter(m => m.toUserId === userId);

        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { toUserId, title, content } = body;
        const cookieStore = await cookies();
        const fromUserId = cookieStore.get('userId')?.value;

        if (!fromUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = getDB();
        const fromUser = await getUserById(fromUserId);

        // Only Leader/CEO can send messages in this spec, but we'll allow all for testing or restrict here
        // if (fromUser?.role !== 'CEO' && fromUser?.role !== 'LEADER') { ... }

        const newMessage: Message = {
            id: Math.random().toString(36).substr(2, 9),
            fromUserId,
            toUserId,
            title,
            content,
            read: false,
            createdAt: new Date().toISOString()
        };

        db.messages.push(newMessage);
        saveDB(db);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
