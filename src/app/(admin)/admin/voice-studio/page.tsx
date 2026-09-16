'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Mic2,
  Music,
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  ArrowLeft,
  CheckCircle2,
  Volume2,
  Sliders,
  Cpu,
  RefreshCw,
  Globe2,
  Film,
  FileAudio,
  ShieldCheck,
  Zap,
  Radio,
  Share2,
  Info
} from 'lucide-react';
import {
  checkVoiceStudioHealth,
  personalizeSongWithVoice,
  dubVideoWithVoice,
  EAR_VOICE_PROFILES,
  EAR_BASE_SONG_CATALOG,
  VoiceStudioStatus,
  VoiceProfile,
  PersonalizedSongResult,
  VideoDubbingResult
} from '@/lib/audio/voiceStudioEngine';

export default function VoiceStudioAdminPage() {
  const [activeTab, setActiveTab] = useState<'SONGS' | 'DUBBING' | 'SERVER'>('SONGS');
  const [serverStatus, setServerStatus] = useState<VoiceStudioStatus>({
    connected: false,
    endpoint: 'http://127.0.0.1:8080',
    gpuAcceleration: 'AMD Radeon RX 7900 XTX (24GB)',
    activeVoicesCount: 4
  });
  const [isCheckingServer, setIsCheckingServer] = useState(false);

  // Estados de Personalización de Canciones
  const [selectedSongId, setSelectedSongId] = useState(EAR_BASE_SONG_CATALOG[0].id);
  const [honorees, setHonorees] = useState('Carmen y Manuel (25 Aniversario)');
  const [occasion, setOccasion] = useState<'boda' | 'aniversario' | 'vimume_terapia' | 'homenaje_vital'>('aniversario');
  const [voiceId, setVoiceId] = useState('edwin_agudelo_gala');
  const [customVerse, setCustomVerse] = useState(
    'Dedicado con todo el amor de vuestros hijos a Carmen y Manuel, celebrando 25 años de entrega y complicidad.'
  );
  const [isGeneratingSong, setIsGeneratingSong] = useState(false);
  const [generatedSong, setGeneratedSong] = useState<PersonalizedSongResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Estados de Doblaje de Vídeos
  const [videoTitle, setVideoTitle] = useState('Cinematic Wedding Trailer // Finca Méntrida S-Class');
  const [videoUrl, setVideoUrl] = useState('https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [higgsfieldPrompt, setHiggsfieldPrompt] = useState<'cinematic_wedding' | 'FPVDRONE' | 'macroreveal' | 'productexplosion'>('cinematic_wedding');
  const [sourceLang, setSourceLang] = useState('es');
  const [targetLang, setTargetLang] = useState('en');
  const [dubVoiceId, setDubVoiceId] = useState('edwin_agudelo_gala');
  const [syncLips, setSyncLips] = useState(true);
  const [preserveMusic, setPreserveMusic] = useState(true);
  const [isDubbingVideo, setIsDubbingVideo] = useState(false);
  const [dubbingResult, setDubbingResult] = useState<VideoDubbingResult | null>(null);

  // Audio HTML5 ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    refreshHealth();
  }, []);

  const refreshHealth = async () => {
    setIsCheckingServer(true);
    try {
      const status = await checkVoiceStudioHealth();
      setServerStatus(status);
    } catch {
      setServerStatus(prev => ({ ...prev, connected: false }));
    } finally {
      setIsCheckingServer(false);
    }
  };

  const handleGenerateSong = async () => {
    setIsGeneratingSong(true);
    try {
      const songBase = EAR_BASE_SONG_CATALOG.find(s => s.id === selectedSongId) || EAR_BASE_SONG_CATALOG[0];
      const result = await personalizeSongWithVoice({
        songId: selectedSongId,
        songTitle: songBase.title,
        honorees,
        occasion,
        voiceProfileId: voiceId,
        customDedicationVerse: customVerse,
        musicalStyle: (songBase.genre as any) || 'bolero_gala',
        boseAcousticTuning: true
      });
      setGeneratedSong(result);
    } catch (err) {
      console.error('Error generando canción:', err);
    } finally {
      setIsGeneratingSong(false);
    }
  };

  const handleDubVideo = async () => {
    setIsDubbingVideo(true);
    try {
      const res = await dubVideoWithVoice({
        videoId: `vid-${Date.now()}`,
        videoTitle,
        videoUrl,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        voiceProfileId: dubVoiceId,
        higgsfieldPromptType: higgsfieldPrompt,
        syncLips,
        preserveBackgroundMusic: preserveMusic
      });
      setDubbingResult(res);
    } catch (err) {
      console.error('Error doblando vídeo:', err);
    } finally {
      setIsDubbingVideo(false);
    }
  };

  const toggleAudioPlayback = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-[#F3F4F6] font-sans antialiased selection:bg-[#ecb613]/20 selection:text-[#ecb613] pb-24 w-full overflow-x-hidden">
      {/* Top Bar S-Class */}
      <header className="border-b border-[#1A1A24] bg-[#050507]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/command-center"
              className="p-2.5 rounded-lg border border-[#262638] bg-[#09090F] hover:border-[#ecb613]/50 text-[#A1A1AA] hover:text-[#F3F4F6] transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-semibold">
                  VOICE STUDIO AI // 646 IDIOMAS
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  BARE-METAL 0€ CLOUD
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-serif mt-1">
                Personalización de Canciones & Doblaje de Vídeos
              </h1>
            </div>
          </div>

          {/* Estado de conexión VoiceStudio Local */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-lg border border-[#262638] bg-[#09090F] flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${serverStatus.connected ? 'bg-[#10B981] animate-pulse' : 'bg-[#EAB308]'}`} />
                <span className="text-zinc-300">
                  {serverStatus.connected ? 'DAEMON ACTIVO' : 'LOCAL STANDBY'}
                </span>
              </div>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">Puerto 8080</span>
              <button
                onClick={refreshHealth}
                disabled={isCheckingServer}
                className="text-zinc-400 hover:text-[#ecb613] transition-colors p-1"
                title="Actualizar estado del servidor"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingServer ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <a
              href="http://127.0.0.1:8080"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-[#ecb613] hover:bg-[#d9a40e] text-[#050507] font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-[#ecb613]/10"
            >
              <Radio className="w-3.5 h-3.5" />
              Abrir VoiceStudio Web
            </a>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-4 pt-2 border-t border-[#1A1A24]/60">
          <button
            onClick={() => setActiveTab('SONGS')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
              activeTab === 'SONGS'
                ? 'bg-[#ecb613]/10 border-[#ecb613]/40 text-[#ecb613]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#12121A]'
            }`}
          >
            <Music className="w-4 h-4" />
            Canciones Personalizadas (Voz Edwin Agudelo)
          </button>
          <button
            onClick={() => setActiveTab('DUBBING')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
              activeTab === 'DUBBING'
                ? 'bg-[#00E5FF]/10 border-[#00E5FF]/40 text-[#00E5FF]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#12121A]'
            }`}
          >
            <Video className="w-4 h-4" />
            Doblaje de Vídeos IA (Higgsfield)
          </button>
          <button
            onClick={() => setActiveTab('SERVER')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
              activeTab === 'SERVER'
                ? 'bg-[#FF2B44]/10 border-[#FF2B44]/40 text-[#FF2B44]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#12121A]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Voice Gallery & Daemon Local (RX 7900 XTX)
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* ========================================================================= */}
        {/* PESTAÑA 1: CANCIONES PERSONALIZADAS                                       */}
        {/* ========================================================================= */}
        {activeTab === 'SONGS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Formulario de Configuración */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-xl border border-[#1A1A24] bg-[#09090F] space-y-5">
                <div className="flex items-center justify-between border-b border-[#1A1A24] pb-4">
                  <div className="flex items-center gap-2.5">
                    <Mic2 className="w-5 h-5 text-[#ecb613]" />
                    <h2 className="text-lg font-bold text-white">Configuración del Homenaje Vocal</h2>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 bg-[#12121A] px-2.5 py-1 rounded border border-[#222230]">
                    Bose 2000W Calibrated
                  </span>
                </div>

                {/* Selección de Canción Base */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    1. Pista Master & Repertorio Base
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EAR_BASE_SONG_CATALOG.map(song => (
                      <button
                        key={song.id}
                        type="button"
                        onClick={() => setSelectedSongId(song.id)}
                        className={`p-3.5 rounded-lg border text-left transition-all ${
                          selectedSongId === song.id
                            ? 'border-[#ecb613] bg-[#ecb613]/5 text-white shadow-sm'
                            : 'border-[#1A1A24] bg-[#0D0D15] text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div className="font-semibold text-sm flex items-center justify-between">
                          <span>{song.title}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{song.defaultDuration}</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 capitalize font-mono">
                          {song.genre.replace('_', ' ')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Homenajeados y Ocasión */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      2. Nombres de Homenajeados
                    </label>
                    <input
                      type="text"
                      value={honorees}
                      onChange={e => setHonorees(e.target.value)}
                      placeholder="Ej: Carmen y Manuel"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      3. Tipo de Evento / Homenaje
                    </label>
                    <select
                      value={occasion}
                      onChange={e => setOccasion(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white focus:outline-none focus:border-[#ecb613]"
                    >
                      <option value="boda">Boda de Gala (Entrada o Baile Nupcial)</option>
                      <option value="aniversario">Bodas de Plata / Oro (Aniversario)</option>
                      <option value="vimume_terapia">VIMUME Terapia Senior (Cognitiva)</option>
                      <option value="homenaje_vital">Homenaje a Familiares / Padres</option>
                    </select>
                  </div>
                </div>

                {/* Perfil de Voz */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    4. Perfil Vocal Clonado (Zero-Shot)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EAR_VOICE_PROFILES.slice(0, 2).map(profile => (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => setVoiceId(profile.id)}
                        className={`p-3.5 rounded-lg border text-left transition-all ${
                          voiceId === profile.id
                            ? 'border-[#ecb613] bg-[#ecb613]/5 text-white'
                            : 'border-[#1A1A24] bg-[#0D0D15] text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div className="font-semibold text-xs text-white">{profile.name}</div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{profile.tone}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {profile.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#181824] text-zinc-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verso y Dedicatoria Personalizada */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      5. Verso o Dedicatoria Cantada / Narrada
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setCustomVerse(
                          `Para ${honorees}, que con su ternura han tejido el camino de todos los que les amamos. Hoy cantamos por vuestra vida.`
                        )
                      }
                      className="text-[11px] text-[#ecb613] hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Sugerir Letra Emocional
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={customVerse}
                    onChange={e => setCustomVerse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613]"
                  />
                </div>

                {/* Botón de Generación */}
                <button
                  onClick={handleGenerateSong}
                  disabled={isGeneratingSong}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#ecb613] to-[#d9a40e] text-[#050507] font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#ecb613]/20 hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGeneratingSong ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Clonando Timbre Vocal y Sincronizando Pista Master...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generar Canción Personalizada con Voz de Edwin Agudelo (IA)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Panel de Visualización & Reproductor de Master */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-xl border border-[#1A1A24] bg-[#09090F] space-y-6">
                <div className="flex items-center justify-between border-b border-[#1A1A24] pb-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-[#10B981]" />
                    <h3 className="font-bold text-white text-base">Master de Gala Acústico</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                    FLAC 24-bit / 48kHz
                  </span>
                </div>

                {generatedSong ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-white text-base">{generatedSong.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1 font-mono">
                        Homenaje a {generatedSong.honorees} • Duración: {Math.floor(generatedSong.durationSeconds / 60)}:{(generatedSong.durationSeconds % 60).toString().padStart(2, '0')}
                      </p>
                    </div>

                    {/* Waveform Visualizer */}
                    <div className="p-4 rounded-lg bg-[#050507] border border-[#1A1A24]">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-2">
                        <span>VOICE CLONE WAVEFORM</span>
                        <span>SHURE BETA 87A</span>
                      </div>
                      <div className="h-16 flex items-end gap-1 px-1">
                        {generatedSong.waveform.map((height, i) => (
                          <div
                            key={i}
                            style={{ height: `${height}%` }}
                            className={`flex-1 rounded-full transition-all ${
                              isPlayingAudio ? 'bg-[#ecb613]' : 'bg-zinc-700'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1A1A24]">
                        <button
                          onClick={toggleAudioPlayback}
                          className="px-4 py-2 rounded-lg bg-[#ecb613] text-[#050507] font-bold text-xs flex items-center gap-2 hover:bg-[#d9a40e] transition-all"
                        >
                          {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          {isPlayingAudio ? 'Pausar Canción' : 'Escuchar Directo'}
                        </button>

                        <a
                          href={generatedSong.audioUrl}
                          download="cancion_personalizada_edwin_agudelo.ogg"
                          className="px-3 py-2 rounded-lg border border-[#262638] bg-[#09090F] hover:border-zinc-500 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Descargar Master
                        </a>
                      </div>

                      {/* Hidden Audio Player */}
                      <audio
                        ref={audioRef}
                        src={generatedSong.audioUrl}
                        onEnded={() => setIsPlayingAudio(false)}
                      />
                    </div>

                    {/* Letra Generada */}
                    <div className="p-4 rounded-lg bg-[#050507] border border-[#1A1A24]">
                      <span className="text-[11px] font-mono text-zinc-400 block mb-2">
                        LETRA & PARTE VOCAL PERSONALIZADA
                      </span>
                      <pre className="text-xs text-zinc-300 font-sans whitespace-pre-line leading-relaxed italic">
                        {generatedSong.lyrics}
                      </pre>
                    </div>

                    {/* Especificaciones Acústicas & Negocio */}
                    <div className="p-4 rounded-lg bg-[#0D0D15] border border-[#222230] space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-zinc-400">
                        <span>Sistema Acústico:</span>
                        <span className="text-white">{generatedSong.acousticSpecs.soundSystem}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Calibración SPL:</span>
                        <span className="text-[#10B981]">&lt; {generatedSong.acousticSpecs.splLimitDb} dB SPL</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Caché Directo de Gala:</span>
                        <span className="text-[#ecb613] font-bold">{generatedSong.governance.baseRateEur.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Reserva Price-Lock:</span>
                        <span className="text-white">{generatedSong.governance.depositPriceLockEur.toFixed(2)} € (Stripe)</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#12121A] border border-[#222230] mx-auto flex items-center justify-center text-zinc-500">
                      <FileAudio className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-zinc-400 font-medium">Ninguna canción generada aún</p>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                      Configura el homenaje a la izquierda y pulsa el botón para generar la pista con la voz clonada de Edwin Agudelo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 2: DOBLAJE DE VÍDEOS IA (HIGGSFIELD)                                */}
        {/* ========================================================================= */}
        {activeTab === 'DUBBING' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-xl border border-[#1A1A24] bg-[#09090F] space-y-5">
                <div className="flex items-center justify-between border-b border-[#1A1A24] pb-4">
                  <div className="flex items-center gap-2.5">
                    <Video className="w-5 h-5 text-[#00E5FF]" />
                    <h2 className="text-lg font-bold text-white">Doblaje de Vídeos Multilingüe (646 Idiomas)</h2>
                  </div>
                  <span className="text-xs font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded border border-[#00E5FF]/20">
                    Higgsfield Engine Synced
                  </span>
                </div>

                {/* Título y URL del Vídeo */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Título del Proyecto Audiovisual
                    </label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={e => setVideoTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Estilo Cinematográfico (Prompt Higgsfield)
                    </label>
                    <select
                      value={higgsfieldPrompt}
                      onChange={e => setHiggsfieldPrompt(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="cinematic_wedding">Tráiler Nupcial S-Class (Atmósfera Emocional)</option>
                      <option value="FPVDRONE">/FPVDRONE Vuelo Rasante Finca & Exteriores</option>
                      <option value="macroreveal">/macroreveal Enfoque Detallado de Joyas y Protocolo</option>
                      <option value="productexplosion">/productexplosion Sonido & Montaje Bose Directo</option>
                    </select>
                  </div>

                  {/* Idiomas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                        Idioma de Origen
                      </label>
                      <select
                        value={sourceLang}
                        onChange={e => setSourceLang(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                      >
                        <option value="es">Español (Castellano)</option>
                        <option value="en">Inglés</option>
                        <option value="fr">Francés</option>
                        <option value="it">Italiano</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                        Idioma Destino (646 Disponibles)
                      </label>
                      <select
                        value={targetLang}
                        onChange={e => setTargetLang(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                      >
                        <option value="en">Inglés (Global Destination Weddings)</option>
                        <option value="fr">Francés (Haute Couture Gala)</option>
                        <option value="de">Alemán (Premium Events)</option>
                        <option value="it">Italiano (Lirica & Romantic)</option>
                        <option value="pt">Portugués (Iberia)</option>
                        <option value="ja">Japonés (Luxury Destination)</option>
                      </select>
                    </div>
                  </div>

                  {/* Opciones de Audio y Voz */}
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Voz de Locución / Doblador Clonado
                    </label>
                    <select
                      value={dubVoiceId}
                      onChange={e => setDubVoiceId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                    >
                      {EAR_VOICE_PROFILES.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.tone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={syncLips}
                        onChange={e => setSyncLips(e.target.checked)}
                        className="rounded border-[#262638] bg-[#050507] text-[#00E5FF] focus:ring-0"
                      />
                      Sincronización Labial AI (Lip-Sync Neural)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={preserveMusic}
                        onChange={e => setPreserveMusic(e.target.checked)}
                        className="rounded border-[#262638] bg-[#050507] text-[#00E5FF] focus:ring-0"
                      />
                      Preservar Música y Pistas de Fondo
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleDubVideo}
                  disabled={isDubbingVideo}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#0099FF] text-[#050507] font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#00E5FF]/20 hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDubbingVideo ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Procesando Doblaje Multilingüe en GPU Local...
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4" />
                      Iniciar Doblaje Zero-Shot sobre Vídeo
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Resultado de Doblaje */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-xl border border-[#1A1A24] bg-[#09090F] space-y-5">
                <div className="flex items-center justify-between border-b border-[#1A1A24] pb-4">
                  <div className="flex items-center gap-2">
                    <Film className="w-5 h-5 text-[#00E5FF]" />
                    <h3 className="font-bold text-white text-base">Salida Cinematográfica</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                    MP4 H.265 / WebM
                  </span>
                </div>

                {dubbingResult ? (
                  <div className="space-y-4">
                    <div className="aspect-video w-full rounded-lg bg-black overflow-hidden border border-[#222230] relative flex items-center justify-center">
                      <video
                        src={dubbingResult.dubbedVideoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-[#050507] border border-[#1A1A24] text-xs font-mono space-y-2">
                      <div className="flex justify-between text-zinc-400">
                        <span>Proyecto:</span>
                        <span className="text-white truncate max-w-[200px]">{dubbingResult.videoTitle}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Traducción:</span>
                        <span className="text-[#00E5FF] uppercase font-bold">{dubbingResult.sourceLanguage} → {dubbingResult.targetLanguage}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Tiempo de Procesado:</span>
                        <span className="text-white">{dubbingResult.processingTimeMs} ms</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Estado:</span>
                        <span className="text-[#10B981] font-bold">COMPLETADO</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={dubbingResult.dubbedVideoUrl}
                        download
                        className="flex-1 py-2.5 rounded-lg bg-[#00E5FF] hover:bg-[#00cbe3] text-[#050507] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Descargar Vídeo Doblado
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#12121A] border border-[#222230] mx-auto flex items-center justify-center text-zinc-500">
                      <Video className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-zinc-400 font-medium">Ningún vídeo doblado todavía</p>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                      Selecciona las pistas de vídeo y pulsa el botón de doblaje para procesar con VoiceStudio localmente.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 3: VOICE GALLERY & DAEMON LOCAL (RX 7900 XTX)                      */}
        {/* ========================================================================= */}
        {activeTab === 'SERVER' && (
          <div className="space-y-8">
            {/* Telemetría Hardware */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-[#1A1A24] bg-[#09090F] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>HARDWARE ACCELERATION</span>
                  <Cpu className="w-4 h-4 text-[#FF2B44]" />
                </div>
                <h3 className="text-lg font-bold text-white font-mono">AMD Radeon RX 7900 XTX</h3>
                <p className="text-xs text-zinc-400">
                  24 GB VRAM • RDNA3 • ROCm / DirectML Habilitado
                </p>
                <div className="pt-2">
                  <div className="w-full h-1.5 rounded-full bg-[#1A1A24] overflow-hidden">
                    <div className="w-2/3 h-full bg-[#FF2B44] rounded-full" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 mt-1 block">Headroom VRAM: 8.4 GB</span>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-[#1A1A24] bg-[#09090F] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>VOICE STUDIO DAEMON</span>
                  <Radio className="w-4 h-4 text-[#ecb613]" />
                </div>
                <h3 className="text-lg font-bold text-white font-mono">http://127.0.0.1:8080</h3>
                <p className="text-xs text-zinc-400">
                  REST API • SSE WebSocket • OpenAI Audio Compatible
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                    Status: {serverStatus.connected ? 'ONLINE' : 'STANDBY LAUNCHER'}
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-[#1A1A24] bg-[#09090F] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>MODELOS ACTIVOS</span>
                  <Zap className="w-4 h-4 text-[#10B981]" />
                </div>
                <h3 className="text-lg font-bold text-white font-mono">ZeroShot-XTTS-v2</h3>
                <p className="text-xs text-zinc-400">
                  StyleTTS2 Spanish • Whisper Large Dubbing
                </p>
                <div className="pt-2">
                  <span className="text-xs font-mono text-zinc-400">646 Idiomas sin coste de API</span>
                </div>
              </div>
            </div>

            {/* Lanzador Directo y Guía de Operación */}
            <div className="p-6 rounded-xl border border-[#222230] bg-[#09090F] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#ecb613]" />
                  Lanzador Local de VoiceStudio (INICIAR_VOICE_STUDIO.bat)
                </h3>
                <p className="text-xs text-zinc-400">
                  Si el daemon no está corriendo, puedes ejecutar el script bat en la raíz del proyecto para descargar e iniciar VoiceStudio automáticamente.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={refreshHealth}
                  className="px-4 py-2.5 rounded-lg border border-[#262638] bg-[#12121A] hover:border-zinc-500 text-xs font-mono text-zinc-200 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Verificar Conexión
                </button>
                <a
                  href="https://voicestudio.sh"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-[#ecb613] hover:bg-[#d9a40e] text-[#050507] font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  Documentación Oficial VoiceStudio
                </a>
              </div>
            </div>

            {/* Galería de Perfiles Vocales de Productora EAR */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Mic2 className="w-5 h-5 text-[#ecb613]" />
                Perfiles de Voz Registrados en Productora EAR
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {EAR_VOICE_PROFILES.map(profile => (
                  <div
                    key={profile.id}
                    className="p-6 rounded-xl border border-[#1A1A24] bg-[#09090F] space-y-4 relative overflow-hidden"
                  >
                    {profile.isMasterProfile && (
                      <div className="absolute top-0 right-0 px-3 py-1 bg-[#ecb613] text-[#050507] font-mono text-[9px] font-bold rounded-bl-lg">
                        MASTER PROFILE
                      </div>
                    )}
                    <div>
                      <h4 className="text-base font-bold text-white">{profile.name}</h4>
                      <p className="text-xs text-[#ecb613] font-mono mt-0.5">{profile.artist} • {profile.language}</p>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {profile.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {profile.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-[#12121A] border border-[#222230] text-[10px] font-mono text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {profile.sampleAudio && (
                      <div className="pt-2">
                        <audio controls src={profile.sampleAudio} className="w-full h-8" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
