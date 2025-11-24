import { getDB, getUserById } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Need to create Avatar component or use img
import { Badge } from '@/components/ui/badge'; // Need to create Badge component or use div
import { Trophy, Calendar, Mail, User as UserIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    if (!userId) redirect('/login');

    const db = getDB();
    const user = db.users.find(u => u.id === userId);
    if (!user) redirect('/login');

    // Get History
    let history: any[] = [];
    if (user.role === 'SDR') {
        history = db.leadEntries.filter(e => e.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (user.role === 'CLOSER') {
        history = db.saleEntries.filter(e => e.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-gradient-to-br from-secondary/50 to-background">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-xl">
                            <img
                                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                alt={user.name}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/50">
                                    {user.role}
                                </span>
                                <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/50 flex items-center gap-1">
                                    <Trophy className="w-3 h-3" />
                                    Elite Member
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Histórico de Atividades
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {history.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">Nenhuma atividade registrada ainda.</p>
                            ) : (
                                history.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-white/5">
                                        <div>
                                            <p className="font-medium text-white">
                                                {user.role === 'SDR' ? `Semana ${item.week}` : item.clientName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            {user.role === 'SDR' ? (
                                                <>
                                                    <p className="font-bold text-primary">{item.leadsExecuted} Exec / {item.leadsQualified} Qual</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-bold text-green-500">R$ {item.setupValue.toLocaleString('pt-BR')}</p>
                                                    <p className="text-xs text-muted-foreground">{item.paymentMethod}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
