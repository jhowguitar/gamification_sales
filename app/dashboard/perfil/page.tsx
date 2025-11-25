'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AvatarSticker, AvatarSelector } from '@/components/ui/avatar-sticker';
import { getLevelName, getLevelIcon, getLevelColor } from '@/lib/gamification';
import { Loader2, User, Trophy, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState('');
    const [selectedSticker, setSelectedSticker] = useState(1);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setName(data.user.name || '');
                setSelectedSticker(data.user.avatarSticker || 1);
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Erro ao carregar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    avatarSticker: selectedSticker
                })
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                alert('Perfil atualizado com sucesso! ✅');
            } else {
                setError('Erro ao atualizar perfil.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Erro ao conectar com o servidor.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-muted-foreground">Usuário não encontrado</p>
            </div>
        );
    }

    const levelColor = getLevelColor(user.level || 'STAR');
    const levelIcon = getLevelIcon(user.level || 'STAR');
    const levelName = getLevelName(user.level || 'STAR');
    const totalValue = user.role === 'SDR' ? user.totalCommission : user.totalSales;
    const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A';

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
                <p className="text-muted-foreground">Personalize suas informações</p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Card de Nível */}
            <Card className={`bg-gradient-to-br ${levelColor} text-white border-0`}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm mb-1">Nível Atual</p>
                            <h2 className="text-4xl font-bold flex items-center gap-2">
                                <span>{levelIcon}</span>
                                <span>{user.role} {levelName}</span>
                            </h2>
                        </div>
                        <AvatarSticker stickerId={selectedSticker} size="xl" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/10 rounded-lg p-3">
                            <p className="text-white/80 text-xs mb-1">
                                {user.role === 'SDR' ? 'Comissão Total' : 'Vendas Totais'}
                            </p>
                            <p className="text-2xl font-bold">
                                R$ {Number(totalValue || 0).toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                            <p className="text-white/80 text-xs mb-1">Membro desde</p>
                            <p className="text-lg font-semibold">{memberSince}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Editar Informações */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Informações Pessoais
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nome</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Seu nome"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input value={user.email} disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cargo</label>
                        <Input value={user.role} disabled className="bg-muted" />
                    </div>
                </CardContent>
            </Card>

            {/* Escolher Avatar */}
            <Card>
                <CardHeader>
                    <CardTitle>Escolha seu Avatar</CardTitle>
                </CardHeader>
                <CardContent>
                    <AvatarSelector
                        selectedId={selectedSticker}
                        onSelect={setSelectedSticker}
                    />
                </CardContent>
            </Card>

            {/* Botão Salvar */}
            <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full h-12 text-lg"
                size="lg"
            >
                {saving ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Salvando...
                    </>
                ) : (
                    'Salvar Alterações'
                )}
            </Button>
        </div>
    );
}
