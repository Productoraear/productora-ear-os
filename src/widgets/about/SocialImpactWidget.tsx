'use client';

import React from 'react';
import { Heart, Brain, Users, Zap, ShieldCheck, Sun, Anchor } from 'lucide-react';

/**
 * 🏛️ EAR OS GOLD - SOCIAL IMPACT WIDGET (VIAJE MUSICAL)
 * Transmutación de 'SocialProjects.tsx' al estándar Aura Onyx.
 */

const SocialImpactWidget: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
           <Heart size={14} fill="currentColor" /> Proyecto Buque Insignia: VIMUME
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-syne mb-8">
          Viaje Musical por <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">la Memoria</span>
        </h2>
        <p className="text-xl text-white/40 max-w-3xl mx-auto leading-relaxed">
          Reconectando vidas a través de la música. Una iniciativa terapéutica diseñada para devolver la identidad y la emoción a nuestros mayores mediante ingeniería de contexto sonora.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* The 3 Pillars of Impact */}
        <div className="space-y-6">
          <Pillar 
            icon={<Anchor className="text-red-500" />} 
            title="La Copla & Resiliencia" 
            desc="Música de supervivencia. Conectamos con emociones de fortaleza para reactivar la dignidad y la raíz del paciente."
          />
          <Pillar 
            icon={<Sun className="text-yellow-500" />} 
            title="Ye-yé & Vitalidad" 
            desc="Activación motora y cambio de estado de ánimo. De lo pasivo a lo activo a través del ritmo generacional."
          />
          <Pillar 
            icon={<Users className="text-orange-500" />} 
            title="Verbena & Comunidad" 
            desc="Sonidos que significan familia. Un himno colectivo que combate el aislamiento social nota a nota."
          />
        </div>

        {/* Impact Visual/Metrics */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 relative overflow-hidden flex flex-col justify-center">
           <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 blur-[80px] rounded-full" />
           
           <div className="relative z-10 space-y-12">
              <div>
                <span className="text-6xl font-black text-white font-syne block mb-2">150+</span>
                <span className="text-xs text-white/20 font-black uppercase tracking-[0.4em]">Familias Impactadas</span>
              </div>
              <div>
                <span className="text-6xl font-black text-[#ecb613] font-syne block mb-2">90%</span>
                <span className="text-xs text-white/20 font-black uppercase tracking-[0.4em]">Mejora Emocional Registrada</span>
              </div>
              <blockquote className="border-l-4 border-pink-500 pl-6 italic text-white/60 text-lg">
                "La música es la última puerta que se cierra antes del olvido. Nosotros tenemos la llave."
              </blockquote>
           </div>
        </div>
      </div>

      {/* Methodology Shield */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-10 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <ShieldCheck size={180} className="text-[#ecb613]" />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div>
              <h3 className="text-3xl font-black uppercase mb-6 font-syne">Rigor <span className="text-[#ecb613]">Científico</span></h3>
              <p className="text-white/40 leading-relaxed mb-8">
                No hacemos entretenimiento; aplicamos clínica. Cada intervención es precedida por un **Mapeo de la Banda Sonora Vital™**, identificando anclas emocionales específicas de la biografía de cada mayor.
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black uppercase text-white/60">Audio Hi-Fi</div>
                <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black uppercase text-white/60">Protocolo Vimume</div>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <MethodCard icon={<Brain size={20}/>} label="Reminiscencia" />
              <MethodCard icon={<Zap size={20}/>} label="Activación" />
              <MethodCard icon={<ShieldCheck size={20}/>} label="Validación" />
              <MethodCard icon={<Users size={20}/>} label="Reconexión" />
           </div>
        </div>
      </div>
    </section>
  );
};

function Pillar({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group">
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{title}</h4>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function MethodCard({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="p-6 bg-black border border-white/5 rounded-2xl flex flex-col items-center text-center gap-3">
       <div className="text-[#ecb613]">{icon}</div>
       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</span>
    </div>
  );
}

export default SocialImpactWidget;
