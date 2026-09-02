import React from 'react';
import { ArtistRelease } from '@/lib/artists/schema';
import { Disc, BarChart, ArrowUpRight } from 'lucide-react';

interface ArtistReleaseListProps {
  releases: ArtistRelease[];
}

export const ArtistReleaseList: React.FC<ArtistReleaseListProps> = ({ releases }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Catálogo de Releases</h3>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Lanzamientos oficiales distribuidos en DSPs</p>
        </div>
      </div>

      <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.25em] text-white/30">
                <th className="py-6 px-8">Título y Formato</th>
                <th className="py-6 px-6">Código ISRC / UPC</th>
                <th className="py-6 px-6">Lanzamiento</th>
                <th className="py-6 px-6 text-right">Streams Spotify</th>
                <th className="py-6 px-8 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {releases.map((release) => (
                <tr key={release.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="py-6 px-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:bg-[#ecb613] group-hover:text-black transition-colors">
                      <Disc size={16} className="group-hover:animate-spin" />
                    </div>
                    <div>
                      <span className="font-black uppercase text-white tracking-wide block">
                        {release.title}
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#ecb613]/80 mt-1 block">
                        {release.format}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-6 font-mono text-white/50 space-y-1">
                    <div className="text-[10px]"><span className="text-white/20">ISRC:</span> {release.isrc || 'PENDIENTE'}</div>
                    <div className="text-[10px]"><span className="text-white/20">UPC:</span> {release.upc || 'PENDIENTE'}</div>
                  </td>
                  <td className="py-6 px-6 font-mono text-white/60">
                    {release.releaseDate}
                  </td>
                  <td className="py-6 px-6 text-right font-mono font-black text-white">
                    {release.spotifyStreams?.toLocaleString() || '0'}
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors inline-flex items-center justify-center">
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
