'use client';

import React from 'react';
import CategoryRouter from '@/features/discovery/CategoryRouter';
import { Star, TrendingUp, ShieldCheck } from 'lucide-react';

/**
 * 🎨 VERTICAL V2 - INGENIERÍA DE TALENTO (AURA ONYX)
 * Transformación de la gestión artística en un activo de inversión.
 */

export default function ArtistasPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      {/* Hero Section */}
      <section className="px-6 mb-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 bg-[#ecb613]/20 rounded-lg flex items-center justify-center text-[#ecb613] border border-[#ecb613]/30">
             <Star size={16} />
           </div>
           <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]">Vertical de Talento V2</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 font-syne leading-[0.85]">
          Arquitectura de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-white/60">Legado</span> Artístico.
        </h1>
        
        <p className="text-xl md:text-2xl text-white/40 font-medium max-w-2xl leading-relaxed mb-12">
          El talento sin estructura es efímero. Aplicamos metodología empresarial a carreras artísticas. 
          Diseñamos el <span className="text-white">Edificio que Protege</span> y rentabiliza tu arte.
        </p>

        <div className="flex flex-wrap gap-12 py-10 border-y border-white/5">
          <Highlight value="36" label="Conciertos con Éxito" />
          <Highlight value="95%" label="Efectividad Operativa" />
          <Highlight value="Elite" label="Nivel de Curaduría" />
        </div>
      </section>

      {/* Discovery Engine */}
      <CategoryRouter type="V2" />

      {/* Academia Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-b from-white/[0.03] to-transparent rounded-[3rem] p-12 md:p-24 border border-white/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ecb613]/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <span className="text-[#ecb613] text-xs font-black uppercase tracking-widest mb-6 block">Academia Diamante Rojo</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10 font-syne leading-tight">
                Forjando el <span className="text-white">Patrimonio</span> del mañana.
              </h2>
              <div className="space-y-8">
                <Step number="01" title="Auditoría de Aura" desc="Analizamos la identidad única del artista y su potencial de escalado B2B." />
                <Step number="02" title="Ingeniería de Carrera" desc="Diseño de planos tácticos para la monetización y el posicionamiento de marca." />
                <Step number="03" title="Ejecución S-Class" desc="Implementación en los escenarios más exigentes del ecosistema global." />
              </div>
            </div>
            
            <div className="flex flex-col justify-center gap-8">
              <div className="p-10 bg-[#0d0d0d]/80 backdrop-blur-xl border border-white/10 rounded-3xl">
                <ShieldCheck className="text-[#ecb613] mb-6" size={40} />
                <h3 className="text-2xl font-black uppercase mb-4">Protección de Activos</h3>
                <p className="text-white/40 leading-relaxed italic">
                  "No representamos nombres; construimos marcas indestructibles que trascienden la logística del evento."
                </p>
              </div>
              <div className="p-10 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-[#ecb613]/50 transition-colors">
                <div className="flex items-center gap-6">
                  <TrendingUp className="text-[#ecb613]" size={32} />
                  <div>
                    <h4 className="text-xl font-bold uppercase tracking-tight">Plan de Carrera</h4>
                    <p className="text-white/40 text-xs uppercase tracking-widest font-black">Auditado por Nexo EAR</p>
                  </div>
                </div>
                <span className="text-3xl opacity-20 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Highlight({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-5xl font-black text-white font-syne mb-1 tracking-tighter">{value}</span>
      <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">{label}</span>
    </div>
  );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-6 group">
      <span className="text-3xl font-black text-white/10 group-hover:text-[#ecb613] transition-colors duration-500 font-syne">{number}</span>
      <div>
        <h4 className="text-xl font-bold uppercase tracking-tight text-white mb-2">{title}</h4>
        <p className="text-white/40 text-sm leading-relaxed max-w-sm">{desc}</p>
      </div>
    </div>
  );
}
