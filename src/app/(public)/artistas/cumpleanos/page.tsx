import React from 'react';
import type { Metadata } from 'next';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { Sparkles, Smile, ArrowRight, Calendar, Music2 } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

export const metadata: Metadata = generateArtistSEOMeta('cumpleaños', 'España');

interface BirthdayFact {
  readonly label: string;
  readonly value: string;
}

interface BirthdayRepertoireItem {
  readonly title: string;
  readonly duration: string;
  readonly note: string;
}

const BIRTHDAY_FACTS: readonly BirthdayFact[] = [
  { label: 'Duración del set', value: '45 min' },
  { label: 'Repertorio base', value: '18 rancheras' },
  { label: 'Formato', value: 'Trío · Cuarteto · Mariachi' },
  { label: 'Cobertura', value: 'Madrid · Barcelona · Valencia' },
];

const BIRTHDAY_REPERTOIRE: readonly BirthdayRepertoireItem[] = [
  {
    title: 'Las Mañanitas',
    duration: '3:20',
    note: 'Apertura tradicional con trompeta y violín en primer plano.',
  },
  {
    title: 'El Rey',
    duration: '2:55',
    note: 'Ranchera de José Alfredo Jiménez para el brindis central.',
  },
  {
    title: 'Cielito Lindo',
    duration: '3:05',
    note: 'Cierre coral con invitados y palmas sincronizadas.',
  },
];

const BIRTHDAY_LOGISTICS: readonly string[] = [
  'Confirmación de dirección y hora exacta 48 h antes del evento.',
  'Prueba de sonido de 20 min previa al inicio del show.',
  'Coordinación con pastel y velas para el momento de la dedicatoria.',
  'Setlist ajustable en el momento según el ambiente de la sala.',
];

export default function ArtistasCumpleanosPage(): React.JSX.Element {
  const schema = generateEventSchema('cumpleaños', 'España');

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-36 sm:pt-40 pb-24 font-sans antialiased selection:bg-[#ecb613]/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20">
        {/* Hero */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 flex items-center gap-1.5 font-mono transition-all duration-300 ease-out hover:bg-[#ecb613]/15 hover:border-[#ecb613]/40 hover:shadow-[0_0_20px_-6px_rgba(236,182,19,0.5)]">
              <Smile size={12} aria-hidden="true" /> Celebración Familiar
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              BIRTHDAY SERENADES
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne leading-none">
            Mariachis para Cumpleaños &amp; Fiestas
          </h1>
          <p className="text-white/40 text-base sm:text-lg italic leading-relaxed">
            Set de 45 minutos con &quot;Las Mañanitas&quot; en directo, 18 rancheras de repertorio base y coordinación con pastel y velas para la dedicatoria central.
          </p>

          {/* CTA principal */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href="#reservar"
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#ecb613] text-[#030305] text-[11px] font-black uppercase tracking-[0.2em] font-mono transition-all duration-300 ease-out hover:bg-[#f5c93a] hover:shadow-[0_0_40px_-8px_rgba(236,182,19,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <Calendar size={14} aria-hidden="true" />
              Reservar fecha
              <ArrowRight
                size={14}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              />
            </a>
            <a
              href="#repertorio"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/5 text-white text-[11px] font-black uppercase tracking-[0.2em] font-mono border border-white/10 transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/25 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.25)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <Music2
                size={14}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:rotate-12"
              />
              Ver repertorio
            </a>
          </div>
        </section>

        {/* Datos operativos */}
        <section
          aria-label="Datos operativos del servicio"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        >
          {BIRTHDAY_FACTS.map((fact) => (
            <div
              key={fact.label}
              className="group bg-[#0b0b0b] border border-white/5 rounded-2xl p-4 sm:p-5 space-y-1.5 transition-all duration-300 ease-out hover:border-[#ecb613]/30 hover:bg-[#0d0d0d] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(236,182,19,0.25)]"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 font-mono transition-colors duration-300 group-hover:text-[#ecb613]/70">
                {fact.label}
              </p>
              <p className="text-sm sm:text-base font-black text-white font-syne tracking-tight">
                {fact.value}
              </p>
            </div>
          ))}
        </section>

        {/* Dynamic Content */}
        <section
          id="repertorio"
          className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-16 grid md:grid-cols-2 gap-8 sm:gap-12 items-start transition-all duration-500 ease-out hover:border-white/10 hover:shadow-[0_20px_60px_-30px_rgba(236,182,19,0.15)]"
        >
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-syne">
              Rancheras y Alegría en Directo
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Repertorio base de 18 rancheras con apertura en &quot;Las Mañanitas&quot;, brindis con &quot;El Rey&quot; y cierre coral con &quot;Cielito Lindo&quot;. El setlist se ajusta en el momento según el ambiente de la sala.
            </p>
            <ul className="space-y-2.5 pt-2">
              {BIRTHDAY_LOGISTICS.map((item) => (
                <li
                  key={item}
                  className="group flex items-start gap-2.5 text-white/60 text-xs leading-relaxed transition-colors duration-300 hover:text-white/85"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#ecb613] transition-all duration-300 ease-out group-hover:scale-150 group-hover:shadow-[0_0_8px_rgba(236,182,19,0.8)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="group/card bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 transition-all duration-500 ease-out hover:bg-white/[0.07] hover:border-white/20 hover:shadow-[0_20px_50px_-25px_rgba(236,182,19,0.2)]">
            <Sparkles
              className="text-[#ecb613] transition-transform duration-500 ease-out group-hover/card:rotate-12 group-hover/card:scale-110"
              size={32}
              aria-hidden="true"
            />
            <h3 className="text-lg font-black uppercase">Setlist destacado</h3>
            <ul className="space-y-3">
              {BIRTHDAY_REPERTOIRE.map((track) => (
                <li
                  key={track.title}
                  className="group border-b border-white/5 last:border-b-0 pb-3 last:pb-0 space-y-1 transition-colors duration-300 hover:border-[#ecb613]/20"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-black text-white font-syne tracking-tight transition-colors duration-300 group-hover:text-[#ecb613]">
                      {track.title}
                    </span>
                    <span className="text-[10px] font-mono text-white/40 tabular-nums transition-colors duration-300 group-hover:text-white/70">
                      {track.duration}
                    </span>
                  </div>
                  <p className="text-white/40 text-[11px] leading-relaxed transition-colors duration-300 group-hover:text-white/60">
                    {track.note}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ArtistPricingMatrix />
        <ArtistTestimonials />
      </div>
    </main>
  );
}