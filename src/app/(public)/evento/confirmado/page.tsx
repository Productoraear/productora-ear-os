import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Lock, CalendarDays } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Garantía de reserva confirmada · EAR OS',
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ session_id?: string; slug?: string; kind?: string }>;
}

/**
 * Retorno de Stripe Checkout del carrito de evento.
 * Solo confirma la GARANTÍA de 1 € por proveedor; la reserva comercial se
 * cierra con el depósito S-Class del SSOT (100 €) o con el contrato.
 */
export default async function EventConfirmedPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const sessionId = typeof query.session_id === 'string' ? query.session_id.slice(0, 120) : '';
  const slug = typeof query.slug === 'string' ? query.slug.slice(0, 120) : '';
  const rawKind = typeof query.kind === 'string' ? query.kind.toLowerCase() : 'servicios';
  const kind = /^[a-z_]{3,20}$/.test(rawKind) ? rawKind : 'servicios';

  return (
    <main className="min-h-screen bg-[#030305] text-white w-full overflow-x-hidden flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-xl rounded-3xl bg-[#09090d]/80 border border-emerald-500/25 backdrop-blur-md p-8 space-y-5 text-center">
        <div className="mx-auto size-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-black tracking-tight">Garantía de reserva procesada</h1>
        <p className="text-sm text-zinc-400">
          El proveedor ha bloqueado su franja con la garantía de 1,00 €. Puedes revisar su agenda
          para confirmar que la fecha aparece ocupada.
        </p>

        <div className="rounded-2xl bg-black/50 border border-white/10 p-4 text-left text-[11px] font-mono text-zinc-400 space-y-1">
          <div className="flex justify-between">
            <span>Sesión Stripe</span>
            <span className="text-white">{sessionId || 'simulada'}</span>
          </div>
          <div className="flex justify-between">
            <span>Proveedor</span>
            <span className="text-white">{slug || 'n/d'}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {slug && (
            <Link
              href={`/calendario/${kind}/${encodeURIComponent(slug)}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono hover:bg-white/10 transition-all"
            >
              <CalendarDays size={13} /> Ver agenda
            </Link>
          )}
          <Link
            href="/evento"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ecb613] text-black font-bold font-mono text-xs hover:bg-[#f5d273] transition-all"
          >
            <Lock size={13} /> Volver al plano del evento
          </Link>
        </div>
      </div>
    </main>
  );
}
