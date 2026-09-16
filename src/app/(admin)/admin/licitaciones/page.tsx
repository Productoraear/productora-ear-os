"use client";

import React from 'react';
import {
  Landmark,
  ShieldCheck,
  Volume2,
  FileCheck,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

const TENDERS = [
  {
    id: "B2G-TO-2026-04",
    municipality: "Ayuntamiento de Méntrida (Toledo)",
    event: "Concierto Fiestas Patronales // Gala Solista",
    budgetMax: "12.500,00 €",
    status: "EN PLAZO",
    legalArticle: "Art. 118 LCSP (< 14.250 €)",
    soundLimit: "68 dBA (Cumple <75 dB)"
  },
  {
    id: "B2G-MA-2026-11",
    municipality: "Ayuntamiento de Navalcarnero (Madrid)",
    event: "Festival Tradición & Memoria VIMUME",
    budgetMax: "14.200,00 €",
    status: "DOCUMENTACIÓN LISTA",
    legalArticle: "Art. 118 LCSP (< 14.250 €)",
    soundLimit: "72 dBA (Cumple <75 dB)"
  },
  {
    id: "B2G-GU-2026-08",
    municipality: "Ayuntamiento de Sigüenza (Guadalajara)",
    event: "Noches Musicales en la Plaza Mayor",
    budgetMax: "9.800,00 €",
    status: "EN REVISIÓN",
    legalArticle: "Art. 118 LCSP (< 14.250 €)",
    soundLimit: "70 dBA (Cumple <75 dB)"
  }
];

export default function LicitacionesAdminPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            <Landmark className="w-4 h-4 text-[#ecb613]" />
            Sector Público S-Class
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-mono">
            B2G & Licitaciones Menores (&lt; 14.250 €)
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Radar de contratación menor (Art. 118 LCSP) blindado con limitador acústico legal (&lt; 75 dB SPL).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          Techo Legal: 14.250,00 €
        </div>
      </div>

      {/* Grid de Licitaciones */}
      <div className="space-y-4">
        {TENDERS.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#ecb613]/40 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-500">{t.id}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                  {t.legalArticle}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{t.municipality}</h3>
              <p className="text-xs text-zinc-400">{t.event}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 block font-mono">PRESUPUESTO MÁXIMO</span>
                <span className="text-lg font-bold text-white font-mono">{t.budgetMax}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-500 block font-mono">LÍMITE ACÚSTICO</span>
                <span className="text-xs text-[#ecb613] font-mono font-medium flex items-center justify-end gap-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  {t.soundLimit}
                </span>
              </div>

              <button className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#ecb613]/50 text-xs font-mono text-white flex items-center gap-1.5 transition-colors">
                <FileCheck className="w-4 h-4 text-[#ecb613]" />
                Generar Oferta
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
