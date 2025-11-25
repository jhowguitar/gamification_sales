'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarSticker } from '@/components/ui/avatar-sticker';
import { getLevelName, getLevelIcon, getLevelColor } from '@/lib/gamification';
import { Loader2, Trophy, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RankingPage() {
    const [loading, setLoading] = useState(true);
    const [sdrRanking, setSdrRanking] = useState<any[]>([]);
    const [closerRanking, setCloserRanking] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        fetchRanking();
    }, []);

    const fetchRanking = async () => {
        try {
            const res = await fetch('/api/dashboard');
            if (res.ok) {
                const data = await res.json();
                setSdrRanking(data.rankings?.sdr || []);
                setCloserRanking(data.rankings?.closer || []);
                setCurrentUser(data.user);
            }
        } catch (error) {
            console.error('Error fetching ranking:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const RankingCard = ({ user, position, type }: any) => {
        const levelColor = getLevelColor(user.level || 'STAR');
        const levelIcon = getLevelIcon(user.level || 'STAR');
        const levelName = getLevelName(user.level || 'STAR');
        const isCurrentUser = currentUser?.id === user.id;

        const value = type === 'SDR'
            ? user.totalCommission || user.commission || 0
            : user.totalSales || 0;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: position * 0.1 }}
                className={`
                    relative overflow-hidden rounded-xl border-2
                    ${isCurrentUser ? 'border-primary bg-primary/5' : 'border-border bg-card'}
                    ${position === 0 ? 'ring-4 ring-yellow-500/50' : ''}
                    ${position === 1 ? 'ring-4 ring-gray-400/50' : ''}
                    ${position === 2 ? 'ring-4 ring-orange-600/50' : ''}
                `}
            >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${levelColor} opacity-5`} />

                <div className="relative p-4 flex items-center gap-4">
                    {/* Position */}
                    <div className="flex-shrink-0">
                        {position < 3 ? (
                            <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center text-2xl
                                ${position === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : ''}
                                ${position === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : ''}
                                ${position === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' : ''}
                            `}>
                                {position === 0 ? '🥇' : position === 1 ? '🥈' : '🥉'}
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
                                {position + 1}
                            </div>
                        )}
                    </div>

                    {/* Avatar */}
                    <AvatarSticker stickerId={user.avatarSticker || 1} size="md" />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg truncate">{user.name}</h3>
                            {isCurrentUser && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                    Você
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <span>{levelIcon}</span>
                                <span className="font-medium">{levelName}</span>
                            </span>
                        </div>
                    </div>

                    {/* Value */}
                    <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                            R$ {value.toFixed(2).replace('.', ',')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {type === 'SDR' ? 'Comissão' : 'Vendas'}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
                    <Trophy className="w-10 h-10 text-yellow-500" />
                    Rankings
                </h1>
                <p className="text-muted-foreground">Veja quem está no topo!</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ranking SDR */}
                <Card className="border-blue-500/20">
                    <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <TrendingUp className="w-6 h-6 text-blue-500" />
                            Ranking SDR
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        {sdrRanking.length > 0 ? (
                            sdrRanking.map((user, index) => (
                                <RankingCard
                                    key={user.id}
                                    user={user}
                                    position={index}
                                    type="SDR"
                                />
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                Nenhum SDR cadastrado ainda
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Ranking Closer */}
                <Card className="border-purple-500/20">
                    <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <DollarSign className="w-6 h-6 text-purple-500" />
                            Ranking Closer
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        {closerRanking.length > 0 ? (
                            closerRanking.map((user, index) => (
                                <RankingCard
                                    key={user.id}
                                    user={user}
                                    position={index}
                                    type="CLOSER"
                                />
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                Nenhum Closer cadastrado ainda
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Legenda de Níveis */}
            <Card>
                <CardHeader>
                    <CardTitle>Níveis de Gamificação</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
                            <div className="text-3xl mb-2">⭐</div>
                            <h3 className="font-bold text-lg">Star</h3>
                            <p className="text-sm opacity-90">SDR: até R$ 2.500</p>
                            <p className="text-sm opacity-90">Closer: até 30k</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-lg">
                            <div className="text-3xl mb-2">🔥</div>
                            <h3 className="font-bold text-lg">Pro</h3>
                            <p className="text-sm opacity-90">SDR: até R$ 5.000</p>
                            <p className="text-sm opacity-90">Closer: 30k - 50k</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-4 rounded-lg">
                            <div className="text-3xl mb-2">👑</div>
                            <h3 className="font-bold text-lg">Elite</h3>
                            <p className="text-sm opacity-90">SDR: até R$ 10.000</p>
                            <p className="text-sm opacity-90">Closer: acima de 50k</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
