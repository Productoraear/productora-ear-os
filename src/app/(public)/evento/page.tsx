import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import EventCartConsole from '@/components/events/EventCartConsole';
import { EVENT_SERVICE_TOTAL } from '@/lib/events/event-service-catalog';
import { PROVIDERS_GRAND_TOTAL } from '@/lib/constants/providers-manifest';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Plano de evento completo · 122 servicios · EAR OS',
  description:
    'Barrido completo del ecosistema: cada servicio de un evento busca proveedor real con afinidad mínima del 75 %, entra al carrito y bloquea su propia fecha con garantía de 1 €.',
  robots: { index: true, follow: true },
};

export default function EventPlannerPage() {
  return (
    <main className="min-h-screen bg-[#030305] text-white w-full overflow-x-hidden selection:bg-[#ecb613] selection:text-black">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-28 pb-20 space-y-8">
        <nav className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          <Link href="/" className="inline-flex items-center gap-2 hover:text-white transition-colors">
            <ArrowLeft size={12} /> Inicio
          </Link>
          <span className="text-zinc-600">
            {EVENT_SERVICE_TOTAL} servicios · {PROVIDERS_GRAND_TOTAL.toLocaleString('es-ES')}{' '}
            proveedores publicados
          </span>
        </nav>

        <EventCartConsole />
      </div>
    </main>
  );
}
