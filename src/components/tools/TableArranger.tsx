"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Map, 
  Move, 
  Download, 
  Share2, 
  CheckCircle2, 
  Maximize2,
  PieChart,
  Zap
} from 'lucide-react';

const MOCK_TABLES = [
  { id: 1, name: 'Mesa Presidencial', capacity: 6, seated: 6, type: 'rectangular', VIP: true },
  { id: 2, name: 'Mesa 1 (Familia)', capacity: 10, seated: 8, type: 'round', VIP: false },
  { id: 3, name: 'Mesa 2 (Amigos)', capacity: 10, seated: 10, type: 'round', VIP: false },
  { id: 4, name: 'Mesa 3 (Trabajo)', capacity: 8, seated: 4, type: 'round', VIP: false },
];

export const TableArranger = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'list'>('editor');

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white pt-24 pb-12 flex flex-col">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-grow flex flex-col">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 pb-6 border-b border-white/5">
          <div className="space-y-4">
             <div className="flex items-center gap-4 text-[#d4af37] font-mono tracking-widest text-[10px] font-black uppercase">
              <Zap className="w-4 h-4 fill-[#d4af37]" />
              <span>Table Arranger S-Class</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Distribución de <span className="italic font-serif text-[#d4af37] font-normal">Banquetes</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                activeTab === 'editor' ? 'bg-[#d4af37] text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4 inline mr-2" /> Plano 2D
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                activeTab === 'list' ? 'bg-[#d4af37] text-black' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" /> Listado
            </button>
          </div>
        </div>

        {/* WORKSPACE AREA */}
        <div className="flex-grow flex flex-col md:flex-row gap-6">
          
          {/* DRAG & DROP CANVAS */}
          <div className="flex-grow bg-zinc-900/30 border border-white/5 rounded-3xl relative overflow-hidden h-[600px] flex items-center justify-center p-8">
             {/* GRID PATTERN BACKGROUND */}
             <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
             {/* SIMULATED TABLES */}
             <div className="relative w-full h-full">
                
                {/* Presidencial */}
                <motion.div 
                  className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-16 bg-[#d4af37]/10 border border-[#d4af37] rounded-xl flex items-center justify-center cursor-move hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-shadow"
                  drag dragMomentum={false}
                >
                   <span className="text-[#d4af37] font-black uppercase tracking-widest text-xs">Mesa Presidencial (6/6)</span>
                </motion.div>

                {/* Mesa 1 */}
                <motion.div 
                  className="absolute top-40 left-1/4 w-32 h-32 bg-zinc-900 border border-zinc-600 rounded-full flex items-center justify-center cursor-move hover:border-white transition-colors"
                  drag dragMomentum={false}
                >
                   <div className="text-center">
                     <span className="text-white font-bold block text-sm">M1</span>
                     <span className="text-zinc-500 text-[10px] font-mono">8/10</span>
                   </div>
                   {/* Seats representation */}
                   <div className="absolute -top-3 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                   <div className="absolute -bottom-3 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                   <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-4 h-4 rounded-full bg-rose-500/20 border border-rose-500/50" />
                   <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-4 h-4 rounded-full bg-zinc-800 border border-zinc-600" />
                </motion.div>
                
                {/* Mesa 2 */}
                <motion.div 
                   className="absolute top-40 right-1/4 w-32 h-32 bg-zinc-900 border border-zinc-600 rounded-full flex items-center justify-center cursor-move hover:border-white transition-colors"
                   drag dragMomentum={false}
                >
                   <div className="text-center">
                     <span className="text-white font-bold block text-sm">M2</span>
                     <span className="text-zinc-500 text-[10px] font-mono">10/10</span>
                   </div>
                </motion.div>

             </div>

             {/* CANVAS CONTROLS */}
             <div className="absolute bottom-6 right-6 flex gap-2">
                <button className="w-10 h-10 bg-black/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"><Maximize2 className="w-4 h-4" /></button>
                <button className="w-10 h-10 bg-[#d4af37]/20 backdrop-blur-md border border-[#d4af37]/50 rounded-full flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"><Plus className="w-5 h-5" /></button>
             </div>
          </div>

          {/* SIDEBAR TOOLS */}
          <div className="w-full md:w-80 flex flex-col gap-6">
            
            <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6">
               <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-4 text-[#d4af37]">
                  <PieChart className="w-4 h-4" /> Resumen Distribución
               </h3>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <div className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Capacidad Total</div>
                     <div className="text-xl font-mono text-white">34</div>
                  </div>
                  <div className="flex justify-between items-end">
                     <div className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Asignados</div>
                     <div className="text-xl font-mono text-emerald-400">28</div>
                  </div>
                  <div className="flex justify-between items-end">
                     <div className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Libres</div>
                     <div className="text-xl font-mono text-rose-400">6</div>
                  </div>
               </div>

               <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                  <button className="w-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest text-zinc-300 flex justify-center items-center gap-2">
                     <Users className="w-3 h-3" /> Ver no asignados (4)
                  </button>
               </div>
            </div>

            <div className="flex-grow bg-zinc-900/20 border border-white/5 rounded-3xl p-6 space-y-4">
               <h4 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Mesas Activas</h4>
               
               <div className="space-y-2 overflow-y-auto max-h-64 pr-2">
                  {MOCK_TABLES.map(t => (
                    <div key={t.id} className="p-3 bg-black border border-white/5 rounded-xl hover:border-[#d4af37]/30 transition-colors cursor-pointer group flex justify-between items-center">
                       <div>
                          <p className="text-xs font-bold text-white group-hover:text-[#d4af37] transition-colors">{t.name}</p>
                          <p className="text-[10px] text-zinc-600 tracking-widest mt-1 uppercase font-mono">{t.seated}/{t.capacity} PAX</p>
                       </div>
                       <Move className="w-4 h-4 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="flex gap-2">
               <button className="flex-1 bg-zinc-800 border-none text-white text-[10px] font-black uppercase tracking-widest rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all">
                  <Share2 className="w-4 h-4" /> Compartir
               </button>
               <button className="flex-1 bg-[#d4af37] border-none text-black text-[10px] font-black uppercase tracking-widest rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-[#f0c541] transition-all">
                  <Download className="w-4 h-4" /> PDF Master
               </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TableArranger;
