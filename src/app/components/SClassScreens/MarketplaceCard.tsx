/**
 * 🎴 MARKETPLACE CARD - S-CLASS DISCOVERY (AIRBNB STYLE)
 * Purpose: High-impact service visualization with authority badges.
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Zap, ArrowRight, MapPin } from 'lucide-react';
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
  index?: number; // Added for position tracking
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

  // 🛰️ IMPRESSION TRACKING
  React.useEffect(() => {
    marketplaceFeedback.track('card_impression', {
      serviceId: id,
      cardPosition: index,
      badgeId: isSClass ? 'S-CLASS' : 'STANDARD'
    });
  }, [id, index, isSClass]);

  const handleCardClick = () => {
    marketplaceFeedback.track('card_clicked', {
      serviceId: id,
      cardPosition: index
    });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToShortlist({
      id,
      serviceId: id,
      title,
      price
    });
  };
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col"
    >
      {/* Visual Dominance */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        {/* Authority Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {isSClass && (
            <div className="px-4 py-2 rounded-full bg-[#d4a855] text-black text-[8px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#d4a855]/20">
              <ShieldCheck size={10} /> S-Class Certified
            </div>
          )}
          <div className="px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
            <Zap size={10} className="text-[#d4a855]" /> {category}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 text-[#d4a855] mb-2">
            <Star size={12} fill="#d4a855" />
            <span className="text-xs font-black">{rating.toFixed(1)}</span>
            <span className="text-[10px] text-white/40 font-bold">• 100% SLA</span>
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-none mb-2">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
            <MapPin size={10} /> {location}
          </div>
        </div>
      </div>

      {/* Utility Area */}
      <div className="p-8 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Inversión Estimada</span>
            <span className="text-xl font-black text-white">Desde €{price}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-black uppercase tracking-widest text-green-500">Disponible</span>
            <span className="block text-[8px] text-white/30 font-bold uppercase tracking-widest">Respuesta en {'<'} 1h</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Link 
            href={`/servicios/${id}`}
            onClick={handleCardClick}
            className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            Ver Propuesta
          </Link>
          <button 
            onClick={handleSave}
            disabled={isSaved}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              isSaved 
                ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                : 'bg-[#d4a855] text-black hover:scale-110 active:scale-95 shadow-[#d4a855]/20'
            }`}
          >
            {isSaved ? <ShieldCheck size={20} /> : <Zap size={20} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
