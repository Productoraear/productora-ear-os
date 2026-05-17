import React from 'react';
import { generateArtistSEOMeta } from '@/lib/artists/seo';
import { Award, ShieldCheck } from 'lucide-react';

export const metadata = generateArtistSEOMeta('ayuntamientos', 'municipios');

export default function ArtistasMunicipiosPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-40 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
              Administraciones
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              Municipalities OS
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Municipios & Ayuntamientos
          </h1>
          <p className="text-white/40 text-lg max-w-xl italic">
            Servicio homologado para concejalías de festejos, ferias tradicionales y semanas culturales.
          </p>
        </div>

        {/* Info Blocks */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 space-y-4">
            <Award className="text-[#ecb613]" size={28} />
            <h3 className="text-lg font-black uppercase tracking-tight">Licitaciones y Contratos Públicos</h3>
            <p className="text-white/50 text-xs leading-relaxed">
              Estamos integrados y certificados en plataformas públicas de contratación estatal. Facilitamos facturación en formato Facturae y cumplimiento reglamentario absoluto.
            </p>
          </div>

          <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 space-y-4">
            <ShieldCheck className="text-[#ecb613]" size={28} />
            <h3 className="text-lg font-black uppercase tracking-tight">Formatos Flexibles</h3>
            <p className="text-white/50 text-xs leading-relaxed">
              Desde shows acústicos de plaza en formaciones de cámara reducidas hasta espectáculos sinfónicos masivos de gran afluencia popular.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
