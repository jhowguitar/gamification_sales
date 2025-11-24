'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Confetti() {
    const [particles, setParticles] = useState<number[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 100 }).map((_, i) => i);
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((i) => (
                <motion.div
                    key={i}
                    initial={{
                        y: -20,
                        x: Math.random() * window.innerWidth,
                        rotate: Math.random() * 360,
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        y: window.innerHeight + 20,
                        x: `calc(${Math.random() * 100}vw - 50vw)`,
                        rotate: Math.random() * 360 + 360,
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: 0,
                        delay: Math.random() * 0.2,
                        ease: "linear"
                    }}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{
                        backgroundColor: ['#FFC700', '#FF0000', '#2E3192', '#41BBC7'][Math.floor(Math.random() * 4)]
                    }}
                />
            ))}
        </div>
    );
}
