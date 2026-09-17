"use client";

import React, { useState } from 'react';
import { Music, Check, Volume2, Search, Sparkles } from 'lucide-react';
import { MARIACHI_REPERTOIRE_MASTER, SongRepertoireItem } from '@/lib/mariachi/mariachiDispatchCore';

interface Props {
  selectedSongIds: string[];
  maxSelectable?: number;
  onToggleSong: (songId: string) => void;
}

export default function MariachiRepertoireSelector({
  selectedSongIds,
  maxSelectable = 18,
  onToggleSong
}: Props) {
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = ['todos', 'bolero', 'ranchera', 'huapango', 'clasico', 'popular'];

  const filteredSongs = MARIACHI_REPERTOIRE_MASTER.filter((song) => {
    const matchesCategory = filterCategory === 'todos' || song.category === filterCategory;
    const matchesQuery =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.originalArtist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSimulateAudio = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      setTimeout(() => setPlayingId(null), 4000);
    }
  };

  return (
    <div className="rounded-[2rem] border border-[#ecb613]/20 bg-[#030305] p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
            <Music size={14} />
            Repertorio Interactivo Personalizado
          </div>
          <h3 className="text-xl font-bold text-white font-syne mt-1">
            Selecciona las Canciones de tu Evento
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Seleccionadas: <strong className="text-[#ecb613]">{selectedSongIds.length}</strong> / {maxSelectable} recomendadas
          </p>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Buscar tema o compositor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:border-[#ecb613] focus:outline-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
              filterCategory === cat
                ? 'bg-[#ecb613] text-black font-bold shadow-lg shadow-[#ecb613]/20'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredSongs.map((song) => {
          const isSelected = selectedSongIds.includes(song.id);
          const isPlaying = playingId === song.id;

          return (
            <div
              key={song.id}
              onClick={() => onToggleSong(song.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-[#ecb613]/10 border-[#ecb613]/50 text-white'
                  : 'bg-white/[0.02] border-white/5 text-white/70 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold truncate text-white">{song.title}</span>
                  {song.isFavorite && (
                    <Sparkles size={11} className="text-[#ecb613] shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-white/40 truncate mt-0.5">{song.originalArtist}</p>
                <span className="inline-block mt-1 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-white/50">
                  {song.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSimulateAudio(song.id);
                  }}
                  title="Audio Preview (simulación acústica)"
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isPlaying
                      ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  <Volume2 size={13} />
                </button>

                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-[#ecb613] border-[#ecb613] text-black'
                      : 'border-white/20 bg-transparent text-transparent'
                  }`}
                >
                  <Check size={13} strokeWidth={3} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}