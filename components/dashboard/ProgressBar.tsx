'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
    current: number;
    target: number;
    label?: string;
}

export function ProgressBar({ current, target, label }: ProgressBarProps) {
    const percentage = Math.min((current / target) * 100, 100);

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
                {label && <span className="text-sm font-bold text-white uppercase tracking-wider">{label}</span>}
                <span className="text-2xl font-black text-primary drop-shadow-[0_0_10px_rgba(90,45,255,0.5)]">
                    {percentage.toFixed(0)}%
                </span>
            </div>
            <div className="h-6 bg-secondary/50 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                {/* Background Pulse Effect */}
                <div className="absolute inset-0 bg-primary/5 animate-pulse" />

                <motion.div
                    className="h-full bg-gradient-to-r from-primary to-purple-400 relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    {/* Shine Effect */}
                    <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-white/20 to-transparent" />

                    {/* Particle/Sparkle Effect at the tip */}
                    {percentage > 0 && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full blur-[2px] shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    )}
                </motion.div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>R$ 0</span>
                <span>Meta: R$ {target.toLocaleString('pt-BR')}</span>
            </div>
        </div>
    );
}
