import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck,
  Mic2,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';

/**
 * SOVEREIGN ENTRY BIFURCATION — Puerta de Entrada Unificada S-CLASS.
 * Embudo bifurcado de 3 clics (Mandato Supremo del CEO):
 *   · Botón A (Clientes)  → Escaparate Edwin/Mariachi/Solista + fianza 100 €.
 *   · Botón B (Artistas)  → SaaS de Artistas (29 €/mes · 290 €/año).
 * Server Component puro (cero `any`, cero interactividad innecesaria).
 */

/** Precios SaaS canónicos. Fuente única: `ARTIST_PLANS` en
 *  `src/app/actions/artistSubscriptionActions.ts` (W36_T02). */
const SAAS_MONTHLY_EUR: number = 29;
const SAAS_ANNUAL_EUR: number = 290;

const artistSplitPct: number = Math.round(SPLIT_SOBERANO.artista * 100);
const earSplitPct: number = Math.round(SPLIT_SOBERANO.earOs * 100);
const vimumeSplitPct: number = Math.round(SPLIT_SOBERANO.vimume * 100);

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
    id: 'clients',
    eyebrow: 'Para Clientes · Bodas & Eventos',
    title: 'Contratar Música & Artistas en Directo',
    subtitle:
      'Edwin Agudelo (Tenor), Mariachi y Solista de gala. Bloquea tu fecha con una fianza 100% deducible y sin riesgo.',
    accentHex: '#ecb613',
    accentGlow: 'rgba(236,182,19,0.16)',
    icon: CalendarCheck,
    priceLabel: 'Desde',
    priceValue: `${TARIFA_BASE_SOLISTA_EUR} €`,
    bullets: [
      `Fianza ${DEPOSITO_STRIPE_EUR} € · Stripe Price-Lock`,
      'Calendario bloqueado + WhatsApp instantáneo',
      'Rider acústico legal (Ley 37/2003)',
    ],
    ctaLabel: 'Reservar Fecha',
    ctaHref: '/reservar/solista',
  },
  {
    id: 'artists',
    eyebrow: 'Para Músicos & Grupos',
    title: 'Área de Artistas — Gestiona tu Carrera',
    subtitle:
      'Panel privado con pasarela Stripe, calendario ACID y liquidación directa sin intermediarios.',
    accentHex: '#00E5FF',
    accentGlow: 'rgba(0,229,255,0.16)',
    icon: Mic2,
    priceLabel: 'Suscripción',
    priceValue: `${SAAS_MONTHLY_EUR} €/mes`,
    bullets: [
      `Split Soberano ${artistSplitPct}/${earSplitPct}/${vimumeSplitPct}`,
      `Élite anual ${SAAS_ANNUAL_EUR} € (2 meses gratis)`,
      'Contratos cifrados SHA-256 · 0 € de cuota fija',
    ],
    ctaLabel: 'Unirme como Artista',
    ctaHref: '/artistas',
  },
]);

export default function SovereignEntryBifurcation(): React.JSX.Element {
  return (
    <section
      aria-label="Puerta de entrada unificada EAR OS"
      className="relative w-full overflow-x-hidden px-4 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#09090d]/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 backdrop-blur-md">
            <Sparkles size={12} className="text-[#ecb613]" aria-hidden="true" />
            Puerta de Entrada Soberana
          </span>
          <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            ¿Qué necesitas hoy?
          </h2>
          <p className="mt-2 max-w-xl text-xs text-white/60 sm:text-sm">
            Dos caminos, cero fricción: contrata música en directo o impulsa tu
            carrera como artista.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {ENTRY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.ctaHref}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.02] hover:border-white/20 sm:p-8"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 opacity-70 transition-opacity duration-500 ease-out group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 20% 0%, ${card.accentGlow}, transparent 60%)`,
                  }}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:scale-110">
                    <Icon
                      size={22}
                      aria-hidden="true"
                      style={{ color: card.accentHex }}
                    />
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      color: card.accentHex,
                      borderColor: `${card.accentHex}55`,
                    }}
                  >
                    {card.eyebrow}
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-xl font-bold text-white sm:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70 sm:text-sm">
                  {card.subtitle}
                </p>

                <div className="mt-5 flex items-end justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                    {card.priceLabel}
                  </span>
                  <span
                    className="font-mono text-lg font-bold sm:text-xl"
                    style={{ color: card.accentHex }}
                  >
                    {card.priceValue}
                  </span>
                </div>

                <ul className="mt-5 space-y-2">
                  {card.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-[11px] text-white/60 sm:text-xs"
                    >
                      <ShieldCheck
                        size={13}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0"
                        style={{ color: card.accentHex }}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <span
                  className="mt-6 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 font-mono text-sm font-black uppercase tracking-wide text-black transition-all duration-300 ease-out group-hover:gap-3"
                  style={{
                    backgroundColor: card.accentHex,
                    boxShadow: `0 0 30px ${card.accentGlow}`,
                  }}
                >
                  {card.ctaLabel}
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

