'use client';

// src/features/landing/components/MentridaFleetTracker.tsx
//
// WIDGET TÁCTICO DE TELEMETRÍA Y DISTANCIA
// Detecta la provincia, muestra la distancia desde Méntrida, tarifa 1,50 €/km
// (gratis los primeros 50 km) y la Garantía de Relevo Uber 0% cancelaciones.

import { useMemo } from 'react';
import type { MentridaLogistics } from '@/lib/seo/searchIntentEngine';

const ACCENT = '#00E5FF';

interface MentridaFleetTrackerProps {
  logistics: MentridaLogistics;
}

function etaMinutes(distanceKm: number): number {
  return Math.max(20, Math.round(distanceKm * 1.1));
}

export default function MentridaFleetTracker({ logistics }: MentridaFleetTrackerProps) {
  const eta = useMemo(() => etaMinutes(logistics.distanceKm), [logistics.distanceKm]);

  return (
    <section className="w-full overflow-x-hidden border border-white/10 rounded-2xl bg-[#050507] p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
            Mentrida Fleet Tracker
          </p>
          <h3 className="font-display text-xl md:text-2xl font-bold text-white mt-1" style={{ fontFamily: 'Syne, sans-serif' }}>
            Base de operaciones: Méntrida
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-[#030305] border px-3 py-1 font-mono text-xs" style={{ color: ACCENT }}>
          EN RUTA
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono">
        <div className="rounded-xl bg-[#030305] border border-white/10 p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Distancia al recinto</p>
          <p className="text-2xl text-white font-bold mt-1">
            {logistics.distanceKm} <span className="text-white/40 text-sm">km</span>
          </p>
        </div>
        <div className="rounded-xl bg-[#030305] border border-white/10 p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">ETA despiece</p>
          <p className="text-2xl text-white font-bold mt-1">
            {eta} <span className="text-white/40 text-sm">min</span>
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-[#030305] border border-white/10 p-4 font-mono">
        <p className="text-[10px] uppercase tracking-wider text-white/40">Tarifa kilométrica transparente</p>
        <p className="text-lg text-white font-bold mt-1">
          {logistics.billableKm > 0 ? `${logistics.billableKm} km × 1,50 €` : 'Gratis (primeros 50 km)'}
          <span className="text-white/40 text-sm"> = {logistics.kmFee.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
        </p>
        {logistics.isHotelApplied && (
          <p className="text-xs mt-1" style={{ color: ACCENT }}>
            + {logistics.hotelFee.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} Hotel (hora fin ≥ 3:00 AM o {String.fromCharCode(62)} 200 km)
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border p-4" style={{ borderColor: 'rgba(0,229,255,0.3)', background: 'rgba(0,229,255,0.05)' }}>
        <span className="h-2.5 w-2.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
        <p className="text-sm text-white/80">
          <span className="font-semibold text-white">Garantía de Relevo Uber:</span> si hay avería en carretera, la unidad de
          soporte del Arsenal llega en menos de 45 minutos. <span className="font-bold" style={{ color: ACCENT }}>0% cancelaciones.</span>
        </p>
      </div>
    </section>
  );
}