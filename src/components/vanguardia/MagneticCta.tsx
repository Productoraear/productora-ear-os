'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export interface MagneticCtaProps {
  href: string;
  label: string;
  /** Clases de color/fondo del boton (viene del tema). */
  className: string;
}

/** CTA magnetico: se desplaza hacia el cursor (resorte) y barre un brillo metalico al pasar. */
export default function MagneticCta({ href, label, className }: MagneticCtaProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      if (event.pointerType !== 'mouse') return;
      const rect = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - (rect.left + rect.width / 2)) * 0.22);
      y.set((event.clientY - (rect.top + rect.height / 2)) * 0.32);
    },
    [x, y],
  );

  const onLeave = useCallback((): void => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <div className="inline-block p-3" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div style={{ x: sx, y: sy }}>
        <Link
          href={href}
          className={`group relative inline-flex min-h-[48px] items-center gap-2 overflow-hidden rounded-full px-7 py-3 text-sm font-bold tracking-wide ${className}`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
          />
          <span className="relative">{label}</span>
          <ArrowUpRight className="relative h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}
