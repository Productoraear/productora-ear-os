"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, Sparkles, CheckCircle2, Lock, ArrowRight, Loader2, Calendar, MapPin, Users, Volume2 } from 'lucide-react';
import { useTripwire } from '@/hooks/useTripwire';

function CheckoutPresupuestoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { igniteTripwire } = useTripwire();

  const quoteHash = searchParams.get('quote') || 'SHA256-PENDING';
  const rawPayload = searchParams.get('p');

  const [quoteData, setQuoteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (rawPayload) {
      try {
        const decodedStr = atob(rawPayload);
        const parsed = JSON.parse(decodedStr);
        setQuoteData(parsed);
      } catch (err) {
        console.warn('Error decodificando payload firmado:', err);
      }
    }

    igniteTripwire('PRICE_LOCK_CHECKOUT_VIEW', {
      quoteHash,
      metadata: { source: 'TELEGRAM_INTAKE' }
    });
  }, [rawPayload, quoteHash, igniteTripwire]);

  const handlePayDeposit = async () => {
    setLoading(true);
    setError(null);

    try {
      igniteTripwire('RESERVE_DEPOSIT_INIT', {
        quoteHash,
        deposit: 10,
        total: quoteData?.estimatedTotal || 0
      });

      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 10,
          concept: `Depósito Reserva EAR OS [${quoteHash}] - 72h Price-Lock`,
          metadata: {
            quoteHash,
            pax: String(quoteData?.pax || ''),
            location: String(quoteData?.location || ''),
            date: String(quoteData?.date || ''),
            estimatedTotal: String(quoteData?.estimatedTotal || ''),
          }
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'No se pudo generar la sesión de pago de Stripe');
      }
    } catch (err: any) {
      console.error('Error iniciando pago:', err);
      setError(err.message || 'Error al conectar con la pasarela');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Badge Superior */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-mono uppercase tracking-[0.25em]">
            <Lock size={12} className="text-emerald-400" />
            TARIFA CONGELADA 72H // PRICE-LOCK ACTIVO
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-white font-syne">
            Confirmación de <span className="text-[#ecb613]">Depósito de Reserva</span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto font-light">
            Bloquea las fechas de producción y congela el presupuesto cotizado por Telegram abonando el depósito de garantía de 10 €.
          </p>
        </div>

        {/* Card Resumen de Cotización */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">IDENTIFICADOR CRIPTOGRÁFICO</span>
              <span className="text-sm sm:text-base font-mono text-[#ecb613] font-bold select-all">{quoteHash}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono">
              ESTADO: DRAFT_LOCKED
            </div>
          </div>

          {/* Grid de Datos del Evento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                <MapPin size={14} className="text-[#ecb613]" /> Ubicación
              </div>
              <p className="text-base font-bold text-white">{quoteData?.location || 'Por confirmar'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                <Calendar size={14} className="text-[#ecb613]" /> Fecha
              </div>
              <p className="text-base font-bold text-white">{quoteData?.date || 'Por confirmar'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                <Users size={14} className="text-[#ecb613]" /> Aforo
              </div>
              <p className="text-base font-bold text-white">{quoteData?.pax || 150} Asistentes</p>
            </div>
          </div>

          {/* Detalles Técnicos & Artista */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Desglose de Ingeniería</h3>
            <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2 text-sm">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-2"><Volume2 size={14} className="text-[#ecb613]" /> Hardware PA & Microfonía</span>
                <span className="font-mono text-white/80">{quoteData?.hardware || 'Bose F1 Model 812 + XR18'}</span>
              </div>
              {quoteData?.artist && (
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="flex items-center gap-2"><Sparkles size={14} className="text-[#ecb613]" /> Talento Asignado</span>
                  <span className="font-mono text-emerald-400 font-bold">{quoteData.artist}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bloque Financiero y CTA */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs text-zinc-400 block">Total Cotizado Estimado</span>
              <span className="text-2xl font-black text-white font-mono">{quoteData?.estimatedTotal ? `${quoteData.estimatedTotal.toLocaleString()} €` : 'A consultar'}</span>
            </div>

            <div className="w-full sm:w-auto flex flex-col items-end gap-2">
              <button
                onClick={handlePayDeposit}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#ecb613] hover:bg-[#d9a50f] text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#ecb613]/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Conectando Pasarela...</span>
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    <span>Pagar Depósito de 10 € (Stripe)</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
              <span className="text-[10px] text-zinc-400 font-mono">🔒 Pago encriptado de 10€ deducible de la factura final</span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono text-center">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPresupuestoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-[#ecb613]" size={32} />
      </div>
    }>
      <CheckoutPresupuestoContent />
    </Suspense>
  );
}
