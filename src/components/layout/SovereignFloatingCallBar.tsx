'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle } from 'lucide-react';

export function SovereignFloatingCallBar() {
  const pathname = usePathname();

  // No mostrar en panel de administración
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const phone = '+34693693048';
  const displayPhone = '693 693 048';
  const whatsappUrl = `https://wa.me/34693693048?text=${encodeURIComponent(
    'Hola Productora EAR, estoy viendo la web y me gustaría consultar disponibilidad y presupuesto para mi evento.'
  )}`;

  return (
    <>
      {/* 📱 MOBILE STICKY BAR: Visible en pantallas < md (la mayor fuente de tráfico de bodas/eventos) */}
      <aside 
        aria-label="Atención Telefónica y WhatsApp"
        className="md:hidden fixed bottom-0 left-0 right-0 z-[95] bg-[#09090e]/95 backdrop-blur-xl border-t border-amber-500/30 p-2.5 px-3 flex items-center justify-between gap-2 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
      >
        <a
          href={`tel:${phone}`}
          className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 active:scale-95 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
        >
          <Phone size={15} className="fill-current" />
          <span>Llamar {displayPhone}</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-3 rounded-xl bg-[#25D366] active:scale-95 text-white font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-[#25D366]/20"
        >
          <MessageCircle size={15} className="fill-current" />
          <span>WhatsApp</span>
        </a>
      </aside>

      {/* 💻 DESKTOP FLOATING PILL: Visible en pantallas md+ en esquina inferior derecha */}
      <aside 
        aria-label="Contacto Directo Gabinete Técnico"
        className="hidden md:flex fixed bottom-6 right-6 z-[95] items-center gap-2 bg-[#09090e]/90 backdrop-blur-xl border border-amber-500/30 p-1.5 pl-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] hover:border-amber-400 transition-all duration-300"
      >
        <div className="flex flex-col text-right pr-2">
          <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-bold">
            Atención Telefónica 24/7
          </span>
          <a
            href={`tel:${phone}`}
            className="text-xs font-mono font-black text-white hover:text-amber-400 transition-colors"
          >
            +34 {displayPhone}
          </a>
        </div>

        <a
          href={`tel:${phone}`}
          aria-label="Llamar a Productora EAR"
          className="p-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full transition-transform hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/30"
          title="Llamar directamente"
        >
          <Phone size={16} className="fill-current" />
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="p-3 bg-[#25D366] hover:bg-emerald-500 text-white rounded-full transition-transform hover:scale-105 active:scale-95 shadow-md shadow-[#25D366]/30"
          title="Enviar WhatsApp"
        >
          <MessageCircle size={16} className="fill-current" />
        </a>
      </aside>
    </>
  );
}

export default SovereignFloatingCallBar;
