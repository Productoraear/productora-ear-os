'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Truck,
  Volume2, Users, ArrowRight,
  Radio, ShieldCheck
} from 'lucide-react';
import { ARTIST_FORMATS, SOVEREIGN_ARTIST, calculateQuote } from './types';
import { playAnalogClick } from '@/lib/audio/AnalogClickSynth';

/* ── GEODESIA S-CLASS: HAVERSINE + TRAZA EN CARRETERA ── */
const HUB_MENTRIDA = { lat: 40.2383, lon: -4.2361 } as const;
const DEST_MADRID = { lat: 40.4168, lon: -3.7038 } as const;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Distancia ortodrómica (fórmula de Haversine) en km entre dos coordenadas. */
function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(bLat - aLat);
  const dLon = toRadians(bLon - aLon);
  const la1 = toRadians(aLat);
  const la2 = toRadians(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

/** Distancia geodésica canónica Hub Méntrida → Madrid (≈ 48 km). */
const GEODESIC_KM = haversineKm(HUB_MENTRIDA.lat, HUB_MENTRIDA.lon, DEST_MADRID.lat, DEST_MADRID.lon);

interface StarParticle {
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly phase: number;
  readonly speed: number;
}

interface Point2D {
  readonly x: number;
  readonly y: number;
}

/** Interpolación sobre una Bézier cuadrática (proyección del arco de círculo máximo). */
function quadraticPoint(p0: Point2D, control: Point2D, p1: Point2D, t: number): Point2D {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * control.x + t * t * p1.x,
    y: mt * mt * p0.y + 2 * mt * t * control.y + t * t * p1.y,
  };
}

