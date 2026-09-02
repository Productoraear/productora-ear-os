"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Sparkles, Radio, FileText, CheckCircle2, AlertTriangle, 
  GraduationCap, BookOpen, Clock, ListMusic, Filter, Search
} from 'lucide-react';
import TRACKS_DATA from '@/data/dani-aragon-tracks.json';

interface MasterclassTrack {
  id: string;
  trackNumber: number;
  title: string;
  category: string;
  duration: string;
  durationSeconds: number;
  url: string;
  description: string;
}

export const DaniAragonVault: React.FC = () => {
  const [tracks] = useState<MasterclassTrack[]>(TRACKS_DATA);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  const categories = ['TODAS', ...Array.from(new Set(tracks.map(t => t.category)))];

  const filteredTracks = tracks.filter(track => {
    const matchesCat = selectedCategory === 'TODAS' || track.category === selectedCategory;
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          track.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Sincronizar volumen y audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Cambiar de track
  useEffect(() => {
    setAudioError(null);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.warn('⚠️ [AUDIO PLAYBACK PREVENTED]:', err);
          setAudioError('AUDIO_UNAVAILABLE');
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setAudioError(null);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('⚠️ [AUDIO PLAYBACK ERROR]:', err);
        setAudioError('AUDIO_UNAVAILABLE');
        setIsPlaying(false);
      });
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!duration && audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setAudioError(null);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const seekPercentage = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = seekPercentage * (duration || currentTrack.durationSeconds);
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const formatSeconds = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "00:00";
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : (currentTime / currentTrack.durationSeconds) * 100;

  return (
    <div className="relative rounded-[2.5rem] bg-[#09090d] border border-white/10 p-6 md:p-10 overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.8)]">
      {/* Audio element invisible */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNextTrack}
        onError={() => {
          console.warn(`⚠️ [AUDIO ERROR] No se pudo cargar: ${currentTrack.url}`);
          setAudioError('AUDIO_UNAVAILABLE');
          setIsPlaying(false);
        }}
      />

      {/* Fondo con brillo atmosférico */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#a855f7]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#ecb613]/10 blur-[110px] rounded-full pointer-events-none" />

      {/* CABECERA DE LA BÓVEDA */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-400 block font-mono">
                Bóveda de Formación Soberana
              </span>
              <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                56 Masterclasses
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white font-syne">
              Dani Aragón • A&R & Management Mastery
            </h3>
          </div>
        </div>

        {audioError ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
            <AlertTriangle size={14} />
            <span>ACTIVO_PENDIENTE_MIGRACION</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Radio size={14} className={isPlaying ? "animate-pulse text-emerald-400" : "text-emerald-400/50"} />
            <span>CONDUCTO_AUDIO_CONECTADO</span>
          </div>
        )}
      </div>

      {/* PANEL DEL REPRODUCTOR EN VIVO */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[2rem] mb-8">
        
        {/* WAVEFORM / DISCO */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-[#151518] to-[#252530] border-2 border-purple-500/30 shadow-2xl flex items-center justify-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <BookOpen size={24} />
            </div>
            {isPlaying && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-purple-400/30 rounded-full"
              />
            )}
          </div>

          {isPlaying && (
            <div className="flex items-end gap-1 h-6">
              {[30, 70, 45, 90, 60, 85, 40, 75, 50, 95].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, h * 0.25, 4] }}
                  transition={{ duration: 0.5 + (i % 3) * 0.1, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 bg-purple-400 rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        {/* DETALLES Y CONTROLES */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-[#ecb613] font-bold uppercase bg-[#ecb613]/10 px-2 py-0.5 rounded">
                {currentTrack.category}
              </span>
              <span className="text-[9px] font-mono text-white/40">
                Track #{currentTrack.trackNumber}
              </span>
            </div>
            <h4 className="text-xl md:text-2xl font-black uppercase text-white font-syne">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              {currentTrack.description}
            </p>
          </div>

          {/* BARRA DE PROGRESO */}
          <div className="space-y-1.5 pt-2">
            <div 
              onClick={handleSeek}
              className="h-2.5 w-full bg-white/10 rounded-full cursor-pointer relative overflow-hidden group"
            >
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-[#ecb613] rounded-full transition-all duration-150"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-white/40">
              <span>{formatSeconds(currentTime)}</span>
              <span>{duration > 0 ? formatSeconds(duration) : currentTrack.duration}</span>
            </div>
          </div>

          {/* BOTONES DE CONTROL */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevTrack}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-all"
                aria-label="Anterior"
              >
                <SkipBack size={18} />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>

              <button
                onClick={handleNextTrack}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-all"
                aria-label="Siguiente"
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* VOLUMEN */}
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="text-white/60 hover:text-white"
                aria-label="Silenciar"
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 accent-purple-500 cursor-pointer h-1.5 bg-white/10 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BUSCADOR Y FILTROS */}
      <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-white/5 text-white/50 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Buscar tema formativo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* LISTA DE MASTERCLASSES */}
      <div className="relative z-10 max-h-[380px] overflow-y-auto pr-2 space-y-2.5">
        {filteredTracks.map((track) => {
          const isSelected = track.id === currentTrack.id;
          return (
            <div
              key={track.id}
              onClick={() => {
                const globalIdx = tracks.findIndex(t => t.id === track.id);
                if (globalIdx !== -1) {
                  setCurrentTrackIndex(globalIdx);
                  setIsPlaying(true);
                }
              }}
              className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-purple-500/10 border-purple-500/40 text-white shadow-lg'
                  : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                  isSelected ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/60'
                }`}>
                  {isSelected && isPlaying ? (
                    <Radio size={14} className="animate-pulse" />
                  ) : (
                    track.trackNumber.toString().padStart(2, '0')
                  )}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold block truncate">{track.title}</span>
                  <span className="text-[10px] text-white/40 block truncate">{track.description}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                <span className="text-[9px] text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded hidden sm:inline-block">
                  {track.category}
                </span>
                <span className="text-white/40">{track.duration}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
