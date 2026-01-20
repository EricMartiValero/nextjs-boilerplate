'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function Eye() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const eyeRef = useRef<HTMLDivElement>(null);
    const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (!eyeRef.current) return;

        const rect = eyeRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = mousePosition.x - centerX;
        const dy = mousePosition.y - centerY;

        // Normalize and limit the movement
        const maxDist = 30; // Max pupil movement radius
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(maxDist, Math.hypot(dx, dy) / 15); // Dampen specific distance

        const moveX = Math.cos(angle) * dist;
        const moveY = Math.sin(angle) * dist;

        setPupilPos({ x: moveX, y: moveY });
    }, [mousePosition]);

    return (
        <div className="relative flex items-center justify-center p-10">
            <div
                ref={eyeRef}
                className="relative w-64 h-64 flex items-center justify-center bg-white rounded-full overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.2)] border-4 border-slate-200/10"
            >
                {/* Sclera / Whites of the eye */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-300 rounded-full" />

                {/* Iris */}
                <motion.div
                    className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-blue-900 via-indigo-800 to-purple-900 border-4 border-indigo-950/50 shadow-inner"
                    animate={{ x: pupilPos.x, y: pupilPos.y }}
                    transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.5 }}
                >
                    {/* Pupil */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black rounded-full shadow-lg" />
                    {/* Highlight */}
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-60 filter blur-[1px]" />
                </motion.div>

                {/* Eyelid shadow effect */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_10px_20px_rgba(0,0,0,0.2)] pointer-events-none" />
            </div>
        </div>
    );
}
