import React from 'react';
import { 
  Play, 
  ExternalLink, 
  Download, 
  Video, 
  Music, 
  FileText, 
  Image as ImageIcon 
} from 'lucide-react';

interface ArtistMediaGridProps {
  displayName: string;
}

export const ArtistMediaGrid: React.FC<ArtistMediaGridProps> = ({ displayName }) => {
  const assets = [
    { id: '1', name: 'Sesión de Fotos Oficial 2026', type: 'IMAGE', size: '42 MB', desc: 'Fotografías de estudio en alta resolución (RAW/PNG)' },
    { id: '2', name: 'Videoclip Oficial (Promo 4K)', type: 'VIDEO', size: '1.2 GB', desc: 'Enlace máster a ProRes para cadenas de televisión' },
    { id: '3', name: 'Masterización Dub Colibrí (WAV)', type: 'AUDIO', size: '85 MB', desc: 'Pista de estimulación acústica de alta fidelidad' },
    { id: '4', name: 'Dossier de Prensa & Biografía PDF', type: 'DOC', size: '12 MB', desc: 'Kit de prensa completo en español e inglés' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Galería Multimedia</h3>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Control de activos promocionales y riders</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {assets.map((asset) => {
          return (
            <div key={asset.id} className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 transition-all group">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:bg-[#ecb613] group-hover:text-black transition-colors">
                    {asset.type === 'IMAGE' && <ImageIcon size={20} />}
                    {asset.type === 'VIDEO' && <Video size={20} />}
                    {asset.type === 'AUDIO' && <Music size={20} />}
                    {asset.type === 'DOC' && <FileText size={20} />}
                  </div>
                  <span className="text-[10px] font-black uppercase text-white/30 tracking-widest font-mono">
                    {asset.size}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black uppercase text-white tracking-tight">{asset.name}</h4>
                  <p className="text-white/40 text-xs font-bold leading-relaxed">{asset.desc}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-6 mt-6 border-t border-white/5">
                <button className="flex-1 bg-white/5 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                  Ver Asset <ExternalLink size={12} />
                </button>
                <button className="bg-white text-black p-3 rounded-xl hover:bg-[#ecb613] transition-colors">
                  <Download size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
