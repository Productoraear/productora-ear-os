/**
 * 🎴 MARKETPLACE CARD - S-CLASS AURA ONYX EDITION
 * Purpose: Cinematic service visualization with gravity-based interactions.
 */

"use client";

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Star, ShieldCheck, Zap, ArrowRight, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { marketplaceFeedback } from '@/services/marketplace/MarketplaceFeedbackService';
import { useShortlist } from '@/hooks/useShortlist';

interface MarketplaceCardProps {
  id: string;
  title: string;
  location: string;
  image: string;
  price: string;
  rating: number;
  isSClass?: boolean;
  category: string;
  index?: number;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  id,
  title,
  location,
  image,
  price,
  rating,
  isSClass = true,
  category,
  index
}) => {
  const { addToShortlist, items } = useShortlist();
  const isSaved = items.some(i => i.id === id);

  // 🧲 MAGNETIC EFFECT
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / 10);
    y.set((e.clientY - centerY) / 10);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // 🛰️ TELEMETRY
  React.useEffect(() => {
    marketplaceFeedback.track('card_impression', {
      serviceId: id,
      cardPosition: index,
      badgeId: isSClass ? 'S-CLASS' : 'STANDARD'
    });
  }, [id, index, isSClass]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToShortlist({ id, serviceId: id, title, price });
  };

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      className="group relative bg-[#050505] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl hover:shadow-[#d4a855]/10 transition-shadow duration-700"
    >
      {/* 🖼️ PREMIUM VISUAL NODE */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover scale-105 group-hover:scale-110 group-hover:rotate-1 transition-all duration-1000 grayscale-[0.2] group-hover:grayscale-0"
        />
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/10 to-transparent" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />

        {/* 🏷️ AUTHORITY BADGES */}
        <div className="absolute top-8 left-8 flex flex-col gap-3">
          {isSClass && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-5 py-2.5 rounded-full bg-[#d4a855] text-black text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_0_30px_rgba(212,168,85,0.4)]"
            >
              <ShieldCheck size={12} strokeWidth={3} /> S-Class Certified
            </motion.div>
          )}
          <div className="px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Zap size={12} className="text-[#d4a855]" strokeWidth={3} /> {category}
          </div>
        </div>

        {/* 💾 QUICK SAVE (THE FLOATING TRIGGER) */}
        <button 
          onClick={handleSave}
          disabled={isSaved}
          className={`absolute top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-md border ${
            isSaved 
              ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40' 
              : 'bg-white/10 text-white border-white/20 hover:bg-[#d4a855] hover:text-black hover:border-[#d4a855] hover:shadow-[0_0_20px_rgba(212,168,85,0.5)]'
          }`}
        >
          <Zap size={22} fill={isSaved ? "currentColor" : "none"} />
        </button>

        {/* 📍 IDENTITY STRIP */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-3 text-[#d4a855] mb-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill={i < rating ? "#d4a855" : "none"} stroke={i < rating ? "none" : "rgba(255,255,255,0.2)"} />
              ))}
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase opacity-60">Verified Authority</span>
          </div>
          
          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none mb-3 group-hover:text-[#d4a855] transition-colors duration-500">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.15em]">
            <MapPin size={12} className="text-[#d4a855]/60" /> {location}
          </div>
        </div>
      </div>

      {/* 💳 UTILITY GLASS FOOTER */}
      <div className="p-10 bg-gradient-to-b from-[#0a0a0a] to-black flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Market Valuation</span>
            <span className="text-2xl font-black text-white tracking-tighter italic">Desde €{price}</span>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10b981]">Active</span>
            </div>
            <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">SLA: {'<'} 60 min</span>
          </div>
        </div>

        <Link 
          href={`/servicios/${id}`}
          onClick={() => marketplaceFeedback.track('card_clicked', { serviceId: id, cardPosition: index })}
          className="relative h-16 w-full bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-4 group/btn overflow-hidden transition-all duration-500 hover:border-[#d4a855]/40"
        >
          <div className="absolute inset-0 bg-[#d4a855] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
          <span className="relative text-[11px] font-black uppercase tracking-[0.3em] text-white group-hover/btn:text-black transition-colors duration-500">
            Explorar Propuesta
          </span>
          <ArrowRight size={16} className="relative text-[#d4a855] group-hover/btn:text-black transition-colors duration-500" />
        </Link>
      </div>
    </motion.div>
  );
};
