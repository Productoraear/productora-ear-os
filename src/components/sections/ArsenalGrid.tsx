import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Package, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  X,
  PlusCircle
} from 'lucide-react';
import { GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ COMPONENT: ARSENAL GRID (Catalog Mapping)
 * Structured Inventory Component for High-End Asset Management.
 * Priority: Medium/High (Lists/Catalog with complex loops).
 */

interface Asset {
  id: string;
  title: string;
  desc: string;
  category: string;
  status: 'DISPONIBLE' | 'RESERVADO' | 'MANTENIMIENTO' | 'NOVEDAD';
  image: string;
  specs?: string[];
}

interface ArsenalGridProps {
  assets: Asset[];
  onReserve?: (id: string) => void;
}

const ArsenalGrid = ({ assets, onReserve }: ArsenalGridProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(assets.map(a => a.category)))];

  const filteredAssets = assets.filter(a => 
    (activeCategory === 'All' || a.category === activeCategory) &&
    (a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     a.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-12">
      {/* 1. FILTER & SEARCH CONTROL HUD */}
      <div className={`p-6 md:p-8 rounded-[2.5rem] md:rounded-full ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-white/5 flex flex-col lg:flex-row gap-6 items-center shadow-3xl`}>
         <div className="relative flex-1 w-full">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-primary/40" size={24} />
            <input 
              type="text" 
              placeholder="Filtro de Inteligencia Técnica..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 md:h-20 bg-black/40 border border-white/5 rounded-full pl-20 pr-8 text-sm md:text-xl font-black uppercase tracking-widest text-white placeholder:text-white/10 outline-none focus:border-primary/30 transition-all"
            />
         </div>
         
         <div className="flex gap-3 overflow-x-auto no-scrollbar w-full lg:w-auto px-4 lg:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`h-16 md:h-20 px-8 md:px-12 rounded-full text-[9px] md:text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap shadow-lg ${
                  activeCategory === cat 
                  ? 'bg-primary text-black shadow-primary/20 scale-105' 
                  : 'bg-white/5 text-white/30 border border-white/5 hover:bg-white/10'
                }`}
              >
                {cat === 'All' ? 'TODOS' : cat}
              </button>
            ))}
         </div>
      </div>

      {/* 2. GRID SYSTEM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
        <AnimatePresence mode="popLayout">
          {filteredAssets.map((asset, i) => (
            <motion.div
              layout
              key={asset.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`group flex flex-col p-8 md:p-10 rounded-[3rem] md:rounded-[4.5rem] ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-white/5 hover:border-primary/20 transition-all duration-500 shadow-3xl relative overflow-hidden`}
            >
               {/* Image Container with Status Overlay */}
               <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-10 shadow-4xl bg-black">
                  <img 
                    src={asset.image} 
                    alt={asset.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-6 right-6">
                    <span className={`px-5 py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border ${
                      asset.status === 'DISPONIBLE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      asset.status === 'NOVEDAD' ? 'bg-primary/10 text-primary border-primary/20' : 
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {asset.status}
                    </span>
                  </div>
               </div>

               {/* Meta Info */}
               <div className="space-y-6 flex-1">
                  <div className="space-y-3">
                     <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] italic">{asset.category}</span>
                     <h4 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-[0.9] group-hover:gold-text transition-all">{asset.title}</h4>
                  </div>
                  <p className="text-sm md:text-lg text-white/30 italic font-medium leading-relaxed line-clamp-2 md:line-clamp-3">
                    {asset.desc}
                  </p>
                  
                  {asset.specs && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {asset.specs.slice(0, 3).map((spec, si) => (
                        <span key={si} className="text-[8px] font-bold text-white/10 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-full">{spec}</span>
                      ))}
                    </div>
                  )}
               </div>

               {/* Interaction Footer */}
               <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                  <button 
                    onClick={() => onReserve?.(asset.id)}
                    className="flex-1 h-16 md:h-20 rounded-2xl md:rounded-full bg-primary text-black font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-2xl shadow-primary/10 hover:bg-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                    COTIZAR <PlusCircle size={18} />
                  </button>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <div className="py-40 text-center space-y-8 bg-white/[0.01] rounded-[4rem] border border-dashed border-white/5">
           <Package size={80} className="mx-auto text-white/5" />
           <div className="space-y-4">
              <h5 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white/20">Activo no Identificado</h5>
              <p className="text-sm md:text-xl text-white/10 font-bold uppercase tracking-[0.2em] italic">Ajuste los parámetros del filtro ARSENAL.</p>
           </div>
           <button 
             onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
             className="px-10 py-5 rounded-full border border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest hover:bg-primary/5 transition-all"
           >
             RESET SYSTEM
           </button>
        </div>
      )}
    </div>
  );
};

export default ArsenalGrid;
