'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Crown, Medal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TopPerformersProps {
    sdrRanking: any[];
    closerRanking: any[];
}

export function TopPerformers({ sdrRanking, closerRanking }: TopPerformersProps) {
    const renderTop3 = (ranking: any[], type: 'SDR' | 'CLOSER') => {
        return (
            <div className="space-y-4">
                {ranking.slice(0, 3).map((user, index) => (
                    <div
                        key={user.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${index === 0
                                ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                : 'bg-secondary/30 border-white/5'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar className={`w-10 h-10 border-2 ${index === 0 ? 'border-yellow-500' : index === 1 ? 'border-gray-400' : 'border-orange-500'
                                    }`}>
                                    <AvatarImage src={user.avatarUrl} />
                                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {index === 0 && (
                                    <div className="absolute -top-2 -right-1 text-yellow-500 animate-bounce">
                                        <Crown className="w-4 h-4 fill-current" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${index === 0 ? 'text-yellow-500' : 'text-white'}`}>
                                    {user.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {type === 'SDR' ? `${user.leads} Leads` : `${user.salesCount} Vendas`}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`font-bold ${type === 'CLOSER' ? 'text-green-400' : 'text-primary'}`}>
                                {type === 'CLOSER'
                                    ? `R$ ${user.totalSales.toLocaleString('pt-BR')}`
                                    : `R$ ${user.commission.toFixed(0)}`
                                }
                            </div>
                            {index === 0 && <span className="text-[10px] text-yellow-500 font-bold uppercase">Líder</span>}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-gradient-to-b from-secondary/50 to-background">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Trophy className="w-5 h-5" />
                        Top SDRs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {renderTop3(sdrRanking, 'SDR')}
                </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-gradient-to-b from-secondary/50 to-background">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-green-500">
                        <Medal className="w-5 h-5" />
                        Top Closers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {renderTop3(closerRanking, 'CLOSER')}
                </CardContent>
            </Card>
        </div>
    );
}
