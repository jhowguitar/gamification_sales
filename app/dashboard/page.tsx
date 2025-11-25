import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { InicioOverview } from '@/components/dashboard/InicioOverview';

export const dynamic = 'force-dynamic';

async function getDashboardData(userId: string, role: string) {
    // Buscar config
    const config = await prisma.config.findFirst();

    // Buscar todos os usuários com seus totais
    const allUsers = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatarSticker: true,
            level: true,
            totalCommission: true,
            totalSales: true,
        }
    });

    // Ranking SDR
    const sdrRanking = allUsers
        .filter(u => u.role === 'SDR')
        .map(u => ({
            ...u,
            commission: Number(u.totalCommission),
            leads: 0 // Pode ser calculado se necessário
        }))
        .sort((a, b) => b.commission - a.commission);

    // Ranking Closer
    const closerRanking = allUsers
        .filter(u => u.role === 'CLOSER')
        .map(u => ({
            ...u,
            totalSales: Number(u.totalSales),
            salesCount: 0 // Pode ser calculado se necessário
        }))
        .sort((a, b) => b.totalSales - a.totalSales);

    // User stats
    const currentUser = allUsers.find(u => u.id === userId);
    let userStats = {};

    if (currentUser) {
        if (role === 'SDR') {
            userStats = { commission: Number(currentUser.totalCommission) };
        } else if (role === 'CLOSER') {
            userStats = { totalSales: Number(currentUser.totalSales) };
        }
    }

    return {
        rankings: {
            sdr: sdrRanking,
            closer: closerRanking
        },
        userStats,
        config: config || {
            weeklyGoal: 50000,
            monthlyGoal: 200000,
            ceoMessage: '<h1>Vamos bater a meta!</h1>',
            awardsBanner: {
                imageUrl: 'https://images.unsplash.com/photo-1533227297464-c751417b02b8',
                title: 'Prêmio do Mês',
                description: 'Um jantar no melhor restaurante da cidade!'
            }
        },
        ceoMessage: config?.ceoMessage || '<h1>Vamos bater a meta!</h1>',
        awardsBanner: {
            imageUrl: config?.awardsBannerImageUrl || 'https://images.unsplash.com/photo-1533227297464-c751417b02b8',
            title: config?.awardsBannerTitle || 'Prêmio do Mês',
            description: config?.awardsBannerDescription || 'Um jantar no melhor restaurante da cidade!'
        }
    };
}

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        redirect('/login');
    }

    const data = await getDashboardData(userId, user.role);

    return <InicioOverview data={data} user={user} />;
}
