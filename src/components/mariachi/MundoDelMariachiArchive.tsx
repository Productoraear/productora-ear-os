import Link from 'next/link';
import {
  BookOpen,
  Music,
  Sparkles,
  ShieldCheck,
  Landmark,
  PhoneCall,
  MessageCircle,
  CheckCircle2,
  Disc,
} from 'lucide-react';
import {
  MUNDO_DEL_MARIACHI_ARCHIVE_META,
  MUNDO_DEL_MARIACHI_CHAPTERS,
  MUNDO_DEL_MARIACHI_INSTRUMENTS,
  MUNDO_DEL_MARIACHI_OCCASION_LABELS,
  MUNDO_DEL_MARIACHI_REQUESTABLE_EXTRAS,
  groupMundoDelMariachiRepertoire,
  type MariachiSongCategory,
} from '@/lib/constants/mundo-del-mariachi-archive';

/** Acento cromático por familia estilística (un solo tono dominante por bloque). */
const CATEGORY_ACCENT: Readonly<Record<MariachiSongCategory, string>> = Object.freeze({
  bolero: 'text-[#ecb613] border-[#ecb613]/25 bg-[#ecb613]/5',
  ranchera: 'text-[#FF2B44] border-[#FF2B44]/20 bg-[#FF2B44]/5',
  huapango: 'text-[#00E5FF] border-[#00E5FF]/20 bg-[#00E5FF]/5',
  popular: 'text-amber-200 border-amber-200/20 bg-amber-200/5',
  clasico: 'text-emerald-300 border-emerald-300/20 bg-emerald-300/5',
});

/**
 * ARCHIVO HISTÓRICO — «EL MUNDO DEL MARIACHI».
 *
 * Server Component puro (cero `"use client"`): el conocimiento viaja en el HTML
 * para SEO y para lectores sin JavaScript. Las interacciones se resuelven con
 * enlaces ancla y `<details>` nativos, sin hidratación.
 */
