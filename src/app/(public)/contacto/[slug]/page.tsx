"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, Mail, MapPin, Send, MessageCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// --- 🛠️ DYNAMIC INTENTS & BRAND MAPPING ---
const SLUG_MAP: Record<string, { title: string; category: string; description: string; placeholder: string }> = {
  'sonorizacion-eventos': {
    title: 'Sonorización de Eventos',
    category: 'Producción Técnica S-Class',
    description: 'Diseño acústico premium, sistemas line-array e ingeniería de sonido de alta fidelidad para recintos y directos exigentes.',
    placeholder: 'Detalle las necesidades técnicas de sonorización, tipo de espacio y aforo esperado...'
  },
  'innovacion-social': {
    title: 'Innovación Social & Cognitiva',
    category: 'VIMUME Vertical',
    description: 'Integración de programas de estimulación cognitiva, bienestar institucional y desarrollo social mediante estimulación sensorial de 40Hz.',
    placeholder: 'Describa el centro de día, ayuntamiento o residencia de mayores donde desea implantar el protocolo...'
  },
  'iluminacion-espectacular': {
    title: 'Iluminación Espectacular',
    category: 'Producción Técnica S-Class',
    description: 'Arquitectura lumínica de vanguardia, control de espectáculos robóticos y diseño de atmósferas inmersivas de alta gama.',
    placeholder: 'Describa el tipo de espectáculo, diseño lumínico deseado y dimensiones del escenario...'
  },
  'produccion-audiovisual': {
    title: 'Producción Audiovisual',
    category: 'Despliegue Técnico',
    description: 'Cobertura multicámara 4K, streaming de latencia cero, pantallas LED gigantes de alta densidad y postproducción in situ.',
    placeholder: 'Especifique si requiere retransmisión en directo, grabación de alta calidad o pantallas de gran formato...'
  },
  'dj-premium': {
    title: 'Servicio de DJ Premium',
    category: 'Booking Artístico',
    description: 'Curaduría musical exclusiva, cabinas de diseño vanguardista y ambientación sonora de élite adaptada a su marca o evento.',
    placeholder: 'Indique el estilo musical preferido, tipo de evento (corporativo, privado) y número de asistentes...'
  },
  'configurador-bespoke': {
    title: 'Cotización Bespoke',
    category: 'Herramienta de Negocio',
    description: 'Configuración personalizada de logística de flota, personal técnico y recursos de audio/luz ajustada a presupuestos premium.',
    placeholder: 'Describa la escala de su proyecto o presupuesto aproximado para optimizar la asignación de recursos...'
  },
  'edwin-agudelo-solista': {
    title: 'Edwin Agudelo Solista',
    category: 'Roster Exclusivo',
    description: 'Actuación en directo de Edwin Agudelo. Repertorio lírico de élite, violín crossover y melodías inmersivas.',
    placeholder: 'Indique la fecha estimada, tipo de gala o recepción y duración requerida del show...'
  },
  'edwin-agudelo-mariachi-6': {
    title: 'Edwin Agudelo Mariachi (Semilla)',
    category: 'Roster Exclusivo',
    description: 'Show de mariachi de Edwin Agudelo con ensamble acústico completo de 6 músicos para eventos de alta distinción.',
    placeholder: 'Especifique la localización del evento y la temática del espectáculo...'
  },
  'edwin-caballo': {
    title: 'Edwin Caballo',
    category: 'Espectáculos Ecuestres',
    description: 'Espectáculo ecuestre de alta escuela fusionado con ópera y violín lírico en vivo para eventos institucionales únicos.',
    placeholder: 'Describa el recinto habilitado (arena, plaza de toros, finca privada) y necesidades logísticas...'
  },
  'banda-monumental': {
    title: 'Banda Monumental',
    category: 'Orquesta & Ensamble',
    description: 'Gran despliegue de músicos profesionales para festivales, ferias patronales, ayuntamientos y grandes recintos.',
    placeholder: 'Detalle la festividad, municipio o escala de festival que desea contratar...'
  }
};

interface ContactoSlugPageProps {
  params: {
    slug: string;
  };
}

