"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, Heart, Star, MapPin, Zap, Info, ShieldCheck } from "lucide-react";

const ARTIST_MOCK = [
  { id: 1, name: "Valentina Soler", category: "Soprano S-Class", location: "Madrid", rating: 4.9, bio: "Voz angelical integrada en el ecosistema EAR para ceremonias de alto impacto.", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=2070" },
  { id: 2, name: "DJ Maverick", category: "Elite Sound Design", location: "Ibiza / Marbella", rating: 5.0, bio: "Especialista en atmósferas envolventes y curaduría rítmica para eventos corporativos.", image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb3?auto=format&fit=crop&q=80&w=2070" },
  { id: 3, name: "The Jazz Collective", category: "Live Band", location: "Global", rating: 4.8, bio: "Sofisticación acústica para recepciones Diplomáticas y galas S-Class.", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=2070" },
];

export default function ArtistMatcher() {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
  const opacity = useTransform(x, [-100, -50, 0, 50, 100], [0, 1, 1, 1, 0]);

  const currentArtist = ARTIST_MOCK[index % ARTIST_MOCK.length];

  const handleSwipe = (direction: "left" | "right") => {
    setHistory([...history, { ...currentArtist, liked: direction === "right" }]);
    setIndex(prev => prev + 1);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] perspective-1000">
      <AnimatePresence mode="wait">
        <motion.div
           key={index}
           style={{ x, rotate, opacity }}
           drag="x"
           dragConstraints={{ left: 0, right: 0 }}
           onDragEnd={(_, info) => {
             if (info.offset.x > 100) handleSwipe("right");
             else if (info.offset.x < -100) handleSwipe("left");
           }}
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           exit={{ x: x.get() > 0 ? 500 : -500, opacity: 0, transition: { duration: 0.3 } }}
           className="absolute inset-0 bg-zinc-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
        >
            <img src={currentArtist.image} alt={currentArtist.name} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute top-6 left-6 right-6 flex justify-between">
                 <div className="bg-black/60 backdrop-blur-md border border-[#d4af37]/30 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-[#d4af37]" />
                    <span className="text-[9px] font-black uppercase text-white">S-CLASS MATCHMAKER</span>
                 </div>
                 <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-[#d4af37]" fill="#d4af37" />
                    <span className="text-xs font-bold text-white">{currentArtist.rating}</span>
                 </div>
            </div>

            <div className="absolute bottom-10 left-8 right-8 text-white space-y-2 pointer-events-none">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]">{currentArtist.category}</p>
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{currentArtist.name}</h3>
                <p className="text-xs text-zinc-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {currentArtist.location}</p>
                <p className="text-[10px] text-zinc-500 line-clamp-2 mt-4 font-medium uppercase tracking-wider">{currentArtist.bio}</p>
            </div>
        </motion.div>
      </AnimatePresence>

      {/* BUTTONS */}
      <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-6">
          <button 
            onClick={() => handleSwipe("left")}
            className="w-16 h-16 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all transform hover:scale-110"
          >
            <X className="w-8 h-8" />
          </button>
          <button 
             onClick={() => setIndex(prev => prev + 1)}
             className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-white hover:border-[#d4af37] transition-all"
          >
            <Info className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-white transition-all shadow-xl shadow-[#d4af37]/10 transform hover:scale-110"
          >
            <Heart className="w-8 h-8" fill="currentColor" />
          </button>
      </div>
    </div>
  );
}
