import React from 'react';
import { generateArtistSEOMeta } from '@/lib/artists/seo';
import { MapPin, Globe } from 'lucide-react';

export const metadata = generateArtistSEOMeta('eventos', 'todas las provincias');

export default function ArtistasProvinciasPage() {
  const provinces = [
    'Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Zaragoza', 'Málaga', 'Alicante', 'Murcia', 'Cádiz', 'Vizcaya'
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-40 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
              Provincias
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              Provinces Coverage
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Provincias Autorizadas
          </h1>
          <p className="text-white/40 text-lg max-w-xl italic">
            Cobertura nacional absoluta. Disponibilidad logística completa en cualquier rincón del país.
          </p>
        </div>

        {/* Swarm Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {provinces.map((prov) => (
            <div key={prov} className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 flex items-center justify-between hover:border-white/10 transition-colors">
              <span className="text-xs font-black uppercase text-white font-mono tracking-wider">{prov}</span>
              <MapPin size={12} className="text-[#ecb613]" />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
