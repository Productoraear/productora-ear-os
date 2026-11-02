import type { Metadata } from 'next';
import { Music, Sparkles, Volume2 } from 'lucide-react';
import JardinesLaCartujaGrandSlam from '@/components/fincas/JardinesLaCartujaGrandSlam';
import { BentoGrid, BentoGridItem } from '@/components/harvested/BentoGrid';
import { GlowButton } from '@/components/harvested/GlowButton';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Música en Directo y Sonorización para Jardines La Cartuja (Valencia) · Homologación Oficial | Productora EAR',
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

      <section className="w-full px-4 sm:px-6 lg:px-10 pt-10 pb-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-10 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.15)]">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Finca S-Class · El Puig, Valencia
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-semibold text-white tracking-tight">
            Jardines La Cartuja
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-white/70 leading-relaxed">
            Experiencia inmersiva con cotizador en tiempo real y garantía acústica S-Class.
            Reserva con depósito Price-Lock de {DEPOSITO_STRIPE_EUR} € y asegura tu fecha.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                Tarifa Solista
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {TARIFA_BASE_SOLISTA_EUR} €
              </p>
              <p className="text-xs text-white/50 mt-1">
                Depósito Price-Lock: {DEPOSITO_STRIPE_EUR} €
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <GlowButton href="/reservar/solista" variant="gold">
                Reservar Solista · {TARIFA_BASE_SOLISTA_EUR} €
              </GlowButton>
              <GlowButton href="/reservar/test-1eur" variant="cyan">
                Probar Pasarela · 1,00 €
              </GlowButton>
              <a
                href="#configurador"
                className="inline-flex items-center justify-center rounded-2xl bg-white/5 text-white border border-white/15 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/30"
              >
                Rider Técnico & Espacios
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-400/40"
              >
                WhatsApp +{CENTRALITA_EAR_OS}
              </a>
            </div>
          </div>
        </div>
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
            <BentoGrid>
              <BentoGridItem
                title="Ceremonia en Césped"
                description="Acústica de 12 W/pax con sistema Bose F1 sin cables visibles. Sonido envolvente que respeta el protocolo Ley 37/2003."
                icon={<Volume2 className="h-4 w-4" aria-hidden="true" />}
                header={
                  <div className="flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ecb613]/20 to-transparent border border-white/5">
                    <Volume2 className="h-10 w-10 text-[#ecb613]" aria-hidden="true" />
                  </div>
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

      <JardinesLaCartujaGrandSlam initialEditMode={false} />
    </div>
  );
}