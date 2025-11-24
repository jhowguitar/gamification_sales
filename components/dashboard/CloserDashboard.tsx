'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Target, TrendingUp, Loader2, DollarSign, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { Confetti } from '@/components/ui/confetti';

interface CloserDashboardProps {
    data: any;
    user: any;
}

export function CloserDashboard({ data, user }: CloserDashboardProps) {
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Form states
    const [meetings, setMeetings] = useState('');
    const [proposals, setProposals] = useState('');
    const [clientName, setClientName] = useState('');
    const [setupValue, setSetupValue] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('PIX');

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
                    // meetings and proposals would be tracked too
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
                setMeetings('');
                setProposals('');
            }
        } catch (error) {
            alert('Erro ao enviar dados.');
        } finally {
            setLoading(false);
        }
    };

    // Filter ranking to show only Closers
    const closerRanking = data.rankings.closer;

    return (
        <div className="space-y-8">
            {showConfetti && <Confetti />}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Olá, {user.name} 👋</h1>
                    <p className="text-muted-foreground">Foco no fechamento!</p>
                </div>
                <div className="bg-green-500/20 px-4 py-2 rounded-full border border-green-500/50">
                    <span className="text-green-500 font-bold flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Nível: Closer Pro
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Module */}
                <div className="lg:col-span-2">
                    <Card className="h-full border-green-500/20">
                        <CardHeader>
                            <CardTitle>Inserir Métricas de Fechamento</CardTitle>
                            <CardDescription>
                                Certifique-se que os dados conferem com o CRM, o sistema fará double-check automático.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Reuniões Feitas</label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={meetings}
                                            onChange={(e) => setMeetings(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Propostas Enviadas</label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={proposals}
                                            onChange={(e) => setProposals(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-4 mt-4">
                                    <h3 className="text-sm font-bold mb-4 text-green-400">Novo Fechamento</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Nome do Cliente</label>
                                            <Input
                                                placeholder="Empresa X"
                                                value={clientName}
                                                onChange={(e) => setClientName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Valor Setup (R$)</label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={setupValue}
                                                onChange={(e) => setSetupValue(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium">Forma de Pagamento</label>
                                            <select
                                                className="flex h-12 w-full rounded-[20px] border border-input bg-secondary/50 px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            >
                                                <option value="PIX">PIX</option>
                                                <option value="CREDIT_CARD">Cartão de Crédito</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {validating ? (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-yellow-500 animate-pulse">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>VALIDANDO NO CRM (ClickUp)...</span>
                                    </div>
                                ) : (
                                    <Button type="submit" disabled={loading} className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrar Venda'}
                                    </Button>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats & Ranking */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Vendas na Semana</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-500 flex items-center gap-2">
                                <DollarSign className="w-6 h-6" />
                                R$ {data.userStats?.totalSales?.toLocaleString('pt-BR') || '0,00'}
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Meta Semanal</span>
                                    <span>{((data.userStats?.totalSales || 0) / 17000 * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-500"
                                        style={{ width: `${Math.min(((data.userStats?.totalSales || 0) / 17000 * 100), 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Alvo: R$ 17.000,00</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Ranking Closers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {closerRanking.map((u: any, index: number) => (
                                    <div key={u.id} className={`flex items-center justify-between p-3 rounded-xl ${u.id === user.id ? 'bg-green-500/20 border border-green-500/50' : 'bg-secondary/30'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="font-bold text-muted-foreground">#{index + 1}</div>
                                            <div>
                                                <p className="font-medium">{u.name}</p>
                                                <p className="text-xs text-muted-foreground">{u.salesCount} vendas</p>
                                            </div>
                                        </div>
                                        <div className="font-bold text-green-400">R$ {u.totalSales.toLocaleString('pt-BR')}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
