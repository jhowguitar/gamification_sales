'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, Users, Settings, DollarSign, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CeoDashboardProps {
    data: any;
}

export function CeoDashboard({ data }: CeoDashboardProps) {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        CEO Dashboard
                    </h1>
                    <p className="text-muted-foreground">Visão macro e controle estratégico.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/dashboard/admin?tab=users">
                        <Button variant="outline" className="gap-2">
                            <Users className="w-4 h-4" />
                            Gerenciar Usuários
                        </Button>
                    </Link>
                    <Link href="/dashboard/admin?tab=config">
                        <Button className="gap-2 bg-primary hover:bg-primary/90">
                            <Settings className="w-4 h-4" />
                            Configurações
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Financial & Macro Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento Mensal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 145.000,00</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" /> +12% vs mês anterior
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Prêmios Pagos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 12.450,00</div>
                        <p className="text-xs text-muted-foreground mt-1">Acumulado do mês</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">SDRs Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.rankings.sdr.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Performance média: 85%</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Closers Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.rankings.closer.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Taxa de conversão: 22%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Rankings Section (Dual View) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SDR Ranking */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Ranking SDRs
                        </CardTitle>
                        <CardDescription>Top performers em qualificação</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.rankings.sdr.map((user: any, index: number) => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-400" : "bg-primary/50"
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.leads} leads</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary">R$ {user.commission.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Closer Ranking */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Ranking Closers
                        </CardTitle>
                        <CardDescription>Top performers em vendas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.rankings.closer.map((user: any, index: number) => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-400" : "bg-primary/50"
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.salesCount} vendas</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-400">R$ {user.totalSales.toLocaleString('pt-BR')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts Section */}
            <Card className="border-red-900/20 bg-red-900/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                        Alertas de Inconsistência
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-red-900/20">
                            <span className="text-sm">Divergência de valor: Venda #1234 (Closer Pro)</span>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">Verificar</Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Sistema de Double Check automático via ClickUp.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
