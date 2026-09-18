"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ShieldCheck, 
  Sliders, 
  Phone, 
  ArrowRight, 
  Calendar, 
  Star, 
  Music, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Building2, 
  CheckCircle2,
  Lock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { SCLASS_12_FINCAS_HOMOLOGADAS } from "@/lib/constants/fincas-catalog";

export default function SClassCrystalHero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeFincaIndex, setActiveFincaIndex] = useState(0);
  const [activeAcousticMode, setActiveAcousticMode] = useState<"ceremonia" | "coctel" | "banquete">("coctel");
  const videoRef = useRef<HTMLVideoElement>(null);

  const fincas = SCLASS_12_FINCAS_HOMOLOGADAS || [];

  const acousticSpecs = {
    ceremonia: {
      title: "Ceremonia Lírica & Emoción Pura",
      spl: "< 68 dB SPL",
      repertoire: "Ave María, Caruso, Il Divo, Baladas Románticas",
      power: "8 W / pax (Bose S1 Pro Batería Sin Cables)",
    },
    coctel: {
      title: "Cóctel Acústico & Jazz Lounge",
      spl: "< 72 dB SPL",
      repertoire: "Boleros de Gala, Pop Internacional Acústico, Bossa Nova",
      power: "12 W / pax (Bose F1 Model 812 Bi-Amplificado)",
    },
    banquete: {
      title: "Banquete & Entrada Triunfal",
      spl: "< 75 dB SPL",
      repertoire: "Canción de Autor, Éxitos Elegantes, Serenata Personalizada",
      power: "15 W / pax (Rider Completo + Acometida CETAC)",
    },
  };

  const handleNextFinca = () => {
    setActiveFincaIndex((prev) => (prev + 1) % fincas.length);
  };

  const handlePrevFinca = () => {
    setActiveFincaIndex((prev) => (prev - 1 + fincas.length) % fincas.length);
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="relative w-full max-w-full overflow-hidden bg-[#030305] text-white pt-2 sm:pt-4 pb-16 selection:bg-[#ecb613] selection:text-black">
      
      {/* Background Refractive Crystal Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-[#ecb613]/10 rounded-full blur-[140px] crystal-aura-wave" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-[120px] crystal-aura-wave" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_30%,_#030305_95%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ========================================================================= */}
        {/* 1. RESTRICTED EDITORIAL HEADER (SYNE DISPLAY + JETBRAINS MONO TELEMETRY) */}
        {/* ========================================================================= */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto">
          
          {/* Top Crystal Pill Badge */}
          <div className="crystal-pill-badge crystal-glass-fx-gold animate-in fade-in slide-in-from-top-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#ecb613] font-bold">
              ESTÁNDAR CINEMÁTICO S-CLASS • PRODUCTORA EAR
            </span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Syne'] tracking-tight text-white leading-[1.08] uppercase">
            Música en Directo de Alta Fidelidad &bull;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white italic">
              Sin Intermediarios
            </span>
          </h1>

          {/* Editorial Subtitle */}
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl font-normal leading-relaxed">
            Voz lírica de gala con <strong className="text-white">Edwin Agudelo</strong>, microfonía Shure Beta 87A y sonorización Bose F1 812 calibrada por debajo de 75 dB SPL. Blindaje para fincas de élite y presupuesto cerrado con reserva Stripe de 100 €.
          </p>

          {/* Quick Telemetry Spec Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="crystal-pill-badge">
              <Star className="w-3.5 h-3.5 text-[#ecb613] fill-[#ecb613]" />
              5.0 ★ Novios Verificados
            </span>
            <span className="crystal-pill-badge">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Tarifa Base 350,00 €
            </span>
            <span className="crystal-pill-badge">
              <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" />
              &lt; 75 dB SPL Normativa
            </span>
            <span className="crystal-pill-badge">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Depósito 100 € Stripe SHA-256
            </span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. ATMOSPHERIC CENTERPIECE (LIVING CRYSTAL PERFORMANCE FRAME)            */}
        {/* ========================================================================= */}
        <div className="relative rounded-[2.5rem] overflow-hidden crystal-glass-fx border border-white/10 p-2 sm:p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
          
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-[2rem] overflow-hidden bg-black flex items-center justify-center group">
            
            {/* Ambient Video / Loop Element */}
            <video
              ref={videoRef}
              src="https://cdn.horizonx.so/astryn-crystal-hero/astryn-feature.mp4"
              poster="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop"
              muted={isMuted}
              loop
              autoPlay
              playsInline
              className="w-full h-full object-cover opacity-80 group-hover:scale-[1.01] transition-transform duration-1000 ease-out pointer-events-none"
            />

            {/* Dark Vignette Overlay & Atmospheric Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(3,3,5,0.85)_100%)] pointer-events-none" />

            {/* Floating Top Media Controls */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between pointer-events-auto z-20">
              
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full crystal-glass-fx text-xs font-mono text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>DIRECTO • EDWIN AGUDELO S-CLASS</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSound}
                  className="w-9 h-9 rounded-full crystal-glass-fx hover:bg-white/10 flex items-center justify-center text-white transition active:scale-95"
                  title={isMuted ? "Activar Audio" : "Silenciar Audio"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-[#ecb613]" />}
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full crystal-glass-fx hover:bg-white/10 flex items-center justify-center text-white transition active:scale-95"
                  title={isPlaying ? "Pausar" : "Reproducir"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-[#ecb613]" />}
                </button>
              </div>

            </div>

            {/* Floating Acoustic Selector Overlay (Ceremonia, Cóctel, Banquete) */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 z-20">
              
              <div className="space-y-1.5 max-w-md bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-[#ecb613] text-xs font-mono font-bold uppercase">
                  <Music className="w-3.5 h-3.5" />
                  <span>{acousticSpecs[activeAcousticMode].title}</span>
                </div>
                <p className="text-xs text-zinc-300 line-clamp-2">
                  {acousticSpecs[activeAcousticMode].repertoire}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-zinc-400">
                  <span className="text-emerald-400 font-bold">{acousticSpecs[activeAcousticMode].spl}</span>
                  <span>•</span>
                  <span>{acousticSpecs[activeAcousticMode].power}</span>
                </div>
              </div>

              {/* Mode Switcher Buttons */}
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-2xl p-1.5 rounded-2xl border border-white/10">
                {(["ceremonia", "coctel", "banquete"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setActiveAcousticMode(mode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all ${
                      activeAcousticMode === mode
                        ? "bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. PEEK-FRAME CAROUSEL (12 FINCAS HOMOLOGADAS S-CLASS & CITAS REALES)    */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#ecb613] font-bold">
                <Building2 className="w-4 h-4" />
                <span>Red de Espacios Singulares Homologados</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Syne'] text-white">
                Fincas Certificadas S-Class &bull; Madrid & Toledo
              </h2>
            </div>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevFinca}
                className="w-10 h-10 rounded-full crystal-glass-fx hover:bg-white/10 flex items-center justify-center text-white transition active:scale-95"
                aria-label="Finca anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-zinc-400 px-2">
                {activeFincaIndex + 1} / {fincas.length}
              </span>
              <button
                type="button"
                onClick={handleNextFinca}
                className="w-10 h-10 rounded-full crystal-glass-fx hover:bg-white/10 flex items-center justify-center text-white transition active:scale-95"
                aria-label="Siguiente finca"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Finca Spotlight Card */}
          {fincas[activeFincaIndex] && (
            <div className="p-6 rounded-3xl crystal-glass-fx border border-zinc-800 bg-gradient-to-br from-[#0c0c12] via-[#08080c] to-[#040406] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-bold uppercase">
                    Finca Homologada S-Class #{fincas[activeFincaIndex].id}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {fincas[activeFincaIndex].location} ({fincas[activeFincaIndex].distanciaHubMentridaKm} km desde Méntrida)
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-['Syne'] text-white">
                  {fincas[activeFincaIndex].name}
                </h3>

                <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                  {fincas[activeFincaIndex].description || "Espacio singular con auditoría acústica de sala completada. Cobertura sin cables Bose S1 Pro y cumplimiento estricto de los 75 dB SPL."}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 block text-[9px] uppercase">Acometida Eléctrica</span>
                    <span className="text-white font-bold">{fincas[activeFincaIndex].tomaElectrica}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 block text-[9px] uppercase">Límite Acústico</span>
                    <span className="text-emerald-400 font-bold">&lt; {fincas[activeFincaIndex].limiteAcustico.exteriorDBA} dBA</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 block text-[9px] uppercase">Aforo Ceremonia</span>
                    <span className="text-white font-bold">{fincas[activeFincaIndex].capacidadMaxPax} pax</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/50 border border-zinc-800">
                    <span className="text-zinc-500 block text-[9px] uppercase">Comisión Afiliado</span>
                    <span className="text-[#ecb613] font-bold">{fincas[activeFincaIndex].comisionAfiliacionPct}% Split Directo</span>
                  </div>
                </div>
              </div>

              {/* Action Column */}
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
                <Link
                  href={`/calculadora?finca=${encodeURIComponent(fincas[activeFincaIndex].name)}`}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#ecb613] to-[#d4a010] hover:from-[#d4a010] text-black font-semibold text-xs tracking-wider uppercase font-['Syne'] transition flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  Cotizar Fecha en esta Finca
                </Link>

                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola Edwin, queremos consultar disponibilidad para ${fincas[activeFincaIndex].name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-2xl crystal-glass-fx hover:bg-white/10 text-white font-mono text-xs transition flex items-center justify-center gap-2 border border-zinc-700"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp Directo Concierge
                </a>
              </div>

            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. CONVERSION DOCK (1-CLIC PRICE-LOCK & SOPORTE 24/7)                     */}
        {/* ========================================================================= */}
        <div className="p-6 rounded-3xl crystal-glass-fx-gold flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#ecb613] font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              Reserva Blindada SHA-256 • Sin Sorpresas
            </div>
            <h3 className="text-xl font-bold font-['Syne'] text-white">
              ¿Tienes una fecha en mente? Bloquéala con 100,00 €
            </h3>
            <p className="text-xs text-zinc-300">
              El depósito de 100 € bloquea tu día en exclusiva. Si la finca requiere cancelación justificada, se reprograma sin penalización.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/pro"
              className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-[#ecb613] text-zinc-300 hover:text-white text-xs font-mono transition flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 text-[#ecb613]" />
              Acceso Portal B2B Pro
            </Link>

            <Link
              href="/calculadora"
              className="px-6 py-3.5 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs font-['Syne'] uppercase tracking-wider transition shadow-[0_0_25px_rgba(236,182,19,0.3)] active:scale-95 flex items-center gap-2"
            >
              <span>Cotizador en 1 Clic</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
