'use client';

import React from 'react';
import { ArtistRepertoire } from '@/app/components/artists/ArtistRepertoire';

export default function ArtistRepertoirePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Repertorio Oficial
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Tracks OS
          </span>
        </div>

        <ArtistRepertoire />
      </div>
    </main>
  );
}
