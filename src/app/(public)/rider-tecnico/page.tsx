import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Rider Técnico | EAR',
  description:
    'Rider técnico para producción de eventos EAR. Tarifa Solista 350 € con audio, iluminación y electricidad profesional.',
};

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const RIDER_BLOCKS: ReadonlyArray<{
  title: string;
  items: ReadonlyArray<string>;
}> = [
  {
    title: 'Audio',
    items: [
      'Consola digital con 32 canales',
      '4 monitores de piso',
      '4 micrófonos inalámbricos',
      '2 micrófonos dinámicos',
    ],
  },
  {
    title: 'Iluminación',
    items: ['4 cabezas móviles', '2 barras de LED', '1 consola DMX'],
  },
  {
    title: 'Electricidad',
    items: [
      '1 circuito dedicado de 20A para audio',
      '1 circuito dedicado de 20A para iluminación',
      'Regleta industrial con protección',
    ],
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Rider Técnico EAR — Tarifa Solista',
  description:
    'Producción técnica completa para eventos EAR: audio, iluminación y electricidad profesional.',
  brand: {
    '@type': 'Brand',
    name: 'EAR OS',
  },
  offers: {
    '@type': 'Offer',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: 'https://ear-os.com/reservar/solista',
    priceValidUntil: '2026-12-31',
    eligibleQuantity: {
      '@type': 'QuantitativeValue',
      value: 1,
      unitCode: 'C62',
    },
  },
};

export default function RiderTecnicoPage() {
  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-[#030305] text-[#f5f5f7] px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto w-full max-w-5xl">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-3">
            EAR OS · Producción Técnica
          </p>
          <h1 className="m-0 text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.03em] font-semibold">
            Rider Técnico
          </h1>
          <p className="mt-4 mb-0 text-[#a1a1aa] text-lg leading-relaxed max-w-2xl">
            Especificaciones técnicas para la producción de eventos EAR. Tarifa
            Solista transparente, sin sorpresas.
          </p>
        </header>

        <div className="mb-10 rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-8 transition-all duration-300 hover:border-white/20 hover:bg-[#09090d]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#a1a1aa] mb-2">
                Tarifa Solista
              </p>
              <p className="m-0 text-4xl sm:text-5xl font-semibold tracking-tight">
                {TARIFA_BASE_SOLISTA_EUR} €
              </p>
              <p className="mt-2 mb-0 text-sm text-[#a1a1aa]">
                Depósito de reserva: {DEPOSITO_STRIPE_EUR} € (reembolsable según
                condiciones)
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/reservar/solista"
                className="inline-flex items-center justify-center rounded-2xl bg-white text-[#030305] px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-[#e5e5e7] hover:scale-[1.02]"
              >
                Reservar Solista
              </Link>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent text-[#f5f5f7] px-6 py-3 text-sm font-semibold transition-all duration-300 hover:border-white/30 hover:bg-white/5"
              >
                WhatsApp {CENTRALITA_EAR_OS}
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {RIDER_BLOCKS.map((block) => (
            <article
              key={block.title}
              className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-8 transition-all duration-300 hover:border-white/20 hover:bg-[#09090d] hover:-translate-y-0.5"
            >
              <h2 className="m-0 mb-4 text-xl font-semibold tracking-tight">
                {block.title}
              </h2>
              <ul className="m-0 pl-5 text-[#d4d4d8] leading-relaxed space-y-1">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-8 transition-all duration-300 hover:border-white/20">
          <h2 className="m-0 mb-3 text-xl font-semibold tracking-tight">
            ¿Listo para cerrar fecha?
          </h2>
          <p className="m-0 mb-6 text-[#a1a1aa] leading-relaxed">
            Reserva la Tarifa Solista o consulta packs de inventario para
            producciones de mayor escala.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/reservar/solista"
              className="inline-flex items-center justify-center rounded-2xl bg-white text-[#030305] px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-[#e5e5e7] hover:scale-[1.02]"
            >
              Reservar Solista · {TARIFA_BASE_SOLISTA_EUR} €
            </Link>
            <Link
              href="/alquiler"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent text-[#f5f5f7] px-6 py-3 text-sm font-semibold transition-all duration-300 hover:border-white/30 hover:bg-white/5"
            >
              Ver packs de inventario
            </Link>
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent text-[#f5f5f7] px-6 py-3 text-sm font-semibold transition-all duration-300 hover:border-white/30 hover:bg-white/5"
            >
              Ir al checkout
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}