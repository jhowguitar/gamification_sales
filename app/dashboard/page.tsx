import { getDB } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
    // In a real app, we might fetch from an API, but here we can access DB directly
    // since this is a Server Component.
    const db = getDB();

    // Calculate rankings
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

    const totalSalesMonth = db.saleEntries.reduce((acc, curr) => acc + curr.setupValue, 0);

    return {
        rankings: { sdr: sdrRankings, closer: closerRankings },
        goals: {
            monthly: { target: db.config.monthlyGoal, current: totalSalesMonth },
            weekly: { target: db.config.weeklyGoal, current: totalSalesMonth } // Simplified
        },
        ceoMessage: db.ceoMessage,
        awardsBanner: db.awardsBanner
    };
}

export default async function DashboardPage() {
    const data = await getDashboardData();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header & Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Mural de Vendas</h1>
                    <p className="text-muted-foreground">Acompanhe o progresso e as metas do time.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-green-700">Sistema Online</span>
                </div>
            </div>

            {/* Goals Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-none shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium text-violet-100">Meta Mensal</CardTitle>
                        <Target className="w-5 h-5 text-violet-200" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.goals.monthly.current)}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-violet-200">
                                <span>Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.goals.monthly.target)}</span>
                                <span>{Math.round((data.goals.monthly.current / data.goals.monthly.target) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min((data.goals.monthly.current / data.goals.monthly.target) * 100, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-violet-200 mt-2">
                                Falta {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.max(0, data.goals.monthly.target - data.goals.monthly.current))}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium text-muted-foreground">Meta Semanal</CardTitle>
                        <TrendingUp className="w-5 h-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-foreground mb-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.goals.weekly.current)}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.goals.weekly.target)}</span>
                                <span>{Math.round((data.goals.weekly.current / data.goals.weekly.target) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min((data.goals.weekly.current / data.goals.weekly.target) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Rankings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-lg overflow-hidden">
                    <CardHeader className="bg-secondary/50 pb-4">
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Top SDRs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {data.rankings.sdr.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md",
                                            index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                                        )}>
                                            {index + 1}
                                        </div>
                                        {index === 0 && <div className="absolute -top-1 -right-1 text-xs">👑</div>}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{item.user.name}</p>
                                        <p className="text-xs text-muted-foreground">SDR</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary">{item.score}</p>
                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg overflow-hidden">
                    <CardHeader className="bg-secondary/50 pb-4">
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-500" />
                            Top Closers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {data.rankings.closer.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md",
                                            index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                                        )}>
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{item.user.name}</p>
                                        <p className="text-xs text-muted-foreground">Closer</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(item.score)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* CEO Message & Awards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-none shadow-lg bg-gradient-to-r from-white to-purple-50">
                    <CardHeader>
                        <CardTitle>📢 Recado do CEO</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="prose prose-purple max-w-none"
                            dangerouslySetInnerHTML={{ __html: data.ceoMessage }}
                        />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg overflow-hidden relative group">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10" />
                    <Image
                        src={data.awardsBanner.imageUrl}
                        alt="Awards"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="relative z-20 h-full flex flex-col justify-end p-6 text-white">
                        <h3 className="text-xl font-bold mb-1">{data.awardsBanner.title}</h3>
                        <p className="text-sm text-white/90">{data.awardsBanner.description}</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
