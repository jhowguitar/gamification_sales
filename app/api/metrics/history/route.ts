import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDB } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // 0-11
    const year = searchParams.get('year');

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

    let metrics = db.metricEntries;

    // Filter by User (unless CEO, who sees all - but user asked for "Login de cada SDR", implying they see theirs)
    // The requirement says: "CEO pode acessar o histórico de todos."
    if (user.role !== 'CEO') {
        metrics = metrics.filter(m => m.userId === userId);
    }

    // Filter by Date
    if (month && year) {
        metrics = metrics.filter(m => {
            const date = new Date(m.createdAt);
            return date.getMonth() === parseInt(month) && date.getFullYear() === parseInt(year);
        });
    }

    // Sort by date desc
    metrics.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ metrics });
}
