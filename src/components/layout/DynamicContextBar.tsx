// src/components/layout/DynamicContextBar.tsx
import React from 'react';

export default function DynamicContextBar() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl">
      <div className="bg-black/85 backdrop-blur-xl border border-[#ecb613]/30 rounded-2xl p-3 shadow-2xl flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ecb613] animate-pulse"></span>
          <span className="text-xs font-medium tracking-wide uppercase text-zinc-300">EAR Neural Navigation</span>
        </div>
        <div className="flex items-center space-x-2">
          <a href="/cotizador" className="px-3 py-1.5 bg-[#ecb613] text-black font-semibold text-xs rounded-xl hover:bg-[#d4a210] transition-all">
            Bespoke Pricer
          </a>
          <a href="/admin/flota" className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl hover:border-[#ecb613]/50 transition-all">
            Estatus Operativo
          </a>
        </div>
      </div>
    </div>
  );
}