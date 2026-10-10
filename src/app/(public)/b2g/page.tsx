import React from 'react';
import { Metadata } from 'next';
import B2GInstitutionalPortal from '@/components/b2g/B2GInstitutionalPortal';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Portal B2G & Contratación Menor LCSP (<15.000€) | Productora EAR',
  description: 'Contratación pública simplificada (Art. 118 LCSP) para Ayuntamientos y Diputaciones. Ajuste preventivo a 14.250€, facturación electrónica FACe con códigos DIR3, sonorización 18W/pax y memorias ODS 2030.',
  keywords: [
    'contrato menor ayuntamientos',
    'art 118 lcsp servicios',
    'facturae dir3 face toledo madrid',
    'sonido fiestas patronales 18w',
    'pantallas led p26 exterior ayuntamientos',
    'protocolo de estado audio aes256',
    'proyecto vimume sroi ayuntamientos',
    'licitacion menor cultura festejos'
  ],
  alternates: {
    canonical: 'https://productoraear.com/b2g',
  },
  openGraph: {
    title: 'Portal B2G & Contratación Menor Art. 118 LCSP | Productora EAR',
    description: 'Bypass administrativo para administraciones locales. Licitaciones menores blindadas en 14.250€ y facturación directa en FACe.',
    url: 'https://productoraear.com/b2g',
    siteName: 'Productora EAR — EAR OS',
    locale: 'es_ES',
    type: 'website',
  },
};

const b2gSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'GovernmentService',
      name: 'Contratación Menor de Servicios Técnicos y Culturales (Art. 118 LCSP)',
      serviceType: 'Producción Técnica Audiovisual & Programas Sociosanitarios Municipales',
      provider: {
        '@type': 'Organization',
        name: 'Productora EAR Audiovisual S.L.',
        telephone: CENTRALITA_EAR_OS,
        email: 'direccion@productoraear.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Calle La Fuente 12',
          addressLocality: 'Méntrida',
          addressRegion: 'Toledo',
          postalCode: '45930',
          addressCountry: 'ES'
        }
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios Institucionales 360',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Fiestas Patronales & Macroconciertos Line Array 18W/pax',
              description: 'Sonorización, robótica de iluminación y boletín eléctrico temporal OCA.'
            },
            price: '6500.00',
            priceCurrency: 'EUR'
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Pantallas LED P2.6 Outdoor (> 5.500 nits)',
              description: 'Murales modulares estancos IP65 con escalador 4K.'
            },
            price: '2800.00',
            priceCurrency: 'EUR'
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Protocolo de Estado & Audio Encriptado Shure Axient AES-256',
              description: 'Microfonía blindada de seguridad y convoy ejecutivo de 14 plazas.'
            },
            price: '4800.00',
            priceCurrency: 'EUR'
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Plan VIMUME Neuroacústica Senior en Residencias Municipales',
              description: 'Intervención de estimulación gamma 40Hz y memoria biográfica (ODS 3, 10, 11).'
            },
            price: '4200.00',
            priceCurrency: 'EUR'
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Tarifa Solista EAR OS — Producción Técnica Base',
              description: 'Servicio técnico profesional de producción audiovisual con tarifa oficial SSOT.'
            },
            price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
            priceCurrency: 'EUR'
          }
        ]
      }
    }
  ]
};

export default function B2GPage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(b2gSchema) }}
      />
      <B2GInstitutionalPortal />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 sm:p-12 transition-all duration-500 hover:border-white/20 hover:bg-[#09090d]/90">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Tarifa Oficial SSOT
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
            Contratación directa desde {TARIFA_BASE_SOLISTA_EUR} €
          </h2>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/70">
            Reserva blindada con depósito de {DEPOSITO_STRIPE_EUR} € vía Stripe.
            Facturación electrónica FACe con códigos DIR3 y memorias ODS 2030 incluidas.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="/reservar/solista"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-[#09090d] transition-all duration-300 hover:bg-white/90 hover:scale-[1.02]"
            >
              Reservar Tarifa Solista — {TARIFA_BASE_SOLISTA_EUR} €
            </a>
            <a
              href="/alquiler"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:scale-[1.02]"
            >
              Ver Packs de Inventario
            </a>
            <a
              href="/checkout"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:scale-[1.02]"
            >
              Checkout Seguro
            </a>
            <a
              href={`https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-200 transition-all duration-300 hover:border-emerald-400/60 hover:bg-emerald-400/20 hover:scale-[1.02]"
            >
              WhatsApp Directo {CENTRALITA_EAR_OS}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}