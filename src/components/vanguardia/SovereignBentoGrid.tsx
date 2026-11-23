'use client';

import React from 'react';
import { AudioLines, Car, LayoutGrid } from 'lucide-react';
import { LIMITE_SPL_DB } from '@/lib/constants/ear-os-ssot';
import { OTZARRETA_SEATING_PRESET } from '@/lib/constants/otzarreta-entity';
import AmbientGlowOrb from './AmbientGlowOrb';
import SeatingPlannerPreview from './SeatingPlannerPreview';
import { getVanguardiaTheme } from './vanguardia-theme';
import type { VanguardiaTheme, VanguardiaVariant } from './vanguardia-theme';

export interface SovereignBentoGridProps {
  variant?: VanguardiaVariant;
  /** Titulo de la ficha (por defecto el del recinto Otzarreta). */
  title?: string;
  className?: string;
}

interface AcousticBar {
  label: string;
  db: number;
}

/**
 * Escala ILUSTRATIVA para ilustrar el techo legal; NO son mediciones (AF-2).
 * El techo (LIMITE_SPL_DB) proviene del SSOT, no se teclea.
 */
const ILLUSTRATIVE_SCALE: readonly AcousticBar[] = [
  { label: 'Cena', db: 62 },
  { label: 'Baile', db: 70 },
  { label: 'Techo', db: LIMITE_SPL_DB },
];

const MIN_DB = 40;

function Card({
  theme,
  className,
  children,
}: {
  theme: VanguardiaTheme;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-5 ${theme.surface} ${theme.border} ${className}`}
    >
      {children}
    </div>
  );
}

function CardTitle({ theme, icon, text }: { theme: VanguardiaTheme; icon: React.ReactNode; text: string }) {
  return (
    <div className={`mb-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest ${theme.accentText}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

export default function SovereignBentoGrid({
  variant = 'oro',
  title = 'Caserio Otzarreta',
  className,
}: SovereignBentoGridProps) {
  const theme = getVanguardiaTheme(variant);
  const parking = OTZARRETA_SEATING_PRESET.parkingSpaces;

  return (
    <section
      className={`grid w-full auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 rounded-3xl p-4 sm:grid-cols-2 lg:grid-cols-4 ${theme.canvas} ${className ?? ''}`}
      aria-label={title}
    >
      <Card theme={theme} className="sm:col-span-2 lg:row-span-2">
        <AmbientGlowOrb variant={variant} position="top-right" size={360} intensity={0.2} />
        <div className="relative">
          <CardTitle theme={theme} icon={<LayoutGrid className="h-4 w-4" />} text="Plano de mesas" />
          <h3 className={`mb-4 text-2xl font-black tracking-tight ${theme.text}`}>{title}</h3>
          <SeatingPlannerPreview theme={theme} />
        </div>
      </Card>

      <Card theme={theme} className="lg:col-span-2">
        <AmbientGlowOrb variant={variant} position="bottom-left" size={280} intensity={0.16} />
        <div className="relative">
          <CardTitle theme={theme} icon={<AudioLines className="h-4 w-4" />} text="Acustica · Ley 37/2003" />
          <div className="flex h-[84px] items-end gap-3" role="img" aria-label={`Techo legal ${LIMITE_SPL_DB} dB`}>
            {ILLUSTRATIVE_SCALE.map((bar) => {
              const pct = Math.round(((bar.db - MIN_DB) / (LIMITE_SPL_DB - MIN_DB)) * 100);
              const isCeiling = bar.db === LIMITE_SPL_DB;
              return (
                <div key={bar.label} className="flex h-full flex-1 flex-col justify-end">
                  <div
                    className={`rounded-t-lg border ${isCeiling ? theme.badge : `${theme.border} ${theme.surface}`}`}
                    style={{ height: `${pct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-1 flex gap-3">
            {ILLUSTRATIVE_SCALE.map((bar) => (
              <span key={bar.label} className={`flex-1 text-center font-mono text-[10px] ${theme.muted}`}>
                {bar.label} {bar.db} dB
              </span>
            ))}
          </div>
          <p className={`mt-2 text-[11px] ${theme.muted}`}>
            Techo legal {LIMITE_SPL_DB} dB SPL. Escala ilustrativa, no es una medicion.
          </p>
        </div>
      </Card>

      <Card theme={theme} className="">
        <div className="relative flex h-full flex-col justify-between">
          <CardTitle theme={theme} icon={<Car className="h-4 w-4" />} text="Parking privado" />
          <div>
            <div className={`text-5xl font-black tabular-nums ${theme.text}`}>{parking}</div>
            <p className={`mt-1 text-xs ${theme.muted}`}>plazas cerradas, minimo garantizado</p>
          </div>
        </div>
      </Card>

      <Card theme={theme} className="">
        <div className="relative flex h-full flex-col justify-between">
          <CardTitle theme={theme} icon={<LayoutGrid className="h-4 w-4" />} text="Aforo" />
          <div>
            <div className={`text-5xl font-black tabular-nums ${theme.text}`}>{OTZARRETA_SEATING_PRESET.totalPax}</div>
            <p className={`mt-1 text-xs ${theme.muted}`}>comensales maximo, un evento al dia</p>
          </div>
        </div>
      </Card>
    </section>
  );
}
