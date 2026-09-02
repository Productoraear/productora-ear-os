
import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '@/lib/dna/theme';

export const BusinessSolutionsSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#221d10] overflow-hidden px-6 lg:px-24 py-24">
      {/* Background radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#1a150a_100%)] opacity-50 pointer-events-none" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <h1 className="font-cinzel text-5xl lg:text-8xl font-bold tracking-tighter text-[#ecb613] leading-none mb-8">
            EAR<br />BUSINESS
          </h1>
          <p className="text-white/70 text-lg lg:text-xl font-light tracking-wide max-w-md border-l border-[#ecb613]/30 pl-6 mb-12">
            Soluciones corporativas de alto nivel. Audio, iluminación y producción técnica para inversores y marcas globales.
          </p>
          <motion.button
            whileHover={{ backgroundColor: "#ecb613", color: "#221d10", scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full lg:w-max px-12 py-4 border border-white/20 text-white font-black uppercase tracking-widest text-sm transition-colors duration-300"
          >
            Saber Más
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative h-[400px] lg:h-[600px] border border-white/5 bg-[#2d2616] p-8"
        >
          {/* Decorative frame elements */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#ecb613]/50" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#ecb613]/50" />
          
          <div className="w-full h-full bg-[#1a150a] flex items-center justify-center relative overflow-hidden group">
             {/* Use generate_image for real assets in production, using placeholder logic for now */}
             <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center" />
             <div className="z-10 text-center">
               <span className="font-serif italic text-white/40 block mb-2">Technical Authority</span>
               <div className="h-px w-24 bg-[#ecb613] mx-auto" />
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
