import React from 'react';
import { Award, Users, Palette, Shield, Download, Key, MessageSquare, Compass, Layout, Zap, Anchor, Layers, Cpu, Brain } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-20 bg-black min-h-screen">
      {/* Header: The Philosophy */}
      <div className="relative py-24 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <span className="text-ear-gold font-body font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Nuestro Linchpin</span>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-8 leading-tight">
            NO ES TÉCNICA.<br/> ES <span className="text-ear-gold">SINCRONICIDAD EMOCIONAL</span>.
          </h1>
          <p className="text-xl text-gray-300 font-body leading-relaxed font-light">
            Nacimos de la resiliencia. Nuestro fundador, Edwin Agudelo, forjó su visión trabajando en aluminio, motos y conduciendo su propio taxi, siempre respaldado por una madre que veía en él a un "echao pa'lante". Esa misma garra es la que inyectamos en cada sistema de impacto que diseñamos.
          </p>
        </div>
      </div>

      {/* Content: The Method */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        
        {/* THE METHODOLOGY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <div className="border-l-2 border-ear-gold pl-6">
               <h3 className="text-2xl font-display font-bold text-white mb-2">El Valor del Criterio</h3>
               <p className="text-gray-400 text-lg leading-relaxed">
                 La mayoría de productoras añaden ruido. Más pantallas, más vatios, más confusión. Nosotros aplicamos la <strong>Navaja de Ockham</strong>: la solución más simple y elegante suele ser la correcta. Eliminamos lo que no aporta valor para que el mensaje brille.
               </p>
            </div>
            
            <div className="border-l-2 border-white/20 pl-6 group hover:border-ear-gold transition-colors">
               <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-ear-gold transition-colors">Trust Architecture™</h3>
               <p className="text-gray-400 text-lg leading-relaxed">
                 No construimos escenarios; construimos <strong>Arquitectura de Confianza</strong>. Cada cable, cada foco y cada minuto del guion está diseñado para eliminar la incertidumbre y proyectar autoridad absoluta, heredada de décadas de trabajo de campo real.
               </p>
            </div>
          </div>
          
          <div className="relative">
             <div className="aspect-square rounded-full border border-white/10 relative flex items-center justify-center p-8 animate-spin-slow-reverse">
                <div className="absolute inset-0 border border-dashed border-ear-gold/30 rounded-full"></div>
                <div className="aspect-square w-2/3 bg-gradient-to-br from-ear-purple/20 to-black rounded-full border border-white/10 flex flex-col items-center justify-center text-center p-6 shadow-2xl backdrop-blur-md">
                   <Anchor className="text-ear-gold mb-4" size={48} />
                   <span className="text-white font-display font-bold text-xl uppercase tracking-tighter">Impacto Real</span>
                   <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Garantía del Fundador</p>
                </div>
             </div>
          </div>
        </div>

        {/* --- THE 3 SYSTEMS --- */}
        <div className="mb-32">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-white">NUESTROS SISTEMAS DE EJECUCIÓN</h2>
              <p className="text-gray-400 mt-4">Ingeniería propietaria para resultados predecibles.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* System 1 */}
              <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl hover:border-ear-gold/50 transition-all duration-500 group">
                 <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-ear-gold group-hover:text-black transition-colors">
                    <Brain size={24} />
                 </div>
                 <h3 className="text-xl text-white font-display font-bold mb-4">Ingeniería de Contexto</h3>
                 <p className="text-gray-400 text-sm leading-relaxed">
                    Antes de mover un equipo, diseñamos el contexto. ¿Qué debe sentir la audiencia al entrar? Creamos fosos estéticos que hacen tu marca incomparable.
                 </p>
              </div>

              {/* System 2 */}
              <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl hover:border-ear-gold/50 transition-all duration-500 group">
                 <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-ear-gold group-hover:text-black transition-colors">
                    <Shield size={24} />
                 </div>
                 <h3 className="text-xl text-white font-display font-bold mb-4">Redundancia Militar</h3>
                 <p className="text-gray-400 text-sm leading-relaxed">
                    El "Efecto Murphy" es real. Por eso, nuestros sistemas críticos (audio, luz, video) tienen redundancia. Tu tranquilidad es nuestro activo más valioso.
                 </p>
              </div>

              {/* System 3 */}
              <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl hover:border-ear-gold/50 transition-all duration-500 group">
                 <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-ear-gold group-hover:text-black transition-colors">
                    <Zap size={24} />
                 </div>
                 <h3 className="text-xl text-white font-display font-bold mb-4">Sincronicidad</h3>
                 <p className="text-gray-400 text-sm leading-relaxed">
                    Alineamos tecnología y emoción. El golpe de luz llega exactamente con el pico musical. No es casualidad, es diseño de precisión suiza.
                 </p>
              </div>
           </div>
        </div>

        {/* --- BRAND MANUAL / IDENTITY SECTION --- */}
        <div className="border-t border-white/10 pt-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* 1. Identity */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
               <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
                 <Palette className="text-ear-gold" size={24}/> ADN Visual
               </h3>
               <div>
                 <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Paleta Cromática (Dark Mode)</span>
                 <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2"><div className="h-12 w-full bg-ear-gold rounded shadow-lg"></div></div>
                    <div className="space-y-2"><div className="h-12 w-full bg-ear-purple rounded shadow-lg border border-white/10"></div></div>
                    <div className="space-y-2"><div className="h-12 w-full bg-black rounded shadow-lg border border-white/20"></div></div>
                    <div className="space-y-2"><div className="h-12 w-full bg-white rounded shadow-lg"></div></div>
                 </div>
               </div>
            </div>

            {/* 2. Download Kit */}
            <div className="flex flex-col justify-center items-start space-y-6">
               <h3 className="text-3xl font-display font-bold text-white">¿Necesitas verificar nuestra autoridad?</h3>
               <p className="text-gray-400">
                 Descarga nuestro dossier técnico y estratégico. No contiene fotos de relleno, solo especificaciones, casos de éxito y metodología.
               </p>
               <button className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-ear-gold transition-all group rounded-lg shadow-lg">
                   <Download size={20} />
                   Acceder al Dossier (PDF)
                </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
