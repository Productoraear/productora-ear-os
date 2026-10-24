'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Check, Lock, Loader2, Sparkles,
  MapPin, Users, Calendar, Volume2
} from 'lucide-react';
import Archetype1_TinderDeck from './Archetype1_TinderDeck';
import Archetype2_UberRadar from './Archetype2_UberRadar';
import Archetype3_AirbnbBento from './Archetype3_AirbnbBento';
import Archetype4_BodasTimeline from './Archetype4_BodasTimeline';
import { ARTIST_FORMATS, calculateQuote } from './types';

type StepId = 1 | 2 | 3 | 4 | 5;

/** Estado único y compartido del funnel secuencial. Cada arquetipo aporta su slice. */
interface FunnelState {
  formatId: string;
  guestCount: number;
  eventDate: string;
  distanceKm: number;
  milestoneFormatIds: string[];
  includePhotocall: boolean;
}

const INITIAL_FUNNEL_STATE: FunnelState = {
  formatId: 'solista-gala',
  guestCount: 130,
  eventDate: '2026-09-19',
  distanceKm: 45,
  milestoneFormatIds: [],
  includePhotocall: true,
};

const FUNNEL_STEPS: ReadonlyArray<{ id: StepId; tag: string; label: string }> = [
  { id: 1, tag: 'Tinder', label: 'Formato' },
  { id: 2, tag: 'Airbnb', label: 'Fecha' },
  { id: 3, tag: 'Bodas', label: 'Timeline' },
  { id: 4, tag: 'Uber', label: 'Logística' },
  { id: 5, tag: 'Lock', label: 'Bloqueo' },
];

/** Base artística canónica: hitos nupciales asignados o formato cabecera. Cero precios inventados. */
function computeBasePrice(state: FunnelState): number {
  const milestoneSum = state.milestoneFormatIds.reduce((acc, id) => {
    const fmt = ARTIST_FORMATS.find(f => f.id === id);
    return acc + (fmt ? fmt.basePrice : 0);
  }, 0);
  if (milestoneSum > 0) return milestoneSum;
  const fmt = ARTIST_FORMATS.find(f => f.id === state.formatId) ?? ARTIST_FORMATS[0];
  return fmt.basePrice;
}

