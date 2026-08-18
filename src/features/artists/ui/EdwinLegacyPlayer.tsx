"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Music, Sparkles, Disc3, Radio, FileText, Share2, Heart, Clock
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  durationSeconds: number;
  year: string;
  venue: string;
  description: string;
  lyricsExcerpt: string;
  genre: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'CÓMO JUBILAR AL CUMPLEAÑOS & MAÑANITAS',
    subtitle: 'Master Oficial de Serenatas & Presión Sonora en Directo',
    duration: '05:30',
    durationSeconds: 330,
    year: '2026',
    venue: 'Gira de Gala en Fincas & Auditorios',
    description: 'Grabación de audio exclusiva sobre la liturgia de la serenata, psicología del homenaje y arreglos líricos de tenor con mariachi.',
    lyricsExcerpt: '"Con dinero y sin dinero, hago siempre lo que quiero... y mi palabra es la ley. ¡Que viva el Mariachi y el amor verdadero!"',
    genre: 'Gran Ensamble de Mariachi',
    url: '/media/edwin/podcast-cumpleanos-edwin.m4a'
  },
  {
    id: 'track-2',
    title: 'MI PROPIA REALIDAD',
    subtitle: 'El himno de resiliencia y orígenes',
    duration: '03:45',
    durationSeconds: 225,
    year: '2014',
    venue: 'Teatro La Latina, Madrid (1.000+ Asistentes)',
    description: 'Presentada ante el cuerpo diplomático y la comunidad hispana. Una declaración de principios sobre la lucha del emigrante y la forja de la identidad artística.',
    lyricsExcerpt: '"No me mires con lástima, mírame con valor... porque he cruzado mares construyendo mi propia realidad con la voz que Dios me dio."',
    genre: 'Ranchera Lírica de Gala',
    url: '/media/edwin/mi-propia-realidad.mp3'
  },
  {
    id: 'track-3',
    title: 'ALGÚN DÍA MAMÁ',
    subtitle: 'Homenaje universal a las madres',
    duration: '04:12',
    durationSeconds: 252,
    year: '2016',
    venue: 'La Cubierta de Leganés, Madrid',
    description: 'El clásico de las serenatas familiares y bodas. Compuesta para agradecer los sacrificios maternales y el amor incondicional que trasciende fronteras.',
    lyricsExcerpt: '"Algún día mamá, podré devolverte en besos y flores cada noche de desvelo... mientras mi canto sea el abrazo que te abrace el alma."',
    genre: 'Mariachi Tradicional Solemne',
    url: '/media/edwin/algun-dia-mama.mp3'
  },
  {
    id: 'track-4',
    title: 'ACOMPÁÑAME',
    subtitle: 'Himno de esperanza y gratitud',
    duration: '03:58',
    durationSeconds: 238,
    year: '2020',
    venue: 'Inspirada en Cadena 100 Por Ellas',
    description: 'Producida por Silvio Ocaña con arreglos del trompetista Over Vásquez y dirección de Ángeles Cepero. Canción dedicada a la superación y a quienes nunca se rinden.',
    lyricsExcerpt: '"Acompáñame en este vuelo, dame tu mano al caminar... que la tormenta pasará y juntos volveremos a cantar."',
    genre: 'Balada Sinfónica en Positivo',
    url: '/media/edwin/acompaname.mp3'
  }
];

