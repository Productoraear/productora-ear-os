"use client";
import React from 'react';
import Link from 'next/link';

export const VimumeFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/80 backdrop-blur-3xl pt-24 pb-12 border-t border-white/5 selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP: CREATIVE AND STRATEGIC ALIGNMENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24 border-b border-white/5 pb-24">
          <div className="space-y-6">
            <h3 className="text-xl font-cinzel font-black tracking-widest text-[#ecb613]">VIMUME</h3>
            <p className="text-sm font-serif italic text-white/30 leading-relaxed max-w-sm">
              Viaje Musical Por la Memoria: Un sistema operativo para el bienestar humano a través de la neuro-musicoterapia.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Colaboración Creativa</h3>
            <p className="text-sm font-bold text-white/80 italic">
              Diseño de experiencia y Web de Inicio en colaboración con:
              <span className="block text-[#ecb613] mt-2 text-lg">Sebastián Díaz</span>
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Infraestructura</h3>
            <p className="text-sm font-bold text-white/80 italic">
              Parte integral del ecosistema <span className="text-[#ecb613]">Productora EAR OS</span>.
            </p>
          </div>
        </div>

        {/* BOTTOM: LEGAL RIGOR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
            © {currentYear} VIMUME // EL VIAJE MUSICAL POR LA MEMORIA · S-CLASS PROTOCOL
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-4">
            {[
              { label: 'Aviso Legal', href: 'https://textos-legales.edgartamarit.com/aviso-legal/' },
              { label: 'Privacidad', href: 'https://textos-legales.edgartamarit.com/politica-de-privacidad/' },
              { label: 'Cookies', href: 'https://textos-legales.edgartamarit.com/politica-de-cookies/' },
            ].map((link) => (
              <a 
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#ecb613] transition-colors underline decoration-white/5 underline-offset-8"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