export default function SequentialFunnelSClass() {
  const [step, setStep] = useState<StepId>(1);
  const [state, setState] = useState<FunnelState>(INITIAL_FUNNEL_STATE);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isLocking, setIsLocking] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);
  const [lockedOrderId, setLockedOrderId] = useState<string | null>(null);

  const selectedFormat = ARTIST_FORMATS.find(f => f.id === state.formatId) ?? ARTIST_FORMATS[0];
  const basePrice = computeBasePrice(state);

  // Cotización 100% SSOT (logística 1,50 €/km desde km 50, hotel +120 € >200 km,
  // depósito 100 €, split 80/10/10, 12 W/pax). Cero precios hardcodeados.
  const quote = calculateQuote({
    basePrice,
    extraMusicians: 0,
    distanceKm: state.distanceKm,
    pax: state.guestCount,
    hasBoseSound: true,
    hasPhotocall: state.includePhotocall,
  });

  const patch = (partial: Partial<FunnelState>) => setState(prev => ({ ...prev, ...partial }));
  const goNext = () => setStep(prev => (prev < 5 ? (prev + 1) as StepId : prev));
  const goBack = () => setStep(prev => (prev > 1 ? (prev - 1) as StepId : prev));

  async function handleStripeLock() {
    if (isLocking || lockedOrderId) return;
    setIsLocking(true);
    setLockError(null);
    try {
      const res = await fetch('/api/reservar/solista/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: state.eventDate,
          formato: selectedFormat.musiciansCount > 1 ? 'mariachi' : 'solista',
          distanciaKm: state.distanceKm,
          totalEstimado: quote.total,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { url?: string; orderId?: string; priceLockHash?: string; error?: string; reason?: string }
        | null;

      if (data && typeof data.url === 'string') {
        setLockedOrderId(data.orderId ?? null);
        window.location.assign(data.url);
        return;
      }
      setLockError(data?.reason || data?.error || 'No se pudo crear el depósito de reserva.');
    } catch (err) {
      setLockError(err instanceof Error ? err.message : 'Error de red al crear el depósito.');
    } finally {
      setIsLocking(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-[#ecb613] selection:text-black relative overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-[#ecb613]/5 blur-[140px] pointer-events-none" />

      <header className="relative z-30 w-full max-w-[420px] mx-auto px-3 pt-3 pb-2">
        <div className="bg-[#0d0d12]/90 border border-white/10 rounded-3xl p-3 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ecb613] text-black flex items-center justify-center font-black text-xs">Ω</div>
              <div>
                <h1 className="text-[11px] font-black uppercase tracking-wider text-white">Funnel Secuencial S-Class</h1>
                <span className="text-[9px] text-[#ecb613] font-mono">TINDER → AIRBNB → BODAS → UBER</span>
              </div>
            </div>
            <button
              onClick={goBack}
              disabled={step === 1}
              aria-label="Paso anterior"
              className="p-2 min-h-[44px] min-w-[44px] rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white/70 flex items-center justify-center transition-all"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-1">
            {FUNNEL_STEPS.map((s, i) => {
              const isDone = step > s.id;
              const isActive = step === s.id;
              return (
                <React.Fragment key={s.id}>
                  {i > 0 && <div className={`h-px flex-1 ${isDone ? 'bg-[#ecb613]' : 'bg-white/10'}`} />}
                  <div className="flex flex-col items-center gap-0.5 min-w-[52px]">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${isDone
                        ? 'bg-[#ecb613] text-black border-[#ecb613]'
                        : isActive
                          ? 'bg-[#ecb613]/20 text-[#ecb613] border-[#ecb613]'
                          : 'bg-white/5 text-white/40 border-white/10'}`}>
                      {isDone ? <Check size={12} strokeWidth={3} /> : s.id}
                    </div>
                    <span className={`text-[8px] font-mono font-bold uppercase ${isActive ? 'text-[#ecb613]' : 'text-white/40'}`}>{s.tag}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-[420px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {step === 1 && (
              <Archetype1_TinderDeck
                onBook={(formatId) => patch({ formatId })}
                onNext={goNext}
              />
            )}

            {step === 2 && (
              <Archetype3_AirbnbBento
                initialFormatId={state.formatId}
                initialGuestCount={state.guestCount}
                initialEventDate={state.eventDate}
                onNext={({ formatId, guestCount, eventDate }) => {
                  patch({ formatId, guestCount, eventDate });
                  goNext();
                }}
              />
            )}

            {step === 3 && (
              <Archetype4_BodasTimeline
                initialPaxCount={state.guestCount}
                initialIncludePhotocall={state.includePhotocall}
                onNext={({ milestoneFormatIds, includePhotocall, paxCount }) => {
                  patch({ milestoneFormatIds, includePhotocall, guestCount: paxCount });
                  goNext();
                }}
              />
            )}

            {step === 4 && (
              <Archetype2_UberRadar
                initialFormatId={state.formatId}
                initialPaxCount={state.guestCount}
                initialDistanceKm={state.distanceKm}
                onDispatch={({ formatId, distanceKm, paxCount }) => {
                  patch({ formatId, distanceKm, guestCount: paxCount });
                  goNext();
                }}
              />
            )}

            {step === 5 && (
              <div className="flex flex-col min-h-screen bg-[#050505] text-white p-4 select-none overflow-y-auto no-scrollbar space-y-4 pb-8">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-[#ecb613] text-black text-[9px] font-black uppercase font-mono tracking-widest">
                    RESUMEN & BLOQUEO ATÓMICO
                  </span>
                  <h2 className="text-xl font-black uppercase tracking-tight font-syne">{selectedFormat.name}</h2>
                  <p className="text-[11px] text-white/50 font-mono flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#ecb613]" /> {state.eventDate}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-[#111116] border border-white/10 rounded-2xl p-3 flex items-center gap-2">
                    <Users size={14} className="text-[#ecb613]" />
                    <div>
                      <span className="text-[9px] text-white/40 block">AFORO</span>
                      <span className="font-bold">{state.guestCount} pax</span>
                    </div>
                  </div>
                  <div className="bg-[#111116] border border-white/10 rounded-2xl p-3 flex items-center gap-2">
                    <MapPin size={14} className="text-[#ecb613]" />
                    <div>
                      <span className="text-[9px] text-white/40 block">DESPLAZAMIENTO</span>
                      <span className="font-bold">{state.distanceKm} km</span>
                    </div>
                  </div>
                  <div className="bg-[#111116] border border-white/10 rounded-2xl p-3 flex items-center gap-2">
                    <Volume2 size={14} className="text-emerald-400" />
                    <div>
                      <span className="text-[9px] text-white/40 block">POTENCIA</span>
                      <span className="font-bold">{quote.requiredWatts}W</span>
                    </div>
                  </div>
                  <div className="bg-[#111116] border border-white/10 rounded-2xl p-3 flex items-center gap-2">
                    <Sparkles size={14} className="text-[#ecb613]" />
                    <div>
                      <span className="text-[9px] text-white/40 block">TIMELINE</span>
                      <span className="font-bold">{state.milestoneFormatIds.length} hitos</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111116] border border-white/10 rounded-3xl p-4 space-y-2 text-xs font-mono">
                  <h4 className="text-xs font-black uppercase text-white font-syne">Desglose Soberano 80/10/10</h4>
                  <div className="flex justify-between text-white/70">
                    <span>Base Artística</span>
                    <span className="font-bold text-white">{basePrice} €</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Logística ({state.distanceKm} km)</span>
                    <span className="font-bold text-white">{quote.kmFee} €</span>
                  </div>
                  {quote.hotelFee > 0 && (
                    <div className="flex justify-between text-white/70">
                      <span>Suplemento Hotel (+200 km)</span>
                      <span className="font-bold text-white">{quote.hotelFee} €</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/10 flex justify-between font-black text-sm">
                    <span className="text-white">Total Evento</span>
                    <span className="text-[#ecb613]">{quote.total} €</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Músicos (80%)</span>
                    <span className="font-bold">{quote.split.artist} €</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>EAR OS (10%)</span>
                    <span className="font-bold">{quote.split.ear} €</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>VIMUME (10%)</span>
                    <span className="font-bold text-emerald-400">{quote.split.vimume} €</span>
                  </div>
                </div>

                <div className="bg-[#111116] border border-white/10 rounded-3xl p-4 space-y-3">
                  <h4 className="text-xs font-black uppercase text-white font-syne">Datos de contacto (bloqueo real)</h4>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Nombre y apellidos"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 min-h-[48px] text-sm text-white placeholder-white/30 outline-none focus:border-[#ecb613]/60"
                  />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 min-h-[48px] text-sm text-white placeholder-white/30 outline-none focus:border-[#ecb613]/60"
                  />
                </div>

                {lockError && (
                  <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono">
                    {lockError}
                  </div>
                )}

                <button
                  onClick={handleStripeLock}
                  disabled={isLocking}
                  className="w-full py-4 min-h-[52px] rounded-2xl bg-[#ecb613] hover:bg-[#f5c538] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/25 active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isLocking ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                  <span>{isLocking ? 'Creando sesión Stripe...' : `Bloquear Fecha · ${quote.deposit}€ Depósito`}</span>
                </button>
                <p className="text-[9px] text-white/40 font-mono text-center pb-4">
                  Depósito 100% deducible · Lock atómico SHA-256 · Split 80/10/10
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
