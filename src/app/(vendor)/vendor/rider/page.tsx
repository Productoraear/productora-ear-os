import React from 'react';
import { Speaker, Zap, ShieldCheck } from 'lucide-react';

export default function VendorRiderPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black font-syne text-white tracking-tight">Rider Acústico & Técnico S-Class</h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
          Configuración determinista de potencia acústica a 12 W/pax, consolas digitales y microfonía.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-3">
          <span className="text-xs font-mono uppercase text-[#ecb613] font-bold block">Consola Mezcladora</span>
          <h3 className="text-xl font-bold font-syne text-white">Behringer XR18 Digital</h3>
          <p className="text-xs text-zinc-400 font-light">18 canales, control por iPad/Wi-Fi integrado y procesamiento DSP.</p>
        </div>

        <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-3">
          <span className="text-xs font-mono uppercase text-[#ecb613] font-bold block">Microfonía Inalámbrica</span>
          <h3 className="text-xl font-bold font-syne text-white">Shure Axient Digital</h3>
          <p className="text-xs text-zinc-400 font-light">Doble canal encriptado con gestión de frecuencias en tiempo real.</p>
        </div>
      </div>
    </div>
  );
}
