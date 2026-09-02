import React from 'react';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { Disc, Play, Calendar } from 'lucide-react';

export default function PublicReleasesListPage() {
  const allReleases = SEED_ARTISTS.flatMap(artist => 
    artist.releases.map(release => ({
      ...release,
      artistName: artist.displayName,
      artistSlug: artist.slug
    }))
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-40 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
              Releases
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              Distribution Catalog
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Catálogo Musical
          </h1>
          <p className="text-white/40 text-lg max-w-xl italic">
            Lanzamientos discográficos oficiales, singles y álbumes completos distribuidos internacionalmente.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {allReleases.map((release) => (
            <div key={release.id} className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-white/10 transition-all group">
              <div className="space-y-6">
                <div className="aspect-square bg-gradient-to-br from-[#121212] to-[#222222] border border-white/5 rounded-2xl flex items-center justify-center text-white/5 group-hover:text-[#ecb613] transition-colors relative overflow-hidden">
                  <Disc size={120} className="group-hover:animate-spin" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-black/60 text-white border border-white/10">
                      {release.format}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white font-syne">{release.title}</h3>
                  <span className="text-[10px] font-bold text-[#ecb613] uppercase tracking-widest block">
                    {release.artistName}
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest font-mono">
                <span className="flex items-center gap-1.5"><Calendar size={12} /> {release.releaseDate}</span>
                <button className="p-3 bg-white/5 hover:bg-[#ecb613] text-white hover:text-black rounded-xl transition-all">
                  <Play size={12} fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
