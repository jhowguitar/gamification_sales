'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TopPerformers } from './TopPerformers';
import { DashboardBanner } from './DashboardBanner';
import { TrendingUp, Target, Calendar } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface InicioOverviewProps {
    data: any;
    user: any;
}

// Mock data for monthly evolution chart
const monthlyData = [
    { day: '01', value: 2500 },
    { day: '05', value: 5200 },
    { day: '10', value: 8100 },
    { day: '15', value: 12300 },
    { day: '20', value: 15800 },
    { day: '25', value: 18500 },
    { day: '30', value: 22000 },
];

export function InicioOverview({ data, user }: InicioOverviewProps) {
    // Calculate team totals
    const teamWeeklyTotal = data.rankings.sdr.reduce((acc: number, u: any) => acc + (u.commission || 0), 0) +
        data.rankings.closer.reduce((acc: number, u: any) => acc + (u.totalSales || 0), 0);

    const teamMonthlyTotal = teamWeeklyTotal * 4; // Simplified calculation

    const weeklyGoal = data.config.weeklyGoal;
    const monthlyGoal = data.config.monthlyGoal;

    const weeklyRemaining = Math.max(0, weeklyGoal - teamWeeklyTotal);
    const monthlyRemaining = Math.max(0, monthlyGoal - teamMonthlyTotal);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Welcome Section */}
            <motion.div variants={itemVariants} className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-foreground">Olá, {user.name} 👋</h1>
                    <p className="text-muted-foreground mt-2">Acompanhe o desempenho da equipe em tempo real</p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/30">
                    <span className="text-primary font-bold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </motion.div>

            {/* Goals Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Meta Semanal Restante
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-foreground">
                                    R$ {weeklyRemaining.toLocaleString('pt-BR')}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    De R$ {weeklyGoal.toLocaleString('pt-BR')} • {((teamWeeklyTotal / weeklyGoal) * 100).toFixed(1)}% atingido
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2 mt-3">
                                    <motion.div
                                        className="bg-primary h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (teamWeeklyTotal / weeklyGoal) * 100)}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-background hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-green-600 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Meta Mensal Restante
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-3xl font-bold text-foreground">
                                    R$ {monthlyRemaining.toLocaleString('pt-BR')}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    De R$ {monthlyGoal.toLocaleString('pt-BR')} • {((teamMonthlyTotal / monthlyGoal) * 100).toFixed(1)}% atingido
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2 mt-3">
                                    <motion.div
                                        className="bg-green-600 h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (teamMonthlyTotal / monthlyGoal) * 100)}%` }}
                                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Monthly Evolution Chart */}
            <motion.div variants={itemVariants}>
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Evolução do Mês
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <XAxis
                                    dataKey="day"
                                    stroke="#6F6A80"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#6F6A80"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `R$ ${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #E7DFFC',
                                        borderRadius: '12px',
                                        padding: '8px 12px'
                                    }}
                                    formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8F4BFF"
                                    strokeWidth={3}
                                    dot={{ fill: '#8F4BFF', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Banner */}
            <motion.div variants={itemVariants}>
                <DashboardBanner />
            </motion.div>

            {/* Rankings */}
            <motion.div variants={itemVariants}>
                <TopPerformers
                    sdrRanking={data.rankings.sdr}
                    closerRanking={data.rankings.closer}
                />
            </motion.div>
        </motion.div>
    );
}
