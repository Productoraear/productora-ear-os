'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Map, 
  Flag, 
  ShieldCheck, 
  Globe, 
  FileText, 
  UserCheck, 
  Layers, 
  Lock,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

/**
 * 🏛️ MODULE: BRIEFING DE ESTADO (S-Class v3.0)
 * Diplomatic / Corporate / Institutional Dashboard.
 * Direction: Editorial Brutalism, Pure Structure, 3D Insight.
 */

export default function BriefingEstadoSClass() {
  const briefingSections = [
    { title: 'Dossier de Inversión', desc: 'Análisis de retorno emocional y capital social del evento.', icon: Briefcase },
    { title: 'Protocolo de Seguridad', desc: 'Blindaje perimetral y gestión de identidades protegidas.', icon: ShieldCheck },
    { title: 'Nodos Logísticos', desc: 'Despliegue geográfico de activos y personal diplomático.', icon: Map },
    { title: 'Impacto Cultural', desc: 'Medición de legado y trascendencia en el entorno local.', icon: Globe }
  ];

  return (
    <div className="bg-[#fcfbf9] text-[#1a1a1a] min-h-screen selection:bg-[#d4af37] selection:text-white font-serif relative overflow-hidden">
      
      {/* HEADER INSTITUCIONAL */}
      <header className="p-12 md:p-24 border-b border-[#1a1a1a]/10 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-6 max-w-2xl">
           <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-[#1a1a1a]/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] font-sans">Institutional Access Only</span>
           </div>
           <h1 className="text-[clamp(3.5rem,8vw,12rem)] font-black uppercase tracking-tighter italic leading-[0.85]">Briefing <br />de <span className="text-[#d4af37]">Estado</span></h1>
           <p className="text-xl md:text-3xl font-medium leading-relaxed max-w-xl text-zinc-500 italic">Arquitectura de eventos para el 1% que define el rumbo de la industria.</p>
        </div>

        <div className="bg-white border border-[#1a1a1a]/10 p-12 rounded-[3.5rem] shadow-2xl flex flex-col justify-center items-center text-center space-y-6">
           <div className="w-20 h-20 bg-[#d4af37] rounded-full flex items-center justify-center text-white scale-125 mb-4 shadow-3xl">
              <Flag size={32} />
           </div>
           <div>
              <div className="text-[10px] uppercase font-black font-sans tracking-[0.3em] mb-2 text-zinc-400">Nivel de Confianza</div>
              <div className="text-4xl font-black font-sans tracking-tighter uppercase italic">Protocolo G5</div>
           </div>
           <button className="px-8 h-12 bg-[#1a1a1a] text-white rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-4 hover:bg-[#d4af37] transition-all">
              <Lock size={12} /> Validar Identidad
           </button>
        </div>
      </header>

      {/* MÉTRICAS DE IMPACTO (Editorial Style) */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-[#1a1a1a]/10">
         {[
           { label: 'Relaciones Diplomáticas', val: '12', details: 'Embajadas en coordinación técnica.', icon: UserCheck },
           { label: 'Inversión Total (est)', val: '€4.2M', details: 'Presupuesto consolidado S-Class.', icon: TrendingUp },
           { label: 'Índice de Exclusividad', val: 'AAA+', details: 'Certificado por EAR OS Labs.', icon: Award },
         ].map((m, i) => (
           <div key={i} className="p-12 border-r border-[#1a1a1a]/10 last:border-0 hover:bg-[#1a1a1a]/[0.02] transition-colors space-y-4">
              <div className="flex items-center gap-4 mb-2">
                 <m.icon size={16} className="text-[#d4af37]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] font-sans text-zinc-400">{m.label}</span>
              </div>
              <div className="text-6xl font-black font-sans tracking-tighter uppercase italic">{m.val}</div>
              <p className="text-sm font-medium italic text-zinc-500">{m.details}</p>
           </div>
         ))}
      </section>

      {/* CORE GRID CONTENT */}
      <main className="grid grid-cols-1 lg:grid-cols-2">
         {/* LEFT SCREEN: DOSSIERS */}
         <div className="p-12 md:p-24 space-y-24 border-r border-[#1a1a1a]/10">
            <h2 className="text-5xl font-black uppercase tracking-tighter italic serif">Módulos de <span className="gold-text">Poder.</span></h2>
            
            <div className="grid grid-cols-1 gap-12">
               {briefingSections.map((sec, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 20 }}
                    className="group flex gap-8 items-start cursor-pointer border-b border-[#1a1a1a]/10 pb-12 last:border-0"
                  >
                     <div className="text-6xl font-black font-sans text-zinc-100 group-hover:text-[#d4af37]/20 transition-colors">0{i+1}</div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                           <sec.icon size={20} className="text-zinc-800" />
                           <h3 className="text-2xl font-black uppercase tracking-tighter">{sec.title}</h3>
                        </div>
                        <p className="text-lg font-medium italic text-zinc-400 max-w-sm">{sec.desc}</p>
                     </div>
                     <div className="ml-auto flex items-center justify-center w-12 h-12 rounded-full border border-[#1a1a1a]/10 group-hover:bg-[#1a1a1a] group-hover:text-white transition-all">
                        <ChevronRight size={24} />
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* RIGHT SCREEN: 3D LOGISTICS VISUALIZATION (Simulation) */}
         <div className="p-12 md:p-24 bg-[#1a1a1a] text-white flex flex-col justify-between space-y-12">
            <div className="space-y-8">
               <div className="flex items-center justify-between border-b border-white/10 pb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Despliegue Geo-Táctico</h3>
                  <div className="bg-[#4dff88]/10 text-[#4dff88] border border-[#4dff88]/20 px-4 py-1 rounded-full text-[10px] font-black uppercase font-sans tracking-[0.2em] animate-pulse">Live Link</div>
               </div>

               {/* SIMULATED MAP INTERFACE */}
               <div className="aspect-square bg-zinc-900 rounded-[3rem] border border-white/5 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                     <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2),transparent_70%)]" />
                  </div>
                  
                  <div className="relative space-y-4 text-center">
                     <Layers size={80} className="text-[#d4af37] mx-auto opacity-40 mb-4 animate-bounce" />
                     <div className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 font-sans">Visualización 3D Deshabilitada</div>
                     <p className="text-xs italic text-zinc-500 max-w-[200px]">Requiere aceleración WebGPU para renderizar la topografía de la finca en tiempo real.</p>
                  </div>
                  
                  {/* FLOATING HUD DATA */}
                  <div className="absolute top-8 left-8 p-4 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 space-y-2">
                     <div className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Nodo: Madrid Central</div>
                     <div className="text-xl font-bold font-mono">51.2N / 3.4W</div>
                  </div>
               </div>
            </div>

            <div className="space-y-8 bg-zinc-900/50 p-12 rounded-[3rem] border border-white/5 shadow-inner">
               <div className="flex items-center gap-6">
                  <FileText size={32} className="text-[#d4af37]" />
                  <div>
                     <div className="text-xl font-black uppercase tracking-tighter">Reporte de Inteligencia</div>
                     <p className="text-xs text-zinc-500 font-sans mt-1">Sincronizado hace 4 minutos con el Hub Central.</p>
                  </div>
               </div>
               <button className="w-full h-16 bg-[#d4af37] text-black rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all">
                  Visualizar Dossier Completo
               </button>
            </div>
         </div>
      </main>

      {/* FOOTER BRUTALISTA */}
      <footer className="p-12 md:p-24 border-t border-[#1a1a1a]/10 text-center space-y-8">
         <Globe size={40} className="mx-auto text-zinc-200 opacity-20" />
         <div className="text-[10px] font-black uppercase tracking-[1em] text-zinc-300">EAR OS // International Diplomatic Office</div>
      </footer>

    </div>
  );
}
