"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 selection:bg-[#ecb613]/30 selection:text-black">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 text-[#ecb613] text-xs font-mono border border-[#ecb613]/20">
          <Sparkles size={14} />
          <span>Error 404 // Productora EAR</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight font-syne text-white">
          Página no <span className="text-[#ecb613]">encontrada</span>
        </h1>

        <p className="text-zinc-400 text-sm leading-relaxed">
          La ruta solicitada no existe o ha sido redirigida al nuevo estándar canónico S-Class.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#ecb613] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all font-mono"
          >
            Volver al Inicio
          </Link>
          <Link
            href="/arsenal"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/10 transition-all font-mono"
          >
            Ver Arsenal
          </Link>
        </div>
      </div>
    </main>
  );
}