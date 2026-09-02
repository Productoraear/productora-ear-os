import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Star, 
  Search, 
  MapPin, 
  ArrowUpRight, 
  Award,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ COMPONENT: TALENT HUB (Insight Catalog)
 * Interactive Talent Management & Analytics Display.
 * Priority: Medium/High (Complex Data Loops).
 */

interface Talent {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  metrics: {
    reach: string;
    impact: string;
    score: number;
  };
  tags: string[];
}

interface TalentHubProps {
  talents: Talent[];
  onSelect?: (id: string) => void;
}

const TalentHub = ({ talents, onSelect }: TalentHubProps) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(talents.map(t => t.category)))];
  
  const filtered = talents.filter(t => activeCategory === 'All' || t.category === activeCategory);

  return (
    <div className="space-y-16">
      {/* 1. HUD CONTROL BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10">
        <div className="space-y-2 text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-4">
              <Users className="text-primary" size={28} />
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">EAR.Talent <span className="gold-text italic serif normal-case">Hub.</span></h2>
           </div>
           <p className="text-xs md:text-sm font-bold text-white/20 uppercase tracking-[0.4em] ml-2">Intelligence & Casting Analytics Unit</p>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar w-full md:w-auto px-4 md:px-0">
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`h-12 md:h-14 px-8 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                 activeCategory === cat 
                 ? 'bg-primary text-black border-primary' 
                 : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* 2. TALENT INSIGHT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.map((talent, i) => (
            <motion.div
              layout
              key={talent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onMouseEnter={() => setHoveredId(talent.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative h-[500px] rounded-[3.5rem] overflow-hidden ${GLASS_STYLE} border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-3xl cursor-pointer`}
              onClick={() => onSelect?.(talent.id)}
            >
               {/* Background Image with Cinematic Gradients */}
               <img 
                 src={talent.image} 
                 className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110 ${hoveredId === talent.id ? 'opacity-40' : 'opacity-20'}`}
                 alt={talent.name}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] via-transparent to-transparent opacity-90" />
               <div className="absolute inset-0 bg-gradient-to-b from-[#1a1510]/50 via-transparent to-transparent" />

               {/* Talent Info */}
               <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                     <span className="bg-white/5 border border-white/10 backdrop-blur-2xl text-white/60 text-[8px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                        {talent.category}
                     </span>
                     <div className="flex items-center gap-1 text-primary">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[10px] font-black">{talent.metrics.score}</span>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <h4 className="text-3xl font-black uppercase tracking-tighter leading-tight text-white group-hover:gold-text transition-all">{talent.name}</h4>
                        <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest italic">
                           <MapPin size={10} /> {talent.location}
                        </div>
                     </div>

                     {/* Stats Overlay on Hover */}
                     <div className={`space-y-4 transition-all duration-500 ${hoveredId === talent.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 h-0 overflow-hidden'}`}>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">Impacto</span>
                              <span className="text-sm font-black text-primary">{talent.metrics.impact}</span>
                           </div>
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">Alcance</span>
                              <span className="text-sm font-black text-primary">{talent.metrics.reach}</span>
                           </div>
                        </div>
                        <button className="w-full h-14 bg-primary text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 flex items-center justify-center gap-3">
                           VER PERFIL PRO <ArrowUpRight size={14} />
                        </button>
                     </div>

                     {/* Default Footer Tags */}
                     <div className={`flex flex-wrap gap-2 transition-all duration-500 ${hoveredId === talent.id ? 'opacity-0' : 'opacity-100'}`}>
                        {talent.tags.map((tag, ti) => (
                           <span key={ti} className="text-[7px] font-black text-white/10 border border-white/5 px-3 py-1 rounded-full uppercase tracking-widest">{tag}</span>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* 3. CTA INTEGRATION */}
      <div className={`p-10 md:p-20 rounded-[4rem] text-center space-y-8 ${GLASS_STYLE} border border-primary/10 relative overflow-hidden group`}>
         <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
         <Sparkles className="mx-auto text-primary" size={48} />
         <div className="space-y-4">
            <h3 className="text-3xl md:text-6xl font-black uppercase tracking-tighter">¿Buscas el <span className="gold-text italic serif normal-case">Match Perfecto?</span></h3>
            <p className="text-sm md:text-2xl text-white/30 italic font-medium max-w-2xl mx-auto text-balance">Nuestro algoritmo de selección Tier 1 filtra los perfiles más rentables para tu ecosistema de marca.</p>
         </div>
         <button className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-primary font-black uppercase text-xs tracking-[0.4em] hover:bg-primary hover:text-black transition-all shadow-3xl">
            CONSULTAR CASTING BINARIO
         </button>
      </div>
    </div>
  );
};

export default TalentHub;
