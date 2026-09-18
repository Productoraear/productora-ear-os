"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Bookmark,
  Heart,
  ExternalLink,
  MapPin,
  Star,
  ShieldCheck,
  Zap,
  Volume2,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export interface CultDirectoryItem {
  id: string;
  name: string;
  category: string;
  province: string;
  municipality?: string;
  description: string;
  price: string;
  rating: number;
  reviewsCount: number;
  imageUrls: string[];
  isPreferred?: boolean;
  badge?: string;
  verified?: boolean;
  likesCount?: number;
  isBookmarked?: boolean;
  slug?: string;
  websiteUrl?: string;
  acousticRider?: string;
  cetacPower?: string;
  soundLimitDb?: number;
  splitSovereign?: string;
}

interface CultResourceCardProps {
  item: CultDirectoryItem;
  onOpenDetail?: (item: CultDirectoryItem) => void;
  onToggleBookmark?: (item: CultDirectoryItem) => void;
  isBookmarked?: boolean;
}

export const CultResourceCard: React.FC<CultResourceCardProps> = ({
  item,
  onOpenDetail,
  onToggleBookmark,
  isBookmarked = false,
}) => {
  const [likes, setLikes] = useState<number>(item.likesCount ?? Math.floor(item.rating * 14 + 12));
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(item);
    }
  };

  const mainImage = !imgError && item.imageUrls && item.imageUrls.length > 0
    ? item.imageUrls[0]
    : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop';

  const categoryLabels: Record<string, string> = {
    finca: 'Finca & Espacio',
    musica: 'Música & Artista',
    sonido: 'Sonido & Iluminación',
    catering: 'Catering de Gala',
    foto: 'Fotografía & Vídeo',
    senior_care: 'Centro Senior VIMUME',
    wedding: 'Wedding Planner',
  };

  return (
    <div
      onClick={() => onOpenDetail && onOpenDetail(item)}
      className="group relative flex flex-col rounded-2xl bg-[#09090b]/80 border border-zinc-800/90 overflow-hidden cult-card-hover cursor-pointer backdrop-blur-md"
    >
      {/* Visual Header / Media Container (16:10 Aspect Ratio) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        <Image
          src={mainImage}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => setImgError(true)}
          priority={false}
        />

        {/* Top Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/60 pointer-events-none" />

        {/* Top Row Badges: Category & Verification */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-black/60 border border-white/10 text-zinc-200 backdrop-blur-md">
              {categoryLabels[item.category] || item.category}
            </span>
            {item.isPreferred && (
              <span className="px-2 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#ecb613]/20 border border-[#ecb613]/50 text-[#ecb613] backdrop-blur-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                S-CLASS
              </span>
            )}
          </div>

          {/* Bookmark Button (Cult UI Signature Interaction) */}
          <button
            type="button"
            onClick={handleBookmark}
            aria-label="Guardar en Mi Selección"
            className={`pointer-events-auto p-2 rounded-xl backdrop-blur-md transition-all active:scale-90 ${
              isBookmarked
                ? 'bg-[#ecb613] text-black shadow-[0_0_12px_rgba(236,182,19,0.6)]'
                : 'bg-black/60 text-zinc-400 hover:text-white border border-white/10 hover:border-white/30'
            }`}
            title={isBookmarked ? 'Guardado en Mi Selección' : 'Guardar en Mi Selección'}
          >
            <Bookmark
              className={`w-4 h-4 transition-transform ${isBookmarked ? 'fill-black scale-110' : ''}`}
            />
          </button>
        </div>

        {/* Bottom Left: Location Pin & Rating */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-mono text-zinc-300 pointer-events-none">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 border border-white/10 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-[#ecb613]" />
            <span className="truncate max-w-[140px] text-zinc-200">{item.province}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 border border-white/10 backdrop-blur-sm">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-bold text-white">{item.rating.toFixed(1)}</span>
            <span className="text-zinc-500 text-[10px]">({item.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-syne font-bold text-base text-white group-hover:text-[#ecb613] transition-colors line-clamp-1">
              {item.name}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#ecb613] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
          </div>
          <p className="text-xs text-zinc-400 font-sans line-clamp-2 mt-1 leading-relaxed">
            {item.description || 'Proveedor homologado bajo protocolos de calidad, acústica garantizada y seguro de RC de 1.000.000 €.'}
          </p>
        </div>

        {/* SSOT Badges Strip */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-[#ecb613]" />
            {item.soundLimitDb ? `< ${item.soundLimitDb} dB` : '12 W/pax'}
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            {item.cetacPower || 'CETAC 32A'}
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyan-400" />
            Split 80/10/10
          </span>
        </div>

        {/* Card Footer: Price & Upvote Action */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
              Tarifa S-Class
            </span>
            <span className="font-mono text-sm font-bold text-[#ecb613]">
              {item.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Upvote Pill (Cult UI Micro-interaction) */}
            <button
              type="button"
              onClick={handleLike}
              className={`px-2.5 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all border ${
                hasLiked
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
              title="Recomendar recurso"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform ${hasLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`}
              />
              <span>{likes}</span>
            </button>

            {item.websiteUrl && (
              <a
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                title="Visitar web oficial"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
