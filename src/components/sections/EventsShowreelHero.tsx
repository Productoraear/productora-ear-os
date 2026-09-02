
import React from 'react';
import { motion } from 'framer-motion';

export const EventsShowreelHero = () => {
  return (
    <section className="relative h-screen bg-black overflow-hidden flex flex-col justify-end">
      {/* Background Video Loop (Placeholder for real EAR assets) */}
      <div className="absolute inset-0 grayscale opacity-40">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-concert-crowd-with-lights-27425-large.mp4" type="video/mp4" />
        </video>
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#221d10] via-transparent to-transparent opacity-90" />
      </div>

      <div className="relative z-10 p-12 lg:p-24 w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col items-start space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black tracking-[0.6em] text-[#ecb613] uppercase"
          >
            Nuestras Verticales
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
            className="text-[15vw] lg:text-[12vw] font-cinzel font-black tracking-tighter text-white leading-[0.8]"
          >
            ESPECIALIDAD<br />
            <span className="text-[#ecb613]">EVENTOS 360</span>
          </motion.h1>

          <div className="mt-12 flex flex-col lg:flex-row items-center gap-12 w-full pt-12 border-t border-white/10">
            <p className="text-white/40 text-sm lg:text-base max-w-xl font-light">
              Desde bodas de autor hasta ferias corporativas masivas. Inyectamos ingeniería y diseño en cada fibra de tu evento.
            </p>
            <motion.button
              whileHover={{ boxShadow: "0 0 20px #ecb61333", borderColor: "#ecb613" }}
              className="px-16 py-6 border border-[#ecb613]/50 text-white text-xs font-black uppercase tracking-[0.3em] backdrop-blur-sm group relative overflow-hidden"
            >
              <span className="relative z-10">Ver Showreel 2024</span>
              <motion.div 
                className="absolute inset-0 bg-[#ecb613] opacity-0 group-hover:opacity-10"
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
