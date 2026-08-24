"use client";

import React, { useState } from 'react';
import { Gift, Check, Copy, Sparkles, MessageCircle, Heart, Music, Flower2, Mic2 } from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

interface CouponProps {
  className?: string;
  isSolistaSelected?: boolean;
}

export const CouponBono150Complementos: React.FC<CouponProps> = ({ 
  className = "",
  isSolistaSelected = true 
}) => {
  const [copied, setCopied] = useState(false);
  const couponCode = "EDWIN150-COMPLEMENTOS";
  const whatsappUrl = `https://wa.me/34693693048?text=Hola%20Edwin,%20deseo%20aplicar%20el%20cup%C3%B3n%20EDWIN150-COMPLEMENTOS%20de%20150%E2%82%AC%20en%20complementos%20para%20mi%20evento.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121008] via-[#0d0d12] to-[#08080c] border-2 border-[#ecb613]/50 p-6 sm:p-8 shadow-[0_15px_40px_rgba(236,182,19,0.15)] ${className}`}>
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 space-y-6">
        
        {/* Header Badge & Title */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#ecb613]/20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613] text-xs font-black uppercase tracking-widest font-mono">
            <Gift size={14} className="animate-bounce" />
            <span>CUPÓN EXCLUSIVO REDES SOCIALES & YOUTUBE</span>
          </div>
          <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
            Válido para reservas de este mes
          </span>
        </div>

        {/* Big Offer Banner */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white font-syne">
              Bono Directo de <span className="text-[#ecb613] underline decoration-[#ecb613]/40">150 €</span> en Complementos
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed max-w-2xl">
            Aplica este cupón exclusivo para disfrutar de <strong>150 € de bonificación directos</strong> en los siguientes complementos VIP al contratar el servicio <strong>Edwin Agudelo · Solista Premium</strong>:
          </p>
        </div>

        {/* 4 Complementos VIP Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0">
              <Flower2 size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase">Arreglos Florales</h4>
              <p className="text-[10px] text-white/50">Ramo de gala incluido</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase">Sombrero Charro</h4>
              <p className="text-[10px] text-white/50">Regalo tradicional mexicano</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Music size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase">Canción Personalizada</h4>
              <p className="text-[10px] text-white/50">Letra o dedicatoria inédita</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Mic2 size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase">Sonido HiFi Bose</h4>
              <p className="text-[10px] text-white/50">Calibración 12 W/pax incluida</p>
            </div>
          </div>
        </div>

        {/* Condition Box */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
          <Heart size={18} className="text-[#ecb613] shrink-0 mt-0.5" />
          <p>
            <strong>Condición Exclusiva para Suscriptores y Seguidores:</strong> Esta bonificación de 150 € en complementos es exclusiva para suscriptores activos de nuestro canal de YouTube con comentarios en los vídeos, o seguidores de Edwin Agudelo en redes sociales.
          </p>
        </div>

        {/* Coupon Code & WhatsApp Apply Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-black/60 p-4 rounded-2xl border border-white/10">
          
          {/* Coupon Code with Copy Button */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/60 uppercase">CÓDIGO:</span>
            <div className="flex items-center gap-2 bg-[#181820] border border-[#ecb613]/40 px-3.5 py-2 rounded-xl">
              <span className="font-mono font-black text-sm text-[#ecb613] tracking-widest select-all">
                {couponCode}
              </span>
              <button
                onClick={handleCopy}
                className="p-1 text-white/60 hover:text-white transition-colors"
                title="Copiar código"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
            {copied && <span className="text-[10px] font-mono text-emerald-400">¡Copiado!</span>}
          </div>

          {/* Action Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-[#ecb613] hover:bg-[#d9a50f] text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-[#ecb613]/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle size={16} />
            <span>Aplicar Cupón 150 € (Adjuntar Prueba a Edwin)</span>
          </a>

        </div>

      </div>
    </div>
  );
};
