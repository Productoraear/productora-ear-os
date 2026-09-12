"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Car, Navigation } from 'lucide-react';
import { MariachiSimulationReport } from '@/lib/matchmaker/mariachiHighTrafficSimulator';

interface UberFleetVisualizerProps {
  report: MariachiSimulationReport;
  isRunning: boolean;
}

export function UberFleetVisualizer({ report, isRunning }: UberFleetVisualizerProps) {
  const fleetData = useMemo(() => {
    return report.bookings.map((booking, idx) => {
      const angle = (idx / report.bookings.length) * 2 * Math.PI;
      const maxDistance = 60;
      const radiusPercent = Math.min((booking.distanceFromPlazaElipticaKm / maxDistance) * 38, 42);

      const targetX = 50 + radiusPercent * Math.cos(angle);
      const targetY = 50 + radiusPercent * Math.sin(angle);
      const etaMinutes = Math.max(8, Math.floor(booking.distanceFromPlazaElipticaKm * 1.4));
      const duration = 3 + (booking.distanceFromPlazaElipticaKm / 8);

      return {
        ...booking,
        angleDeg: angle * (180 / Math.PI),
        targetX,
        targetY,
        etaMinutes,
        duration,
      };
    });
  }, [report]);

  return (
    <div className="w-full bg-[#030305]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl space-y-4 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="font-syne font-bold uppercase tracking-tight text-white flex items-center gap-2 text-lg">
          <Navigation className="text-[#ecb613]" size={20} />
          Visualizador Táctico Uber — Flota en Vivo
        </h3>
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
          )}
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
            {isRunning ? 'STREAMING GPS EN DIRECTO' : 'EN ESPERA DE ACTIVACIÓN'}
          </span>
        </div>
      </div>

      {/* Mapa Táctico */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/5"
           style={{ aspectRatio: '21/9', background: 'radial-gradient(ellipse at center, #0a0a12 0%, #030305 100%)' }}>

        {/* Anillos de alcance */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute rounded-full border border-[#ecb613]/8" style={{ width: '85%', height: '85%' }} />
          <div className="absolute rounded-full border border-[#ecb613]/12" style={{ width: '55%', height: '55%' }} />
          <div className="absolute rounded-full border border-[#ecb613]/18" style={{ width: '25%', height: '25%' }} />
        </div>

        {/* Leyendas de distancia */}
        <span className="absolute text-[8px] font-mono text-[#ecb613]/30 pointer-events-none" style={{ top: '8%', left: '50%', transform: 'translateX(-50%)' }}>60 km</span>
        <span className="absolute text-[8px] font-mono text-[#ecb613]/40 pointer-events-none" style={{ top: '22%', left: '50%', transform: 'translateX(-50%)' }}>30 km</span>
        <span className="absolute text-[8px] font-mono text-[#ecb613]/50 pointer-events-none" style={{ top: '37%', left: '50%', transform: 'translateX(-50%)' }}>10 km</span>

        {/* Zona Cero — Plaza Elíptica */}
        <div className="absolute z-30 flex flex-col items-center pointer-events-none" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="w-5 h-5 bg-[#00E5FF] rounded-full animate-ping absolute opacity-40" />
          <div className="w-5 h-5 bg-[#00E5FF] border-2 border-white rounded-full relative z-10" style={{ boxShadow: '0 0 20px #00E5FF, 0 0 40px #00E5FF50' }} />
          <span className="mt-2 text-[9px] font-black font-mono text-[#00E5FF] bg-black/80 px-2.5 py-1 rounded-lg border border-[#00E5FF]/30 whitespace-nowrap shadow-lg">
            PLAZA ELÍPTICA
          </span>
        </div>

        {/* Rutas SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {fleetData.map((car) => (
            <motion.line
              key={`route-${car.id}`}
              x1={50} y1={50}
              x2={isRunning ? car.targetX : 50}
              y2={isRunning ? car.targetY : 50}
              stroke={car.status === 'UBER_REASSIGNED' ? '#ef4444' : '#ecb61380'}
              strokeWidth={0.15}
              strokeDasharray="0.6 0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isRunning ? 1 : 0 }}
              transition={{ duration: car.duration * 0.8, ease: 'easeOut' }}
            />
          ))}
        </svg>

        {/* 32 Coches animados */}
        {fleetData.map((car) => {
          const isReassigned = car.status === 'UBER_REASSIGNED';
          return (
            <motion.div
              key={`car-${car.id}`}
              className="absolute z-20 pointer-events-none"
              style={{ translateX: '-50%', translateY: '-50%' }}
              initial={{ left: '50%', top: '50%' }}
              animate={isRunning
                ? { left: `${car.targetX}%`, top: `${car.targetY}%` }
                : { left: '50%', top: '50%' }
              }
              transition={{ duration: car.duration, ease: 'circOut' }}
            >
              {/* Tooltip ETA flotante */}
              <motion.div
                className={`mb-1 px-2 py-1 rounded-lg text-[8px] font-bold uppercase whitespace-nowrap shadow-2xl border flex flex-col items-center leading-tight ${
                  isReassigned
                    ? 'bg-rose-600/90 text-white border-rose-400/60'
                    : 'bg-black/85 text-white border-white/15'
                }`}
                initial={{ opacity: 0, scale: 0 }}
                animate={isRunning ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ delay: car.duration * 0.5, duration: 0.4 }}
              >
                <span className="tracking-wider">{isReassigned ? '⚡ RELEVO' : 'ETA'}: {car.etaMinutes} min</span>
                <span className={`text-[7px] ${isReassigned ? 'text-rose-200' : 'text-[#ecb613]'}`}>
                  → {car.municipality}
                </span>
              </motion.div>

              {/* Icono Vehículo */}
              <motion.div
                className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center shadow-xl border-2 ${
                  isReassigned
                    ? 'bg-rose-500 border-rose-300 shadow-rose-500/40'
                    : 'bg-white border-[#ecb613]/50 shadow-[#ecb613]/20'
                }`}
                style={{ transform: `rotate(${car.angleDeg + 90}deg)` }}
                initial={{ scale: 0 }}
                animate={isRunning ? { scale: 1 } : { scale: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <Car size={14} className={isReassigned ? 'text-white' : 'text-black'} />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Leyenda inferior */}
      <div className="flex items-center justify-center gap-8 text-[9px] font-mono text-zinc-500 uppercase tracking-widest pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white border border-[#ecb613]/50" />
          <span>Flujo Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300" />
          <span>Cascada Uber (Relevo)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00E5FF] border border-white" />
          <span>Base: Plaza Elíptica</span>
        </div>
      </div>
    </div>
  );
}
