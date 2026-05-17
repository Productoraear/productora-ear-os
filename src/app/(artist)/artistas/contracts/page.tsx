'use client';

import React from 'react';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { ArtistContractsPanel } from '@/app/components/artists/ArtistContractsPanel';

export default function ArtistContractsPage() {
  const artist = SEED_ARTISTS[0]; // Edwin Agudelo

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Contratos
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Legal OS
          </span>
        </div>

        <ArtistContractsPanel contracts={artist.contracts} />
      </div>
    </main>
  );
}
