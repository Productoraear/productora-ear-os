
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Users, ExternalLink } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "Adriana & Marco",
    role: "Boda Realizada en Madrid",
    content: "La precisión milimétrica de EAR OS en la coordinación técnica nos dio la paz mental que necesitábamos. No fue solo música, fue un espectáculo cinematográfico.",
    rating: 5,
    logo: "🌟"
  },
  {
    name: "VIMUME Social Center",
    role: "Impacto Social Salud",
    content: "Implementar el Viaje Musical en nuestro centro transformó la vida de 50 pacientes. La tecnología neural de Edwin es el futuro de la musicoterapia.",
    rating: 5,
    logo: "🧠"
  }
];

const STATS = [
  { label: "Eventos Blindados", value: "250+", icon: Shield },
  { label: "Satisfacción S-Class", value: "99.8%", icon: CheckCircle },
  { label: "Comunidad EAR", value: "1.5k+", icon: Users },
];

export default function SocialProofSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16 space-y-4">
          <span className="text-[10px] font-black text-gold-500 uppercase tracking-[0.5em]">
            Trust & Authority
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center uppercase tracking-tighter">
            Blindaje y <span className="text-gold-500">Resultados</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col items-center text-center group hover:border-gold-500/30 transition-all"
            >
              <stat.icon className="text-gold-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 bg-black/40 border border-white/5 rounded-[40px] relative overflow-hidden h-full flex flex-col justify-between"
            >
              <div className="text-4xl absolute -right-4 -top-4 opacity-10 select-none">"</div>
              <p className="text-lg text-white/80 italic leading-relaxed mb-8 relative z-10">
                "{t.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-xl">
                  {t.logo}
                </div>
                <div>
                  <div className="font-bold text-white uppercase text-sm tracking-tight">{t.name}</div>
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <button className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold-500 hover:text-black transition-all">
            Ver Portafolio Completo de Casos de Éxito <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
