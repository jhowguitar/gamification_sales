import { getDB, getUserById } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CeoDashboard } from '@/components/dashboard/CeoDashboard';
import { SdrDashboard } from '@/components/dashboard/SdrDashboard';
import { CloserDashboard } from '@/components/dashboard/CloserDashboard';

export const dynamic = 'force-dynamic';

async function getDashboardData(userId: string, role: string) {
    const db = getDB();

    // Calculate rankings (Shared logic, but filtered in view)
    const sdrRanking = db.users
        .filter(u => u.role === 'SDR')
        .map(u => {
            const leads = db.leadEntries
                .filter(e => e.userId === u.id)
                .reduce((acc, curr) => acc + curr.leadsExecuted, 0); // Simplified for ranking
            const commission = db.leadEntries
                .filter(e => e.userId === u.id)
                .reduce((acc, curr) => acc + (curr.leadsExecuted * db.config.leadExecutedValue) + (curr.leadsQualified * db.config.leadQualifiedValue), 0);
            return { ...u, leads, commission };
        })
        .sort((a, b) => b.commission - a.commission);

    const closerRanking = db.users
        .filter(u => u.role === 'CLOSER')
        .map(u => {
            const sales = db.saleEntries.filter(e => e.userId === u.id);
            const totalSales = sales.reduce((acc, curr) => acc + curr.setupValue, 0);
            return { ...u, totalSales, salesCount: sales.length };
        })
        .sort((a, b) => b.totalSales - a.totalSales);

    // User specific stats
    let userStats = {};
    if (role === 'SDR') {
        const myEntries = db.leadEntries.filter(e => e.userId === userId);
        const commission = myEntries.reduce((acc, curr) => acc + (curr.leadsExecuted * db.config.leadExecutedValue) + (curr.leadsQualified * db.config.leadQualifiedValue), 0);
        userStats = { commission };
    } else if (role === 'CLOSER') {
        const mySales = db.saleEntries.filter(e => e.userId === userId);
        const totalSales = mySales.reduce((acc, curr) => acc + curr.setupValue, 0);
        userStats = { totalSales };
    }

    return {
        rankings: {
            sdr: sdrRanking,
            closer: closerRanking
        },
        userStats,
        config: db.config,
        ceoMessage: db.ceoMessage,
        awardsBanner: db.awardsBanner
    };
}

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
        redirect('/login');
    }

    const user = await getUserById(userId);
    if (!user) {
        redirect('/login');
    }

    const data = await getDashboardData(userId, user.role);

    // Strict Role-Based Rendering
    if (user.role === 'CEO' || user.role === 'LEADER') {
        return <CeoDashboard data={data} />;
    } else if (user.role === 'SDR') {
        return <SdrDashboard data={data} user={user} />;
    } else if (user.role === 'CLOSER') {
        return <CloserDashboard data={data} user={user} />;
    } else {
        return <div>Role not recognized</div>;
    }
}
