import { NextResponse } from 'next/server';
import { getDB, saveDB, SaleEntry } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { clientName, setupValue, paymentMethod, installments, week } = body;
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const db = getDB();

        // Create new entry
        const newEntry: SaleEntry = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            week,
            clientName,
            setupValue: Number(setupValue),
            paymentMethod,
            installments: installments ? Number(installments) : undefined,
            createdAt: new Date().toISOString()
        };

        db.saleEntries.push(newEntry);
        saveDB(db);

        // Check if weekly goal is met (Bonus Logic)
        // Sum all sales for this user in this week
        const userSalesThisWeek = db.saleEntries
            .filter(e => e.userId === userId && e.week === week)
            .reduce((acc, curr) => acc + curr.setupValue, 0);

        const bonusUnlocked = userSalesThisWeek >= db.config.closerBonusThreshold;

        return NextResponse.json({
            success: true,
            totalWeek: userSalesThisWeek,
            bonusUnlocked,
            bonusValue: bonusUnlocked ? db.config.closerBonusValue : 0
        });
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
        const entries = db.saleEntries.filter(e => e.userId === userId);

        return NextResponse.json(entries);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
