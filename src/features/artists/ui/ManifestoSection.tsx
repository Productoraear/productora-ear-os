'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Ear, Brain, Anchor } from 'lucide-react';

export const ManifestoSection: React.FC = () => {
  return (
    <section className="py-48 px-8 bg-[#050505] relative overflow-hidden">
      {/* Background Artifacts */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ecb613]/10 blur-[150px] rounded-full" />
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
              <div className="w-12 h-[1px] bg-[#ecb613]" />
              <span className="text-[10px] font-black tracking-[0.5em] uppercase text-[#ecb613]">El Propósito S-Class</span>
            </div>
            
            <h2 className="text-5xl md:text-[6rem] font-black uppercase leading-[0.85] tracking-tighter italic font-syne">
              Soy Edwin Agudelo. <br />
              <span className="text-white/20">Cantautor & Arquitecto de VIMUME.</span>
            </h2>
            <p className="text-xl md:text-3xl font-black uppercase tracking-tight leading-tight text-white/60 max-w-5xl mt-6">
              "Mi propósito no es recibir aplausos efímeros. Diseño experiencias acústicas en eventos de élite para financiar una infraestructura clínica (VIMUME) que devuelve la dignidad a nuestros mayores."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-12"
            >
              <div className="space-y-6">
                <span className="text-3xl font-black uppercase text-white font-syne italic block">
                  Mis 3 Reglas Innegociables
                </span>
                <p className="text-white/50 text-base leading-relaxed">
                  En una industria que compite por precio, yo compito por legado. Si nuestras visiones no se alinean en estos 3 pilares, no soy el artista para tu evento.
                </p>
              </div>
              
              <div className="flex gap-8 pt-8">
                <div className="flex flex-col gap-2">
                  <span className="text-5xl font-black text-white italic font-syne">350€</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#ecb613]">Tarifa Base Inmutable</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-5xl font-black text-white italic font-syne">10%</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#ecb613]">Destinado a VIMUME</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {[
                { 
                  title: 'Escucha Activa Extrema', 
                  desc: 'Comprender tus sueños y necesidades antes de emitir una sola nota. La empatía es el 80% del éxito; el talento es solo el vehículo.',
                  icon: <Ear size={20} />
                },
                { 
                  title: 'Transparencia Radical', 
                  desc: 'Hablar siempre con la verdad. Cero mentiras comerciales. Lo que ves y se presupuesta es exactamente la excelencia que recibes.',
                  icon: <Shield size={20} />
                },
                { 
                  title: 'El Legado Clínico (VIMUME)', 
                  desc: 'Métricas reales validadas por psicólogos y médicos. Un viaje musical por la memoria que estimula el Alzheimer bajo el rigor científico.',
                  icon: <Brain size={20} />
                },
                { 
                  title: 'Soberanía Financiera', 
                  desc: 'Enfocados en Fondos Europeos e IMSERSO para escalar el impacto social más allá de los eventos privados.',
                  icon: <Anchor size={20} />
                }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-[#ecb613]/40 transition-all group">
                  <div className="p-3 bg-[#ecb613]/10 rounded-xl text-[#ecb613] w-fit mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest mb-3 text-white">{item.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-bold">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
