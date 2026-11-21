import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
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
import { OTZARRETA_SEATING_PRESET } from '@/lib/constants/otzarreta-entity';

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
  /**
   * Preset canónico `?preset=otzarreta` (sanción del CEO 2026-11-21).
   *
   * El aforo del espacio llega de `OTZARRETA_SEATING_PRESET`, nunca de un literal
   * en la ruta: salón acristalado 200 pax (interior) y jardín/carpa 350 pax
   * (exterior), con 350 pax de capacidad total de la finca. `?aforo=` explícito
   * sigue mandando si el cliente lo trae desde otra ficha.
   */
  const presetParam = firstValue(params.preset);
  const presetVenueCapacity =
    presetParam === 'otzarreta' ? OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax : 0;
  const venueCapacity = readPaxFromQuery(firstValue(params.aforo)) ?? presetVenueCapacity;
  const shapeParam = firstValue(params.tipo);
  const shape: TableShape = shapeParam !== null && isTableShapeValue(shapeParam) ? shapeParam : 'round';

  return (
    <main className="min-h-screen overflow-x-clip bg-[#030305] px-4 pb-24 pt-32 text-[#D6D2C7] md:px-8">
      <div className="mx-auto max-w-[1520px] space-y-10">
        <header className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="font-syne text-[clamp(2rem,4.6vw,3.5rem)] font-black leading-[1.04] tracking-[-0.025em] text-[#F4F1EA] [overflow-wrap:break-word]">
              Planifica las mesas sobre tu presupuesto sellado
            </h1>
            <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-[#C9C4B8] sm:text-base">
              Mesas redondas, rectangulares y presidenciales sobre una rejilla de un metro. El aforo se
              valida contra la ficha del espacio y el plano se comparte por enlace o se imprime para la
              brigada de sala, sin re-teclear un solo dato.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#plano"
                className="inline-flex min-h-[48px] items-center rounded-xl bg-[#ecb613] px-6 text-sm font-bold text-[#120D00] transition-colors duration-150 ease-out hover:bg-[#f7cb45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
              >
                Abrir el plano táctil
              </a>
              <Link
                href="/presupuesto"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-white/[0.16] px-6 text-sm font-semibold text-[#F4F1EA] transition-colors duration-150 ease-out hover:border-white/40 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
              >
                Abrir presupuesto <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Ficha técnica del lienzo: datos del SSOT, no copy. */}
          <dl className="grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-5 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <dt className="text-xs text-[#8E8A80]">Rejilla</dt>
              <dd className="mt-1 font-syne text-lg font-bold tabular-nums text-[#F4F1EA]">1 m</dd>
            </div>
            <div>
              <dt className="text-xs text-[#8E8A80]">Plazas</dt>
              <dd className="mt-1 font-syne text-lg font-bold tabular-nums text-[#F4F1EA]">2 a 12</dd>
            </div>
            <div>
              <dt className="text-xs text-[#8E8A80]">Salida</dt>
              <dd className="mt-1 font-syne text-lg font-bold text-[#F4F1EA]">A4 y SVG</dd>
            </div>
          </dl>
        </header>

        <div id="plano" className="scroll-mt-28">
          <SeatingPlanner
            initialPax={pax}
            initialVenueCapacity={venueCapacity}
            initialShape={shape}
            initialEventName=""
            catalogValueEur={EUR_FORMAT.format(SEATING_PLANNER_CATALOG_VALUE_EUR)}
            depositEur={EUR_FORMAT.format(DEPOSITO_STRIPE_EUR)}
            phoneE164={CENTRALITA_EAR_OS}
          />
        </div>

        {/* Evidencia operativa: cifras leídas del SSOT, no de copy. */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#1E1E26] bg-[#0A0A0E] p-6">
            <p className="text-xs text-[#8E8A80]">Aforo canónico Otzarreta</p>
            <p className="mt-2 font-syne text-xl font-black tabular-nums text-[#F4F1EA]">
              {OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} /{' '}
              {OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax}
            </p>
            <p className="mt-1 text-xs text-[#C9C4B8]">
              {OTZARRETA_SEATING_PRESET.interiorSalon.label} y {OTZARRETA_SEATING_PRESET.exteriorGarden.label}
            </p>
          </div>
          <div className="rounded-2xl border border-[#1E1E26] bg-[#0A0A0E] p-6">
            <p className="text-xs text-[#8E8A80]">Split soberano</p>
            <p className="mt-2 font-syne text-xl font-black tabular-nums text-[#F4F1EA]">
              {Math.round(SPLIT_SOBERANO.artista * 100)} / {Math.round(SPLIT_SOBERANO.earOs * 100)} /{' '}
              {Math.round(SPLIT_SOBERANO.vimume * 100)}
            </p>
            <p className="mt-1 text-xs text-[#C9C4B8]">Artista, infraestructura y VIMUME</p>
          </div>
          <div className="rounded-2xl border border-[#1E1E26] bg-[#0A0A0E] p-6">
            <p className="text-xs text-[#8E8A80]">Rider acústico</p>
            <p className="mt-2 font-syne text-xl font-black tabular-nums text-[#F4F1EA]">
              {WATTS_PER_PAX} W/pax, &lt; {LIMITE_SPL_DB} dB SPL
            </p>
            <p className="mt-1 text-xs text-[#C9C4B8]">Ley 37/2003, limitador telemático</p>
          </div>
          <div className="rounded-2xl border border-[#1E1E26] bg-[#0A0A0E] p-6">
            <p className="text-xs text-[#8E8A80]">Canal único</p>
            <p className="mt-2 font-syne text-xl font-black tabular-nums text-[#F4F1EA]">
              {CENTRALITA_EAR_OS}
            </p>
            <p className="mt-1 text-xs text-[#C9C4B8]">Revisión humana del plano</p>
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#1E1E26] bg-[#0A0A0E] p-6">
          <p className="flex items-center gap-2 text-xs leading-relaxed text-[#C9C4B8]">
            <ShieldCheck size={15} className="shrink-0 text-[#57d99a]" aria-hidden="true" />
            El plano no cotiza: organiza. Cualquier importe del evento nace del presupuesto sellado.
          </p>
          <Link
            href="/presupuesto"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#ecb613] px-6 text-sm font-bold text-[#120D00] transition-colors duration-150 ease-out hover:bg-[#f7cb45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
          >
            Abrir presupuesto <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
