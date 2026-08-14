import React from 'react';
import { EdwinAgudeloDossier } from '@/features/artists/ui/EdwinAgudeloDossier';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Edwin Agudelo | Mariachi y Tenor de Gala en España y Europa',
  description:
    'Contrata a Edwin Agudelo, el mariachi más galardonado de España. ' +
    '37 conciertos internacionales, Gladiador Extranjero 2021, certificado por el ' +
    'Consulado de Colombia. Bodas, corporativos, eventos institucionales en Madrid, ' +
    'Barcelona, París, Londres y toda Europa. Depósito reembolsable de 100€.',
  keywords: [
    'mariachi Madrid',
    'mariachi España',
    'mariachi boda',
    'contratar mariachi Europa',
    'mariachi profesional',
    'mariachi corporativo',
    'Edwin Agudelo',
    'tenor mariachi',
    'mariachi Barcelona',
    'mariachi eventos',
    'mariachi sorpresa',
    'mariachi gala',
    'mariachi cumpleaños',
    'mariachi serenata',
    'mariachi residencias',
    'mariachi feria ayuntamiento',
    'mejor mariachi España',
    'mariachi diplomático',
  ],
  openGraph: {
    title: 'Edwin Agudelo — El Mariachi de Referencia en España y Europa',
    description:
      'Solista (1.500€), Ensamble de Gala 6+ (2.800€), Show Cantando a Caballo (5.500€) y ' +
      'Banda Monumental 12+ (9.500€). El único mariachi-empresario certificado diplomáticamente en España.',
    url: 'https://productoraear.com/artistas/edwin-agudelo',
    type: 'profile',
  },
  alternates: {
    canonical: 'https://productoraear.com/artistas/edwin-agudelo',
    languages: {
      'es-ES': 'https://productoraear.com/artistas/edwin-agudelo',
      'es': 'https://productoraear.com/artistas/edwin-agudelo',
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Person', 'PerformingArtist'],
      '@id': 'https://productoraear.com/artistas/edwin-agudelo#artist',
      name: 'Edwin Agudelo',
      alternateName: [
        'Edwin Agudelo Mariachi',
        'Tenor Edwin Agudelo',
        'Mariachi Edwin Agudelo',
      ],
      description:
        'Mariachi y tenor de gala colombiano afincado en España desde 1997. ' +
        'Artista-empresario con 37 conciertos internacionales coordinados, ' +
        'certificado por el Consulado de Colombia en Madrid. ' +
        'Especialista en bodas, eventos corporativos, institucionales y terapia musical ' +
        'para personas mayores (VIMUME) en España y Europa.',
      nationality: { '@type': 'Country', name: 'Colombia' },
      homeLocation: { '@type': 'Place', name: 'Madrid, España' },
      birthDate: '1975-10-28',
      birthPlace: { '@type': 'Place', name: 'Amagá, Antioquia, Colombia' },
      award: [
        'Gladiadores en el Extranjero 2021 — Madrid',
        'Premio Más Latinos — España',
        'Diploma de Honor Consulado de Colombia en Madrid',
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Artista Musical / Tenor de Gala / Empresario Cultural',
        occupationLocation: { '@type': 'Country', name: 'España' },
      },
      performerIn: [
        {
          '@type': 'MusicEvent',
          name: 'Soporte Gira Ana Gabriel — La Cubierta de Leganés',
          location: { '@type': 'Place', name: 'Leganés, Madrid' },
        },
        {
          '@type': 'MusicEvent',
          name: 'Soporte Gira Ana Gabriel — Plaza de Toros de Valencia',
          location: { '@type': 'Place', name: 'Valencia, España' },
        },
        {
          '@type': 'MusicEvent',
          name: 'Mi Propia Realidad — Teatro La Latina',
          startDate: '2014-10-07',
          location: { '@type': 'Place', name: 'Teatro La Latina, Madrid' },
        },
        {
          '@type': 'MusicEvent',
          name: 'FITUR Madrid 2018–2020',
          location: { '@type': 'Place', name: 'IFEMA, Madrid' },
        },
        {
          '@type': 'MusicEvent',
          name: '70º Aniversario Radio Internacional de España',
          location: { '@type': 'Place', name: 'Madrid, España' },
        },
      ],
      areaServed: [
        'España',
        'Francia',
        'Alemania',
        'Reino Unido',
        'Italia',
        'Bélgica',
        'Suiza',
        'Portugal',
        'Países Bajos',
        'Europa',
      ],
      url: 'https://productoraear.com/artistas/edwin-agudelo',
      worksFor: {
        '@type': 'Organization',
        name: 'Productora EAR',
        url: 'https://productoraear.com',
      },
    },
    {
      '@type': 'MusicGroup',
      '@id': 'https://productoraear.com/artistas/edwin-agudelo#group',
      name: 'Edwin Agudelo & Productora EAR',
      genre: ['Mariachi', 'Ranchera', 'Corridos', 'Música Mexicana', 'Banda'],
      areaServed: ['España', 'Europa'],
      offers: [
        {
          '@type': 'Offer',
          name: 'Edwin Agudelo Solista Premium (1 Músico)',
          description:
            'Tenor lírico con sistemas auto-amplificados Bose. Bodas, cumpleaños y serenatas de gala.',
          price: '350',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          url: 'https://productoraear.com/artistas/edwin-agudelo#booking-funnel',
        },
        {
          '@type': 'Offer',
          name: 'Ensamble de Gala Mariachi (6 Músicos)',
          description:
            'Formación clásica de gala con trajes bordados a mano. El estándar de oro de la música charra.',
          price: '750',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Grupo de Gala Imperial (9 Músicos)',
          description:
            'Formación expandida de mariachi que eleva la potencia sonora a un nivel sinfónico clásico.',
          price: '1250',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Banda Monumental EAR (13 Músicos)',
          description:
            'Despliegue sinfónico de mariachis para ayuntamientos, festivales, ferias y licitaciones B2G.',
          price: '1800',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta contratar a Edwin Agudelo para una boda?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El formato solista premium para bodas tiene un coste de 350€. El ensamble de gala tradicional con 6 músicos cuesta 750€. Para grandes recintos disponemos de la formación imperial de 9 músicos por 1.250€ y la monumental de 13 músicos por 1.800€. Puedes bloquear tu fecha con un depósito reembolsable de 100€.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Edwin Agudelo actúa fuera de España, en Europa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Edwin Agudelo cuenta con 37 conciertos internacionales coordinados y está certificado por el Consulado de Colombia en Madrid. Realiza actuaciones en Francia, Alemania, Reino Unido, Italia, Bélgica, Suiza y toda Europa bajo protocolo diplomático.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué diferencia a Edwin Agudelo de otros mariachis en España?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Edwin Agudelo es artista-empresario: ha coordinado la logística técnica de giras de Ana Gabriel, actuado en FITUR y Radio Internacional de España, y ganado el máximo galardón Gladiadores en el Extranjero 2021. Además es el pilar musical de VIMUME, el protocolo de estimulación neuroacústica para personas mayores.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Puede actuar Edwin Agudelo en residencias de mayores?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Edwin Agudelo es el artista principal de VIMUME, la plataforma de estimulación sensorial y reminiscencia musical con frecuencias 40Hz para la Silver Economy. Trabaja con residencias en la España Vaciada (Soria, Teruel, Guadalajara) bajo protocolos no farmacológicos certificados.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué repertorio ofrece Edwin Agudelo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Edwin Agudelo interpreta el cancionero clásico de mariachi (rancheras, corridos, boleros), 18 canciones originales "en positivo" de su autoría, y repertorio personalizado para bodas, cumpleaños, aniversarios, eventos corporativos y ferias institucionales.',
          },
        },
      ],
    },
  ],
};

export default function EdwinAgudeloPage() {
  return (
    <>
      <Script
        id="edwin-agudelo-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#050505]">
        <EdwinAgudeloDossier />
      </main>
    </>
  );
}
