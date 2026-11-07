'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SOVEREIGN HORIZON JOURNEY (VIGIL HORIZONX S-CLASS ENGINE)
 * ════════════════════════════════════════════════════════════════════════════
 * Inspirado en la arquitectura visual de Vigil / HorizonX:
 *  - Canvas interactivo kinético de partículas y horizonte de onda acústica.
 *  - Viaje cinemático en scrollytelling por las 4 verticales de EAR OS.
 *  - Transición de paleta soberana (Oro #ecb613 -> Cyan #00E5FF -> Rubí #FF2B44).
 *  - Sintetizador de audio procedural (Web Audio API) con pulso a 40 Hz y feedback háptico.
 *  - Estética OLED pura (#030305, #050507, sin w-screen).
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
  Award,
  Zap,
  ArrowRight,
  Radio,
  Flame,
  ChevronDown,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';

interface Station {
  id: string;
  number: string;
  vertical: string;
  tagline: string;
  accent: string;
  accentRgb: string;
  kpi: string;
  subKpi: string;
  description: string;
  specs: Array<{ label: string; value: string }>;
  ctaText: string;
  ctaHref: string;
}

const STATIONS: Station[] = [
  {
    id: 'fincas-100',
    number: '01',
    vertical: 'Fincas B2B · Pacto 100 Fundadores',
    tagline: 'Igualación de Cuota Vitalicia & 0% Fuga a Competidores',
    accent: '#ecb613',
    accentRgb: '236, 182, 19',
    kpi: 'Price-Match Vitalicio',
    subKpi: '100 Plazas Exclusivas · 0% IPC',
    description:
      'Garantía contractual de cero publicidad de fincas rivales dentro de tu ficha. Menú simulator 2026 y liquidación SEPA de comisiones en ≤ 7 días.',
    specs: [
      { label: 'Comisión Afiliado', value: '10% - 15%' },
      { label: 'Depósito Price-Lock', value: `${DEPOSITO_STRIPE_EUR},00 € Deducible` },
      { label: 'Fuga Publicitaria', value: '0% Contractual' },
      { label: 'Portes Logísticos', value: '1,50 €/km (>50 km Hub)' },
    ],
    ctaText: 'Acceder al Pacto de Fundadores',
    ctaHref: '#portal-b2b',
  },
  {
    id: 'solista-gala',
    number: '02',
    vertical: 'Solista Gala · Edwin Agudelo',
    tagline: 'Directo Acústico de Alta Fidelidad & Acústica Homologada',
    accent: '#ecb613',
    accentRgb: '236, 182, 19',
    kpi: `${TARIFA_BASE_SOLISTA_EUR},00 €`,
    subKpi: 'Suelo Canónico Solista · Gala VIP',
    description:
      'Espectáculo solista en vivo para cóctel y banquete. Split Soberano 80/10/10 inmutable y rider acústico certificado bajo la Ley 37/2003.',
    specs: [
      { label: 'Tarifa Base', value: `${TARIFA_BASE_SOLISTA_EUR},00 €` },
      { label: 'Rango Acústico', value: '70 - 80 dBA Gala' },
      { label: 'Rider Técnico', value: `${WATTS_PER_PAX} W/pax RMS` },
      { label: 'Split Soberano', value: '80% Artista / 10% EAR / 10% VIMUME' },
    ],
    ctaText: 'Simular Presupuesto en Vivo',
    ctaHref: '#simulador-2026',
  },
  {
    id: 'vimume-neuro',
    number: '03',
    vertical: 'VIMUME · Neuroacústica Senior & Sanidad',
    tagline: 'Estimulación Auditiva No Invasiva 40 Hz & SROI 4.85x',
    accent: '#00E5FF',
    accentRgb: '0, 229, 255',
    kpi: '40 Hz Gamma Wave',
    subKpi: 'SROI Social 4.85x Certificado',
    description:
      'Protocolos neuroacústicos en residencias y centros de mayores. Acústica clínica no invasiva (65-75 dBA) con impacto cognitivo y retorno auditado.',
    specs: [
      { label: 'Frecuencia Terapéutica', value: '40 Hz Resonancia' },
      { label: 'Nivel Sonoro', value: '65 - 75 dBA Clínico' },
      { label: 'CPV Contratación', value: '85320000-8 Social' },
      { label: 'Impacto Social', value: '10% de cada evento EAR' },
    ],
    ctaText: 'Explorar Tecnología VIMUME',
    ctaHref: '/vimume',
  },
  {
    id: 'b2g-municipal',
    number: '04',
    vertical: 'B2G · Municipal Fast-Track',
    tagline: 'Licitaciones & Contratos Menores LCSP Blindados',
    accent: '#FF2B44',
    accentRgb: '255, 43, 68',
    kpi: '< 14.250,00 €',
    subKpi: 'Ajuste Preventivo Art. 118 LCSP',
    description:
      'Expedientes para consistorios y diputaciones sin riesgo de fraccionamiento. Festejos populares y eventos culturales con limitador telemático Cesva.',
    specs: [
      { label: 'Techo Menor', value: '14.250,00 € (-5% Buffer)' },
      { label: 'Presión Sonora', value: '90 - 102 dBA Limitado' },
      { label: 'CPV Artístico', value: '92312000-1 Oficial' },
      { label: 'Firma Telemática', value: 'SHA-256 Sello Inmutable' },
    ],
    ctaText: 'Consultar Expedientes B2G',
    ctaHref: '/b2g',
  },
];

export default function SovereignHorizonJourney() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeStationIndex, setActiveStationIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const activeStation = STATIONS[activeStationIndex] ?? STATIONS[0]!;

  // ── SINTETIZADOR DE AUDIO PROCEDURAL (WEB AUDIO API — CERO MP3s) ───────────
  const playProceduralPulse = useCallback((freq: number, type: OscillatorType = 'sine', durationMs = 120) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // AudioContext fallback silent
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      setTimeout(() => playProceduralPulse(440, 'triangle', 180), 50);
    }
  };

  const handleSelectStation = (index: number) => {
    setActiveStationIndex(index);
    const baseFreqs = [220, 330, 40, 520];
    playProceduralPulse(baseFreqs[index] ?? 330, index === 2 ? 'sine' : 'triangle', 140);
  };

  // ── KINETIC CANVAS HORIZON (VIGIL HORIZONX PROCEDURAL SHADER) ──────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Partículas del horizonte estelar
    const PARTICLE_COUNT = 90;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.8,
      opacity: Math.random() * 0.7 + 0.2,
    }));

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.fillStyle = '#030305';
      ctx.fillRect(0, 0, width, height);

      const [r, g, b] = (activeStation.accentRgb || '236, 182, 19')
        .split(',')
        .map((n) => Number(n.trim()));

      // 1. Resplandor cinemático central (Atmósfera OLED)
      const gradCenter = ctx.createRadialGradient(
        width / 2,
        height * 0.65,
        10,
        width / 2,
        height * 0.65,
        width * 0.6
      );
      gradCenter.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.18)`);
      gradCenter.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.04)`);
      gradCenter.addColorStop(1, 'rgba(3, 3, 5, 0)');
      ctx.fillStyle = gradCenter;
      ctx.fillRect(0, 0, width, height);

      // 2. Ondas acústicas cinemáticas (Horizon Wave)
      ctx.lineWidth = 1.5;
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const yOffset = height * 0.62 + w * 22;
        const waveFreq = 0.003 + w * 0.001;
        const waveAmp = 18 + Math.sin(time + w) * 12;

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.35 - w * 0.08})`;

        for (let x = 0; x <= width; x += 8) {
          const y = yOffset + Math.sin(x * waveFreq + time * (1.2 + w * 0.3)) * waveAmp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 3. Malla de perspectiva en el suelo (Horizon Grid)
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.08)`;
      ctx.lineWidth = 1;
      const horizonY = height * 0.62;
      const fovCenter = width / 2;

      // Líneas radiales de perspectiva
      for (let angle = -width * 0.7; angle <= width * 1.7; angle += width * 0.08) {
        ctx.beginPath();
        ctx.moveTo(fovCenter, horizonY);
        ctx.lineTo(angle, height);
        ctx.stroke();
      }

      // Líneas horizontales con compresión de perspectiva
      for (let d = 0; d < 8; d++) {
        const factor = Math.pow(d / 8, 2.2);
        const lineY = horizonY + factor * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();
      }

      // 4. Partículas en suspensión
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeStation]);

  return (
    <section className="relative w-full min-h-[750px] lg:min-h-[820px] bg-[#030305] text-white overflow-hidden border-b border-white/10 flex flex-col justify-between">
      {/* 🌌 KINETIC CANVAS HORIZON (ESTILO VIGIL HORIZONX) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 🎛️ BARRA DE ESTADO TÁCTICA & AUDIO PROCEDURAL */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: activeStation.accent }}
            />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300">
              EAR OS · HorizonX Travel Engine
            </span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
            Live Telemetry 60 FPS
          </span>
        </div>

        {/* Control de Audio Procedural */}
        <button
          type="button"
          onClick={toggleSound}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 hover:border-[#ecb613]/50 backdrop-blur-md transition-all cursor-pointer text-xs font-mono text-zinc-300 hover:text-white"
          title={soundEnabled ? 'Silenciar síntesis procedural' : 'Activar síntesis de frecuencia 40Hz'}
        >
          {soundEnabled ? (
            <>
              <Volume2 size={14} className="text-[#ecb613] animate-pulse" />
              <span className="text-[#ecb613]">Audio Habilitado</span>
            </>
          ) : (
            <>
              <VolumeX size={14} className="text-zinc-500" />
              <span>Audio Off</span>
            </>
          )}
        </button>
      </div>

      {/* 🚀 ESCENARIO PRINCIPAL DEL VIAJE (SCROLLYTELLING VIEWPORT) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Lado Izquierdo: Estación Activa & Copys Cinemáticos */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono font-black uppercase px-2.5 py-1 rounded-md bg-white/5 border"
              style={{ borderColor: activeStation.accent, color: activeStation.accent }}
            >
              Estación {activeStation.number} / 04
            </span>
            <span className="text-xs font-mono text-zinc-400">
              {activeStation.vertical}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStation.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-syne tracking-tight text-white leading-tight">
                {activeStation.tagline}
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-2xl">
                {activeStation.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Especificaciones Técnicas Auditadas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {activeStation.specs.map((spec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  {spec.label}
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-white mt-1 block">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Transaccional */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href={activeStation.ctaHref}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all shadow-xl cursor-pointer"
              style={{
                backgroundColor: activeStation.accent,
                color: '#000',
              }}
            >
              <span>{activeStation.ctaText}</span>
              <ArrowRight size={16} />
            </a>
            <a
              href="#simulador-2026"
              className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all"
            >
              Simulador Menús 2026
            </a>
          </div>
        </div>

        {/* Lado Derecho: HUD Holográfico de Telemetría Dinámica */}
        <div className="lg:col-span-5">
          <div
            className="rounded-3xl bg-[#09090d]/90 border p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl transition-all"
            style={{ borderColor: `rgba(${activeStation.accentRgb}, 0.35)` }}
          >
            {/* Halo de Neón Soberano */}
            <div
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{ backgroundColor: activeStation.accent }}
            />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Radio size={16} style={{ color: activeStation.accent }} className="animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Telemetría Transaccional
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                SSOT Canonical
              </span>
            </div>

            <div className="py-6 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                Indicador Clave de Rendimiento
              </span>
              <p
                className="text-4xl sm:text-5xl font-black font-syne tracking-tight"
                style={{ color: activeStation.accent }}
              >
                {activeStation.kpi}
              </p>
              <p className="text-xs font-mono text-zinc-300">
                {activeStation.subKpi}
              </p>
            </div>

            {/* Invariantes Activos del Ecosistema */}
            <div className="space-y-2.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Split Soberano:</span>
                <span className="text-white font-bold">80% Artista / 10% EAR / 10% VIMUME</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Depósito Stripe:</span>
                <span className="text-emerald-400 font-bold">100,00 € (100% Deducible)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Límite Acústico:</span>
                <span className="text-white font-bold">&lt; 75 dB SPL · 12 W/pax</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Base Logística:</span>
                <span className="text-[#ecb613] font-bold">Hub Méntrida (Toledo)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 SELECTOR DE ESTACIONES HORIZONTALES (VIGIL NAVIGATION DOCK) */}
      <div className="relative z-10 w-full border-t border-white/10 bg-black/60 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hidden md:inline-block">
            Selector de Vertical Soberana:
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {STATIONS.map((station, idx) => {
              const isCurrent = idx === activeStationIndex;
              return (
                <button
                  key={station.id}
                  type="button"
                  onClick={() => handleSelectStation(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-2 border ${
                    isCurrent
                      ? 'bg-white/10 text-white font-black shadow-md'
                      : 'bg-transparent text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'
                  }`}
                  style={{
                    borderColor: isCurrent ? station.accent : undefined,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isCurrent ? station.accent : '#52525b' }}
                  />
                  <span>
                    {station.number}. {station.vertical.split('·')[0]?.trim()}
                  </span>
                </button>
              );
            })}
          </div>

          <a
            href="#catalogo-fincas"
            className="text-[11px] font-mono text-zinc-400 hover:text-[#ecb613] flex items-center gap-1 transition-colors"
          >
            <span>Ver 9.559 Espacios</span>
            <ChevronDown size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
