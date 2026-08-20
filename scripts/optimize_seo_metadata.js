const fs = require('fs');
const path = require('path');

const TARGET_DIR = 'C:\\EAR_OS_V2\\src\\app\\fincas-landing';

// 1. CLIENT COMPONENT (Interacción aislada)
const clientComponentContent = `'use client';

import React, { useState } from 'react';
import { Search, MapPin, Calendar, Music, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function FincasLandingClient() {
  const [province, setProvince] = useState('madrid');
  const [guests, setGuests] = useState('100-200');

  const handleSearch = () => {
    window.location.href = '/fincas?province=' + province + '&guests=' + guests;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-medium mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>Garantía de Acústica & Sin Exclusividades Ocultas</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Encuentra la Finca Perfecta para tu Boda en <span className="text-amber-400">Madrid y Toledo</span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 mb-10">
          Espacios exclusivos con presupuesto transparente, auditoría de sonido en vivo y libertad total de proveedores para el día más importante de tu vida.
        </p>

        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ubicación / Silo GEO</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-amber-400" />
                <select 
                  value={province} 
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="madrid">Madrid (Fincas VIP)</option>
                  <option value="toledo">Toledo (Fincas con Encanto)</option>
                  <option value="guadalajara">Guadalajara (Espacios con Estancia)</option>
                </select>
              </div>
            </div>

            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Número de Invitados</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-amber-400" />
                <select 
                  value={guests} 
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="50-100">50 - 100 invitados</option>
                  <option value="100-200">100 - 200 invitados</option>
                  <option value="200+">Más de 200 invitados</option>
                </select>
              </div>
            </div>

            <div className="text-left flex flex-col justify-end">
              <button 
                onClick={handleSearch}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Search className="w-5 h-5" />
                <span>Buscar Fincas</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Cero Comisiones Ocultas</h3>
                <p className="text-sm text-slate-400 mt-1">Desglose transparente del coste real del alquiler y servicios de la finca.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Acústica Auditada (Productora EAR)</h3>
                <p className="text-sm text-slate-400 mt-1">Garantía de montaje sonoro perfecto para música en vivo y DJ sin multas de sonido.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <ArrowRight className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Libertad de Catering</h3>
                <p className="text-sm text-slate-400 mt-1">Elige los proveedores que tú quieras sin penalizaciones contractuales.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
`;

// 2. SERVER COMPONENT (SSR + Metadata SEO + Schema.org)
const serverComponentContent = `import { Metadata } from 'next';
import FincasLandingClient from './FincasLandingClient';

export const metadata: Metadata = {
  title: 'Fincas para Bodas en Madrid y Toledo | Espacios Exclusivos Sin Comisiones',
  description: 'Alquiler de fincas exclusivas para bodas en Madrid, Toledo y Guadalajara. Presupuesto transparente, libertad de catering y acústica auditada para música en vivo.',
  keywords: [
    'fincas para bodas en madrid',
    'fincas para bodas en toledo',
    'alquiler de fincas bodas',
    'fincas con encanto bodas',
    'fincas de boda sin exclusividad',
    'fincas de boda con alojamiento'
  ],
  alternates: {
    canonical: 'https://fincasparaboda.com/fincas-landing',
  },
  openGraph: {
    title: 'Fincas para Bodas en Madrid y Toledo | Sin Comisiones Ocultas',
    description: 'Encuentra el espacio perfecto para tu boda con acústica auditada y libertad total de proveedores.',
    url: 'https://fincasparaboda.com/fincas-landing',
    siteName: 'FincasParaBoda.com',
    images: [
      {
        url: 'https://fincasparaboda.com/og-fincas.jpg',
        width: 1200,
        height: 630,
        alt: 'Fincas Exclusivas para Bodas en Madrid y Toledo',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Fincas de Bodas en Madrid y Toledo',
    description: 'Catálogo de fincas verificadas para bodas en la zona centro de España.',
    url: 'https://fincasparaboda.com/fincas-landing',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Fincas para Bodas en Madrid',
        url: 'https://fincasparaboda.com/fincas-bodas-madrid'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Fincas para Bodas en Toledo',
        url: 'https://fincasparaboda.com/fincas-bodas-toledo'
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FincasLandingClient />
    </>
  );
}
`;

function optimizeSEO() {
  console.log('🚀 OPTIMIZANDO METADATOS Y ARQUITECTURA SSR PARA SEO LOCAL...');

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  fs.writeFileSync(path.join(TARGET_DIR, 'FincasLandingClient.tsx'), clientComponentContent, 'utf-8');
  fs.writeFileSync(path.join(TARGET_DIR, 'page.tsx'), serverComponentContent, 'utf-8');

  console.log('==================================================');
  console.log('✅ METADATOS SSR Y SCHEMA JSON-LD CONFIGURADOS');
  console.log(`📄 Page SSR: ${path.join(TARGET_DIR, 'page.tsx')}`);
  console.log(`📄 Client Component: ${path.join(TARGET_DIR, 'FincasLandingClient.tsx')}`);
  console.log('==================================================');
}

optimizeSEO();
