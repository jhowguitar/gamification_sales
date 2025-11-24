import { NextResponse } from 'next/server';
import { getDB, saveDB, LeadEntry } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { leadsExecuted, leadsQualified, week } = body;
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = getDB();

        // Create new entry
        const newEntry: LeadEntry = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            week,
            leadsExecuted: Number(leadsExecuted),
            leadsQualified: Number(leadsQualified),
            createdAt: new Date().toISOString()
        };

        db.leadEntries.push(newEntry);
        saveDB(db);

        // Calculate commission for this entry
        const commission = (newEntry.leadsExecuted * db.config.leadExecutedValue) +
            (newEntry.leadsQualified * db.config.leadQualifiedValue);

        return NextResponse.json({ success: true, commission });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = getDB();
        const entries = db.leadEntries.filter(e => e.userId === userId);

        // Calculate total commission for each entry
        const history = entries.map(e => ({
            ...e,
            commission: (e.leadsExecuted * db.config.leadExecutedValue) + (e.leadsQualified * db.config.leadQualifiedValue)
        }));

        return NextResponse.json(history);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
