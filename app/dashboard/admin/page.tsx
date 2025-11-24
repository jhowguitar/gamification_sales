'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, MessageSquare, Users, Save, Send, Loader2 } from 'lucide-react';

export default function AdminPage() {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'config' | 'users' | 'content'>('config');

    // Config State
    const [config, setConfig] = useState({
        weeklyGoal: 50000,
        monthlyGoal: 200000,
        leadExecutedValue: 10,
        leadQualifiedValue: 20,
        closerBonusValue: 500,
        closerBonusThreshold: 17000
    });

    // Content State
    const [ceoMessage, setCeoMessage] = useState('<h1>Vamos bater a meta!</h1><p>Conto com todos vocês.</p>');
    const [awardsBanner, setAwardsBanner] = useState({
        imageUrl: 'https://images.unsplash.com/photo-1533227297464-c751417b02b8?auto=format&fit=crop&q=80&w=1000',
        title: 'Prêmio do Mês',
        description: 'Um jantar no melhor restaurante da cidade!'
    });

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                // Check auth/role (simplified)
                // In a real app, we'd have a dedicated /me endpoint
                const res = await fetch('/api/config');
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data.config);
                    setCeoMessage(data.ceoMessage);
                    setAwardsBanner(data.awardsBanner);
                }
            } catch (e) {
                console.error('Failed to load config');
            }
        };
        loadData();
    }, []);

    const handleSaveConfig = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    config,
                    ceoMessage,
                    awardsBanner
                }),
            });

            if (res.ok) {
                alert('Configurações salvas com sucesso!');
            } else {
                alert('Erro ao salvar. Verifique se você é o CEO.');
            }
        } catch (error) {
            alert('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Administração</h1>
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'config' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('config')}
                    >
                        <Settings className="w-4 h-4 mr-2" /> Configurações
                    </Button>
                    <Button
                        variant={activeTab === 'content' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('content')}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" /> Conteúdo
                    </Button>
                    <Button
                        variant={activeTab === 'users' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('users')}
                    >
                        <Users className="w-4 h-4 mr-2" /> Usuários
                    </Button>
                </div>
            </div>

            {activeTab === 'config' && (
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle>Configuração de Metas e Valores</CardTitle>
                        <CardDescription>Defina os valores globais do sistema.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Semanal (R$)</label>
                                <Input
                                    type="number"
                                    value={config.weeklyGoal}
                                    onChange={(e) => setConfig({ ...config, weeklyGoal: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Mensal (R$)</label>
                                <Input
                                    type="number"
                                    value={config.monthlyGoal}
                                    onChange={(e) => setConfig({ ...config, monthlyGoal: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Valor por Lead Executado (R$)</label>
                                <Input
                                    type="number"
                                    value={config.leadExecutedValue}
                                    onChange={(e) => setConfig({ ...config, leadExecutedValue: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Valor por Lead Qualificado (R$)</label>
                                <Input
                                    type="number"
                                    value={config.leadQualifiedValue}
                                    onChange={(e) => setConfig({ ...config, leadQualifiedValue: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bônus Closer (R$)</label>
                                <Input
                                    type="number"
                                    value={config.closerBonusValue}
                                    onChange={(e) => setConfig({ ...config, closerBonusValue: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta para Bônus Closer (R$)</label>
                                <Input
                                    type="number"
                                    value={config.closerBonusThreshold}
                                    onChange={(e) => setConfig({ ...config, closerBonusThreshold: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <Button onClick={handleSaveConfig} disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Salvar Alterações
                        </Button>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'content' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Recado do CEO</CardTitle>
                            <CardDescription>HTML permitido para formatação.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <textarea
                                className="w-full h-40 p-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                value={ceoMessage}
                                onChange={(e) => setCeoMessage(e.target.value)}
                            />
                            <Button onClick={handleSaveConfig} disabled={loading}>Salvar Recado</Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Banner de Premiações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">URL da Imagem</label>
                                <Input
                                    value={awardsBanner.imageUrl}
                                    onChange={(e) => setAwardsBanner({ ...awardsBanner, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Título</label>
                                <Input
                                    value={awardsBanner.title}
                                    onChange={(e) => setAwardsBanner({ ...awardsBanner, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descrição</label>
                                <Input
                                    value={awardsBanner.description}
                                    onChange={(e) => setAwardsBanner({ ...awardsBanner, description: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleSaveConfig} disabled={loading}>Salvar Banner</Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'users' && (
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle>Gerenciar Usuários</CardTitle>
                        <CardDescription>Adicione novos membros à equipe.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setLoading(true);
                            const form = e.target as HTMLFormElement;
                            const formData = new FormData(form);

                            try {
                                const res = await fetch('/api/users', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(Object.fromEntries(formData)),
                                });

                                if (res.ok) {
                                    alert('Usuário criado com sucesso! Convite enviado por e-mail.');
                                    form.reset();
                                } else {
                                    const data = await res.json();
                                    alert(data.error || 'Erro ao criar usuário');
                                }
                            } catch (err) {
                                alert('Erro ao conectar com o servidor');
                            } finally {
                                setLoading(false);
                            }
                        }} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nome Completo</label>
                                    <Input name="name" required placeholder="Ex: João Silva" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">E-mail</label>
                                    <Input name="email" type="email" required placeholder="joao@empresa.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Senha Inicial</label>
                                    <Input name="password" type="password" required placeholder="******" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Função</label>
                                    <select name="role" className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                        <option value="SDR">SDR</option>
                                        <option value="CLOSER">Closer</option>
                                        <option value="LEADER">Líder</option>
                                        <option value="CEO">CEO</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Foto (URL)</label>
                                    <Input name="avatarUrl" placeholder="https://..." />
                                    <p className="text-xs text-muted-foreground">Deixe em branco para gerar um avatar automático.</p>
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Users className="w-4 h-4 mr-2" />}
                                Cadastrar Usuário e Enviar Convite
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
