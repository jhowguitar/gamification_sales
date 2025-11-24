'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Mail } from 'lucide-react';

interface Message {
    id: string;
    fromUserId: string;
    title: string;
    content: string;
    createdAt: string;
    read: boolean;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    // New Message State
    const [toUserId, setToUserId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Failed to fetch messages');
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ toUserId, title, content }),
            });

            setTitle('');
            setContent('');
            // In a real app, we might not see sent messages in inbox unless we fetch sent folder
            alert('Mensagem enviada!');
        } catch (error) {
            console.error('Failed to send');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Minhas Mensagens</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Inbox */}
                <div className="md:col-span-2 space-y-4">
                    {messages.map((msg) => (
                        <Card key={msg.id} className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{msg.title}</CardTitle>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardDescription>De: Admin/Líder</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground/80">{msg.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                    {messages.length === 0 && (
                        <div className="text-center py-12 bg-secondary/30 rounded-2xl">
                            <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground">Você não tem novas mensagens.</p>
                        </div>
                    )}
                </div>

                {/* Send Message (Simplified for prototype) */}
                <Card className="border-none shadow-lg h-fit">
                    <CardHeader>
                        <CardTitle>Nova Mensagem</CardTitle>
                        <CardDescription>Enviar recado para a equipe (Admin)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSend} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Para (ID do Usuário)</label>
                                <Input
                                    placeholder="Ex: 2 (SDR Star)"
                                    value={toUserId}
                                    onChange={(e) => setToUserId(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Assunto</label>
                                <Input
                                    placeholder="Título da mensagem"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mensagem</label>
                                <textarea
                                    className="w-full h-32 p-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Escreva sua mensagem..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                Enviar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
