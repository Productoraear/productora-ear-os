"use client";

import React from 'react';
import {
  Share2,
  Users,
  Percent,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

const AFFILIATE_PARTNERS = [
  {
    id: "AF-01",
    name: "Fincas Madrid Premium",
    type: "Finca / Espacio B2B",
    leadsCount: 14,
    commissionEarned: "1.400,00 €",
    status: "ACTIVO",
    split: "80% Artista / 10% EAR OS / 10% VIMUME"
  },
  {
    id: "AF-02",
    name: "Bodas de Ensueño Toledo",
    type: "Wedding Planner",
    leadsCount: 8,
    commissionEarned: "800,00 €",
    status: "ACTIVO",
    split: "80% Artista / 10% EAR OS / 10% VIMUME"
  },
  {
    id: "AF-03",
    name: "Agencia Espectáculos Centro",
    type: "Promotora B2B",
    leadsCount: 22,
    commissionEarned: "2.200,00 €",
    status: "LIQUIDADO",
    split: "80% Artista / 10% EAR OS / 10% VIMUME"
  }
];

export default function AfiliadosAdminPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            <Share2 className="w-4 h-4 text-[#ecb613]" />
            Red de Afiliados B2B
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-mono">
            Afiliados & Liquidaciones Soberanas
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Gobierno de partners B2B, comisiones cruzadas y reparto inmutable bajo el Split Soberano 80/10/10.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#ecb613]/10 border border-[#ecb613]/30 px-3 py-1.5 rounded-xl text-xs font-mono text-[#ecb613]">
          <ShieldCheck className="w-4 h-4" />
          Regla SSOT: Split 80/10/10
        </div>
      </div>

      {/* Grid de Partners */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white font-mono">Partners Homologados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AFFILIATE_PARTNERS.map((p) => (
            <div key={p.id} className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500">{p.id}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{p.name}</h3>
                  <span className="text-[11px] text-zinc-400">{p.type}</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-400">
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-500 block">LEADS CREADOS</span>
                  <span className="text-white font-bold">{p.leadsCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">COMISIÓN DEVENGADA</span>
                  <span className="text-[#ecb613] font-bold">{p.commissionEarned}</span>
                </div>
              </div>

              <div className="p-2 rounded bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-500">
                {p.split}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
