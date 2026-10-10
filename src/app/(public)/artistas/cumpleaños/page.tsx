import React from 'react';
import type { Metadata } from 'next';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { Sparkles, Smile, Music2, Clock, Users, Calendar, ArrowRight, Phone } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

export const metadata: Metadata = generateArtistSEOMeta('cumpleaños', 'España');

interface BirthdayFact {
  readonly icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}

const BIRTHDAY_FACTS: readonly BirthdayFact[] = [
  {
    icon: Music2,
    label: 'Repertorio',
    value: '120+ canciones',
    detail: 'Rancheras, boleros, cumbias y "Las Mañanitas" en versión mariachi tradicional.',
  },
  {
    icon: Clock,
    label: 'Duración estándar',
    value: '45 min por set',
    detail: 'Bloques configurables de 30, 45 o 60 minutos según el guion de la fiesta.',
  },
  {
    icon: Users,
    label: 'Formato',
    value: 'Trío a mariachi completo',
    detail: 'Desde 3 músicos para espacios íntimos hasta 8 para salones grandes.',
  },
  {
    icon: Calendar,
    label: 'Antelación',
    value: '48 h mínimo',
    detail: 'Reservas de fin de semana se cierran con 5 a 7 días de anticipación.',
  },
];

interface ShowTimelineItem {
  readonly step: string;
  readonly title: string;
  readonly body: string;
}

const SHOW_TIMELINE: readonly ShowTimelineItem[] = [
  {
    step: '01',
    title: 'Llegada y montaje',
    body: 'El equipo arriba 30 minutos antes para afinar instrumentos y coordinar con el anfitrión el momento exacto de la entrada.',
  },
  {
    step: '02',
    title: 'Entrada sorpresa',
    body: 'Arranque con "Las Mañanitas" en el instante acordado: al cortar la tarta, al apagar velas o al brindis.',
  },
  {
    step: '03',
    title: 'Set principal',
    body: 'Bloque de 45 minutos con rancheras, boleros y cumbias adaptado al público presente (familia, amigos, mixto).',
  },
  {
    step: '04',
    title: 'Dedicatorias y cierre',
    body: 'Canciones a petición del homenajeado y cierre con tema bailable para abrir la pista.',
  },
];

