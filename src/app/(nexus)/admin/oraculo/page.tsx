"use client";
import React from 'react';
import { Zap } from 'lucide-react';
export default function OraculoPage() {
  return (
    <div className="p-10 min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center">
      <Zap size={48} className="text-[#d4a855] mb-4 opacity-50" />
      <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Gemelo Neural <span className="text-[#d4a855]">Astra</span></h1>
      <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mt-2">Analítica Predictiva Operativa</p>
    </div>
  );
}
