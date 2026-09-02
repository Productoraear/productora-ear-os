'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Lock, 
  Send, 
  HeartHandshake,
  Music2,
  Volume2
} from 'lucide-react';
import { calculateMariachiDispatch, MariachiFormat, ServiceUrgency, TARIFAS_MARIACHI } from '@/lib/mariachi/mariachi-dispatch-engine';
import { calculateSovereignQuote, SoundRiderType } from '@/lib/pricing/sovereign-pricing';

export function SClassPricingTerminal() {
  const [selectedFormat, setSelectedFormat] = useState<MariachiFormat>('solista_edwin');
  const [distanceKm, setDistanceKm] = useState<number>(15);
  const [urgency, setUrgency] = useState<ServiceUrgency>('estandar');
  const [soundRider, setSoundRider] = useState<SoundRiderType>('standard');
  const [city, setCity] = useState<string>('Madrid');
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  // Cálculo en tiempo real consumiendo los motores SSOT
  const quote = useMemo(() => {
    const mariachiResult = calculateMariachiDispatch({
      format: selectedFormat,
      serviceType: 'boda_nupcial',
      urgency,
      locationCity: city,
      distanceKm,
      clientPhone: '+34693693048',
    });

    const soundSupplement = soundRider === 'bose_f1_elite' ? 150 : 0;
    const finalTotal = mariachiResult.totalPriceEur + soundSupplement;
    const finalRemaining = finalTotal - mariachiResult.depositAmountEur;

    const artist80 = Math.round(finalTotal * 0.8);
    const earOs10 = Math.round(finalTotal * 0.1);
    const vimume10 = finalTotal - artist80 - earOs10;

    return {
      ...mariachiResult,
      totalPriceEur: finalTotal,
      remainingOnArrivalEur: finalRemaining,
      soundSupplement,
      split: {
        musicians80: artist80,
        earOs10,
        vimume10,
      }
    };
  }, [selectedFormat, distanceKm, urgency, soundRider, city]);

  const handleWhatsAppCheckout = () => {
    const encodedMessage = encodeURIComponent(quote.whatsappConfirmationCopy);
    window.open(`https://wa.me/34693693048?text=${encodedMessage}`, '_blank');
  };

  const handleStripeDeposit = () => {
    window.location.href = `/api/payments/checkout?format=${selectedFormat}&ref=${quote.orderId}&hash=${quote.priceLockHash}&amount=${quote.depositAmountEur}`;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-[2.5rem] bg-[#050505]/95 border border-[#ecb613]/30 p-6 md:p-10 shadow-[0_0_80px_rgba(236,182,19,0.12)] backdrop-blur-2xl text-white overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#ecb613]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#a855f7]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Header S-Class */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Sparkles size={14} className="animate-pulse" /> S-Class Neural Terminal 24/7
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Centralita Soberana <span className="text-[#ecb613]">Edwin Agudelo</span>
          </h2>
          <p className="text-xs md:text-sm text-white/50">
            Cotización oficial con Price-Lock SHA-256 y Split Social VIMUME certificado.
          </p>
        </div>

        {/* Live Cryptographic Badge */}
        <div className="flex flex-col items-start md:items-end font-mono">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <Lock size={12} /> PRICE-LOCK: {quote.priceLockHash.substring(0, 10)}...
          </div>
          <span className="text-[10px] text-white/40 mt-1">Ref: {quote.orderId}</span>
        </div>
      </div>

      {/* Grid de Configuración */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Selectores Interactivos */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Selector de Formato */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
              <Music2 size={14} className="text-[#ecb613]" /> 1. Selecciona el Formato de Gala
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {[
                { id: 'solista_edwin' as MariachiFormat, label: 'Solista Edwin', price: '350€', badge: 'SSOT Base' },
                { id: 'duo_acustico' as MariachiFormat, label: 'Dúo Acústico', price: '480€' },
                { id: 'trio_clasico' as MariachiFormat, label: 'Trío Clásico', price: '600€', badge: 'Top Bodas' },
                { id: 'cuarteto_tradicional' as MariachiFormat, label: 'Cuarteto', price: '750€' },
                { id: 'quinteto_gala' as MariachiFormat, label: 'Quinteto Gala', price: '900€' },
                { id: 'mariachi_imperial' as MariachiFormat, label: 'Mariachi Imperial', price: '1.400€', badge: 'Gran Show' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
                    selectedFormat === f.id
                      ? 'bg-gradient-to-br from-[#ecb613]/20 to-[#09090d] border-[#ecb613] text-white shadow-[0_0_20px_rgba(236,182,19,0.2)]'
                      : 'bg-white/[0.03] border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {f.badge && (
                    <span className="absolute top-1.5 right-1.5 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#ecb613]/20 text-[#ecb613] border border-[#ecb613]/30">
                      {f.badge}
                    </span>
                  )}
                  <span className="block font-bold text-xs md:text-sm">{f.label}</span>
                  <span className="text-[11px] font-mono text-[#ecb613] font-black">{f.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Slider de Distancia y Ubicación */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                <MapPin size={14} className="text-[#ecb613]" /> 2. Radio de Desplazamiento
              </label>
              <span className="font-mono text-xs text-[#ecb613] font-bold bg-[#ecb613]/10 px-2 py-0.5 rounded-lg border border-[#ecb613]/20">
                {distanceKm} km ({Math.round(distanceKm * 0.35)} €)
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="250" 
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
            />
            <div className="flex justify-between text-[10px] font-mono text-white/30 mt-1.5">
              <span>0 km (Centro)</span>
              <span>50 km (Toledo/Gua)</span>
              <span>150 km</span>
              <span>250 km (Nacional)</span>
            </div>
          </div>

          {/* 3. Modo Urgencia 24/7 & Rider Acústico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Urgencia 24/7 */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={16} className={urgency !== 'estandar' ? 'text-amber-400 animate-bounce' : 'text-white/40'} />
                <span className="text-xs font-bold font-mono uppercase text-white/80">Despacho Inmediato</span>
              </div>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as ServiceUrgency)}
                className="bg-[#09090d] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ecb613]"
              >
                <option value="estandar">📅 Planificado (0 € extra)</option>
                <option value="express_hoy">⚡ Serenata Express Hoy (+120 €)</option>
                <option value="urgencia_nocturna_24_7">🌙 Urgencia Nocturna 24/7 (+120 €)</option>
              </select>
            </div>

            {/* Rider Acústico Bose F1 */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 size={16} className={soundRider === 'bose_f1_elite' ? 'text-purple-400' : 'text-white/40'} />
                <span className="text-xs font-bold font-mono uppercase text-white/80">Sonido Homologado</span>
              </div>
              <button
                type="button"
                onClick={() => setSoundRider(soundRider === 'standard' ? 'bose_f1_elite' : 'standard')}
                className={`px-3 py-2 rounded-xl text-xs font-mono text-left border transition-all flex items-center justify-between ${
                  soundRider === 'bose_f1_elite'
                    ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                    : 'bg-[#09090d] border-white/15 text-white/60 hover:text-white'
                }`}
              >
                <span>{soundRider === 'bose_f1_elite' ? '🔊 Bose F1 2000W (+150€)' : '🔈 Acústico Directo (0€)'}</span>
                {soundRider === 'bose_f1_elite' && <CheckCircle2 size={14} className="text-purple-400" />}
              </button>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Tarjeta de Liquidación y Checkout S-Class */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-[#09090d] to-black border border-white/15 rounded-3xl p-6 shadow-2xl relative">
          
          <div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <span className="text-xs font-mono uppercase text-white/50">Presupuesto Certificado</span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                <ShieldCheck size={14} /> Garantía 0 Fallos
              </span>
            </div>

            {/* Total Budget Display */}
            <div className="mb-6">
              <span className="text-xs font-mono text-white/40 uppercase block mb-1">Inversión Total del Evento</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-[#ecb613]">
                  {quote.totalPriceEur} €
                </span>
                <span className="text-xs font-mono text-white/40">IVA no incl.</span>
              </div>
            </div>

            {/* Depósito vs Restante */}
            <div className="grid grid-cols-2 gap-3 mb-6 bg-white/[0.03] p-3.5 rounded-2xl border border-white/5 font-mono text-xs">
              <div>
                <span className="text-white/40 block text-[10px] uppercase">Bloqueo Inmediato</span>
                <span className="text-white font-bold text-base text-emerald-400">{quote.depositAmountEur} €</span>
                <span className="text-[9px] text-white/30 block">Depósito Reembolsable</span>
              </div>
              <div className="border-l border-white/10 pl-3">
                <span className="text-white/40 block text-[10px] uppercase">Abono en Llegada</span>
                <span className="text-white font-bold text-base">{quote.remainingOnArrivalEur} €</span>
                <span className="text-[9px] text-white/30 block">Al iniciar el show</span>
              </div>
            </div>

            {/* Split Soberano 80/10/10 */}
            <div className="space-y-2 mb-6 border-t border-white/10 pt-4">
              <div className="flex justify-between text-[11px] font-mono text-white/60">
                <span>🎙️ Honorarios Músicos (80%):</span>
                <span className="text-white font-bold">{quote.split.musicians80} €</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-white/60">
                <span>🏛️ Productora EAR (10%):</span>
                <span className="text-white font-bold">{quote.split.earOs10} €</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-purple-400 bg-purple-950/30 px-2.5 py-1 rounded-lg border border-purple-500/20">
                <span className="flex items-center gap-1.5"><HeartHandshake size={12} /> Fondo Social VIMUME (10%):</span>
                <span className="font-bold">{quote.split.vimume10} €</span>
              </div>
            </div>
          </div>

          {/* Botones de Cierre y Conversión */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send size={18} /> Bloquear por WhatsApp (menos de 10 min)
            </button>

            <button
              onClick={handleStripeDeposit}
              className="w-full py-3 px-6 rounded-2xl bg-[#09090d] hover:bg-white/10 border border-[#ecb613]/50 text-[#ecb613] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Lock size={14} /> Pagar 100€ Depósito (Stripe Checkout)
            </button>
          </div>

        </div>

      </div>

      {/* Footer con Hook Promocional */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
            BONO ACTIVO
          </span>
          <span>Bono de 150 € en complementos (`EDWIN150-COMPLEMENTOS`) con tu suscripción a YouTube.</span>
        </div>
        <span className="text-white/30 text-[10px]">Atención Inmediata: +34 693 693 048</span>
      </div>

    </div>
  );
}
