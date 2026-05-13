"use client";
import React from 'react';
import { ArrowRight, Shield, Zap, Boxes, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ThreeDoors: React.FC = () => {
  const domains = [
    {
      id: 'artists',
      title: 'Management',
      subtitle: 'Arquitectura de Talento',
      description: 'Certificación y representación de artistas bajo el estándar THE SIGNAL.',
      path: '/artistas',
      icon: Target,
      image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'events',
      title: 'Producción',
      subtitle: 'Logística Táctica',
      description: 'Diseño integral de eventos corporativos y privados con precisión militar.',
      path: '/eventos',
      icon: Zap,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'rentals',
      title: 'Arsenal',
      subtitle: 'Hardware S-Class',
      description: 'Acceso a la flota técnica más avanzada: Sonido, Iluminación y Estructura.',
      path: '/arsenal',
      icon: Boxes,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  return (
    <section className="relative py-40 bg-black overflow-hidden" id="doors">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#d4a85505,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#d4a855]/10 border border-[#d4a855]/20 text-[#d4a855] text-[10px] font-black uppercase tracking-[0.5em] mb-10"
          >
            <Shield size={14} strokeWidth={1} /> Sistemas de Dominancia
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-black text-white mb-10 leading-none tracking-tighter uppercase italic">
            No vendemos servicios.<br/>Vendemos <span className="text-[#d4a855]">Estructura</span>.
          </h2>
          <p className="text-white/20 text-xs md:text-sm uppercase tracking-[0.4em] font-bold max-w-3xl mx-auto leading-relaxed">
            La improvisación es el enemigo de la excelencia. Elige el pilar estratégico que necesitas reforzar hoy para consolidar tu soberanía operativa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {domains.map((domain, idx) => (
            <motion.div 
              key={domain.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative h-[700px] overflow-hidden border border-white/5 rounded-[3rem] transition-all duration-1000 hover:border-[#d4a855]/40 hover:shadow-[0_40px_100px_rgba(212,168,85,0.1)]"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[3000ms] group-hover:scale-110 opacity-20 grayscale group-hover:grayscale-0"
                style={{ backgroundImage: `url('${domain.image}')` }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              
              <div className="absolute inset-0 p-12 flex flex-col justify-end items-start">
                <div className="mb-10 p-6 bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/10 group-hover:border-[#d4a855]/50 group-hover:bg-[#d4a855]/10 transition-all duration-1000">
                  <domain.icon className="text-white group-hover:text-[#d4a855] transition-colors" size={36} strokeWidth={1} />
                </div>

                <h3 className="text-5xl font-black text-white mb-3 tracking-tighter group-hover:text-[#d4a855] transition-colors uppercase italic">
                  {domain.title}
                </h3>
                
                <h4 className="text-[11px] font-black text-[#d4a855] mb-8 uppercase tracking-[0.5em]">
                  {domain.subtitle}
                </h4>

                <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest mb-12 leading-relaxed group-hover:text-white/70 transition-colors max-w-[90%]">
                  {domain.description}
                </p>

                <Link 
                  href={domain.path}
                  className="flex items-center gap-5 text-white font-black tracking-[0.4em] text-[10px] uppercase group/btn border-b border-white/10 hover:border-[#d4a855] pb-3 transition-all"
                >
                  Desplegar Vertical
                  <ArrowRight size={18} strokeWidth={1} className="group-hover/btn:translate-x-4 transition-transform duration-700 text-[#d4a855]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeDoors;
