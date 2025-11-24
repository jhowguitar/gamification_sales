'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function MoneyRain() {
    const [items, setItems] = useState<number[]>([]);

    useEffect(() => {
        // Generate random items
        const newItems = Array.from({ length: 50 }).map((_, i) => i);
        setItems(newItems);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {items.map((i) => (
                <motion.div
                    key={i}
                    initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 0 }}
                    animate={{
                        y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                        opacity: [0, 1, 1, 0],
                        rotate: Math.random() * 360
                    }}
                    transition={{
                        duration: Math.random() * 2 + 2,
                        repeat: 0,
                        delay: Math.random() * 0.5,
                        ease: "linear"
                    }}
                    className="absolute text-4xl select-none"
                >
                    {Math.random() > 0.5 ? '💰' : '💵'}
                </motion.div>
            ))}
        </div>
    );
}
