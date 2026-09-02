
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ArchitectureEngSplit = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section className="relative h-screen flex bg-[#221d10] overflow-hidden border-y border-white/5">
      <div className="flex-1 grid grid-cols-2 relative">
        
        {/* Left Column: LA INGENIERÍA */}
        <div className="h-full border-r border-white/5 relative group overflow-hidden">
          <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 opacity-20 mix-blend-screen bg-[url('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1000')] bg-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="rotate-[-90deg] text-[12vw] font-cinzel font-black tracking-tighter text-[#ecb613]/10 lg:text-[#ecb613]/5 group-hover:text-[#ecb613] transition-colors duration-700 whitespace-nowrap">
              LA INGENIERÍA
            </h2>
          </div>
          <div className="absolute bottom-24 left-12 max-w-xs">
             <span className="text-[10px] font-black tracking-[0.4em] text-[#ecb613] mb-4 block">PHASE 01</span>
             <p className="text-white/60 text-sm leading-relaxed font-light">
               Diseño acústico y optimización de señales. Precisión milimétrica para experiencias sonoras sin precedentes.
             </p>
          </div>
        </div>

        {/* Right Column: LA ARQUITECTURA */}
        <div className="h-full relative group overflow-hidden bg-[#1a150a]">
          <motion.div 
            style={{ y: y2 }}
            className="absolute inset-0 opacity-20 mix-blend-screen bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000')] bg-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="rotate-90 text-[12vw] font-cinzel font-black tracking-tighter text-[#ecb613]/10 lg:text-[#ecb613]/5 group-hover:text-[#ecb613] transition-colors duration-700 whitespace-nowrap">
              LA ARQUITECTURA
            </h2>
          </div>
          <div className="absolute top-24 right-12 text-right max-w-xs">
             <span className="text-[10px] font-black tracking-[0.4em] text-[#ecb613] mb-4 block">PHASE 02</span>
             <p className="text-white/60 text-sm leading-relaxed font-light">
               Estructuras visuales y espaciales. La integración perfecta entre el hardware y el entorno físico.
             </p>
          </div>
        </div>

      </div>
    </section>
  );
};
