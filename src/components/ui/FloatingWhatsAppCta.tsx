"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Gift, Sparkles, X } from 'lucide-react';

/**
 * 📲 FLOATING WHATSAPP CTA BAR (S-CLASS INSTANT CONVERSION)
 * Barra flotante responsive no invasiva (oculta automáticamente en Admin y Checkout)
 */
export const FloatingWhatsAppCta: React.FC = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Mostrar tras 5 segundos de lectura solo en páginas públicas
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Nunca mostrar en rutas de administración ni en pasarela de checkout
  if (!isVisible || isDismissed || pathname?.startsWith('/admin') || pathname?.startsWith('/checkout')) {
    return null;
  }

  const whatsappUrl = "https://wa.me/34693693048?text=" + encodeURIComponent(
    "Hola Edwin, deseo información para mi evento y aplicar el Bono de 150€ con el cupón EDWIN150-COMPLEMENTOS."
  );

  return (
    <aside aria-label="Contacto Rápido WhatsApp" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative p-4 rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#ecb613]/40 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(236,182,19,0.15)] text-white">
        
        {/* Botón cerrar */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2.5 right-2.5 p-1 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10"
          title="Cerrar aviso"
        >
          <X size={14} />
        </button>

        <div className="flex items-start gap-3.5 pr-4">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 flex items-center justify-center text-[#25D366] shadow-[0_0_12px_rgba(37,211,102,0.4)]">
              <MessageCircle size={20} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">Edwin Agudelo</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">En Línea</span>
            </div>

            <p className="text-xs text-white/70 mt-0.5 leading-snug">
              ¿Tienes dudas con tu fecha? Bloquea en 1 clic con el cupón <strong className="text-[#ecb613]">EDWIN150</strong>.
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-black font-black text-xs uppercase tracking-wide hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_15px_rgba(37,211,102,0.3)]"
              >
                <MessageCircle size={14} />
                <span>Hablar por WhatsApp</span>
              </a>

              <span className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-[#ecb613]">
                <Gift size={12} />
                <span>150€ OFF</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
