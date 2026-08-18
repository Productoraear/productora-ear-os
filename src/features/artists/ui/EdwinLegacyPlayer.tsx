"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Sparkles, Disc3, Radio, FileText, Heart, Clock,
  Video, Music, Youtube, Lock, CheckCircle2, ArrowRight, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export interface TrackItem {
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
  type: 'podcast' | 'studio' | 'live' | 'custom';
  audioUrl?: string;
  youtubeId?: string;
  youtubeUrl?: string;
  isPrivate?: boolean;
  hasVideo: boolean;
  badge: string;
}

const TRACKS: TrackItem[] = [
  {
    id: 'track-1',
    title: 'CÓMO JUBILAR AL CUMPLEAÑOS & MAÑANITAS',
    subtitle: 'Masterclass Sonora & Presión Acústica en Directo',
    duration: '05:30',
    durationSeconds: 330,
    year: '2026',
    venue: 'Estudios Productora EAR, Madrid',
    description: 'Masterclass sonora y podcast exclusivo sobre la liturgia de la serenata, psicología del homenaje y técnica de tenor con mariachi.',
    lyricsExcerpt: '"Con dinero y sin dinero, hago siempre lo que quiero... y mi palabra es la ley. ¡Que viva el Mariachi y el amor verdadero!"',
    genre: 'Masterclass & Ensamble de Mariachi',
    type: 'podcast',
    audioUrl: '/media/edwin/podcast-cumpleanos-edwin.m4a',
    hasVideo: false,
    badge: 'MASTER_AUDIO_OFICIAL'
  },
  {
    id: 'track-2',
    title: 'MI PROPIA REALIDAD',
    subtitle: 'El himno de resiliencia y superación del emigrante',
    duration: '03:45',
    durationSeconds: 225,
    year: '2014',
    venue: 'Teatro La Latina, Madrid (1.000+ Asistentes)',
    description: 'Presentada ante el cuerpo diplomático y la comunidad hispana. Una declaración de principios sobre la lucha del emigrante y la forja de la identidad artística.',
    lyricsExcerpt: '"No me mires con lástima, mírame con valor... porque he cruzado mares construyendo mi propia realidad con la voz que Dios me dio."',
    genre: 'Ranchera Lírica de Gala',
    type: 'studio',
    youtubeId: '7yybH70StV0',
    youtubeUrl: 'https://youtu.be/7yybH70StV0',
    hasVideo: true,
    badge: 'ÉXITO_DISCOGRÁFICO'
  },
  {
    id: 'track-3',
    title: 'EDWIN AGUDELO EN DIRECTO (TOP 10 MARIACHI)',
    subtitle: 'Gala de San Valentín & Serenatas de Gran Presión Acústica',
    duration: '10:15',
    durationSeconds: 615,
    year: '2024',
    venue: 'Auditorio & Directos de Gala, España',
    description: 'Sesión en vivo de las 10 canciones rancheras más pedidas en bodas y celebraciones privadas. Demostración de voz de tenor en directo con mariachi completo.',
    lyricsExcerpt: '"Si nos dejan, nos vamos a querer toda la vida... Si nos dejan, nos vamos a vivir a un mundo nuevo."',
    genre: 'Mariachi Live Session S-Class',
    type: 'live',
    youtubeId: 'fLT4-kqfdI4',
    youtubeUrl: 'https://youtu.be/fLT4-kqfdI4',
    hasVideo: true,
    badge: 'LIVE_SESSION_4K'
  },
  {
    id: 'track-4',
    title: 'ALGÚN DÍA MAMÁ',
    subtitle: 'Homenaje universal a las madres (Videoclip Oficial)',
    duration: '04:12',
    durationSeconds: 252,
    year: '2016',
    venue: 'La Cubierta de Leganés, Madrid',
    description: 'Videoclip oficial. El clásico indispensable para serenatas a madres, aniversarios y bodas. Compuesta para agradecer los sacrificios maternales.',
    lyricsExcerpt: '"Algún día mamá, podré devolverte en besos y flores cada noche de desvelo... mientras mi canto sea el abrazo que te abrace el alma."',
    genre: 'Mariachi Tradicional Solemne',
    type: 'studio',
    youtubeId: '0DSEsWA9JsA',
    youtubeUrl: 'https://youtu.be/0DSEsWA9JsA',
    hasVideo: true,
    badge: 'VIDEOCLIP_OFICIAL'
  },
  {
    id: 'track-5',
    title: 'ACOMPÁÑAME',
    subtitle: 'Himno de esperanza y resiliencia',
    duration: '03:58',
    durationSeconds: 238,
    year: '2020',
    venue: 'Inspirada en Cadena 100 Por Ellas',
    description: 'Producida por Silvio Ocaña con arreglos del trompetista Over Vásquez y dirección de Ángeles Cepero. Obra dedicada a la superación.',
    lyricsExcerpt: '"Acompáñame en este vuelo, dame tu mano al caminar... que la tormenta pasará y juntos volveremos a cantar."',
    genre: 'Balada Sinfónica en Positivo',
    type: 'studio',
    youtubeId: 'jTU8aBsX2ik',
    youtubeUrl: 'https://youtu.be/jTU8aBsX2ik',
    hasVideo: true,
    badge: 'PRODUCCIÓN_SINFÓNICA'
  },
  {
    id: 'track-6',
    title: 'PIEL DE NIÑA (CANCIÓN PERSONALIZADA)',
    subtitle: 'Vídeo Privado a Medida • Evelin de Fonsi con Amor',
    duration: '04:30',
    durationSeconds: 270,
    year: '2026',
    venue: 'Encargo Exclusivo B2C / Regalo Emocional VIP',
    description: 'Ejemplo de producción personalizada de Productora EAR. Arreglos y dedicatoria lírica para aniversarios y declaraciones de amor exclusivas.',
    lyricsExcerpt: '"Piel de niña, mirada de cielo... para Evelin con todo el amor de Fonsi en una serenata que durará para siempre."',
    genre: 'Serenata Personalizada a Medida',
    type: 'custom',
    youtubeId: 'xf2Cv6BsCkw',
    youtubeUrl: 'https://youtu.be/xf2Cv6BsCkw',
    isPrivate: true,
    hasVideo: true,
    badge: 'SERVICIO_A_MEDIDA_VIP'
  }
];

