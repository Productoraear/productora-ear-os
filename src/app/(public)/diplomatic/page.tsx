import React from 'react';
import { Shield, ChevronLeft, Award, FileCheck2, Globe, Building2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: "Protocolos de Excelencia Diplomática B2G | Productora EAR",
  description: "Gestión de eventos soberanos para Embajadas, Consulados, Gobiernos y Ayuntamientos. Art. 118 LCSP."
};

export default function DiplomaticPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white p-6 sm:p-12 flex flex-col items-center pt-24 font-sans">
      <nav className="w-full max-w-6xl flex justify-between items-center mb-16 px-4">
        <Link href="/" className="flex items-center space-x-2 text-xs font-bold tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors uppercase font-mono">
          <ChevronLeft size={16} />
          <span>Volver al Diamante</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Shield size={16} className="text-cyan-400" />
          <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-zinc-500">
            Nivel: Diplomático / Gubernamental
          </span>
        </div>
      </nav>

      <div className="w-full max-w-6xl space-y-16">
        <header className="space-y-4">
          <span className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
            Sector Público B2G & Diplomacia
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase font-serif tracking-tight">
            PROTOCOLOS DE <br />
            <span className="text-cyan-400">EXCELENCIA DIPLOMÁTICA</span>
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-zinc-400 font-mono leading-relaxed">
            Gestión de eventos soberanos para Embajadas, Consulados y Ayuntamientos. 
            Cero fallos técnicos. Auditoría forense de riders y confidencialidad absoluta bajo el Art. 118 de la LCSP.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 border border-white/10 rounded-2xl bg-white/5 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Globe size={20} />
            </div>
            <h3 className="text-lg font-bold uppercase font-serif text-white">Asesoramiento Cultural & FITUR</h3>
            <p className="text-sm text-zinc-400 font-mono leading-relaxed">
              Formación de artistas emergentes como embajadores sociales de su país. Programas de gala para FITUR y Ferias Internacionales.
            </p>
          </div>

          <div className="p-8 border border-white/10 rounded-2xl bg-white/5 space-y-4 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Award size={20} />
            </div>
            <h3 className="text-lg font-bold uppercase font-serif text-white">Garantía Contractual & Pliegos</h3>
            <p className="text-sm text-zinc-400 font-mono leading-relaxed">
              Memoria técnica lista en 24h, solvencia técnica, ROLECE, DEUC y póliza de Responsabilidad Civil hasta 2.000.000 €.
            </p>
          </div>
        </section>

        <div className="flex justify-start gap-4">
          <Link
            href="/contratacion/ayuntamientos"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
          >
            Ver Portal de Ayuntamientos
          </Link>
          <Link
            href="/contacto"
            className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all border border-zinc-800"
          >
            Contacto Protocolario
          </Link>
        </div>
      </div>
    </main>
  );
}
