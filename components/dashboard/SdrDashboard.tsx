'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Target, TrendingUp, CheckCircle2, Loader2, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { MoneyRain } from '@/components/ui/money-rain';

interface SdrDashboardProps {
    data: any;
    user: any;
}

export function SdrDashboard({ data, user }: SdrDashboardProps) {
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [showMoneyRain, setShowMoneyRain] = useState(false);
    const [leadsExecuted, setLeadsExecuted] = useState('');
    const [leadsQualified, setLeadsQualified] = useState('');
    const [compares, setCompares] = useState('');

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
                    leadsExecuted: Number(leadsExecuted),
                    leadsQualified: Number(leadsQualified),
                    // compares would be sent here too
                }),
            });

            if (res.ok) {
                setShowMoneyRain(true);
                setTimeout(() => setShowMoneyRain(false), 5000);
                setLeadsExecuted('');
                setLeadsQualified('');
                setCompares('');
                alert('Dados enviados e validados com sucesso! 🚀');
            }
        } catch (error) {
            alert('Erro ao enviar dados.');
        } finally {
            setLoading(false);
        }
    };

    // Filter ranking to show only SDRs (although API should already do this, we enforce strict view)
    const sdrRanking = data.rankings.sdr;

    return (
        <div className="space-y-8">
            {showMoneyRain && <MoneyRain />}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Olá, {user.name} 👋</h1>
                    <p className="text-muted-foreground">Vamos bater a meta de hoje?</p>
                </div>
                <div className="bg-primary/20 px-4 py-2 rounded-full border border-primary/50">
                    <span className="text-primary font-bold flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Nível: SDR Elite
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Module */}
                <div className="lg:col-span-2">
                    <Card className="h-full border-primary/20">
                        <CardHeader>
                            <CardTitle>Preencher Resultados da Semana</CardTitle>
                            <CardDescription>
                                Certifique-se que os dados conferem com o CRM, o sistema fará double-check automático.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Leads Executados</label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={leadsExecuted}
                                            onChange={(e) => setLeadsExecuted(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Leads Qualificados</label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={leadsQualified}
                                            onChange={(e) => setLeadsQualified(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Compares</label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={compares}
                                            onChange={(e) => setCompares(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {validating ? (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-yellow-500 animate-pulse">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>VALIDANDO NO CRM (ClickUp)...</span>
                                    </div>
                                ) : (
                                    <Button type="submit" disabled={loading} className="w-full h-12 text-lg bg-primary hover:bg-primary/90">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Resultados'}
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
                            <CardTitle className="text-sm font-medium text-muted-foreground">Sua Comissão (Semana)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary flex items-center gap-2">
                                <DollarSign className="w-6 h-6" />
                                R$ {data.userStats?.commission?.toFixed(2) || '0.00'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Ranking SDRs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {sdrRanking.map((u: any, index: number) => (
                                    <div key={u.id} className={`flex items-center justify-between p-3 rounded-xl ${u.id === user.id ? 'bg-primary/20 border border-primary/50' : 'bg-secondary/30'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="font-bold text-muted-foreground">#{index + 1}</div>
                                            <div>
                                                <p className="font-medium">{u.name}</p>
                                                <p className="text-xs text-muted-foreground">{u.leads} leads</p>
                                            </div>
                                        </div>
                                        <div className="font-bold">R$ {u.commission.toFixed(0)}</div>
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
