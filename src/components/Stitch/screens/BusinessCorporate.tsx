'use client';
import React from 'react';

export default function BusinessCorporate() {
  return (
    <div className="bg-[#1a160d] min-h-screen flex flex-col font-sans antialiased text-white">
      <section className="relative px-6 pt-12 pb-6">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-[#ecb613] uppercase border border-[#ecb613]/30 rounded-full bg-[#ecb613]/5">
          B2B Premium
        </span>
        <h1 className="text-white tracking-tight text-[36px] font-extrabold leading-[1.1] mb-4">
          Arquitectura de <span className="text-[#ecb613]">Confianza</span>
        </h1>
        <p className="text-gray-300 text-base font-normal leading-relaxed pb-3">
          Soluciones integrales para directores de marketing y empresarios que exigen resultados medibles y una ejecuciÃ³n impecable.
        </p>
      </section>

      <div className="grid gap-4 px-6 mb-8">
        {[
          { title: 'AnÃ¡lisis de Impacto', desc: 'EvaluaciÃ³n previa de alcance y audiencia.', icon: 'bar_chart' },
          { title: 'DiseÃ±o de Experiencia', desc: 'Narrativa corporativa alineada a la marca.', icon: 'lightbulb' },
          { title: 'Networking Estructurado', desc: 'Conexiones clave entre stakeholders.', icon: 'hub' }
        ].map((item, i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-[#ecb613]/20 bg-white/5 p-4 items-start">
            <div className="p-2 rounded-lg bg-[#ecb613]/10 text-[#ecb613] shrink-0">
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <div>
              <h3 className="text-white text-base font-bold leading-tight">{item.title}</h3>
              <p className="text-[#c9bb92] text-sm font-normal leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 pb-12">
        <button className="w-full py-4 bg-[#ecb613] text-black text-lg font-bold rounded-xl shadow-lg shadow-[#ecb613]/20 flex items-center justify-center gap-2 group">
          Acceso Corporativo <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
