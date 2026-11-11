import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Ruler, ShieldCheck } from 'lucide-react';
import SeatingPlanner from '@/components/seating/SeatingPlanner';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  SPLIT_SOBERANO,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';
import { isTableShapeValue, readPaxFromQuery } from '@/lib/seating/seating-codec';
import type { TableShape } from '@/lib/seating/seating-plan';

export const metadata: Metadata = {
  title: 'Planificador de Mesas Pro | Productora EAR',
  description:
    'Organiza las mesas de tu evento sobre un plano métrico: redondas, rectangulares y presidenciales. Aforo validado contra la ficha del espacio, plano compartible e imprimible.',
};

/**
 * VALOR DE CATÁLOGO DE LA HERRAMIENTA (ancla del lead magnet).
 *
 * Vive en la RUTA, no en el SSOT financiero, por una razón de gobierno: la
 * ZONA CERO (`ear-os-ssot.ts`) sella precios de SERVICIO (tarifa, depósito,
 * techo B2G) y está protegida por hash (INV-05). Añadirle una cifra de
 * marketing movería ese hash y bloquearía el despliegue.
 *
 * Reglas de `marketing-leadmagnet-seating.md` que se respetan:
 *   · FASE 1: el ancla sólo puede mostrarse porque la herramienta EXISTE (esta
 *     ruta). Antes de T1 estaba prohibido anunciarla.
 *   · No es un precio tachado de algo que se cobró: es el valor declarado de la
 *     herramienta, entregada en cortesía con el depósito del SSOT.
 *   · INV-03: la cortesía NO altera la naturaleza del depósito — sigue siendo
 *     `DEPOSITO_STRIPE_EUR` y 100 % deducible. No hay segundo cobro.
 */
const SEATING_PLANNER_CATALOG_VALUE_EUR = 190;

const EUR_FORMAT = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Next.js 16: `searchParams` es una promesa (resolución obligatoria). */
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return null;
}

export default async function SeatingPlannerPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const pax = readPaxFromQuery(firstValue(params.pax)) ?? 80;
  const venueCapacity = readPaxFromQuery(firstValue(params.aforo)) ?? 0;
  const shapeParam = firstValue(params.tipo);
  const shape: TableShape = shapeParam !== null && isTableShapeValue(shapeParam) ? shapeParam : 'round';

  return (
    <main className="min-h-screen bg-[#030305] px-4 pb-24 pt-32 text-zinc-200 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[#00E5FF]">
            <Ruler size={12} /> Herramienta operativa · plano métrico
          </p>
          <h1 className="font-syne text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl">
            Planifica los asientos sobre tu presupuesto sellado
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
            Mesas redondas, rectangulares y presidenciales sobre una rejilla de un metro. El aforo se valida contra la
            ficha del espacio y el plano se comparte por enlace o se imprime para la finca. Sin re-teclear un solo
            dato: el aforo llega desde tu presupuesto.
          </p>
        </header>

        <SeatingPlanner
          initialPax={pax}
          initialVenueCapacity={venueCapacity}
          initialShape={shape}
          initialEventName=""
          catalogValueEur={EUR_FORMAT.format(SEATING_PLANNER_CATALOG_VALUE_EUR)}
          depositEur={EUR_FORMAT.format(DEPOSITO_STRIPE_EUR)}
          phoneE164={CENTRALITA_EAR_OS}
        />

        {/* Evidencia operativa: cifras leídas del SSOT, no de copy. */}
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Split soberano</p>
            <p className="mt-1 font-mono text-sm text-white">
              {Math.round(SPLIT_SOBERANO.artista * 100)} / {Math.round(SPLIT_SOBERANO.earOs * 100)} /{' '}
              {Math.round(SPLIT_SOBERANO.vimume * 100)}
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">Artista · infraestructura · VIMUME</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Rider acústico</p>
            <p className="mt-1 font-mono text-sm text-white">
              {WATTS_PER_PAX} W/pax · &lt; {LIMITE_SPL_DB} dB SPL
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">Ley 37/2003 · limitador telemático</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Canal único</p>
            <p className="mt-1 font-mono text-sm text-white">{CENTRALITA_EAR_OS}</p>
            <p className="mt-1 text-[11px] text-zinc-500">Revisión humana del plano</p>
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck size={14} className="text-emerald-400" />
            El plano no cotiza: organiza. Cualquier importe del evento nace del presupuesto sellado.
          </p>
          <Link
            href="/presupuesto"
            className="inline-flex items-center gap-2 rounded-xl bg-[#ecb613] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-[#f5c94a]"
          >
            Abrir presupuesto <ArrowRight size={14} />
          </Link>
        </section>
      </div>
    </main>
  );
}
