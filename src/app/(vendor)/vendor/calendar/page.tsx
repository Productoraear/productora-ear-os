import React from 'react';
import Link from 'next/link';
import { CalendarDays, Lock, AlertTriangle, Link2 } from 'lucide-react';

import EntityCalendarBoard from '@/components/calendar/EntityCalendarBoard';
import { buildEntityCalendarHref, buildEntityIcalHref } from '@/lib/calendar/entity-calendar-engine';
import { inferCalendarEntityKind, resolveCalendarEntity } from '@/lib/calendar/entity-registry';
import { getEntityCalendar } from '@/lib/calendar/entity-calendar-store';
import { getVendorSessionAction } from '@/app/actions/vendorAuthActions';

export const dynamic = 'force-dynamic';

/**
 * Disponibilidad del PROVEEDOR AUTENTICADO.
 *
 * Antes esta vista leía y escribía SIEMPRE sobre el slug `edwin-agudelo`:
 * cualquier proveedor que entraba veía las fechas del CEO y bloqueaba su
 * agenda. Ahora el slug sale de la cookie de sesión (`ear_vendor_session`)
 * y cada rol escribe en su propio calendario aislado.
 */
export default async function VendorCalendarPage() {
  const session = await getVendorSessionAction();

  if (!session?.vendorSlug) {
    return (
      <div className="space-y-6">
        <header className="border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full text-[10px] font-mono text-rose-300 font-bold uppercase mb-2">
            <AlertTriangle size={12} />
            <span>Sin sesión de proveedor</span>
          </div>
          <h1 className="text-3xl font-black font-syne text-white tracking-tight">
            Disponibilidad & Price-Lock 72h
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            Inicia sesión para gestionar la agenda de tu propio negocio. Ningún proveedor puede
            bloquear el calendario de otro.
          </p>
          <Link
            href="/vendor/login"
            className="inline-flex items-center gap-2 mt-4 px-5 py-3 rounded-2xl bg-[#ecb613] text-black font-bold font-mono text-xs hover:bg-[#f5d273] transition-all"
          >
            Acceder a mi panel
          </Link>
        </header>
      </div>
    );
  }

  const vendorSlug = session.vendorSlug.toLowerCase();
  const kind = inferCalendarEntityKind(vendorSlug);
  const entity = resolveCalendarEntity(kind, vendorSlug);
  const record = await getEntityCalendar(kind, entity.slug, entity.displayName);
  const icalPath = buildEntityIcalHref(kind, entity.slug);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono text-amber-300 font-bold uppercase mb-2">
          <CalendarDays size={12} />
          <span>Agenda propia · {entity.slug}</span>
        </div>
        <h1 className="text-3xl font-black font-syne text-white tracking-tight">
          Disponibilidad & Price-Lock 72h
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Tu calendario, tus reglas. Los bloqueos que registres aquí solo afectan a{' '}
          <strong className="text-white">{record.displayName}</strong> y se publican al instante en tu
          ficha pública.
        </p>
      </header>

      <EntityCalendarBoard kind={kind} slug={entity.slug} canMutate />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold font-syne text-white flex items-center gap-2">
            <Link2 size={14} className="text-[#ecb613]" />
            <span>Exportar a Google / Apple Calendar</span>
          </h3>
          <p className="text-[11px] text-zinc-400 font-light">
            Feed iCalendar real de tu agenda. Copia el enlace en tu aplicación de calendario para
            sincronizar bloqueos y reservas en tiempo real.
          </p>
          <input
            type="text"
            readOnly
            value={icalPath}
            aria-label="Enlace del feed iCal"
            className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white text-[11px] font-mono"
          />
          <a
            href={icalPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ecb613] text-black font-mono text-xs font-bold hover:bg-[#f5d273] transition-all"
          >
            Abrir feed .ics
          </a>
        </div>

        <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold font-syne text-white flex items-center gap-2">
            <Lock size={14} className="text-[#FF2B44]" />
            <span>Aislamiento multi-rol</span>
          </h3>
          <p className="text-[11px] text-zinc-400 font-light">
            Cada artista, finca, catering, técnico y centro VIMUME tiene su propio calendario. Un
            bloqueo en tu agenda ya no puede colisionar con la agenda de otro proveedor.
          </p>
          <Link
            href={buildEntityCalendarHref(kind, entity.slug)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs hover:bg-white/10 transition-all"
          >
            Ver mi calendario público
          </Link>
        </div>
      </section>
    </div>
  );
}
