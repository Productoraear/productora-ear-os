"use client";

import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  Volume2,
  FileCheck,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Building2,
  CheckCircle2,
  Search,
  Sparkles
} from 'lucide-react';

const TENDERS = [
  {
    id: "B2G-TO-2026-04",
    municipality: "Ayuntamiento de Méntrida (Toledo)",
    event: "Concierto Fiestas Patronales // Gala Solista",
    budgetMax: "12.500,00 €",
    status: "EN PLAZO",
    legalArticle: "Art. 118 LCSP (< 14.250 €)",
    soundLimit: "68 dBA (Cumple <75 dB)",
    dir3: "L01451025"
  },
  {
    id: "B2G-MA-2026-11",
    municipality: "Ayuntamiento de Navalcarnero (Madrid)",
    event: "Festival Tradición & Memoria VIMUME",
    budgetMax: "14.200,00 €",
    status: "DOCUMENTACIÓN LISTA",
    legalArticle: "Art. 118 LCSP (< 14.250 €)",
    soundLimit: "72 dBA (Cumple <75 dB)",
    dir3: "L01280961"
  },
  {
    id: "B2G-GU-2026-08",
    municipality: "Ayuntamiento de Sigüenza (Guadalajara)",
    event: "Noches Musicales en la Plaza Mayor",
    budgetMax: "9.800,00 €",
    status: "EN REVISIÓN",
    legalArticle: "Art. 118 LCSP (< 14.250 €)",
    soundLimit: "70 dBA (Cumple <75 dB)",
    dir3: "L01192570"
  },
  {
    id: "B2G-TO-2026-09",
    municipality: "Ayuntamiento de Illescas (Toledo)",
    event: "Gala Lírica Senior Día del Mayor",
    budgetMax: "13.800,00 €",
    status: "EN PLAZO",
    legalArticle: "Art. 118 LCSP (< 14.250 €)",
    soundLimit: "65 dBA (Cumple <75 dB)",
    dir3: "L01450812"
  }
];

export default function LicitacionesAdminCatminPage() {
  const [search, setSearch] = useState("");

  const filteredTenders = TENDERS.filter(t =>
    t.municipality.toLowerCase().includes(search.toLowerCase()) ||
    t.event.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* ===================================================================== */}
      {/* 1. HEADER DE PÁGINA CATMÍN                                            */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span>Finanzas & Legal</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">B2G & Licitaciones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            B2G & Contratación Menor (&lt; 14.250 €)
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Homologado &lt;75 dB SPL</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. CATMÍN ROW 1: 4 TARJETAS KPI LEGALES                               */}
      {/* ===================================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Tope Preventivo Legal</span>
            <div className="w-8 h-8 rounded-lg bg-[#ecb613]/10 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-[#ecb613]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">&lt; 14.250 €</div>
          <p className="text-[11px] text-zinc-400 mt-1">Art. 118 LCSP (Margen de seguridad 750€)</p>
          <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Adjudicación Directa Sin Concurso
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Blindaje Acústico</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">&lt; 75 dB SPL</div>
          <p className="text-[11px] text-zinc-400 mt-1">Bose F1 con limitador y dBA certificado</p>
          <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Cero Sanciones Municipales
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Retorno Social VIMUME</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">SROI 4.85x</div>
          <p className="text-[11px] text-zinc-400 mt-1">Impacto cognitivo geriátrico certificado</p>
          <div className="mt-2 flex items-center text-xs font-mono text-cyan-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Modelo 182 AEAT Incluido
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Facturación Electrónica</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">FacturaE</div>
          <p className="text-[11px] text-zinc-400 mt-1">Compatibilidad FACe y código DIR3</p>
          <div className="mt-2 flex items-center text-xs font-mono text-purple-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Cobro en 30 Días Garantizado
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 3. LISTADO DE EXPEDIENTES Y PLIEGOS MENORES (ESTILO CATMÍN)           */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-3">
          <div>
            <h2 className="text-base font-bold font-syne text-white uppercase">
              Expedientes de Contratación Menor Activos
            </h2>
            <p className="text-xs text-zinc-500">Radar municipal en Castilla-La Mancha y Comunidad de Madrid</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar ayuntamiento o pliego..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {filteredTenders.map((tender) => (
            <div
              key={tender.id}
              className="p-5 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#ecb613] font-bold bg-[#ecb613]/10 px-2 py-0.5 rounded border border-[#ecb613]/20">
                    {tender.id}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                    {tender.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#ecb613] transition-colors">
                  {tender.municipality}
                </h3>
                <p className="text-xs text-zinc-300 font-light">
                  {tender.event}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-900 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px]">PRESUPUESTO MÁX.</span>
                  <span className="font-bold text-white">{tender.budgetMax}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">LÍMITE ACÚSTICO</span>
                  <span className="text-emerald-400">{tender.soundLimit}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">RÉGIMEN LEGAL</span>
                  <span className="text-zinc-400 truncate block">{tender.legalArticle}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">CÓDIGO DIR3</span>
                  <span className="text-cyan-400">{tender.dir3}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
