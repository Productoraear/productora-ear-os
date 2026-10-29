import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Cake,
  CheckCircle2,
  Heart,
  Lock,
  MessageCircle,
  Mic2,
  Music2,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import {
  EDWIN_SHOWCASE_ADVANTAGES,
  EDWIN_SHOWCASE_OFFICE,
  EDWIN_SHOWCASE_PACKS,
  EDWIN_SHOWCASE_TERMS,
  EDWIN_SHOWCASE_TIERS,
  EDWIN_SHOWCASE_VERTICALS,
  formatEur,
  type EdwinShowcaseIconKey,
} from '@/lib/artists/edwin-showcase-catalog';
import {
  MUNDO_DEL_MARIACHI_CHAPTERS,
  MUNDO_DEL_MARIACHI_REPERTOIRE,
} from '@/lib/constants/mundo-del-mariachi-archive';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ESCAPARATE S-CLASS — EDWIN AGUDELO
 * ════════════════════════════════════════════════════════════════════════════
 * Server Component puro (cero JavaScript al cliente). Absorbe el escaparate
 * histórico 2009-2024 y lo reinyecta sobre el motor SSOT:
 *
 *  · 9 verticales con destino REAL (cada `href` existe en el App Router)
 *  · 4 ventajas competitivas
 *  · 2 packs "¿Qué incluye?"
 *  · 4 escalones de formato derivados de `MARIACHI_FORMATS`
 *  · Condiciones canónicas (100 € · 1,50 €/km desde km 50 · 12 W/pax · RC)
 *  · Oficina de representación con canal único (centralita SSOT)
 *
 * Reglas duras: sin `any`, sin `w-screen`, sin precios literales, sin teléfonos
 * huérfanos. Todos los importes provienen de `edwin-showcase-catalog`.
 * ════════════════════════════════════════════════════════════════════════════
 */

const ICONS: Readonly<Record<EdwinShowcaseIconKey, React.ReactNode>> = Object.freeze({
  cake: <Cake size={22} className="text-[#ecb613]" aria-hidden="true" />,
  heart: <Heart size={22} className="text-[#ecb613]" aria-hidden="true" />,
  sparkles: <Sparkles size={22} className="text-[#ecb613]" aria-hidden="true" />,
  users: <Users size={22} className="text-[#ecb613]" aria-hidden="true" />,
  award: <Award size={22} className="text-[#ecb613]" aria-hidden="true" />,
  video: <Video size={22} className="text-[#ecb613]" aria-hidden="true" />,
  music: <Music2 size={22} className="text-[#ecb613]" aria-hidden="true" />,
  solista: <Mic2 size={22} className="text-[#ecb613]" aria-hidden="true" />,
});

const WHATSAPP_ESCAPARATE: string = `${CENTRALITA.whatsapp}?text=${encodeURIComponent(
  'Hola Edwin, vengo del escaparate de tu ficha de artista. Quiero fecha, formato y presupuesto cerrado.',
)}`;

const CARD_CLASS: string =
  'group relative flex h-full flex-col justify-between rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#ecb613]/40 hover:bg-[#0d0d12] hover:shadow-[0_18px_45px_-18px_rgba(236,182,19,0.45)]';


/* 1 · Cabecera del escaparate */
function EscaparateHeader(): React.JSX.Element {
  return (
    <header className="mx-auto max-w-3xl space-y-4 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#ecb613]">
        <Sparkles size={13} aria-hidden="true" />
        Escaparate oficial · {EDWIN_SHOWCASE_VERTICALS.length} verticales
      </span>
      <h2
        id="escaparate-edwin-title"
        className="font-syne text-3xl font-black uppercase tracking-tight text-white sm:text-4xl md:text-5xl"
      >
        Todo lo que Edwin Agudelo <span className="italic text-[#ecb613]">pone en escena</span>
      </h2>
      <p className="text-sm font-light leading-relaxed text-zinc-400 md:text-base">
        Serenatas, bodas, quince años, canción de autor, vídeo dedicado y espectáculo ecuestre.
        Cada vertical tiene su página, su repertorio y su precio sellado en el mismo motor: sin
        presupuestos que cambian al llegar al evento.
      </p>
    </header>
  );
}