export default function Archetype2_UberRadar({ onDispatch, initialFormatId, initialPaxCount, initialDistanceKm }: {
  onDispatch?: (data: { formatId: string; distanceKm: number; paxCount: number }) => void;
  initialFormatId?: string;
  initialPaxCount?: number;
  initialDistanceKm?: number;
}) {
  const [selectedFormatId, setSelectedFormatId] = useState(initialFormatId || 'cuarteto-imperial');
  const [distanceKm, setDistanceKm] = useState(initialDistanceKm ?? 45);
  const [paxCount, setPaxCount] = useState(initialPaxCount ?? 130);
  const [dispatched, setDispatched] = useState(false);
  const cityTarget = 'Madrid / Alrededores';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  const activeFormat = ARTIST_FORMATS.find(f => f.id === selectedFormatId) || ARTIST_FORMATS[0];
  const quote = calculateQuote({
    basePrice: activeFormat.basePrice,
    extraMusicians: 0,
    distanceKm,
    pax: paxCount,
    hasBoseSound: true,
    hasPhotocall: true
  });

  // ETA militar derivado de la geodésica real (Haversine), no del slider de cotización.
  const etaMinutes = Math.round(25 + GEODESIC_KM * 0.8);
  const wattsNeeded = paxCount * 12;

  /* 🛰️ RADAR DOPPLER CINEMÁTICO A 60 FPS (canvas 2D, cero librerías externas). */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const stars: StarParticle[] = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.7,
    }));

    const originFrac: Point2D = { x: 0.16, y: 0.74 };
    const destFrac: Point2D = { x: 0.84, y: 0.26 };

    const start = performance.now();

    const render = (now: number): void => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) * 0.44;

      // Fondo radial profundo (OLED).
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.5);
      bg.addColorStop(0, 'rgba(22,22,30,0.92)');
      bg.addColorStop(1, 'rgba(4,4,6,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Partículas estelares tenues (twinkle).
      for (const s of stars) {
        const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.globalAlpha = tw * 0.6;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Anillos concéntricos del radar.
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (maxR / 4) * i, 0, Math.PI * 2);
        ctx.strokeStyle = i === 4 ? 'rgba(236,182,19,0.22)' : 'rgba(255,255,255,0.07)';
        ctx.setLineDash(i === 4 ? [3, 5] : []);
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Aguja Doppler con estela luminosa.
      const sweep = (t * 0.85) % 1;
      const sweepAngle = sweep * Math.PI * 2;
      for (let k = 10; k >= 0; k--) {
        const a = sweepAngle - k * 0.055;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, a - 0.04, a + 0.012);
        ctx.strokeStyle = `rgba(236,182,19,${(((10 - k) / 10) * 0.32).toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // Traza geodésica (Bézier cuadrática que proyecta el arco de círculo máximo).
      const origin: Point2D = { x: originFrac.x * width, y: originFrac.y * height };
      const dest: Point2D = { x: destFrac.x * width, y: destFrac.y * height };
      const midX = (origin.x + dest.x) / 2;
      const midY = (origin.y + dest.y) / 2;
      const dx = dest.x - origin.x;
      const dy = dest.y - origin.y;
      const len = Math.hypot(dx, dy) || 1;
      const control: Point2D = {
        x: midX + (-dy / len) * len * 0.3,
        y: midY + (dx / len) * len * 0.3,
      };

      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.quadraticCurveTo(control.x, control.y, dest.x, dest.y);
      ctx.strokeStyle = 'rgba(236,182,19,0.32)';
      ctx.setLineDash([4, 5]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // Unidad móvil viajando por la geodésica (pulso Doppler).
      const progress = (t * 0.12) % 1;
      const unit = quadraticPoint(origin, control, dest, progress);
      const pulsePhase = (t * 2.2) % 1;
      ctx.beginPath();
      ctx.arc(unit.x, unit.y, 4 + pulsePhase * 18, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(236,182,19,${(1 - pulsePhase).toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(unit.x, unit.y, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ecb613';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(unit.x, unit.y, 5.4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(236,182,19,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pines origen (Hub Méntrida) y destino (Madrid).
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00E5FF';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(dest.x, dest.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FF2B44';
      ctx.fill();

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleSlideComplete = () => {
    playAnalogClick({ frequency: 720, durationMs: 24 });
    // Contracción cinemática del radar en haz láser antes de despachar la unidad.
    setDispatched(true);
    window.setTimeout(() => {
      if (onDispatch) {
        onDispatch({ formatId: selectedFormatId, distanceKm, paxCount });
        return;
      }
      const text = encodeURIComponent(
        `🚨 DESPACHO UBER S-CLASS EAR OS\n- Formato: ${activeFormat.name}\n- Destino: ${cityTarget} (${distanceKm} km)\n- Asistentes: ${paxCount} pax (${wattsNeeded}W Acústicos)\n- Total Estimado: ${quote.total}€\n- Depósito Stripe: 100€\nSolicito confirmación de unidad móvil.`
      );
      window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
    }, 680);
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-[#050505] text-white p-4 select-none relative overflow-y-auto no-scrollbar space-y-4">

      {/* 📡 CABINA MILITAR — TELEMETRÍA EN TIEMPO REAL */}
      <div className="grid grid-cols-3 gap-1.5 bg-black/60 border border-white/10 p-2 rounded-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center py-1.5 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">ETA</span>
          <span className="text-sm font-black font-mono text-[#ecb613] tabular-nums">{etaMinutes} MIN</span>
        </div>
        <div className="flex flex-col items-center justify-center py-1.5 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 flex items-center gap-1">
            <Radio size={9} className="text-emerald-400" /> STATUS
          </span>
          <span className="text-[9px] font-black font-mono text-emerald-400 text-center leading-tight">
            Unidad Bose F1 Asignada
          </span>
        </div>
        <div className="flex flex-col items-center justify-center py-1.5 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 flex items-center gap-1">
            <ShieldCheck size={9} className="text-[#ecb613]" /> PRESIÓN SONORA
          </span>
          <span className="text-[9px] font-black font-mono text-white text-center leading-tight">
            Homologada Ley 37/2003
          </span>
        </div>
      </div>

      {/* 🧭 RADAR DOPPLER CINEMÁTICO EN CANVAS + HAZ LÁSER DE DESPACHO */}
      <div className="relative">
        <motion.div
          animate={dispatched
            ? { scaleY: 0.04, scaleX: 0.5, opacity: 0.5 }
            : { scaleY: 1, scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '50% 100%' }}
          className="relative w-full h-56 rounded-3xl overflow-hidden border border-[#ecb613]/30 bg-[#09090d] shadow-2xl aura-glow-oled"
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Unidad Móvil (pin central) */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613] text-black flex items-center justify-center shadow-lg shadow-[#ecb613]/40 border-2 border-white">
              <Truck size={22} className="text-black stroke-[2.5]" />
            </div>
          </div>

          {/* Hotspots periféricos */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[9px] font-mono z-10">
            <span className="text-white/40 block">ORIGEN</span>
            <span className="font-bold text-white">Hub Méntrida</span>
          </div>

          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[9px] font-mono text-right z-10">
            <span className="text-white/40 block">POTENCIA</span>
            <span className="font-black text-emerald-400">{wattsNeeded}W @ 12W/pax</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#ecb613]/40 text-[9px] font-mono text-right z-10">
            <span className="text-[#ecb613] block">GEODÉSICA HAVERSINE</span>
            <span className="font-black text-emerald-400">{GEODESIC_KM.toFixed(1)} KM</span>
          </div>
        </motion.div>

        {/* Haz de luz láser dorado hacia el botón de confirmación */}
        {dispatched && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 176 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ x: '-50%' }}
            className="pointer-events-none absolute left-1/2 top-56 w-[3px] rounded-full bg-gradient-to-b from-[#ecb613] via-[#f5c538] to-transparent shadow-[0_0_30px_6px_rgba(236,182,19,0.75)] z-40"
          />
        )}
      </div>

      {/* 🎛️ FORMAT SELECTION CAROUSEL (UBER VEHICLE TIERS) */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 block">
          SELECCIONA TIER DE ESCUADRA
        </span>
        <div className="grid grid-cols-2 gap-2">
          {ARTIST_FORMATS.map(fmt => {
            const isSelected = fmt.id === selectedFormatId;
            return (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormatId(fmt.id)}
                className={`p-3 min-h-[48px] touch-manipulation rounded-2xl border text-left transition-all relative overflow-hidden ${isSelected
                    ? 'bg-gradient-to-b from-[#ecb613]/15 to-[#15151c] border-[#ecb613] shadow-lg shadow-[#ecb613]/10'
                    : 'bg-[#101014] border-white/10 hover:border-white/20 text-white/70'
                  }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ecb613] shadow-[0_0_8px_#ecb613]" />
                )}
                <span className="text-[9px] font-mono font-bold uppercase tracking-wide text-[#ecb613] block">
                  {fmt.musiciansCount === 1 ? 'Solista' : `${fmt.musiciansCount} Músicos`}
                </span>
                <h4 className="text-xs font-black text-white truncate">{fmt.name}</h4>
                <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-white/5">
                  <span className="text-sm font-black text-white">{fmt.basePrice}€</span>
                  <span className="text-[9px] text-white/40 font-mono">{fmt.duration}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📏 LIVE LOGISTIC SLIDERS (KM & GUESTS) */}
      <div className="bg-[#111116] border border-white/10 p-4 rounded-3xl space-y-4">
        {/* Distance Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-white/60 flex items-center gap-1">
              <MapPin size={12} className="text-[#ecb613]" /> Distancia desde Madrid
            </span>
            <span className="font-black text-[#ecb613]">{distanceKm} km</span>
          </div>
          <input
            type="range"
            min="0"
            max="350"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
          />
          <div className="flex justify-between text-[9px] font-mono text-white/40">
            <span>0 km (Radio Urbano)</span>
            <span>150 km (Regional)</span>
            <span>350 km (Nacional)</span>
          </div>
        </div>

        {/* Pax Guests Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-white/60 flex items-center gap-1">
              <Users size={12} className="text-[#ecb613]" /> Asistentes (Pax)
            </span>
            <span className="font-black text-emerald-400">{paxCount} Invitados</span>
          </div>
          <input
            type="range"
            min="30"
            max="500"
            step="10"
            value={paxCount}
            onChange={(e) => setPaxCount(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[9px] font-mono text-white/40">
            <span>30 pax (Íntimo)</span>
            <span>200 pax (Boda Media)</span>
            <span>500 pax (Gran Gala)</span>
          </div>
        </div>

        {/* Live Acoustic Guarantee Badge */}
        <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-[#ecb613]" />
            <div>
              <span className="font-bold text-white block text-[11px]">Sonorización Bose F1 Incluida</span>
              <span className="text-[9px] text-white/50 font-mono">12 W/pax Homologados con Técnico in situ</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
            0 FALLOS
          </span>
        </div>
      </div>

      {/* 💳 PRICING BREAKDOWN & INSTANT SLIDE-TO-DISPATCH */}
      <div className="bg-gradient-to-b from-[#181820] to-[#0c0c10] border border-[#ecb613]/40 p-4 rounded-3xl space-y-3 aura-glow-oled">
        <div className="flex justify-between items-end border-b border-white/10 pb-2.5">
          <div>
            <span className="text-[9px] font-mono text-white/50 block">PRESUPUESTO TOTAL CERRADO</span>
            <span className="text-2xl font-black text-white">{quote.total} €</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono text-[#ecb613] block">DEPÓSITO STRIPE</span>
            <span className="text-base font-black text-[#ecb613]">100 €</span>
          </div>
        </div>

        {/* Uber Slide to Dispatch Simulated Slider */}
        <div className="relative w-full h-14 bg-black/80 rounded-2xl p-1 border border-white/15 overflow-hidden flex items-center">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 230 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.x > 180) {
                handleSlideComplete();
              }
            }}
            className="w-12 h-12 rounded-xl bg-[#ecb613] text-black flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-20"
          >
            <ArrowRight size={20} className="stroke-[3]" />
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pl-8">
            <span className="text-[11px] font-black uppercase tracking-wider text-white/70 font-mono animate-pulse">
              Desliza para Despachar Unidad ➔
            </span>
          </div>
        </div>

        <p className="text-[9px] text-center text-white/40 font-mono">
          Bloqueo de agenda en tiempo real vía WhatsApp y Stripe Price-Lock.
        </p>
      </div>

    </div>
  );
}
