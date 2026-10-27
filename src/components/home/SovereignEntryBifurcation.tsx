import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck,
  Building2,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Layers,
  type LucideIcon,
  ExternalLink,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
} from '@/lib/constants/ear-os-ssot';

/**
 * SOVEREIGN ENTRY TRIFURCATION — Puerta de Entrada Unificada S-CLASS (Opción B).
 * 3 caminos claros, cero fricción + Océano Azul VIMUME:
 *   · Camino 1: Particulares & Bodas (Edwin Agudelo / Mariachis de Gala / Solistas).
 *   · Camino 2: Ayuntamientos & Instituciones (Contrato menor Art. 118 LCSP).
 *   · Camino 3: Directorio Homologado de Proveedores (6.700+ verificados).
 *   · Corazón Social: Viaje Musical por la Memoria (viajemusicalporlamemoria.com).
 *
 * Tipografía ejecutiva:
 *   · Textos: min 14px (text-sm)
 *   · Subtítulos: 16px (text-base)
 *   · Títulos H1/H2: max 20px (text-xl font-bold)
 */

interface EntryCard {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  accentHex: string;
  accentGlow: string;
  icon: LucideIcon;
  priceLabel: string;
  priceValue: string;
  bullets: readonly string[];
  ctaLabel: string;
  ctaHref: string;
}

const ENTRY_CARDS: readonly EntryCard[] = Object.freeze([
  {
    id: 'particulares',
    eyebrow: 'Particulares · Bodas & Celebraciones',
    title: 'Música en Directo & Artistas S-Class',
    subtitle:
      'Edwin Agudelo (Tenor Lírico), Mariachis de Gala, Cuerdas y Fiesta. Selección de alta gama con presupuesto cerrado y fianza 100% deducible.',
    accentHex: '#ecb613',
    accentGlow: 'rgba(236,182,19,0.22)',
    icon: CalendarCheck,
    priceLabel: 'Tarifa Base Solista',
    priceValue: `${TARIFA_BASE_SOLISTA_EUR} €`,
    bullets: [
      `Fianza de ${DEPOSITO_STRIPE_EUR} € (100% deducible en Stripe)`,
      'Bloqueo inmutable de fecha en calendario oficial',
      'Ingeniería acústica legal (Ley 37/2003)',
    ],
    ctaLabel: 'Reservar Actuación VIP',
    ctaHref: '/reservar/solista',
  },
  {
    id: 'ayuntamientos',
    eyebrow: 'B2G · Ayuntamientos & Entidades',
    title: 'Contratación Pública & Festejos',
    subtitle:
      'Tramitación express bajo Contrato Menor (Art. 118 LCSP). Conciertos de gala, grandes mariachis y ciclos culturales sin burocracia.',
    accentHex: '#FF2B44',
    accentGlow: 'rgba(255,43,68,0.22)',
    icon: Building2,
    priceLabel: 'Techo Contrato Menor',
    priceValue: `< ${AJUSTE_PREVENTIVO_B2G_EUR.toLocaleString('es-ES')} €`,
    bullets: [
      'Facturación electrónica oficial FACe (código DIR3)',
      'Seguro RC 1.000.000 € y limitador homologado',
      'Cero licitación pública ni pliegos complejos',
    ],
    ctaLabel: 'Tramitar para Ayuntamiento',
    ctaHref: '/ayuntamientos',
  },
  {
    id: 'directorio',
    eyebrow: '6.700+ Fincas, Fotografía & Servicios',
    title: 'Directorio Homologado de Proveedores',
    subtitle:
      'El censo nupcial y de eventos más riguroso de España. Filtro de calidad con verificación de sedes y contacto gestionado por Productora EAR.',
    accentHex: '#00E5FF',
    accentGlow: 'rgba(0,229,255,0.22)',
    icon: Layers,
    priceLabel: 'Garantía Homologada',
    priceValue: 'Verificados S-Class',
    bullets: [
      'Cero fachadas: auditoría de teléfonos y ubicaciones',
      'Protección de precio histórico de 2 años',
      'Comisionado y puente centralizado vía n8n',
    ],
    ctaLabel: 'Explorar Proveedores',
    ctaHref: '/proveedores',
  },
]);

