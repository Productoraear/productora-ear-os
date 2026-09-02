"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Star, Info, Apple, Coffee, Wine, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';

const MENU_ITEMS = [
  {
    category: "Aperitivos Fríos",
    items: [
      { name: "Carpaccio de Gamba Roja", desc: "Con emulsión de cítricos y caviar de aceite de oliva S-Class.", price: "28€", calories: "120kcal", dietary: "Sin Gluten" },
      { name: "Gazpacho de Ceresas", desc: "Con espuma de queso de cabra y pistachos tostados.", price: "15€", calories: "90kcal", dietary: "Vegetariano" }
    ]
  },
  {
    category: "Platos Principales",
    items: [
      { name: "Lubina Salvaje a la Sal", desc: "En costra de hierbas de la Sierra Morena y habitas tiernas.", price: "45€", calories: "350kcal", dietary: "Sin Lactosa" },
      { name: "Solomillo de Retinto", desc: "Madurado 45 días, con reducción de vino de Jerez y trufa negra.", price: "52€", calories: "480kcal", dietary: "Signature" }
    ]
  },
  {
    category: "Postres de Autor",
    items: [
      { name: "Texturas de Chocolate EAR", desc: "Degustación de cacaos de origen con toque de sal maldon.", price: "18€", calories: "250kcal", dietary: "Vegetariano" },
      { name: "Sorbete de Gin-Tonic S-Class", desc: "Con aire de limón y pepino osmotizado.", price: "12€", calories: "80kcal", dietary: "Vegano" }
    ]
  }
];

export default function CateringGourmet() {
  const [selectedCategory, setSelectedCategory] = useState(MENU_ITEMS[0].category);

  return (
    <div className="bg-[#0a0a0a] min-h-[600px] border border-white/5 rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
       {/* Background accent */}
       <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
       
       {/* Sidebar Navigation */}
       <div className="w-full md:w-[300px] bg-zinc-900/50 p-8 border-r border-white/5 flex flex-col justify-between z-10">
          <div>
             <div className="flex items-center gap-3 text-emerald-500 mb-8 border-b border-emerald-500/10 pb-4">
                <Utensils size={24} />
                <h3 className="font-black uppercase tracking-[0.2em] text-sm italic font-serif">Catering Gourmet</h3>
             </div>
             
             <div className="space-y-2">
                {MENU_ITEMS.map((cat) => (
                   <button
                      key={cat.category}
                      onClick={() => setSelectedCategory(cat.category)}
                      className={`w-full p-4 rounded-2xl flex items-center justify-between group transition-all ${
                         selectedCategory === cat.category 
                         ? 'bg-emerald-500 text-black font-black scale-105 shadow-lg shadow-emerald-500/20' 
                         : 'text-zinc-500 hover:text-white hover:bg-white/5'
                      }`}
                   >
                      <span className="text-[10px] uppercase tracking-widest">{cat.category}</span>
                      <ChevronRight size={14} className={`${selectedCategory === cat.category ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                   </button>
                ))}
             </div>
          </div>

          <div className="mt-12 bg-black/40 p-6 rounded-3xl border border-white/5">
             <div className="text-[9px] font-black tracking-widest text-[#d4af37] flex items-center gap-2 mb-2">
                <Sparkles size={12} /> ALTA COCINA S-CLASS
             </div>
             <p className="text-[11px] text-zinc-500 italic leading-relaxed">
                Selección exclusiva purificada por Edwin Agudelo. Experiencia gastronómica orbital centrada en la memoria.
             </p>
          </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 p-8 md:p-12 relative z-10 overflow-y-auto">
          <AnimatePresence mode="wait">
             <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
             >
                <div className="flex justify-between items-end border-b border-white/5 pb-8">
                   <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase italic">{selectedCategory}</h2>
                      <p className="text-emerald-500/60 font-mono text-xs uppercase tracking-[0.3em] font-bold mt-2">Dossier Gastronómico v2.0</p>
                   </div>
                   <div className="text-right hidden sm:block">
                      <div className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">Impacto Sensorial</div>
                      <div className="flex gap-1">
                         {[1,2,3,4,5].map(i => <Star key={i} size={10} className={i <= 4 ? "text-emerald-500" : "text-zinc-800"} fill={i <= 4 ? "currentColor" : "transparent"} />)}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {MENU_ITEMS.find(c => c.category === selectedCategory)?.items.map((item, idx) => (
                      <div key={idx} className="group bg-zinc-900/40 p-8 rounded-[3rem] border border-white/5 hover:border-emerald-500/30 transition-all hover:bg-zinc-800/50 cursor-default">
                         <div className="flex justify-between items-start mb-6">
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-emerald-500/20">
                               {item.dietary}
                            </span>
                            <span className="text-2xl font-black font-mono text-white/20 group-hover:text-emerald-500 transition-colors">{item.price}</span>
                         </div>
                         
                         <h4 className="text-xl font-black uppercase mb-2 group-hover:translate-x-1 transition-transform">{item.name}</h4>
                         <p className="text-zinc-500 text-sm leading-relaxed mb-6 italic">{item.desc}</p>
                         
                         <div className="flex items-center justify-between border-t border-white/5 pt-6">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
                               <Apple size={12} />
                               {item.calories}
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-white/20 group-hover:text-emerald-500 transition-colors">
                               Detalles Técnicos <Info size={12} />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>

                {/* Footer Insight */}
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[40px] mt-12 flex flex-col md:flex-row items-center gap-8">
                   <div className="bg-emerald-500 text-black w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                      <Wine size={28} />
                   </div>
                   <div>
                      <h4 className="font-bold text-lg mb-1 flex items-center gap-2">Protocolo de Maridaje EAR <CheckCircle size={16} className="text-emerald-500" /></h4>
                      <p className="text-zinc-500 text-xs italic leading-relaxed">
                         Todos nuestros platos se complementan con nuestra bodega de alta gama, seleccionada para potenciar la receptividad emocional y el confort neural del comensal.
                      </p>
                   </div>
                </div>
             </motion.div>
          </AnimatePresence>
       </div>
    </div>
  );
}
