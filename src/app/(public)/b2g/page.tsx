import React from 'react';
import { Metadata } from 'next';
import B2GInstitutionalPortal from '@/components/b2g/B2GInstitutionalPortal';

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
    canonical: 'https://www.productoraear.com/b2g',
  },
  openGraph: {
    title: 'Portal B2G & Contratación Menor Art. 118 LCSP | Productora EAR',
    description: 'Bypass administrativo para administraciones locales. Licitaciones menores blindadas en 14.250€ y facturación directa en FACe.',
    url: 'https://www.productoraear.com/b2g',
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
        telephone: '+34 693 693 048',
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
    </main>
  );
}
