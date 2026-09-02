"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Music, 
  Camera, 
  Utensils, 
  Heart, 
  ShieldCheck, 
  ChevronDown, 
  SlidersHorizontal 
} from 'lucide-react';

const CATEGORIES = [
  { id: 'musica', name: 'Música & DJs', count: 124, icon: Music },
  { id: 'fotografia', name: 'Fotografía', count: 342, icon: Camera },
  { id: 'banquetes', name: 'Lugares', count: 512, icon: Utensils },
  { id: 'wedding-planners', name: 'Organización', count: 89, icon: Heart },
  { id: 'todas', name: 'Ver Todas', count: '10k+', icon: SlidersHorizontal },
];

const MOCK_PROVIDERS = [
  {
    id: 1,
    name: 'EAR VIP DJs',
    category: 'Música & DJs',
    location: 'Madrid, España',
    rating: 5.0,
    reviews: 142,
    price: 'Desde €1.500',
    verified: true,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    tags: ['S-Class', 'Exclusivo', 'Equipamiento HK']
  },
  {
    id: 2,
    name: 'The Ritz-Carlton Banquetes',
    category: 'Lugares',
    location: 'Barcelona, España',
    rating: 4.9,
    reviews: 320,
    price: 'Pide presupuesto',
    verified: true,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    tags: ['Luxury', 'Vistas Mágicas']
  },
  {
    id: 3,
    name: 'Fotografía de Autor by M.B.',
    category: 'Fotografía',
    location: 'A Coruña, España',
    rating: 4.8,
    reviews: 89,
    price: 'Desde €2.200',
    verified: false,
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
    tags: ['Documental', 'Fine Art']
  }
];

export const ProviderSearchEngine = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white pt-12">
      {/* SEARCH HEADER */}
      <div className="relative px-6 md:px-12 py-24 mb-16 border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#050505] to-[#050505]">
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter"
          >
            S-Class <span className="italic font-serif text-[#d4af37] font-normal">Providers</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Motor avanzado de selección. Analice, compare y movilice a los mejores profesionales del sector nupcial, bajo el estándar 360 EAR OS.
          </motion.p>
          
          {/* SEARCH BAR (BODAS.NET STYLE BUT PREMIUM) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto flex flex-col md:flex-row bg-white/5 border border-white/10 p-2 rounded-3xl backdrop-blur-xl shadow-2xl mt-12 relative z-10"
          >
            <div className="flex-1 flex items-center px-6 py-4 md:py-2 border-b md:border-b-0 md:border-r border-white/10 group">
              <Search className="w-5 h-5 text-zinc-500 mr-4 group-focus-within:text-[#d4af37] transition-colors" />
              <input 
                type="text" 
                placeholder="¿Qué servicio busca? (Ej. DJ, Fotógrafo)"
                className="bg-transparent border-none outline-none w-full text-white placeholder:text-zinc-600 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-6 py-4 md:py-2 group">
              <MapPin className="w-5 h-5 text-zinc-500 mr-4 group-focus-within:text-[#d4af37] transition-colors" />
              <input 
                type="text" 
                placeholder="¿Dónde? (Provincia, Ciudad)"
                className="bg-transparent border-none outline-none w-full text-white placeholder:text-zinc-600 font-medium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button className="bg-[#d4af37] hover:bg-[#f0c541] transition-colors text-black font-black uppercase tracking-widest px-10 py-4 rounded-2xl md:ml-2">
              Buscar
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* SIDEBAR - FILTERS */}
        <div className="lg:col-span-3 space-y-8 h-fit lg:sticky lg:top-32">
          
          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6">
            <h3 className="text-xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#d4af37]" />
              Filtros Tácticos
            </h3>

            {/* Sub-Filters */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-[#d4af37] mb-3 block">Categoría de Élite</label>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                        activeCategory === cat.id 
                          ? 'bg-[#d4af37]/10 border-[#d4af37]/50 text-[#d4af37]' 
                          : 'bg-black border-white/5 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <cat.icon className="w-4 h-4" />
                        <span className="text-sm font-semibold">{cat.name}</span>
                      </div>
                      <span className="text-[10px] bg-white/5 px-2 py-1 rounded font-mono">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-[#d4af37] mb-3 block">Valoración (Rating)</label>
                <div className="flex gap-2">
                  {[5, 4, 3].map(rating => (
                    <button key={rating} className="flex-1 flex items-center justify-center gap-1 bg-black border border-white/5 py-2 rounded-lg hover:border-[#d4af37] transition-all text-sm font-bold">
                      {rating}+ <Star className="w-3 h-3 fill-current text-[#d4af37]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN RESULTS AREA */}
        <div className="lg:col-span-9 space-y-6 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              Proveedores <span className="font-serif italic font-normal text-zinc-500">Destacados</span>
            </h2>
            <div className="flex items-center gap-2 bg-black border border-white/10 rounded-full px-4 py-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ordenar por:</span>
              <button className="text-xs font-bold text-white flex items-center gap-1">EAR Score <ChevronDown className="w-3 h-3" /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_PROVIDERS.map((provider) => (
              <motion.div 
                key={provider.id}
                whileHover={{ y: -5 }}
                className="bg-zinc-900/20 border border-white/5 rounded-[2rem] overflow-hidden group hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all cursor-pointer"
              >
                <div className="h-64 relative overflow-hidden">
                  <img src={provider.image} alt={provider.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center border border-white/10 hover:bg-[#d4af37] hover:text-black transition-colors">
                    <Heart className="w-4 h-4" />
                  </div>
                  {provider.verified && (
                    <div className="absolute top-4 left-4 bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      EAR S-Class
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded text-[10px] uppercase tracking-widest font-bold border border-white/10">
                      {provider.category}
                    </span>
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                      <Star className="w-3 h-3 fill-[#d4af37] text-[#d4af37]" />
                      <span className="text-xs font-bold">{provider.rating}</span>
                      <span className="text-[10px] text-zinc-400">({provider.reviews})</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4 bg-[#0a0a0a]">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-[#d4af37] transition-colors">{provider.name}</h3>
                    <div className="flex items-center gap-1 text-zinc-500 text-xs mt-1">
                      <MapPin className="w-3 h-3" /> {provider.location}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {provider.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-white/5 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm font-black text-[#d4af37]">{provider.price}</span>
                    <button className="text-[10px] font-black uppercase tracking-widest text-white hover:text-[#d4af37] transition-colors">
                      Ver Perfil Táctico &rarr;
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProviderSearchEngine;
