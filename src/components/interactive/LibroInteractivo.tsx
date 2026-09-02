"use client";
import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

const chapters: Chapter[] = [
  {
    id: "cap-01",
    title: "DIA 01: El Despertar del Productor",
    content: "La industria musical no es música. Es una red de nexos, capital y visibilidad. Para dominarla, primero debes entender que tu arte es el combustible, pero el sistema OS es el motor..."
  },
  {
    id: "cap-02",
    title: "DIA 02: La Arquitectura del Match",
    content: "Un artista no sobrevive por ser bueno, sino por ser relevante en el momento exacto. El Algoritmo Húngaro que implementamos en EAR OS automatiza este destino..."
  }
];

export const LibroInteractivo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="relative bg-[#050505] min-h-[300vh]">
      {/* 🚀 NEURAL PROGRESS LINK */}
      <div className="fixed top-0 inset-x-0 z-[60] h-1.5 bg-zinc-900">
        <motion.div 
          style={{ scaleX }}
          className="h-full bg-[#d4af37] origin-left"
        />
        <div className="absolute top-4 right-8 flex items-center gap-2 text-[10px] font-mono text-[#d4af37] tracking-[0.3em]">
          <BookOpen className="w-3 h-3" /> NEURAL_READ_PROGRESS
        </div>
      </div>

      {/* 🏛️ CONTENT LAYER */}
      <div className="max-w-4xl mx-auto px-8 py-32 space-y-96">
        {chapters.map((chapter, index) => (
          <motion.div 
            key={chapter.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-4">
              <span className="text-[12px] font-mono text-[#d4af37] opacity-50">PHASE_{index + 1}</span>
              <div className="h-px w-24 bg-[#d4af37]/30" />
            </div>
            
            <h2 className="text-5xl lg:text-7xl font-display font-bold tracking-tighter leading-tight">
              {chapter.title}
            </h2>
            
            <p className="text-2xl lg:text-3xl text-zinc-400 font-serif leading-relaxed italic">
              "{chapter.content}"
            </p>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-12 flex justify-center text-zinc-700"
            >
              <ChevronDown className="w-12 h-12 stroke-1" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* 🔒 FINAL LOCKOUT */}
      <section className="h-screen flex items-center justify-center p-8 text-center bg-gradient-to-t from-[#0a0a0a] to-[#050505]">
        <div className="max-w-2xl px-12 py-16 border border-white/5 rounded-3xl bg-zinc-900/20 backdrop-blur-xl">
           <h3 className="text-3xl font-bold mb-4">Misión Cumplida</h3>
           <p className="text-zinc-500 mb-8 font-mono text-sm leading-relaxed">
             Has completado la sesión de lectura inmersiva. El conocimiento ha sido indexado en tu Red Neural local.
           </p>
           <button className="bg-[#d4af37] text-black px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.3em]">
             Siguiente Fase
           </button>
        </div>
      </section>
    </div>
  );
};
