"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Check, Sparkles, CreditCard,
  MessageCircle, Users, Gift, AlertCircle
} from 'lucide-react';
import {
  MARIACHI_FORMATS,
  MARIACHI_DISPATCH_HUBS,
  calculateMariachiQuote,
  MariachiFormat,
  MariachiFormatId,
} from '@/lib/mariachi/mariachiDispatchCore';
import { checkoutMariachiDeposit } from '@/app/actions/mariachiCheckoutActions';

const PACK_BADGES: Record<MariachiFormatId, string> = {
  solista: 'Íntimo & Emotivo',
  cuarteto: 'El Clásico Familiar',
  gala: 'Recomendado Bodas & Fincas',
  monumental: 'Máximo Esplendor',
};

const PACK_DURATIONS: Record<MariachiFormatId, string> = {
  solista: '40 minutos',
  cuarteto: '50 minutos',
  gala: '60 minutos',
  monumental: '90 minutos',
};

const PACK_FEATURES: Record<MariachiFormatId, string[]> = {
  solista: [
    '1 cantante solista vestido de gran gala',
    'Sonido portátil calibrado según el límite dBA del recinto',
    'Repertorio de 8-10 canciones emblemáticas',
    'Llegada sorpresa a domicilio o restaurante',
    'Depósito 100 € descontado íntegro del total',
  ],
  cuarteto: [
    '4 músicos profesionales uniformados de charro',
    'Trompeta en vivo, vihuela, guitarrón y violín',
    'Interacción festiva con los homenajeados',
    'Microfonía inalámbrica para exteriores',
    'Depósito 100 € con bloqueo atómico de fecha',
  ],
  gala: [
    'Mínimo 6 músicos charros de alta escuela',
    'Voz tenor solista de Edwin Agudelo',
    '2 trompetas, 2 violines, vihuela y guitarrón',
    'Ficha técnica acústica previa adaptada al límite dBA de la finca',
    'Show interactivo de entrada sorpresa y vals ranchero',
  ],
  monumental: [
    '8 músicos virtuosos de conservatorio',
    '3 violines, 2 trompetas, vihuela, guitarrón y guitarra',
    'Sonorización perimetral Bose F1 / L-Acoustics',
    'Facturable a ayuntamientos como contrato menor (FACe)',
    'Repertorio a la carta y coordinación técnica in situ',
  ],
};

const RESERVATION_HUB = MARIACHI_DISPATCH_HUBS[0];

