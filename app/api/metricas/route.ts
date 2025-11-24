import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDB, saveDB } from '@/lib/db';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId');

    if (!userIdCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userIdCookie.value;
    const db = getDB();
    const user = db.users.find(u => u.id === userId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { week, leadsExecuted, leadsQualified, meetings, proposals, closings } = body;

    const metricEntry = {
        id: `metric-${Date.now()}`,
        userId,
        role: user.role,
        week,
        leadsExecuted: leadsExecuted || 0,
        leadsQualified: leadsQualified || 0,
        meetings: meetings || 0,
        proposals: proposals || 0,
        closings: closings || 0,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
    };

    db.metricEntries.push(metricEntry);
    saveDB(db);

    return NextResponse.json({ success: true, entry: metricEntry });
}

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId');

    if (!userIdCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userIdCookie.value;
    const db = getDB();

    const userMetrics = db.metricEntries.filter(m => m.userId === userId);

    return NextResponse.json({ metrics: userMetrics });
}
