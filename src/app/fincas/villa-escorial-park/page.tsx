import React from 'react';
import { Metadata } from 'next';
import VillaEscorialParkSClassExperience from '@/components/fincas/VillaEscorialParkSClassExperience';
import { getVillaEscorialTelemetry } from '@/lib/villas/villa-escorial-sync';

export const revalidate = 900; // 15 minutos de revalidación incremental (ISR)

export const metadata: Metadata = {
  title: 'Villa Escorial Park ® | Alquiler Directo Sin Comisiones (Ahorra vs Airbnb) · Calendario 365 Días',
  description: 'Canal oficial de alquiler directo de Villa Escorial Park (San Lorenzo de El Escorial, Madrid) sin comisiones de intermediarios (ahorra hasta 950 € vs plataformas). Finca privada de 20.000 m², piscina vallada, 9 suites para 30 personas. Fin de semana completo 4.500 € (Vie 14h - Dom 14h) y alquiler todo el año entre semana desde 700 €/noche. Contacto directo con Edwin Agudelo (+34 693 693 048 / productoraear@gmail.com).',
  keywords: [
    'Villa Escorial Park',
    'Villa Escorial Park alquiler directo',
    'Villa Escorial Park precio',
    'Villa Escorial Park contacto directo',
    'Villa Escorial Park telefono',
    'Villa Escorial Park bodas',
    'Villa Escorial Park Airbnb',
    'Villa Escorial Park sin comisiones',
    'alquiler finca 30 personas Madrid',
    'finca San Lorenzo de El Escorial eventos',
    'finca privada con piscina y cine Madrid'
  ],
  alternates: {
    canonical: 'https://productoraear.com/fincas/villa-escorial-park'
  },
  openGraph: {
    title: 'Villa Escorial Park ® | Alquiler Directo Sin Comisiones · Todo el Año (4.500 €)',
    description: 'Canal oficial y exclusivo de reserva sin intermediarios. Mansión de 20.000 m² en San Lorenzo de El Escorial para 30 personas con piscina, cine y jardines. Despacho directo Productora EAR.',
    url: 'https://productoraear.com/fincas/villa-escorial-park',
    siteName: 'Productora EAR',
    images: [
      {
        url: 'https://img.amplistay.com/villaescorialpark/la-villa:hero/1784796941217-3-IMG-20230327-WA0004.jpg',
        width: 1200,
        height: 630,
        alt: 'Villa Escorial Park Fachada y Jardines San Lorenzo de El Escorial'
      }
    ],
    locale: 'es_ES',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Villa Escorial Park ® | Alquiler Directo Sin Comisiones',
    description: 'Reserva Villa Escorial Park directamente con Productora EAR. Sin recargos de portales, 30 plazas, disponible los 365 días del año.'
  }
};

export default async function VillaEscorialParkPage() {
  const telemetry = await getVillaEscorialTelemetry();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LodgingBusiness', 'EventVenue'],
        '@id': 'https://productoraear.com/fincas/villa-escorial-park#place',
        name: 'Villa Escorial Park (Canal Directo Productora EAR)',
        alternateName: ['Villa Escorial Park', 'La Villa Escorial', 'Villa Escorial Eventos'],
        description: 'Finca privada exclusiva de 20.000 m² con 3.000 m² de jardines arbolados, piscina vallada, sala de cine con sofás de masaje y 9 suites para 30 huéspedes en San Lorenzo de El Escorial. Alquiler directo sin comisiones todo el año.',
        url: 'https://productoraear.com/fincas/villa-escorial-park',
        telephone: '+34 693 693 048',
        email: 'productoraear@gmail.com',
        priceRange: '700€ - 4500€',
        currenciesAccepted: 'EUR',
        paymentAccepted: 'Stripe, Tarjeta de Crédito, Transferencia Bancaria',
        checkinTime: '14:00',
        checkoutTime: '14:00',
        hasMap: 'https://maps.google.com/?q=40.5912,-4.1481',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Carretera M-600 KM 4',
          addressLocality: 'San Lorenzo de El Escorial',
          addressRegion: 'Madrid',
          postalCode: '28200',
          addressCountry: 'ES'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 40.5912,
          longitude: -4.1481
        },
        image: [
          'https://img.amplistay.com/villaescorialpark/la-villa:hero/1784796941217-3-IMG-20230327-WA0004.jpg',
          'https://img.amplistay.com/villaescorialpark/la-villa:hero/1784796938203-0-57.jpg'
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.98',
          reviewCount: '47',
          bestRating: '5',
          worstRating: '1'
        },
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'Piscina Privada Vallada', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Aparcamiento Privado 30 Plazas', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Sala de Cine con 12 Sofás Masaje', value: true },
          { '@type': 'LocationFeatureSpecification', name: '9 Habitaciones para 30 Huéspedes', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Cocina Profesional con 2 Islas para Catering', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Alquiler Todo el Año', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Reserva Directa Sin Comisiones', value: true }
        ],
        maximumAttendeeCapacity: 30
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://productoraear.com/fincas/villa-escorial-park#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Cómo alquilar Villa Escorial Park directamente sin comisiones de portales?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A través de Productora EAR tienes el canal directo oficial sin intermediarios (ahorrando entre un 15% y un 20% de recargo respecto a Airbnb o agencias, lo que supone un ahorro de hasta 950 €). Puedes consultar fechas y formalizar la fianza de 500 € en Stripe o contactar directamente por WhatsApp (+34 693 693 048).'
            }
          },
          {
            '@type': 'Question',
            name: '¿Cuánto cuesta alquilar Villa Escorial Park para fines de semana y entre semana?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'El fin de semana íntegro (desde el viernes a las 14:00h hasta el domingo a las 14:00h) tiene un precio cerrado de 4.500 € para hasta 30 personas. Entre semana (domingo a jueves), la villa se alquila desde 700 € por noche en temporada baja, 800 € en temporada media y 1.400 € en temporada alta.'
            }
          },
          {
            '@type': 'Question',
            name: '¿Se puede alquilar la villa durante todo el año?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí, Villa Escorial Park está disponible los 365 días del año tanto para fines de semana de gala como para escapadas entre semana, semanas completas, retiros corporativos y rodajes cinematográficos.'
            }
          },
          {
            '@type': 'Question',
            name: '¿Qué capacidad de alojamiento tiene Villa Escorial Park?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'La mansión cuenta con 9 dormitorios totalmente acondicionados (incluyendo 3 suites con baño privado) con capacidad homologada para alojar confortablemente a 30 huéspedes.'
            }
          },
          {
            '@type': 'Question',
            name: '¿Cómo funciona la señal de reserva Price-Lock de 500 €?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Para bloquear tu fecha en el calendario oficial se realiza un depósito de 500 € a través de la pasarela segura Stripe Price-Lock. Esto garantiza la exclusividad total de la fecha sin riesgo de sobreventa ni modificaciones de precio.'
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VillaEscorialParkSClassExperience initialTelemetry={telemetry} />
    </>
  );
}
