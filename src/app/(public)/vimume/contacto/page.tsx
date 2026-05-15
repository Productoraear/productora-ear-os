"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Mail, 
  MapPin, 
  Phone, 
  MessageSquare,
  Building,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

/**
 * 🏛️ VIMUME CONTACT PAGE - LUMINOUS ACTIVATION REFACTOR
 * Concept: "La Activación del Colibrí" (The Hummingbird's Activation)
 */
export default function ContactoPage() {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  if (formStatus === 'success') {
    return (
      <main className="bg-[#fdfcf8] min-h-screen text-[#1a1a1a] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl text-center space-y-12 p-20 bg-white border border-black/5 rounded-[4rem] shadow-2xl shadow-[#3b82f6]/5"
        >
          <div className="w-24 h-24 bg-[#3b82f6] rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-[#3b82f6]/20">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">Mensaje Recibido</h1>
          <p className="text-2xl text-[#1a1a1a]/40 italic leading-relaxed">
            Nuestro equipo clínico e institucional revisará su solicitud y se pondrá en contacto en un plazo máximo de 24 horas laborables.
          </p>
          <button 
            onClick={() => setFormStatus('idle')}
            className="px-14 py-7 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full hover:bg-[#3b82f6] transition-all"
          >
            Volver al Formulario
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="bg-[#fdfcf8] min-h-screen text-[#1a1a1a] selection:bg-[#3b82f6]/10 relative overflow-hidden">
      
      {/* 🚀 HERO */}
      <section className="px-6 pt-56 pb-20 relative text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#3b82f6]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          <motion.div 
            {...fadeIn}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#3b82f6]/5 border border-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-black uppercase tracking-[0.4em]"
          >
            <Send size={14} /> CANAL OFICIAL VIMUME
          </motion.div>

          <motion.h1 
            {...fadeIn}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.75]"
          >
            INICIAR EL <br />
            <span className="text-[#3b82f6]/20 text-6xl md:text-[8rem]">CONTACTO</span>
          </motion.h1>

          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl text-[#1a1a1a]/40 font-medium italic leading-tight max-w-2xl mx-auto"
          >
            Estamos listos para hacer nuestra parte. ¿Cómo podemos ayudarle hoy?
          </motion.p>
        </div>
      </section>

      {/* 🧬 CONTACT CONTENT */}
      <section className="px-6 py-24 pb-48">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-24">
            
            {/* Sidebar Info */}
            <div className="lg:col-span-4 space-y-16">
              <div className="space-y-10">
                {[
                  { icon: Mail, label: "Email Institucional", value: "hola@productoraear.com", color: "#3b82f6" },
                  { icon: Phone, label: "Teléfono Directo", value: "+34 693 693 048", color: "#3b82f6" },
                  { icon: MapPin, label: "Sede Central", value: "Madrid, España", color: "#3b82f6" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    {...fadeIn}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-8 items-start group"
                  >
                     <div className="w-14 h-14 rounded-3xl bg-white flex items-center justify-center shrink-0 border border-black/5 shadow-xl shadow-black/[0.02] group-hover:border-[#3b82f6]/30 transition-all">
                        <item.icon size={24} style={{ color: item.color }} />
                     </div>
                     <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-[#1a1a1a]/20 mb-2">{item.label}</p>
                        <p className="text-xl font-black uppercase italic tracking-tighter text-[#1a1a1a]">{item.value}</p>
                     </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                {...fadeIn}
                className="p-12 bg-white border border-black/5 rounded-[4rem] space-y-6 shadow-2xl shadow-black/[0.02]"
              >
                 <ShieldCheck size={40} className="text-[#3b82f6]" />
                 <h4 className="text-2xl font-black uppercase italic tracking-tighter">Gobernanza del Dato</h4>
                 <p className="text-[#1a1a1a]/40 italic leading-relaxed">
                   Sus datos serán tratados con el rigor absoluto que exige el sector sanitario y la normativa GDPR vigente en la UE.
                 </p>
              </motion.div>
            </div>

            {/* Form Area */}
            <div className="lg:col-span-8 space-y-16">
              <motion.div 
                {...fadeIn}
                className="p-16 bg-white border border-black/5 rounded-[5rem] space-y-10 shadow-2xl shadow-black/[0.02]"
              >
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">¿Listo para hacer su parte y transformar una vida?</h2>
                <p className="text-2xl text-[#1a1a1a]/50 leading-relaxed italic">
                  Creemos en el poder de la música para acompañar, reconectar y devolver alegría. Si es familiar, dirige un centro o desea colaborar, nuestro equipo le orientará.
                </p>
                <div className="grid md:grid-cols-1 gap-6 pt-6">
                  {[
                    "Familiares que buscan una intervención biográfica significativa.",
                    "Centros que desean incorporar excelencia en el cuidado cognitivo.",
                    "Stakeholders alineados con el impacto social y la Silver Economy."
                  ].map((bullet, i) => (
                    <div key={i} className="flex gap-4 text-[13px] font-black uppercase tracking-widest text-[#1a1a1a]/40 italic leading-tight items-center">
                      <CheckCircle2 size={18} className="text-[#3b82f6] shrink-0" />
                      {bullet}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.form 
                {...fadeIn}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit} 
                className="p-16 bg-white border border-black/5 rounded-[5rem] space-y-16 relative overflow-hidden shadow-2xl shadow-[#3b82f6]/5"
              >
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                  <p className="text-[11px] font-black uppercase tracking-[0.5em]">Respuesta en 24–48h</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1a1a1a]/40 block ml-6">Nombre Completo</label>
                    <div className="relative">
                      <User size={20} className="absolute left-8 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" />
                      <input 
                        required 
                        type="text" 
                        placeholder="Ej. Sebastián Díaz"
                        className="w-full bg-[#fdfcf8] border border-black/5 rounded-[2rem] py-7 pl-16 pr-8 focus:border-[#3b82f6]/50 focus:outline-none transition-all text-lg font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1a1a1a]/40 block ml-6">Entidad / Centro</label>
                    <div className="relative">
                      <Building size={20} className="absolute left-8 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" />
                      <input 
                        type="text" 
                        placeholder="Ej. Residencia Nuestra Señora"
                        className="w-full bg-[#fdfcf8] border border-black/5 rounded-[2rem] py-7 pl-16 pr-8 focus:border-[#3b82f6]/50 focus:outline-none transition-all text-lg font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1a1a1a]/40 block ml-6">Email de Contacto</label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-8 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" />
                      <input 
                        required 
                        type="email" 
                        placeholder="contacto@entidad.com"
                        className="w-full bg-[#fdfcf8] border border-black/5 rounded-[2rem] py-7 pl-16 pr-8 focus:border-[#3b82f6]/50 focus:outline-none transition-all text-lg font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1a1a1a]/40 block ml-6">Motivo de Consulta</label>
                    <div className="relative">
                      <select className="w-full bg-[#fdfcf8] border border-black/5 rounded-[2rem] py-7 px-8 focus:border-[#3b82f6]/50 focus:outline-none transition-all text-lg font-medium appearance-none cursor-pointer">
                        <option>Servicio 1: Centros/Residencias</option>
                        <option>Servicio 2: Eventos/Domicilios</option>
                        <option>Colaboración Institucional</option>
                        <option>Prensa / Media</option>
                        <option>Otros</option>
                      </select>
                      <ArrowRight size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1a1a1a]/40 block ml-6">Mensaje / Requerimiento</label>
                  <div className="relative">
                    <MessageSquare size={20} className="absolute left-8 top-8 text-[#1a1a1a]/20" />
                    <textarea 
                      required 
                      rows={6}
                      placeholder="Describa brevemente cómo VIMUME puede aportar valor a su contexto específico."
                      className="w-full bg-[#fdfcf8] border border-black/5 rounded-[2.5rem] py-8 pl-16 pr-8 focus:border-[#3b82f6]/50 focus:outline-none transition-all text-lg font-medium resize-none"
                    ></textarea>
                  </div>
                </div>

                <button 
                  disabled={formStatus === 'submitting'}
                  type="submit" 
                  className="w-full py-8 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full flex items-center justify-center gap-4 hover:bg-[#3b82f6] hover:scale-[1.01] transition-all disabled:opacity-50 text-xl shadow-2xl shadow-[#3b82f6]/10"
                >
                  {formStatus === 'submitting' ? 'Procesando...' : 'Solicitar Información'} <ArrowRight size={24} />
                </button>
                
                <p className="text-center text-[11px] font-black uppercase tracking-widest text-[#1a1a1a]/20">
                  Al enviar acepta nuestra política de tratamiento de datos de impacto.
                </p>
              </motion.form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
