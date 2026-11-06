'use client';

import React, { useState } from 'react';
import {
  Volume2,
  Shield,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import {
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SUPLEMENTO_HOTEL_EUR,
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
} from '@/lib/constants/ear-os-ssot';

interface SpacePreset {
  id: string;
  name: string;
  category: string;
  distanceKm: number;
  dbLimit: string;
  attendees: number;
  description: string;
}

const PRESETS: SpacePreset[] = [
  {
    id: 'finca-toledo',
    name: 'Finca Señorial · Toledo',
    category: 'Boda / Gala Exclusiva',
    distanceKm: 45,
    dbLimit: '85 - 90 dBA',
    attendees: 180,
    description: 'Espacio exterior ajardinado. Acústica distribuida para cóctel y banquete sin solapamiento sonoro.',
  },
  {
    id: 'plaza-madrid',
    name: 'Plaza Mayor / Festejo · Madrid Sur',
    category: 'Festejo Popular / Municipal',
    distanceKm: 75,
    dbLimit: '90 - 100 dBA',
    attendees: 600,
    description: 'Directo de gran formato con limitador telemático conectado a policía local y cobertura homogénea.',
  },
  {
    id: 'gala-bodega',
    name: 'Bodega Privada · Méntrida Hub',
    category: 'Cóctel Corporativo VIP',
    distanceKm: 15,
    dbLimit: '75 - 80 dBA',
    attendees: 90,
    description: 'Acústica de cámara cálida. Directo acústico solista de Edwin Agudelo con fidelidad audiophile.',
  },
];

export function LumenInteractiveShowcase() {
  const [selectedPreset, setSelectedPreset] = useState<SpacePreset>(PRESETS[0]);
  const [isLateNight, setIsLateNight] = useState<boolean>(false);

  // Exact S-Class logistics calculation from SSOT
  const kmFacturables = Math.max(0, selectedPreset.distanceKm - LOGISTICA_KM_EXENTOS);
  const costeKm = kmFacturables * LOGISTICA_EUR_PER_KM;
  const suplementoHotel = isLateNight || selectedPreset.distanceKm > 200 ? SUPLEMENTO_HOTEL_EUR : 0;
  const totalPresupuesto = TARIFA_BASE_SOLISTA_EUR + costeKm + suplementoHotel;
  const liquidacionFinal = totalPresupuesto - DEPOSITO_STRIPE_EUR;

  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
          <Sliders className="w-3.5 h-3.5" />
          Simulador Acústico & Logístico S-Class
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
          Calibración de Espacio en Tiempo Real
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mt-3 font-sans">
          Selecciona la tipología del recinto y observa el cálculo transparente con desglose canónico.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Presets List (Left col 5) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-xs font-mono uppercase text-zinc-500 px-1">Espacios Precalibrados</span>
          {PRESETS.map((preset) => {
            const isActive = preset.id === selectedPreset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPreset(preset)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_25px_rgba(236,182,19,0.15)] ring-1 ring-amber-500/30'
                    : 'border-white/10 bg-zinc-950/60 hover:border-white/20 hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono ${isActive ? 'text-amber-300' : 'text-zinc-400'}`}>
                    {preset.category}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-white/5">
                    {preset.distanceKm} km
                  </span>
                </div>
                <div className="text-lg font-bold text-white mb-1">{preset.name}</div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{preset.description}</p>
              </button>
            );
          })}

          {/* Late Night Toggle */}
          <div className="mt-4 p-4 rounded-xl border border-white/10 bg-zinc-950/60 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-zinc-200">Finalización Nocturna (≥ 3:00 AM)</div>
              <div className="text-xs text-zinc-500 font-mono">Activa suplemento hotelero reglamentario (+120 €)</div>
            </div>
            <button
              type="button"
              onClick={() => setIsLateNight(!isLateNight)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                isLateNight ? 'bg-amber-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  isLateNight ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Live Hardware/Acoustic HUD Panel (Right col 7) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  HUD Acústico & Liquidación
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">{selectedPreset.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-500 font-mono block">Límite Sonoro Legal</span>
                <span className="text-sm font-mono font-bold text-cyan-400">{selectedPreset.dbLimit}</span>
              </div>
            </div>

            {/* Spec telemetry tags */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono mb-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> Distancia
                </div>
                <div className="text-lg font-bold font-mono text-white">{selectedPreset.distanceKm} km</div>
                <div className="text-[10px] text-zinc-500">
                  {selectedPreset.distanceKm <= LOGISTICA_KM_EXENTOS ? 'Exento (≤ 50 km)' : `${kmFacturables} km facturables`}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono mb-1">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Presión SPL
                </div>
                <div className="text-lg font-bold font-mono text-white">{selectedPreset.dbLimit}</div>
                <div className="text-[10px] text-zinc-500">Limitador telemático</div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono mb-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> Garantía
                </div>
                <div className="text-lg font-bold font-mono text-white">Price-Lock</div>
                <div className="text-[10px] text-zinc-500">SHA-256 inmutable</div>
              </div>
            </div>

            {/* Financial Ledger Breakdown in Integer Cents */}
            <div className="space-y-2.5 py-4 border-y border-white/5 text-sm font-mono">
              <div className="flex justify-between text-zinc-300">
                <span>Tarifa Base Solista (Edwin Agudelo)</span>
                <span>{TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Logística GPS ({selectedPreset.distanceKm} km)</span>
                <span>{costeKm > 0 ? `+${costeKm.toFixed(2)} €` : '0.00 € (Exento)'}</span>
              </div>
              {suplementoHotel > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Suplemento Hotel (Fin &gt; 3:00 AM)</span>
                  <span>+{suplementoHotel.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-400 pt-2 border-t border-white/5 font-bold">
                <span>Depósito VIP Deducible en Stripe</span>
                <span>-{DEPOSITO_STRIPE_EUR.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-zinc-500 font-mono">Liquidación Final en Evento</div>
              <div className="text-3xl font-black font-mono text-white">
                {liquidacionFinal.toFixed(2)} €
                <span className="text-xs text-zinc-500 font-sans font-normal ml-2">
                  (Total {totalPresupuesto.toFixed(2)} €)
                </span>
              </div>
            </div>

            <a
              href={`/booking?tier=vip&preset=${selectedPreset.id}&late=${isLateNight ? '1' : '0'}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)]"
            >
              <span>Confirmar Bloqueo</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

