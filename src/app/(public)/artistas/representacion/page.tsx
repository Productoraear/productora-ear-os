import React from 'react';
import { Metadata } from 'next';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Representación Artística y Management | Productora EAR',
  description:
    'Representación artística exclusiva, booking y dirección técnica para solistas, orquestas y formaciones musicales. Tarifa Solista 350 € con depósito Stripe 100 €.',
};

const TARIFA_FORMATEADA: string = TARIFA_BASE_SOLISTA_EUR.toFixed(2);
const DEPOSITO_FORMATEADO: string = DEPOSITO_STRIPE_EUR.toFixed(2);
const WHATSAPP_HREF: string = `https://wa.me/${CENTRALITA_EAR_OS.replace(/[^0-9]/g, '')}`;

interface JsonLdOffer {
  '@type': 'Offer';
  url: string;
  priceCurrency: string;
  price: string;
  availability: string;
  priceValidUntil: string;
  seller: {
    '@type': 'Organization';
    name: string;
    telephone: string;
  };
}

interface JsonLdProduct {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  brand: {
    '@type': 'Brand';
    name: string;
  };
  offers: JsonLdOffer;
}

const jsonLd: JsonLdProduct = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Representación Artística y Management — Tarifa Solista',
  description:
    'Gestión integral de contratación directa de solistas y elencos musicales con rider técnico acústico homologado y liquidaciones automatizadas bajo el Split Soberano (80% Artista / 10% EAR OS / 10% VIMUME).',
  brand: {
    '@type': 'Brand',
    name: 'Productora EAR',
  },
  offers: {
    '@type': 'Offer',
    url: 'https://ear-os.com/reservar/solista',
    priceCurrency: 'EUR',
    price: TARIFA_FORMATEADA,
    availability: 'https://schema.org/InStock',
    priceValidUntil: '2026-12-31',
    seller: {
      '@type': 'Organization',
      name: 'Productora EAR',
      telephone: CENTRALITA_EAR_OS,
    },
  },
};

interface FichaTecnicaItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

const FICHA_TECNICA: readonly FichaTecnicaItem[] = [
  {
    id: 'tarifa-base',
    label: 'Tarifa Base Solista (Edwin Agudelo)',
    value: `${TARIFA_FORMATEADA} € (Hub Central Méntrida, Toledo).`,
  },
  {
    id: 'logistica',
    label: 'Logística y Kilometraje',
    value:
      '1,50 €/km a partir del km 50 (+120 € suplemento hotelero si fin ≥ 3:00 AM o distancia > 200 km).',
  },
  {
    id: 'rider',
    label: 'Rider y Presión Acústica',
    value:
      '12 W/pax (Sistemas Bose F1 Model 812 / S1 Pro, Microfonía Shure Beta 87A).',
  },
  {
    id: 'vimume',
    label: 'Límite VIMUME B2G',
    value: '< 15.000,00 € (Ajuste preventivo Art. 118 LCSP = 14.250,00 €).',
  },
  {
    id: 'deposito',
    label: 'Depósito Transaccional',
    value: `${DEPOSITO_FORMATEADO} € mediante Stripe con firma Price-Lock SHA-256.`,
  },
] as const;

export default function RepresentacionPage(): React.JSX.Element {
  return (
    <main className="bg-[#030305] text-white min-h-screen w-full overflow-x-hidden p-8 max-w-5xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="text-4xl font-bold mb-6 text-white border-b border-white/10 pb-4">
        Representación de Artistas y Management Oficial
      </h1>

      <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
        <p>
          Contratación directa de solistas y elencos musicales con rider técnico acústico
          homologado y liquidaciones automatizadas bajo el Split Soberano (80% Artista / 10% EAR OS
          / 10% VIMUME).
        </p>

        <section
          aria-labelledby="ficha-tecnica-heading"
          className="group rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 my-6 transition-all duration-500 ease-out hover:border-cyan-400/40 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.35)] hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
        >
          <h2
            id="ficha-tecnica-heading"
            className="text-xl font-semibold text-white mb-4 transition-colors duration-300 group-hover:text-cyan-100"
          >
            Ficha Técnica y Condiciones Transaccionales
          </h2>
          <ul className="space-y-3 text-sm text-zinc-300">
            {FICHA_TECNICA.map((item: FichaTecnicaItem) => (
              <li
                key={item.id}
                className="flex items-start gap-2 transition-colors duration-300 hover:text-white"
              >
                <span
                  aria-hidden="true"
                  className="text-cyan-400 font-mono font-bold leading-6 transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none"
                >
                  •
                </span>
                <span>
                  <strong>{item.label}:</strong> {item.value}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Contactar por WhatsApp al ${CENTRALITA_EAR_OS}`}
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-3xl overflow-hidden transition-all duration-300 ease-out hover:bg-cyan-300 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] motion-reduce:transform-none motion-reduce:transition-none"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
            />
            <span className="relative transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none">
              WhatsApp {CENTRALITA_EAR_OS}
            </span>
          </a>
          <a
            href="/reservar/solista"
            aria-label={`Reservar Solista por ${TARIFA_FORMATEADA} euros`}
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-white font-semibold rounded-3xl overflow-hidden transition-all duration-300 ease-out hover:bg-[#09090d]/80 hover:border-cyan-400/40 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] motion-reduce:transform-none motion-reduce:transition-none"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
            />
            <span className="relative transition-colors duration-300 group-hover:text-cyan-100">
              Reservar Solista — {TARIFA_FORMATEADA} €
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}