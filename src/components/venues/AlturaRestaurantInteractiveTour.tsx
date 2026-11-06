'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Users,
  UtensilsCrossed,
  ArrowRight,
  Phone,
  Compass,
  TreePine,
  CalendarCheck,
  Clock,
  Car,
  Camera,
  Music,
  ExternalLink,
  Award,
  Lock,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import { EZKERTZA_DERIO_VENUE } from '@/lib/constants/ezkertza-derio-venue';
import {
  EZKERTZA_STORYTELLING_CHAPTERS,
  StorytellingChapter,
} from '@/lib/constants/ezkertza-storytelling-chapters';

export function AlturaRestaurantInteractiveTour() {
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const currentChapter = EZKERTZA_STORYTELLING_CHAPTERS[activeChapterIdx];

  const handleNext = () => {
    setActiveChapterIdx((prev) => (prev < EZKERTZA_STORYTELLING_CHAPTERS.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveChapterIdx((prev) => (prev > 0 ? prev - 1 : EZKERTZA_STORYTELLING_CHAPTERS.length - 1));
  };

  // Navegación accesible por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full font-sans select-none my-6">
      {/* ━━━ RECORRIDO HERO CINEMÁTICO FORMATO ALTURA ━━━ */}
      <section
        aria-label="Storytelling inmersivo Ezkertza Berria"
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[580px] sm:min-h-[720px] rounded-[32px] sm:rounded-[44px] overflow-hidden border border-white/10 bg-[#030305] shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
      >
        {/* IMAGEN DE FONDO REAL CON ILUMINACIÓN CREPUSCULAR */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            key={currentChapter.id}
            src={currentChapter.imageUrl}
            alt={currentChapter.roomName.replace('\n', ' ')}
            className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.08] saturate-[1.1] transition-transform duration-1000 ease-out scale-100"
          />

          {/* Viñeta crepuscular periférica estilo Altura */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>

        {/* PÍLDORAS DE COLECCIÓN SUPERIORES DERECHAS */}
        <div className="absolute top-6 sm:top-8 right-6 sm:right-10 z-20 hidden md:flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-wider text-zinc-300">
            <span className="text-[#ecb613] font-bold">01</span> Finca Canónica
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-wider text-zinc-300">
            <span className="text-[#00E5FF] font-bold">02</span> 1 Evento / Día
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-wider text-zinc-300">
            <span className="text-emerald-400 font-bold">03</span> Acústica S-Class
          </div>
        </div>

        {/* LOGO GIGANTE REFRACTIVO DETRÁS DEL CONTENIDO */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="text-[19vw] font-black font-display tracking-tight text-white/[0.04] uppercase leading-none select-none">
            EZKERTZA
          </div>
        </div>

        {/* TIPOGRAFÍA EDITORIAL MONUMENTAL CENTRADA */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 sm:px-12 pointer-events-none">
          <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.3em] text-zinc-300 font-semibold drop-shadow-md">
            {currentChapter.stepNumber}
          </p>

          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light font-display text-white tracking-wide uppercase leading-[1.05] mt-2 mb-3 drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] whitespace-pre-line">
            {currentChapter.roomName}
          </h2>

          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-300/90 font-medium max-w-xl drop-shadow-md">
            {currentChapter.subtitle}
          </p>

          <div className="mt-6 pointer-events-auto">
            <a
              href={`https://wa.me/${CENTRALITA_EAR_OS.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola Edwin, solicito visita técnica para el espacio ${currentChapter.roomName.replace('\n', ' ')} en Ezkertza Berria.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
            >
              <span>{currentChapter.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
            </a>
          </div>
        </div>

        {/* TARJETA FLOTANTE VIDRIO ESMERILADO ('NOW SHOWING') */}
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 z-20 max-w-xs sm:max-w-sm pointer-events-auto">
          <div className="p-4 sm:p-5 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/15 shadow-2xl text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300 font-bold">
                EN VISOR · {currentChapter.category}
              </span>
            </div>

            <div className="text-sm sm:text-base font-bold font-display text-white">
              Restaurante Ezkertza Berria
            </div>

            <p className="text-[11px] text-zinc-300 leading-relaxed font-sans line-clamp-2">
              {currentChapter.description}
            </p>

            <div className="pt-1 flex items-center justify-between text-[11px] font-mono border-t border-white/10 text-zinc-300">
              <span className="text-[#ecb613] font-bold">Depósito {DEPOSITO_STRIPE_EUR.toFixed(0)} €</span>
              <a
                href="#ficha-storytelling"
                className="text-white hover:text-[#ecb613] underline underline-offset-4 flex items-center gap-1 transition-colors"
              >
                <span>Ver Storytelling</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* LÍNEA DE PROGRESO INFERIOR */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          <div
            className="h-full bg-gradient-to-r from-[#ecb613] to-white transition-all duration-500 ease-out"
            style={{ width: `${((activeChapterIdx + 1) / EZKERTZA_STORYTELLING_CHAPTERS.length) * 100}%` }}
          />
        </div>
      </section>

      {/* DOCK DE NAVEGACIÓN INFERIOR */}
      <nav aria-label="Controles de navegación" className="flex items-center justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Habitación anterior"
          className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md">
          {EZKERTZA_STORYTELLING_CHAPTERS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveChapterIdx(idx)}
              aria-label={`Ir al capítulo ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeChapterIdx
                  ? 'w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                  : 'w-2 bg-zinc-600 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Siguiente habitación"
          className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
}
