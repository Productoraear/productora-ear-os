"use client";
import React from 'react';
import { Heart, Brain, Music, ArrowRight, Handshake, Users, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const SocialImpactHome: React.FC = () => {
  return (
    <section className="relative py-32 bg-[#050505] border-t border-white/5 overflow-hidden font-sans">
      {/* Neural Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* SALES PSYCHOLOGY: PROBLEM & DESIRE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em] mb-10">
              <Activity size={14} className="animate-pulse" /> Proyecto VIMUME (S-Class Social)
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-none tracking-tighter uppercase">
              VIAJE MUSICAL POR LA <span className="text-[#ecb613]">MEMORIA</span>
            </h2>
            
            <p className="text-lg md:text-xl text-white/40 font-bold uppercase tracking-wide mb-10 leading-relaxed">
              El olvido es silencioso, pero la frecuencia lo rompe. 
              <span className="text-white block mt-2 italic">"La música es la última llave que se pierde".</span>
            </p>

            {/* NEURAL STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-[#ecb613]/30 transition-all group">
                <div className="p-3 bg-[#ecb613]/10 rounded-xl text-[#ecb613] w-fit mb-6 group-hover:scale-110 transition-transform"><Brain size={24}/></div>
                <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">Neuro-Estímulo</h4>
                <p className="text-white/30 text-[10px] uppercase font-bold leading-relaxed">Reactiva circuitos sinápticos mediante anclajes emocionales sonoros.</p>
              </div>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-[#ecb613]/30 transition-all group">
                <div className="p-3 bg-[#ecb613]/10 rounded-xl text-[#ecb613] w-fit mb-6 group-hover:scale-110 transition-transform"><Music size={24}/></div>
                <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">Impacto 40Hz</h4>
                <p className="text-white/30 text-[10px] uppercase font-bold leading-relaxed">Integración de frecuencias gamma para la mejora de la lucidez cognitiva.</p>
              </div>
            </div>

            {/* CALL TO ACTION */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link 
                href="/social"
                className="px-10 py-5 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white transition-all shadow-[0_15px_40px_rgba(236,182,19,0.3)] flex items-center justify-center gap-3 text-[10px]"
              >
                Explorar VIMUME <ArrowRight size={16} />
              </Link>
              <Link 
                href="/social"
                className="px-10 py-5 bg-transparent border border-white/10 text-white font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-[10px]"
              >
                <Handshake size={16} /> Alianza Institucional
              </Link>
            </div>
          </motion.div>

          {/* VISUAL PROOF / NEURAL INTERFACE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative h-[600px] rounded-[3rem] overflow-hidden border border-white/5 group shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
          >
             <img 
               src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" 
               alt="Anciano reconectando con la música" 
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 grayscale group-hover:grayscale-0"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
             
             {/* FLOATING UI ELEMENTS */}
             <div className="absolute inset-0 p-10 flex flex-col justify-end gap-6">
                <div className="flex items-center gap-4 bg-black/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 w-fit">
                  <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-[#050505] bg-[#0a0a0a] overflow-hidden shadow-xl">
                        <Users size={16} className="text-[#ecb613] m-3" />
                      </div>
                    ))}
                  </div>
                  <p className="text-white text-[10px] font-black uppercase tracking-widest">
                    +150 Familias Reconectadas
                  </p>
                </div>

                <div className="bg-[#ecb613] p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(236,182,19,0.4)]">
                  <p className="text-black text-xs font-black uppercase tracking-widest leading-relaxed mb-4">
                    "VOLVIÓ A SONREÍR CUANDO ESCUCHÓ EL BOLERO DE SU BODA. GRACIAS EAR POR DEVOLVERNOS A PAPÁ UN RATITO MÁS."
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-black/60 text-[10px] font-black uppercase tracking-widest">— MARÍA, HIJA DE PACIENTE</span>
                    <Sparkles size={16} className="text-black animate-spin-slow" />
                  </div>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default SocialImpactHome;