export default function SovereignEntryBifurcation(): React.JSX.Element {
  return (
    <section
      aria-label="Puerta de entrada unificada EAR OS"
      className="relative w-full overflow-x-hidden px-4 sm:px-6 py-6"
    >
      <div className="mx-auto max-w-6xl">
        {/* Cabecera clara y directa */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#09090d]/80 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#ecb613] backdrop-blur-md">
            <Sparkles size={13} className="text-[#ecb613]" aria-hidden="true" />
            Ecosistema Productora EAR
          </span>
          <h1 className="mt-3 text-xl font-bold text-white tracking-tight">
            ¿Cómo podemos ayudarte hoy?
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300 leading-relaxed font-sans">
            Tres accesos directos sin laberintos técnicos: contrata a Edwin Agudelo y mariachis de gala, tramita espectáculos para tu ayuntamiento o accede al directorio verificado.
          </p>
        </div>

        {/* Las 3 Vías Soberanas */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ENTRY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.ctaHref}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#09090d]/90 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.02] hover:border-white/20 shadow-xl"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-500 ease-out group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 20% 0%, ${card.accentGlow}, transparent 70%)`,
                  }}
                />

                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:scale-110">
                      <Icon
                        size={22}
                        aria-hidden="true"
                        style={{ color: card.accentHex }}
                      />
                    </div>
                    <span
                      className="inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider"
                      style={{
                        color: card.accentHex,
                        borderColor: `${card.accentHex}44`,
                        backgroundColor: `${card.accentHex}10`,
                      }}
                    >
                      {card.eyebrow}
                    </span>
                  </div>

                  <h2 className="mt-5 text-base font-bold text-white leading-snug">
                    {card.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">
                    {card.subtitle}
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                      {card.priceLabel}
                    </span>
                    <span
                      className="font-mono text-base font-bold"
                      style={{ color: card.accentHex }}
                    >
                      {card.priceValue}
                    </span>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {card.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.5 text-sm text-zinc-300"
                      >
                        <ShieldCheck
                          size={15}
                          aria-hidden="true"
                          className="mt-0.5 shrink-0"
                          style={{ color: card.accentHex }}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <span
                  className="mt-6 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl px-5 py-2.5 font-mono text-sm font-bold uppercase tracking-wide text-black transition-all duration-300 ease-out group-hover:gap-3"
                  style={{
                    backgroundColor: card.accentHex,
                    boxShadow: `0 0 24px ${card.accentGlow}`,
                  }}
                >
                  {card.ctaLabel}
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* 🌟 VIMUME: EL OCÉANO AZUL ARTÍSTICO Y SANITARIO DE EDWIN AGUDELO */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-[#00E5FF]/30 bg-gradient-to-r from-[#030305] via-[#090915] to-[#030305] p-6 sm:p-8 backdrop-blur-md relative shadow-2xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00E5FF]/10 blur-3xl"
          />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#00E5FF]">
                <HeartHandshake size={13} />
                <span>Impacto Social · VIMUME</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Viaje Musical por la Memoria (VIMUME)
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                El proyecto insignia de neuro-musicoterapia para personas mayores y centros residenciales. Estimulación cognitiva con protocolo de 40 Hz Gamma, desescalada farmacológica y deducción fiscal de hasta el 80% bajo la Ley 49/2002 (SROI 4.85x).
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-zinc-400 pt-1">
                <span className="flex items-center gap-1.5 text-zinc-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />
                  Modelo 182 AEAT
                </span>
                <span className="flex items-center gap-1.5 text-zinc-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />
                  Certificado ESG / RSC
                </span>
                <span className="flex items-center gap-1.5 text-zinc-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />
                  Acreditación Clínica
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <a
                href="https://viajemusicalporlamemoria.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#00E5FF] hover:bg-[#66F0FF] text-black font-mono text-sm font-bold px-6 py-3.5 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:scale-105"
              >
                <span>Conocer VIMUME</span>
                <ExternalLink size={15} />
              </a>
              <Link
                href="/vimume"
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold px-5 py-3 transition-colors text-center"
              >
                <span>Dossier Clínico & Ley 49/2002</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
