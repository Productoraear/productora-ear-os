'use client';

import React, { useRef, useState } from 'react';
import {
  CalendarCheck,
  Clock,
  MapPin,
  MessageCircle,
  Pause,
  Phone,
  Play,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  TARIFA_BASE_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';

/** Foto oficial de Edwin Agudelo (avatar del CEO ya referenciado en el layout). */
const EDWIN_PHOTO_PRIMARY =
  'https://lh3.googleusercontent.com/a/ACg8ocJF7O8ZaJG4WsLPfVaVe5f5Gmu80nOoea2teuOAs-s9sq53uNk=s800-c';
const EDWIN_PHOTO_FALLBACK = '/images/brand/ear_logo_official_diamond.png';

/** Escena cinemática de mariachi al atardecer (activo real de la marca). */
const HERO_IMAGE = '/images/banana/mariachi_gala_sunset.jpg';

/** Muestra de voz REAL de Edwin disponible hoy en el repo. */
const REAL_VOICE_SAMPLE = '/media/edwin/podcast-cumpleanos-edwin.m4a';

interface AudioPill {
  id: string;
  label: string;
  /** Pista dedicada; se reproduce cuando el CEO la deposite en /public/media/edwin/. */
  src: string;
}

/**
 * 3 píldoras de repertorio. Cada una intenta su pista dedicada y, si aún no
 * existe, cae automáticamente a la muestra real de voz de Edwin (cero fachadas:
 * el reproductor nativo siempre emite audio real).
 */
const AUDIO_PILLS: AudioPill[] = [
  { id: 'ave-maria', label: 'Ave María', src: '/media/edwin/ave-maria.m4a' },
  { id: 'bolero', label: 'Bolero', src: '/media/edwin/bolero.m4a' },
  { id: 'mariachi', label: 'Mariachi', src: '/media/edwin/mariachi.m4a' },
];

function toLocalIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function defaultWeddingDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return toLocalIsoDate(d);
}

function normalizePhone(raw: string): string {
  let clean = raw.trim().replace(/[^\d+]/g, '');
  if (clean.startsWith('00')) clean = `+${clean.slice(2)}`;
  return clean;
}

