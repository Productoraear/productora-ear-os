"use client";

import React, { useState } from 'react';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface QuantumColibriProps {
  onQuickQuoteClick?: () => void;
  primaryAccent?: string; // hex o clase
}

export default function QuantumColibri({
  onQuickQuoteClick,
  primaryAccent = '#ecb613'
}: QuantumColibriProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      "¡Hola Edwin! Vi el Colibrí Cuántico en Productora EAR OS y deseo consultar presupuesto directo para mi evento."
    );
    window.open(`https://wa.me/34693693048?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-[calc(var(--ear-dock-h)+0.5rem)] right-3 lg:bottom-6 lg:right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Menú Flotante Expandido */}
      {isExpanded && (
        <div className="mb-3 w-80 rounded-3xl bg-[#09090e]/95 backdrop-blur-2xl border border-white/10 p-5 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-syne font-bold uppercase tracking-wider text-white">
                Colibrí Cuántico EAR OS
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/40 hover:text-white text-xs p-1 rounded-lg"
              aria-label="Cerrar panel"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs text-white/70">
            <p className="leading-relaxed">
              Guardián soberano de velocidad, geolocalización y precios inmutables sin intermediarios.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-white/40 block">LATENCIA EDGE</span>
                <span className="text-emerald-400 font-bold">&lt; 35 ms</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-white/40 block">PRICE-LOCK</span>
                <span className="text-[#ecb613] font-bold">SHA-256</span>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <button
                onClick={handleDirectWhatsApp}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle size={14} /> Asesoría Edwin Agudelo
                </span>
                <ArrowRight size={12} />
              </button>

              {onQuickQuoteClick && (
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onQuickQuoteClick();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#ecb613] hover:bg-amber-300 text-black font-extrabold text-xs flex items-center justify-between transition-all shadow-lg shadow-[#ecb613]/20"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} /> Cotizar en 10 Segundos
                  </span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botón Principal del Colibrí (Isotipo Vectorial de Lujo) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center p-3.5 rounded-full bg-[#0a0a10]/90 hover:bg-[#12121c] border border-white/15 hover:border-[#ecb613]/60 shadow-2xl shadow-black transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Abrir asistente Colibrí Cuántico"
      >
        {/* Halo de luz viva */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF2B44]/20 via-[#ecb613]/20 to-[#00E5FF]/20 blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>

        {/* Isotipo SVG de Lujo: Colibrí Vectorial con Alas Cinéticas */}
        <svg
          className="relative w-8 h-8 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:rotate-3"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cola / Estela Dinámica */}
          <path
            d="M20 75 C30 68 40 60 50 52 C38 62 26 72 20 75 Z"
            fill="url(#colibriGradTail)"
          />
          <path
            d="M15 85 C28 75 42 62 52 50 C35 65 22 78 15 85 Z"
            fill="url(#colibriGradTail2)"
          />

          {/* Cuerpo y Cabeza */}
          <path
            d="M48 48 C55 42 65 38 72 40 C75 41 78 44 76 48 C73 53 65 58 58 58 C52 58 48 53 48 48 Z"
            fill="url(#colibriGradBody)"
          />

          {/* Pico Fino y Preciso */}
          <path
            d="M76 43 L95 38 L77 46 Z"
            fill="#ecb613"
          />

          {/* Ojo de Diamante */}
          <circle cx="71" cy="43" r="1.5" fill="#ffffff" />

          {/* Ala Superior (Ángulo Elevado) */}
          <path
            d="M52 46 C56 30 68 15 82 12 C75 22 66 35 56 46 Z"
            fill="url(#colibriGradWing1)"
            className="origin-[52px_46px] animate-[pulse_2s_ease-in-out_infinite]"
          />

          {/* Ala Secundaria (Profundidad) */}
          <path
            d="M45 48 C48 35 56 24 68 20 C62 28 54 38 48 49 Z"
            fill="url(#colibriGradWing2)"
            opacity="0.85"
          />

          {/* Gradientes Cuánticos */}
          <defs>
            <linearGradient id="colibriGradBody" x1="48" y1="40" x2="78" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ecb613" />
              <stop offset="0.5" stopColor="#FF2B44" />
              <stop offset="1" stopColor="#00E5FF" />
            </linearGradient>
            <linearGradient id="colibriGradWing1" x1="52" y1="12" x2="82" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ecb613" />
              <stop offset="1" stopColor="#FF2B44" />
            </linearGradient>
            <linearGradient id="colibriGradWing2" x1="45" y1="20" x2="68" y2="49" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00E5FF" />
              <stop offset="1" stopColor="#9F1239" />
            </linearGradient>
            <linearGradient id="colibriGradTail" x1="20" y1="75" x2="50" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00E5FF" />
              <stop offset="1" stopColor="#ecb613" />
            </linearGradient>
            <linearGradient id="colibriGradTail2" x1="15" y1="85" x2="52" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF2B44" />
              <stop offset="1" stopColor="#00E5FF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tooltip elegante al hover */}
        {isHovered && !isExpanded && (
          <span className="absolute right-full mr-3 whitespace-nowrap rounded-xl bg-black/90 border border-white/10 px-3 py-1.5 text-[11px] font-mono text-white shadow-xl animate-in fade-in duration-150">
            Asistente Cuántico EAR OS
          </span>
        )}
      </button>
    </div>
  );
}
