import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId');

    if (!userIdCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userIdCookie.value;

    // Verificar usuário no banco
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { week, leadsExecuted, leadsQualified, meetings, proposals, closings } = body;

    try {
        const metricEntry = await prisma.metricEntry.create({
            data: {
                userId,
                week,
                leadsExecuted: leadsExecuted || 0,
                leadsQualified: leadsQualified || 0,
                meetings: meetings || 0,
                proposals: proposals || 0,
                closings: closings || 0,
                status: 'PENDING'
            }
        });

        return NextResponse.json({ success: true, entry: metricEntry });
    } catch (error) {
        console.error('Error saving metric:', error);
        return NextResponse.json({ error: 'Failed to save metric' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId');

    if (!userIdCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userIdCookie.value;

    try {
        const userMetrics = await prisma.metricEntry.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ metrics: userMetrics });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }
}
