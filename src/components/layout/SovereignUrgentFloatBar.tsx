'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, AlertCircle, X } from 'lucide-react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

export default function SovereignUrgentFloatBar() {
  const [isOpen, setIsOpen] = useState(false);
  const telHref = `tel:${CENTRALITA_EAR_OS.replace(/\s+/g, '')}`;
  const urgentWaText = encodeURIComponent(
    '🚨 URGENTE EAR OS: Necesito disponibilidad inmediata para un evento en menos de 7 días. Ruego confirmación rápida con Edwin Agudelo.'
  );

  return (
    <div className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-50 flex flex-col items-start">
      {/* Modal Desplegable al Hacer Clic */}
      {isOpen && (
        <div className="mb-3 w-80 p-5 rounded-3xl bg-black/95 text-white border border-[#ecb613]/50 shadow-[0_10px_40px_rgba(236,182,19,0.3)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ecb613]">
                Canal Urgencias &lt; 7 Días
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label="Cerrar modal de urgencias"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed mb-4">
            ¿Tu boda, fiesta o evento es esta misma semana? Atención prioritaria directa con <strong>Edwin Agudelo</strong> con respuesta garantizada en menos de 15 minutos.
          </p>

          <div className="space-y-2">
            <a
              href={`https://wa.me/34693693048?text=${urgentWaText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Prioritario 24h</span>
            </a>

            <a
              href={telHref}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition-all shadow-md"
            >
              <Phone size={15} />
              <span>Llamar Ahora ({CENTRALITA_EAR_OS})</span>
            </a>
          </div>
        </div>
      )}

      {/* Píldora Flotante Compacta */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Atención urgente 24 horas"
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-black via-zinc-900 to-black text-white border border-[#ecb613]/70 shadow-[0_4px_25px_rgba(236,182,19,0.35)] hover:border-[#ecb613] hover:scale-105 transition-all duration-300 backdrop-blur-xl cursor-pointer"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ecb613] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ecb613]"></span>
        </span>
        <Phone size={14} className="text-[#ecb613] group-hover:rotate-12 transition-transform" />
        <span className="font-mono text-xs font-bold tracking-tight text-zinc-200">
          Urgencias 24h
        </span>
      </button>
    </div>
  );
}
