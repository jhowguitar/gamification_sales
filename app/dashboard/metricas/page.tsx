'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Loader2 } from 'lucide-react';

export default function MetricasPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [selectedWeek, setSelectedWeek] = useState('Semana Atual (24/11 - 30/11)');
    const [leadsExecuted, setLeadsExecuted] = useState('');
    const [leadsQualified, setLeadsQualified] = useState('');
    const [meetings, setMeetings] = useState('');
    const [proposals, setProposals] = useState('');
    const [closings, setClosings] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/dashboard');
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                const json = await res.json();
                setUser(json.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = user.role === 'SDR'
                ? { week: selectedWeek, leadsExecuted: Number(leadsExecuted), leadsQualified: Number(leadsQualified) }
                : { week: selectedWeek, meetings: Number(meetings), proposals: Number(proposals), closings: Number(closings) };

            const res = await fetch('/api/metricas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert('Métricas registradas com sucesso!');
                if (user.role === 'SDR') {
                    setLeadsExecuted('');
                    setLeadsQualified('');
                } else {
                    setMeetings('');
                    setProposals('');
                    setClosings('');
                }
            } else {
                alert('Erro ao registrar métricas.');
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
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (user.role === 'CEO') {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">CEO não tem acesso à página de Métricas.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
                <p className="text-muted-foreground">Preencha seus resultados {user.role === 'SDR' ? 'de prospecção' : 'de vendas'}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-primary text-2xl">
                        {user.role === 'SDR' ? 'Métricas de SDR' : 'Métricas de Closer'}
                    </CardTitle>
                    <CardDescription>
                        Preencha os dados da semana selecionada
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        {user.role === 'SDR' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Leads Executados *</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={leadsExecuted}
                                        onChange={(e) => setLeadsExecuted(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Leads Qualificados *</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={leadsQualified}
                                        onChange={(e) => setLeadsQualified(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {user.role === 'CLOSER' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Reuniões Feitas *</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={meetings}
                                        onChange={(e) => setMeetings(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Propostas Enviadas *</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={proposals}
                                        onChange={(e) => setProposals(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Fechamentos *</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={closings}
                                        onChange={(e) => setClosings(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-12 text-lg"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Registrar Métricas'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