/* 2 · Rejilla de los 9 verticales (destino real en cada tarjeta) */
function EscaparateVerticales(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {EDWIN_SHOWCASE_VERTICALS.map((vertical) => (
        <article key={vertical.id} className={CARD_CLASS}>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-transform duration-300 ease-out group-hover:scale-110">
                {ICONS[vertical.iconKey]}
              </span>
              <span className="rounded-full border border-[#ecb613]/20 bg-[#ecb613]/10 px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-widest text-[#ecb613]">
                {vertical.badge}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-syne text-xl font-black uppercase leading-tight tracking-tight text-white">
                {vertical.title}
              </h3>
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#ecb613]">
                {vertical.priceLabel}
              </p>
            </div>

            <p className="text-xs leading-relaxed text-zinc-400">{vertical.pitch}</p>

            <ul className="space-y-2 border-t border-white/5 pt-4">
              {vertical.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[11px] text-zinc-300">
                  <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#ecb613]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {vertical.repertoire !== null && (
              <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                <span className="block font-mono text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                  Repertorio & estilo
                </span>
                <span className="mt-1 block font-mono text-[10px] italic text-[#ecb613]">
                  {vertical.repertoire}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-white/5 pt-4">
            <Link
              href={vertical.href}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-all duration-300 ease-out hover:border-[#ecb613]/60 hover:bg-[#ecb613] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <span>{vertical.ctaLabel}</span>
              <ArrowRight size={13} className="transition-transform duration-300 ease-out group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
/* 3 · Ventajas competitivas absorbidas del bloque histórico */
function EscaparateVentajas(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#ecb613]">
          Por qué se contrata a Edwin
        </span>
        <h3 className="font-syne text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
          Cuatro garantías que <span className="text-[#ecb613]">no se negocian</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {EDWIN_SHOWCASE_ADVANTAGES.map((advantage, index) => (
          <article
            key={advantage.id}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#ecb613]/40 hover:shadow-[0_18px_45px_-18px_rgba(236,182,19,0.4)]"
          >
            <span className="font-mono text-[10px] font-black tracking-[0.3em] text-[#ecb613]/60">
              0{index + 1}
            </span>
            <h4 className="mt-3 font-syne text-sm font-black uppercase leading-snug tracking-tight text-white">
              {advantage.title}
            </h4>
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">{advantage.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

/* 4 · Packs "¿Qué incluye?" (solista vs grupo de mariachis) */
function EscaparatePacks(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#ecb613]">
          Qué incluye exactamente
        </span>
        <h3 className="font-syne text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
          Dos formas de <span className="text-[#ecb613]">entrar en la fiesta</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {EDWIN_SHOWCASE_PACKS.map((pack) => (
          <article
            key={pack.id}
            className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:shadow-[0_18px_45px_-18px_rgba(236,182,19,0.4)] sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="font-syne text-lg font-black uppercase tracking-tight text-white">
                  {pack.title}
                </h4>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {pack.subtitle}
                </p>
              </div>
              <span className="rounded-xl border border-[#ecb613]/30 bg-[#ecb613]/10 px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-wider text-[#ecb613]">
                {pack.priceLabel}
              </span>
            </div>
            <ul className="mt-5 grid grid-cols-1 gap-2 border-t border-white/5 pt-5 sm:grid-cols-2">
              {pack.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[11px] text-zinc-300">
                  <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[#ecb613]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
/* 5 · Escalones de formato (precios derivados de MARIACHI_FORMATS) */
function EscaparateEscalones(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#ecb613]">
          Escalones de formato
        </span>
        <h3 className="font-syne text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
          Del solista al <span className="text-[#ecb613]">Mariachi Monumental</span>
        </h3>
        <p className="text-xs font-light leading-relaxed text-zinc-400">
          Tarifas certificadas en el configurador con Price-Lock SHA-256. La base solista sellada
          es de {formatEur(EDWIN_SHOWCASE_TERMS.tarifaBaseEur)} y la logística se calcula por GPS
          desde el hub, nunca después.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {EDWIN_SHOWCASE_TIERS.map((tier) => (
          <article
            key={tier.id}
            className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#ecb613]/40 hover:shadow-[0_18px_45px_-18px_rgba(236,182,19,0.45)]"
          >
            <div className="space-y-2">
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500">
                {tier.members} {tier.members === 1 ? 'músico' : 'músicos'}
              </span>
              <h4 className="font-syne text-base font-black uppercase leading-tight tracking-tight text-white">
                {tier.name}
              </h4>
              <p className="text-[11px] leading-relaxed text-zinc-400">{tier.recommendedFor}</p>
            </div>
            <Link
              href="/reservar/solista"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-all duration-300 ease-out hover:border-[#ecb613]/60 hover:bg-[#ecb613] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <span>Ver precio certificado</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

/* 6 · Condiciones canónicas del motor (todo desde el SSOT sellado) */
function EscaparateCondiciones(): React.JSX.Element {
  const conditions: readonly { readonly label: string; readonly value: string }[] = [
    { label: 'Depósito Price-Lock', value: `${formatEur(EDWIN_SHOWCASE_TERMS.depositoEur)} deducible` },
    {
      label: 'Logística',
      value: `${EDWIN_SHOWCASE_TERMS.precioKm}/km desde el km ${EDWIN_SHOWCASE_TERMS.kmExentos}`,
    },
    {
      label: `Hotel +${formatEur(EDWIN_SHOWCASE_TERMS.hotelEur)}`,
      value: `Fin ≥ 03:00 o más de ${EDWIN_SHOWCASE_TERMS.kmHotel} km`,
    },
    { label: 'Presión sonora', value: `${EDWIN_SHOWCASE_TERMS.wattsPerPax} W/pax` },
    { label: 'Póliza RC', value: formatEur(EDWIN_SHOWCASE_TERMS.seguroRcEur) },
    {
      label: 'Split soberano',
      value: `${EDWIN_SHOWCASE_TERMS.splitArtistaPct}/${EDWIN_SHOWCASE_TERMS.splitEarOsPct}/${EDWIN_SHOWCASE_TERMS.splitVimumePct}`,
    },
  ];

  return (
    <div className="rounded-3xl border border-[#ecb613]/20 bg-[#09090d]/80 p-6 backdrop-blur-md sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <Lock size={14} className="text-[#ecb613]" aria-hidden="true" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#ecb613]">
          Condiciones verificadas por el motor
        </span>
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {conditions.map((condition) => (
          <div key={condition.label} className="space-y-1">
            <dt className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              {condition.label}
            </dt>
            <dd className="text-xs font-bold text-white">{condition.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
/* 7 · Oficina de representación con canal único (cero leads huérfanos) */
function EscaparateOficina(): React.JSX.Element {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4 lg:max-w-xl">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#ecb613]">
            Oficina de representación
          </span>
          <h3 className="font-syne text-2xl font-black uppercase leading-tight tracking-tight text-white md:text-3xl">
            Un solo canal. <span className="text-[#ecb613]">Cero leads perdidos.</span>
          </h3>
          <p className="text-xs font-light leading-relaxed text-zinc-400">
            Toda solicitud —particular, finca, empresa o institución— entra por la misma
            centralita y queda registrada con referencia y sello de precio. Nadie tiene que
            perseguir a nadie.
          </p>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EDWIN_SHOWCASE_OFFICE.map((role) => (
              <li
                key={role.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:bg-white/[0.07]"
              >
                <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-[#ecb613]">
                  {role.role}
                </span>
                <span className="mt-1 block font-syne text-sm font-black uppercase tracking-tight text-white">
                  {role.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-80">
          <a
            href={CENTRALITA.tel}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ecb613] px-5 py-3.5 font-mono text-[11px] font-black uppercase tracking-wider text-black transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#f5c93a] hover:shadow-[0_18px_45px_-12px_rgba(236,182,19,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
          >
            <Phone size={14} aria-hidden="true" />
            {CENTRALITA.display}
          </a>
          <a
            href={WHATSAPP_ESCAPARATE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 font-mono text-[11px] font-black uppercase tracking-wider text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#ecb613]/60 hover:bg-[#0d0d12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
          >
            <MessageCircle size={14} className="text-[#ecb613]" aria-hidden="true" />
            WhatsApp directo
          </a>
          <p className="flex items-start gap-1.5 font-mono text-[9px] uppercase leading-relaxed tracking-wider text-zinc-500">
            <ShieldCheck size={11} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true" />
            Depósito {formatEur(EDWIN_SHOWCASE_TERMS.depositoEur)} deducible al 100% · bloqueo atómico de fecha
          </p>
        </div>
      </div>
    </div>
  );
}

/* 8 · Archivo histórico: repertorio canónico y cultura del mariachi */
function EscaparateRepertorio(): React.JSX.Element {
  return (
    <section aria-labelledby="escaparate-repertorio-title" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#ecb613]">
            <Music2 size={13} aria-hidden="true" />
            Archivo histórico · El Mundo del Mariachi
          </span>
          <h3
            id="escaparate-repertorio-title"
            className="font-syne text-2xl font-black uppercase tracking-tight text-white sm:text-3xl"
          >
            Repertorio canónico de boda y serenata
          </h3>
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-zinc-400">
            {MUNDO_DEL_MARIACHI_REPERTOIRE.length} temas canónicos y {MUNDO_DEL_MARIACHI_CHAPTERS.length}{' '}
            capítulos de conocimiento: historia de la ranchera, traje de gala, botonaduras de plata e
            instrumentos acústicos.
          </p>
        </div>
        <Link
          href="/mariachis#mundo-del-mariachi"
          className="inline-flex items-center gap-2 rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 px-5 py-3 font-mono text-[10px] font-black uppercase tracking-wider text-[#ecb613] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#ecb613]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
        >
          Ver archivo completo
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {MUNDO_DEL_MARIACHI_REPERTOIRE.slice(0, 12).map((song) => (
          <li
            key={song.id}
            className="rounded-2xl border border-white/10 bg-[#09090d]/80 p-3 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#ecb613]/40"
          >
            <span className="block truncate font-syne text-xs font-bold text-white">{song.title}</span>
            <span className="block truncate font-mono text-[9px] uppercase tracking-wider text-zinc-500">
              {song.composer}
            </span>
          </li>
        ))}
      </ul>

      <div className="grid gap-3 md:grid-cols-2">
        {MUNDO_DEL_MARIACHI_CHAPTERS.map((chapter) => (
          <article
            key={chapter.id}
            className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-5 backdrop-blur-md transition-all duration-300 ease-out hover:border-[#ecb613]/30"
          >
            <h4 className="font-syne text-sm font-black uppercase tracking-tight text-white">
              {chapter.title}
            </h4>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#ecb613]">
              {chapter.tagline}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">{chapter.body[0]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * Escaparate público del artista insignia. Server Component: se renderiza en el
 * servidor, viaja como HTML y no envía ni un byte de JavaScript al navegador.
 */
export function EdwinEscaparateSClass(): React.JSX.Element {
  return (
    <section
      id="escaparate"
      aria-labelledby="escaparate-edwin-title"
      className="relative w-full overflow-x-hidden bg-[#030305] py-20"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(236,182,19,0.10),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-7xl space-y-20 px-4 md:px-8">
        <EscaparateHeader />
        <EscaparateVerticales />
        <EscaparateVentajas />
        <EscaparatePacks />
        <EscaparateEscalones />
        <EscaparateCondiciones />
        <EscaparateRepertorio />
        <EscaparateOficina />
      </div>
    </section>
  );
}

export default EdwinEscaparateSClass;



