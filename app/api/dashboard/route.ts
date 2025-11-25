import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        // Buscar config
        const config = await prisma.config.findFirst();

        // Buscar todos os usuários
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
                avatarSticker: true,
                level: true,
                totalCommission: true,
                totalSales: true,
            }
        });

        // Converter Decimals para Number
        const users = allUsers.map(u => ({
            ...u,
            totalCommission: Number(u.totalCommission),
            totalSales: Number(u.totalSales)
        }));

        // Ranking SDR
        const sdrRankings = users
            .filter(u => u.role === 'SDR')
            .map(u => ({
                user: {
                    name: u.name,
                    avatarUrl: u.avatarUrl,
                    avatarSticker: u.avatarSticker,
                    level: u.level
                },
                score: u.totalCommission,
                label: 'Comissão'
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        // Ranking Closer
        const closerRankings = users
            .filter(u => u.role === 'CLOSER')
            .map(u => ({
                user: {
                    name: u.name,
                    avatarUrl: u.avatarUrl,
                    avatarSticker: u.avatarSticker,
                    level: u.level
                },
                score: u.totalSales,
                label: 'Vendas'
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        // Total de vendas
        const totalSalesMonth = users
            .filter(u => u.role === 'CLOSER')
            .reduce((acc, u) => acc + u.totalSales, 0);

        // Buscar usuário atual
        const currentUser = userId ? users.find(u => u.id === userId) : null;

        return NextResponse.json({
            rankings: {
                sdr: sdrRankings,
                closer: closerRankings
            },
            goals: {
                monthly: {
                    target: config?.monthlyGoal || 200000,
                    current: totalSalesMonth
                },
                weekly: {
                    target: config?.weeklyGoal || 50000,
                    current: totalSalesMonth
                }
            },
            user: currentUser,
            ceoMessage: config?.ceoMessage || '<h1>Vamos bater a meta!</h1>',
            awardsBanner: {
                imageUrl: config?.awardsBannerImageUrl || 'https://images.unsplash.com/photo-1533227297464-c751417b02b8',
                title: config?.awardsBannerTitle || 'Prêmio do Mês',
                description: config?.awardsBannerDescription || 'Um jantar no melhor restaurante da cidade!'
            }
        });
    } catch (error) {
        console.error('Dashboard API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
