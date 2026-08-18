import React, { useState } from 'react';
import { Music, Play, Disc, Star } from 'lucide-react';

interface Song {
  title: string;
  category: 'Clásicos' | 'Románticos' | 'Fiesta' | 'Instrumental';
  duration: string;
  description: string;
}

export const ArtistRepertoire: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'Todos' | 'Clásicos' | 'Románticos' | 'Fiesta' | 'Instrumental'>('Todos');

  const songs: Song[] = [
    { title: 'El Rey', category: 'Clásicos', duration: '3:20', description: 'El himno tradicional por excelencia, ideal para aperturas de ferias.' },
    { title: 'Si Nos Dejan', category: 'Románticos', duration: '3:45', description: 'La balada predilecta para el vals nupcial y bodas.' },
    { title: 'Cielito Lindo', category: 'Fiesta', duration: '2:50', description: 'Canto festivo coral de alta interactividad con el público.' },
    { title: 'La Malagueña', category: 'Instrumental', duration: '4:15', description: 'Exhibición de virtuosismo vocal y falsetes impecables.' },
    { title: 'Volver Volver', category: 'Clásicos', duration: '3:10', description: 'Clásico imperdible para cumpleaños y celebraciones emotivas.' },
  ];

  const filteredSongs = activeCategory === 'Todos'
    ? songs
    : songs.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Repertorio Seleccionado</h3>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Canciones oficiales estructuradas por bloque temático</p>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2">
        {(['Todos', 'Clásicos', 'Románticos', 'Fiesta', 'Instrumental'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeCategory === cat 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSongs.map((song, i) => (
          <div key={i} className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 transition-colors group">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/5 rounded-xl text-white group-hover:bg-[#ecb613] group-hover:text-black transition-colors">
                  <Music size={16} />
                </div>
                <span className="text-[10px] font-mono text-white/30 font-bold">{song.duration}</span>
              </div>
              <div>
                <h4 className="text-lg font-black uppercase text-white tracking-tight">{song.title}</h4>
                <p className="text-white/40 text-xs font-bold leading-relaxed mt-1">{song.description}</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-center">
              <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-white/5 text-white/60 border border-white/10">
                {song.category}
              </span>
              <button className="p-3 bg-white/5 hover:bg-[#ecb613] text-white hover:text-black rounded-xl transition-all">
                <Play size={12} fill="currentColor" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
