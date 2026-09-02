import React from 'react';
import { Star, ShieldCheck, MapPin, Globe } from 'lucide-react';

export const ArtistBio: React.FC = () => {
  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-[3.5rem] p-8 md:p-12 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/5 blur-[90px] rounded-full pointer-events-none" />

      <div className="flex justify-between items-start">
        <div>
          <span className="text-[#ecb613] text-xs font-black uppercase tracking-[0.25em] mb-2 block">Referente y Productor Principal</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white font-syne">Edwin Agudelo</h2>
        </div>
        <div className="px-4 py-1.5 rounded-full border border-[#ecb613]/20 bg-[#ecb613]/10 text-[9px] font-black uppercase text-[#ecb613] tracking-widest flex items-center gap-2">
          <ShieldCheck size={12} /> Marca Consolidada
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
        <div className="space-y-6 text-sm text-white/70 leading-relaxed">
          <p>
            **Edwin Agudelo** es el productor ejecutivo y director musical insignia del ecosistema **EAR OS / VIMUME**. Con más de 20 años de trayectoria internacional en la producción de música tradicional mexicana, ha transformado el mariachi de un formato festivo convencional a un servicio premium de alta conversión corporativa y estimulación clínica.
          </p>
          <p>
            Bajo su liderazgo, la agrupación **Mariachi Sol de Oro** y el **Colibrí Symphony Project** han sonorizado los eventos más exigentes de España y América Latina, integrando arreglos sinfónicos impecables y dinámicas acústicas moduladas a frecuencias de curación cognitiva.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block mb-1">Especialidad</span>
              <span className="text-sm font-black uppercase text-white font-mono">Mariachi de Gala</span>
            </div>
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block mb-1">Base</span>
              <span className="text-sm font-black uppercase text-white font-mono">Madrid, España</span>
            </div>
          </div>

          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Zonas de Cobertura Preferente</h4>
            <div className="flex flex-wrap gap-2">
              {['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Málaga', 'Zaragoza'].map((city) => (
                <span key={city} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase text-white/60 tracking-wider">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
