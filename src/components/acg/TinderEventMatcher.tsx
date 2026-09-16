"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Heart, X, Info, Play, Pause, Sparkles, Volume2 } from 'lucide-react';
import type { AcgState, AcgAction } from '@/lib/acg/acgDecisionEngine';
import {
  ACG_ARTIST_OFFERS,
  DECISION_STEPS,
  getSelectedArtist,
} from '@/lib/acg/acgDecisionEngine';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';

interface TinderEventMatcherProps {
  state: AcgState;
  dispatch: React.Dispatch<AcgAction>;
}

/**
 * Fuente de audio REAL del catálogo EAR OS (no simulada).
 * Se precarga en <audio> para arranque en caliente (<0,2 s percibido).
 */
const AUDIO_SOURCE = '/media/edwin/podcast-cumpleanos-edwin.m4a';

export default function TinderEventMatcher({ state, dispatch }: TinderEventMatcherProps) {
  const selectedArtist = getSelectedArtist(state.match.selectedArtistId);
  const selectedFinca = SCLASS_12_FINCAS_HOMOLOGADAS.find((f) => f.id === state.finca.fincaId);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isArtistCompatible = useMemo(() => {
    if (!selectedFinca) return true;
    if (selectedArtist.musiciansCount > 2 && selectedFinca.capacidadMaxPax < 200) return false;
    if (selectedFinca.capacidadMaxPax > 280 && selectedArtist.splCompatible) return true;
    return true;
  }, [selectedArtist, selectedFinca]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      void audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleLike = () => {
    dispatch({ type: 'SELECT_ARTIST', payload: selectedArtist.id });
    dispatch({ type: 'LIKE_PROVIDER', payload: selectedArtist.id });
    dispatch({ type: 'GO_NEXT' });
  };

  const handleReject = () => {
    dispatch({ type: 'REJECT_PROVIDER', payload: selectedArtist.id });
    const currentIndex = ACG_ARTIST_OFFERS.findIndex((a) => a.id === selectedArtist.id);
    const nextIndex = (currentIndex + 1) % ACG_ARTIST_OFFERS.length;
    dispatch({ type: 'SELECT_ARTIST', payload: ACG_ARTIST_OFFERS[nextIndex].id });
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Tarjeta principal swipe */}
      <div className="lg:col-span-7 flex items-start justify-center">
        <div className="relative w-full max-w-md rounded-3xl bg-[#050507] border border-[#FF2B44]/30 overflow-hidden shadow-[0_30px_80px_rgba(255,43,68,0.15)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF2B44] to-transparent" />

          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-syne text-2xl font-black text-white tracking-tight">{selectedArtist.name}</p>
                <p className="font-mono text-xs text-[#FF2B44] font-bold uppercase tracking-widest">{selectedArtist.formatLabel}</p>
              </div>
              <span className="px-3 py-1 bg-[#FF2B44]/10 border border-[#FF2B44]/30 text-[#FF2B44] rounded-full font-mono text-xs font-bold">
                {selectedArtist.basePriceEur} €
              </span>
            </div>

            <p className="font-body text-sm text-white/60 leading-relaxed">{selectedArtist.tagline}</p>

            {/* Ficha técnica */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="block font-mono text-[10px] text-white/40 uppercase">Músicos</span>
                <span className="font-mono text-lg text-white font-bold">{selectedArtist.musiciansCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <span className="block font-mono text-[10px] text-white/40 uppercase">Finca destino</span>
                <span className="font-mono text-xs text-white font-bold truncate">{selectedFinca?.name ?? 'Sin finca'}</span>
              </div>
            </div>

            {/* Reproductor audio caliente */}
            <div className="p-4 rounded-xl bg-[#0a0a0d] border border-white/10 flex items-center gap-3">
              <button
                type="button"
                onClick={toggleAudio}
                className="w-11 h-11 rounded-xl bg-[#FF2B44] text-white flex items-center justify-center hover:shadow-[0_0_25px_rgba(255,43,68,0.5)] transition-all shrink-0"
                aria-label={isPlaying ? 'Pausar fragmento de audio' : 'Reproducir fragmento de audio'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Volume2 size={12} className="text-[#FF2B44]" /> Fragmento en caliente
                </p>
                <p className="font-mono text-xs text-white/70 truncate">Edwin Agudelo · Podcast Cumpleaños</p>
              </div>
              <audio ref={audioRef} src={AUDIO_SOURCE} preload="auto" onEnded={() => setIsPlaying(false)} />
            </div>

            {/* Aviso de compatibilidad acústica */}
            <div className={`p-3 rounded-xl border flex items-start gap-2 ${isArtistCompatible ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-[#FF2B44]/40 bg-[#FF2B44]/5'}`}>
              <Info size={15} className={isArtistCompatible ? 'text-emerald-400 shrink-0 mt-0.5' : 'text-[#FF2B44] shrink-0 mt-0.5'} />
              <p className="font-mono text-[11px] leading-relaxed text-white/70">
                {isArtistCompatible
                  ? 'Match acústico compatible: rider aprobado para la finca seleccionada.'
                  : 'Formato con exigencia de aforo o acústica incompatible. Recomendamos Solista o Dúo.'}
              </p>
            </div>

            {/* Acciones swipe */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleReject}
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                aria-label="Descartar artista"
              >
                <X size={24} />
              </button>
              <button
                type="button"
                onClick={handleLike}
                className="w-16 h-16 rounded-full bg-[#FF2B44] text-white hover:shadow-[0_0_40px_rgba(255,43,68,0.6)] transition-all flex items-center justify-center scale-105"
                aria-label="Seleccionar artista"
              >
                <Heart size={28} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Columna contexto */}
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-2xl bg-[#050507] border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-[#FF2B44]" />
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Event Matcher · Doble opt-in</span>
          </div>
          <p className="font-body text-sm text-white/60 leading-relaxed mb-4">
            Selecciona el formato que mejor sintonice con tu finca y aforo. Al darle
            <span className="text-[#FF2B44] font-bold"> like</span> se activa el Split Soberano y las fechas recomendadas.
          </p>
          <div className="space-y-2">
            {ACG_ARTIST_OFFERS.map((offer) => {
              const active = offer.id === selectedArtist.id;
              const liked = state.match.likedProviderIds.includes(offer.id);
              return (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => dispatch({ type: 'SELECT_ARTIST', payload: offer.id })}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    active
                      ? 'border-[#FF2B44]/50 bg-[#FF2B44]/10'
                      : 'border-white/10 bg-black/30 hover:border-white/30'
                  }`}
                >
                  <div className="text-left">
                    <span className={`block font-syne text-sm font-bold ${active ? 'text-white' : 'text-white/70'}`}>{offer.name}</span>
                    <span className="block font-mono text-[10px] text-white/40 uppercase">{offer.formatLabel}</span>
                  </div>
                  <span className={`font-mono text-sm font-bold ${active ? 'text-[#FF2B44]' : 'text-white/50'}`}>
                    {liked ? '❤' : `${offer.basePriceEur} €`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-[#050507] border border-white/10 p-6">
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">Telemetría de match</p>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between"><span className="text-white/50">Likes emitidos</span><span className="text-white">{state.match.likedProviderIds.length}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Descartados</span><span className="text-white">{state.match.rejectedProviderIds.length}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Etapa</span><span className="text-[#FF2B44]">{DECISION_STEPS[state.currentStepIndex].label}</span></div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'GO_NEXT' })}
          className="w-full py-4 rounded-xl bg-[#FF2B44] text-white font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(255,43,68,0.5)] transition-all"
        >
          Confirmar match · Siguiente
        </button>
      </div>
    </div>
  );
}