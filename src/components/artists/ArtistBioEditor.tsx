import React, { useState } from 'react';
import { ArtistProfileData } from '@/lib/artists/schema';
import { ShieldCheck, Edit3, Globe } from 'lucide-react';

interface ArtistBioEditorProps {
  artist: ArtistProfileData;
  canEdit: boolean;
  onSave?: (updated: Partial<ArtistProfileData>) => void;
}

export const ArtistBioEditor: React.FC<ArtistBioEditorProps> = ({ artist, canEdit, onSave }) => {
  const [bioLong, setBioLong] = useState(artist.bioLong);
  const [bioShort, setBioShort] = useState(artist.bioShort);

  return (
    <div className="space-y-8">
      <div className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-8 md:p-12 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Perfil e Identidad Artística</h3>
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Metadatos oficiales y biografía indexable</p>
          </div>
          <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-black uppercase text-white/60 tracking-widest flex items-center gap-2">
            <ShieldCheck size={12} className="text-[#ecb613]" /> Roster Firmado
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Nombre Artístico</span>
              <div className="bg-white/5 px-6 py-4 rounded-xl text-white font-black uppercase tracking-wider border border-white/5">
                {artist.displayName}
              </div>
            </div>

            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Nombre de Registro Legal</span>
              <div className="bg-white/5 px-6 py-4 rounded-xl text-white font-black uppercase tracking-wider border border-white/5">
                {artist.legalName}
              </div>
            </div>

            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Géneros Principales</span>
              <div className="flex flex-wrap gap-2">
                {artist.genres.map((g, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase text-white/60 tracking-wider">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Eslogan / Biografía Corta</span>
              <textarea
                value={bioShort}
                disabled={!canEdit}
                onChange={(e) => setBioShort(e.target.value)}
                className="w-full bg-white/5 px-6 py-4 rounded-xl text-white text-sm border border-white/5 focus:border-[#ecb613]/50 focus:outline-none transition-colors disabled:opacity-60 resize-none h-20"
              />
            </div>

            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">Trayectoria Completa</span>
              <textarea
                value={bioLong}
                disabled={!canEdit}
                onChange={(e) => setBioLong(e.target.value)}
                className="w-full bg-white/5 px-6 py-4 rounded-xl text-white text-sm border border-white/5 focus:border-[#ecb613]/50 focus:outline-none transition-colors disabled:opacity-60 resize-none h-44"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block mb-1">Territorios de Exclusividad</span>
            <span className="text-sm font-black uppercase text-white font-mono">{artist.territories.join(', ')}</span>
          </div>
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block mb-1">Idioma de Operación</span>
            <span className="text-sm font-black uppercase text-white font-mono">{artist.language}</span>
          </div>
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block mb-1">Base de Operaciones</span>
            <span className="text-sm font-black uppercase text-white font-mono">{artist.homeBase}</span>
          </div>
        </div>

        {canEdit && (
          <div className="flex justify-end pt-6">
            <button
              onClick={() => onSave?.({ bioShort, bioLong })}
              className="bg-[#ecb613] text-black font-black uppercase tracking-[0.25em] text-xs px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-white transition-all shadow-xl shadow-[#ecb613]/5"
            >
              Guardar Cambios <Edit3 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
