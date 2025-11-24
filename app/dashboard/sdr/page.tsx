'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoneyRain } from '@/components/ui/money-rain';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface HistoryEntry {
    id: string;
    week: string;
    leadsExecuted: number;
    leadsQualified: number;
    commission: number;
    createdAt: string;
}

export default function SDRPage() {
    const [loading, setLoading] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    // Form State
    const [leadsExecuted, setLeadsExecuted] = useState('');
    const [leadsQualified, setLeadsQualified] = useState('');
    const [week, setWeek] = useState(() => {
        const now = new Date();
        const onejan = new Date(now.getFullYear(), 0, 1);
        const weekNum = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
        return `${now.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
    });

    const [lastCommission, setLastCommission] = useState<number | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/sdr');
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
            const res = await fetch('/api/sdr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadsExecuted: Number(leadsExecuted),
                    leadsQualified: Number(leadsQualified),
                    week
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setLastCommission(data.commission);
                setShowAnimation(true);
                fetchHistory();
                setLeadsExecuted('');
                setLeadsQualified('');

                setTimeout(() => setShowAnimation(false), 5000);
            }
        } catch (error) {
            console.error('Failed to submit');
        } finally {
            setLoading(false);
        }
    };

    // Calculate estimated commission live
    const estimatedCommission = (Number(leadsExecuted) * 10) + (Number(leadsQualified) * 20);

    return (
        <div className="space-y-8">
            {showAnimation && <MoneyRain />}

            <div className="flex flex-col md:flex-row gap-6">
                {/* Input Form */}
                <Card className="flex-1 border-none shadow-xl">
                    <CardHeader>
                        <CardTitle>Painel SDR</CardTitle>
                        <CardDescription>Registre seus leads da semana para calcular sua comissão.</CardDescription>
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
                                    <label className="text-sm font-medium">Leads Executados (R$ 10,00)</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={leadsExecuted}
                                        onChange={(e) => setLeadsExecuted(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Leads Qualificados (R$ 20,00)</label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={leadsQualified}
                                        onChange={(e) => setLeadsQualified(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-secondary/50 p-4 rounded-xl flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Estimativa:</span>
                                <span className="text-2xl font-bold text-primary">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estimatedCommission)}
                                </span>
                            </div>

                            <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p>Certifique-se de que os dados conferem com o CRM. Caso contrário, o valor não será liberado.</p>
                            </div>

                            <Button type="submit" className="w-full text-lg h-12" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Calculando...
                                    </>
                                ) : (
                                    'Enviar dados da semana'
                                )}
                            </Button>
                        </form>

                        {lastCommission !== null && (
                            <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl text-center animate-in zoom-in duration-300">
                                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <h3 className="text-lg font-bold text-green-800">Dados enviados com sucesso!</h3>
                                <p className="text-green-700">
                                    Sua premiação de <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lastCommission)}</strong> foi registrada.
                                </p>
                                <p className="text-sm text-green-600 mt-1">Seu líder comercial já foi notificado. O valor estará na sua conta em até 48h.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Summary Card */}
                <Card className="md:w-80 h-fit border-none shadow-lg bg-gradient-to-b from-primary to-violet-800 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Resumo da Semana</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-violet-200 text-sm">Leads Executados</p>
                            <p className="text-3xl font-bold">
                                {history.filter(h => h.week === week).reduce((acc, curr) => acc + curr.leadsExecuted, 0)}
                            </p>
                        </div>
                        <div>
                            <p className="text-violet-200 text-sm">Leads Qualificados</p>
                            <p className="text-3xl font-bold">
                                {history.filter(h => h.week === week).reduce((acc, curr) => acc + curr.leadsQualified, 0)}
                            </p>
                        </div>
                        <div className="pt-4 border-t border-white/20">
                            <p className="text-violet-200 text-sm">Total a Receber</p>
                            <p className="text-3xl font-bold text-green-300">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                    history.filter(h => h.week === week).reduce((acc, curr) => acc + curr.commission, 0)
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* History Table */}
            <Card className="border-none shadow-lg">
                <CardHeader>
                    <CardTitle>Histórico de Lançamentos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Semana</th>
                                    <th className="px-4 py-3">Executados</th>
                                    <th className="px-4 py-3">Qualificados</th>
                                    <th className="px-4 py-3">Comissão</th>
                                    <th className="px-4 py-3 rounded-r-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((entry) => (
                                    <tr key={entry.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                                        <td className="px-4 py-3 font-medium">{entry.week}</td>
                                        <td className="px-4 py-3">{entry.leadsExecuted}</td>
                                        <td className="px-4 py-3">{entry.leadsQualified}</td>
                                        <td className="px-4 py-3 font-bold text-green-600">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.commission)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Pendente
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            Nenhum registro encontrado.
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
