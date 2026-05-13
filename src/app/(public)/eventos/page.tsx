'use client';

import React from 'react';
import CategoryRouter from '@/features/discovery/CategoryRouter';
import { Shield, Target, Zap } from 'lucide-react';

/**
 * 🏢 VERTICAL V1 - ARQUITECTURA DE EVENTOS (AURA ONYX)
 * Sustitución del sistema legacy por el estándar S-Class.
 */

export default function EventosPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      {/* Hero Section */}
      <section className="px-6 mb-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 bg-[#ecb613]/20 rounded-lg flex items-center justify-center text-[#ecb613] border border-[#ecb613]/30">
             <Shield size={16} />
           </div>
           <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]">Vertical de Producción V1</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 font-syne leading-[0.85]">
          Arquitectura e <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-white/60">Ingeniería</span> de Eventos.
        </h1>
        
        <p className="text-xl md:text-2xl text-white/40 font-medium max-w-2xl leading-relaxed mb-12">
          La mayoría vende ruido y logística. Nosotros diseñamos <span className="text-white">Sistemas de Impacto</span>. 
          Construimos la infraestructura invisible para que el mensaje sea inevitable.
        </p>

        <div className="flex flex-wrap gap-8 py-10 border-y border-white/5">
          <Stat value="15+" label="Años de Trayectoria" />
          <Stat value="500+" label="Equipos Propietarios" />
          <Stat value="0" label="Fallas Críticas" />
        </div>
      </section>

      {/* Discovery Engine */}
      <CategoryRouter type="V1" />

      {/* Infrastructure Philosophy */}
      <section className="py-32 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
               {/* Placeholder para Video/Imagen S-Class */}
               <div className="absolute inset-0 bg-gradient-to-tr from-[#ecb613]/10 to-transparent" />
               <Target className="text-white/10" size={120} />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-10 -right-10 hidden md:block p-8 bg-[#0d0d0d] border border-[#ecb613]/30 rounded-2xl shadow-2xl backdrop-blur-xl">
               <span className="text-[#ecb613] font-black text-4xl mb-2 block tracking-tighter">S-Class</span>
               <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">Ecosistema Blindado</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-8 font-syne">Infraestructura <span className="text-[#ecb613]">Crítica</span> para misiones que no pueden fallar.</h2>
            <p className="text-white/40 text-lg leading-relaxed mb-10">
              No alquilamos altavoces; desplegamos sistemas de redundancia militar. Si no se puede medir, no lo hacemos. Equipamiento táctico para entornos donde la perfección es el único estándar aceptable.
            </p>
            <div className="space-y-6">
              <Feature icon={<Zap size={18} />} title="Respuesta en Milisegundos" desc="Sistemas activos que corrigen desviaciones en tiempo real." />
              <Feature icon={<Shield size={18} />} title="Protocolo Plan B" desc="Redundancia total en audio, iluminación y energía." />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-4xl font-black text-white font-syne mb-1 tracking-tighter">{value}</span>
      <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">{label}</span>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 flex items-center justify-center text-[#ecb613] shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-bold mb-1">{title}</h4>
        <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
