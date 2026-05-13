'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Heart, Star } from 'lucide-react';

export const ManifestoSection: React.FC = () => {
  return (
    <section className="py-48 px-8 bg-[#050505] relative overflow-hidden">
      {/* Background Artifacts */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4a855]/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-[#d4a855]" />
              <span className="text-[10px] font-black tracking-[0.5em] uppercase text-[#d4a855]">Manifiesto de Soberanía Artística</span>
            </div>
            
            <h2 className="text-6xl md:text-[8rem] font-black uppercase leading-[0.8] tracking-tighter italic">
              No vendo canciones, <br />
              <span className="text-white/10">Orquesto Legados.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <p className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight text-white/60">
                "En un mercado saturado de narrativa tóxica, mi compromiso es la <span className="text-white">Excelencia Humana</span>. El Mariachi no es folklore; es un vehículo de <span className="text-[#d4a855]">Calidad Social</span>."
              </p>
              
              <div className="flex gap-8 pt-8">
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-black text-white italic">0%</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#d4a855]">Toxicidad / Machismo</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-black text-white italic">100%</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#d4a855]">Impacto Positivo</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {[
                { 
                  title: 'Música en Positivo', 
                  desc: 'Erradicación de la violencia y el victimismo en cada acorde.',
                  icon: <Zap size={20} />
                },
                { 
                  title: 'Legado de Memoria', 
                  desc: 'VIMUME es la materialización de nuestra responsabilidad social.',
                  icon: <Heart size={20} />
                },
                { 
                  title: 'Soberanía Digna', 
                  desc: 'Rigor corporativo aplicado a la sensibilidad artística.',
                  icon: <Shield size={20} />
                },
                { 
                  title: 'Conexión S-Class', 
                  desc: 'Sistemas de audio diseñados para la inmersión emocional pura.',
                  icon: <Star size={20} />
                }
              ].map((item, i) => (
                <div key={i} className="glass-panel p-8 rounded-3xl border-white/5 hover:border-[#d4a855]/30 transition-all group">
                  <div className="p-3 bg-[#d4a855]/10 rounded-xl text-[#d4a855] w-fit mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest mb-2">{item.title}</h4>
                  <p className="text-xs text-white/40 leading-relaxed font-bold uppercase">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
