'use client';

import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OdometerProps {
    value: number;
    className?: string;
}

export function Odometer({ value, className }: OdometerProps) {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return (
        <motion.span className={cn('font-mono tabular-nums', className)}>
            {display}
        </motion.span>
    );
}