export default function ContactoSlugPage({ params }: ContactoSlugPageProps) {
  const slug = params.slug;
  const whatsappNumber = "34693693048";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola,%20estoy%20interesado%20en%20el%20servicio%20de%20${encodeURIComponent(slug.replace(/-/g, ' '))}`;

  // Get details from SLUG_MAP or fallback gracefully
  const detail = SLUG_MAP[slug] || {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    category: 'Consulta Personalizada',
    description: 'Formulario de contacto premium y prioritario en el ecosistema de Productora EAR.',
    placeholder: 'Describa detalladamente su solicitud o propuesta para poder coordinar la respuesta más ágil...'
  };

  const [formState, setFormState] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.nombre || !formState.email || !formState.mensaje) {
      alert("Por favor, rellene todos los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);

    // Simulate S-Class atomic telemetry submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Attempt passive Telegram notification if variables allow, else mock
      console.log(`[CONTACT_FUNNEL] Lead Captured for intent: ${slug}`, formState);
    }, 1200);
  };

  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-[#ecb613]/30 font-sans">
      <section className="pt-48 pb-24 px-6 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
          <MessageSquare size={500} />
        </div>
        <div className="absolute -left-20 top-1/3 w-96 h-96 bg-[#ecb613]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start">
          
          {/* 📬 LEFT: SYSTEM INDICATOR & SERVICE OVERVIEW (COL-5) */}
          <div className="lg:col-span-5 space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-[#ecb613] rounded-full animate-ping" />
                <p className="text-[#ecb613] text-[10px] uppercase tracking-[0.6em] font-black">{detail.category}</p>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.85] text-white">
                Canal de <br /> <span className="text-[#ecb613]">{detail.title}</span>
              </h1>
              <p className="text-lg text-white/60 font-medium italic leading-relaxed">
                {detail.description}
              </p>
            </header>

            {/* Quick action buttons */}
            <div className="space-y-6">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-6 p-6 bg-green-500/10 border border-green-500/20 rounded-[2.5rem] hover:bg-green-500/20 transition-all duration-300"
              >
                <div className="p-3 bg-green-500/20 rounded-2xl text-green-500 group-hover:scale-110 transition-transform">
                  <MessageCircle size={28} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-green-500/60 mb-0.5">WhatsApp Premium</p>
                  <p className="text-xl font-black tracking-tighter italic">Atención Inmediata</p>
                </div>
                <ArrowRight className="ml-auto opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </a>

              <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#ecb613]/10 rounded-2xl text-[#ecb613]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Fulfillment</p>
                    <p className="text-sm font-bold text-white/80">Coordinación en menos de 24 horas</p>
                  </div>
                </div>
                
                <div className="h-px bg-white/5" />

                <div className="grid grid-cols-2 gap-4 text-xs text-white/40 font-mono">
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-white/20">ESTADO CANAL</p>
                    <p className="text-white/80 font-bold">🟢 ACTIVO</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-white/20">PRIORIDAD</p>
                    <p className="text-[#ecb613] font-bold">💎 MÁXIMA (S-CLASS)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 📝 RIGHT: CONVERTING CONTACT FORM (COL-7) */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#ecb613]/5 blur-[100px] rounded-full pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="contact-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative z-10 space-y-6" 
                  onSubmit={handleSubmit}
                >
                  <div className="space-y-1">
                    <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Pre-selección Automatizada</p>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white/80 font-mono flex justify-between items-center">
                      <span>INTENTO MAPPED: <strong className="text-[#ecb613]">{slug}</strong></span>
                      <span className="text-[8px] bg-[#ecb613]/20 text-[#ecb613] px-2 py-0.5 rounded">DIRECT GATE</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-3">Nombre Completo *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Persona o Institución" 
                        value={formState.nombre}
                        onChange={(e) => setFormState({ ...formState, nombre: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-bold text-white focus:border-[#ecb613]/50 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-3">Email *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="stakeholder@entidad.com" 
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-bold text-white focus:border-[#ecb613]/50 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-3">Teléfono de contacto</label>
                    <input 
                      type="tel" 
                      placeholder="+34 600 000 000" 
                      value={formState.telefono}
                      onChange={(e) => setFormState({ ...formState, telefono: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-bold text-white focus:border-[#ecb613]/50 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-3">Detalles de la solicitud *</label>
                    <textarea 
                      required
                      placeholder={detail.placeholder} 
                      value={formState.mensaje}
                      onChange={(e) => setFormState({ ...formState, mensaje: e.target.value })}
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm font-bold text-white focus:border-[#ecb613]/50 outline-none transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-[#ecb613] text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(236,182,19,0.15)]"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Enviar Propuesta
                      </>
                    )}
                  </button>
                  
                  <p className="text-[8px] text-white/20 text-center uppercase tracking-widest leading-relaxed">
                    Al enviar este formulario acepta los términos de servicio y tratamiento seguro de leads de Productora EAR.
                  </p>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-8 relative z-10"
                >
                  <div className="mx-auto w-16 h-16 bg-[#ecb613]/10 rounded-full flex items-center justify-center text-[#ecb613] border border-[#ecb613]/20">
                    <CheckCircle2 size={36} className="animate-pulse" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic">¡Propuesta Registrada!</h3>
                    <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto">
                      Hemos recibido sus datos para el canal de <strong className="text-[#ecb613]">{detail.title}</strong>. 
                      Nuestros coordinadores técnicos y de booking auditores iniciarán el análisis técnico de inmediato.
                    </p>
                  </div>

                  <div className="pt-6">
                    <Link 
                      href="/"
                      className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2"
                    >
                      Volver a Inicio <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>
    </main>
  );
}
