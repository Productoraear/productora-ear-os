"use client";

import React, { useMemo } from 'react';
import { MapPin, Navigation, Zap, ShieldCheck, Home } from 'lucide-react';
import type { AcgState, AcgAction, AcgVenueType } from '@/lib/acg/acgDecisionEngine';
import {
  ACG_SSOT,
  ACG_ACCENT,
  calculateLogisticsAcg,
  calculateAcousticAcg,
  formatEur,
} from '@/lib/acg/acgDecisionEngine';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';

interface UberRouteRadarProps {
  state: AcgState;
  dispatch: React.Dispatch<AcgAction>;
}

const VENUE_OPTIONS: { id: AcgVenueType; label: string }[] = [
  { id: 'FINCA_EXTERIOR', label: 'Finca Exterior' },
  { id: 'SALON_BODA', label: 'Salón de Boda' },
  { id: 'IGLESIA', label: 'Iglesia / Ceremonia' },
  { id: 'PLAZA_PUBLICA', label: 'Plaza Pública' },
  { id: 'RESIDENCIA_MAYORES', label: 'Residencia VIMUME' },
];

export default function UberRouteRadar({ state, dispatch }: UberRouteRadarProps) {
  const fincas = SCLASS_12_FINCAS_HOMOLOGADAS;
  const selectedFinca = fincas.find((f) => f.id === state.finca.fincaId) ?? fincas[0];

  const logistics = useMemo(
    () => calculateLogisticsAcg(state.finca.distanceKm, state.space.endHour),
    [state.finca.distanceKm, state.space.endHour],
  );

  const acoustic = useMemo(
    () => calculateAcousticAcg(state.space.pax, state.space.venueType),
    [state.space.pax, state.space.venueType],
  );

  const handleSelectFinca = (fincaId: string) => {
    const finca = fincas.find((f) => f.id === fincaId);
    if (!finca) return;
    dispatch({
      type: 'SELECT_FINCA',
      payload: { fincaId: finca.id, province: finca.provincia, distanceKm: finca.distanciaHubMentridaKm },
    });
  };

  const renderRouteSvg = () => {
    const width = 100;
    const height = 100;
    const originX = 10;
    const originY = 50;
    const destX = 88;
    const destY = 38;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40" preserveAspectRatio="none">
        <defs>
          <linearGradient id="acg-route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={ACG_ACCENT.oro} stopOpacity="0.95" />
            <stop offset="100%" stopColor={ACG_ACCENT.cyan} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <line
          x1={originX}
          y1={originY}
          x2={destX}
          y2={destY}
          stroke="url(#acg-route-grad)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />
        <circle cx={originX} cy={originY} r="3.5" fill={ACG_ACCENT.oro} />
        <circle cx={destX} cy={destY} r="3.5" fill={ACG_ACCENT.cyan} />
        <text x={originX} y={originY - 8} className="fill-white/40" style={{ fontSize: 4.5, fontFamily: 'JetBrains Mono, monospace' }}>
          MÉNTRIDA HUB
        </text>
        <text x={destX - 18} y={destY - 8} className="fill-white/40" style={{ fontSize: 4, fontFamily: 'JetBrains Mono, monospace' }}>
          {selectedFinca.name.toUpperCase()}
        </text>
      </svg>
    );
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna mapa + finca */}
      <div className="lg:col-span-7 space-y-5">
        <div className="rounded-2xl bg-[#050507] border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center">
                <Navigation size={15} className="text-[#ecb613]" />
              </span>
              <div>
                <p className="font-syne text-sm font-black uppercase tracking-tight text-white">Radar Logístico Vectorial</p>
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Origen SSOT · {ACG_SSOT.HUB_MENTRIDA}</p>
              </div>
            </div>
            <span className="font-mono text-xs text-[#ecb613] font-bold">{state.finca.distanceKm} km</span>
          </div>
          {renderRouteSvg()}
        </div>

        <div className="rounded-2xl bg-[#050507] border border-white/10 p-6">
          <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">Finca de destino homologada</label>
          <select
            value={selectedFinca.id}
            onChange={(e) => handleSelectFinca(e.target.value)}
            className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#ecb613]"
          >
            {fincas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} · {f.provincia} · {f.distanciaHubMentridaKm} km
              </option>
            ))}
          </select>
          <p className="font-mono text-[11px] text-white/50 mt-3 leading-relaxed">
            {selectedFinca.description}
          </p>
        </div>
      </div>

      {/* Columna telemetría */}
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-2xl bg-[#050507] border border-white/10 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-[#ecb613]" />
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Aforo · {state.space.pax} pax</span>
          </div>
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={state.space.pax}
            onChange={(e) => dispatch({ type: 'SET_SPACE', payload: { pax: Number(e.target.value) } })}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#ecb613]"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <span className="block font-mono text-[10px] text-white/40 uppercase">Potencia RMS</span>
              <span className="font-mono text-xl text-white font-bold">{acoustic.totalWatts} W</span>
              <span className="font-mono text-[10px] text-[#ecb613]">{acoustic.wattsPerPax} W/pax · SSOT</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <span className="block font-mono text-[10px] text-white/40 uppercase">Sistema Asignado</span>
              <span className="font-mono text-sm text-white font-bold">{acoustic.recommendedSystem}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#050507] border border-white/10 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-[#00E5FF]" />
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Desglose Logístico SSOT</span>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between"><span className="text-white/50">Km facturables</span><span className="text-white">{logistics.billableKm} km</span></div>
            <div className="flex justify-between"><span className="text-white/50">Coste km × {ACG_SSOT.LOGISTICA_EUR_KM} €</span><span className="text-white">{formatEur(logistics.kmCost)} €</span></div>
            <div className="flex justify-between"><span className="text-white/50">Suplemento hotel</span><span className="text-white">{logistics.requiresAccommodation ? '+120,00 €' : '0,00 €'}</span></div>
            <div className="border-t border-white/10 pt-2 flex justify-between text-sm"><span className="text-white/60">Total logística</span><span className="text-[#ecb613] font-bold">{formatEur(logistics.totalLogistics)} €</span></div>
          </div>

          <div className="pt-2">
            <label className="block font-mono text-[10px] text-white/40 uppercase mb-2">Tipo de venue · SPL límite</label>
            <select
              value={state.space.venueType}
              onChange={(e) => dispatch({ type: 'SET_SPACE', payload: { venueType: e.target.value as AcgVenueType } })}
              className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#00E5FF]"
            >
              {VENUE_OPTIONS.map((v) => (
                <option key={v.id} value={v.id}>{v.label} · {calculateAcousticAcg(state.space.pax, v.id).maxSplDb} dB</option>
              ))}
            </select>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-start gap-3 ${acoustic.isB2GCompliant ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-[#ecb613]/30 bg-[#ecb613]/5'}`}>
          <ShieldCheck size={18} className={acoustic.isB2GCompliant ? 'text-emerald-400 shrink-0' : 'text-[#ecb613] shrink-0'} />
          <p className="font-mono text-[11px] leading-relaxed text-white/70">
            {acoustic.isB2GCompliant
              ? `Protocolo B2G compatible: ${acoustic.maxSplDb} dB SPL < 75 dB (Art. 118 LCSP).`
              : `Venue estándar: ${acoustic.maxSplDb} dB SPL. En contexto B2G/VIMUME se limitará a < 75 dB.`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'GO_NEXT' })}
          className="w-full py-4 rounded-xl bg-[#ecb613] text-black font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(236,182,19,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <Home size={16} /> Confirmar ruta · Siguiente
        </button>
      </div>
    </div>
  );
}