'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Target, TrendingUp, CheckCircle2, Loader2, DollarSign, Calendar } from 'lucide-react';
import { useState } from 'react';
import { MoneyRain } from '@/components/ui/money-rain';
import { ProgressBar } from './ProgressBar';
import { DashboardBanner } from './DashboardBanner';
import { TopPerformers } from './TopPerformers';

interface SdrDashboardProps {
    data: any;
    user: any;
}

export function SdrDashboard({ data, user }: SdrDashboardProps) {
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [showMoneyRain, setShowMoneyRain] = useState(false);

    // Inputs
    const [shows, setShows] = useState(''); // Was leadsExecuted
    const [qualified, setQualified] = useState(''); // Was leadsQualified
    const [selectedWeek, setSelectedWeek] = useState('Semana Atual');

    // Logic Constants
    const VALUE_PER_SHOW = 10;
    const VALUE_PER_QUALIFIED = 20;

    // Calculate potential value based on current inputs
    const currentPotentialValue = (Number(shows) * VALUE_PER_SHOW) + (Number(qualified) * VALUE_PER_QUALIFIED);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate ClickUp Validation Flow
        setValidating(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2s mock delay
        setValidating(false);

        try {
            const res = await fetch('/api/sdr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadsExecuted: Number(shows), // Mapping Shows to Executed in DB for now
                    leadsQualified: Number(qualified),
                    week: selectedWeek
                }),
            });

            if (res.ok) {
                setShowMoneyRain(true);
                setTimeout(() => setShowMoneyRain(false), 5000);
                setShows('');
                setQualified('');
                alert('Métricas enviadas e validadas com sucesso! 🚀');
            }
        } catch (error) {
            alert('Erro ao enviar dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {showMoneyRain && <MoneyRain />}

            {/* Top Section: Progress Bar & Welcome */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Olá, {user.name} 👋</h1>
                        <p className="text-gray-300">Vamos bater a meta de hoje?</p>
                    </div>
                    <div className="bg-primary/20 px-4 py-2 rounded-full border border-primary/50">
                        <span className="text-primary font-bold flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            SDR Elite
                        </span>
                    </div>
                </div>

                <ProgressBar
                    current={data.userStats?.commission || 0}
                    target={2000}
                    label="Comissão Semanal"
                />
            </div>

            {/* Visual Dashboard Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <DashboardBanner />

                    <Card className="h-full border-primary/20 bg-gradient-to-br from-secondary/30 to-background">
                        <CardHeader>
                            <CardTitle className="text-primary text-2xl">Métricas</CardTitle>
                            <CardDescription className="text-gray-400">
                                Preencha seus resultados diários.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Week Selector */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Semana de Referência
                                        </label>
                                        <select
                                            className="flex h-12 w-full rounded-[20px] border border-white/10 bg-secondary/50 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                            value={selectedWeek}
                                            onChange={(e) => setSelectedWeek(e.target.value)}
                                        >
                                            <option>Semana Atual (24/11 - 30/11)</option>
                                            <option>Semana Passada (17/11 - 23/11)</option>
                                            <option>Próxima Semana (01/12 - 07/12)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Comparecimentos (Shows)</label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={shows}
                                                onChange={(e) => setShows(e.target.value)}
                                                required
                                                className="bg-secondary/50 border-white/10 focus:border-primary/50 pl-4"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-green-400 font-bold">
                                                + R$ 10,00
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Leads Qualificados</label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={qualified}
                                                onChange={(e) => setQualified(e.target.value)}
                                                required
                                                className="bg-secondary/50 border-white/10 focus:border-primary/50 pl-4"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-green-400 font-bold">
                                                + R$ 20,00
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Value Preview */}
                                <div className="bg-secondary/40 rounded-xl p-4 border border-white/5 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-400">Valor Disponível (Estimado)</p>
                                        <p className="text-xs text-gray-500 mt-1">*Liberado em até 48h após validação</p>
                                    </div>
                                    <div className="text-2xl font-bold text-green-400">
                                        R$ {currentPotentialValue.toFixed(2)}
                                    </div>
                                </div>

                                {validating ? (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-yellow-500 animate-pulse">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>VALIDANDO NO CRM (ClickUp)...</span>
                                    </div>
                                ) : (
                                    <Button type="submit" disabled={loading} className="w-full h-12 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrar Métricas'}
                                    </Button>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Top Performers */}
                <div className="space-y-6">
                    <TopPerformers
                        sdrRanking={data.rankings.sdr}
                        closerRanking={data.rankings.closer}
                    />
                </div>
            </div>
        </div>
    );
}
