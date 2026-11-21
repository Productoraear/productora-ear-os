/**
 * ════════════════════════════════════════════════════════════════════════════
 * BENTO MENU SECTION — CARTA OFICIAL DE MENÚS DE CELEBRACIÓN
 * ════════════════════════════════════════════════════════════════════════════
 * Server Component puro (cero `"use client"`, cero estado, cero JS enviado).
 *
 * Reglas de diseño (estándar Hallmark):
 *  · Superficie `#0A0A0E` sobre lienzo `#030305`, filo de 1 px `#1E1E26`:
 *    elevación por luminosidad, no por sombra difusa.
 *  · Rejilla Bento real: el menú insignia ocupa dos columnas; las tarjetas no
 *    son tres columnas idénticas de icono+título.
 *  · Jerarquía tipográfica Syne (display) / Montserrat (cuerpo), cifras
 *    tabulares para que los importes se alineen en columna.
 *  · Cero emojis, cero degradados de texto, cero texto apelmazado.
 *
 * Invariante de dinero (INV-10): aquí NO se escribe ningún importe. Los menús
 * y sus precios llegan de `OTZARRETA_WEDDING_MENUS`; el suelo «desde» sale de
 * `weddingPriceFromEur`. Este componente no puede desviarse del SSOT.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import Link from 'next/link';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import {
  OTZARRETA_ENTITY,
  OTZARRETA_WEDDING_MENUS,
  formatOtzarretaMenuPrice,
} from '@/lib/constants/otzarreta-entity';

export interface BentoMenuSectionProps {
  /** CTA canónico de bloqueo de fecha (calendario soberano del proveedor). */
  readonly blockHref: string;
  /** Expediente contractual del depósito deducible (condiciones 80/10/10). */
  readonly contractHref: string;
}

export default function BentoMenuSection({
  blockHref,
  contractHref,
}: BentoMenuSectionProps): React.JSX.Element {
  // El menú insignia es el de mayor importe publicado: se destaca por dato, no por gusto.
  const flagship = OTZARRETA_WEDDING_MENUS.reduce(
    (best, menu) => ((menu.priceEur ?? 0) > (best.priceEur ?? 0) ? menu : best),
    OTZARRETA_WEDDING_MENUS[0],
  );

  return (
    <section
      id="carta-menus"
      aria-labelledby="carta-menus-title"
      className="mx-auto mt-20 max-w-[1520px] px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-[65ch]">
        <h2
          id="carta-menus-title"
          className="font-syne text-[clamp(1.75rem,3.4vw,2.75rem)] font-black leading-[1.06] tracking-[-0.02em] text-[#F4F1EA]"
        >
          Siete menús de celebración
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#C9C4B8] sm:text-base">
          Cada importe es por comensal y sin IVA, tal como figura en el dossier oficial de la casa. El
          menú se cierra en la visita técnica con la Conserjería.
        </p>
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {OTZARRETA_WEDDING_MENUS.map((menu) => {
          const isFlagship = menu.name === flagship.name;
          const price = formatOtzarretaMenuPrice(menu.priceEur);
          return (
            <li
              key={menu.name}
              className={`flex flex-col justify-between gap-6 rounded-2xl border bg-[#0A0A0E] p-6 transition-colors duration-200 ease-out sm:p-8 ${
                isFlagship
                  ? 'border-[#ecb613]/45 md:col-span-2'
                  : 'border-[#1E1E26] hover:border-[#ecb613]/35'
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-syne text-lg font-bold tracking-tight text-[#F4F1EA] sm:text-xl">
                    {menu.name}
                  </h3>
                  <p className="shrink-0 font-syne text-xl font-black tabular-nums tracking-tight text-[#ecb613] sm:text-2xl">
                    {price ?? 'A consultar'}
                  </p>
                </div>
                <p className="max-w-[52ch] text-sm leading-relaxed text-[#C9C4B8]">{menu.note}</p>
              </div>

              {menu.extras.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {menu.extras.map((extra) => (
                    <li
                      key={extra}
                      className="rounded-md border border-[#1E1E26] bg-white/[0.03] px-2.5 py-1 text-xs text-[#D6D2C7]"
                    >
                      {extra}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-[#8E8A80]">Sin complementos adicionales</span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/[0.04] p-6 sm:p-8">
        <div className="max-w-[58ch]">
          <p className="text-sm font-semibold text-[#F4F1EA]">
            Menús de celebración desde {OTZARRETA_ENTITY.weddingPriceFromEur} € + IVA
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#C9C4B8]">
            La fianza de {DEPOSITO_STRIPE_EUR} € sella la fecha en la agenda de la casa y se descuenta al
            100 % de la liquidación final.{' '}
            <Link
              href={contractHref}
              className="underline decoration-dotted underline-offset-4 transition-colors hover:text-[#ecb613] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              Condiciones del depósito y split 80/10/10
            </Link>
          </p>
        </div>
        <a
          href={blockHref}
          className="inline-flex min-h-[48px] items-center rounded-xl bg-[#ecb613] px-6 text-sm font-bold text-[#120D00] transition-colors duration-150 ease-out hover:bg-[#f7cb45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
        >
          Asegurar fecha, fianza deducible {DEPOSITO_STRIPE_EUR} €
        </a>
      </div>
    </section>
  );
}
