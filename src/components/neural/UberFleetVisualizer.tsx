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
  // Generamos posiciones polares para los 32 coches, distribuyéndolos en 360 grados.
  const fleetData = useMemo(() => {
    return report.bookings.map((booking, idx) => {
      const angle = (idx / report.bookings.length) * 2 * Math.PI;
      // Normalizamos la distancia (max ~50km) a un radio en porcentaje del SVG (0 a 45%)
      const maxDistance = 50; 
      const radiusPercent = Math.min((booking.distanceFromPlazaElipticaKm / maxDistance) * 40, 45);
      
      const targetX = 50 + radiusPercent * Math.cos(angle);
      const targetY = 50 + radiusPercent * Math.sin(angle);
      
      const duration = 2 + (booking.distanceFromPlazaElipticaKm / 10); // Coches más lejos tardan más
      
      return {
        ...booking,
        angle: angle * (180 / Math.PI),
        targetX,
        targetY,
        duration
      };
    });
  }, [report]);

  return (
    <div className="w-full bg-[#030305]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl space-y-4 mt-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="font-syne font-bold uppercase tracking-tight text-white flex items-center gap-2">
          <Navigation className="text-[#ecb613]" size={20} />
          Visualizador Táctico Uber
        </h3>
        <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
          GPS Live Stream Activo
        </span>
      </div>

      <div className="relative w-full aspect-square md:aspect-[21/9] bg-black/40 rounded-2xl overflow-hidden border border-white/5">
        {/* Fondo de mapa conceptual */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 grid place-items-center opacity-30">
          <div className="w-full h-full border border-[#ecb613]/10 rounded-full scale-[1.5]" />
          <div className="absolute w-[60%] h-[60%] border border-[#ecb613]/20 rounded-full" />
          <div className="absolute w-[20%] h-[20%] border border-[#ecb613]/30 rounded-full" />
        </div>

        {/* Zona Cero - Plaza Elíptica */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="w-4 h-4 bg-[#00E5FF] rounded-full animate-ping absolute" />
          <div className="w-4 h-4 bg-[#00E5FF] border-2 border-white rounded-full relative z-10 shadow-[0_0_15px_#00E5FF]" />
          <span className="mt-1 text-[10px] font-bold font-mono text-white bg-black/80 px-2 py-0.5 rounded shadow-lg border border-white/10 whitespace-nowrap">
            Plaza Elíptica
          </span>
        </div>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {fleetData.map((car) => (
            <g key={`route-${car.id}`}>
              {/* Carretera (Ruta SVG) */}
              <line 
                x1="50" y1="50" 
                x2={car.targetX} y2={car.targetY} 
                stroke={car.status === 'UBER_REASSIGNED' ? '#ef4444' : '#ecb613'}
                strokeWidth="0.1" 
                opacity="0.3"
                strokeDasharray="0.5 0.5"
              />
            </g>
          ))}
        </svg>

        {/* Animación de los 32 coches */}
        {fleetData.map((car) => {
          const isReassigned = car.status === 'UBER_REASSIGNED';
          return (
            <motion.div
              key={`car-${car.id}`}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              initial={{ x: '50%', y: '50%' }}
              animate={isRunning ? { 
                x: `${car.targetX}%`, 
                y: `${car.targetY}%` 
              } : { 
                x: '50%', 
                y: '50%' 
              }}
              transition={{ 
                duration: isRunning ? car.duration : 0.5, 
                ease: 'circOut' 
              }}
            >
              <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                {/* Badge de Telemetría (ETA & Destino) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={isRunning ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 10 }}
                  transition={{ delay: isRunning ? car.duration - 1 : 0 }}
                  className={`mb-1 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase whitespace-nowrap shadow-xl border ${
                    isReassigned ? 'bg-rose-500 text-white border-rose-400' : 'bg-black/90 text-white border-white/20'
                  }`}
                >
                  ETA: {Math.floor(car.distanceFromPlazaElipticaKm * 1.5)} MIN
                  <br />
                  <span className={isReassigned ? 'text-white' : 'text-[#ecb613]'}>{car.municipality}</span>
                </motion.div>
                
                {/* Icono del Coche */}
                <div 
                  className={`p-1.5 rounded-full shadow-xl shadow-black/50 border ${
                    isReassigned ? 'bg-rose-500 border-rose-300' : 'bg-white border-white/20'
                  }`}
                  style={{ transform: `rotate(${car.angle + 90}deg)` }}
                >
                  <Car size={10} className={isReassigned ? 'text-white' : 'text-black'} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
