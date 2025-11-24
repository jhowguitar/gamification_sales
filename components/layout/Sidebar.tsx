'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Trophy, Target, MessageSquare, Settings, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Ranking', href: '/dashboard/ranking', icon: Trophy },
    { name: 'Perfil', href: '/dashboard/profile', icon: User },
    // Only show Admin for CEO (This logic should ideally be server-side or checked against user role prop)
    { name: 'Admin', href: '/dashboard/admin', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    const handleLogout = () => {
        document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/login';
    };

    return (
        <>
            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 px-4 py-2 flex justify-around items-center safe-area-bottom">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen fixed left-0 top-0 p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl tracking-tight">SalesGame</h1>
                        <p className="text-xs text-muted-foreground">Gamification System</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 relative overflow-hidden",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/10"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </div>
        </>
    );
}
