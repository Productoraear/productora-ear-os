import React from 'react';
import { Metadata } from 'next';
import { VimumeClinicalPortal } from '@/components/vimume/VimumeClinicalPortal';
import * as motion from 'framer-motion/client';

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

      {/* ── HERO 100VH SILICON VALLEY (Reveal Up) ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#090514] to-[#050505] z-0" />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-8 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 text-[#8b5cf6] font-mono text-xs uppercase tracking-widest font-bold">
              Intervención Neuroacústica de Precisión (40 Hz)
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <h1 className="font-syne text-5xl md:text-8xl font-black uppercase text-white tracking-tighter leading-none drop-shadow-2xl">
              PROYECTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#ecb613]">VIMUME</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          >
            <p className="max-w-3xl mx-auto text-lg md:text-2xl text-white/70 font-light leading-relaxed">
              Deducción fiscal del 80% (Ley 49/2002). Reconstruimos la memoria biográfica mediante estimulación acústica de alta resolución.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
            className="pt-8"
          >
            <a href="#portal" className="inline-flex items-center gap-3 bg-[#8b5cf6] text-white font-mono font-black text-sm uppercase tracking-widest px-10 py-5 rounded-xl hover:scale-105 hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(139,92,246,0.5)] animate-pulse">
              COTIZAR AHORA (B2G/Privado)
            </a>
          </motion.div>
        </div>
      </section>

      <main id="portal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 relative z-20 bg-[#050505]">
        <VimumeClinicalPortal />
      </main>
    </div>
  );
}
