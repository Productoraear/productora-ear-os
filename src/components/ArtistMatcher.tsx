"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, MapPin, Zap, Info, ShieldCheck, Music2 } from 'lucide-react';

interface Artist {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  priceRange: string;
  location: string;
  description: string;
  specialties: string[];
}

const SAMPLE_ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Mariachi Élite Madrid',
    category: 'Música en Vivo',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1549421263-54013220800b?auto=format&fit=crop&q=80&w=600',
    priceRange: '€€€',
    location: 'Madrid / Toledo / Segovia',
    description: 'La formación de mariachis más prestigiosa de España. Especialistas en bodas y eventos corporativos de alto standing.',
    specialties: ['Serenatas', 'Cocktail', 'Show interactivo']
  },
  {
    id: '2',
    name: 'DJ Lume // S-Class',
    category: 'DJ & Producción',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1514525253361-bee8a48790c7?auto=format&fit=crop&q=80&w=600',
    priceRange: '€€€€',
    location: 'Ibiza / Madrid / Mallorca',
    description: 'Ingeniería musical aplicada a la pista de baile. Sonido impecable y selección vanguardista.',
    specialties: ['Audio Branding', 'Deep House', 'Wedding Sets']
  },
  {
    id: '3',
    name: 'Jazz Quartet // Blue Note Shift',
    category: 'Música Ambiente',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1415202330656-6bb86e6551b8?auto=format&fit=crop&q=80&w=600',
    priceRange: '€€',
    location: 'Barcelona / Valencia',
    description: 'Cuarteto de jazz clásico con un toque moderno. Ideal para recepciones diplomáticas y cenas de gala.',
    specialties: ['Bossa Nova', 'Standard Jazz', 'Cool Jazz']
  }
];

export default function ArtistMatcher() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number | null>(null);
  const [matches, setMatches] = useState<Artist[]>([]);

  const artist = SAMPLE_ARTISTS[currentIndex];

  const handleSwipe = (swipeDirection: 'left' | 'right') => {
    if (swipeDirection === 'right') {
      setMatches([...matches, artist]);
    }
    setDirection(swipeDirection === 'right' ? 1 : -1);
    
    setTimeout(() => {
      setDirection(null);
      setCurrentIndex((prev) => (prev + 1) % SAMPLE_ARTISTS.length);
    }, 300);
  };

  return (
    <div className="w-full max-w-md mx-auto h-[700px] flex flex-col bg-[#050505] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden relative selection:bg-[#d4af37] selection:text-black">
      
      {/* Header HUD */}
      <div className="pt-8 px-8 pb-4 flex justify-between items-center z-10">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-black font-mono">Artist Discovery</span>
          <h3 className="text-white text-xl font-black tracking-tighter">ASTRA MATCHER</h3>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <Zap className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
          <span className="text-white text-[10px] font-black">{matches.length}</span>
        </div>
      </div>

      {/* Main Card Area */}
      <div className="flex-1 relative px-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={artist.id}
            initial={{ scale: 0.9, opacity: 0, x: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              x: direction === 1 ? 200 : direction === -1 ? -200 : 0,
              rotate: direction === 1 ? 15 : direction === -1 ? -15 : 0
            }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="w-full h-[500px] bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2xl group cursor-grab active:cursor-grabbing"
          >
            {/* Image Container */}
            <div className="absolute inset-0 z-0">
              <img src={artist.image} alt={artist.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-8 z-10 flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#d4af37] text-[10px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md w-fit px-2 py-0.5 rounded">
                    <Music2 className="w-3 h-3" />
                    {artist.category}
                  </div>
                  <h4 className="text-3xl font-black text-white tracking-tighter leading-none">{artist.name}</h4>
                  <p className="text-white/60 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {artist.location}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-[#d4af37] mb-1">
                    <Star className="w-3 h-3 fill-[#d4af37]" />
                    <span className="text-xs font-black">{artist.rating}</span>
                  </div>
                  <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{artist.priceRange}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                {artist.specialties.map((s, i) => (
                  <span key={i} className="text-[9px] font-black uppercase tracking-wider text-white/50 border border-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Like/Nope Indicators */}
            {direction === 1 && (
              <div className="absolute top-10 left-10 border-4 border-[#d4af37] text-[#d4af37] text-3xl font-black px-6 py-2 rounded-xl rotate-[-15deg] z-20">
                MATCH
              </div>
            )}
            {direction === -1 && (
              <div className="absolute top-10 right-10 border-4 border-red-500 text-red-500 text-3xl font-black px-6 py-2 rounded-xl rotate-[15deg] z-20">
                NEXT
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="h-24 flex items-center justify-center gap-8 px-8 pb-4 relative z-10">
        <button 
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-red-500/50 hover:text-red-500 hover:border-red-500/20 hover:scale-110 transition-all shadow-xl"
        >
          <X className="w-8 h-8" />
        </button>
        <button 
          className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-blue-400/50 hover:text-blue-400 transition-all shadow-xl"
        >
          <Info className="w-6 h-6" />
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-[#d4af37]/50 hover:text-[#d4af37] hover:border-[#d4af37]/20 hover:scale-110 transition-all shadow-xl"
        >
          <Heart className="w-8 h-8 fill-current" />
        </button>
      </div>

      {/* Trust Badge */}
      <div className="pb-6 flex justify-center">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
          <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
          <span>EAR Verified Talent Protocol</span>
        </div>
      </div>

    </div>
  );
}
