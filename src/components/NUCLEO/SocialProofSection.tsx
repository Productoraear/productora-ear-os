
"use client";

import { motion } from 'framer-motion';
import { Star, Shield, Zap, CheckCircle2, Award, Heart } from 'lucide-react';

interface Testimonial {
  id: number;
  couple: string;
  city: string;
  date: string;
  photo: string;
  quote: string;
  rating: number;
  service?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    couple: "María & Carlos",
    city: "Madrid",
    date: "Junio 2025",
    photo: "https://images.unsplash.com/photo-1511889456731-d6d4951b9c1a?auto=format&fit=crop&w=100&q=80",
    quote: "El mariachi llegó 2 horas antes para probar sonido. Cero estrés, todo perfecto.",
    rating: 5,
    service: "Mariachi Imperial + DJ Nexus"
  },
  {
    id: 2,
    couple: "Sofía & Daniel",
    city: "Toledo",
    date: "Septiembre 2025",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b293dc?auto=format&fit=crop&w=100&q=80",
    quote: "Ingeniería forense aplicada a nuestra boda. 0% fallos técnicos.",
    rating: 5,
    service: "Producción Completa + Protocolo Failsafe"
  },
  {
    id: 3,
    couple: "Laura & Javier",
    city: "Madrid",
    date: "Octubre 2025",
    photo: "https://images.unsplash.com/photo-1529626455594-4ff08b2b7d9e?auto=format&fit=crop&w=100&q=80",
    quote: "El equipo técnico estuvo en todo momento. Sensación de seguridad total.",
    rating: 5,
    service: "DJ Premium + Iluminación Arquitectónica"
  }
];

const STATS = [
  { label: 'Eventos sin fallos técnicos', value: '500+', icon: Shield },
  { label: 'Tasa de satisfacción', value: '99.9%', icon: Heart },
  { label: 'Soporte técnico militar', value: '24/7', icon: Zap },
];

export const SocialProofSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="h-px w-8 bg-gold-500/30" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] gold-text italic">Testimonios S-Class</span>
            <div className="h-px w-8 bg-gold-500/30" />
          </motion.div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">Blindaje de Confianza</h2>
          <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">4.98 ★★★★★ · Calificación Media Histórica</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-gold-500/30 transition-all duration-500 shadow-2xl overflow-hidden"
            >
              {/* Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img 
                      src={t.photo} 
                      alt={`${t.couple}`} 
                      className="w-14 h-14 rounded-2xl object-cover border border-white/10 group-hover:border-gold-500/50 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gold-500 p-1 rounded-lg border-2 border-[#0a0a0a]">
                      <CheckCircle2 size={10} className="text-black" />
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-white text-sm uppercase tracking-tight">{t.couple}</p>
                    <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">{t.city} · {t.date}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={10}
                      className={i < t.rating ? "text-gold-500" : "text-white/10"}
                      fill={i < t.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>

                <p className="text-white/60 text-xs leading-relaxed italic mb-8 font-medium">
                  "{t.quote}"
                </p>

                {t.service && (
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-gold-500/40 border-t border-white/5 pt-6 group-hover:text-gold-500/60 transition-colors">
                    <Award size={10} />
                    {t.service}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {STATS.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 bg-white/[0.02] border border-white/5 rounded-2xl relative group hover:bg-white/[0.04] transition-all"
            >
              <stat.icon size={24} className="text-gold-500/30 mx-auto mb-4 group-hover:text-gold-500 group-hover:scale-110 transition-all duration-500" />
              <p className="text-4xl font-black text-gold-500 tracking-tighter mb-1">{stat.value}</p>
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* VENUES TICKET */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 border border-white/5 bg-[#0a0a0a] rounded-3xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
            <Zap size={140} className="text-gold-500" />
          </div>
          <h3 className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px] mb-8">Operativa Activa en Venues de Élite</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
             <span className="text-sm font-black tracking-tighter uppercase border px-4 py-2 border-white/10 rounded font-serif italic">The Ritz</span>
             <span className="text-sm font-black tracking-tighter uppercase border px-4 py-2 border-white/10 rounded">InterContinental</span>
             <span className="text-sm font-black tracking-tighter uppercase border px-4 py-2 border-white/10 rounded font-serif italic">Palacio de Liria</span>
             <span className="text-sm font-black tracking-tighter uppercase border px-4 py-2 border-white/10 rounded">Castle Experience</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