export function HeroWeddingCinematic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackAppliedRef = useRef(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [photoSrc, setPhotoSrc] = useState<string>(EDWIN_PHOTO_PRIMARY);
  const [eventDate, setEventDate] = useState<string>(defaultWeddingDate);
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const todayIso = toLocalIsoDate(new Date());

  const togglePill = (pill: AudioPill) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playingId === pill.id) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    fallbackAppliedRef.current = false;
    audio.src = pill.src;
    audio.play().catch(() => undefined);
    setPlayingId(pill.id);
  };

  const handleAudioError = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!fallbackAppliedRef.current) {
      fallbackAppliedRef.current = true;
      audio.src = REAL_VOICE_SAMPLE;
      audio.play().catch(() => undefined);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!eventDate) {
      setFormError('Elige la fecha de tu boda para comprobar disponibilidad.');
      return;
    }

    const phone = normalizePhone(whatsapp);
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15) {
      setFormError('Introduce un WhatsApp válido (9-15 dígitos, ej. +34 600 000 000).');
      return;
    }

    try {
      fetch('https://n8n.productoraear.com/webhook/call-center-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'home_hero_date_lock_request',
          leadType: 'boda_solista_edwin',
          source: 'home_hero_cinematic',
          eventDate,
          phone,
          basePriceEur: TARIFA_BASE_SOLISTA_EUR,
          depositEur: DEPOSITO_STRIPE_EUR,
          createdAt: new Date().toISOString(),
        }),
      }).catch(() => undefined);
    } catch {
      /* fire-and-forget: el flujo principal no debe bloquearse jamás */
    }

    const message = encodeURIComponent(
      `Hola Edwin 👋 Quiero comprobar disponibilidad para mi boda.\n📅 Fecha: ${eventDate}\n📱 Mi WhatsApp: ${phone}\n🎤 Servicio: Voz Lírica y Mariachi en Directo (desde ${TARIFA_BASE_SOLISTA_EUR} €)`,
    );
    window.open(`https://wa.me/34693693048?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative w-full overflow-x-hidden py-8 sm:py-12 lg:py-16">
      {/* Audio nativo flotante (oculto; gobernado por las píldoras) */}
      <audio
        ref={audioRef}
        onError={handleAudioError}
        onEnded={() => setPlayingId(null)}
        onPause={() => setPlayingId(null)}
        preload="none"
        className="hidden"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ═══ COLUMNA VISUAL: escena cinemática + Polaroid + píldoras de audio ═══ */}
          <div className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#09090d] shadow-2xl">
              <img
                src={HERO_IMAGE}
                alt="Mariachi y voz lírica en directo al atardecer para tu boda"
                className="h-72 w-full object-cover sm:h-96 lg:h-[520px]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[#ecb613]/40 bg-black/70 px-3 py-1.5 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ecb613]" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ecb613]">
                  Directo · Toledo &amp; Madrid
                </span>
              </div>
            </div>

            {/* Polaroid + audición flotante */}
            <div className="relative z-10 -mt-14 mx-3 rounded-3xl border border-white/10 bg-[#09090d]/90 p-5 shadow-2xl backdrop-blur-md sm:mx-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <figure className="w-28 shrink-0 -rotate-3 self-center rounded-lg bg-white p-2 pb-3 shadow-xl transition-transform duration-300 ease-out hover:rotate-0 hover:scale-105">
                  <img
                    src={photoSrc}
                    alt="Edwin Agudelo, tenor y voz lírica"
                    className="h-24 w-full rounded bg-[#050507] object-cover text-neutral-200"
                    referrerPolicy="no-referrer"
                    onError={() => setPhotoSrc(EDWIN_PHOTO_FALLBACK)}
                  />
                  <figcaption className="mt-1.5 text-center font-mono text-[10px] font-bold text-zinc-800">
                    Edwin Agudelo · Tenor
                  </figcaption>
                </figure>

                <div className="min-w-0 flex-1">
                  <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#ecb613]">
                    <Volume2 size={12} aria-hidden="true" />
                    Audición real de la voz de Edwin
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {AUDIO_PILLS.map((pill) => {
                      const active = playingId === pill.id;
                      return (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => togglePill(pill)}
                          aria-pressed={active}
                          aria-label={`Escuchar píldora ${pill.label}`}
                          className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-xs font-bold transition-all duration-300 ease-out ${
                            active
                              ? 'border-[#ecb613] bg-[#ecb613] text-black shadow-[0_0_18px_rgba(236,182,19,0.35)]'
                              : 'border-white/15 bg-white/5 text-white hover:border-[#ecb613]/60 hover:bg-white/10'
                          }`}
                        >
                          {active ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
                          {pill.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-neutral-200 font-medium">
                    Ave María · Bolero · Mariachi — repertorio de gala en directo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ COLUMNA DE CONVERSIÓN: titular + precio + formulario ═══ */}
          <div className="order-1 lg:order-2">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-200">
              <ShieldCheck size={12} className="text-[#ecb613]" aria-hidden="true" />
              Reserva sin riesgo · Garantía de reembolso 100% en 24h
            </p>

            <h1 className="font-syne text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl xl:text-5xl">
              Música de Película para tu Boda{' '}
              <span className="bg-gradient-to-r from-[#ecb613] to-[#f5c538] bg-clip-text text-transparent">
                · Voz Lírica y Mariachi en Directo
              </span>
            </h1>

            <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-neutral-200 sm:text-base">
              La voz de Edwin Agudelo para tu ceremonia, cóctel y serenata, sin intermediarios
              y con acústica homologada para tu finca o salón.
            </p>

            {/* Precio en el primer milímetro */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/5 px-4 py-3">
              <span className="font-syne text-2xl font-extrabold text-[#ecb613]">
                Desde {TARIFA_BASE_SOLISTA_EUR} €
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-200 font-medium">
                Sonido Bose F1 y Microfonía Axient incluidos
              </span>
            </div>

            {/* Formulario de conversión (2 campos) */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 backdrop-blur-md sm:p-6"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-200">
                    <CalendarCheck size={12} aria-hidden="true" /> Fecha de Boda
                  </span>
                  <input
                    type="date"
                    value={eventDate}
                    min={todayIso}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/20 bg-black/60 px-3 py-3 font-sans text-sm text-white outline-none transition-colors focus:border-[#ecb613]"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-200">
                    <Phone size={12} aria-hidden="true" /> Tu WhatsApp
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+34 600 000 000"
                    required
                    className="w-full rounded-xl border border-white/20 bg-black/60 px-3 py-3 font-sans text-sm text-white placeholder-neutral-400 outline-none transition-colors focus:border-[#ecb613]"
                  />
                </label>
              </div>

              {formError && (
                <p className="mt-3 rounded-xl border border-red-500/40 bg-red-950/60 px-3 py-2 font-mono text-xs text-red-200">
                  ⚠️ {formError}
                </p>
              )}

              <button
                type="submit"
                className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#ecb613] px-6 py-3 font-mono text-sm font-black uppercase tracking-wide text-black shadow-[0_0_30px_rgba(236,182,19,0.35)] transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#f5c538] active:scale-[0.98]"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Bloquear mi Fecha sin Riesgo
              </button>

              <p className="mt-2.5 text-center font-mono text-[10px] text-neutral-300 font-medium">
                Garantía Reembolso 100% en 24h · Depósito {DEPOSITO_STRIPE_EUR} € 100% deducible del total
              </p>
            </form>

            {/* Micro-confianza */}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-neutral-300 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} className="text-[#ecb613]" aria-hidden="true" />
                Respuesta WhatsApp &lt; 10 min
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={12} className="text-[#ecb613]" aria-hidden="true" />
                Hub Méntrida · {CENTRALITA_EAR_OS}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

