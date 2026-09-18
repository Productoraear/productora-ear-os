"use client";

import React from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, MapPin, Star, ArrowRight, Volume2, Lock } from 'lucide-react';
import { CultDirectoryItem } from './CultResourceCard';

interface CultFeaturedCarouselProps {
  items: CultDirectoryItem[];
  onOpenDetail: (item: CultDirectoryItem) => void;
}

export const CultFeaturedCarousel: React.FC<CultFeaturedCarouselProps> = ({
  items,
  onOpenDetail,
}) => {
  if (!items || items.length === 0) return null;

  // Duplicar elementos para animación de loop continuo y fluido
  const loopedItems = [...items, ...items];

  return (
    <div className="w-full overflow-hidden py-4 border-y border-zinc-800/80 bg-zinc-950/60 relative">
      {/* Subtle edge fades */}
      <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Header pill */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-[#ecb613]/10 text-[#ecb613]">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Nodos Destacados • Homologación Directa S-Class
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
          Pase el cursor para pausar • Auditoría Acústica 12 W/pax
        </span>
      </div>

      {/* Infinite scrolling carousel track */}
      <div className="flex overflow-hidden">
        <div className="cult-carousel-track gap-4 px-4">
          {loopedItems.map((item, idx) => (
            <div
              key={`${item.id}-feat-${idx}`}
              onClick={() => onOpenDetail(item)}
              className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-[#ecb613]/50 transition-all cursor-pointer w-80 shrink-0 group cult-card-hover"
            >
              {/* Thumbnail 1:1 */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-zinc-800">
                <Image
                  src={item.imageUrls[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop'}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-black/70 text-[#ecb613] backdrop-blur-xs">
                  ★ {item.rating.toFixed(1)}
                </div>
              </div>

              {/* Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#ecb613] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="truncate">{item.badge || 'S-CLASS'}</span>
                </div>
                <h4 className="font-syne font-bold text-xs text-white truncate group-hover:text-[#ecb613] transition-colors mt-0.5">
                  {item.name}
                </h4>
                <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 mt-0.5">
                  <MapPin className="w-2.5 h-2.5 text-[#ecb613]" />
                  <span className="truncate">{item.province}</span>
                </div>
                <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-zinc-800/60">
                  <span className="font-mono text-xs font-bold text-white">
                    {item.price}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 group-hover:text-[#ecb613] flex items-center gap-0.5">
                    Ver ficha <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
