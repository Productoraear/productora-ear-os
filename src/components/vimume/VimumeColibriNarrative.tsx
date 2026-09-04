'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Shield, Compass, Feather, Quote } from 'lucide-react';
import { VIMUME_CLINICAL_SSOT } from '@/lib/constants/vimume-clinical-ssot';

export function VimumeColibriNarrative() {
  const { LEGACY_COLIBRI } = VIMUME_CLINICAL_SSOT;

  return (
    <section className="relative rounded-[2.5rem] bg-gradient-to-b from-[#090810] via-[#050508] to-black border border-white/10 p-6 sm:p-12 overflow-hidden shadow-[0_0_90px_rgba(139,92,246,0.08)]">
      {/* GLOW ATMOSFÉRICO */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#ecb613]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* COLUMNA IZQUIERDA: ISOTIPO SAGRADO DEL COLIBRÍ (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6">
          
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-black via-[#0d0a1a] to-[#1a1528] border border-[#8b5cf6]/40 p-8 flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.25)] group">
            
            {/* AURA CIRCULAR ORBITAL */}
            <div className="absolute inset-2 rounded-full border border-dashed border-[#AAD6CD]/30 animate-spin" style={{ animationDuration: '40s' }} />
            <div className="absolute inset-6 rounded-full border border-dotted border-[#ecb613]/20" />

            {/* SVG ILUSTRADO DE ALTA PRECISIÓN: EL COLIBRÍ S-CLASS */}
            <svg 
              className="w-40 h-40 drop-shadow-[0_0_20px_rgba(139,92,246,0.6)] group-hover:scale-105 transition-transform duration-500" 
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="colibriWings" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#AAD6CD" />
                  <stop offset="100%" stopColor="#ecb613" />
                </linearGradient>
                <linearGradient id="colibriBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="dropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#AAD6CD" />
                  <stop offset="100%" stopColor="#258DCD" />
                </linearGradient>
              </defs>

              {/* Pico largo y afilado de precisión */}
              <path d="M70,95 L15,100 L70,98 Z" fill="#ecb613" />

              {/* Cabeza y ojo */}
              <circle cx="75" cy="95" r="14" fill="url(#colibriBody)" />
              <circle cx="70" cy="92" r="3.5" fill="#050505" />
              <circle cx="69" cy="91" r="1.5" fill="#ffffff" />

              {/* Cuerpo aerodinámico */}
              <path 
                d="M75,105 C90,110 115,135 125,160 C110,145 95,130 75,105 Z" 
                fill="url(#colibriBody)" 
              />

              {/* Ala Primaria Superior desplegada */}
              <path 
                d="M85,100 C105,60 145,30 185,25 C160,55 130,85 95,108 Z" 
                fill="url(#colibriWings)" 
                opacity="0.95"
              />

              {/* Ala Secundaria con ritmo aleteo */}
              <path 
                d="M75,98 C90,65 125,45 155,40 C135,65 110,90 85,105 Z" 
                fill="url(#colibriWings)" 
                opacity="0.6"
              />

              {/* Cola en abanico */}
              <path 
                d="M120,155 L165,185 L140,165 L175,175 L125,150 Z" 
                fill="url(#colibriWings)" 
              />

              {/* La Gota Acústica Sagrada vertida desde el pico */}
              <path 
                d="M14,105 C14,105 8,114 8,118 C8,122 11,125 14,125 C17,125 20,122 20,118 C20,114 14,105 14,105 Z" 
                fill="url(#dropGradient)" 
                className="animate-bounce"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#ecb613] tracking-widest uppercase font-bold block">
              IDENTIDAD VISUAL Y SOBERANÍA
            </span>
            <h4 className="text-xl font-bold font-syne text-white uppercase">
              El Isotipo del Colibrí
            </h4>
            <p className="text-xs font-mono text-zinc-400">
              Manual Maestro concebido por <strong className="text-white">{LEGACY_COLIBRI.creator}</strong>
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: LA FÁBULA Y EL RIGOR ÉTICO (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono tracking-widest uppercase font-bold">
            <Quote size={13} />
            <span>LA FILOSOFÍA // PROTOCOLO COLIBRÍ</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne leading-tight">
            "Yo solo hago <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-[#AAD6CD] to-[#8b5cf6]">mi parte</span>"
          </h3>

          {/* LA FÁBULA TEXTUAL */}
          <div className="relative bg-black/50 border border-white/10 rounded-2xl p-6 italic text-zinc-300 text-sm sm:text-base leading-relaxed space-y-3 font-light">
            <p>
              «{LEGACY_COLIBRI.fable}»
            </p>
          </div>

          {/* LA METÁFORA CLÍNICA */}
          <div className="space-y-3 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            <p>
              {LEGACY_COLIBRI.metaphor}
            </p>
            <p>
              En un sector copado por actividades de mero entretenimiento sin métrica de retorno ni seguridad audiológica, el colibrí encarna el rigor científico de Productora EAR: <strong className="text-white">precisión en la frecuencia (40 Hz), respeto sagrado a los decibelios (&lt; 75 dB) y máxima dignidad humana.</strong>
            </p>
          </div>

          {/* PILARES ESTÉTICOS S-CLASS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] font-mono text-[#8b5cf6] block uppercase font-bold">True Black</span>
              <p className="text-xs text-zinc-300 mt-1">Cero condescendencia. Máxima sobriedad y solemnidad médica.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] font-mono text-[#AAD6CD] block uppercase font-bold">Cyan Hielo</span>
              <p className="text-xs text-zinc-300 mt-1">Evidencia clínica, pulso biológico y aire sináptico limpio.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] font-mono text-[#ecb613] block uppercase font-bold">Oro Noble</span>
              <p className="text-xs text-zinc-300 mt-1">El valor inestimable de la memoria y la historia de una vida.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
