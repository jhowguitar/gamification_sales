import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import {
    calculateSDRLevel,
    calculateCloserLevel,
    calculateSDRCommission,
    calculateCloserCommissionWithBonus
} from '@/lib/gamification';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId');

    if (!userIdCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userIdCookie.value;

    // Buscar usuário e config
    const [user, config] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.config.findFirst()
    ]);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!config) {
        return NextResponse.json({ error: 'Config not found' }, { status: 500 });
    }

    const body = await request.json();

    try {
        let commission = 0;
        let metricEntry;

        if (user.role === 'SDR') {
            const { week, leadsExecuted, leadsQualified } = body;

            // Calcular comissão baseada no nível atual
            commission = calculateSDRCommission(
                Number(leadsExecuted),
                Number(leadsQualified),
                user.level,
                config
            );

            // Criar entrada de métrica
            metricEntry = await prisma.metricEntry.create({
                data: {
                    userId,
                    week,
                    leadsExecuted: Number(leadsExecuted) || 0,
                    leadsQualified: Number(leadsQualified) || 0,
                    commission,
                    status: 'PENDING'
                }
            });

            // Atualizar total de comissão do usuário
            const newTotalCommission = Number(user.totalCommission) + commission;

            // Calcular novo nível
            const newLevel = calculateSDRLevel(newTotalCommission);

            // Atualizar usuário
            await prisma.user.update({
                where: { id: userId },
                data: {
                    totalCommission: newTotalCommission,
                    level: newLevel
                }
            });

        } else if (user.role === 'CLOSER') {
            const { week, clientName, saleValue, paymentMethod, installments, baseCommission } = body;

            const saleValueNum = Number(saleValue) || 0;
            const baseCommissionNum = Number(baseCommission) || 0;

            // Atualizar total de vendas do usuário
            const newTotalSales = Number(user.totalSales) + saleValueNum;

            // Calcular comissão com bônus
            commission = calculateCloserCommissionWithBonus(
                baseCommissionNum,
                newTotalSales,
                config
            );

            // Calcular novo nível
            const newLevel = calculateCloserLevel(newTotalSales);

            // Criar entrada de métrica
            metricEntry = await prisma.metricEntry.create({
                data: {
                    userId,
                    week,
                    clientName,
                    saleValue: saleValueNum,
                    paymentMethod,
                    installments: Number(installments) || null,
                    commission,
                    status: 'PENDING'
                }
            });

            // Atualizar usuário
            await prisma.user.update({
                where: { id: userId },
                data: {
                    totalSales: newTotalSales,
                    totalCommission: Number(user.totalCommission) + commission,
                    level: newLevel
                }
            });
        }

        return NextResponse.json({
            success: true,
            entry: metricEntry,
            commission,
            newLevel: user.level
        });
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
