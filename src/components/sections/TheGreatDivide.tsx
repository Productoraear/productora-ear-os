"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Star, LayoutGrid, Cpu } from "lucide-react";

const verticalData = [
  {
    id: "eventos",
    title: "EVENTOS",
    subtitle: "Producción & Experiencia",
    description: "Gestión técnica y operativa de espectáculos de alto impacto. De la idea al escenario.",
    icon: <Zap className="w-6 h-6" />,
    stats: "+500 SHOWS PRODUCIDOS",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
    color: "#d4af37",
    buttonText: "Ver Producciones"
  },
  {
    id: "artistas",
    title: "ARTISTAS",
    subtitle: "Talento & Management",
    description: "Aceleradora de carreras y booking internacional. Ingeniería de crecimiento para el talento.",
    icon: <Star className="w-6 h-6" />,
    stats: "GLOBAL BOOKING SYSTEM",
    img: "https://images.unsplash.com/photo-1514525253361-bee8a1874281?auto=format&fit=crop&q=80",
    color: "#d4af37",
    buttonText: "Acceso Talento"
  },
  {
    id: "proyecto",
    title: "VIMUME",
    subtitle: "Viaje Musical por la Memoria",
    description: "El núcleo de innovación. Un proyecto transformador que une música, emoción y recuerdos.",
    icon: <Cpu className="w-6 h-6" />,
    stats: "SISTEMA VIMUME ACTIVO",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
    color: "#ffffff",
    buttonText: "Iniciar Viaje"
  }
];

export const TheGreatDivide = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative min-h-screen md:h-screen flex flex-col md:flex-row bg-[#050505] overflow-hidden">
      {verticalData.map((section, idx) => (
        <motion.div 
          key={section.id}
          onMouseEnter={() => setHovered(section.id)}
          onMouseLeave={() => setHovered(null)}
          className={`relative flex-1 group cursor-pointer overflow-hidden border-zinc-800/20 
            ${idx !== verticalData.length - 1 ? "md:border-r border-b md:border-b-0" : ""}
            transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)]
            ${hovered === section.id ? "md:flex-[1.5]" : hovered && hovered !== section.id ? "md:flex-[0.75]" : "flex-1"}
            min-h-[40vh] md:min-h-0
          `}
        >
          {/* 🖼️ BACKGROUND IMAGE LAYER */}
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
            style={{ backgroundImage: `url(${section.img})` }}
          />
          
          {/* 🌑 OVERLAY GRADIENT */}
          <div className={`absolute inset-0 z-10 transition-colors duration-700 ${
            hovered === section.id 
              ? "bg-black/60" 
              : "bg-black/80"
          }`} />

          {/* ✨ BORDER LIGHTING (MOBILE ONLY TOP BORDER) */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20" />

          {/* 📄 CONTENT CONTAINER */}
          <div className="relative z-20 h-full flex flex-col justify-between p-6 md:p-12">
            
            {/* Header / Subtitle */}
            <motion.div
              animate={{ opacity: (hovered && hovered !== section.id) ? 0.3 : 1 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#d4af37] p-1.5 md:p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/5">
                  {section.icon}
                </span>
                <span className="font-mono text-zinc-500 text-[8px] md:text-[10px] tracking-[0.4em] uppercase">
                  {section.subtitle}
                </span>
              </div>
            </motion.div>

            {/* Main Title & Description */}
            <div className="mb-auto mt-12 md:mt-24">
              <h2 className={`text-4xl lg:text-8xl font-serif font-black tracking-tighter text-white mb-4 md:mb-6 transition-transform duration-500 ${
                hovered === section.id ? "scale-105" : "scale-100"
              }`}>
                {section.title}
              </h2>
              
              <AnimatePresence mode="wait">
                {(hovered === section.id || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-sm md:text-lg text-zinc-300 font-light max-w-sm mb-6 md:mb-8 leading-relaxed">
                      {section.description}
                    </p>
                    <button className={`flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all group/btn ${
                      section.id === 'proyecto' 
                        ? 'bg-white text-black hover:bg-zinc-200' 
                        : 'bg-[#d4af37] text-black hover:bg-white'
                    }`}>
                      {section.buttonText} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6 md:pt-8 mt-8 md:mt-12 bg-gradient-to-t from-black/40 to-transparent">
              <div className="text-white/40 font-mono text-[8px] md:text-[9px] tracking-[0.3em] flex items-center gap-3">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                {section.stats}
              </div>
              <LayoutGrid className="w-3 h-3 md:w-4 md:h-4 text-white/10" />
            </div>

          </div>
        </motion.div>
      ))}

      {/* 🏙️ AMBIENT GRADIENT OVERLAY (GLOBAL) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-40 z-30" />
    </section>
  );
};
