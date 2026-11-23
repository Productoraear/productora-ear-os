'use client';

import React from 'react';
import { Car } from 'lucide-react';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  LIMITE_SPL_DB,
  LOGISTICA_EUR_PER_KM,
  SOLISTA_KM_INCLUIDOS,
  SPLIT_SOBERANO,
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';
import { OTZARRETA_SEATING_PRESET, OTZARRETA_WEDDING_MENUS, formatOtzarretaMenuPrice } from '@/lib/constants/otzarreta-entity';
import SeatingPlannerPreview from '@/components/vanguardia/SeatingPlannerPreview';
import { getVanguardiaTheme } from '@/components/vanguardia/vanguardia-theme';

/** Formato es-ES determinista (igual en servidor y cliente): 14250 -> "14.250,00 €". */
function formatEur(amount: number): string {
  const [integer, decimals] = amount.toFixed(2).split('.');
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals} €`;
}

const CARD = 'relative flex flex-col gap-3 rounded-3xl border p-6 backdrop-blur-xl';

/**
 * Capa 3 · Cristal transaccional. Bento de tres actos con cifras leídas del SSOT.
 * El 3D tilt NO está implementado aquí: requeriría reseñas reales verificadas.
 */
export default function SpatialBentoHub(): React.JSX.Element {
  const theme = getVanguardiaTheme('oro');
  const card = `${CARD} ${theme.surface} ${theme.border}`;
  const artistaPct = Math.round(SPLIT_SOBERANO.artista * 100);
  const earOsPct = Math.round(SPLIT_SOBERANO.earOs * 100);
  const vimumePct = Math.round(SPLIT_SOBERANO.vimume * 100);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 md:grid-cols-2">
      <section aria-labelledby="acto-gastronomia" className={`${card} md:col-span-2`}>
        <h2 id="acto-gastronomia" className={`text-lg font-semibold ${theme.text}`}>Asador Otzarreta · Derio (Bizkaia)</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {OTZARRETA_WEDDING_MENUS.map((menu) => (
            <li key={menu.name} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${theme.border}`}>
              <span className={`text-sm ${theme.text}`}>{menu.name}</span>
              <span className={`font-mono text-sm ${theme.accentText}`}>{formatOtzarretaMenuPrice(menu.priceEur)} + IVA</span>
            </li>
          ))}
        </ul>
        <p className={`text-xs ${theme.muted}`}>
          Aforo comedor 50 a 200 comensales; {OTZARRETA_SEATING_PRESET.totalPax} con jardín y carpa. Párking privado de{' '}
          {OTZARRETA_SEATING_PRESET.parkingSpaces} plazas.
        </p>
        <SeatingPlannerPreview theme={theme} />
      </section>

      <section aria-labelledby="acto-musica" className={card}>
        <h2 id="acto-musica" className={`text-lg font-semibold ${theme.text}`}>Música soberana</h2>
        <p className={`text-sm ${theme.muted}`}>Tarifa oficial {formatEur(TARIFA_ESTANDAR_SOLISTA_EUR)} (incluye {SOLISTA_KM_INCLUIDOS} km).</p>
        <p className={`text-sm ${theme.muted}`}>Suelo promocional canónico {formatEur(TARIFA_BASE_SOLISTA_EUR)}.</p>
        <p className={`text-sm ${theme.muted}`}>Km extra: {formatEur(LOGISTICA_EUR_PER_KM)} por km.</p>
        <p className={`font-mono text-xs ${theme.accentText}`}>
          Split Soberano: {artistaPct}% Artista · {earOsPct}% EAR OS · {vimumePct}% VIMUME
        </p>
      </section>

      <section aria-labelledby="acto-b2g" className={card}>
        <h2 id="acto-b2g" className={`text-lg font-semibold ${theme.text}`}>Licitación municipal (B2G)</h2>
        <p className={`text-sm ${theme.muted}`}>
          Tope preventivo {formatEur(AJUSTE_PREVENTIVO_B2G_EUR)} bajo el Art. 118 LCSP (límite legal {formatEur(LIMITE_B2G_LCSP_EUR)}).
        </p>
        <p className={`text-sm ${theme.muted}`}>Límite acústico de referencia: {LIMITE_SPL_DB} dB SPL (Ley 37/2003).</p>
        <p className={`flex items-center gap-2 text-xs ${theme.muted}`}>
          <Car aria-hidden="true" className="h-4 w-4" /> Logística desde Méntrida (Toledo)
        </p>
      </section>
    </div>
  );
}
