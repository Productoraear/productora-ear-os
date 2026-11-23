'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { Calculator, CreditCard, Home, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { getVanguardiaTheme } from './vanguardia-theme';
import type { VanguardiaVariant } from './vanguardia-theme';

/** Evento que ya escucha SovereignConciergeWidget para abrir el Maitre. */
export const OPEN_CONCIERGE_EVENT = 'open-ai-concierge';

export interface DockItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Si hay href se renderiza un enlace; si no, se ejecuta `action`. */
  href?: string;
  action?: 'open-concierge';
}

export interface SovereignDockProps {
  variant?: VanguardiaVariant;
  /** `fixed` = anclado al viewport (produccion). `inline` = embebido (showcase). */
  placement?: 'fixed' | 'inline';
  items?: readonly DockItem[];
  className?: string;
  /** Clase de apilado Z cuando `placement` es `fixed`. Por defecto `z-40`. */
  stackClassName?: string;
}

export const DEFAULT_DOCK_ITEMS: readonly DockItem[] = [
  { id: 'presupuesto', label: 'Calcular Presupuesto', icon: Calculator, href: '/cotizador' },
  { id: 'otzarreta', label: 'Ver Otzarreta', icon: Home, href: '/otzarreta' },
  { id: 'maitre', label: 'Hablar con Maître 24/7', icon: MessageCircle, action: 'open-concierge' },
  { id: 'fianza', label: `Fianza Stripe ${DEPOSITO_STRIPE_EUR.toFixed(0)}€`, icon: CreditCard, href: '/reservar' },
];

const BASE = 44;
const PEAK = 62;
const REACH = 110;

function DockButton({
  item,
  mouseX,
  themeClasses,
}: {
  item: DockItem;
  mouseX: MotionValue<number>;
  themeClasses: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const distance = useTransform(mouseX, (value: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return REACH;
    return value - (rect.left + rect.width / 2);
  });
  const size = useSpring(useTransform(distance, [-REACH, 0, REACH], [BASE, PEAK, BASE]), {
    stiffness: 260,
    damping: 20,
  });
  const Icon = item.icon;

  const content = (
    <>
      <Icon className="h-5 w-5" />
      <span className="sr-only">{item.label}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-black/90 px-2.5 py-1 text-[11px] font-semibold text-zinc-100 group-hover:block group-focus-visible:block"
      >
        {item.label}
      </span>
    </>
  );

  const shared = `group relative flex h-full w-full items-center justify-center rounded-2xl border ${themeClasses}`;

  return (
    <motion.div ref={ref} style={{ width: size, height: size }} className="shrink-0">
      {item.href ? (
        <Link href={item.href} className={shared} aria-label={item.label}>
          {content}
        </Link>
      ) : (
        <button
          type="button"
          className={shared}
          aria-label={item.label}
          onClick={() => {
            if (item.action === 'open-concierge') window.dispatchEvent(new CustomEvent(OPEN_CONCIERGE_EVENT));
          }}
        >
          {content}
        </button>
      )}
    </motion.div>
  );
}

export default function SovereignDock({
  variant = 'oro',
  placement = 'fixed',
  items = DEFAULT_DOCK_ITEMS,
  className,
  stackClassName = 'z-40',
}: SovereignDockProps) {
  const theme = getVanguardiaTheme(variant);
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const position =
    placement === 'fixed'
      ? `fixed bottom-4 left-1/2 ${stackClassName} -translate-x-1/2 pb-[env(safe-area-inset-bottom)]`
      : 'relative mx-auto w-fit';

  return (
    <nav aria-label="Accesos rapidos" className={`${position} ${className ?? ''}`}>
      <motion.div
        onPointerMove={(event) => {
          if (event.pointerType === 'mouse') mouseX.set(event.clientX);
        }}
        onPointerLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className={`flex h-[72px] items-end gap-2.5 rounded-3xl border px-3 pb-2.5 shadow-2xl ${theme.surface} ${theme.border}`}
      >
        {items.map((item) => (
          <DockButton
            key={item.id}
            item={item}
            mouseX={mouseX}
            themeClasses={`${theme.border} ${theme.text} ${theme.isDark ? 'bg-white/[0.06]' : 'bg-white/80'}`}
          />
        ))}
      </motion.div>
    </nav>
  );
}
