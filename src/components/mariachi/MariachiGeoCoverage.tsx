"use client";

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Globe, Sparkles } from 'lucide-react';

const TOP_HUBS = [
  { name: 'Madrid Capital & Comunidad', hub: 'Madrid Sur / Plaza Elíptica', distanceNote: 'Despacho metropolitano inmediato' },
  { name: 'Toledo & Fincas de Méntrida', hub: 'Méntrida / Torrijos / Casco', distanceNote: 'Sede fundacional EAR OS' },
  { name: 'Barcelona & Cataluña', hub: 'Barcelona / Vallès / Penedès', distanceNote: 'Bodas en masías y eventos' },
  { name: 'Valencia & Costa Blanca', hub: 'Valencia / Alicante', distanceNote: 'Festejos populares y cócteles' },
  { name: 'Sevilla & Andalucía Occidental', hub: 'Sevilla / Triana / Aljarafe', distanceNote: 'Haciendas y aniversarios' },
  { name: 'Málaga & Costa del Sol', hub: 'Málaga / Marbella / Sotogrande', distanceNote: 'Eventos internacionales VIP' },
  { name: 'Bilbao & Zona Norte', hub: 'Bilbao / San Sebastián / Vitoria', distanceNote: 'Conciertos y bodas de gala' }
];

const PROVINCIAS_ESPANA = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona',
  'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca',
  'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Illes Balears', 'Jaén',
  'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia',
  'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife',
  'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid',
  'Vizcaya', 'Zamora', 'Zaragoza', 'Ceuta', 'Melilla'
];

export default function MariachiGeoCoverage() {
  const [selectedCity, setSelectedCity] = useState<string>('Madrid');

  const handleCitySelect = (provincia: string) => {
    setSelectedCity(provincia);
    const element = document.getElementById('cotizador-uber');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="ciudades" className="space-y-12">
      {/* Título */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
          <Compass size={14} />
          COBERTURA NACIONAL S-CLASS // RED 50 PROVINCIAS
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
          Mariachis en tu Ciudad con <br />
          <span className="text-[#ecb613]">Despacho por Kilometraje Real</span>
        </h2>
        <p className="text-sm sm:text-base text-white/60 font-sans">
          Sin recargos arbitrarios. Calculamos la distancia precisa en kilómetros (1,50 €/km a partir del km 50) desde el centro logístico más próximo a tu ubicación.
        </p>
      </div>

      {/* Hubs Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {TOP_HUBS.map((hub, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#060609] border border-white/10 hover:border-[#ecb613]/40 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#ecb613] flex items-center gap-1.5">
                  <MapPin size={13} />
                  Hub Activo
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  Nodo verificado
                </span>
              </div>
              <h4 className="text-base font-bold font-syne text-white group-hover:text-[#ecb613] transition-colors">
                {hub.name}
              </h4>
              <p className="text-xs text-white/50 font-sans">
                {hub.distanceNote}
              </p>
            </div>

            <button
              onClick={() => handleCitySelect(hub.name.split(' ')[0])}
              className="mt-4 text-xs font-mono text-white/60 group-hover:text-white flex items-center gap-1 pt-2 border-t border-white/5 cursor-pointer"
            >
              Cotizar en esta zona &rarr;
            </button>
          </div>
        ))}
      </div>

      {/* Grid pSEO de 50 Provincias */}
      <div className="rounded-3xl bg-[#050508] border border-white/10 p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-lg font-bold font-syne text-white flex items-center gap-2">
              <Globe size={18} className="text-[#ecb613]" />
              Red Provincial Completa de Mariachis en España
            </h3>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Haz clic en cualquier provincia para abrir el cálculo logístico automático
            </p>
          </div>
          <span className="text-xs font-mono text-[#ecb613]">
            50 Provincias Disponibles 24/7
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-mono">
          {PROVINCIAS_ESPANA.map((prov, i) => (
            <button
              key={i}
              onClick={() => handleCitySelect(prov)}
              className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-[#ecb613]/10 hover:text-[#ecb613] border border-white/5 text-left text-white/70 transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="truncate">{prov}</span>
              <span className="text-[10px] text-white/20 group-hover:text-[#ecb613]">&rarr;</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
