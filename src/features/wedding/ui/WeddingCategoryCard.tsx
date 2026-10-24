'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getPriceTierById } from '@/lib/constants/wedding-taxonomy';
import type { WeddingCategory, WeddingGremio } from '@/lib/constants/wedding-taxonomy';

interface WeddingCategoryCardProps {
  category: WeddingCategory;
  gremio: WeddingGremio;
  href: string;
}

/**
 * 🃏 Tarjeta de categoría hoja (espejo del escaparate bodas.net).
 * Micro-interacciones OLED: hover expansivo, resplandor del acento del gremio.
 */
export function WeddingCategoryCard({ category, gremio, href }: WeddingCategoryCardProps) {
  const tier = getPriceTierById(category.priceTier);

  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#ecb613]/40 hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.9)] min-h-[190px]"
    >
      {/* Resplandor del acento del gremio (hover) */}
      <div
        className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: `${gremio.accent}22` }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl leading-none" aria-hidden>{category.emoji}</span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono font-bold text-[#ecb613]">
          {tier.glyph} · {tier.name}
        </span>
      </div>

      <div className="mt-4 space-y-1.5">
        <h3 className="text-base font-black uppercase tracking-tight text-white font-syne group-hover:text-[#ecb613] transition-colors duration-300">
          {category.name}
        </h3>
        <p className="text-xs text-white/55 leading-relaxed font-light line-clamp-2">
          {category.description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[10px] font-mono font-black uppercase tracking-widest text-white/40 group-hover:text-[#ecb613] transition-colors duration-300">
        Explorar
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
