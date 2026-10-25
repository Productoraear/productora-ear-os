"use client";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SovereignArtistCard — Conector de Roster Europeo (artistaseuropa.com)
 * ════════════════════════════════════════════════════════════════════════════
 * Tarjeta cinemática OLED para Artistas Diamante Rojo. Expone:
 *   1. Badge visible "Roster Oficial ArtistasEuropa.com // Océano Azul".
 *   2. Reproductor de muestra de audio en 1-clic (HTML5 Audio + onda sonora).
 *   3. Split Soberano explícito: 80% Artista / 10% EAR OS / 10% VIMUME.
 *   4. CTAs de contratación directa: despacho swarm lead (role SOVEREIGN_ARTIST)
 *      vía `/api/dispatch/swarm-lead` + enlace WhatsApp con fianza deducible.
 * Cero `any` implícito. Todo precio/split nace del SSOT @/lib/constants/ear-os-ssot.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  ShieldCheck,
  Award,
  Gem,
  ChevronRight,
  CheckCircle2,
  Zap,
  Waves,
  MessageCircle,
  Loader2,
  Star,
  Music2,
  Sparkles,
} from "lucide-react";
import {
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
} from "@/lib/constants/ear-os-ssot";
import { CENTRALITA } from "@/lib/phone-constants";
import {
  type SovereignArtistId,
  type SovereignArtistItem,
  SOVEREIGN_ARTISTS_ROSTER,
} from "@/lib/constants/sovereign-artists-roster";

export {
  type SovereignArtistId,
  type SovereignArtistItem,
  SOVEREIGN_ARTISTS_ROSTER,
};

export interface SovereignArtistCardProps {
  readonly artist: SovereignArtistItem;
  readonly highlight?: boolean;
}

interface SwarmLeadResponse {
  readonly success: boolean;
  readonly leadId?: string;
  readonly error?: string;
}

type DispatchState = "idle" | "pending" | "success" | "error";

/* ─── Constantes derivadas del SSOT (inmutables, cero hardcodeo) ─── */

const SPLIT_ARTISTA_PCT: number = Math.round(SPLIT_SOBERANO.artista * 100);
const SPLIT_EAROS_PCT: number = Math.round(SPLIT_SOBERANO.earOs * 100);
const SPLIT_VIMUME_PCT: number = Math.round(SPLIT_SOBERANO.vimume * 100);

const ARTISTASEUROPA_HREF = "https://artistaseuropa.com";

/* ─── Helper: construcción del enlace WhatsApp precargado ─── */

