"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, Mail, MapPin, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export default function ContactoPage() {
  const whatsappNumber = "34693693048";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <main className="bg-black text-white min-h-screen selection:bg-[#ecb613]/30">
      <section className="pt-48 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
          <MessageSquare size={400} />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
          
          {/* 📬 LEFT: DIRECT CHANNELS */}
          <div className="space-y-12">
            <header className="space-y-6">
              <p className="text-[#ecb613] text-[10px] uppercase tracking-[0.6em] font-black">Contacto Directo</p>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-[0.85]">
                Hablemos de <br /> <span className="text-[#ecb613]">Impacto</span>
              </h1>
              <p className="text-xl text-white/50 font-medium italic leading-relaxed max-w-md">
                Si es usted un stakeholder, clínico o representante institucional, busquemos el canal más ágil para coordinar.
              </p>
            </header>

            <div className="space-y-6">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-6 p-8 bg-green-500/10 border border-green-500/20 rounded-[2.5rem] hover:bg-green-500/20 transition-all"
              >
                <div className="p-4 bg-green-500/20 rounded-2xl text-green-500 group-hover:scale-110 transition-transform">
                  <MessageCircle size={32} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-500/60 mb-1">WhatsApp Directo</p>
                  <p className="text-2xl font-black tracking-tighter italic">693 693 048</p>
                </div>
                <ArrowRight className="ml-auto opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </a>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4">
                  <Mail className="text-[#ecb613]" size={24} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Email</p>
                  <p className="text-lg font-bold">hola@productoraear.com</p>
                </div>
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4">
                  <MapPin className="text-[#ecb613]" size={24} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Ubicación</p>
                  <p className="text-lg font-bold">Madrid, España</p>
                </div>
              </div>
            </div>
          </div>

          {/* 📝 RIGHT: FORM LAYER */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/5 blur-[80px] rounded-full" />
            
            <form className="relative z-10 space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Nombre Completo</label>
                <input 
                  type="text" 
                  placeholder="Persona o Institución" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#ecb613]/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Email de Contacto</label>
                <input 
                  type="email" 
                  placeholder="stakeholder@entidad.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#ecb613]/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Mensaje / Propuesta</label>
                <textarea 
                  placeholder="Describa brevemente el motivo del contacto..." 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:border-[#ecb613]/50 outline-none transition-all resize-none"
                />
              </div>

              <button className="w-full py-6 bg-[#ecb613] text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(236,182,19,0.2)]">
                <Send size={18} /> Enviar Consulta
              </button>
              
              <p className="text-[9px] text-white/20 text-center uppercase tracking-widest leading-relaxed">
                Al enviar este formulario acepta nuestra política de privacidad y tratamiento de datos de impacto.
              </p>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
}
