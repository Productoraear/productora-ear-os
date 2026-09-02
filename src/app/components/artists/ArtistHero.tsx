import React from 'react';
import { ArtistProfileData } from '@/lib/artists/schema';
import { MapPin, Globe, Sparkles, UserCheck } from 'lucide-react';

interface ArtistHeroProps {
  artist: ArtistProfileData;
  activeRole: string;
}

export const ArtistHero: React.FC<ArtistHeroProps> = ({ artist, activeRole }) => {
  return (
    <div className="relative h-[400px] rounded-[3.5rem] overflow-hidden border border-white/5 bg-gradient-to-r from-black via-[#080808] to-transparent p-12 flex items-end">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ecb613]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
              {artist.role}
            </span>
            <span className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
              <MapPin size={12} className="text-[#ecb613]" /> {artist.homeBase}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black font-syne uppercase italic tracking-tighter text-white">
            {artist.displayName}
          </h1>

          <p className="text-white/50 text-sm max-w-xl italic">
            "{artist.bioShort}"
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#ecb613]/20 flex items-center justify-center text-[#ecb613]">
            <UserCheck size={20} />
          </div>
          <div>
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block">
              Operador Autorizado
            </span>
            <span className="text-xs font-black uppercase text-white font-mono tracking-wider">
              {activeRole}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
