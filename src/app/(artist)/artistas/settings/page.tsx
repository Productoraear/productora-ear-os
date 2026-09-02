'use client';

import React from 'react';
import { Settings as SettingsIcon, ShieldCheck } from 'lucide-react';

export default function ArtistSettingsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Ajustes
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Settings OS
          </span>
        </div>

        <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-6">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Configuración de Seguridad</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-6 bg-white/5 rounded-2xl">
              <div>
                <span className="text-xs font-black uppercase text-white block">Doble Verificación MFA</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Código PIN 7777 activo</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                ACTIVO
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
