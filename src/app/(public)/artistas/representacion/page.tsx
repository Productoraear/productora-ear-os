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

const TARIFA_FORMATEADA = TARIFA_BASE_SOLISTA_EUR.toFixed(2);
const DEPOSITO_FORMATEADO = DEPOSITO_STRIPE_EUR.toFixed(2);
const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/[^0-9]/g, '')}`;

const jsonLd = {
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

export default function RepresentacionPage() {
  return (
    <main className="bg-black text-white min-h-screen w-full overflow-x-hidden p-8 max-w-5xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="text-4xl font-bold mb-6 text-white border-b border-white/10 pb-4">
        Representación de Artistas y Management Oficial
      </h1>

      <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
        <p>
          Gestión integral de contratación directa de solistas y elencos musicales con rider
          técnico acústico homologado y liquidaciones automatizadas bajo el Split Soberano (80%
          Artista / 10% EAR OS / 10% VIMUME).
        </p>

        <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 my-6 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.35)]">
          <h2 className="text-xl font-semibold text-white mb-4">
            Ficha Técnica y Condiciones Transaccionales
          </h2>
          <ul className="space-y-3 text-sm text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span>
                <strong>Tarifa Base Solista (Edwin Agudelo):</strong> {TARIFA_FORMATEADA} € (Hub
                Central Méntrida, Toledo).
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span>
                <strong>Logística y Kilometraje:</strong> 1,50 €/km a partir del km 50 (+120 €
                suplemento hotelero si fin &ge; 3:00 AM o distancia &gt; 200 km).
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span>
                <strong>Rider y Presión Acústica:</strong> 12 W/pax (Sistemas Bose F1 Model 812 /
                S1 Pro, Microfonía Shure Beta 87A).
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span>
                <strong>Límite VIMUME B2G:</strong> &lt; 15.000,00 € (Ajuste preventivo Art. 118
                LCSP = 14.250,00 €).
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">•</span>
              <span>
                <strong>Depósito Transaccional:</strong> {DEPOSITO_FORMATEADO} € mediante Stripe
                con firma Price-Lock SHA-256.
              </span>
            </li>
          </ul>
        </section>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-semibold rounded-3xl transition-all duration-300 hover:bg-cyan-300 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)]"
          >
            WhatsApp {CENTRALITA_EAR_OS}
          </a>
          <a
            href="/reservar/solista"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/10 text-white font-semibold rounded-3xl transition-all duration-300 hover:bg-[#09090d]/80 hover:border-cyan-400/40 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)]"
          >
            Reservar Solista — {TARIFA_FORMATEADA} €
          </a>
        </div>
      </div>
    </main>
  );
}