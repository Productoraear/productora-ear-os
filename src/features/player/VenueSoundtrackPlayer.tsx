"use client";

import React, { useState } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  ShieldCheckIcon, 
  SparklesIcon,
  MusicalNoteIcon,
  BuildingStorefrontIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  vibe: 'GALA_ELEGANCE' | 'COCKTAIL_LOUNGE' | 'FESTIVA_RANCHERA' | 'VIMUME_RELAX';
  dndaCode: string;
  isrc: string;
}

const VENUE_CATALOG: Track[] = [
  {
    id: 'TRK-001',
    title: 'Algún Día Mamá (Sinfónico Acústico)',
    artist: 'Edwin Agudelo',
    duration: '3:45',
    vibe: 'GALA_ELEGANCE',
    dndaCode: 'DNDA-10501469',
    isrc: 'ES-EAR-26-00012'
  },
  {
    id: 'TRK-002',
    title: 'Mi Propia Realidad (Mariachi Clásico)',
    artist: 'Edwin Agudelo',
    duration: '4:10',
    vibe: 'FESTIVA_RANCHERA',
    dndaCode: 'DNDA-10471493',
    isrc: 'ES-EAR-26-00014'
  },
  {
    id: 'TRK-003',
    title: 'Serenata de Gala — Jardines en Flor',
    artist: 'Edwin Agudelo & Solistas EAR',
    duration: '3:20',
    vibe: 'COCKTAIL_LOUNGE',
    dndaCode: 'DNDA-10501470',
    isrc: 'ES-EAR-26-00018'
  },
  {
    id: 'TRK-004',
    title: 'Frecuencia Sonora VIMUME 432Hz',
    artist: 'VIMUME Neural Healing',
    duration: '5:30',
    vibe: 'VIMUME_RELAX',
    dndaCode: 'DNDA-VIM-2026',
    isrc: 'ES-EAR-26-00099'
  }
];

export const VenueSoundtrackPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>(VENUE_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const togglePlay = (track?: Track) => {
    if (track && track.id !== currentTrack.id) {
      setCurrentTrack(track);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubscribeStripe = () => {
    setIsSubscribing(true);
    setTimeout(() => {
      window.open('https://buy.stripe.com/test_subscription_placeholder', '_blank');
      setIsSubscribing(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-[#050505] text-zinc-100 font-sans">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-br from-zinc-900 via-black to-[#050505] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <BuildingStorefrontIcon className="w-4 h-4" />
              SaaS B2B Music Licensor & Venue Sound
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-syne">
              Reproductor B2B para <span className="text-cyan-400">Fincas & Discotecas</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Catálogo musical exclusivo 100% libre de conflictos SGAE con blindaje fonográfico y reporting directo para hostelería de alto standing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleSubscribeStripe}
              disabled={isSubscribing}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              <SparklesIcon className="w-4 h-4" />
              {isSubscribing ? "Conectando Stripe..." : "Activar Licencia Venue (149€/mes)"}
            </button>
          </div>
        </div>
      </div>

      {/* PLAYER CONSOLE */}
      <div className="bg-zinc-900/60 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-md grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => togglePlay()}
              className="w-16 h-16 rounded-full bg-[#ecb613] hover:bg-[#d4a855] text-black flex items-center justify-center shadow-xl shadow-[#ecb613]/20 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 translate-x-0.5" />}
            </button>
            <div>
              <div className="text-xs font-mono text-[#ecb613] uppercase tracking-widest flex items-center gap-1.5">
                <SpeakerWaveIcon className="w-4 h-4" /> En Emisión Directa
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-syne">{currentTrack.title}</h3>
              <p className="text-xs text-zinc-400">{currentTrack.artist} • {currentTrack.vibe}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1 text-purple-400">
              <ShieldCheckIcon className="w-4 h-4" /> {currentTrack.dndaCode}
            </span>
            <span>ISRC: {currentTrack.isrc}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckBadgeIcon className="w-4 h-4" /> Licencia Limpia para Hostelería
            </span>
          </div>
        </div>

        <div className="bg-black/60 p-5 rounded-2xl border border-white/5 space-y-3">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">Split del Fondo B2B:</span>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-300">
              <span>Artistas / Compositores</span>
              <span className="text-[#ecb613] font-bold">70%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#ecb613] h-full w-[70%]" />
            </div>
            <div className="flex justify-between text-zinc-400 pt-1">
              <span>Infraestructura EAR OS</span>
              <span>20%</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Investigación VIMUME</span>
              <span>10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* TRACKLIST CATALOG */}
      <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <h3 className="text-lg font-bold text-white font-syne flex items-center gap-2">
          <MusicalNoteIcon className="w-5 h-5 text-cyan-400" />
          Catálogo Homologado para Venues & Fincas
        </h3>

        <div className="divide-y divide-white/5">
          {VENUE_CATALOG.map((track) => (
            <div
              key={track.id}
              onClick={() => togglePlay(track)}
              className={`p-4 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all ${
                currentTrack.id === track.id ? 'bg-white/5 border border-white/10' : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-xs font-mono text-zinc-400">
                  {currentTrack.id === track.id && isPlaying ? (
                    <SpeakerWaveIcon className="w-4 h-4 text-[#ecb613] animate-pulse" />
                  ) : (
                    <PlayIcon className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{track.title}</div>
                  <div className="text-xs text-zinc-400">{track.artist} • {track.dndaCode}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {track.vibe}
                </span>
                <span className="text-zinc-400">{track.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenueSoundtrackPlayer;
