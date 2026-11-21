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
 * y sus precios llegan de `OTZARRETA_WEDDING_MENUS`; el reclamo de cabecera y el
 * suelo «desde» salen de `OTZARRETA_WEDDING_MENUS_CLAIM` (derivado del primer
 * menú de la carta). Este componente no puede desviarse del SSOT.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import Link from 'next/link';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import {
  OTZARRETA_WEDDING_MENUS,
  OTZARRETA_WEDDING_MENUS_CLAIM,
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
          className="font-syne text-[clamp(1.75rem,3.4vw,2.75rem)] font-black leading-[1.06] tracking-display text-[#F4F1EA] [overflow-wrap:break-word]"
        >
          {OTZARRETA_WEDDING_MENUS_CLAIM}
        </h2>
        <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-[#C9C4B8] sm:text-base">
          Carta de gala vigente con {OTZARRETA_WEDDING_MENUS.length} menús. Cada importe es por
          comensal y sin IVA; el menú se cierra en la visita técnica con la Conserjería.
        </p>
      </div>

      {/* Bento real: el menú insignia ocupa dos columnas en escritorio; las
          pistas usan minmax(0, 1fr) para que las cifras nunca desborden. */}
      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {OTZARRETA_WEDDING_MENUS.map((menu) => {
          const isFlagship = menu.name === flagship.name;
          const price = formatOtzarretaMenuPrice(menu.priceEur);
          return (
            <li
              key={menu.name}
              className={`hallmark-card ${isFlagship ? 'md:col-span-2 lg:col-span-2 aura-glow' : ''}`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="min-w-0 font-syne text-lg font-bold tracking-display text-[#F4F1EA] [overflow-wrap:break-word] sm:text-xl">
                    {menu.name}
                  </h3>
                  <p className="shrink-0 font-syne text-xl font-black tabular-nums tracking-display text-[#ecb613] sm:text-2xl">
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
                      className="rounded-well border border-[#1E1E26] bg-white/[0.03] px-2.5 py-1 text-xs text-[#D6D2C7]"
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

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-card border border-[#ecb613]/30 bg-[#ecb613]/[0.04] p-6 shadow-inset-hairline-gold sm:p-8">
        <div className="max-w-[58ch]">
          <p className="text-sm font-semibold text-[#F4F1EA]">{OTZARRETA_WEDDING_MENUS_CLAIM}</p>
          <p className="mt-1 text-xs leading-relaxed text-[#C9C4B8]">
            La fianza de {DEPOSITO_STRIPE_EUR} € sella la fecha en la agenda de la casa y se descuenta al
            100 % de la liquidación final.{' '}
            <Link
              href={contractHref}
              className="underline decoration-dotted underline-offset-4 transition-colors duration-160 ease-hallmark hover:text-[#ecb613] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613] active:text-[#f7cb45]"
            >
              Condiciones del depósito y split 80/10/10
            </Link>
          </p>
        </div>
        <a
          href={blockHref}
          className="hallmark-btn-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613] active:scale-[0.985] motion-reduce:active:scale-100"
        >
          Asegurar fecha, fianza deducible {DEPOSITO_STRIPE_EUR} €
        </a>
      </div>
    </section>
  );
}

