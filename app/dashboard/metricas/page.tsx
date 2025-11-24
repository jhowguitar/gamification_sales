'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Loader2, TrendingUp, Target } from 'lucide-react';

export default function MetricasPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [validating, setValidating] = useState(false);

    // SDR fields
    const [selectedWeek, setSelectedWeek] = useState('Semana Atual (24/11 - 30/11)');
    const [shows, setShows] = useState('');
    const [qualified, setQualified] = useState('');

    // Closer fields
    const [clientName, setClientName] = useState('');
    const [setupValue, setSetupValue] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('PIX');
    const [installments, setInstallments] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/dashboard');
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                if (!res.ok) {
                    throw new Error('Failed to fetch user');
                }
                const json = await res.json();
                console.log('User loaded:', json.user);
                setUser(json.user);
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    const handleSdrSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setValidating(true);

        await new Promise(resolve => setTimeout(resolve, 2000));
        setValidating(false);

        try {
            const res = await fetch('/api/sdr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadsExecuted: Number(shows),
                    leadsQualified: Number(qualified),
                    week: selectedWeek
                }),
            });

            if (res.ok) {
                alert('Métricas enviadas e validadas com sucesso! 🚀');
                setShows('');
                setQualified('');
            } else {
                alert('Erro ao registrar métricas.');
            }
        } catch (error) {
            alert('Erro ao enviar dados.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setValidating(true);

        await new Promise(resolve => setTimeout(resolve, 2000));
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
                    alert('PARABÉNS! Meta batida! 🎉');
                } else {
                    alert('Venda registrada e validada com sucesso! 🚀');
                }

                setClientName('');
                setSetupValue('');
                setInstallments('');
                setPaymentMethod('PIX');
            } else {
                alert('Erro ao registrar venda.');
            }
        } catch (error) {
            alert('Erro ao enviar dados.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">Erro ao carregar dados do usuário.</p>
                        <Button onClick={() => router.push('/login')} className="mt-4">
                            Fazer Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (user.role === 'CEO' || user.role === 'LEADER') {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">CEO e Líderes não têm acesso à página de Métricas.</p>
                        <Button onClick={() => router.push('/dashboard')} className="mt-4">
                            Voltar ao Início
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const VALUE_PER_SHOW = 10;
    const VALUE_PER_QUALIFIED = 20;
    const currentPotentialValue = (Number(shows) * VALUE_PER_SHOW) + (Number(qualified) * VALUE_PER_QUALIFIED);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {showMoneyRain && <MoneyRain />}
            {showConfetti && <Confetti />}

            <div>
                <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
                <p className="text-muted-foreground">Preencha seus resultados {user.role === 'SDR' ? 'de prospecção' : 'de vendas'}</p>
            </div>

            {user.role === 'SDR' && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                    <CardHeader>
                        <CardTitle className="text-primary text-2xl flex items-center gap-2">
                            <Target className="w-6 h-6" />
                            Métricas de SDR
                        </CardTitle>
                        <CardDescription>
                            Preencha seus resultados diários de prospecção
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSdrSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Semana de Referência *
                                </label>
                                <select
                                    className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    value={selectedWeek}
                                    onChange={(e) => setSelectedWeek(e.target.value)}
                                    required
                                >
                                    <option>Semana Atual (24/11 - 30/11)</option>
                                    <option>Semana Passada (17/11 - 23/11)</option>
                                    <option>Próxima Semana (01/12 - 07/12)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Comparecimentos (Shows) *</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={shows}
                                            onChange={(e) => setShows(e.target.value)}
                                            required
                                            className="pr-24"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-green-600 font-bold">
                                            + R$ 10,00
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Leads Qualificados *</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={qualified}
                                            onChange={(e) => setQualified(e.target.value)}
                                            required
                                            className="pr-24"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-green-600 font-bold">
                                            + R$ 20,00
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-secondary/40 rounded-xl p-4 border border-border flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">Valor Disponível (Estimado)</p>
                                    <p className="text-xs text-muted-foreground mt-1">*Liberado em até 48h após validação</p>
                                </div>
                                <div className="text-2xl font-bold text-green-600">
                                    R$ {currentPotentialValue.toFixed(2)}
                                </div>
                            </div>

                            {validating ? (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-yellow-600 animate-pulse">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>VALIDANDO NO CRM (ClickUp)...</span>
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

            {user.role === 'CLOSER' && (
                <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-background">
                    <CardHeader>
                        <CardTitle className="text-green-600 text-2xl flex items-center gap-2">
                            <TrendingUp className="w-6 h-6" />
                            Métricas de Closer
                        </CardTitle>
                        <CardDescription>
                            Preencha os dados do fechamento. Validação automática via ClickUp.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCloserSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Nome do Lead *</label>
                                    <Input
                                        placeholder="Ex: Empresa ABC Ltda"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Valor Setup (R$) *</label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={setupValue}
                                        onChange={(e) => setSetupValue(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Forma de Pagamento *</label>
                                    <select
                                        className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="PIX">PIX</option>
                                        <option value="CREDIT_CARD">Cartão de Crédito</option>
                                    </select>
                                </div>

                                {paymentMethod === 'CREDIT_CARD' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <label className="text-sm font-medium text-foreground">Parcelas *</label>
                                        <select
                                            className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
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
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-yellow-600 animate-pulse">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>VALIDANDO NO CRM (ClickUp)...</span>
                                </div>
                            ) : (
                                <Button type="submit" disabled={submitting} className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Venda'}
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
