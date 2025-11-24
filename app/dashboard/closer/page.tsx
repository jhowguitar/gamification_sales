'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Confetti } from '@/components/ui/confetti';
import { Loader2, Trophy, Target } from 'lucide-react';

interface SaleEntry {
    id: string;
    week: string;
    clientName: string;
    setupValue: number;
    paymentMethod: 'PIX' | 'CREDIT_CARD';
    installments?: number;
    createdAt: string;
}

export default function CloserPage() {
    const [loading, setLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [history, setHistory] = useState<SaleEntry[]>([]);
    const [bonusUnlocked, setBonusUnlocked] = useState(false);

    // Form State
    const [clientName, setClientName] = useState('');
    const [setupValue, setSetupValue] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
    const [installments, setInstallments] = useState('');
    const [week, setWeek] = useState(() => {
        const now = new Date();
        const onejan = new Date(now.getFullYear(), 0, 1);
        const weekNum = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
        return `${now.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
    });

    const WEEKLY_GOAL = 17000;
    const BONUS_VALUE = 500;

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/closer');
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Failed to fetch history');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/closer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName,
                    setupValue: Number(setupValue),
                    paymentMethod,
                    installments: paymentMethod === 'CREDIT_CARD' ? Number(installments) : undefined,
                    week
                }),
            });

            if (res.ok) {
                const data = await res.json();

                if (data.bonusUnlocked && !bonusUnlocked) {
                    setBonusUnlocked(true);
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 8000);
                }

                fetchHistory();
                setClientName('');
                setSetupValue('');
                setInstallments('');
            }
        } catch (error) {
            console.error('Failed to submit');
        } finally {
            setLoading(false);
        }
    };

    const currentWeekTotal = history
        .filter(h => h.week === week)
        .reduce((acc, curr) => acc + curr.setupValue, 0);

    const progress = Math.min((currentWeekTotal / WEEKLY_GOAL) * 100, 100);

    return (
        <div className="space-y-8">
            {showConfetti && <Confetti />}

            {/* Goal Progress */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-violet-900 to-primary text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Target className="w-32 h-32" />
                </div>
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Target className="w-6 h-6" /> Meta Semanal: R$ 17.000,00
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-violet-200 text-sm">Atingido</p>
                                <p className="text-4xl font-bold">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentWeekTotal)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-violet-200 text-sm">Falta</p>
                                <p className="text-xl font-semibold text-white/80">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.max(0, WEEKLY_GOAL - currentWeekTotal))}
                                </p>
                            </div>
                        </div>

                        <div className="h-4 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000 ease-out relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse" />
                            </div>
                        </div>

                        {currentWeekTotal >= WEEKLY_GOAL && (
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 animate-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-3">
                                    <Trophy className="w-8 h-8 text-yellow-400" />
                                    <div>
                                        <h3 className="font-bold text-lg text-yellow-400">Meta Batida!</h3>
                                        <p className="text-sm text-white">Bônus de <strong>R$ {BONUS_VALUE},00</strong> liberado.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Input Form */}
                <Card className="flex-1 border-none shadow-xl">
                    <CardHeader>
                        <CardTitle>Registrar Venda</CardTitle>
                        <CardDescription>Adicione suas vendas para atualizar a meta.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Semana</label>
                                    <Input
                                        type="week"
                                        value={week}
                                        onChange={(e) => setWeek(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cliente</label>
                                    <Input
                                        placeholder="Nome do cliente"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Valor Setup (R$)</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={setupValue}
                                        onChange={(e) => setSetupValue(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Forma de Pagamento</label>
                                    <select
                                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                                    >
                                        <option value="PIX">Pix</option>
                                        <option value="CREDIT_CARD">Cartão de Crédito</option>
                                    </select>
                                </div>
                                {paymentMethod === 'CREDIT_CARD' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Parcelas</label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={installments}
                                            onChange={(e) => setInstallments(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            <Button type="submit" className="w-full text-lg h-12" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Salvando...
                                    </>
                                ) : (
                                    'Adicionar Venda'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* History Table */}
            <Card className="border-none shadow-lg">
                <CardHeader>
                    <CardTitle>Vendas da Semana</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Cliente</th>
                                    <th className="px-4 py-3">Valor</th>
                                    <th className="px-4 py-3">Pagamento</th>
                                    <th className="px-4 py-3 rounded-r-lg">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.filter(h => h.week === week).map((entry) => (
                                    <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                                        <td className="px-4 py-3 font-medium">{entry.clientName}</td>
                                        <td className="px-4 py-3 font-bold text-green-600">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.setupValue)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                {entry.paymentMethod === 'CREDIT_CARD' ? `Cartão (${entry.installments}x)` : 'Pix'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                    </tr>
                                ))}
                                {history.filter(h => h.week === week).length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                            Nenhuma venda registrada nesta semana.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
