import { getDB } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default function RankingPage() {
    const db = getDB();

    const sdrRanking = db.users
        .filter(u => u.role === 'SDR')
        .map(u => {
            const commission = db.leadEntries
                .filter(e => e.userId === u.id)
                .reduce((acc, curr) => acc + (curr.leadsExecuted * db.config.leadExecutedValue) + (curr.leadsQualified * db.config.leadQualifiedValue), 0);
            return { ...u, commission };
        })
        .sort((a, b) => b.commission - a.commission);

    const closerRanking = db.users
        .filter(u => u.role === 'CLOSER')
        .map(u => {
            const totalSales = db.saleEntries
                .filter(e => e.userId === u.id)
                .reduce((acc, curr) => acc + curr.setupValue, 0);
            return { ...u, totalSales };
        })
        .sort((a, b) => b.totalSales - a.totalSales);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-8">Ranking Geral</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SDR Ranking */}
                <Card className="border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Trophy className="w-6 h-6" />
                            SDRs - Top Performers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sdrRanking.map((user, index) => (
                                <div key={user.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg",
                                            index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                                                index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                                                    index === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600" : "bg-secondary"
                                        )}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">SDR Elite</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl text-primary">R$ {user.commission.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">Comissão</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Closer Ranking */}
                <Card className="border-green-500/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-500">
                            <Trophy className="w-6 h-6" />
                            Closers - Top Performers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {closerRanking.map((user, index) => (
                                <div key={user.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg",
                                            index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                                                index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                                                    index === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600" : "bg-secondary"
                                        )}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">Closer Pro</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl text-green-500">R$ {user.totalSales.toLocaleString('pt-BR')}</p>
                                        <p className="text-xs text-muted-foreground">Vendido</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
