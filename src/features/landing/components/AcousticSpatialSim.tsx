'use client';

// src/features/landing/components/AcousticSpatialSim.tsx
//
// SIMULADOR ACÚSTICO & ESPACIAL INTERACTIVO
// Slider 50-500 pax → potencia RMS calibrada (pax × 12 W), límite SPL < 75 dB
// y onda senoidal animada demostrando fidelidad acústica.

import { useMemo, useState } from 'react';
import { calculateAcousticPower, SPL_LIMIT_DB, WATTS_PER_PAX } from '@/lib/seo/searchIntentEngine';

const ACCENT = '#ecb613';

interface AcousticSpatialSimProps {
  maxPax?: number;
}

function buildWavePath(amplitude: number, width: number, height: number): string {
  const mid = height / 2;
  const cycles = 3;
  const step = 4;
  let d = `M 0 ${mid}`;
  for (let x = 0; x <= width; x += step) {
    const y = mid - Math.sin((x / width) * Math.PI * 2 * cycles) * amplitude;
    d += ` L ${x} ${y.toFixed(2)}`;
  }
  return d;
}

export default function AcousticSpatialSim({ maxPax = 500 }: AcousticSpatialSimProps) {
  const [pax, setPax] = useState(150);
  const profile = useMemo(() => calculateAcousticPower(pax), [pax]);
  const amplitude = 8 + (pax / maxPax) * 34;

  const wavePath = useMemo(() => buildWavePath(amplitude, 600, 120), [amplitude]);

  return (
    <section className="w-full overflow-x-hidden border border-white/10 rounded-2xl bg-[#050507] p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
            Acoustic Spatial Sim
          </p>
          <h3 className="font-display text-xl md:text-2xl font-bold text-white mt-1" style={{ fontFamily: 'Syne, sans-serif' }}>
            Calibra tu evento al vatio exacto
          </h3>
        </div>
        <span className="shrink-0 font-mono text-3xl font-bold" style={{ color: ACCENT }}>
          {pax}
          <span className="text-sm text-white/50 font-normal"> pax</span>
        </span>
      </div>

      <input
        type="range"
        min={50}
        max={maxPax}
        step={10}
        value={pax}
        onChange={e => setPax(Number(e.target.value))}
        aria-label="Número de invitados"
        className="w-full h-2 appearance-none rounded-full bg-white/10 accent-[#ecb613] cursor-pointer"
      />

      <div className="grid grid-cols-3 gap-3 mt-6 font-mono">
        <div className="rounded-xl bg-[#030305] border border-white/10 p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Potencia RMS</p>
          <p className="text-lg md:text-xl text-white font-bold mt-1">
            {profile.wattsRms.toLocaleString('es-ES')} <span className="text-white/40 text-sm">W</span>
          </p>
          <p className="text-[10px] text-white/40 mt-1">{WATTS_PER_PAX} W/pax calibrados</p>
        </div>
        <div className="rounded-xl bg-[#030305] border border-white/10 p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">SPL estimado</p>
          <p className="text-lg md:text-xl text-white font-bold mt-1">
            {profile.estimatedSplDb} <span className="text-white/40 text-sm">dB</span>
          </p>
          <p className="text-[10px] text-white/40 mt-1">límite municipal</p>
        </div>
        <div className="rounded-xl bg-[#030305] border border-white/10 p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Cumplimiento</p>
          <p className="text-lg md:text-xl font-bold mt-1" style={{ color: profile.isSplCompliant ? '#00E5FF' : '#FF2B44' }}>
            {profile.isSplCompliant ? 'OK' : 'Riesgo'}
          </p>
          <p className="text-[10px] text-white/40 mt-1">≤ {SPL_LIMIT_DB} dB SPL</p>
        </div>
      </div>

      <p className="font-mono text-xs text-white/60 mt-4">{profile.recommendedSystem} · Bose F1 812 / S1 Pro + Shure Beta 87A</p>

      <div className="mt-6 rounded-xl bg-[#030305] border border-white/10 overflow-hidden">
        <svg
          viewBox="0 0 600 120"
          preserveAspectRatio="none"
          className="w-full h-28 wave-anim"
          role="img"
          aria-label="Onda senoidal de fidelidad acústica"
        >
          <path d={wavePath} fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
          <path d={wavePath} fill="none" stroke="rgba(236,182,19,0.25)" strokeWidth="9" strokeLinecap="round" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes hormozi-wave-drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-30px); }
        }
        .wave-anim {
          animation: hormozi-wave-drift 4s linear infinite;
        }
      `}</style>
    </section>
  );
}