'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Target, TrendingUp, Loader2, DollarSign, Briefcase, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Confetti } from '@/components/ui/confetti';
import { ProgressBar } from './ProgressBar';
import { DashboardBanner } from './DashboardBanner';
import { TopPerformers } from './TopPerformers';

interface CloserDashboardProps {
    data: any;
    user: any;
}

export function CloserDashboard({ data, user }: CloserDashboardProps) {
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Form states
    const [clientName, setClientName] = useState('');
    const [setupValue, setSetupValue] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('PIX');
    const [installments, setInstallments] = useState('');

    // Date Logic
    const currentDate = new Date();
    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
    // Simple week calculation mock
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
    const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 5));
    const dateDisplay = `${monthName}: Semana ${startOfWeek.getDate()} a ${endOfWeek.getDate()}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate ClickUp Validation Flow
        setValidating(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2s mock delay
        setValidating(false);

        try {
            const res = await fetch('/api/closer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName,
                    setupValue: Number(setupValue),
                    paymentMethod,
                    installments: paymentMethod === 'CREDIT_CARD' ? Number(installments) : 1,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.bonusEligible) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 8000);
                    alert('PARABÉNS! Meta batida! 🎉');
                } else {
                    alert('Venda registrada e validada com sucesso! 🚀');
                }

                // Reset form
                setClientName('');
                setSetupValue('');
                setInstallments('');
                setPaymentMethod('PIX');
            }
        } catch (error) {
            alert('Erro ao enviar dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {showConfetti && <Confetti />}

            {/* Top Section: Progress Bar & Welcome */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Olá, {user.name} 👋</h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="capitalize">{dateDisplay}</span>
                        </p>
                    </div>
                    <div className="bg-green-500/20 px-4 py-2 rounded-full border border-green-500/50">
                        <span className="text-green-500 font-bold flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Closer Pro
                        </span>
                    </div>
                </div>

                <ProgressBar
                    current={data.userStats?.totalSales || 0}
                    target={17000}
                    label="Meta Semanal"
                />
            </div>

            {/* Visual Dashboard Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <DashboardBanner />

                    <Card className="border-green-500/20 bg-gradient-to-br from-secondary/30 to-background">
                        <CardHeader>
                            <CardTitle className="text-green-400">Registrar Venda</CardTitle>
                            <CardDescription>
                                Preencha os dados do fechamento. Validação automática via ClickUp.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Nome do Lead</label>
                                        <Input
                                            placeholder="Ex: Empresa ABC Ltda"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            required
                                            className="bg-secondary/50 border-white/10 focus:border-green-500/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Valor Setup (R$)</label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={setupValue}
                                            onChange={(e) => setSetupValue(e.target.value)}
                                            required
                                            className="bg-secondary/50 border-white/10 focus:border-green-500/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Forma de Pagamento</label>
                                        <select
                                            className="flex h-12 w-full rounded-[20px] border border-white/10 bg-secondary/50 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        >
                                            <option value="PIX">PIX</option>
                                            <option value="CREDIT_CARD">Cartão de Crédito</option>
                                        </select>
                                    </div>

                                    {paymentMethod === 'CREDIT_CARD' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <label className="text-sm font-medium text-gray-300">Parcelas</label>
                                            <select
                                                className="flex h-12 w-full rounded-[20px] border border-white/10 bg-secondary/50 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                                                value={installments}
                                                onChange={(e) => setInstallments(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled>Selecione...</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                                    <option key={num} value={num}>{num}x</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {validating ? (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-yellow-500 animate-pulse">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>VALIDANDO NO CRM (ClickUp)...</span>
                                    </div>
                                ) : (
                                    <Button type="submit" disabled={loading} className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Venda'}
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
