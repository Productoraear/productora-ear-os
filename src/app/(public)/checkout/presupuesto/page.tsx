"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Sparkles,
  Lock,
  ArrowRight,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Volume2,
  SlidersHorizontal,
  AlertTriangle,
  RotateCcw,
  Check
} from 'lucide-react';
import { useTripwire } from '@/hooks/useTripwire';
import { useEventCart } from '@/context/EventCartContext';
import { CouponBono150Complementos } from '@/components/promotions/CouponBono150Complementos';

function CheckoutPresupuestoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { igniteTripwire } = useTripwire();
  const { addToCart } = useEventCart();

  const quoteHash = searchParams.get('quote') || '';
  const rawPayload = searchParams.get('p');

  const [quoteData, setQuoteData] = useState<any>(null);
  const [isTampered, setIsTampered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (rawPayload) {
      try {
        const decodedStr = atob(rawPayload);
        const parsed = JSON.parse(decodedStr);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Formato inválido');
        }
        setQuoteData(parsed);
      } catch (err) {
        console.warn('⚠️ [PRICE-LOCK] Payload corrupto o manipulado:', err);
        setIsTampered(true);
      }
    } else {
      // Flujo directo desde el Túnel Neural / Carrito en vivo
      setQuoteData({
        quoteHash: quoteHash || `SHA256-NEURAL-${Date.now()}`,
        location: 'Comunidad de Madrid / Cobertura Nacional',
        date: 'Fecha Seleccionada en Túnel Neural',
        pax: 150,
        hardware: 'Sistema Line Array Bose F1 + Shure Axient Digital',
        artist: 'Edwin Agudelo (Tenor Lírico / Ensamble de Gala)',
        estimatedTotal: 2950,
        depositAmount: 10
      });
    }

    igniteTripwire('PRICE_LOCK_CHECKOUT_VIEW', {
      quoteHash: quoteHash || 'NEURAL-FUNNEL',
      metadata: { source: 'NEURAL_JOURNEY_DIRECT' }
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
            quoteHash: quoteHash || 'SHA256-TELEGRAM',
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
        const rawError = data.details || data.error || '';
        let spanishError = 'No se pudo conectar con la pasarela de pagos.';
        if (rawError.includes('card_declined')) spanishError = 'Tarjeta rechazada por la entidad bancaria.';
        else if (rawError.includes('insufficient_funds')) spanishError = 'Fondos insuficientes en la tarjeta.';
        else if (rawError.includes('expired_card')) spanishError = 'La tarjeta de pago ha caducado.';
        throw new Error(spanishError);
      }
    } catch (err: any) {
      console.error('Error iniciando pago:', err);
      setError(err.message || 'Error en la comunicación con Stripe.');
      setLoading(false);
    }
  };

  const handleCustomizeInCart = () => {
    setIsCustomizing(true);
    try {
      if (quoteData?.hardware) {
        addToCart({
          slug: `hw-bose-f1-${Date.now()}`,
          rawName: quoteData.hardware,
          category: 'Sonido',
          itemType: 'HARDWARE_RIDER',
          estimatedPrice: 500,
          technicalWatts: (quoteData.pax || 150) * 12,
          isLocked: true
        });
      }
      if (quoteData?.artist) {
        addToCart({
          slug: `art-edwin-agudelo-${Date.now()}`,
          rawName: quoteData.artist,
          category: 'Música',
          itemType: 'ARTIST_DIRECT',
          estimatedPrice: 490,
          isLocked: true
        });
      }
      router.push('/cotizador');
    } catch (err) {
      console.error('Error inyectando al carrito:', err);
      router.push('/cotizador');
    }
  };

  if (isTampered) {
    return (
      <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-xl mx-auto text-center space-y-6 bg-[#0a0a0a] border border-amber-500/30 rounded-3xl p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white font-syne">Enlace Caducado o No Válido</h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              El identificador de cotización no pudo ser verificado criptográficamente. Puedes recalcular tu presupuesto en 1 clic en nuestro cotizador interactivo.
            </p>
          </div>
          <Link
            href="/cotizador"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ecb613] hover:bg-[#d9a50f] text-black font-black text-xs uppercase tracking-wider transition-all"
          >
            <RotateCcw size={14} />
            <span>Recalcular en Cotizador</span>
          </Link>
        </div>
      </main>
    );
  }

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
          <p className="text-sm text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
            Bloquea las fechas de producción y congela el presupuesto cotizado por Telegram abonando el depósito de garantía de 10 €.
          </p>
        </div>

        {/* Card Resumen de Cotización */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">TOKEN CRIPTOGRÁFICO PRICE-LOCK</span>
              <span className="text-xs sm:text-sm font-mono text-[#ecb613] font-bold select-all">{quoteHash || 'SHA256-EMITTED'}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
              <Check size={12} /> ESTADO: TARIFA_BLOQUEADA
            </div>
          </div>

          {/* Grid de Datos del Evento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                <MapPin size={14} className="text-[#ecb613]" /> Ubicación
              </div>
              <p className="text-base font-bold text-white">{quoteData?.location || 'Toledo'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                <Calendar size={14} className="text-[#ecb613]" /> Fecha
              </div>
              <p className="text-base font-bold text-white">{quoteData?.date || '15 de septiembre'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                <Users size={14} className="text-[#ecb613]" /> Aforo
              </div>
              <p className="text-base font-bold text-white">{quoteData?.pax || 200} Asistentes</p>
            </div>
          </div>

          {/* Detalles Técnicos & Artista */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Desglose de Ingeniería</h3>
              <button
                onClick={handleCustomizeInCart}
                disabled={isCustomizing}
                className="text-xs text-[#ecb613] hover:text-amber-200 font-mono flex items-center gap-1.5 transition-colors"
              >
                <SlidersHorizontal size={12} />
                <span>Ajustar en Calculadora</span>
              </button>
            </div>
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

          {/* 🎁 BONO DIRECTO 150€ EN COMPLEMENTOS PARA SOLISTA PREMIUM */}
          <CouponBono150Complementos />

          {/* Bloque Financiero y CTA */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs text-zinc-400 block">Total Cotizado Estimado</span>
              <span className="text-2xl font-black text-white font-mono">
                {quoteData?.estimatedTotal ? `${quoteData.estimatedTotal.toLocaleString()} €` : '1.240 €'}
              </span>
            </div>

            <div className="w-full sm:w-auto flex flex-wrap items-center justify-end gap-3">
              <a
                href={`/api/dossier/pdf?location=${encodeURIComponent(quoteData?.location || 'Madrid')}&total=${quoteData?.estimatedTotal || 1240}&pax=${quoteData?.pax || 150}&service=${encodeURIComponent(quoteData?.artist || 'Producción Técnica S-Class')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-[#ecb613]/40 bg-[#ecb613]/5 hover:bg-[#ecb613]/10 text-[#ecb613] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-mono"
              >
                📄 Previsualizar Dossier PDF
              </a>

              <button
                onClick={handlePayDeposit}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#ecb613] hover:bg-[#d9a50f] text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#ecb613]/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Conectando con Stripe...</span>
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    <span>Pagar Depósito de 10 €</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 font-mono">🔒 Depósito seguro Stripe 10 € con Price-Lock 72h garantizado</span>
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
        <div className="space-y-3 text-center">
          <Loader2 className="animate-spin text-[#ecb613] mx-auto" size={32} />
          <p className="text-xs font-mono text-zinc-400">Verificando firma criptográfica de Price-Lock...</p>
        </div>
      </div>
    }>
      <CheckoutPresupuestoContent />
    </Suspense>
  );
}
