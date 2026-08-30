'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Users, Radio, Shield, Sparkles, Music } from 'lucide-react';

export type StageFormatType = 'solista' | 'duo' | 'trio' | 'cuarteto' | 'quinteto' | 'imperial';
export type VenueType = 'SALON_BODA' | 'FINCA_EXTERIOR' | 'IGLESIA' | 'RESIDENCIA_MAYORES' | 'PLAZA_PUBLICA';

interface StageVisualizer3DProps {
  format: StageFormatType;
  venueType: VenueType;
  pax: number;
  isVimume?: boolean;
}

interface MusicianNode {
  id: string;
  name: string;
  role: string;
  x: number; // Porcentaje 0-100 en el escenario
  y: number; // Porcentaje 0-100
  iconColor: string;
}

const MUSICIANS_CONFIG: Record<StageFormatType, MusicianNode[]> = {
  solista: [
    { id: 'm1', name: 'Edwin Agudelo', role: 'Voz Principal / Tenor Lírico', x: 50, y: 55, iconColor: '#ecb613' }
  ],
  duo: [
    { id: 'm1', name: 'Edwin Agudelo', role: 'Voz Principal', x: 40, y: 55, iconColor: '#ecb613' },
    { id: 'm2', name: 'Vihuela / Guitarra', role: 'Armonía & Coros', x: 60, y: 55, iconColor: '#AAD6CD' }
  ],
  trio: [
    { id: 'm1', name: 'Edwin Agudelo', role: 'Voz Principal', x: 50, y: 50, iconColor: '#ecb613' },
    { id: 'm2', name: 'Vihuela', role: 'Armonía Lírica', x: 30, y: 60, iconColor: '#AAD6CD' },
    { id: 'm3', name: 'Guitarrón', role: 'Bajo Acústico', x: 70, y: 60, iconColor: '#258DCD' }
  ],
  cuarteto: [
    { id: 'm1', name: 'Edwin Agudelo', role: 'Voz Principal', x: 50, y: 48, iconColor: '#ecb613' },
    { id: 'm2', name: 'Trompeta 1', role: 'Melodía / Bronce', x: 22, y: 62, iconColor: '#FF455B' },
    { id: 'm3', name: 'Vihuela', role: 'Armonía', x: 42, y: 62, iconColor: '#AAD6CD' },
    { id: 'm4', name: 'Guitarrón', role: 'Bajo Acústico', x: 78, y: 62, iconColor: '#258DCD' }
  ],
  quinteto: [
    { id: 'm1', name: 'Edwin Agudelo', role: 'Voz Principal', x: 50, y: 45, iconColor: '#ecb613' },
    { id: 'm2', name: 'Trompeta 1', role: 'Bronce Solista', x: 18, y: 60, iconColor: '#FF455B' },
    { id: 'm3', name: 'Trompeta 2', role: 'Segunda Trompeta', x: 34, y: 62, iconColor: '#FF455B' },
    { id: 'm4', name: 'Vihuela', role: 'Armonía Rítmica', x: 66, y: 62, iconColor: '#AAD6CD' },
    { id: 'm5', name: 'Guitarrón', role: 'Bajo & Tiempo', x: 82, y: 60, iconColor: '#258DCD' }
  ],
  imperial: [
    { id: 'm1', name: 'Edwin Agudelo', role: 'Voz Principal', x: 50, y: 42, iconColor: '#ecb613' },
    { id: 'm2', name: 'Trompeta 1', role: 'Bronce Principal', x: 14, y: 55, iconColor: '#FF455B' },
    { id: 'm3', name: 'Trompeta 2', role: 'Bronce Armónico', x: 26, y: 58, iconColor: '#FF455B' },
    { id: 'm4', name: 'Violín 1', role: 'Cuerda Clásica', x: 38, y: 62, iconColor: '#a855f7' },
    { id: 'm5', name: 'Violín 2', role: 'Cuerda Armónica', x: 62, y: 62, iconColor: '#a855f7' },
    { id: 'm6', name: 'Vihuela', role: 'Ritmo & Voz', x: 74, y: 58, iconColor: '#AAD6CD' },
    { id: 'm7', name: 'Guitarra', role: 'Acompañamiento', x: 86, y: 55, iconColor: '#AAD6CD' },
    { id: 'm8', name: 'Guitarrón', role: 'Bajo Imperial', x: 50, y: 72, iconColor: '#258DCD' }
  ]
};

