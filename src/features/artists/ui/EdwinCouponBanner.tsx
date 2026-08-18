"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles, ArrowRight, CheckCircle, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export const EdwinCouponBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const couponCode = "EDWIN150-COMPLEMENTOS";

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-[#050505] via-[#0b0b10] to-[#050505] relative overflow-hidden">
      {/* Resplandor dorado */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ecb613]/10 via-[#ecb613]/5 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="rounded-[3rem] bg-gradient-to-br from-[#121218] via-[#09090d] to-black border-2 border-[#ecb613]/30 p-8 md:p-14 shadow-[0_20px_80px_rgba(236,182,19,0.15)] relative overflow-hidden">
          
          {/* Badge decorativo de esquina */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#ecb613]/10 rounded-full blur-[40px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* TEXTO Y OFERTA */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ecb613]/40 bg-[#ecb613]/10 text-[#ecb613] text-[9px] font-black uppercase tracking-[0.4em]">
                <Gift size={14} /> Oferta Especial de Bienvenida
              </div>

              <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white font-syne leading-none">
                Bono Directo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-amber-300">150€ en Complementos</span>
              </h3>

              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                Aplica este cupón exclusivo para disfrutar de <strong>150€ de bonificación</strong> directos en cualquiera de los siguientes complementos para tu evento:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-xs text-white/80">
                  <CheckCircle size={14} className="text-[#ecb613] shrink-0" />
                  <span>Arreglos Florales de Gala</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-xs text-white/80">
                  <CheckCircle size={14} className="text-[#ecb613] shrink-0" />
                  <span>Sombrero Charro de Regalo</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-xs text-white/80">
                  <CheckCircle size={14} className="text-[#ecb613] shrink-0" />
                  <span>Canción / Letra Inédita</span>
                </div>
              </div>
            </div>

            {/* CAJETILLA DE CÓDIGO Y ACCIÓN */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4 p-6 rounded-3xl bg-black/60 border border-white/10 text-center">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/40">
                Código Promocional
              </span>

              <div 
                onClick={handleCopy}
                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-[#ecb613]/40 text-[#ecb613] font-mono font-black text-sm tracking-wider flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all group"
              >
                <span>{couponCode}</span>
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-white/40 group-hover:text-white" />}
              </div>

              {copied && (
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  ✓ ¡Código copiado al portapapeles!
                </span>
              )}

              <a
                href={`https://wa.me/34693693048?text=Hola%20Edwin,%20deseo%20aplicar%20el%20cupón%20${couponCode}%20de%20150€%20en%20complementos%20para%20mi%20evento.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(236,182,19,0.3)] active:scale-95"
              >
                <span>Aplicar Cupón 150€</span>
                <ArrowRight size={16} />
              </a>

              <span className="text-[8px] font-mono uppercase text-white/30">
                Válido para reservas formalizadas este mes
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
