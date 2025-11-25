'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Loader2, TrendingUp, Target, History, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { MoneyRain } from '@/components/ui/money-rain';
import { Confetti } from '@/components/ui/confetti';
import { useRouter } from 'next/navigation';
import { getLevelName, getLevelIcon } from '@/lib/gamification';

export default function MetricasPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [validating, setValidating] = useState(false);
    const [showMoneyRain, setShowMoneyRain] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [history, setHistory] = useState<any[]>([]);

    // SDR fields
    const [selectedWeek, setSelectedWeek] = useState('Semana Atual');
    const [shows, setShows] = useState('');
    const [qualified, setQualified] = useState('');

    // Closer fields
    const [clientName, setClientName] = useState('');
    const [saleValue, setSaleValue] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('PIX');
    const [installments, setInstallments] = useState('');
    const [baseCommission, setBaseCommission] = useState('');

    useEffect(() => {
        setIsClient(true);
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user, selectedDate]);

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const month = selectedDate.getMonth();
            const year = selectedDate.getFullYear();
            const res = await fetch(`/api/metrics/history?month=${month}&year=${year}`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data.metrics || []);
            }
        } catch (error) {
            console.error('Failed to fetch history', error);
        }
    };

    const handleSDRSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setValidating(true);

        await new Promise(resolve => setTimeout(resolve, 1500));
        setValidating(false);

        try {
            const res = await fetch('/api/metricas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    week: selectedWeek,
                    leadsExecuted: Number(shows),
                    leadsQualified: Number(qualified)
                })
            });

            if (res.ok) {
                const data = await res.json();
                setShowMoneyRain(true);
                setTimeout(() => setShowMoneyRain(false), 5000);
                alert(`Métricas registradas! Comissão: R$ ${data.commission.toFixed(2)}`);
                setShows('');
                setQualified('');
                fetchHistory();
                fetchUser(); // Atualizar nível
            } else {
                alert('Erro ao salvar métricas.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao conectar com o servidor.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setValidating(true);

        await new Promise(resolve => setTimeout(resolve, 1500));
        setValidating(false);

        try {
            const res = await fetch('/api/metricas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    week: selectedWeek,
                    clientName,
                    saleValue: Number(saleValue),
                    paymentMethod,
                    installments: Number(installments) || null,
                    baseCommission: Number(baseCommission)
                })
            });

            if (res.ok) {
                const data = await res.json();
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
                alert(`Venda registrada! Comissão com bônus: R$ ${data.commission.toFixed(2)}`);
                setClientName('');
                setSaleValue('');
                setBaseCommission('');
                setInstallments('');
                fetchHistory();
                fetchUser(); // Atualizar nível
            } else {
                alert('Erro ao salvar venda.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao conectar com o servidor.');
        } finally {
            setSubmitting(false);
        }
    };

    const changeMonth = (increment: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setSelectedDate(newDate);
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!user) return null;

    const totalCommission = history.reduce((acc, curr) => acc + (Number(curr.commission) || 0), 0);
    const levelIcon = getLevelIcon(user.level);
    const levelName = getLevelName(user.level);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {isClient && showMoneyRain && <MoneyRain />}
            {isClient && showConfetti && <Confetti />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Métricas - {user.role}</h1>
                    <p className="text-muted-foreground">Preencha seus resultados</p>
                </div>

                <div className="flex items-center gap-4 bg-card p-2 rounded-xl border border-border shadow-sm">
                    <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="font-medium min-w-[150px] text-center capitalize">
                        {formatMonth(selectedDate)}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => changeMonth(1)}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* RESUMO */}
                <div className="lg:col-span-1">
                    <div className="bg-[#7C3AED] text-white p-8 rounded-3xl shadow-xl sticky top-6">
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            <span>{levelIcon}</span>
                            <span>{user.role} {levelName}</span>
                        </h2>
                        <p className="text-purple-200 text-sm mb-6">Resumo do Mês</p>

                        <div className="space-y-6">
                            {user.role === 'SDR' && (
                                <>
                                    <div>
                                        <p className="text-purple-200 text-sm mb-1">Comparecimentos</p>
                                        <p className="text-4xl font-bold">{history.reduce((acc, curr) => acc + (curr.leadsExecuted || 0), 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-purple-200 text-sm mb-1">Qualificados</p>
                                        <p className="text-4xl font-bold">{history.reduce((acc, curr) => acc + (curr.leadsQualified || 0), 0)}</p>
                                    </div>
                                </>
                            )}
                            {user.role === 'CLOSER' && (
                                <div>
                                    <p className="text-purple-200 text-sm mb-1">Total em Vendas</p>
                                    <p className="text-4xl font-bold">R$ {Number(user.totalSales).toFixed(2).replace('.', ',')}</p>
                                </div>
                            )}
                            <div className="pt-6 border-t border-purple-400/30">
                                <p className="text-purple-200 text-sm mb-1">Comissão Total</p>
                                <p className="text-4xl font-bold text-[#4ADE80]">
                                    R$ {totalCommission.toFixed(2).replace('.', ',')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FORMULÁRIO E HISTÓRICO */}
                <div className="lg:col-span-2 space-y-8">
                    {/* FORMULÁRIO SDR */}
                    {user.role === 'SDR' && (
                        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                            <CardHeader>
                                <CardTitle className="text-primary text-2xl flex items-center gap-2">
                                    <Target className="w-6 h-6" />
                                    Métricas de SDR
                                </CardTitle>
                                <CardDescription>Preencha seus resultados de prospecção</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSDRSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Semana de Referência *
                                        </label>
                                        <Input
                                            value={selectedWeek}
                                            onChange={(e) => setSelectedWeek(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Comparecimentos (Shows) *</label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={shows}
                                                onChange={(e) => setShows(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Leads Qualificados *</label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={qualified}
                                                onChange={(e) => setQualified(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {validating ? (
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-yellow-600 animate-pulse">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>VALIDANDO NO CRM...</span>
                                        </div>
                                    ) : (
                                        <Button type="submit" disabled={submitting} className="w-full h-12 text-lg">
                                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrar Métricas'}
                                        </Button>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* FORMULÁRIO CLOSER */}
                    {user.role === 'CLOSER' && (
                        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-background">
                            <CardHeader>
                                <CardTitle className="text-green-600 text-2xl flex items-center gap-2">
                                    <DollarSign className="w-6 h-6" />
                                    Registrar Venda
                                </CardTitle>
                                <CardDescription>Preencha os dados da venda fechada</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCloserSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Semana de Referência *</label>
                                        <Input
                                            value={selectedWeek}
                                            onChange={(e) => setSelectedWeek(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Nome do Cliente *</label>
                                            <Input
                                                value={clientName}
                                                onChange={(e) => setClientName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Valor da Venda *</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={saleValue}
                                                onChange={(e) => setSaleValue(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Forma de Pagamento *</label>
                                            <select
                                                className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            >
                                                <option>PIX</option>
                                                <option>Cartão de Crédito</option>
                                                <option>Boleto</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Parcelas</label>
                                            <Input
                                                type="number"
                                                value={installments}
                                                onChange={(e) => setInstallments(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Comissão Base (R$) *</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={baseCommission}
                                            onChange={(e) => setBaseCommission(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {validating ? (
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-yellow-600 animate-pulse">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>VALIDANDO NO CRM...</span>
                                        </div>
                                    ) : (
                                        <Button type="submit" disabled={submitting} className="w-full h-12 text-lg">
                                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrar Venda'}
                                        </Button>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* HISTÓRICO */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                            <History className="w-5 h-5" />
                            <h3 className="font-medium">Histórico de Envios ({formatMonth(selectedDate)})</h3>
                        </div>
                        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                            {history.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                                            <tr>
                                                <th className="px-4 py-3">Data</th>
                                                {user.role === 'SDR' && (
                                                    <>
                                                        <th className="px-4 py-3">Shows</th>
                                                        <th className="px-4 py-3">Qualificados</th>
                                                    </>
                                                )}
                                                {user.role === 'CLOSER' && (
                                                    <>
                                                        <th className="px-4 py-3">Cliente</th>
                                                        <th className="px-4 py-3">Valor Venda</th>
                                                    </>
                                                )}
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-right">Comissão</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {history.map((entry) => (
                                                <tr key={entry.id} className="hover:bg-secondary/20 transition-colors">
                                                    <td className="px-4 py-3 font-medium">
                                                        {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
                                                    </td>
                                                    {user.role === 'SDR' && (
                                                        <>
                                                            <td className="px-4 py-3">{entry.leadsExecuted}</td>
                                                            <td className="px-4 py-3">{entry.leadsQualified}</td>
                                                        </>
                                                    )}
                                                    {user.role === 'CLOSER' && (
                                                        <>
                                                            <td className="px-4 py-3">{entry.clientName}</td>
                                                            <td className="px-4 py-3">R$ {Number(entry.saleValue).toFixed(2)}</td>
                                                        </>
                                                    )}
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${entry.status === 'VALIDATED' ? 'bg-green-100 text-green-700' :
                                                                entry.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {entry.status === 'VALIDATED' ? 'Validado' :
                                                                entry.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold text-green-600">
                                                        R$ {Number(entry.commission).toFixed(2).replace('.', ',')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-muted-foreground">
                                    Nenhum registro encontrado para este mês.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
