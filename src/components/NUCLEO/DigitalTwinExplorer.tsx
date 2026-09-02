
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter, Layout, Grid, List as ListIcon } from 'lucide-react';

const CATEGORIES = [
  'Bodas', 'VIMUME', 'Artistas', 'Streaming', 'Alquiler Técnico', 'Institucional'
];

const MOCK_PROVIDERS = [
  { id: 1, name: 'Palacio de la Escucha', category: 'Banquetes', rating: 4.9, reviews: 124, city: 'Madrid', image: 'https://picsum.photos/id/101/400/300' },
  { id: 2, name: 'Aroma Gastronómico', category: 'Catering', rating: 4.8, reviews: 89, city: 'Barcelona', image: 'https://picsum.photos/id/102/400/300' },
  { id: 3, name: 'Luz & Memoria', category: 'Fotógrafos', rating: 5.0, reviews: 210, city: 'Valencia', image: 'https://picsum.photos/id/103/400/300' },
  { id: 4, name: 'Sinfonía S-Class', category: 'Música', rating: 5.0, reviews: 56, city: 'Madrid', image: 'https://picsum.photos/id/104/400/300' },
];

export const DigitalTwinExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Banquetes');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="¿Qué buscas? (Ej: Música, Fotografía...)" 
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-gold-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
            <Filter size={14} /> Filtros
          </button>
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-gold-500 text-black' : 'text-white/40'}`}
            >
              <Grid size={16} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-gold-500 text-black' : 'text-white/40'}`}
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              selectedCategory === cat ? 'bg-gold-500 border-gold-500 text-black' : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {MOCK_PROVIDERS.map((provider, i) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-black/40 border border-white/5 rounded-3xl overflow-hidden hover:border-gold-500/30 transition-all"
          >
            <div className="h-48 overflow-hidden relative">
              <img src={provider.image} alt={provider.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                <Star size={12} className="text-gold-500" fill="currentColor" />
                <span className="text-[10px] font-black">{provider.rating}</span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-lg font-bold text-white group-hover:text-gold-500 transition-colors uppercase">{provider.name}</h4>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1"><MapPin size={10} /> {provider.city}</span>
                <span>•</span>
                <span>{provider.reviews} Opiniones</span>
              </div>
              <button className="w-full mt-6 py-3 border border-gold-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-gold-500 group-hover:text-black transition-all">
                Ver Ficha Digital
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
