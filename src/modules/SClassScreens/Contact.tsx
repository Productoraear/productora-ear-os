'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle,
  ArrowRight,
  ChevronDown,
  ArrowUpRight,
  Zap,
  Globe,
  Award
} from 'lucide-react';
import { THEME, GLASS_STYLE, GOLD_HUD_STYLE } from '@/lib/dna/theme';

/**
 * 🛰️ MODULE: CONTACT (S-Class v3.0)
 * Visionary Dialogue Architecture.
 * Full Responsive Senior High-End Contact Interface.
 */

interface ContactProps {
  onNavigate?: (id: string) => void;
  hideHeader?: boolean;
}

export default function Contact({ onNavigate, hideHeader }: ContactProps) {
  const contactInfo = [
    {
      label: 'Email Oficial',
      val: 'hola@productoraear.com',
      href: 'mailto:hola@productoraear.com',
      icon: Mail
    },
    {
      label: 'Línea Directa',
      val: '+34 600 000 000',
      href: 'tel:+34600000000',
      icon: Phone
    },
    {
      label: 'Sede Central',
      val: 'Madrid, España',
      href: undefined,
      icon: MapPin
    },
    {
      label: 'Canal WhatsApp',
      val: 'Chat de Producción',
      href: 'https://wa.me/34600000000',
      icon: MessageCircle
    }
  ];

  return (
    <div className="bg-[#221d10] text-white font-montserrat selection:bg-[#ecb613] selection:text-[#221d10] w-full min-h-screen overflow-x-hidden relative">
      
      <main className="max-w-7xl mx-auto px-4 space-y-24 md:space-y-48 pb-48 pt-16 md:pt-32">
        
        {/* 1. CINEMATIC HEADLINE */}
        <div className="space-y-8 md:space-y-12 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <span className="px-5 py-2 md:px-8 md:py-3 bg-primary/10 border border-primary/20 text-primary text-[8px] md:text-[11px] font-black tracking-[0.4em] uppercase rounded-full backdrop-blur-2xl inline-block shadow-2xl">
               Inicia el Protocolo de Producción
            </span>
            <h1 className="text-[clamp(2.5rem,10vw,8rem)] font-cinzel font-black tracking-tighter uppercase leading-[0.9] md:leading-[0.85] text-balance">
              Hablemos de <br /> <span className="gold-text italic font-serif normal-case">Visión.</span>
            </h1>
          </motion.div>
          
          <p className="text-base md:text-2xl lg:text-3xl text-white/30 font-medium italic max-w-2xl leading-relaxed text-balance">
            Estamos listos para blindar su próximo gran movimiento con ingeniería de espectáculo de nivel superior.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32">
           
           {/* 2. MAIN REQUEST FORM */}
           <section className="space-y-12">
              <div className="space-y-4">
                 <h3 className="text-2xl md:text-4xl font-cinzel font-black uppercase tracking-tighter">Bespoke Inquiry</h3>
                 <p className="text-sm md:text-lg text-white/20 font-medium italic">Complete los detalles para una auditoría técnica inmediata.</p>
              </div>

              <form className="space-y-8 md:space-y-12" onSubmit={(e) => e.preventDefault()}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-3">
                       <label className="text-primary/40 text-[9px] font-black uppercase tracking-widest ml-4">Identidad / Empresa</label>
                       <input 
                         type="text" 
                         placeholder="TU NOMBRE O MARCA"
                         className="w-full bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] text-[10px] md:text-sm font-black uppercase tracking-widest focus:border-primary focus:bg-primary/5 outline-none transition-all placeholder:text-white/10"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-primary/40 text-[9px] font-black uppercase tracking-widest ml-4">Canal de Respuesta</label>
                       <input 
                         type="email" 
                         placeholder="HOLA@CONTACTO.COM"
                         className="w-full bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] text-[10px] md:text-sm font-black uppercase tracking-widest focus:border-primary focus:bg-primary/5 outline-none transition-all placeholder:text-white/10"
                       />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-primary/40 text-[9px] font-black uppercase tracking-widest ml-4">Tipo de Intervención</label>
                    <div className="relative">
                       <select className="w-full bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] text-[10px] md:text-sm font-black uppercase tracking-widest focus:border-primary focus:bg-primary/5 outline-none transition-all appearance-none text-white">
                          <option disabled selected value="">SELECCIONA CATEGORÍA</option>
                          <option>PRODUCCIÓN DE EVENTO 360</option>
                          <option>ALQUILER DE ARSENAL TÉCNICO</option>
                          <option>INGENIERÍA Y ESTRUCTURAS</option>
                          <option>BUSINESS CASE / CORPORATIVO</option>
                          <option>VIMUME / IMPACTO SOCIAL</option>
                          <option>OTRO / ESPECIAL</option>
                       </select>
                       <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-primary/40 text-[9px] font-black uppercase tracking-widest ml-4">Contexto de la Visión</label>
                    <textarea 
                       rows={6} 
                       placeholder="DESCRIBE LOS OBJETIVOS DE TU PRODUCCIÓN..."
                       className="w-full bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] text-[10px] md:text-sm font-black uppercase tracking-widest focus:border-primary focus:bg-primary/5 outline-none transition-all placeholder:text-white/10 resize-none"
                    />
                 </div>

                 <button className="group relative w-full py-8 md:py-12 rounded-[2.5rem] md:rounded-[4rem] bg-primary text-black font-black uppercase text-xs md:text-xl tracking-[0.5em] md:tracking-[0.6em] hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-primary/30 flex items-center justify-center gap-8 overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    ENVIAR REQUERIMIENTO <ArrowUpRight className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform h-6 w-6 md:h-12 md:w-12" />
                 </button>
              </form>
           </section>

           {/* 3. CONTACT CHANNELS & PROOF */}
           <section className="space-y-20 md:space-y-32">
              <div className="space-y-12">
                 <h3 className="text-2xl md:text-4xl font-cinzel font-black uppercase tracking-tighter">Canales Directos</h3>
                 <div className="grid gap-6 md:gap-8">
                    {contactInfo.map((item, i) => (
                      <a 
                        key={i} 
                        href={item.href}
                        className={`p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] flex items-center gap-8 transition-all duration-500 group ${GLASS_STYLE} ${GOLD_HUD_STYLE} border border-white/5 hover:border-primary/20 shadow-3xl ${!item.href && 'cursor-default'}`}
                      >
                         <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shrink-0">
                            <item.icon size={28} className="md:w-10 md:h-10" />
                         </div>
                         <div className="min-w-0 flex-1">
                            <p className="text-primary/40 text-[9px] md:text-xs font-black uppercase tracking-[0.4em] mb-1">{item.label}</p>
                            <p className="text-xs md:text-xl font-black uppercase tracking-widest truncate">{item.val}</p>
                         </div>
                         <ArrowRight size={20} className="text-primary/20 group-hover:translate-x-2 group-hover:text-primary transition-all shrink-0" />
                      </a>
                    ))}
                 </div>
              </div>

              {/* Trust Badge */}
              <div className="p-10 md:p-20 rounded-[3.5rem] md:rounded-[5rem] bg-white/[0.01] border border-white/5 space-y-10 md:space-y-16 text-center shadow-inner">
                 <div className="flex justify-center -space-x-4">
                    {[1,2,3].map(i => (
                       <div key={i} className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-[#221d10] border-2 border-primary/20 flex items-center justify-center text-primary text-[8px] md:text-xs font-black shadow-2xl">
                          EAR
                       </div>
                    ))}
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-lg md:text-3xl font-cinzel font-black uppercase tracking-tighter leading-none italic serif gold-text">Procesando Respuesta <br /> en Tiempo Real.</h4>
                    <p className="text-[9px] md:text-xs font-black text-white/10 uppercase tracking-[0.6em]">Garantía de Atención Elite // Tier 1 Support</p>
                 </div>
              </div>
           </section>
        </div>

      </main>
    </div>
  );
}
