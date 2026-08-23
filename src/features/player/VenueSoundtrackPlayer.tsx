"use client";

import React, { useState, useRef } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  ShieldCheckIcon, 
  SparklesIcon,
  MusicalNoteIcon,
  BuildingStorefrontIcon,
  CheckBadgeIcon,
  ArrowUpTrayIcon,
  DocumentCheckIcon,
  DocumentArrowDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { UniversalCueBridge, CueSessionReport } from '@/lib/UniversalCueBridge';
import { CueSheetGenerator, ProofOfPlayCertificate, VenueMetadata } from '@/lib/cue-sheet-generator';

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

const DEFAULT_VENUE: VenueMetadata = {
  venueName: 'Finca La Concepción (Marbella)',
  venueNif: 'B-29884102',
  address: 'Ctra. de Istán km 2',
  city: 'Marbella (Málaga)',
  gpsCoordinates: '36.5101,-4.8824',
  ownerEmail: 'eventos@fincalaconcepcion.com',
  licenseNumber: 'LIC-EAR-2026-098'
};

export const VenueSoundtrackPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>(VENUE_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  // Cue Bridge State
  const [cueReport, setCueReport] = useState<CueSessionReport | null>(null);
  const [certificate, setCertificate] = useState<ProofOfPlayCertificate | null>(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const report = UniversalCueBridge.parse(content, file.name);
        setCueReport(report);
        
        // Auto-generate Proof-of-Play Certificate
        setIsGeneratingCert(true);
        const cert = await CueSheetGenerator.generateCertificate(report, DEFAULT_VENUE);
        setCertificate(cert);
        setIsGeneratingCert(false);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadCertificate = () => {
    if (!certificate) return;
    const html = CueSheetGenerator.renderPrintableHtml(certificate);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.focus();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-[#050505] text-zinc-100 font-sans">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-br from-zinc-900 via-black to-[#050505] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <BuildingStorefrontIcon className="w-4 h-4" />
              SaaS B2B Music Licensor & Universal Cue Bridge
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-syne">
              Reproductor B2B para <span className="text-cyan-400">Fincas & Discotecas</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Catálogo musical exclusivo 100% libre de conflictos SGAE con parser universal de historiales DJ y emisión instantánea de actas de ejecución con firma SHA-256.
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

      {/* 🎧 UNIVERSAL CUE BRIDGE MODULE (REKORDBOX, SERATO, TRAKTOR, VIRTUALDJ) */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-[#ecb613]/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <DocumentCheckIcon className="w-4 h-4" />
              Universal Cue Bridge Engine
            </div>
            <h3 className="text-2xl font-bold text-white font-syne">
              Auditor Forense de Sesiones DJ & Proof of Play
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Arrastra tu historial de <strong className="text-zinc-200">Rekordbox (.txt, .xml)</strong>, <strong className="text-zinc-200">Serato (.csv)</strong>, <strong className="text-zinc-200">Traktor (.nml)</strong> o <strong className="text-zinc-200">VirtualDJ (.m3u)</strong> para generar el certificado firmado con SHA-256.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".txt,.csv,.xml,.nml,.m3u,.m3u8" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 bg-[#ecb613] hover:bg-[#d4a855] text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-[#ecb613]/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              Cargar Historial DJ
            </button>
          </div>
        </div>

        {/* CUE REPORT & CERTIFICATE PREVIEW */}
        {cueReport && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono">
              <div>
                <span className="text-zinc-500 uppercase block text-[10px]">Software Detectado</span>
                <span className="text-white font-bold text-sm">{cueReport.softwareDetected}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block text-[10px]">Total Temas Sonados</span>
                <span className="text-[#ecb613] font-bold text-sm">{cueReport.totalTracks} Obras</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block text-[10px]">Duración Total</span>
                <span className="text-zinc-300 font-bold text-sm">{cueReport.totalDurationFormatted}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase block text-[10px]">Recinto Auditado</span>
                <span className="text-cyan-400 font-bold text-sm">{DEFAULT_VENUE.venueName}</span>
              </div>
            </div>

            {certificate && (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                    <CheckBadgeIcon className="w-4 h-4" />
                    <span>Certificado Emitido: {certificate.certificateId}</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono">
                    Firma SHA-256: <code className="text-[#ecb613]">{certificate.sha256Proof.substring(0, 24)}...</code>
                  </p>
                </div>

                <button
                  onClick={handleDownloadCertificate}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  Descargar Acta Oficial SGAE/AIE
                </button>
              </div>
            )}

            {/* TRACKLIST PARSED TABLE */}
            <div className="max-h-60 overflow-y-auto rounded-xl border border-white/5 bg-black/40">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/5 text-zinc-400 text-[10px] uppercase sticky top-0">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Título</th>
                    <th className="p-3">Artista</th>
                    <th className="p-3">Duración</th>
                    <th className="p-3">Formato</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {cueReport.tracks.map((t) => (
                    <tr key={t.orderIndex} className="hover:bg-white/[0.02]">
                      <td className="p-3 text-zinc-500">{t.orderIndex}</td>
                      <td className="p-3 font-bold text-white">{t.title}</td>
                      <td className="p-3 text-[#d4a855]">{t.artist}</td>
                      <td className="p-3 text-zinc-400">{t.durationFormatted || '3:00'}</td>
                      <td className="p-3 text-zinc-500">{t.sourceFormat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
