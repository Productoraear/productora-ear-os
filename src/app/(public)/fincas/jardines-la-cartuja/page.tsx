import type { Metadata } from 'next';
import { Music, ShieldCheck, Sparkles, Volume2 } from 'lucide-react';
import JardinesLaCartujaGrandSlam from '@/components/fincas/JardinesLaCartujaGrandSlam';
import jardinesLaCartujaData from '@/data/providers/jardines_la_cartuja_override.json';
import { BentoGrid, BentoGridItem } from '@/components/harvested/BentoGrid';
import { GlowButton } from '@/components/harvested/GlowButton';
import { AudioReactiveVisualizer, HorizonXGlow } from '@/components/harvested';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Música en Directo y Sonorización para Jardines La Cartuja (Valencia) | Productora EAR',
  description: `Coordinación musical, limitadores acústicos Ley 37/2003 y cotizador oficial para bodas en Jardines La Cartuja (El Puig, Valencia). Reserva de depósito de ${DEPOSITO_STRIPE_EUR} € Price-Lock.`,
  alternates: {
    canonical: 'https://www.productoraear.com/fincas/jardines-la-cartuja',
  },
};

const SITE_URL = 'https://www.productoraear.com';
const PAGE_URL = `${SITE_URL}/fincas/jardines-la-cartuja`;
const WHATSAPP_URL = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Jardines La Cartuja · Experiencia S-Class EAR OS',
  description:
    'Experiencia inmersiva y cotizador en tiempo real para Jardines La Cartuja (El Puig, Valencia). Reserva de depósito Price-Lock y garantía acústica S-Class.',
  brand: {
    '@type': 'Brand',
    name: 'EAR OS',
  },
  offers: {
    '@type': 'Offer',
    url: PAGE_URL,
    priceCurrency: 'EUR',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    availability: 'https://schema.org/InStock',
    priceValidUntil: '2026-12-31',
    seller: {
      '@type': 'Organization',
      name: 'EAR OS',
      telephone: `+${CENTRALITA_EAR_OS.replace(/\D/g, '')}`,
    },
  },
};

export default function JardinesLaCartujaPage() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-[#030305]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative w-full overflow-hidden px-4 pb-8 pt-10 sm:px-6 lg:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[460px]"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(236,182,19,0.16), transparent 62%)',
          }}
        />
        <HorizonXGlow
          glowColor="gold"
          intensity="subtle"
          className="mx-auto max-w-6xl p-6 shadow-[0_40px_120px_-40px_rgba(236,182,19,0.22)] sm:p-10"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#ecb613]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Finca S-Class · El Puig, Valencia
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white/60">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
              Acústica Ley 37/2003
            </span>
          </div>

          <h1 className="mt-5 max-w-3xl font-syne text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
            Jardines La Cartuja
            <span className="mt-2 block bg-gradient-to-r from-[#ecb613] via-[#ffe066] to-[#ecb613] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
              Tu boda, cinematográfica de principio a fin
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Experiencia inmersiva con cotizador en tiempo real y garantía acústica S-Class.
            Reserva con depósito Price-Lock de {DEPOSITO_STRIPE_EUR} € y asegura tu fecha.
          </p>

          <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                Presión homologada
              </dt>
              <dd className="mt-1 text-2xl font-black text-white">12 W/pax</dd>
              <dd className="mt-1 text-xs text-white/50">Bose F1 · Shure Axient</dd>
            </div>
            <div className="rounded-2xl border border-[#ecb613]/25 bg-[#ecb613]/5 p-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ecb613]/80">
                Depósito Price-Lock
              </dt>
              <dd className="mt-1 text-2xl font-black text-[#ecb613]">{DEPOSITO_STRIPE_EUR} €</dd>
              <dd className="mt-1 text-xs text-white/50">Deducible íntegro del presupuesto</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                Tarifa Solista
              </dt>
              <dd className="mt-1 text-2xl font-black text-white">{TARIFA_BASE_SOLISTA_EUR} €</dd>
              <dd className="mt-1 text-xs text-white/50">Tarifa base del SSOT</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <GlowButton href="/reservar/solista" variant="gold">
              Reservar Solista · {TARIFA_BASE_SOLISTA_EUR} €
            </GlowButton>
            <GlowButton href="/reservar/test-1eur" variant="cyan">
              Probar Pasarela · 1,00 €
            </GlowButton>
            <a
              href="#configurador"
              className="inline-flex items-center justify-center rounded-2xl bg-white/5 px-6 py-3 text-sm font-semibold text-white border border-white/15 transition-all duration-300 hover:bg-white/10 hover:border-white/30"
            >
              Rider Técnico & Espacios
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-300 border border-emerald-400/20 transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-400/40"
            >
              WhatsApp {CENTRALITA_EAR_OS}
            </a>
          </div>
        </HorizonXGlow>
      </section>

      <section className="w-full px-4 sm:px-6 lg:px-10 pb-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Experiencia en tres actos
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Tu boda, cinematográfica de principio a fin
          </h2>
          <div className="mt-8">
            {/* Filas de altura dinámica: el primer Bento aloja la telemetría acústica viva. */}
            <BentoGrid className="md:!auto-rows-auto">
              <BentoGridItem
                title="Ceremonia en Césped"
                description="Acústica de 12 W/pax con sistema Bose F1 sin cables visibles. Sonido envolvente que respeta el protocolo Ley 37/2003."
                icon={<Volume2 className="h-4 w-4" aria-hidden="true" />}
                header={
                  <AudioReactiveVisualizer peakDba={82.4} theme="gold" className="mt-4" />
                }
              />
              <BentoGridItem
                title="Cóctel & Banquete"
                description="Iluminación cálida de ambiente y microfonía inalámbrica Shure Axient para discursos y brindis sin interrupciones."
                icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
                header={
                  <div className="flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ecb613]/20 to-transparent border border-white/5">
                    <Sparkles className="h-10 w-10 text-[#ecb613]" aria-hidden="true" />
                  </div>
                }
              />
              <BentoGridItem
                title="Barra Libre & Fiesta"
                description="Robótica DMX sincronizada y show en directo para una pista de baile que no decae en toda la noche."
                icon={<Music className="h-4 w-4" aria-hidden="true" />}
                header={
                  <div className="flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ecb613]/20 to-transparent border border-white/5">
                    <Music className="h-10 w-10 text-[#ecb613]" aria-hidden="true" />
                  </div>
                }
              />
            </BentoGrid>
          </div>
        </div>
      </section>

      <JardinesLaCartujaGrandSlam
        initialEditMode={false}
        allowEditToggle={false}
        initialData={jardinesLaCartujaData}
      />
    </div>
  );
}