function buildWhatsAppLeadUrl(artist: SovereignArtistItem): string {
  const message =
    `Hola ${CENTRALITA.display} 👋 — Quiero contratar EN DIRECTO a *${artist.name}* ` +
    `(${artist.role}) del Roster Oficial ArtistasEuropa.com.\n\n` +
    `🎤 Formato: Diamante Rojo · Océano Azul\n` +
    `💶 Tarifa base: ${artist.basePrice} €\n` +
    `🔒 Fianza congelada: ${DEPOSITO_STRIPE_EUR} € (100% deducible del total)\n` +
    `🤝 Split Soberano: ${SPLIT_ARTISTA_PCT}% Artista / ${SPLIT_EAROS_PCT}% EAR OS / ${SPLIT_VIMUME_PCT}% VIMUME\n\n` +
    `Fecha del evento y localidad por confirmar. ¡Gracias!`;
  return `${CENTRALITA.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Tarjeta cinemática OLED para un Artista Diamante Rojo del Roster Oficial
 * ArtistasEuropa.com. Añade muestra de audio 1-clic, desglose Split Soberano
 * y doble CTA de contratación (Swarm Lead + WhatsApp).
 */
export default function SovereignArtistCard({
  artist,
  highlight = false,
}: SovereignArtistCardProps): React.JSX.Element {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [dispatchState, setDispatchState] = useState<DispatchState>("idle");
  const [leadId, setLeadId] = useState<string | null>(null);

  /* ─── Limpieza del recurso de audio al desmontar ─── */
  useEffect(() => {
    return () => {
      if (audioRef.current !== null) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  /* ─── Manejadores de audio ─── */
  const toggleAudio = useCallback((): void => {
    const audio = audioRef.current;
    if (audio === null) {
      return;
    }
    if (isPlaying) {
      audio.pause();
    } else {
      void audio.play();
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback((): void => {
    const audio = audioRef.current;
    if (audio === null) {
      return;
    }
    if (audio.duration > 0) {
      setProgress(audio.currentTime / audio.duration);
    }
  }, []);

  const handleLoadedMetadata = useCallback((): void => {
    const audio = audioRef.current;
    if (audio !== null) {
      setDuration(audio.duration);
    }
  }, []);

  /* ─── Despacho Swarm Lead (no bloqueante) ─── */
  const dispatchSwarmLead = useCallback(async (): Promise<void> => {
    setDispatchState("pending");
    try {
      const response = await fetch("/api/dispatch/swarm-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "SOVEREIGN_ARTIST",
          clientName: artist.name,
          clientPhone: CENTRALITA.raw,
          eventDate: "A confirmar — Roster ArtistasEuropa.com",
          location: "Por determinar",
          guestsPax: 1,
          budgetEur: artist.basePrice,
          technicalNotes:
            `Diamante Rojo / Océano Azul · ${artist.signature} · ` +
            `Split 80/10/10 · Fianza ${DEPOSITO_STRIPE_EUR} € deducible.`,
        }),
      });

      const data: SwarmLeadResponse = (await response.json()) as SwarmLeadResponse;
      if (data.success === true) {
        setDispatchState("success");
        setLeadId(data.leadId ?? null);
      } else {
        setDispatchState("error");
      }
    } catch {
      setDispatchState("error");
    }
  }, [artist]);

  const whatsAppUrl = useMemo(() => buildWhatsAppLeadUrl(artist), [artist]);

  const splitBarStyle = useMemo(
    () => ({
      gridTemplateColumns: `${SPLIT_ARTISTA_PCT}% ${SPLIT_EAROS_PCT}% ${SPLIT_VIMUME_PCT}%`,
    }),
    [],
  );

  const waveBars = useMemo(() => Array.from({ length: 16 }, (_, i) => i), []);

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border backdrop-blur-md transition-all duration-300 ease-out will-change-transform ${
        highlight
          ? "border-[#FF2B44]/50 bg-[#09090d]/90 shadow-[0_0_60px_-18px_rgba(255,43,68,0.45)]"
          : "border-white/10 bg-[#09090d]/80"
      }`}
    >
      {/* Halo radial superior (capa decorativa OLED) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,43,68,0.18),transparent_70%)] blur-2xl"
      />

      {/* Badge Roster Oficial ArtistasEuropa.com */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/5 px-5 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF2B44]/40 bg-[#FF2B44]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#FF2B44]">
          <Gem size={12} aria-hidden="true" />
          Roster Oficial ArtistasEuropa.com
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300">
          <Waves size={12} aria-hidden="true" />
          Océano Azul
        </span>
      </div>

      <div className="relative z-10 grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* ── Columna visual: imagen + onda sonora ── */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artist.image}
              alt={`Retrato oficial de ${artist.name}`}
              loading="lazy"
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {artist.verified && (
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 backdrop-blur-sm">
                <ShieldCheck size={12} aria-hidden="true" />
                Auditado
              </span>
            )}
          </div>

          {/* Reproductor de muestra de audio 1-clic */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
            <button
              type="button"
              data-cta="true"
              onClick={toggleAudio}
              aria-pressed={isPlaying}
              aria-label={
                isPlaying
                  ? `Pausar muestra de ${artist.name}`
                  : `Escuchar muestra de ${artist.name}`
              }
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 ease-out hover:bg-white/20"
            >
              {isPlaying ? (
                <>
                  <Pause size={14} aria-hidden="true" />
                  Pausar muestra
                </>
              ) : (
                <>
                  <Play size={14} aria-hidden="true" />
                  Escuchar muestra 1-clic
                </>
              )}
            </button>

            {/* Onda sonora animada */}
            <div
              className="flex h-8 items-end justify-center gap-0.5"
              aria-hidden="true"
            >
              {waveBars.map((bar) => (
                <motion.span
                  key={bar}
                  className={`w-1 rounded-full ${
                    isPlaying ? "bg-[#FF2B44]" : "bg-white/20"
                  }`}
                  animate={
                    isPlaying
                      ? { height: [4, 16 + (bar % 5) * 3, 4] }
                      : { height: 6 + (bar % 4) * 2 }
                  }
                  transition={
                    isPlaying
                      ? {
                          duration: 0.8 + (bar % 4) * 0.12,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      : { duration: 0.3 }
                  }
                />
              ))}
            </div>

            {/* Barra de progreso */}
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#FF2B44] transition-[width] duration-200 ease-linear"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-right font-mono text-[10px] text-white/40">
              {duration > 0 ? `${duration.toFixed(0)} s` : "Muestra oficial"}
            </div>

            <audio
              ref={audioRef}
              src={artist.audioSample}
              preload="none"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </div>
        </div>

        {/* ── Columna de información y CTA ── */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-syne text-2xl font-black uppercase leading-tight text-white">
              {artist.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-white/70">{artist.role}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-amber-300">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={13}
                  aria-hidden="true"
                  className={
                    i < Math.round(artist.rating)
                      ? "fill-amber-300"
                      : "fill-transparent"
                  }
                />
              ))}
              <span className="font-mono text-white/50">
                {artist.rating.toFixed(1)} · {artist.reviews} reseñas
              </span>
            </div>
          </div>

          {/* Géneros */}
          <div className="flex flex-wrap gap-1.5">
            {artist.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Firma distintiva */}
          <p className="text-sm leading-relaxed text-white/60">
            <Sparkles
              size={14}
              className="mr-1 inline text-[#FF2B44]"
              aria-hidden="true"
            />
            {artist.signature}
          </p>

          {/* Precio SSOT + fianza */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                  Tarifa base SSOT
                </span>
                <div className="font-mono text-2xl font-bold text-white">
                  {artist.basePrice}
                  <span className="text-base text-white/60"> €</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                  Fianza deducible
                </span>
                <div className="font-mono text-lg font-bold text-emerald-300">
                  {DEPOSITO_STRIPE_EUR} €
                </div>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-white/50">
              100% deducible del total del show · Stripe Price-Lock SHA-256.
            </p>
          </div>

          {/* Split Soberano 80/10/10 */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Award size={14} className="text-amber-300" aria-hidden="true" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/70">
                Split Soberano
              </span>
            </div>
            <div
              className="grid w-full overflow-hidden rounded-lg text-center font-mono text-[11px] font-bold"
              style={splitBarStyle}
            >
              <span className="bg-[#FF2B44]/80 py-1.5 text-white">
                {SPLIT_ARTISTA_PCT}%
              </span>
              <span className="bg-amber-400/80 py-1.5 text-black">
                {SPLIT_EAROS_PCT}%
              </span>
              <span className="bg-cyan-400/80 py-1.5 text-black">
                {SPLIT_VIMUME_PCT}%
              </span>
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-white/50">
              <span>Artista</span>
              <span>EAR OS</span>
              <span>VIMUME</span>
            </div>
          </div>

          {/* CTAs: Contratación Directa */}
          <div className="mt-auto space-y-2">
            <button
              type="button"
              data-cta="true"
              data-pulse="true"
              onClick={dispatchSwarmLead}
              disabled={dispatchState === "pending"}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF2B44] py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF2B44]/25 transition-all duration-300 ease-out hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {dispatchState === "pending" ? (
                <>
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  Despachando…
                </>
              ) : (
                <>
                  <Zap size={15} aria-hidden="true" />
                  Contratación Directa
                </>
              )}
            </button>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Contactar por WhatsApp a ${artist.name}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 py-3 text-sm font-bold uppercase tracking-wider text-emerald-300 transition-all duration-300 ease-out hover:bg-emerald-400/20"
            >
              <MessageCircle size={15} aria-hidden="true" />
              WhatsApp · Fianza {DEPOSITO_STRIPE_EUR} €
            </a>
          </div>

          {/* Feedback del despacho Swarm */}
          <AnimatePresence>
            {dispatchState === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300"
              >
                <CheckCircle2 size={14} aria-hidden="true" />
                Lead despachado al Swarm AI
                {leadId !== null && (
                  <span className="truncate font-mono text-[10px] text-emerald-300/70">
                    #{leadId.slice(0, 10)}
                  </span>
                )}
              </motion.div>
            )}
            {dispatchState === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-xl border border-[#FF2B44]/30 bg-[#FF2B44]/10 px-3 py-2 text-xs text-[#FF2B44]"
              >
                No se pudo despachar el lead. Usa el enlace de WhatsApp directo.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Enlace al satélite ArtistasEuropa.com */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/5 px-5 py-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/40">
          <Music2 size={12} aria-hidden="true" />
          Satélite del Roster Europeo
        </span>
        <Link
          href={ARTISTASEUROPA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 transition-colors duration-200 hover:text-cyan-200"
        >
          artistaseuropa.com
          <ChevronRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}