export default function MundoDelMariachiArchive() {
  const groups = groupMundoDelMariachiRepertoire();
  const meta = MUNDO_DEL_MARIACHI_ARCHIVE_META;

  return (
    <section
      id="mundo-del-mariachi"
      className="w-full overflow-x-hidden scroll-mt-28 space-y-12"
      aria-labelledby="mundo-del-mariachi-title"
    >
      {/* CABECERA DEL ARCHIVO */}
      <header className="relative rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#ecb613]/10 blur-[120px] pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
            <BookOpen size={13} />
            Archivo histórico · {meta.canonicalThemes} temas canónicos
          </span>
          <h2
            id="mundo-del-mariachi-title"
            className="font-syne text-3xl sm:text-4xl font-black uppercase text-white tracking-tight"
          >
            El Mundo del Mariachi
          </h2>
          <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed max-w-3xl">
            Repertorio, historia, indumentaria e instrumentos del género rescatados para la
            Centralita Nacional. Un archivo vivo: cada tema puede reservarse con precio cerrado y
            cada boda puede diseñar su secuencia musical completa.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px] font-mono">
            <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3">
              <span className="block text-[#ecb613] text-lg font-bold">{meta.canonicalThemes}</span>
              <span className="text-white/50 uppercase tracking-wider">Temas de boda</span>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3">
              <span className="block text-[#ecb613] text-lg font-bold">
                {MUNDO_DEL_MARIACHI_CHAPTERS.length}
              </span>
              <span className="text-white/50 uppercase tracking-wider">Capítulos</span>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3">
              <span className="block text-[#ecb613] text-lg font-bold">
                {MUNDO_DEL_MARIACHI_INSTRUMENTS.length}
              </span>
              <span className="text-white/50 uppercase tracking-wider">Instrumentos</span>
            </div>
            <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3">
              <span className="block text-[#ecb613] text-lg font-bold">100 %</span>
              <span className="text-white/50 uppercase tracking-wider">Copy original</span>
            </div>
          </div>
        </div>
      </header>

      {/* REPERTORIO CANÓNICO AGRUPADO POR FAMILIA */}
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
              Repertorio canónico
            </span>
            <h3 className="font-syne text-2xl sm:text-3xl font-black uppercase text-white">
              Los 24 temas que sostienen una boda
            </h3>
          </div>
          <p className="text-xs font-mono text-white/40 max-w-sm">
            Selección editable: el cliente puede intercambiar cualquier tema por otro del catálogo
            a la carta sin coste adicional.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div
              key={group.category}
              className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-5 sm:p-6 space-y-4 transition-all duration-300 ease-out hover:border-[#ecb613]/30"
            >
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-syne text-lg font-bold uppercase text-white">{group.label}</h4>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                  {group.songs.length} temas
                </span>
              </div>
              <ol className="space-y-2">
                {group.songs.map((song) => (
                  <li
                    key={song.id}
                    className="rounded-2xl bg-white/[0.02] border border-white/5 p-3 flex flex-wrap items-center justify-between gap-2 transition-all duration-300 ease-out hover:bg-white/[0.05]"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                      <p className="text-[11px] font-mono text-white/45 truncate">{song.composer}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {song.occasions.slice(0, 2).map((occasion) => (
                        <span
                          key={occasion}
                          className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${CATEGORY_ACCENT[group.category]}`}
                        >
                          {MUNDO_DEL_MARIACHI_OCCASION_LABELS[occasion]}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* CATÁLOGO A LA CARTA */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
            <Disc size={13} />
            A la carta
          </div>
          <p className="text-sm text-white/70 leading-relaxed max-w-3xl">
            Temas muy solicitados que no forman parte del núcleo de 24 pero se interpretan sin
            recargo cuando el cliente los pide con antelación.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MUNDO_DEL_MARIACHI_REQUESTABLE_EXTRAS.map((song) => (
              <li
                key={song.id}
                className="rounded-2xl bg-white/[0.02] border border-white/5 p-3 transition-all duration-300 ease-out hover:border-[#ecb613]/30"
              >
                <p className="text-sm font-semibold text-white">{song.title}</p>
                <p className="text-[11px] font-mono text-white/45">{song.composer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CAPÍTULOS DE CONOCIMIENTO */}
      <div className="space-y-8">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
            <Landmark size={13} />
            Conocimiento verificado
          </span>
          <h3 className="font-syne text-2xl sm:text-3xl font-black uppercase text-white">
            Historia, indumentaria e instrumentos
          </h3>
          <p className="text-sm text-white/60 max-w-3xl leading-relaxed">
            Cuatro capítulos para entender por qué un mariachi de gala no es un disfraz ni un
            altavoz: es una tradición con protocolo, técnica y oficio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MUNDO_DEL_MARIACHI_CHAPTERS.map((chapter) => (
            <article
              key={chapter.id}
              className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-4 transition-all duration-300 ease-out hover:border-[#ecb613]/30"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/25 text-[#ecb613]">
                  <Music size={18} />
                </span>
                <div className="space-y-1">
                  <h4 className="font-syne text-xl font-bold uppercase text-white leading-tight">
                    {chapter.title}
                  </h4>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-[#ecb613]">
                    {chapter.tagline}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {chapter.body.map((paragraph, index) => (
                  <p key={`${chapter.id}-${index}`} className="text-xs sm:text-sm text-white/65 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
                {chapter.facts.map((fact) => (
                  <div key={fact.label} className="rounded-2xl bg-white/[0.02] border border-white/5 p-3">
                    <dt className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                      {fact.label}
                    </dt>
                    <dd className="text-[11px] text-white/80 leading-snug">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>

      {/* INSTRUMENTOS ACÚSTICOS */}
      <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
              <Sparkles size={13} />
              Ficha técnica
            </span>
            <h3 className="font-syne text-xl sm:text-2xl font-black uppercase text-white">
              Los cinco pilares acústicos
            </h3>
          </div>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
            Sin amplificación obligatoria
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MUNDO_DEL_MARIACHI_INSTRUMENTS.map((instrument) => (
            <div
              key={instrument.id}
              className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 space-y-2 transition-all duration-300 ease-out hover:bg-white/[0.05] hover:border-[#ecb613]/25"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-white">{instrument.name}</h4>
                <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/25 text-[#ecb613]">
                  {instrument.family}
                </span>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/45">
                {instrument.role}
                {typeof instrument.strings === 'number' ? ` · ${instrument.strings} cuerdas` : ''}
              </p>
              <p className="text-[11px] text-white/60 leading-relaxed">{instrument.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROCEDENCIA, CONTACTO OFICIAL Y CTA */}
      <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
              <ShieldCheck size={13} />
              Procedencia y contacto oficial
            </span>
            <h3 className="font-syne text-xl sm:text-2xl font-black uppercase text-white">
              Archivo reconstruido, contacto verificado
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              {meta.legalNote} Estado del rescate: <strong className="text-white/80">{meta.retrievalStatus}</strong>.
              Los buzones antiguos del dominio histórico se declaran irrecuperables y quedan
              excluidos del código.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/mariachis#cotizador-uber"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#ecb613] hover:bg-amber-300 text-black font-mono text-xs uppercase font-bold tracking-wider transition-all duration-300 ease-out shadow-lg shadow-[#ecb613]/20"
            >
              <BookOpen size={14} />
              Diseñar mi repertorio
            </Link>
            <a
              href={`https://wa.me/${meta.officialLineRaw.replace('+', '')}?text=${encodeURIComponent('Hola, quiero diseñar el repertorio de mi evento con la Centralita Nacional de Mariachis.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 ease-out"
            >
              <MessageCircle size={14} className="text-emerald-400" />
              Hablar con la Centralita
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono">
          <a
            href={`tel:${meta.officialLineRaw}`}
            className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 space-y-1 transition-all duration-300 ease-out hover:border-[#ecb613]/30"
          >
            <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-white/40">
              <PhoneCall size={11} className="text-[#ecb613]" />
              Línea oficial
            </span>
            <span className="block text-sm text-white">{meta.officialLine}</span>
          </a>
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-white/40">Correo soberano</span>
            <span className="block text-sm text-white break-all">{meta.officialEmail}</span>
          </div>
          <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-white/40">Base logística</span>
            <span className="block text-sm text-white">{meta.baseLabel}</span>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/55">
          <li className="flex items-start gap-2">
            <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-400" />
            <span>Originales pesados fuera de Git en {meta.imagePolicy.heavyArchivePath}.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-400" />
            <span>
              Solo se publican derivados {meta.imagePolicy.format.toUpperCase()} menores de{' '}
              {meta.imagePolicy.maxKilobytes} KB en {meta.imagePolicy.publishedPath}.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}


