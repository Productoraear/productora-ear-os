'use client';

import React from 'react';
import { Award, Users, Palette, Shield, Download, Anchor, Brain, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 🏛️ ABOUT COMPONENT (VAMPIRIZED)
 * La narrativa de autoridad de Productora EAR, adaptada al estándar S-Class.
 */
const About: React.FC = () => {
  return (
    <div className="bg-black min-h-screen selection:bg-[#ecb613] selection:text-black">
      {/* Header: The Philosophy */}
      <section className="relative py-32 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#ecb613]/5 via-black to-black"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <span className="text-[#ecb613] font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">Nuestro Linchpin</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight font-syne tracking-tighter">
            NO ES TÉCNICA.<br/> ES <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-[#8a6b0d]">SINCRONICIDAD EMOCIONAL</span>.
          </h1>
          <p className="text-xl text-white/60 font-light leading-relaxed">
            Nacimos de la resiliencia. Nuestro fundador, Edwin Agudelo, forjó su visión trabajando en aluminio, motos y conduciendo su propio taxi. Esa misma garra es la que inyectamos en cada sistema de impacto que diseñamos.
          </p>
        </div>
      </section>

      {/* Content: The Method */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        
        {/* THE METHODOLOGY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <div className="space-y-12">
            <div className="border-l-2 border-[#ecb613] pl-8">
               <h3 className="text-3xl font-bold text-white mb-4 font-syne">El Valor del Criterio</h3>
               <p className="text-white/50 text-lg leading-relaxed font-light">
                 La mayoría de productoras añaden ruido. Más pantallas, más vatios, más confusión. Nosotros aplicamos la <strong>Navaja de Ockham</strong>: eliminamos lo que no aporta valor para que el mensaje brille.
               </p>
            </div>
            
            <div className="border-l-2 border-white/10 pl-8 group hover:border-[#ecb613] transition-colors duration-700">
               <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-[#ecb613] transition-colors font-syne">Trust Architecture™</h3>
               <p className="text-white/50 text-lg leading-relaxed font-light">
                 No construimos escenarios; construimos <strong>Arquitectura de Confianza</strong>. Cada detalle está diseñado para eliminar la incertidumbre y proyectar autoridad absoluta.
               </p>
            </div>
          </div>
          
          <div className="relative flex justify-center">
             <div className="w-80 h-80 rounded-full border border-white/5 relative flex items-center justify-center p-8 animate-[spin_20s_linear_infinite]">
                <div className="absolute inset-0 border border-dashed border-[#ecb613]/20 rounded-full"></div>
                <div className="w-full h-full bg-gradient-to-br from-[#ecb613]/10 to-transparent rounded-full border border-white/10 flex flex-col items-center justify-center text-center p-6 backdrop-blur-xl shadow-2xl">
                   <Anchor className="text-[#ecb613] mb-4" size={48} />
                   <span className="text-white font-bold text-xl uppercase tracking-tighter font-syne">Impacto Real</span>
                   <p className="text-[10px] text-white/30 mt-2 uppercase tracking-[0.3em]">Garantía S-Class</p>
                </div>
             </div>
          </div>
        </div>

        {/* --- THE 3 SYSTEMS --- */}
        <div className="mb-40">
           <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-white font-syne tracking-tight">NUESTROS SISTEMAS DE EJECUCIÓN</h2>
              <p className="text-white/40 mt-4 font-light">Ingeniería propietaria para resultados predecibles.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* System 1 */}
              <div className="bg-white/5 border border-white/5 p-10 rounded-3xl hover:border-[#ecb613]/30 transition-all duration-700 group backdrop-blur-sm">
                 <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#ecb613] group-hover:text-black transition-all duration-500">
                    <Brain size={28} />
                 </div>
                 <h3 className="text-2xl text-white font-bold mb-4 font-syne">Ingeniería de Contexto</h3>
                 <p className="text-white/40 text-sm leading-relaxed font-light">
                    Antes de mover un equipo, diseñamos el contexto. Creamos fosos estéticos que hacen tu marca incomparable.
                 </p>
              </div>

              {/* System 2 */}
              <div className="bg-white/5 border border-white/5 p-10 rounded-3xl hover:border-[#ecb613]/30 transition-all duration-700 group backdrop-blur-sm">
                 <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#ecb613] group-hover:text-black transition-all duration-500">
                    <Shield size={28} />
                 </div>
                 <h3 className="text-2xl text-white font-bold mb-4 font-syne">Redundancia Militar</h3>
                 <p className="text-white/40 text-sm leading-relaxed font-light">
                    El "Efecto Murphy" es real. Por eso, nuestros sistemas críticos tienen redundancia. Tu tranquilidad es nuestro activo.
                 </p>
              </div>

              {/* System 3 */}
              <div className="bg-white/5 border border-white/5 p-10 rounded-3xl hover:border-[#ecb613]/30 transition-all duration-700 group backdrop-blur-sm">
                 <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#ecb613] group-hover:text-black transition-all duration-500">
                    <Zap size={28} />
                 </div>
                 <h3 className="text-2xl text-white font-bold mb-4 font-syne">Sincronicidad</h3>
                 <p className="text-white/40 text-sm leading-relaxed font-light">
                    Alineamos tecnología y emoción. No es casualidad, es diseño de precisión suiza aplicado a la producción.
                 </p>
              </div>
           </div>
        </div>

        {/* --- BRAND MANUAL / IDENTITY SECTION --- */}
        <div className="border-t border-white/5 pt-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* 1. Identity */}
            <div className="bg-white/5 border border-white/5 rounded-3xl p-10 md:p-16 relative overflow-hidden backdrop-blur-md">
               <h3 className="text-3xl font-bold text-white mb-10 flex items-center gap-4 font-syne">
                 <Palette className="text-[#ecb613]" size={32}/> ADN Visual
               </h3>
               <div>
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-6 block">Paleta Cromática (Aura Onyx)</span>
                 <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2 text-center">
                      <div className="h-16 w-full bg-[#ecb613] rounded-xl shadow-[0_0_20px_rgba(236,182,19,0.3)]"></div>
                      <span className="text-[8px] text-white/40">GOLD</span>
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="h-16 w-full bg-[#8a6b0d] rounded-xl"></div>
                      <span className="text-[8px] text-white/40">BRONZE</span>
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="h-16 w-full bg-black rounded-xl border border-white/10"></div>
                      <span className="text-[8px] text-white/40">ONYX</span>
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="h-16 w-full bg-white/90 rounded-xl"></div>
                      <span className="text-[8px] text-white/40">SILVER</span>
                    </div>
                 </div>
               </div>
            </div>

            {/* 2. Download Kit */}
            <div className="flex flex-col justify-center items-start space-y-8">
               <h3 className="text-4xl font-bold text-white font-syne tracking-tight">¿Necesitas verificar nuestra autoridad?</h3>
               <p className="text-white/50 text-lg font-light leading-relaxed">
                 Descarga nuestro dossier técnico y estratégico. No contiene fotos de relleno, solo especificaciones, casos de éxito y metodología.
               </p>
               <button className="flex items-center gap-4 px-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-[#ecb613] transition-all duration-500 rounded-2xl group shadow-2xl">
                   <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                   Acceder al Dossier (PDF)
                </button>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
};

export default About;
