'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Clock, Music, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { PredatorNav } from '@/widgets/navigation/PredatorNav';
import Link from 'next/link';

export default function GuiasNupcialesHub() {
  const categories = [
    {
      id: 'protocolo',
      title: 'Protocolo de Ceremonia',
      icon: <Shield size={24} className="text-[#d4a855]" />,
      desc: 'Desde la entrada de los novios hasta el ritual del ramo. Domina los tiempos perfectos sin depender de intermediarios.',
      articles: 12
    },
    {
      id: 'cronogramas',
      title: 'Timing & Cronogramas',
      icon: <Clock size={24} className="text-[#d4a855]" />,
      desc: 'Plantillas minuto a minuto para que el evento fluya. El secreto de una boda sin estrés logístico.',
      articles: 8
    },
    {
      id: 'proveedores',
      title: 'Criba de Proveedores',
      icon: <CheckCircle2 size={24} className="text-[#d4a855]" />,
      desc: 'Qué preguntar antes de firmar a un músico o DJ. Evita el "efecto comodity" y asegura calidad S-Class.',
      articles: 15
    },
    {
      id: 'emocional',
      title: 'Ingeniería Emocional',
      icon: <Heart size={24} className="text-[#d4a855]" />,
      desc: 'Cómo elegir el repertorio musical para arrancar lágrimas y generar euforia en el momento exacto.',
      articles: 9
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#d4a855]/30">
      <PredatorNav />

      {/* HERO WIKI */}
      <section className="relative pt-48 pb-32 px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#d4a855]/20 to-transparent blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#d4a855]/30 bg-[#d4a855]/10 mb-8">
              <BookOpen className="text-[#d4a855]" size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a855]">
                La Wiki Nupcial S-Class
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase mb-8">
              Orquestando <br />
              <span className="text-white/40 italic">La Perfección</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-white/50 max-w-3xl mx-auto italic mb-12">
              "No pague por manuales. Hemos abierto la caja negra de la industria nupcial. Aquí reside todo el conocimiento que los organizadores premium no quieren que veas."
            </p>
          </div>

          {/* THE OPEN LOOPS (Categorías adictivas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {categories.map((cat, i) => (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-3xl border-white/5 hover:border-[#d4a855]/30 transition-all flex flex-col group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-4 group-hover:text-[#d4a855] transition-colors">{cat.title}</h3>
                <p className="text-xs text-white/50 font-bold uppercase leading-relaxed mb-8 flex-1">
                  {cat.desc}
                </p>
                <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-6">
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">{cat.articles} Guías</span>
                  <ArrowRight size={16} className="text-white/30 group-hover:text-[#d4a855] transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP OF FUNNEL CTA */}
      <section className="py-32 px-8 bg-[#080808] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <Music size={48} className="text-[#d4a855] mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
            ¿Ya tienes la Logística?<br/>
            <span className="text-white/40">Ahora asegura el Alma.</span>
          </h2>
          <p className="text-lg text-white/50 font-bold uppercase mb-12 max-w-2xl mx-auto">
            La teoría está en las guías. La ejecución perfecta está en la infraestructura EAR OS. Cuando estés lista para delegar la presión, nosotros orquestaremos la obra maestra.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link href="/cotizador" className="px-12 py-6 bg-[#d4a855] text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:bg-white transition-all">
              Asegurar Fecha S-Class
            </Link>
            <Link href="/artistas/edwin-agudelo" className="px-12 py-6 border border-white/20 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:bg-white/5 transition-all">
              Auditar Dossier Artístico
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
