import React from 'react';
import { Metadata } from 'next';
import { VimumeClinicalPortal } from '@/components/vimume/VimumeClinicalPortal';

export const metadata: Metadata = {
  title: 'Proyecto VIMUME | Intervención Neuroacústica de Precisión (40 Hz) & Mecenazgo Fiscal',
  description: 'Programa sociosanitario y clínico de estimulación cognitiva a 40 Hz Gamma para Alzheimer y demencias. Presión sonora < 75 dB SPL, cohorte N=45 (p < 0.05) y 80% de deducción fiscal bajo la Ley 49/2002.',
  keywords: [
    'VIMUME',
    'Viaje Musical por la Memoria',
    'estimulación neuroacústica 40 Hz',
    'alzheimer música terapia',
    'reminiscencia sonora',
    'ley 49 2002 mecenazgo',
    'deducción 80 por ciento donación',
    'modelo 182 AEAT',
    'contratación menor residencias art 118 lcsp',
    'Sebastián Díaz colibrí',
    'Productora EAR'
  ],
  openGraph: {
    title: 'Proyecto VIMUME | Neuroestimulación Gamma 40Hz & Mecenazgo Fiscal Ley 49/2002',
    description: 'Evidencia clínica N=45 (p < 0.05), barrera sonora < 75 dB SPL y deducción fiscal del 80% (donar 150 € cuesta solo 30 €).',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Productora EAR OS'
  }
};

export default function VimumePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalOrganization',
        '@id': 'https://www.productoraear.com/vimume#organization',
        name: 'Proyecto VIMUME (Viaje Musical por la Memoria) - Productora EAR',
        url: 'https://www.productoraear.com/vimume',
        description: 'Intervención neuroacústica de precisión a 40 Hz Gamma para personas mayores con deterioro cognitivo y demencia.',
        medicalSpecialty: 'Neurology',
        telephone: '+34693693048',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Méntrida',
          addressRegion: 'Toledo',
          addressCountry: 'ES'
        }
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Intervención Neuroacústica Gamma 40 Hz VIMUME',
        indication: {
          '@type': 'MedicalCondition',
          name: 'Enfermedad de Alzheimer y Deterioro Cognitivo Asociado a la Edad'
        },
        adverseOutcome: 'Barrera acústica preventiva < 75 dB SPL para evitar reclutamiento auditivo coclear.'
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Por qué la estimulación de VIMUME utiliza frecuencias a 40 Hz Gamma?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Las ondas Gamma a 40 Hz inducen sincronización neuronal y activan la microglía cerebral para la eliminación de placas beta-amiloides, según protocolos del MIT Picower Institute.'
            }
          },
          {
            '@type': 'Question',
            name: '¿Cómo funciona la deducción fiscal del 80% de la Ley 49/2002?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Los primeros 250 € donados por una persona física gozan del 80% de deducción en cuota de IRPF, por lo que una aportación de 150 € tiene un coste neto real de solo 30 €.'
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f1e8] selection:bg-[#8b5cf6] selection:text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <VimumeClinicalPortal />
      </main>
    </div>
  );
}
