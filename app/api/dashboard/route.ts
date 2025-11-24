import { NextResponse } from 'next/server';
import { getDB, User } from '@/lib/db';

export async function GET() {
    try {
        const db = getDB();

        // Calculate rankings
        // For SDRs: Score = (leadsExecuted * 10) + (leadsQualified * 20)
        // For Closers: Score = Total Sales Value

        const sdrRankings = db.users
            .filter(u => u.role === 'SDR')
            .map(u => {
                const entries = db.leadEntries.filter(e => e.userId === u.id);
                const totalExecuted = entries.reduce((acc, curr) => acc + curr.leadsExecuted, 0);
                const totalQualified = entries.reduce((acc, curr) => acc + curr.leadsQualified, 0);
                const score = (totalExecuted * db.config.leadExecutedValue) + (totalQualified * db.config.leadQualifiedValue);
                return {
                    user: { name: u.name, avatarUrl: u.avatarUrl },
                    score,
                    label: 'Pontos'
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        const closerRankings = db.users
            .filter(u => u.role === 'CLOSER')
            .map(u => {
                const entries = db.saleEntries.filter(e => e.userId === u.id);
                const totalSales = entries.reduce((acc, curr) => acc + curr.setupValue, 0);
                return {
                    user: { name: u.name, avatarUrl: u.avatarUrl },
                    score: totalSales,
                    label: 'Vendido'
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        // Calculate Goal Progress (Monthly)
        // Assuming we sum all sales for the month
        const totalSalesMonth = db.saleEntries.reduce((acc, curr) => acc + curr.setupValue, 0);

        return NextResponse.json({
            rankings: {
                sdr: sdrRankings,
                closer: closerRankings
            },
            goals: {
                monthly: {
                    target: db.config.monthlyGoal,
                    current: totalSalesMonth
                },
                weekly: {
                    target: db.config.weeklyGoal,
                    current: totalSalesMonth // Simplified: using same total for now, ideally filter by week
                }
            },
            ceoMessage: db.ceoMessage,
            awardsBanner: db.awardsBanner
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
