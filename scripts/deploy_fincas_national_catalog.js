const fs = require('fs');
const path = require('path');

const TARGET_DIR = 'C:\\EAR_OS_V2\\src\\app\\fincas';

// 1. CLIENT COMPONENT (Catálogo Interactivo Nacional)
const clientComponentContent = `'use client';

import React, { useState } from 'react';
import { MapPin, Users, Music, ShieldCheck, CheckCircle2, SlidersHorizontal } from 'lucide-react';

const PROVINCIAS_ESPANAS = [
  'Madrid', 'Toledo', 'Guadalajara', 'Barcelona', 'Valencia', 'Alicante', 
  'Sevilla', 'Málaga', 'Cádiz', 'Zaragoza', 'Murcia', 'Baleares', 'Las Palmas', 
  'A Coruña', 'Asturias', 'Bizkaia', 'Girona', 'Tarragona', 'Valladolid', 'Córdoba'
];

export default function FincasNationalCatalogClient() {
  const [selectedProvince, setSelectedProvince] = useState('Todas');
  const [guestFilter, setGuestFilter] = useState('all');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* HEADER DE BÚSQUEDA NACIONAL */}
      <section className="bg-slate-900 border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Catálogo Nacional de Fincas para Bodas
          </h1>
          <p className="text-slate-400 mb-8 max-w-2xl">
            Espacios verificados en toda España con garantía de acústica, libertad de proveedores y auditoría técnica de Productora EAR.
          </p>

          {/* BARRA DE FILTROS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Provincia</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-amber-400" />
                <select 
                  value={selectedProvince} 
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Todas">Toda España (50 Provincias)</option>
                  {PROVINCIAS_ESPANAS.map((prov) => (
                    <option key={prov} value={prov.toLowerCase()}>{prov}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Capacidad de Invitados</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-4 h-4 text-amber-400" />
                <select 
                  value={guestFilter} 
                  onChange={(e) => setGuestFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Cualquier capacidad</option>
                  <option value="small">Íntima (Hasta 80 invitados)</option>
                  <option value="medium">Mediana (80 - 180 invitados)</option>
                  <option value="large">Gran Formato (+180 invitados)</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Aplicar Filtros</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GRID DE RESULTADOS CON INTEGRACIÓN DE PROVEEDORES EAR */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* TARJETA DE EJEMPLO INTEGRADORA */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/50 transition">
            <div className="h-48 bg-slate-800 relative">
              <div className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verificada EAR OS</span>
              </div>
            </div>
            
            <div className="p-5">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Toledo / Méntrida</span>
              <h3 className="text-xl font-bold text-white mt-1">Finca Valparaíso & Eventos</h3>
              <p className="text-sm text-slate-400 mt-2">Espacio de gran formato con jardines de piedra y zonas de baile sin limitación acústica.</p>
              
              {/* MODULO DE PROVEEDORES ASOCIADOS */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <span className="text-xs font-medium text-slate-400 block mb-2">Servicios Incluidos en Finca:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Catering Libre
                  </span>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Music className="w-3 h-3 text-amber-400" /> Productora EAR Live
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Capacidad</span>
                  <span className="text-sm font-semibold text-slate-200">Hasta 250 pax</span>
                </div>
                <button className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition">
                  Ver Ficha y Disponibilidad
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
`;

// 2. SERVER COMPONENT (SSR + Metadata SEO Nacional)
const serverComponentContent = `import { Metadata } from 'next';
import FincasNationalCatalogClient from './FincasNationalCatalogClient';

export const metadata: Metadata = {
  title: 'Catálogo de Fincas para Bodas en España | Búsqueda por Provincias',
  description: 'Directorio nacional de fincas para bodas en España. Espacios verificados con auditoría de sonido, libertad de catering y cobertura técnica de Productora EAR.',
  keywords: [
    'fincas para bodas en españa',
    'fincas para bodas por provincias',
    'alquiler fincas eventos españa',
    'fincas de boda con sonido en vivo'
  ],
  alternates: {
    canonical: 'https://fincasparaboda.com/fincas',
  },
  openGraph: {
    title: 'Catálogo Nacional de Fincas para Bodas | fincasparaboda.com',
    description: 'Encuentra y reserva fincas para bodas en cualquier provincia de España con presupuesto garantizado.',
    url: 'https://fincasparaboda.com/fincas',
    siteName: 'FincasParaBoda.com',
    locale: 'es_ES',
    type: 'website',
  },
};

export default function Page() {
  return <FincasNationalCatalogClient />;
}
`;

function deployNationalCatalog() {
  console.log('🚀 DESPLIEGUE AUTOMÁTICO DE CATÁLOGO NACIONAL DINÁMICO (/fincas)...');

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  fs.writeFileSync(path.join(TARGET_DIR, 'FincasNationalCatalogClient.tsx'), clientComponentContent, 'utf-8');
  fs.writeFileSync(path.join(TARGET_DIR, 'page.tsx'), serverComponentContent, 'utf-8');

  console.log('==================================================');
  console.log('✅ RUTA DINÁMICA /fincas DESPLEGADA CON ÉXITO');
  console.log(`📄 Page SSR: ${path.join(TARGET_DIR, 'page.tsx')}`);
  console.log(`📄 Client Component: ${path.join(TARGET_DIR, 'FincasNationalCatalogClient.tsx')}`);
  console.log('==================================================');
}

deployNationalCatalog();
