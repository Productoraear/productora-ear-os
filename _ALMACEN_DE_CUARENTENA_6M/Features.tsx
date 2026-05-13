import React from 'react';
import { Layers, ShieldCheck, Zap, TrendingUp, Heart, Globe, ArrowRight, Ruler, HardHat, FileCheck } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section className="py-24 bg-ear-dark relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* HEADER: Problem/Desire Alignment */}
        <div className="text-center mb-20">
          <span className="text-ear-gold font-body font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
            Trust Architecture
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            NO ES MAGIA, <br/>
            ES <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">CIENCIA APLICADA</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto font-body leading-relaxed">
            La creatividad sin estructura es caos. Nosotros eliminamos el riesgo aplicando una metodología de ingeniería en 3 fases que transforma la visión en una ejecución blindada.
          </p>
        </div>

        {/* METHODOLOGY: Step-by-Step (Engineering Frame) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 relative">
           {/* Connecting Line (Desktop) */}
           <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-purple-900 via-ear-gold to-purple-900 -z-10 opacity-50"></div>

           {/* Phase 1 */}
           <div className="bg-[#111] border border-white/10 p-8 rounded-3xl relative hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl group">
              <div className="w-16 h-16 bg-black border-2 border-purple-500 text-purple-400 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-purple-500 group-hover:text-black transition-colors">
                 <Ruler size={24} />
              </div>
              <h3 className="text-xl text-white font-bold font-display text-center mb-4">1. Diseño de Planos</h3>
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                 Antes de mover un cable, diseñamos la estructura. Definimos objetivos financieros para artistas y mapas de calor emocional para eventos. Sin improvisación.
              </p>
           </div>

           {/* Phase 2 */}
           <div className="bg-[#111] border border-white/10 p-8 rounded-3xl relative hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl group">
              <div className="w-16 h-16 bg-black border-2 border-ear-gold text-ear-gold rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-ear-gold group-hover:text-black transition-colors">
                 <HardHat size={24} />
              </div>
              <h3 className="text-xl text-white font-bold font-display text-center mb-4">2. Ejecución de Obra</h3>
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                 Desplegamos infraestructura redundante. Si un sistema falla, el respaldo se activa en milisegundos. Tu tranquilidad es nuestro protocolo estándar.
              </p>
           </div>

           {/* Phase 3 */}
           <div className="bg-[#111] border border-white/10 p-8 rounded-3xl relative hover:transform hover:-translate-y-2 transition-all duration-300 shadow-xl group">
              <div className="w-16 h-16 bg-black border-2 border-green-500 text-green-400 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-green-500 group-hover:text-black transition-colors">
                 <FileCheck size={24} />
              </div>
              <h3 className="text-xl text-white font-bold font-display text-center mb-4">3. Auditoría de Impacto</h3>
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                 No solo entregamos el proyecto; analizamos la estructura. Convertimos un evento efímero en un activo de marca permanente y una canción en patrimonio.
              </p>
           </div>
        </div>

        {/* PILLARS OF TRUST (Credibility Principle) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
             <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400"><Layers size={20}/></div>
             <div>
                <h4 className="text-white font-bold text-sm">Metodología Emanager</h4>
                <p className="text-gray-500 text-xs mt-1">Sistema propietario de gestión.</p>
             </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
             <div className="p-2 bg-amber-900/30 rounded-lg text-amber-400"><ShieldCheck size={20}/></div>
             <div>
                <h4 className="text-white font-bold text-sm">Garantía Anti-Caos</h4>
                <p className="text-gray-500 text-xs mt-1">Protocolos de seguridad militar.</p>
             </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
             <div className="p-2 bg-cyan-900/30 rounded-lg text-cyan-400"><Zap size={20}/></div>
             <div>
                <h4 className="text-white font-bold text-sm">Fricción Cero</h4>
                <p className="text-gray-500 text-xs mt-1">Digitalización total de procesos.</p>
             </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
             <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400"><Globe size={20}/></div>
             <div>
                <h4 className="text-white font-bold text-sm">Network Global</h4>
                <p className="text-gray-500 text-xs mt-1">Acceso a red internacional.</p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
