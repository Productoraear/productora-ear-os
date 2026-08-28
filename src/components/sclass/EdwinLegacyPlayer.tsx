'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, Sparkles } from 'lucide-react';

export interface EdwinLegacyPlayerProps {
  audioUrl?: string;
  title?: string;
  subtitle?: string;
}

export function EdwinLegacyPlayer({ 
  audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
  title = 'Edwin Agudelo · Tenor Lírico S-Class',
  subtitle = 'Audición en Vivo de Alta Fidelidad Acústica'
}: EdwinLegacyPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 1.0;
      audioRef.current.muted = false;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Error al reproducir audio:", err);
      });
    }
  };

  return (
    <div className="bg-[#0e0e14] border border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        preload="metadata" 
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center gap-4 text-left w-full sm:w-auto">
        <div className="w-12 h-12 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] shrink-0">
          <Disc3 size={24} className={isPlaying ? "animate-spin text-[#ecb613]" : "text-[#ecb613]/70"} style={{ animationDuration: '3s' }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-widest text-[#ecb613] font-mono font-bold">
              AUDIO PREVIEW S-CLASS
            </span>
            {isPlaying && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </div>
          <h4 className="text-base font-bold text-white font-syne">{title}</h4>
          <p className="text-xs text-zinc-400 font-light">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <button
          onClick={togglePlay}
          className="px-6 py-3 bg-gradient-to-r from-[#ecb613] to-[#d4a00e] text-black text-xs uppercase tracking-widest font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(236,182,19,0.3)] flex items-center gap-2 cursor-pointer"
        >
          {isPlaying ? <Pause size={14} className="fill-black" /> : <Play size={14} className="fill-black" />}
          <span>{isPlaying ? 'Pausar Audio' : 'Escuchar Directo'}</span>
        </button>
      </div>
    </div>
  );
}

export default EdwinLegacyPlayer;