export const EdwinLegacyPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sincronizar volumen
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Generador de acordes acústicos en Web Audio para preview cuando el mp3 no está en disco
  const playSynthAcousticChord = (freq: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08 * (isMuted ? 0 : volume), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      // Audio context ignorado en navegadores estrictos
    }
  };

  const stopSynth = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  const startSynthPreview = () => {
    stopSynth();
    const chords = [220, 277.18, 329.63, 440, 329.63, 277.18]; // Arpegio clásico La menor
    let noteIdx = 0;
    
    synthTimerRef.current = setInterval(() => {
      playSynthAcousticChord(chords[noteIdx % chords.length]);
      noteIdx++;
      setCurrentTime((prev) => {
        if (prev >= currentTrack.durationSeconds) {
          handleNextTrack();
          return 0;
        }
        return prev + 0.6;
      });
    }, 600);
  };

  // Limpiar temporizador al desmontar
  useEffect(() => {
    return () => stopSynth();
  }, []);

  // Cambiar de pista
  useEffect(() => {
    stopSynth();
    setAudioError(null);
    setCurrentTime(0);
    
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Si falla el archivo físico, activar el modo de preview acústico armónico
          setAudioError('MASTER_PENDIENTE_CARGA');
          startSynthPreview();
        });
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (isPlaying) {
      stopSynth();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      setAudioError(null);
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Activar preview armónico
          setAudioError('MASTER_PENDIENTE_CARGA');
          setIsPlaying(true);
          startSynthPreview();
        });
      }
    }
  };

  const handleNextTrack = () => {
    stopSynth();
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrevTrack = () => {
    stopSynth();
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
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
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = percentage * (duration || currentTrack.durationSeconds);
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "00:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 
    ? (currentTime / duration) * 100 
    : (currentTime / currentTrack.durationSeconds) * 100;

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
          setAudioError('MASTER_PENDIENTE_CARGA');
          if (isPlaying) {
            startSynthPreview();
          }
        }}
      />

      {/* Fondo con brillo atmosférico */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ecb613]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#a855f7]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* CABECERA DEL REPRODUCTOR */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
            <Radio size={20} className={isPlaying ? "animate-pulse text-[#ecb613]" : "text-[#ecb613]/60"} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#ecb613] block font-mono">
                Bóveda Sonora S-Class
              </span>
              {audioError ? (
                <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  MASTER_AUDIO_PRODUCCIÓN
                </span>
              ) : (
                <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  AUDIO_EN_VIVO
                </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white font-syne">
              Discografía & Canciones Inéditas
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border ${
              showLyrics 
                ? 'bg-[#ecb613] text-black border-[#ecb613]' 
                : 'bg-white/5 text-white/70 border-white/10 hover:border-[#ecb613]/40 hover:text-white'
            }`}
          >
            <FileText size={14} />
            <span>{showLyrics ? 'Ocultar Letra' : 'Ver Letra'}</span>
          </button>
          
          <button
            onClick={() => setHasLiked(!hasLiked)}
            className={`p-2.5 rounded-xl border transition-all ${
              hasLiked 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                : 'bg-white/5 text-white/50 border-white/10 hover:text-rose-400'
            }`}
            aria-label="Guardar en favoritos"
          >
            <Heart size={16} fill={hasLiked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* CUERPO PRINCIPAL: VINILO & DETALLES */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* VINILO GIRATORIO INTERACTIVO */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative w-48 h-48 md:w-56 md:h-56">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full bg-gradient-to-tr from-black via-[#151515] to-[#252525] border-4 border-black shadow-[0_0_40px_rgba(0,0,0,0.9)] flex items-center justify-center relative overflow-hidden"
            >
              {/* Surcos del vinilo */}
              <div className="absolute inset-2 rounded-full border border-white/5" />
              <div className="absolute inset-6 rounded-full border border-white/5" />
              <div className="absolute inset-10 rounded-full border border-white/5" />
              <div className="absolute inset-14 rounded-full border border-white/5" />
              
              {/* Galleta central Oro Imperial */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ecb613] to-[#b38600] p-1 shadow-inner flex flex-col items-center justify-center text-center text-black">
                <Disc3 size={24} className="text-black mb-0.5" />
                <span className="text-[7px] font-black uppercase tracking-tighter leading-none">Edwin Agudelo</span>
                <span className="text-[6px] font-bold tracking-widest uppercase text-black/70">Master</span>
              </div>
              
              {/* Centro de eje */}
              <div className="w-3 h-3 rounded-full bg-black absolute" />
            </motion.div>

            {/* Ecualizador animado superpuesto */}
            {isPlaying && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-1 bg-black/80 px-3 py-1.5 rounded-full border border-[#ecb613]/30 backdrop-blur-md">
                {[40, 75, 55, 90, 60, 80, 45].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, height * 0.2, 4] }}
                    transition={{ duration: 0.6 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1 bg-[#ecb613] rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* INFORMACIÓN DEL TRACK Y CONTROLES */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 border border-[#ecb613]/20 px-2.5 py-1 rounded-lg">
                Track {currentTrackIndex + 1} de {TRACKS.length}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">
                {currentTrack.genre} • {currentTrack.year}
              </span>
            </div>

            <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white font-syne">
              {currentTrack.title}
            </h4>
            <p className="text-[#ecb613] text-xs font-bold uppercase tracking-wider">
              {currentTrack.subtitle}
            </p>
          </div>

          <p className="text-white/60 text-xs md:text-sm leading-relaxed">
            {currentTrack.description}
          </p>

          <div className="text-[10px] font-mono text-white/40 bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-2">
            <Clock size={12} className="text-[#ecb613]" />
            <span>Escenario Histórico: <strong>{currentTrack.venue}</strong></span>
          </div>

          {/* BARRA DE PROGRESO INTERACTIVA */}
          <div className="space-y-2 pt-2">
            <div 
              onClick={handleSeek}
              className="h-2.5 w-full bg-white/10 rounded-full cursor-pointer relative overflow-hidden group"
            >
              <div 
                className="h-full bg-gradient-to-r from-[#ecb613] to-amber-300 rounded-full transition-all duration-150 relative"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : currentTrack.duration}</span>
            </div>
          </div>

          {/* CONTROLES DE REPRODUCCIÓN */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevTrack}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white flex items-center justify-center transition-all active:scale-95"
                aria-label="Canción anterior"
              >
                <SkipBack size={18} />
              </button>

              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-2xl bg-[#ecb613] text-black flex items-center justify-center transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(236,182,19,0.5)] active:scale-95"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>

              <button
                onClick={handleNextTrack}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white flex items-center justify-center transition-all active:scale-95"
                aria-label="Siguiente canción"
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* CONTROL DE VOLUMEN */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="text-white/60 hover:text-white transition-colors"
                aria-label={isMuted ? "Activar sonido" : "Silenciar"}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
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
                className="w-20 accent-[#ecb613] cursor-pointer h-1.5 bg-white/10 rounded-lg"
              />
            </div>
          </div>
        </div>

      </div>

      {/* LETRA EXPANDIBLE */}
      <AnimatePresence>
        {showLyrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 pt-6 border-t border-white/10 bg-black/40 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ecb613] mb-3">
              <Sparkles size={14} /> Fragmento Oficial de Letra
            </div>
            <p className="text-white/90 text-sm italic font-serif leading-relaxed pl-4 border-l-2 border-[#ecb613]">
              {currentTrack.lyricsExcerpt}
            </p>
            <span className="text-[8px] font-mono uppercase text-white/30 block mt-3">
              Composición Registrada en SGAE • Edwin Agudelo Copyright
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LISTA RÁPIDA DE TRACKS */}
      <div className="relative z-10 mt-8 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TRACKS.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setCurrentTime(0);
              setIsPlaying(true);
            }}
            className={`p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between ${
              idx === currentTrackIndex 
                ? 'bg-[#ecb613]/10 border-[#ecb613]/40 text-white' 
                : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="truncate pr-2">
              <span className="text-[8px] font-mono font-bold uppercase block text-[#ecb613]">0{idx + 1}</span>
              <span className="text-xs font-black uppercase truncate block">{t.title}</span>
            </div>
            <span className="text-[9px] font-mono text-white/40 shrink-0">{t.duration}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
