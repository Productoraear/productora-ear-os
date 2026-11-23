'use client';

import React, { useState } from 'react';
import { OTZARRETA_SEATING_PRESET } from '@/lib/constants/otzarreta-entity';
import type { VanguardiaTheme } from './vanguardia-theme';

export interface SeatingPlannerPreviewProps {
  theme: VanguardiaTheme;
  /** Comensales por mesa (por defecto 10). */
  paxPerTable?: number;
}

const GUEST_STEPS: readonly number[] = [50, 100, 150, OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax];

/**
 * Previsualizacion del plano de mesas. Rejilla de geometria fija (una celda por mesa posible):
 * cambiar el numero de comensales solo cambia el relleno, nunca el tamano (CLS 0).
 * Pasos discretos: no hay slider continuo, por lo que no requiere debounce (INV-19).
 */
export default function SeatingPlannerPreview({ theme, paxPerTable = 10 }: SeatingPlannerPreviewProps) {
  const [guests, setGuests] = useState<number>(GUEST_STEPS[1]);
  const slots = Math.ceil(OTZARRETA_SEATING_PRESET.totalPax / paxPerTable);
  const used = Math.min(slots, Math.ceil(guests / paxPerTable));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Numero de comensales">
        {GUEST_STEPS.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => setGuests(step)}
            aria-pressed={guests === step}
            className={`min-h-[32px] rounded-lg border px-2.5 font-mono text-[11px] font-bold transition-colors ${
              guests === step ? `${theme.badge}` : `${theme.border} ${theme.muted}`
            }`}
          >
            {step}
          </button>
        ))}
      </div>

      <div
        className="mt-3 grid h-[88px] grid-cols-10 gap-1.5"
        role="img"
        aria-label={`Plano de ${used} mesas para ${guests} comensales`}
      >
        {Array.from({ length: slots }, (_, index) => (
          <span
            key={index}
            className={`rounded-full border transition-colors duration-300 ${
              index < used
                ? `${theme.badge}`
                : theme.isDark
                  ? 'border-white/10 bg-white/[0.02]'
                  : 'border-zinc-900/10 bg-zinc-900/[0.03]'
            }`}
          />
        ))}
      </div>

      <p className={`mt-2 font-mono text-[11px] ${theme.muted}`}>
        {used} de {slots} mesas de {paxPerTable} · {guests} comensales · aforo maximo{' '}
        {OTZARRETA_SEATING_PRESET.totalPax}
      </p>
    </div>
  );
}
