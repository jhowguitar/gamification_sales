'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Loader2, TrendingUp, Target, UserCircle } from 'lucide-react';
import { MoneyRain } from '@/components/ui/money-rain';
import { Confetti } from '@/components/ui/confetti';

export default function MetricasPage() {
    // State for role selection (bypassing auth)
    const [activeRole, setActiveRole] = useState<'SDR' | 'CLOSER'>('SDR');

    const [submitting, setSubmitting] = useState(false);
    const [validating, setValidating] = useState(false);

    // Animation states
    const [showMoneyRain, setShowMoneyRain] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // SDR fields
    const [selectedWeek, setSelectedWeek] = useState('Semana Atual (24/11 - 30/11)');
    const [shows, setShows] = useState('');
    const [qualified, setQualified] = useState('');

    // Closer fields
    const [clientName, setClientName] = useState('');
    const [setupValue, setSetupValue] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('PIX');
    const [installments, setInstallments] = useState('');

    // Ensure we only render animations on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSdrSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setValidating(true);

        // Simulate validation delay (Mock)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setValidating(false);

        // Success simulation
        setShowMoneyRain(true);
        setTimeout(() => setShowMoneyRain(false), 5000);
        alert('Métricas de SDR registradas com sucesso! 🚀');
        setShows('');
        setQualified('');
        setSubmitting(false);
    };

    const handleCloserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setValidating(true);

        // Simulate validation delay (Mock)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setValidating(false);

        // Success simulation
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
        alert('Venda registrada com sucesso! 🎉');

        setClientName('');
        setSetupValue('');
        setInstallments('');
        setPaymentMethod('PIX');
        setSubmitting(false);
    };

    const VALUE_PER_SHOW = 10;
    const VALUE_PER_QUALIFIED = 20;
    const currentPotentialValue = (Number(shows) * VALUE_PER_SHOW) + (Number(qualified) * VALUE_PER_QUALIFIED);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Safe Animation Rendering */}
            {isClient && showMoneyRain && <MoneyRain />}
            {isClient && showConfetti && <Confetti />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
                    <p className="text-muted-foreground">Preencha os resultados operacionais</p>
                </div>

                {/* Role Switcher for easy access without login */}
                <div className="flex bg-secondary/50 p-1 rounded-lg border border-border">
                    <button
                        onClick={() => setActiveRole('SDR')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeRole === 'SDR'
                                ? 'bg-background text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Sou SDR
                    </button>
                    <button
                        onClick={() => setActiveRole('CLOSER')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeRole === 'CLOSER'
                                ? 'bg-background text-green-600 shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Sou Closer
                    </button>
                </div>
            </div>

            {activeRole === 'SDR' && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background animate-in fade-in slide-in-from-bottom-4 duration-500">
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

            {activeRole === 'CLOSER' && (
                <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-background animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader>
                        <CardTitle className="text-green-600 text-2xl flex items-center gap-2">
                            <TrendingUp className="w-6 h-6" />
                            Métricas de Closer
                        </CardTitle>
                        <CardDescription>
                            Preencha os dados do fechamento.
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
                                    <span>VALIDANDO NO CRM...</span>
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