export const EdwinLegacyPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<'audio' | 'video'>('audio');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const currentTrack = TRACKS[currentTrackIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sincronizar volumen en audio nativo
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Manejar cambio de track
  useEffect(() => {
    setCurrentTime(0);
    if (audioRef.current && currentTrack.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      if (isPlaying && playbackMode === 'audio') {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [currentTrackIndex, playbackMode]);

  const togglePlay = () => {
    if (playbackMode === 'video' && currentTrack.hasVideo) {
      return;
    }

    if (currentTrack.audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => setIsPlaying(false));
      }
    } else if (currentTrack.hasVideo) {
      // Si el track es de video, conmutamos a modo video para reproducir
      setPlaybackMode('video');
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrevTrack = () => {
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
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentTrack.audioUrl) return;
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
    <div className="relative rounded-[2.5rem] bg-[#09090d] border border-white/10 p-6 md:p-10 overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.85)]">
      {/* Elemento de Audio Nativo */}
      {currentTrack.audioUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleNextTrack}
        />
      )}

      {/* Fondos con brillo atmosférico */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#ecb613]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#a855f7]/10 blur-[110px] rounded-full pointer-events-none" />

      {/* CABECERA CON CONMUTADOR DUAL AUDIO / VIDEO */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
            <Disc3 size={22} className={isPlaying ? "animate-spin text-[#ecb613]" : "text-[#ecb613]/70"} style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#ecb613] block font-mono">
                Bóveda Multimedia S-Class
              </span>
              <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                {currentTrack.badge}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white font-syne">
              Discografía & Actuaciones de Edwin Agudelo
            </h3>
          </div>
        </div>

        {/* CONMUTADOR DUAL AUDIO / VIDEO */}
        <div className="flex items-center gap-2 bg-black/60 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setPlaybackMode('audio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              playbackMode === 'audio'
                ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.3)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Music size={14} />
            <span>Modo Audio</span>
          </button>

          <button
            onClick={() => setPlaybackMode('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              playbackMode === 'video'
                ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video size={14} />
            <span>Modo Video</span>
          </button>
        </div>
      </div>

      {/* CUERPO PRINCIPAL SEGÚN EL MODO ACTIVO */}
      {playbackMode === 'video' && currentTrack.hasVideo ? (
        /* ================= VISTA MODO VIDEO (EMBED YOUTUBE S-CLASS) ================= */
        <div className="relative z-10 space-y-6">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-purple-500/30 bg-black shadow-2xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
              title={currentTrack.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
            {currentTrack.isPrivate && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-purple-500/40 text-purple-300 text-[10px] font-mono">
                <Lock size={12} />
                <span>SERVICIO PRIVADO A MEDIDA</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-[#ecb613] bg-[#ecb613]/10 px-2.5 py-0.5 rounded-md font-bold uppercase">
                  {currentTrack.genre}
                </span>
                <span className="text-xs text-white/40 font-mono">• {currentTrack.year}</span>
              </div>
              <h4 className="text-xl md:text-2xl font-black uppercase text-white font-syne">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-white/60 mt-1 max-w-2xl leading-relaxed">
                {currentTrack.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {currentTrack.youtubeUrl && (
                <a
                  href={currentTrack.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/40 hover:text-red-400 text-white/80 text-xs font-mono flex items-center gap-2 transition-all"
                >
                  <Youtube size={16} className="text-red-500" />
                  <span>Abrir en YouTube</span>
                  <ExternalLink size={12} />
                </a>
              )}
              <Link
                href="/cotizador"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-400 text-black text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
              >
                <span>Cotizar Esta Canción</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ================= VISTA MODO AUDIO (VINILO & MASTER NATIVO) ================= */
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* VINILO GIRATORIO */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 md:w-52 md:h-52">
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full bg-gradient-to-tr from-black via-[#151515] to-[#252525] border-4 border-black shadow-[0_0_40px_rgba(0,0,0,0.9)] flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-2 rounded-full border border-white/5" />
                <div className="absolute inset-6 rounded-full border border-white/5" />
                <div className="absolute inset-10 rounded-full border border-white/5" />
                <div className="absolute inset-14 rounded-full border border-white/5" />
                
                {/* Galleta central Oro Imperial */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ecb613] to-[#b38600] p-1 shadow-inner flex flex-col items-center justify-center text-center text-black">
                  <Disc3 size={22} className="text-black mb-0.5" />
                  <span className="text-[7px] font-black uppercase tracking-tighter leading-none">Edwin Agudelo</span>
                  <span className="text-[6px] font-bold tracking-widest uppercase text-black/70">Master S-Class</span>
                </div>
                
                <div className="w-3 h-3 rounded-full bg-black absolute" />
              </motion.div>

              {/* Ecualizador animado */}
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

            {currentTrack.hasVideo && (
              <button
                onClick={() => setPlaybackMode('video')}
                className="mt-4 text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full transition-all"
              >
                <Video size={12} /> Ver Video Oficial ({currentTrack.duration})
              </button>
            )}
          </div>

          {/* INFORMACIÓN DEL TRACK Y CONTROLES */}
          <div className="lg:col-span-8 space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 border border-[#ecb613]/20 px-2.5 py-0.5 rounded-lg">
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

            {/* BARRA DE PROGRESO */}
            {currentTrack.audioUrl && (
              <div className="space-y-1.5 pt-1">
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
            )}

            {/* CONTROLES DE REPRODUCCIÓN */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevTrack}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-all"
                  aria-label="Anterior pista"
                >
                  <SkipBack size={18} />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ecb613] to-amber-400 text-black flex items-center justify-center transition-all shadow-[0_0_30px_rgba(236,182,19,0.4)] hover:scale-105 active:scale-95 font-bold"
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                >
                  {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center transition-all"
                  aria-label="Siguiente pista"
                >
                  <SkipForward size={18} />
                </button>
              </div>

              {/* VOLUMEN & LETRAS */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLyrics(!showLyrics)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                    showLyrics 
                      ? 'bg-[#ecb613] text-black border-[#ecb613]' 
                      : 'bg-white/5 text-white/70 border-white/10 hover:border-[#ecb613]/40 hover:text-white'
                  }`}
                >
                  <FileText size={14} />
                  <span>{showLyrics ? 'Ocultar Letra' : 'Letra'}</span>
                </button>

                {currentTrack.audioUrl && (
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                    <button 
                      onClick={() => setIsMuted(!isMuted)} 
                      className="text-white/60 hover:text-white transition-colors"
                      aria-label={isMuted ? "Activar sonido" : "Silenciar"}
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
                      className="w-16 accent-[#ecb613] cursor-pointer h-1.5 bg-white/10 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
              Composición & Arreglos Homologados en Productora EAR • Registro SGAE
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LISTA RÁPIDA DE TRACKS (SELECTORES MULTIMEDIA DUALES) */}
      <div className="relative z-10 mt-8 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TRACKS.map((t, idx) => {
          const isSelected = idx === currentTrackIndex;
          return (
            <button
              key={t.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between gap-3 ${
                isSelected 
                  ? 'bg-[#ecb613]/10 border-[#ecb613]/50 text-white shadow-lg' 
                  : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="truncate pr-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[8px] font-mono font-bold uppercase text-[#ecb613]">
                    0{idx + 1}
                  </span>
                  <span className="text-[8px] font-mono text-white/40 uppercase">
                    {t.hasVideo ? '• Video HD' : '• Audio Master'}
                  </span>
                  {t.isPrivate && (
                    <span className="text-[7px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                      PRIVADO
                    </span>
                  )}
                </div>
                <span className="text-xs font-black uppercase truncate block">{t.title}</span>
              </div>
              <span className="text-[9px] font-mono text-white/40 shrink-0">{t.duration}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
