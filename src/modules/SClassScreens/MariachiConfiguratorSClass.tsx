'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Music, 
  Users, 
  Flame, 
  Star, 
  Settings, 
  ChevronRight,
  Radio,
  Share2,
  DollarSign
} from 'lucide-react';

/**
 * 🎻 COMPONENT: MARIACHI CONFIGURATOR S-CLASS
 * "Mariachi Aflamencado Siglo XXI" Bespoke Configurator.
 * Aesthetic: High-Contrast, Kinetic, Premium Interaction.
 */

export default function MariachiConfiguratorSClass() {
  const [musicians, setMusicians] = useState(5);
  const [intensity, setIntensity] = useState('moderato');
  const [repertoire, setRepertoire] = useState(['clásicos']);

  const intensityOptions = [
    { id: 'moderato', label: 'Elegancia Pura', desc: 'Sutil y sofisticado, ideal para cócteles.', color: '#4d94ff' },
    { id: 'fuego', label: 'Duelo Flamenco', desc: 'Alta intensidad, integración total con guitarra.', color: '#ecb613' },
    { id: 'oscura', label: 'Leyenda Negra', desc: 'Vanguardista, emocional y cinematográfico.', color: '#ff4d4d' },
  ];

  return (
    <div className="bg-zinc-900/40 backdrop-blur-3xl rounded-[4rem] border border-white/5 overflow-hidden shadow-4xl group">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* LEFT: VISUALIZATION */}
        <div className="p-12 md:p-24 bg-black/60 relative flex flex-col justify-center items-center text-center space-y-12">
           <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(236,182,19,0.15),transparent_70%)] animate-pulse" />
           </div>
           
           <motion.div 
             key={musicians + intensity}
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="relative z-10"
           >
              <div className="w-48 h-48 md:w-80 md:h-80 rounded-full border-4 border-[#ecb613]/20 flex items-center justify-center p-8 bg-black/40 shadow-[0_0_100px_rgba(236,182,19,0.1)]">
                 <div className="grid grid-cols-3 gap-6">
                    {Array.from({ length: musicians }).map((_, i) => (
                       <motion.div 
                         key={i} 
                         animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }} 
                         transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                         className="w-8 h-8 md:w-12 md:h-12 bg-[#ecb613] rounded-full flex items-center justify-center text-black font-black text-[10px]"
                       >
                          {i + 1}
                       </motion.div>
                    ))}
                 </div>
              </div>
           </motion.div>

           <div className="space-y-4 relative z-10">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">Configuración <span className="text-[#ecb613]">Activa</span></h2>
              <p className="text-sm text-zinc-500 font-mono tracking-widest uppercase">Mariachi Aflamencado S.XXI // Nodo Madrid</p>
           </div>

           <div className="flex gap-4 relative z-10">
              <div className="px-6 py-2 bg-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                 {musicians} Artistas
              </div>
              <div className="px-6 py-2 bg-[#ecb613]/10 text-[#ecb613] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#ecb613]/20">
                 {intensity.toUpperCase()}
              </div>
           </div>
        </div>

        {/* RIGHT: CONTROLS */}
        <div className="p-12 md:p-24 space-y-16">
           {/* 1. MUSICIANS SLIDER */}
           <div className="space-y-8">
              <div className="flex justify-between items-end">
                 <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-4">
                    <Users size={20} className="text-[#ecb613]" /> Tamaño del Ensamble
                 </h3>
                 <span className="text-3xl font-black font-mono text-[#ecb613]">{musicians}</span>
              </div>
              <input 
                type="range" min="3" max="12" step="1" 
                value={musicians} 
                onChange={(e) => setMusicians(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#ecb613]"
              />
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600">
                 <span>Mínimo Protocolo (3)</span>
                 <span>Despliegue Gala (12)</span>
              </div>
           </div>

           {/* 2. INTENSITY SELECTOR */}
           <div className="space-y-8">
              <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-4">
                 <Flame size={20} className="text-[#ecb613]" /> Dirección Artística
              </h3>
              <div className="grid grid-cols-1 gap-4">
                 {intensityOptions.map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setIntensity(opt.id)}
                      className={`p-6 rounded-3xl border text-left transition-all flex justify-between items-center group/btn ${intensity === opt.id ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/5 hover:border-white/20'}`}
                    >
                       <div>
                          <div className="text-lg font-black uppercase italic">{opt.label}</div>
                          <div className={`text-[10px] italic font-medium ${intensity === opt.id ? 'text-zinc-500' : 'text-zinc-500'}`}>{opt.desc}</div>
                       </div>
                       <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${intensity === opt.id ? 'bg-black text-white border-black' : 'border-white/10 group-hover/btn:border-white/30'}`}>
                          <ChevronRight size={16} />
                       </div>
                    </button>
                 ))}
              </div>
           </div>

           {/* 3. FINAL CTA & PRICE */}
           <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
              <div>
                 <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Inversión Estimada</div>
                 <div className="text-4xl font-black tracking-tighter italic">
                    <span className="text-zinc-500">€</span>{(musicians * 250) + (intensity === 'moderato' ? 0 : 400)}
                 </div>
              </div>
              <button className="h-20 px-12 bg-[#ecb613] text-black rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-6 hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-[#ecb613]/20">
                 RESERVAR AHORA <Star size={20} />
              </button>
           </div>
        </div>

      </div>
      
      {/* HUD OVERLAY FOOTER */}
      <div className="bg-black/80 p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="flex items-center gap-6">
            <Radio size={24} className="text-[#ecb613] animate-pulse" />
            <div className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">
               Sincronizando con Astra Roster Management...
            </div>
         </div>
         <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
               <Share2 size={18} />
            </button>
            <button className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
               <Settings size={18} />
            </button>
         </div>
      </div>
    </div>
  );
}
