import React from 'react';
import Link from 'next/link';
import { generateArtistSEOMeta } from '@/lib/artists/seo';
import { MapPin, Globe, Sparkles } from 'lucide-react';

export const metadata = generateArtistSEOMeta('eventos', 'principales ciudades');

export default function ArtistasCiudadesPage() {
  const cities = [
    { name: 'Madrid', type: 'Sede Principal' },
    { name: 'Barcelona', type: 'Sucursal Noreste' },
    { name: 'Sevilla', type: 'Sucursal Sur' },
    { name: 'Valencia', type: 'Sucursal Levante' },
    { name: 'Zaragoza', type: 'Sucursal Centro-Norte' },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-40 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
              Cobertura
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              Cities Coverage
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Principales Ciudades
          </h1>
          <p className="text-white/40 text-lg max-w-xl italic">
            Zonas de actuación preferente con desplazamiento bonificado y equipo técnico localizado.
          </p>
        </div>

        {/* List */}
        <div className="grid md:grid-cols-2 gap-6">
          {cities.map((city) => (
            <div key={city.name} className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 flex justify-between items-center hover:border-[#ecb613]/30 transition-all group">
              <div className="space-y-1">
                <h3 className="text-xl font-black uppercase text-white font-syne group-hover:text-[#ecb613] transition-colors">{city.name}</h3>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block font-mono">
                  {city.type}
                </span>
              </div>
              <MapPin size={18} className="text-[#ecb613]" />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
