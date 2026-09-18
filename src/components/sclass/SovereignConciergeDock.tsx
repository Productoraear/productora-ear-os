'use client';

import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, Lock, X } from 'lucide-react';
import Link from 'next/link';

interface SovereignConciergeDockProps {
  providerName?: string;
  category?: string;
  directPhone?: string;
}

export default function SovereignConciergeDock({
  providerName = 'Espacio Homologado',
  category = 'Finca',
  directPhone = '+34 693 693 048'
}: SovereignConciergeDockProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const waMessage = encodeURIComponent(
    `Hola Edwin, estoy revisando el dossier auditado de ${providerName} (${category}) y deseo consultar disponibilidad, acústica y reserva garantizada.`
  );

  return (
    <aside aria-label="Concierge flotante EAR OS" className="fixed bottom-5 right-5 z-50 animate-fade-in">
      <div className="bg-[#050508]/95 backdrop-blur-md border border-amber-500/30 rounded-2xl p-3 sm:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center gap-3 sm:gap-4 max-w-[95vw] sm:max-w-md">
        <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 shrink-0">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
        </div>

        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              Garantía S-Class EAR
            </span>
          </div>
          <span className="text-xs text-slate-200 font-medium truncate">
            {providerName}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://wa.me/34693693048?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>

          <Link
            href="/reservar/solista"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs px-2.5 py-2 rounded-xl transition flex items-center gap-1"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">100€ Señal</span>
          </Link>

          <button
            onClick={() => setVisible(false)}
            className="text-slate-500 hover:text-slate-300 p-1 transition"
            aria-label="Cerrar dock concierge"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
