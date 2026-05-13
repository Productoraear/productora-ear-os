import React from 'react';
import { Shield, Cookie, Lock } from 'lucide-react';

export default function CookiesPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white pt-40 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em] mb-8">
            <Cookie size={14} /> Política de Rastreo S-Class
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            POLÍTICA DE <span className="text-[#ecb613]">COOKIES</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto uppercase tracking-widest text-[10px] font-bold leading-relaxed">
            Transparencia Radical en el Ecosistema Digital de EAR OS.
          </p>
        </header>

        <section className="space-y-12 bg-white/[0.02] border border-white/5 p-12 rounded-[3rem]">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#ecb613]/10 rounded-xl text-[#ecb613]"><Shield size={20}/></div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">¿Qué rastreamos?</h2>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Utilizamos cookies propias y de terceros para optimizar la experiencia de navegación en el EAR OS GOLD. Estas herramientas nos permiten medir la eficacia de nuestras asimetrías de marketing y garantizar la seguridad del Ledger de transacciones.
            </p>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#ecb613] rounded-full"/> Cookies Técnicas (Innegociables para el Nexus)</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#ecb613] rounded-full"/> Cookies de Analítica (Google Analytics 4 & Clarity)</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#ecb613] rounded-full"/> Cookies de Personalización (Preferencias del Oráculo)</li>
            </ul>
          </div>

          <div className="pt-8 border-t border-white/5 space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#ecb613]/10 rounded-xl text-[#ecb613]"><Lock size={20}/></div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Tu Soberanía</h2>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Puedes configurar tu navegador para bloquear estas cookies, pero ten en cuenta que la funcionalidad del Agujero Negro y el acceso al Nexus podrían verse comprometidos.
            </p>
          </div>
        </section>

        <footer className="text-center pt-10">
          <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.5em]">Actualizado: Mayo 2026 | EAR OS Sovereign System</p>
        </footer>
      </div>
    </main>
  );
}
