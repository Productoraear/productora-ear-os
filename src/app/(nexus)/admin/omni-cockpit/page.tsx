"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Activity } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#030303] text-[#fcfbf9] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-[#1f1f1f] pb-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 hover:text-[#d4ac0d] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al Centro de Mando
          </Link>
          <div className="flex items-center gap-2 bg-[#121212] border border-[#222] px-3 py-1 rounded-lg text-xs text-[#d4ac0d]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#27ae60]" /> Módulo S-Class Activo
          </div>
        </header>

        <div className="bg-[#0b0b0b] border border-[#1f1f1f] rounded-2xl p-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#d4ac0d] bg-[#d4ac0d]/10 px-3 py-1 rounded-full">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Subsistema en Línea
          </div>
          <h1 className="text-3xl font-black text-white capitalize">Módulo: </h1>
          <p className="text-gray-400 text-sm max-w-2xl font-light">
            Cabina de control operativo para gobierno de datos, persistencia en tiempo real y ejecución soberana.
          </p>
        </div>
      </div>
    </div>
  );
}
