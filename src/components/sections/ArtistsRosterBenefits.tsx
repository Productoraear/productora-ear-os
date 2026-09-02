
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Brush, Globe } from 'lucide-react';

export const ArtistsRosterBenefits = () => {
  const benefits = [
    {
      title: "MENTALIDAD",
      icon: <Brain size={32} className="text-[#ecb613] mb-8" />,
      text: "Gestión 360 centrada en la longevidad de la carrera y el desarrollo humano del artista.",
      step: "01"
    },
    {
      title: "BRANDING",
      icon: <Brush size={32} className="text-[#ecb613] mb-8" />,
      text: "Identidad visual y narrativa editorial. Convertimos artistas en iconos memorables.",
      step: "02"
    },
    {
      title: "NETWORKING",
      icon: <Globe size={32} className="text-[#ecb613] mb-8" />,
      text: "Conexión directa con mercados estratégicos en Europa y Latinoamérica. Sin intermediarios.",
      step: "03"
    }
  ];

  return (
    <section className="bg-[#221d10] min-h-screen flex items-center py-24 border-y border-white/5">
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        {benefits.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="p-16 flex flex-col items-center lg:items-start text-center lg:text-left group cursor-crosshair h-full"
          >
            <span className="text-[10px] font-black text-white/20 tracking-[1em] mb-12 block group-hover:text-[#ecb613] transition-colors">{item.step}</span>
            {item.icon}
            <h3 className="font-cinzel text-5xl font-black tracking-tighter text-white mb-8 [writing-mode:vertical-rl] lg:[writing-mode:horizontal-tb] lg:rotate-0 rotate-180">
              {item.title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed font-light mt-auto">
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
