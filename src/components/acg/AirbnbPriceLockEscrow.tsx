"use client";

import React, { useMemo, useState } from 'react';
import { Calendar, Lock, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import type { AcgState, AcgAction } from '@/lib/acg/acgDecisionEngine';
import {
  ACG_SSOT,
  computeAcgQuote,
  buildPriceLockPayload,
  getSelectedArtist,
  formatEur,
} from '@/lib/acg/acgDecisionEngine';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';

interface AirbnbPriceLockEscrowProps {
  state: AcgState;
  dispatch: React.Dispatch<AcgAction>;
}

export default function AirbnbPriceLockEscrow({ state, dispatch }: AirbnbPriceLockEscrowProps) {
  const selectedArtist = getSelectedArtist(state.match.selectedArtistId);
  const selectedFinca = SCLASS_12_FINCAS_HOMOLOGADAS.find((f) => f.id === state.finca.fincaId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);

  const quote = useMemo(
    () =>
      computeAcgQuote(
        selectedArtist.basePriceEur,
        state.finca.distanceKm,
        state.space.endHour,
        state.space.pax,
        state.space.venueType,
      ),
    [selectedArtist.basePriceEur, state.finca.distanceKm, state.space.endHour, state.space.pax, state.space.venueType],
  );

  const eventDate = state.space.eventDate ?? new Date().toISOString().slice(0, 10);

  const handleDateChange = (value: string) => {
    dispatch({ type: 'SET_SPACE', payload: { eventDate: value } });
  };

  /**
   * Firma canónica delegada en el endpoint servidor. El motor cliente solo
   * construye el payload SSOT; la HMAC SHA-256 se emite en el backend.
   */
  const handlePriceLock = async () => {
    setIsProcessing(true);
    setLockError(null);
    try {
      const payload = buildPriceLockPayload(quote, eventDate, selectedFinca?.name ?? 'ACG_OMNI');
      dispatch({ type: 'SET_SPACE', payload: { priceLockPayload: payload } });

      // 1. Firma canónica delegada en el servidor. Sin hash real NO se avanza.
      const lockRes = await fetch('/api/quote/generate-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formatId: selectedArtist.id,
          distanceKm: state.finca.distanceKm,
          endHour: state.space.endHour,
          eventDate,
        }),
      });
      const lockData = await lockRes.json().catch(() => ({}));
      const priceLockHash = (lockData?.priceLockHash as string) ?? null;

      if (!lockRes.ok || !priceLockHash) {
        const reason = lockData?.error ?? 'SIGNING_KEY_MISSING';
        setLockError(`No se emitió firma Price-Lock (${reason}). Abortando reserva.`);
        return;
      }

      dispatch({ type: 'SET_PRICE_LOCK', payload: { priceLockPayload: payload, priceLockHash } });

      // 2. Solo con firma real se abre la sesión Stripe.
      const payRes = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: ACG_SSOT.DEPOSITO_STRIPE_EUR,
          concept: `Depósito Price-Lock ACG: ${selectedArtist.name} (${selectedArtist.formatLabel})`,
          clientName: state.space.clientName || 'Cliente ACG',
          clientPhone: state.space.clientPhone || '+34600000000',
          metadata: {
            acgStep: 'espacio',
            artistId: selectedArtist.id,
            fincaId: selectedFinca?.id ?? null,
            eventDate,
            priceLockHash,
            priceLockPayload: payload,
            totalBase: quote.totalBase,
          },
        }),
      });
      const payData = await payRes.json().catch(() => ({}));
      if (payData?.url) {
        window.location.href = payData.url;
      } else {
        setLockError('Stripe no devolvió URL de pago. Verifica la conexión y reintenta.');
      }
    } catch {
      setLockError('No se pudo conectar con el backend de firma o pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna fecha + galería */}
      <div className="lg:col-span-7 space-y-5">
        <div className="rounded-2xl bg-[#050507] border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={15} className="text-[#00E5FF]" />
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Disponibilidad real · reserva en 1 clic</span>
          </div>
          <label className="block font-mono text-[10px] text-white/40 uppercase mb-2">Fecha del evento</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#00E5FF]"
          />

          <div className="mt-5">
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">Vista FOH / Escenario del destino</p>
            <div className="rounded-2xl border border-[#00E5FF]/20 bg-gradient-to-br from-[#0a141a] to-[#030305] p-8 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-[#00E5FF]" />
                </div>
                <p className="font-syne text-lg font-black text-white">{selectedFinca?.name ?? 'Finca Homologada'}</p>
                <p className="font-mono text-xs text-white/50">{selectedFinca?.provincia} · Capacidad {selectedFinca?.capacidadMaxPax} pax</p>
                <p className="font-mono text-[10px] text-[#00E5FF] uppercase tracking-widest">{'Escenario optimizado <75 dB SPL · B2G ready'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna escrow + cierre */}
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-2xl bg-[#050507] border border-[#00E5FF]/30 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Lock size={15} className="text-[#00E5FF]" />
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Custodia fiduciaria · Split Soberano</span>
          </div>

          <div className="border-b border-white/10 pb-4">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-xs text-white/50">Total base (sin IVA)</span>
              <span className="font-mono text-2xl text-white font-black">{formatEur(quote.totalBase)} €</span>
            </div>
            <div className="mt-1 flex justify-between items-baseline">
              <span className="font-mono text-xs text-white/50">Depósito Price-Lock</span>
              <span className="font-mono text-lg text-[#00E5FF] font-black">{formatEur(quote.deposit)} €</span>
            </div>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-white/50">80% Artista</span>
              <span className="text-white font-bold">{formatEur(quote.split.artista)} €</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-white/50">10% EAR OS</span>
              <span className="text-[#00E5FF] font-bold">{formatEur(quote.split.earOs)} €</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-white/50">10% VIMUME</span>
              <span className="text-emerald-400 font-bold">{formatEur(quote.split.vimume)} €</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <input
              type="text"
              placeholder="Nombre o persona de contacto"
              value={state.space.clientName}
              onChange={(e) => dispatch({ type: 'SET_SPACE', payload: { clientName: e.target.value } })}
              className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
            />
            <input
              type="tel"
              placeholder="Teléfono / WhatsApp"
              value={state.space.clientPhone}
              onChange={(e) => dispatch({ type: 'SET_SPACE', payload: { clientPhone: e.target.value } })}
              className="w-full bg-[#0a0a0d] border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          {state.space.priceLockHash && (
            <div className="p-3 rounded-xl bg-black/50 border border-[#00E5FF]/30 break-all">
              <span className="block font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">Firma Price-Lock emitida</span>
              <span className="font-mono text-[10px] text-[#00E5FF]">{state.space.priceLockHash}</span>
            </div>
          )}

          {lockError && <p className="font-mono text-xs text-[#FF2B44]">{lockError}</p>}

          <button
            type="button"
            onClick={handlePriceLock}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl bg-[#00E5FF] text-black font-black text-sm uppercase tracking-widest hover:shadow-[0_0_35px_rgba(0,229,255,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
            {isProcessing ? 'Firmando y bloqueando...' : `Bloquear fecha (${formatEur(quote.deposit)} €)`}
          </button>

          <div className="flex items-center justify-center gap-2 pt-1">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Depósito reembolsable · Price-Lock SHA-256 24-72h</span>
          </div>
        </div>
      </div>
    </div>
  );
}