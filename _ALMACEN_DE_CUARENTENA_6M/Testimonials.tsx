import React from 'react';
import { ShieldCheck, Activity, Lock, Fingerprint, Award, Handshake, ArrowRight, Zap, Sparkles } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#050505]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ear-purple/30 to-black border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.1)]">
             <Fingerprint className="text-ear-gold" size={40} />
          </div>
        </div>

        <div className="text-center mb-16">
          <span className="text-ear-gold font-body font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
            Crecimiento & Honestidad
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-8 leading-tight">
            ILUSIÓN, ENERGÍA Y <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ear-gold to-white uppercase">Dedicación Total</span>
          </h2>
        </div>

        {/* The Manifesto Card */}
        <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-16 rounded-3xl relative overflow-hidden shadow-2xl group hover:border-ear-gold/30 transition-all duration-500">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-ear-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-8 space-y-6">
               <div className="flex items-center gap-2 mb-2">
                  <Zap size={16} className="text-ear-gold animate-pulse" />
                  <span className="text-white font-bold text-sm uppercase tracking-widest">Acompáñanos en nuestro éxito</span>
               </div>
               
               <p className="text-xl text-white font-display font-bold leading-relaxed italic">
                 "Descubre EAR, la productora que irradia ilusión y energía en cada reto. Aunque carecemos de numerosas valoraciones públicas, nuestra calidad y profesionalismo están fuera de toda duda."
               </p>
               
               <div className="w-20 h-1 bg-ear-gold/50 rounded-full"></div>

               <p className="text-gray-400 font-body text-lg leading-relaxed">
                 Nos encontramos en el inicio de una emocionante travesía. <strong className="text-white">Olvídate de valoraciones falsas; en EAR, nos presentamos exclusivamente a través de nuestro trabajo real.</strong>
               </p>
               
               <p className="text-gray-400 font-body text-lg leading-relaxed">
                 Buscamos socios que valoren la transparencia absoluta. Nuestra promesa es simple: resultados que superan las expectativas a través de una metodología que te acerca a un nivel de conciencia superior desde la <span className="text-ear-gold font-bold">neutralidad profesional</span>.
               </p>

               <div className="bg-white/5 border-l-4 border-ear-gold p-6 rounded-r-xl my-8">
                 <p className="text-white font-bold italic text-lg">
                   "No competimos con el pasado de otros, construimos tu futuro hoy con garantía de resultados por escrito."
                 </p>
               </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-8">
               
               <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white/5 rounded-full border border-white/10">
                    <Sparkles size={32} className="text-ear-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Energía Pura</h4>
                    <p className="text-gray-500 text-xs mt-1">Dedicación obsesiva por el detalle.</p>
                  </div>
               </div>

               <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white/5 rounded-full border border-white/10">
                    <Award size={32} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Garantía EAR</h4>
                    <p className="text-gray-500 text-xs mt-1">Compromiso de resultados por escrito.</p>
                  </div>
               </div>

               <button className="w-full py-4 bg-ear-gold text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2">
                 Sé parte de nuestro origen <ArrowRight size={16}/>
               </button>

            </div>

          </div>
        </div>

        <div className="mt-12 text-center">
           <p className="text-xs text-gray-600 font-body uppercase tracking-widest">
             * En EAR rechazamos las granjas de reseñas. Preferimos una travesía honesta junto a clientes valientes.
           </p>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
