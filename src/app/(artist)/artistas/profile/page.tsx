'use client';

import React from 'react';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { ArtistBioEditor } from '@/app/components/artists/ArtistBioEditor';
import { ShieldCheck } from 'lucide-react';

export default function ArtistProfilePage() {
  const artist = SEED_ARTISTS[0]; // Edwin Agudelo

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Perfil Artístico
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Identity OS
          </span>
        </div>

        <ArtistBioEditor 
          artist={artist} 
          canEdit={true} 
          onSave={() => alert('Biografía guardada en Firestore')} 
        />
      </div>
    </main>
  );
}
