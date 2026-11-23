'use client';

import React from 'react';
import { Armchair, Calculator, CreditCard, MessageCircle } from 'lucide-react';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { CENTRALITA } from '@/lib/phone-constants';
import SovereignDock from '@/components/vanguardia/SovereignDock';
import type { DockItem } from '@/components/vanguardia/SovereignDock';

/** Capa 4 · HUD soberano. Accesos reales: presupuesto, reserva con depósito Stripe y centralita. */
const HOME_DOCK_ITEMS: readonly DockItem[] = [
  { id: 'presupuesto', label: 'Calcular Presupuesto', icon: Calculator, href: '/presupuesto' },
  { id: 'seating', label: 'Seating cortesía (Otzarreta)', icon: Armchair, href: '/otzarreta' },
  {
    id: 'fianza',
    label: `Bloqueo Stripe ${DEPOSITO_STRIPE_EUR.toFixed(0)}€`,
    icon: CreditCard,
    href: '/reservar',
  },
  {
    id: 'centralita',
    label: `WhatsApp Centralita ${CENTRALITA.display}`,
    icon: MessageCircle,
    href: CENTRALITA.whatsapp,
  },
];

export default function SpatialHomeDock(): React.JSX.Element {
  return <SovereignDock placement="fixed" stackClassName="z-[90]" items={HOME_DOCK_ITEMS} />;
}