export default function MariachiPricingPacks() {
  const [loadingId, setLoadingId] = useState<MariachiFormatId | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cotización de cada pack a distancia 0 (tarifa base cerrada, sin logística).
  const quotesByFormat = useMemo(() => {
    const map = new Map<MariachiFormatId, ReturnType<typeof calculateMariachiQuote>>();
    for (const format of MARIACHI_FORMATS) {
      map.set(
        format.id,
        calculateMariachiQuote(
          format.id,
          { lat: RESERVATION_HUB.lat, lng: RESERVATION_HUB.lng },
          `Reserva ${format.name} — precio cerrado`,
          2,
          RESERVATION_HUB.id,
        ),
      );
    }
    return map;
  }, []);

  const handleStripeCheckout = async (pack: MariachiFormat) => {
    const quote = quotesByFormat.get(pack.id);
    if (!quote) return;

    try {
      setLoadingId(pack.id);
      setErrorMsg(null);
      const result = await checkoutMariachiDeposit({
        formatId: pack.id,
        destinationLat: RESERVATION_HUB.lat,
        destinationLng: RESERVATION_HUB.lng,
        destinationName: `Reserva ${pack.name} — precio cerrado`,
        endHour: 2,
        overrideHubId: RESERVATION_HUB.id,
        repertoireSongs: 0,
        clientHash: quote.priceLockHash,
        issuedAt: Date.now(),
      });

      if (!result.ok) {
        setErrorMsg(result.error || 'No se pudo iniciar la pasarela de pago Stripe.');
        return;
      }

      window.location.href = result.url;
    } catch (err: unknown) {
      console.error('MARIACHI_PACK_STRIPE_ERROR:', err);
      setErrorMsg('Error de conexión con la pasarela de pago.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleWhatsAppQuote = (pack: MariachiFormat) => {
    const text = encodeURIComponent(
      `¡Hola! Deseo consultar disponibilidad para el pack:\n\n` +
      `• Pack: ${pack.name}\n` +
      `• Integrantes: ${pack.members} músicos\n` +
      `• Tarifa: ${pack.basePrice} € (depósito 100 € deducible)\n` +
      `• Duración: ${PACK_DURATIONS[pack.id]}\n\n` +
      `¿Podéis confirmarme disponibilidad para mi fecha y provincia?`
    );
    window.open(`https://wa.me/34693693048?text=${text}`, '_blank');
  };

  return (
    <div id="precios" className="space-y-12">
      {errorMsg && (
        <div role="alert" className="flex items-center gap-3 p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}
      {/* Título de Sección */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
          <Sparkles size={14} />
          TARIFAS TRANSPARENTES // SSOT EAR OS S-CLASS
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
          Packs Cerrados con <br />
          <span className="text-[#ecb613]">Depósito Deducible de 100 €</span>
        </h2>
        <p className="text-sm sm:text-base text-white/60 font-sans">
          Sin presupuestos inflados ni regateos a ciegas. Cada pack incluye vestuario de gran gala, sonido calibrado y bloqueo garantizado de agenda.
        </p>
      </div>

      {/* Grid de 4 Packs (SSOT: una sola fuente de precios) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MARIACHI_FORMATS.map((pack) => {
          const features = PACK_FEATURES[pack.id];
          const isPopular = pack.id === 'gala';
          return (
            <div
              key={pack.id}
              className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${isPopular
                ? 'bg-gradient-to-b from-[#13121d] to-[#07070b] border-2 border-[#ecb613] shadow-2xl shadow-[#ecb613]/10 scale-[1.02]'
                : 'bg-[#060609] border border-white/10 hover:border-white/20'
                }`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#ecb613] text-black text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                  ⭐ FORMACIÓN ESTRELLA BODAS
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#ecb613] tracking-widest">
                    {PACK_BADGES[pack.id]}
                  </span>
                  <h3 className="text-xl font-bold font-syne text-white mt-0.5">
                    {pack.name}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 font-sans">
                    {pack.recommendedFor}
                  </p>
                </div>

                {/* Precio y Condiciones */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono text-white tracking-tight">
                      {pack.basePrice} €
                    </span>
                    <span className="text-xs text-white/40 font-mono">/ total</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#ecb613]">
                    <span>Depósito de bloqueo:</span>
                    <strong className="underline">100 € (Deducible)</strong>
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">
                    Duración: {PACK_DURATIONS[pack.id]} · {pack.members} {pack.members === 1 ? 'músico' : 'músicos'}
                  </div>
                </div>

                {/* Lista de Características */}
                <ul className="space-y-2.5 text-xs text-white/70 font-sans">
                  {features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check size={14} className="text-[#ecb613] shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Acciones de Contratación */}
              <div className="space-y-2.5 pt-6 border-t border-white/5 mt-6">
                <button
                  onClick={() => handleStripeCheckout(pack)}
                  disabled={loadingId === pack.id}
                  className="w-full py-3 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#ecb613]/20 disabled:opacity-50 cursor-pointer"
                >
                  <CreditCard size={14} />
                  {loadingId === pack.id ? 'Conectando...' : 'Bloquear Fecha (100 €)'}
                </button>

                <button
                  onClick={() => handleWhatsAppQuote(pack)}
                  className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle size={14} className="text-emerald-400" />
                  Consultar por WhatsApp
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BANNER DE DIGNIFICACIÓN LABORAL & RED DE AFILIADOS EAR OS */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d0d14] via-[#09090f] to-[#0d0d14] border border-[#ecb613]/20 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-widest">
            <Gift size={14} />
            DIGNIFICACIÓN PROFESIONAL & PROGRAMA DE AFILIADOS EAR OS
          </div>
          <h4 className="text-xl md:text-2xl font-bold font-syne text-white">
            ¿Eres director de grupo o músico mariachi profesional?
          </h4>
          <p className="text-xs sm:text-sm text-white/60 font-sans leading-relaxed">
            Garantizamos una retribución digna de <strong>100 € por músico por servicio</strong> en nuestros packs.
            Además, intégrate en nuestro <strong>Programa de Afiliados</strong>: gana comisiones recomendando clientes y acumula saldo para
            producción de videoclips en plató 4K y paquetes de sonido profesional en Productora EAR.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
          <Link
            href="/mariachis/unirse"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all"
          >
            <Users size={14} className="text-[#ecb613]" />
            Unirse a la Red de Músicos
          </Link>
          <a
            href="https://wa.me/34693693048?text=Hola,%20soy%20director/m%C3%BAsico%20de%20mariachi%20y%20deseo%20informaci%C3%B3n%20sobre%20afiliaci%C3%B3n%20y%20producci%C3%B3n%20con%20Productora%20EAR"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#ecb613]/10 hover:bg-[#ecb613]/20 border border-[#ecb613]/30 text-[#ecb613] font-mono text-xs uppercase tracking-wider transition-all"
          >
            <MessageCircle size={14} />
            Coordinación (+34 693 693 048)
          </a>
        </div>
      </div>
    </div>
  );
}