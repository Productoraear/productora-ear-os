"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEventCart } from '@/context/EventCartContext';
import { ArrowRight, ChevronRight } from 'lucide-react';

export function InjectHeroButton({ artistId, artistName, basePrice, formats }: { artistId: string, artistName: string, basePrice: string, formats: string[] }) {
  const { addToCart } = useEventCart();
  const router = useRouter();

  const handleInject = () => {
    addToCart({
      slug: artistId,
      rawName: artistName,
      category: 'Artista S-Class',
      itemType: 'ARTIST_DIRECT',
      estimatedPrice: parseInt(basePrice.replace(/\D/g, ''), 10) || 650,
      technicalWatts: 0,
    });
    router.push('/cotizador');
  };

  return (
    <button
      onClick={handleInject}
      className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all min-h-[48px]"
    >
      <span>+ Inyectar y Cotizar Inmediato</span>
      <ArrowRight size={16} className="text-[#ecb613]" />
    </button>
  );
}

export function InjectCatalogButton({ artistId, artistName, category, basePrice }: { artistId: string, artistName: string, category: string, basePrice: string }) {
  const { addToCart } = useEventCart();
  const router = useRouter();

  const handleInject = () => {
    addToCart({
      slug: artistId,
      rawName: artistName,
      category: category,
      itemType: 'ARTIST_DIRECT',
      estimatedPrice: parseInt(basePrice.replace(/\D/g, ''), 10) || 500,
      technicalWatts: 0,
    });
    router.push('/cotizador');
  };

  return (
    <button
      onClick={handleInject}
      className="flex-1 py-3 rounded-xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider text-center shadow-lg shadow-[#ecb613]/10 active:scale-95 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
    >
      <span>+ Inyectar Formato</span>
      <ArrowRight size={14} />
    </button>
  );
}