export default function ArtistasCumpleañosPage(): React.JSX.Element {
  const schema = generateEventSchema('cumpleaños', 'España');

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24 font-sans antialiased selection:bg-[#ecb613]/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Hero */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 flex items-center gap-1.5 transition-all duration-300 hover:bg-[#ecb613]/15 hover:border-[#ecb613]/40 hover:shadow-[0_0_20px_-4px_rgba(236,182,19,0.4)]">
              <Smile size={12} aria-hidden={true} /> Celebración Familiar
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              BIRTHDAY SERENADES
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Mariachis para Cumpleaños &amp; Fiestas
          </h1>
          <p className="text-white/40 text-lg italic leading-relaxed">
            Serenata de cumpleaños con mariachi en vivo: entrada con &quot;Las Mañanitas&quot;, set de 45 minutos y dedicatorias a petición. Cobertura en toda España.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <a
              href="#reservar"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ecb613] text-[#030305] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:bg-[#f5c93a] hover:shadow-[0_0_30px_-6px_rgba(236,182,19,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="relative z-10">Reservar serenata</span>
              <ArrowRight
                size={14}
                aria-hidden={true}
                className="relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              />
            </a>
            <a
              href="#datos-cumpleanos"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:bg-white/[0.06] hover:border-white/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <Phone
                size={13}
                aria-hidden={true}
                className="text-[#ecb613] transition-transform duration-300 ease-out group-hover:rotate-12 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
              />
              Ver detalles
            </a>
          </div>
        </section>

        {/* Datos operativos reales */}
        <section aria-labelledby="datos-cumpleanos" className="space-y-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h2
              id="datos-cumpleanos"
              className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white font-syne"
            >
              Datos del servicio
            </h2>
            <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.25em] font-mono">
              ESPAÑA · 2025
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BIRTHDAY_FACTS.map((fact) => {
              const Icon = fact.icon;
              return (
                <article
                  key={fact.label}
                  className="group bg-[#0b0b0b] border border-white/5 rounded-3xl p-6 space-y-3 transition-all duration-300 ease-out hover:border-[#ecb613]/30 hover:bg-[#0d0d0d] hover:-translate-y-1 hover:shadow-[0_10px_40px_-12px_rgba(236,182,19,0.25)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <Icon
                    size={22}
                    className="text-[#ecb613] transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
                    aria-hidden={true}
                  />
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 font-mono transition-colors duration-300 group-hover:text-white/60">
                    {fact.label}
                  </p>
                  <p className="text-xl font-black text-white font-syne tracking-tight">
                    {fact.value}
                  </p>
                  <p className="text-white/50 text-xs leading-relaxed transition-colors duration-300 group-hover:text-white/70">
                    {fact.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Guion del show */}
        <section className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-10 md:p-16 grid md:grid-cols-2 gap-12 items-start transition-colors duration-500 hover:border-white/10">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">
              Guion del show de cumpleaños
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Estructura fija de cuatro fases que se ajusta al minuto con el anfitrión. Sin improvisaciones en la entrada: la sorpresa se cronometra con la tarta y las velas.
            </p>
            <div className="group bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 transition-all duration-300 ease-out hover:bg-white/[0.07] hover:border-[#ecb613]/25 hover:shadow-[0_0_30px_-10px_rgba(236,182,19,0.3)] motion-reduce:transition-none">
              <Sparkles
                className="text-[#ecb613] transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100"
                size={28}
                aria-hidden={true}
              />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">
                Coordinación previa
              </h3>
              <p className="text-white/50 text-xs leading-relaxed transition-colors duration-300 group-hover:text-white/70">
                Llamada de 10 minutos 24 h antes para confirmar hora, ubicación exacta, número de invitados y canciones obligatorias del homenajeado.
              </p>
            </div>
          </div>
          <ol className="space-y-4">
            {SHOW_TIMELINE.map((item) => (
              <li
                key={item.step}
                className="group flex gap-5 bg-white/[0.02] border border-white/5 rounded-2xl p-5 transition-all duration-300 ease-out hover:bg-white/[0.04] hover:border-[#ecb613]/25 hover:translate-x-1 hover:shadow-[0_8px_30px_-12px_rgba(236,182,19,0.2)] motion-reduce:transition-none motion-reduce:hover:translate-x-0"
              >
                <span className="text-[#ecb613] font-mono text-xs font-black tracking-widest pt-1 transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                  {item.step}
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed transition-colors duration-300 group-hover:text-white/70">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <ArtistPricingMatrix />
        <ArtistTestimonials />

        {/* CTA final */}
        <section
          id="reservar"
          className="group/cta relative overflow-hidden bg-gradient-to-br from-[#0b0b0b] via-[#0d0d0d] to-[#0b0b0b] border border-white/5 rounded-[3rem] p-10 md:p-16 text-center space-y-6 transition-colors duration-500 hover:border-[#ecb613]/20"
        >
          <div
            aria-hidden={true}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover/cta:opacity-100 motion-reduce:transition-none"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(236,182,19,0.08), transparent 60%)',
            }}
          />
          <div className="relative space-y-6">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white font-syne">
              Reserva tu serenata de cumpleaños
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-2xl mx-auto">
              Confirmación en menos de 24 h. Disponibilidad inmediata en toda España con 48 h de antelación mínima.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
              <a
                href="/contacto"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#ecb613] text-[#030305] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:bg-[#f5c93a] hover:shadow-[0_0_40px_-8px_rgba(236,182,19,0.8)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                Solicitar presupuesto
                <ArrowRight
                  size={14}
                  aria-hidden={true}
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </a>
              <a
                href="tel:+34600000000"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/[0.03] border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:bg-white/[0.06] hover:border-white/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <Phone
                  size={13}
                  aria-hidden={true}
                  className="text-[#ecb613] transition-transform duration-300 ease-out group-hover:rotate-12 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
                />
                Llamar ahora
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}