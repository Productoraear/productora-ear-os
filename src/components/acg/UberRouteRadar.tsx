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
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-40"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Ruta logística desde Méntrida Hub hasta ${selectedFinca.name}, ${state.finca.distanceKm} kilómetros`}
      >
        <title>{`Ruta logística desde Méntrida Hub hasta ${selectedFinca.name}`}</title>
        <desc>{`Trayecto vectorial de ${state.finca.distanceKm} kilómetros desde el hub SSOT de Méntrida hasta la finca ${selectedFinca.name} en ${selectedFinca.provincia}.`}</desc>
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
    <div
      className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6"
      role="region"
      aria-label="Radar logístico y telemetría acústica del evento"
    >
      {/* Columna mapa + finca */}
      <div className="lg:col-span-7 space-y-5">
        <section
          className="rounded-2xl bg-[#050507] border border-white/10 p-6"
          aria-labelledby="acg-radar-heading"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center"
                aria-hidden="true"
              >
                <Navigation size={15} className="text-[#ecb613]" aria-hidden="true" />
              </span>
              <div>
                <p
                  id="acg-radar-heading"
                  className="font-syne text-sm font-black uppercase tracking-tight text-white"
                >
                  Radar Logístico Vectorial
                </p>
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  Origen SSOT · {ACG_SSOT.HUB_MENTRIDA}
                </p>
              </div>
            </div>
            <span
              className="font-mono text-xs text-[#ecb613] font-bold"
              aria-label={`Distancia total ${state.finca.distanceKm} kilómetros`}
            >
              {state.finca.distanceKm} km
            </span>
          </div>
          {renderRouteSvg()}
        </section>

        <section
          className="rounded-2xl bg-[#050507] border border-white/10 p-6"
          aria-labelledby="acg-finca-heading"
        >
          <label
            id="acg-finca-heading"
            htmlFor="acg-finca-select"
            className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3"
          >
            Finca de destino homologada
          </label>
          <select
            id="acg-finca-select"
            value={selectedFinca.id}
            onChange={(e) => handleSelectFinca(e.target.value)}
            aria-label="Finca de destino homologada"
            aria-describedby="acg-finca-description"
            className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#ecb613]"
          >
            {fincas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} · {f.provincia} · {f.distanciaHubMentridaKm} km
              </option>
            ))}
          </select>
          <p
            id="acg-finca-description"
            className="font-mono text-[11px] text-white/50 mt-3 leading-relaxed"
          >
            {selectedFinca.description}
          </p>
        </section>
      </div>

      {/* Columna telemetría */}
      <div className="lg:col-span-5 space-y-5">
        <section
          className="rounded-2xl bg-[#050507] border border-white/10 p-6 space-y-4"
          aria-labelledby="acg-acoustic-heading"
        >
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-[#ecb613]" aria-hidden="true" />
            <span
              id="acg-acoustic-heading"
              className="font-mono text-[10px] text-white/40 uppercase tracking-widest"
            >
              Aforo · {state.space.pax} pax
            </span>
          </div>
          <input
            id="acg-pax-range"
            type="range"
            min={50}
            max={500}
            step={10}
            value={state.space.pax}
            onChange={(e) => dispatch({ type: 'SET_SPACE', payload: { pax: Number(e.target.value) } })}
            aria-label="Aforo del evento en personas"
            aria-valuemin={50}
            aria-valuemax={500}
            aria-valuenow={state.space.pax}
            aria-valuetext={`${state.space.pax} personas`}
            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#ecb613]"
          />
          <div className="grid grid-cols-2 gap-3">
            <div
              className="p-4 rounded-xl bg-black/40 border border-white/5"
              role="group"
              aria-label={`Potencia RMS total ${acoustic.totalWatts} vatios, ${acoustic.wattsPerPax} vatios por persona`}
            >
              <span className="block font-mono text-[10px] text-white/40 uppercase">Potencia RMS</span>
              <span className="font-mono text-xl text-white font-bold">{acoustic.totalWatts} W</span>
              <span className="font-mono text-[10px] text-[#ecb613]">{acoustic.wattsPerPax} W/pax · SSOT</span>
            </div>
            <div
              className="p-4 rounded-xl bg-black/40 border border-white/5"
              role="group"
              aria-label={`Sistema de sonido asignado: ${acoustic.recommendedSystem}`}
            >
              <span className="block font-mono text-[10px] text-white/40 uppercase">Sistema Asignado</span>
              <span className="font-mono text-sm text-white font-bold">{acoustic.recommendedSystem}</span>
            </div>
          </div>
        </section>

        <section
          className="rounded-2xl bg-[#050507] border border-white/10 p-6 space-y-3"
          aria-labelledby="acg-logistics-heading"
        >
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-[#00E5FF]" aria-hidden="true" />
            <span
              id="acg-logistics-heading"
              className="font-mono text-[10px] text-white/40 uppercase tracking-widest"
            >
              Desglose Logístico SSOT
            </span>
          </div>
          <dl
            className="space-y-2 font-mono text-xs"
            aria-label="Desglose de costes logísticos"
          >
            <div className="flex justify-between">
              <dt className="text-white/50">Km facturables</dt>
              <dd className="text-white">{logistics.billableKm} km</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Coste km × {ACG_SSOT.LOGISTICA_EUR_KM} €</dt>
              <dd className="text-white">{formatEur(logistics.kmCost)} €</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/50">Suplemento hotel</dt>
              <dd className="text-white">{logistics.requiresAccommodation ? '+120,00 €' : '0,00 €'}</dd>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between text-sm">
              <dt className="text-white/60">Total logística</dt>
              <dd className="text-[#ecb613] font-bold">{formatEur(logistics.totalLogistics)} €</dd>
            </div>
          </dl>

          <div className="pt-2">
            <label
              htmlFor="acg-venue-select"
              className="block font-mono text-[10px] text-white/40 uppercase mb-2"
            >
              Tipo de venue · SPL límite
            </label>
            <select
              id="acg-venue-select"
              value={state.space.venueType}
              onChange={(e) => dispatch({ type: 'SET_SPACE', payload: { venueType: e.target.value as AcgVenueType } })}
              aria-label="Tipo de venue y límite SPL"
              className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#00E5FF]"
            >
              {VENUE_OPTIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} · {calculateAcousticAcg(state.space.pax, v.id).maxSplDb} dB
                </option>
              ))}
            </select>
          </div>
        </section>

        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${acoustic.isB2GCompliant ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-[#ecb613]/30 bg-[#ecb613]/5'}`}
          role="status"
          aria-live="polite"
          aria-label={
            acoustic.isB2GCompliant
              ? `Protocolo B2G compatible: ${acoustic.maxSplDb} decibelios SPL, por debajo de 75 decibelios según el artículo 118 de la LCSP.`
              : `Venue estándar: ${acoustic.maxSplDb} decibelios SPL. En contexto B2G o VIMUME se limitará a menos de 75 decibelios.`
          }
        >
          <ShieldCheck
            size={18}
            aria-hidden="true"
            className={acoustic.isB2GCompliant ? 'text-emerald-400 shrink-0' : 'text-[#ecb613] shrink-0'}
          />
          <p className="font-mono text-[11px] leading-relaxed text-white/70">
            {acoustic.isB2GCompliant
              ? `Protocolo B2G compatible: ${acoustic.maxSplDb} dB SPL < 75 dB (Art. 118 LCSP).`
              : `Venue estándar: ${acoustic.maxSplDb} dB SPL. En contexto B2G/VIMUME se limitará a < 75 dB.`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'GO_NEXT' })}
          aria-label="Confirmar ruta logística y avanzar al siguiente paso"
          className="w-full py-4 rounded-xl bg-[#ecb613] text-black font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(236,182,19,0.4)] transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
        >
          <Home size={16} aria-hidden="true" /> Confirmar ruta · Siguiente
        </button>
      </div>
    </div>
  );
}