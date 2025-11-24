import { NextResponse } from 'next/server';
import { getDB, saveDB, GoalConfig } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { config, ceoMessage, awardsBanner } = body;

        // Auth check: Only CEO/Admin
        const cookieStore = await cookies();
        const currentUserId = cookieStore.get('userId')?.value;
        const db = getDB();
        const currentUser = db.users.find(u => u.id === currentUserId);

        if (!currentUser || currentUser.role !== 'CEO') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (config) db.config = config;
        if (ceoMessage) db.ceoMessage = ceoMessage;
        if (awardsBanner) db.awardsBanner = awardsBanner;

        saveDB(db);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    const db = getDB();
    return NextResponse.json({
        config: db.config,
        ceoMessage: db.ceoMessage,
        awardsBanner: db.awardsBanner
    });
}
