import React from 'react';
import { Image as ImageIcon, Play, Download, ExternalLink } from 'lucide-react';

export const ArtistGallery: React.FC = () => {
  const mediaItems = [
    { id: '1', title: 'Edwin Agudelo - Gala de Honor', type: 'FOTO', size: '12 MB' },
    { id: '2', title: 'Mariachi Sinfónico del Colibrí', type: 'VIDEO', size: '150 MB' },
    { id: '3', title: 'Master Mix Acústico 2026', type: 'AUDIO', size: '45 MB' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Galería Multimedia</h3>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Imágenes y material audiovisual oficial del artista</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {mediaItems.map((item) => (
          <div key={item.id} className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 transition-all group">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:bg-[#ecb613] group-hover:text-black transition-colors">
                  <ImageIcon size={20} />
                </div>
                <span className="text-[10px] font-black uppercase text-white/30 tracking-widest font-mono">
                  {item.size}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-black uppercase text-white tracking-tight">{item.title}</h4>
                <span className="text-[9px] font-bold text-[#ecb613] uppercase tracking-widest mt-1 block">
                  Format: {item.type}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-6 mt-6 border-t border-white/5">
              <button className="flex-1 bg-white/5 hover:bg-white text-white hover:text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                Ver Asset <ExternalLink size={12} />
              </button>
              <button className="p-3 bg-white/5 hover:bg-[#ecb613] text-white hover:text-black rounded-xl transition-all">
                <Download size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
