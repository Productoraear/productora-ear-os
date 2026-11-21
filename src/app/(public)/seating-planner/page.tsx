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
            <h1 className="font-syne text-[clamp(2rem,4.6vw,3.5rem)] font-black leading-[1.04] tracking-display-tight text-[#F4F1EA] [overflow-wrap:break-word] [min-width:0]">
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
                className="hallmark-btn-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613] active:scale-[0.985] motion-reduce:active:scale-100"
              >
                Abrir el plano táctil
              </a>
              <Link
                href="/presupuesto"
                className="hallmark-btn-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 active:bg-white/[0.1] motion-reduce:transition-none"
              >
                Abrir presupuesto <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Ficha técnica del lienzo: datos del SSOT, no copy. */}
          <dl className="grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-5 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <dt className="hallmark-label text-xs">Rejilla</dt>
              <dd className="mt-1 font-syne text-lg font-bold tabular-nums tracking-display text-[#F4F1EA]">1 m</dd>
            </div>
            <div>
              <dt className="hallmark-label text-xs">Plazas</dt>
              <dd className="mt-1 font-syne text-lg font-bold tabular-nums tracking-display text-[#F4F1EA]">2 a 12</dd>
            </div>
            <div>
              <dt className="hallmark-label text-xs">Salida</dt>
              <dd className="mt-1 font-syne text-lg font-bold tracking-display text-[#F4F1EA]">A4 y SVG</dd>
            </div>
          </dl>
        </header>

        {/* Lienzo Blueprint milimétrico: retícula doble (8 px fina al 2,5 %,
            24 px base) sobre #0F0F16, radio único de 14 px y filo hairline de
            1 px. `scroll-mt` reserva la altura de la barra fija para que el
            salto del ancla no reordene el flujo (CLS 0).
            Material: DESIGN.md §8 «Aura Onyx Hallmark S-Class». */}
        <div id="plano" className="hallmark-blueprint scroll-mt-28 p-2 shadow-elevation-1 sm:p-3">
          <div className="rounded-card bg-blueprint-fine">
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
        </div>

        {/* Evidencia operativa: cifras leídas del SSOT, no de copy.
            Cada tarjeta lleva micro-borde de 1 px; el resplandor es un anillo
            perimetral, nunca un halo difuso. */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="hallmark-card shadow-micro-border">
            <p className="hallmark-label">Aforo canónico Otzarreta</p>
            <p className="hallmark-figure text-xl font-black">
              {OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} /{' '}
              {OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax}
            </p>
            <p className="text-xs leading-relaxed text-[#C9C4B8]">
              {OTZARRETA_SEATING_PRESET.interiorSalon.label} y {OTZARRETA_SEATING_PRESET.exteriorGarden.label}
            </p>
          </div>
          <div className="hallmark-card shadow-micro-border">
            <p className="hallmark-label">Split soberano</p>
            <p className="hallmark-figure text-xl font-black">
              {Math.round(SPLIT_SOBERANO.artista * 100)} / {Math.round(SPLIT_SOBERANO.earOs * 100)} /{' '}
              {Math.round(SPLIT_SOBERANO.vimume * 100)}
            </p>
            <p className="text-xs leading-relaxed text-[#C9C4B8]">Artista, infraestructura y VIMUME</p>
          </div>
          <div className="hallmark-card shadow-micro-border">
            <p className="hallmark-label">Rider acústico</p>
            <p className="hallmark-figure text-xl font-black">
              {WATTS_PER_PAX} W/pax, &lt; {LIMITE_SPL_DB} dB SPL
            </p>
            <p className="text-xs leading-relaxed text-[#C9C4B8]">Ley 37/2003, limitador telemático</p>
          </div>
          <div className="hallmark-card shadow-perimeter-gold">
            <p className="hallmark-label">Canal único</p>
            <p className="hallmark-figure text-xl font-black tabular-nums">{CENTRALITA_EAR_OS}</p>
            <p className="text-xs leading-relaxed text-[#C9C4B8]">Revisión humana del plano</p>
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-[#1E1E26] bg-[#08080C] p-6 shadow-inset-hairline">
          <p className="flex items-center gap-2 text-xs leading-relaxed text-[#C9C4B8]">
            <ShieldCheck size={15} className="shrink-0 text-[#57d99a]" aria-hidden="true" />
            El plano no cotiza: organiza. Cualquier importe del evento nace del presupuesto sellado.
          </p>
          <Link
            href="/presupuesto"
            className="hallmark-btn-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613] active:scale-[0.985] motion-reduce:active:scale-100"
          >
            Abrir presupuesto <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
