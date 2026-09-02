
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const PricingElitePack = () => {
  const packs = [
    {
      name: "PACK ELITE",
      price: "1.200€",
      features: ["Gestión Artística 101", "Identidad Visual Básica", "Distribución Digital", "Consultoría Técnica Mensual"],
      recommended: false
    },
    {
      name: "PACK 360 EAR",
      price: "3.500€",
      features: ["Full Management S-Class", "Producción de Singles & Video", "Gira Promocional (EU)", "Arsenal Técnico Ilimitado", "IA Support 24/7"],
      recommended: true
    }
  ];

  return (
    <section className="bg-[#221d10] py-32 px-6 overflow-hidden relative">
      {/* Decorative vertical lines */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white/5" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-white/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="font-cinzel text-6xl font-black text-white tracking-widest leading-none mb-4">INVERSIÓN</h2>
          <span className="text-[10px] font-black text-[#ecb613] tracking-[0.5em] uppercase">Modelos de Élite</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 p-[1px]">
          {packs.map((pack, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`bg-[#2d2616] p-12 lg:p-20 relative flex flex-col ${pack.recommended ? 'bg-[#352d1b]' : ''}`}
            >
              {pack.recommended && (
                <div className="absolute top-0 right-0 bg-[#ecb613] text-[#221d10] px-4 py-1 text-[8px] font-black uppercase tracking-widest">
                  Mas Demandado
                </div>
              )}
              
              <h3 className="font-montserrat font-black text-white/50 text-xs tracking-[0.4em] mb-8">{pack.name}</h3>
              <div className="flex items-baseline gap-4 mb-12">
                <span className="text-7xl font-cinzel font-black text-white text-shadow-gold">{pack.price}</span>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Base</span>
              </div>

              <ul className="space-y-6 mb-20 overflow-hidden">
                {pack.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="p-1 rounded-full border border-[#ecb613]/20 group-hover:border-[#ecb613] transition-colors">
                      <Check size={10} className="text-[#ecb613]" />
                    </div>
                    <span className="text-sm font-light text-white/70 group-hover:text-white transition-colors">{f}</span>
                  </li>
                ))}
              </ul>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-6 font-black uppercase tracking-[0.4em] text-xs transition-colors duration-500 overflow-hidden relative ${
                  pack.recommended ? 'bg-[#ecb613] text-[#221d10]' : 'border border-white/20 text-white'
                }`}
              >
                Solicitar Acceso
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