export const StageVisualizer3D: React.FC<StageVisualizer3DProps> = ({
  format,
  venueType,
  pax,
  isVimume = false
}) => {
  const musicians = MUSICIANS_CONFIG[format] || MUSICIANS_CONFIG.solista;
  const totalWatts = pax * 12;
  const isLargeArray = totalWatts > 600;
  const maxDb = isVimume || venueType === 'RESIDENCIA_MAYORES' ? 74 : 92;

  return (
    <div className="w-full rounded-2xl bg-[#09090d] border border-[#258DCD]/30 p-4 md:p-6 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
      {/* Luces Cenitales y Glow Ambiental */}
      <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#ecb613]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-48 h-48 bg-[#258DCD]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header del Visualizador */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Visualizador de Escenario & Rider Acústico 3D
            </h4>
            <p className="text-[11px] text-gray-400">
              Formación en vivo: <span className="text-[#ecb613] font-mono capitalize">{format}</span> ({musicians.length} {musicians.length === 1 ? 'músico' : 'músicos'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono border ${
            isVimume || venueType === 'RESIDENCIA_MAYORES'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              : 'bg-blue-950/80 text-blue-300 border-blue-500/40'
          }`}>
            <Volume2 className="w-3 h-3 inline mr-1" />
            Límite SPL: &lt;{maxDb} dB
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-500/40">
            <Radio className="w-3 h-3 inline mr-1" />
            {totalWatts} W ({12} W/pax)
          </span>
        </div>
      </div>

      {/* Tarima / Stage Visual */}
      <div className="relative mt-4 h-64 md:h-72 w-full rounded-xl bg-gradient-to-b from-[#0e0e14] to-[#050508] border border-white/10 overflow-hidden flex items-center justify-center">
        {/* Líneas de Perspectiva Escénica */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="stageGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ecb613" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="50%" cy="60%" rx="42%" ry="28%" fill="url(#stageGrad)" />
          <line x1="10%" y1="90%" x2="40%" y2="40%" stroke="#258DCD" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="90%" y1="90%" x2="60%" y2="40%" stroke="#258DCD" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50%" y1="90%" x2="50%" y2="35%" stroke="#ecb613" strokeWidth="1" strokeDasharray="2 4" />
        </svg>

        {/* Altavoz Bose Izquierdo */}
        <div className="absolute left-6 bottom-8 flex flex-col items-center group z-10">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-7 h-16 bg-[#1a1a24] border border-[#258DCD] rounded-md flex flex-col items-center justify-around p-1 shadow-[0_0_15px_rgba(37,141,205,0.4)]"
          >
            <div className="w-4 h-4 rounded-full bg-[#258DCD]/30 border border-[#258DCD] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#258DCD]" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#258DCD]/30 border border-[#258DCD] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#258DCD]" />
            </div>
          </motion.div>
          <span className="text-[9px] font-mono text-[#258DCD] mt-1 font-semibold">
            {isLargeArray ? 'Bose F1 (L)' : 'Bose S1 (L)'}
          </span>
        </div>

        {/* Altavoz Bose Derecho */}
        <div className="absolute right-6 bottom-8 flex flex-col items-center group z-10">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            className="w-7 h-16 bg-[#1a1a24] border border-[#258DCD] rounded-md flex flex-col items-center justify-around p-1 shadow-[0_0_15px_rgba(37,141,205,0.4)]"
          >
            <div className="w-4 h-4 rounded-full bg-[#258DCD]/30 border border-[#258DCD] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#258DCD]" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#258DCD]/30 border border-[#258DCD] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#258DCD]" />
            </div>
          </motion.div>
          <span className="text-[9px] font-mono text-[#258DCD] mt-1 font-semibold">
            {isLargeArray ? 'Bose F1 (R)' : 'Bose S1 (R)'}
          </span>
        </div>

        {/* Músicos en Tarima */}
        {musicians.map((m) => (
          <motion.div
            key={m.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20"
          >
            {/* Aura de Microfonía / Sonido */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg"
              style={{ 
                backgroundColor: `${m.iconColor}15`, 
                borderColor: m.iconColor, 
                borderWidth: '1.5px',
                boxShadow: `0 0 20px ${m.iconColor}40`
              }}
            >
              <Music className="w-4 h-4" style={{ color: m.iconColor }} />
            </div>

            {/* Tooltip / Label */}
            <div className="mt-1.5 px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[9px] font-mono text-white text-center whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="font-bold text-[#ecb613]">{m.name}</span>
              <span className="text-gray-400 block text-[8px]">{m.role}</span>
            </div>
          </motion.div>
        ))}

        {/* Frontera de Escenario / Audiencia */}
        <div className="absolute bottom-2 inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-1 text-[9px] font-mono text-gray-500 uppercase tracking-widest pointer-events-none">
          ▼ FRENTE DE AUDIENCIA ({pax} PAX ESTIMADOS) ▼
        </div>
      </div>

      {/* Footer con Especificaciones del Rider */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
        <div className="p-2 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[10px] text-gray-400 block">Microfonía Homologada</span>
          <span className="text-xs font-semibold text-white font-mono">Shure Beta 87A / Axient</span>
        </div>
        <div className="p-2 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[10px] text-gray-400 block">Sistema PA Principal</span>
          <span className="text-xs font-semibold text-[#258DCD] font-mono">
            {isLargeArray ? 'Line Array Bose F1 812' : 'Compact Bose S1 Pro'}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[10px] text-gray-400 block">Presión Acústica Sala</span>
          <span className={`text-xs font-semibold font-mono ${isVimume ? 'text-emerald-400' : 'text-purple-300'}`}>
            {maxDb} dB SPL {isVimume ? '(Protocolo Geriátrico)' : '(Gala)'}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[10px] text-gray-400 block">Seguro de RC Activo</span>
          <span className="text-xs font-semibold text-emerald-400 font-mono">1.000.000,00 €</span>
        </div>
      </div>
    </div>
  );
};

export default StageVisualizer3D;
