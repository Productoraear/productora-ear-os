import React from 'react';
import Link from 'next/link';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { Star, MapPin, ArrowRight } from 'lucide-react';

export default function PublicArtistRosterPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-40 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
              Roster
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              Signed Talents
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Artistas & Creadores
          </h1>
          <p className="text-white/40 text-lg max-w-xl italic">
            El elenco exclusivo de Productores y Ensembles firmados bajo el sello Productora EAR.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {SEED_ARTISTS.map((artist) => (
            <div key={artist.id} className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between hover:border-[#ecb613]/30 transition-all group">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <MapPin size={12} className="text-[#ecb613]" /> {artist.homeBase}
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase text-white font-syne group-hover:text-[#ecb613] transition-colors">
                  {artist.displayName}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  {artist.bioShort}
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-white/5 flex items-center justify-between">
                <Link href={`/artists/${artist.slug}`} className="bg-white/5 hover:bg-white text-white hover:text-black px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2">
                  Ver Perfil <ArrowRight size={12} />
                </Link>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-mono">
                  {artist.role}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
