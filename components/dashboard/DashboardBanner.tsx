'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Star, Zap } from 'lucide-react';

const events = [
    {
        id: 1,
        title: "Start Digital Summit",
        date: "15 de Dezembro",
        icon: Star,
        color: "from-yellow-500 to-orange-500"
    },
    {
        id: 2,
        title: "Fechamento de Q4",
        date: "30 de Dezembro",
        icon: Zap,
        color: "from-primary to-purple-600"
    },
    {
        id: 3,
        title: "Planejamento 2026",
        date: "05 de Janeiro",
        icon: Calendar,
        color: "from-blue-500 to-cyan-500"
    }
];

export function DashboardBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-32 w-full overflow-hidden rounded-[24px] glass-card border border-white/10 shadow-lg">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 bg-gradient-to-r ${events[currentIndex].color} opacity-20`}
                />
                <motion.div
                    key={`content-${currentIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute inset-0 flex items-center justify-between px-8"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full bg-gradient-to-br ${events[currentIndex].color} shadow-lg`}>
                            {(() => {
                                const Icon = events[currentIndex].icon;
                                return <Icon className="w-6 h-6 text-white" />;
                            })()}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{events[currentIndex].title}</h3>
                            <p className="text-white/80 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {events[currentIndex].date}
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold backdrop-blur-md">
                            Evento Oficial
                        </span>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {events.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/30'}`}
                    />
                ))}
            </div>
        </div>
    );
}
