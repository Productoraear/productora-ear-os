
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Music, Activity, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export default function SocialImpact() {
  return (
    <div className="bg-[#221d10] min-h-screen text-white font-sans selection:bg-gold-500 selection:text-black">
      {/* Dynamic Hero Section */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=2070")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#221d10] via-[#221d10]/60 to-transparent" />
        </div>
        
        <div className="relative z-10 p-12 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="bg-gold-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">S-Class Social Impact</span>
            <div className="h-px w-12 bg-gold-500/30" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Iniciativa VIMUME</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase mb-8"
          >
            Viaje Musical <br />
            <span className="text-gold-500">por la Memoria.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/60 font-medium italic max-w-2xl leading-relaxed"
          >
            "La música no solo cura, reconecta. Devolvemos la identidad a quienes el olvido intenta arrebatarles su historia."
          </motion.p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="px-12 py-24 grid grid-cols-12 gap-12 border-b border-white/5 bg-black/20">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="text-[10px] font-black text-gold-500 uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
             <Activity size={14} /> El Factor Humano
          </h2>
          <div className="space-y-8">
            <p className="text-3xl font-black tracking-tight leading-tight">
              Transformamos residencias en auditorios de vida. Mediante musicoterapia clínica avanzada, logramos que pacientes con Alzheimer y demencia recuperen conexiones neuronales perdidas.
            </p>
            <p className="text-white/40 text-lg leading-loose">
              Nuestro equipo no solo interpreta música; diseña paisajes sonoros personalizados basados en la biografía auditiva de cada residente. Es ciencia, es arte, es blindaje emocional.
            </p>
          </div>
        </div>
        
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
          {[
            { label: 'Residencias', val: '15+', sub: 'Centros Activos' },
            { label: 'Impacto', val: '500+', sub: 'Sesiones Anuales' },
            { label: 'Recuperación', val: '84%', sub: 'Efectividad' },
            { label: 'Voluntarios', val: '40+', sub: 'Especialistas' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 p-8 rounded-3xl hover:border-gold-500/30 transition-colors group">
              <p className="text-3xl font-black text-white mb-2 group-hover:text-gold-500 transition-colors uppercase">{stat.val}</p>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{stat.label}</p>
              <p className="text-[9px] font-bold text-gold-500/40 mt-1 uppercase">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Pillars */}
      <section className="p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Music, 
              title: "Arqueología Sonora", 
              desc: "Excavamos en el pasado musical del paciente para encontrar las frecuencias que activan su memoria episódica." 
            },
            { 
              icon: ShieldCheck, 
              title: "Blindaje Cognitivo", 
              desc: "Ralentizamos el deterioro cognitivo mediante estimulación rítmica y melódica constante." 
            },
            { 
              icon: Users, 
              title: "Conexión Familiar", 
              desc: "Reconstruimos puentes de comunicación entre los residentes y sus familias a través del canto compartido." 
            }
          ].map((pillar, i) => (
            <div key={i} className="bg-black/40 border border-white/5 p-10 rounded-[40px] hover:bg-gold-500/5 transition-all group">
              <div className="w-14 h-14 bg-gold-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <pillar.icon className="text-gold-500" size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{pillar.title}</h3>
              <p className="text-white/40 leading-relaxed font-medium">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="p-12 mb-20">
        <div className="bg-gold-500 p-16 rounded-[50px] flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-700">
            <Heart size={300} className="text-black" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <Star className="text-black/20 mb-6 mx-auto" size={40} />
            <h2 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none mb-8">
              Sé Parte del <br /> Milagro Sonoro.
            </h2>
            <p className="text-black/60 font-bold mb-12 text-lg">
              Tu apoyo directo permite que VIMUME siga expandiéndose a nuevas residencias y centros de cuidado.
            </p>
            <button className="bg-black text-gold-500 px-12 py-5 rounded-full font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4 hover:scale-105 transition-transform shadow-2xl">
              Donar a la Causa <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
