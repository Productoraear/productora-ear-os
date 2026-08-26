'use client';

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, Home, Star, Sparkles, Mic2, CalendarDays, User, MessageSquare 
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
};

function VimumeEventosContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('tipo') || 'familiar';
  const [activeTab, setActiveTab] = useState(initialType);

  const experiences = [
    { title: "Celebraciones con Sentido", desc: "Cumpleaños, aniversarios y reuniones familiares donde la música recupera los momentos más felices.", icon: Gift, color: "#3b82f6" },
    { title: "Acompañamiento en Domicilio", desc: "Sesiones privadas diseñadas para el bienestar emocional y la estimulación cognitiva en el hogar.", icon: Home, color: "#2dd4bf" },
    { title: "Homenajes Autobiográficos", desc: "Creación de un legado sonoro personalizado que celebra la vida y la identidad.", icon: Star, color: "#ecb613" }
  ];

  return (
    <main className="bg-[#fdfcf8] min-h-screen text-[#1a1a1a] selection:bg-[#3b82f6]/10 relative overflow-hidden">
      <section className="px-6 pt-56 pb-40 relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3b82f6]/5 blur-[200px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl space-y-12">
            <motion.div 
              {...fadeIn}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#3b82f6]/5 border border-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-black uppercase tracking-[0.4em]"
            >
              <User size={14} /> SERVICIO PRIVADO & FAMILIAR VIMUME ({activeTab.toUpperCase()})
            </motion.div>
            
            <h1 className="text-7xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.75]">
              MÚSICA <br />
              <span className="text-[#3b82f6]/20 text-6xl md:text-[8rem]">PARA EL</span> <br />
              ALMA
            </h1>
            
            <p className="text-2xl md:text-4xl text-[#1a1a1a]/40 font-medium leading-tight max-w-2xl italic border-l-4 border-[#3b82f6] pl-10 py-6">
              Llevamos la esencia de VIMUME a su hogar. Creamos experiencias musicales únicas que trascienden el entretenimiento.
            </p>
            
            <div className="flex flex-wrap gap-8 pt-10">
              <Link href="/vimume/contacto" className="px-14 py-7 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full flex items-center gap-4 hover:bg-[#3b82f6] transition-all shadow-2xl shadow-[#3b82f6]/15">
                Reservar Sesión Privada <CalendarDays size={22} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-40 bg-white border-y border-black/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {experiences.map((exp, i) => (
              <motion.div 
                key={i} 
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveTab(exp.title.toLowerCase())}
                className="p-16 bg-[#fdfcf8] border border-black/[0.03] rounded-[4rem] space-y-12 hover:border-[#3b82f6]/30 hover:shadow-2xl hover:shadow-[#3b82f6]/5 transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-10">
                  <div className="w-20 h-20 rounded-[2.5rem] bg-black/5 flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:text-white transition-all">
                    <exp.icon size={36} style={{ color: exp.color }} className="group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-6">{exp.title}</h3>
                    <p className="text-xl text-[#1a1a1a]/50 leading-relaxed italic">"{exp.desc}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function EventosYDomiciliosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfcf8]" />}>
      <VimumeEventosContent />
    </Suspense>
  );
}