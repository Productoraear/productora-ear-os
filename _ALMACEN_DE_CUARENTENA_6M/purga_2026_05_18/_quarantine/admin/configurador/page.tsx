'use client';

import React from 'react';
import { Lock, Zap, ShieldCheck, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function ConfiguradorPlaceholder() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-12">
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-ear-gold/20 blur-2xl rounded-full animate-pulse" />
          <Lock className="text-ear-gold w-24 h-24 relative" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-syne">
            FASE 4: <span className="text-ear-gold">IGNICIÓN FINANCIERA</span>
          </h1>
          <p className="text-xl text-white/40 font-light tracking-widest uppercase">
            Acceso restringido por protocolo de seguridad Drift Gate
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-4 justify-center text-ear-gold text-xs font-bold tracking-[0.3em] uppercase">
            <Cpu size={16} />
            Estatus: Veto Estratégico Activo
          </div>
          <p className="text-sm text-white/60 leading-relaxed max-w-xl mx-auto">
            El motor de cotización Bespoke y el Ledger de Comisiones están actualmente en fase de 
            scaffolding. La activación requiere la restauración total del oráculo Astra 
            y la validación del Drift Score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/50 flex flex-col items-center gap-3">
            <Zap className="text-ear-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Motor de Demanda</span>
            <span className="text-xs font-bold text-green-500/80">PREPARADO</span>
          </div>
          <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/50 flex flex-col items-center gap-3">
            <ShieldCheck className="text-ear-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Bóveda de Datos</span>
            <span className="text-xs font-bold text-green-500/80">PROTEGIDA</span>
          </div>
        </div>

        <Link 
          href="/"
          className="inline-block px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.4em] rounded-full hover:scale-105 transition-all shadow-2xl"
        >
          Volver al Centro de Mando
        </Link>
      </div>
    </div>
  );
}
