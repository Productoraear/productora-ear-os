'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Speaker, 
  Lightbulb, 
  LayoutGrid, 
  Video, 
  Monitor, 
  Gamepad2,
  SlidersHorizontal,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  X,
  ShoppingCart,
  CheckCircle,
  Package
} from 'lucide-react';
import { useArsenal } from '@/hooks/useArsenal';
import { THEME, GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ MODULE: ARSENAL (S-Class V2.4)
 * Full Responsive Senior High-End Architecture.
 * Standardized HUD & Strategic Inventory.
 */

interface ArsenalProps {
  onNavigate?: (id: string) => void;
  hideHeader?: boolean;
}

export default function Arsenal({ onNavigate, hideHeader }: ArsenalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { products, loading } = useArsenal();

  const categories = [
    { id: 'All', label: 'Todos', icon: Package },
    { id: 'Sound', label: 'Sonido', icon: Speaker },
    { id: 'Light', label: 'Iluminación', icon: Lightbulb },
    { id: 'LED', label: 'Pantallas LED', icon: LayoutGrid },
    { id: 'Cinema', label: 'Cine & Foto', icon: Video },
    { id: 'IT', label: 'IT & Corp', icon: Monitor },
  ];

  const filteredProducts = products.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="bg-[#221d10] text-white w-full min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="bg-[#221d10] text-white font-montserrat selection:bg-[#ecb613] selection:text-[#221d10] w-full min-h-screen overflow-x-hidden relative">
      

      <main className="max-w-7xl mx-auto space-y-16 md:space-y-32 pb-32">
        
        {/* 1. HERO SECTION */}
        <section className="relative aspect-[3/4] md:aspect-[21/9] flex flex-col justify-center items-center p-6 md:p-12 overflow-hidden md:rounded-b-[80px] border-b border-white/5 shadow-2xl">
          <div className="absolute inset-0 z-0">
             <div 
               className="absolute inset-0 bg-cover bg-center opacity-20 grayscale scale-105"
               style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=2070")' }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] via-[#1a1510]/60 to-transparent" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative z-10 text-center items-center flex flex-col space-y-8 ${hideHeader ? 'pt-20' : ''}`}
          >
            <span className="px-5 py-2 bg-primary/10 border border-primary/20 text-primary text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase rounded-full backdrop-blur-2xl mb-4">
               Tier 1 Equipment Registry // EAR Arsenal
            </span>
            <h1 className="text-[clamp(2rem,10vw,8rem)] font-cinzel font-black tracking-tighter uppercase leading-[1] md:leading-[0.9] text-balance">
               El Arsenal <br />
               <span className="gold-text italic font-serif normal-case">Técnico.</span>
            </h1>
            <p className="text-sm md:text-xl lg:text-2xl text-white/40 font-medium italic max-w-2xl leading-relaxed text-balance px-4 md:px-0">
               Tecnología de última generación al servicio de la excelencia. Blindamos tu producción con activos de élite mundial.
            </p>
          </motion.div>
        </section>

        {/* 2. SEARCH & FILTER HUD (INTEGRATED) */}
        <section className="px-4 md:px-12 space-y-12">
          {/* Search Input */}
          <div className={`relative ${GLASS_STYLE} ${GOLD_HUD_STYLE} rounded-3xl md:rounded-[50px] p-2 md:p-4 border border-primary/10 shadow-2xl shadow-primary/5`}>
            <div className="flex items-center">
              <div className="pl-6 md:pl-10 pr-3 md:pr-6">
                <Search className="text-primary opacity-50 md:w-8 md:h-8" size={20} />
              </div>
              <input 
                type="text" 
                placeholder="BUSCAR EQUIPAMIENTO POR MODELO O MARCA..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 py-6 md:py-12 text-sm md:text-2xl font-black uppercase tracking-[0.2em] placeholder:text-white/10"
              />
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex h-12 md:h-16 shrink-0 items-center gap-4 rounded-full px-8 md:px-12 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] transition-all ${activeCategory === cat.id ? 'bg-primary text-black shadow-2xl shadow-primary/20' : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'}`}
              >
                <cat.icon size={18} className="md:w-6 md:h-6" /> <span className="whitespace-nowrap">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 3. PRODUCT GRID */}
        <section className="px-4 md:px-12 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredProducts.map((prod, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -15 }}
                className={`group relative flex flex-col p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-white/5 transition-all duration-500 shadow-2xl`}
              >
                 {/* Product Image */}
                 <div className="relative aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-10 shadow-3xl">
                    <img 
                      src={prod.image} 
                      className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-[1000ms] group-hover:grayscale-0 group-hover:scale-110"
                      alt={prod.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                       <span className="bg-primary text-black text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-2xl">
                          {prod.status}
                       </span>
                    </div>
                 </div>

                 {/* Product Info */}
                 <div className="space-y-6 px-2 flex-1">
                    <div className="space-y-2">
                       <span className="text-primary/40 text-[9px] font-black uppercase tracking-[0.3em]">{prod.category} Asset</span>
                       <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none group-hover:gold-text transition-all text-balance">{prod.title}</h3>
                    </div>
                    <p className="text-sm md:text-lg text-white/30 font-medium italic leading-relaxed line-clamp-3">
                      {prod.desc}
                    </p>
                 </div>

                 {/* Interaction */}
                 <div className="mt-12 pt-8 border-t border-white/5">
                    <button className="w-full py-6 md:py-8 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/10 text-primary font-black uppercase text-[10px] md:text-xs tracking-[0.3em] hover:bg-primary hover:text-black hover:shadow-2xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-4">
                       RESERVAR ASSET <ArrowRight size={18} />
                    </button>
                 </div>
              </motion.div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="py-24 text-center space-y-8">
               <X size={64} className="mx-auto text-primary/20" />
               <p className="text-xl md:text-3xl text-white/20 font-black uppercase tracking-widest">No se encontraron activos para esta búsqueda.</p>
               <button 
                 onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                 className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-primary font-black uppercase text-[10px] tracking-widest"
               >
                 LIMPIAR FILTROS
               </button>
            </div>
          )}
        </section>

        {/* 4. TECH CERTIFICATIONS (S-CLASS) */}
        <section className="px-4 md:px-12">
          <div className="p-10 md:p-32 rounded-[3.5rem] md:rounded-[6rem] bg-white/[0.01] border border-white/5 relative overflow-hidden group shadow-3xl">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             
             <div className="max-w-4xl mx-auto space-y-16 md:space-y-32 relative z-10">
                <div className="text-center space-y-6">
                   <h2 className="text-[2.5rem] md:text-7xl lg:text-8xl font-cinzel font-black uppercase tracking-tighter leading-none italic font-serif gold-text">Mantenimiento <br /> de Precisión.</h2>
                   <p className="text-sm md:text-2xl text-white/40 italic font-medium leading-relaxed max-w-2xl mx-auto text-balance">
                      Nuestro equipamiento pasa auditorías técnicas cada 30 días. Blindamos tu evento contra fallos operativos.
                   </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
                   {[
                     { label: 'Seguridad', icon: ShieldCheck, sub: 'Protocolo ISO 9001' },
                     { label: 'Actualización', icon: CheckCircle, sub: 'Firmeare V2.4 2024' },
                     { label: 'Calidad', icon: Package, sub: 'EAR Certified Elite' }
                   ].map((item, i) => (
                     <div key={i} className="text-center space-y-6 p-6">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all shadow-inner">
                           <item.icon size={32} className="md:w-12 md:h-12" />
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-sm md:text-xl font-black uppercase tracking-[0.2em]">{item.label}</h4>
                           <p className="text-[9px] md:text-[11px] text-white/10 font-bold uppercase tracking-widest italic">{item.sub}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </section>

      </main>


    </div>
  );
}
