'use client';

import React from 'react';
import { ShieldCheck, Zap, Scale, Building2, Sparkles, CheckCircle2 } from 'lucide-react';

export function TrustStats() {
  return (
    <section className="bg-zinc-950 border-y border-white/10 py-16 px-6 text-white font-sans">
      <div className="max-w-7xl mx-auto text-center space-y-4">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-bold tracking-widest uppercase">
          <ShieldCheck size={12} /> TRANSPARENCIA & RIGOR OPERATIVO S-CLASS
        </div>

        <h3 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight font-syne text-white">
          Sin Cifras de Vanidad. <span className="text-[#ecb613]">Solo Ingeniería y Solvencia Real.</span>
        </h3>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
          Somos una productora de nueva creación impulsada por software soberano. 
          Rechazamos los números inflados y basamos nuestro trabajo en auditoría técnica, 
          cobertura legal estricta y precios inmutables.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8">
          
          <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900/80 rounded-3xl border border-white/5 hover:border-[#ecb613]/30 transition-all space-y-2 text-left">
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block font-bold">Catálogo Soberano</span>
            <p className="text-3xl sm:text-4xl font-mono font-black text-white">24.869</p>
            <p className="text-xs text-zinc-400 font-light">Proveedores B2B Indexados</p>
          </div>

          <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900/80 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all space-y-2 text-left">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">Física Acústica</span>
            <p className="text-3xl sm:text-4xl font-mono font-black text-emerald-400">12 W/pax</p>
            <p className="text-xs text-zinc-400 font-light">Presión Acústica Homologada</p>
          </div>

          <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900/80 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all space-y-2 text-left">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">Marco Legal B2G</span>
            <p className="text-3xl sm:text-4xl font-mono font-black text-blue-400">Art. 118</p>
            <p className="text-xs text-zinc-400 font-light">Contratación Menor LCSP</p>
          </div>

          <div className="p-6 bg-zinc-900/50 hover:bg-zinc-900/80 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all space-y-2 text-left">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">Seguridad Total</span>
            <p className="text-3xl sm:text-4xl font-mono font-black text-purple-300">1.000.000 €</p>
            <p className="text-xs text-zinc-400 font-light">Póliza Responsabilidad Civil</p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default TrustStats;
