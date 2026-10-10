'use client';

import { useState } from 'react';
import { Calculator, MapPin, CheckCircle2 } from 'lucide-react';

type ShowFormat = 'solista' | 'quinteto';

const BASE_PRICES: Record<ShowFormat, number> = {
  solista: 350,
  quinteto: 550,
} as const;

const MUSICIAN_COUNT: Record<ShowFormat, number> = {
  solista: 1,
  quinteto: 5,
} as const;

const FREE_DISTANCE_KM = 50;
const TIER_1_MAX_KM = 150;
const TIER_2_MAX_KM = 300;
const TIER_1_RATE = 90;
const TIER_2_RATE = 120;
const TIER_3_RATE = 150;

function calculateDisplacement(format: ShowFormat, distance: number): number {
  if (distance <= FREE_DISTANCE_KM) return 0;
  const musicians = MUSICIAN_COUNT[format];
  if (distance <= TIER_1_MAX_KM) return musicians * TIER_1_RATE;
  if (distance <= TIER_2_MAX_KM) return musicians * TIER_2_RATE;
  return musicians * TIER_3_RATE;
}

export function EdwinPricingEngine() {
  const [format, setFormat] = useState<ShowFormat>('solista');
  const [distance, setDistance] = useState<number>(0);

  const basePrice = BASE_PRICES[format];
  const total = basePrice + calculateDisplacement(format, distance);

  return (
    <div
      role="group"
      aria-label="Cotizador instantáneo Edwin Agudelo"
      className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl"
    >
      <h3
        id="edwin-pricing-title"
        className="text-xl font-fraunces font-black mb-6 uppercase text-[#ecb613] flex items-center gap-2"
      >
        <Calculator size={20} aria-hidden="true" focusable="false" /> Cotización Instantánea
      </h3>

      {/* Selector de Formato */}
      <div
        role="group"
        aria-labelledby="edwin-format-label"
        className="space-y-4 mb-6"
      >
        <span
          id="edwin-format-label"
          className="block text-xs text-white/50 uppercase tracking-wider font-bold"
        >
          Formato del Espectáculo
        </span>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="edwin-format-label">
          <button
            type="button"
            role="radio"
            aria-checked={format === 'solista'}
            onClick={() => setFormat('solista')}
            aria-pressed={format === 'solista'}
            aria-label="Seleccionar formato Solista Premium, 350 euros base"
            className={`p-4 rounded-xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] ${
              format === 'solista'
                ? 'bg-[#ecb613]/10 border-[#ecb613] text-white'
                : 'bg-black/50 border-white/10 text-white/50'
            }`}
          >
            <span className="block font-bold mb-1">Solista Premium</span>
            <span className="text-xs">350€ Base</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={format === 'quinteto'}
            onClick={() => setFormat('quinteto')}
            aria-pressed={format === 'quinteto'}
            aria-label="Seleccionar formato Grupo de 5 músicos, 550 euros base"
            className={`p-4 rounded-xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] ${
              format === 'quinteto'
                ? 'bg-[#ecb613]/10 border-[#ecb613] text-white'
                : 'bg-black/50 border-white/10 text-white/50'
            }`}
          >
            <span className="block font-bold mb-1">Grupo (5 Músicos)</span>
            <span className="text-xs">550€ Base</span>
          </button>
        </div>
      </div>

      {/* Selector de Distancia */}
      <div className="space-y-4 mb-8">
        <label
          htmlFor="edwin-distance-range"
          className="text-xs text-white/50 uppercase tracking-wider font-bold flex justify-between"
        >
          <span>Distancia desde Madrid</span>
          <span className="text-[#ecb613]" aria-live="polite">
            {distance} km
          </span>
        </label>
        <input
          id="edwin-distance-range"
          type="range"
          min="0"
          max="500"
          step="10"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          aria-label="Distancia desde Madrid en kilómetros"
          aria-valuemin={0}
          aria-valuemax={500}
          aria-valuenow={distance}
          aria-valuetext={`${distance} kilómetros`}
          className="w-full accent-[#ecb613] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] rounded"
        />
        <div className="flex items-start gap-2 text-[10px] text-white/40">
          <MapPin size={12} className="shrink-0 mt-0.5" aria-hidden="true" focusable="false" />
          <p>
            Los primeros 50km están incluidos. A partir del km 51, se aplica tarifa de
            desplazamiento por músico.
          </p>
        </div>
      </div>

      {/* Resumen e Inclusiones */}
      <div
        role="region"
        aria-label="Resumen del presupuesto estimado"
        aria-live="polite"
        className="bg-black/60 rounded-xl p-4 mb-6 border border-white/5"
      >
        <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
          <span className="text-sm font-bold text-white/70">Presupuesto Estimado</span>
          <span
            className="text-3xl font-black text-white"
            aria-label={`Total estimado: ${total} euros`}
          >
            {total}€
          </span>
        </div>

        <ul className="space-y-2 text-xs text-white/60" aria-label="Inclusiones del paquete">
          <li className="flex gap-2 items-center">
            <CheckCircle2
              size={14}
              className="text-[#ecb613]"
              aria-hidden="true"
              focusable="false"
            />{' '}
            Equipo de Sonido Profesional
          </li>
          {format === 'solista' && (
            <>
              <li className="flex gap-2 items-center">
                <CheckCircle2
                  size={14}
                  className="text-[#ecb613]"
                  aria-hidden="true"
                  focusable="false"
                />{' '}
                Ramo de Flores Incluido
              </li>
              <li className="flex gap-2 items-center">
                <CheckCircle2
                  size={14}
                  className="text-[#ecb613]"
                  aria-hidden="true"
                  focusable="false"
                />{' '}
                Sombrero Charro (Sesión de fotos)
              </li>
              <li className="flex gap-2 items-center">
                <CheckCircle2
                  size={14}
                  className="text-[#ecb613]"
                  aria-hidden="true"
                  focusable="false"
                />{' '}
                Canción personalizada a elegir
              </li>
            </>
          )}
          {format === 'quinteto' && (
            <li className="flex gap-2 items-start text-white/40 italic mt-2">
              * Flores y sombrero fotográfico no incluidos en formato grupal salvo
              contratación extra.
            </li>
          )}
        </ul>
      </div>

      <button
        type="button"
        aria-label="Bloquear fecha con depósito de 100 euros"
        className="w-full py-4 bg-[#ecb613] hover:bg-yellow-400 text-black font-black uppercase text-sm rounded-xl transition-colors shadow-lg shadow-[#ecb613]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
      >
        Bloquear Fecha
      </button>
    </div>
  );
}