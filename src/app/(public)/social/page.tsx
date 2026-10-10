import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Social | EAR',
  description:
    'Comunidad e impacto social de la Productora EAR. Tarifa Solista transparente y reserva directa.',
};

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'EAR · Tarifa Solista',
  description:
    'Servicio profesional de producción audiovisual EAR bajo Tarifa Solista con reserva directa y depósito Stripe.',
  brand: {
    '@type': 'Brand',
    name: 'EAR',
  },
  offers: {
    '@type': 'Offer',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: '/reservar/solista',
    priceValidUntil: '2030-12-31',
  },
};

export default function Page() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#050505] text-white border-l-2 border-[#D4AF37]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-14">
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">
            Sector Asegurado
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-black uppercase italic tracking-widest">
            social
          </h1>
          <p className="mt-6 text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            Comunidad e impacto social de la Productora EAR. Precio oficial transparente,
            reserva directa y depósito seguro vía Stripe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 transition-all duration-300 hover:border-[#D4AF37]/60 hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.35)]">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase block mb-3">
              Tarifa Solista
            </span>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-serif font-black">
                {TARIFA_BASE_SOLISTA_EUR}
              </span>
              <span className="text-white/60 text-sm">EUR</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Depósito de reserva: {DEPOSITO_STRIPE_EUR} EUR vía Stripe. Confirmación inmediata.
            </p>
            <Link
              href="/reservar/solista"
              className="inline-flex items-center justify-center w-full rounded-2xl bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs py-4 transition-all duration-300 hover:bg-[#e6c455] hover:scale-[1.02]"
            >
              Reservar Solista
            </Link>
          </div>

          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 transition-all duration-300 hover:border-[#D4AF37]/60 hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.35)]">
            <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase block mb-3">
              Alquiler & Packs
            </span>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-serif font-black">
                {TARIFA_BASE_SOLISTA_EUR}
              </span>
              <span className="text-white/60 text-sm">EUR · desde</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Consulta packs de inventario y alquiler de equipos con disponibilidad en tiempo real.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/alquiler"
                className="inline-flex items-center justify-center w-full rounded-2xl border border-[#D4AF37]/60 text-[#D4AF37] font-bold uppercase tracking-widest text-xs py-4 transition-all duration-300 hover:bg-[#D4AF37] hover:text-black"
              >
                Ver Alquiler
              </Link>
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center w-full rounded-2xl border border-white/15 text-white/80 font-bold uppercase tracking-widest text-xs py-4 transition-all duration-300 hover:border-white/40 hover:text-white"
              >
                Ir a Checkout
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 text-center transition-all duration-300 hover:border-[#D4AF37]/60">
          <p className="text-white/60 text-sm mb-4">
            ¿Necesitas atención directa? Centralita EAR OS disponible.
          </p>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-2xl bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs px-8 py-4 transition-all duration-300 hover:bg-[#e6c455] hover:scale-[1.02]"
          >
            WhatsApp {CENTRALITA_EAR_OS}
          </a>
        </div>
      </div>
    </div>
  );
}