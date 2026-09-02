import React, { useState } from 'react';
import { ArtistRelease } from '@/lib/artists/schema';
import { ChevronLeft, ChevronRight, Play, Disc } from 'lucide-react';

interface ArtistCarouselProps {
  releases: ArtistRelease[];
}

export const ArtistCarousel: React.FC<ArtistCarouselProps> = ({ releases }) => {
  const [index, setIndex] = useState(0);

  if (releases.length === 0) {
    return (
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center text-white/30 text-sm">
        No hay lanzamientos cargados en el carrusel.
      </div>
    );
  }

  const prev = () => setIndex((i) => (i === 0 ? releases.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === releases.length - 1 ? 0 : i + 1));
  const activeRelease = releases[index];

  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex justify-between items-center mb-8">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613] flex items-center gap-2">
          <Disc className="animate-spin" size={16} /> Destacados de Discografía
        </span>
        <div className="flex gap-2">
          <button onClick={prev} className="p-3 bg-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <ChevronLeft size={16} />
          </button>
          <button onClick={next} className="p-3 bg-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-square bg-gradient-to-br from-[#121212] to-[#222222] border border-white/10 rounded-[2.5rem] flex flex-col justify-between p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Disc size={260} />
          </div>
          <div>
            <span className="px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/20 rounded-full text-[#ecb613] text-[9px] font-black uppercase tracking-widest">
              {activeRelease.format}
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white font-syne group-hover:text-[#ecb613] transition-colors">
              {activeRelease.title}
            </h3>
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-2">
              Lanzamiento: {activeRelease.releaseDate}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Streams Estimados (Spotify)</span>
            <span className="text-5xl font-black italic text-white font-mono">{activeRelease.spotifyStreams?.toLocaleString() || '0'}</span>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block mb-1">Código ISRC</span>
              <span className="text-xs font-black uppercase font-mono text-white/60">{activeRelease.isrc || 'Pendiente'}</span>
            </div>
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block mb-1">Código UPC</span>
              <span className="text-xs font-black uppercase font-mono text-white/60">{activeRelease.upc || 'Pendiente'}</span>
            </div>
          </div>

          <button className="w-full bg-[#ecb613] text-black font-black uppercase tracking-[0.25em] text-xs py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-[#ecb613]/5">
            <Play size={14} fill="black" /> Escuchar Mix Promocional
          </button>
        </div>
      </div>
    </div>
  );
};
