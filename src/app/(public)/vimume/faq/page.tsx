"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  HelpCircle, 
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  Music,
  Calendar,
  Video,
  FileText,
  Star,
  Target,
  Trophy
} from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    category: "Metodología S-Class",
    questions: [
      {
        q: "¿Qué diferencia a VIMUME del simple entretenimiento musical?",
        a: "VIMUME no es una actuación musical pasiva. Es una metodología de intervención clínica que utiliza la reminiscencia dirigida, el mapa sonoro autobiográfico y la integración con objetivos de Terapia Ocupacional para generar beneficios cognitivos y conductuales medibles."
      },
      {
        q: "¿Cómo se personaliza el repertorio para cada grupo o persona?",
        a: "Realizamos un diagnóstico previo de la memoria musical basado en el perfil cultural, la edad y la historia de vida del usuario. El Mapeo de la Banda Sonora Vital™ identifica los anclajes emocionales de los 15-25 años."
      }
    ]
  },
  {
    category: "Operativa & Logística",
    questions: [
      {
        q: "¿Cuál es la frecuencia recomendada de las sesiones?",
        a: "Para centros de día y residencias, recomendamos una frecuencia semanal para mantener la continuidad terapéutica. Las 5 sesiones piloto iniciales se centran en establecer la base de datos de impacto."
      },
      {
        q: "¿Qué duración tienen las sesiones?",
        a: "Las sesiones estándar tienen una duración de 60 minutos, diseñadas para maximizar el tiempo de atención sostenida sin generar fatiga cognitiva."
      }
    ]
  },
  {
    category: "Preguntas Estratégicas (RFP)",
    questions: [
      {
        q: "01. ¿Especificidad de la plataforma: enfoque técnico o estratégico?",
        a: "VIMUME integra ambos: un stack tecnológico robusto (React/Firebase) para la gestión de datos clínicos (Hermes Tracker) y una estrategia de impacto social de alto nivel."
      },
      {
        q: "02. ¿Profundidad de la estrategia de comunicación?",
        a: "Contamos con un Plan de Contenidos multicanal (Video testimonios, mini-documentales, podcast) diseñado para conectar emocionalmente y validar resultados."
      },
      {
        q: "03. ¿Tipos de contenidos prioritarios?",
        a: "Priorizamos el video testimonio de alta fidelidad y las infografías de impacto clínico para facilitar la comprensión de los beneficios por parte de familias y centros."
      },
      {
        q: "04. ¿Público objetivo prioritario: Seniors/Cuidadores vs Inversores/B2B?",
        a: "La arquitectura es dual: el portal VIMUME atrae a familias/centros, mientras que el Dossier Institucional y la sección de Inversión están optimizados para B2B y socios estratégicos."
      },
      {
        q: "05. ¿Límites presupuestarios iniciales definidos?",
        a: "Trabajamos bajo un modelo de optimización de recursos (Stack de código abierto y diseño modular) para maximizar el ROI social en las fases iniciales."
      },
      {
        q: "06. ¿Ejemplos de contenido disruptivo?",
        a: "Nuestras 'Sesiones de Realidad Aumentada Sonora' y el uso de neurociencia para la curación biográfica son los principales ejes disruptivos."
      },
      {
        q: "07. ¿Formato de entrega del plan de contenidos?",
        a: "Entregamos la planificación mediante Dashboards interactivos y reportes PDF estratégicos descargables."
      },
      {
        q: "08. ¿Riesgos específicos conocidos a evitar?",
        a: "Evitamos la infantilización del usuario, la falta de rigor científico y la desconexión con el contexto cultural local."
      },
      {
        q: "09. ¿Fechas límite estrictas para cada fase?",
        a: "Operamos bajo el cronograma de 5 sesiones piloto iniciales para validar el modelo antes del escalado nacional en 2026."
      },
      {
        q: "10. ¿Modelo de interacción con expertos?",
        a: "Modelo colaborativo transversal: musicoterapeutas, terapeutas ocupacionales y el equipo técnico de Productora EAR trabajan en sincronía."
      },
      {
        q: "11. ¿Definición numérica de 'Éxito' (KPIs específicos)?",
        a: "Medimos el Engagement RRSS (Alto), Conversiones Web (Medio/Alto) y Satisfacción del Usuario (Muy Alto) mediante feedback post-sesión."
      },
      {
        q: "12. ¿Cómo se estructuran los costes y cuál es la base de precios?",
        a: "Nuestra estructura es modular y transparente, basada en referencias de mercado. Dividimos en 3 capas: 1. Piloto (350€-450€) para validación inicial. 2. Continuidad (280€-380€/sesión). 3. Formato Ensemble/Mariachi (600€-900€). Garantizamos rigor clínico y profesionalidad en cada intervención."
      }
    ]
  }
];

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-black/5 last:border-0 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-10 flex items-center justify-between text-left group"
      >
        <span className={`text-2xl font-black uppercase italic tracking-tighter transition-colors ${isOpen ? 'text-[#3b82f6]' : 'text-[#1a1a1a]/80 group-hover:text-[#1a1a1a]'}`}>
          {question}
        </span>
        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isOpen ? 'bg-[#3b82f6] border-[#3b82f6] text-white rotate-180' : 'border-black/10 text-black/20'}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-10 text-[#1a1a1a]/50 leading-relaxed text-xl max-w-4xl italic">
              "{answer}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="bg-[#fdfcf8] min-h-screen text-[#1a1a1a] selection:bg-[#3b82f6]/10 relative overflow-hidden">
      
      {/* 🚀 HERO */}
      <section className="px-6 pt-56 pb-40 relative text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#3b82f6]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          <motion.div 
            {...fadeIn}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#3b82f6]/5 border border-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-black uppercase tracking-[0.4em]"
          >
            <HelpCircle size={14} /> CENTRO DE RESPUESTAS ESTRATÉGICAS
          </motion.div>

          <motion.h1 
            {...fadeIn}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.75]"
          >
            DUDAS <br />
            <span className="text-[#3b82f6]/20 text-6xl md:text-[8rem]">RESUELTAS</span>
          </motion.h1>

          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl text-[#1a1a1a]/40 font-medium italic leading-tight max-w-3xl mx-auto border-l-4 border-[#3b82f6] pl-10 py-6 text-left"
          >
            "Transparencia radical: Desde el stack técnico hasta la validación clínica del protocolo VIMUME."
          </motion.p>
        </div>
      </section>

      {/* 🧬 PLATAFORMA INFORMATIVA (VIDEO FAQs) */}
      <section className="px-6 py-40 bg-white border-y border-black/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
             <motion.div {...fadeIn} className="space-y-12">
               <div className="p-6 bg-[#3b82f6] rounded-3xl w-fit shadow-xl shadow-[#3b82f6]/20">
                 <Video size={40} className="text-white" />
               </div>
               <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] italic">Plataforma <br /><span className="text-[#3b82f6]/20">Informativa</span></h2>
               <p className="text-2xl text-[#1a1a1a]/40 italic leading-relaxed">
                 "No solo respondemos, educamos. Contamos con video-guías para cada fase del proceso de intervención."
               </p>
               <div className="flex flex-wrap gap-6">
                 <button className="px-10 py-5 bg-[#fdfcf8] border border-black/[0.03] rounded-full text-[11px] font-black uppercase tracking-widest hover:border-[#3b82f6] transition-all flex items-center gap-3 shadow-sm">
                   <Trophy size={18} className="text-[#3b82f6]" /> Casos de Éxito
                 </button>
                 <button className="px-10 py-5 bg-[#fdfcf8] border border-black/[0.03] rounded-full text-[11px] font-black uppercase tracking-widest hover:border-[#3b82f6] transition-all flex items-center gap-3 shadow-sm">
                   <FileText size={18} className="text-[#3b82f6]" /> Guías RFP
                 </button>
               </div>
             </motion.div>
             
             <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="aspect-video bg-white border border-black/5 rounded-[4rem] relative overflow-hidden group shadow-2xl shadow-black/[0.02]">
                <div className="absolute inset-0 bg-[#3b82f6]/5 flex items-center justify-center">
                   <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#3b82f6] transition-all cursor-pointer shadow-2xl">
                      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[22px] border-l-white border-b-[12px] border-b-transparent ml-2" />
                   </div>
                </div>
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                   <p className="text-[11px] font-black uppercase tracking-widest text-[#1a1a1a]/20">Preview: "Impacto en el Córtex Prefrontal"</p>
                   <span className="text-[11px] font-black uppercase tracking-widest text-[#3b82f6]">Expert Series 01</span>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 🧬 FAQ CONTENT */}
      <section className="px-6 py-40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-24">
            
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-12">
               <motion.div 
                 {...fadeIn}
                 className="p-16 bg-white border border-black/5 rounded-[4rem] space-y-10 sticky top-40 shadow-2xl shadow-black/[0.02]"
               >
                  <MessageSquare size={40} className="text-[#3b82f6]" />
                  <div className="space-y-6">
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-tight">¿Alguna <br /> duda extra?</h3>
                    <p className="text-[#1a1a1a]/40 italic text-xl">"Nuestro equipo clínico está listo para una sesión estratégica de 15 minutos."</p>
                  </div>
                  <Link href="/vimume/contacto" className="flex items-center justify-center gap-4 bg-[#1a1a1a] text-white px-10 py-6 rounded-full font-black uppercase italic tracking-tighter text-base hover:bg-[#3b82f6] transition-all shadow-xl shadow-[#3b82f6]/10">
                    Sesión Estratégica <ArrowRight size={22} />
                  </Link>
                  
                  <div className="pt-10 border-t border-black/5 space-y-5">
                    {[
                      { label: "Protocolos EAR", icon: Zap },
                      { label: "Seguridad GDPR", icon: ShieldCheck },
                      { label: "Medición KPI", icon: Target }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-5">
                         <item.icon size={20} className="text-[#3b82f6]" />
                         <span className="text-[11px] font-black uppercase tracking-widest text-[#1a1a1a]/20">{item.label}</span>
                      </div>
                    ))}
                  </div>
               </motion.div>
            </div>

            {/* Accordion */}
            <div className="lg:col-span-8 space-y-40">
              {faqs.map((group, i) => (
                <div key={i} className="space-y-16">
                  <div className="flex items-center gap-10">
                    <div className="h-px grow bg-gradient-to-r from-[#3b82f6]/30 to-transparent" />
                    <h2 className="text-[13px] font-black uppercase tracking-[0.5em] text-[#3b82f6] shrink-0">{group.category}</h2>
                  </div>
                  <div className="space-y-4">
                    {group.questions.map((faq, j) => (
                      <FAQItem key={j} question={faq.q} answer={faq.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🏺 FINAL CTA */}
      <section className="px-6 py-60 text-center relative overflow-hidden border-t border-black/5 bg-white">
        <div className="max-w-5xl mx-auto space-y-16 relative z-10">
          <Star size={100} className="mx-auto text-[#3b82f6] opacity-10" />
          <h2 className="text-6xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.75] text-[#1a1a1a]">¿DESEA <br /><span className="text-[#3b82f6]/20">MÁS DETALLES?</span></h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center pt-10">
            <Link href="/vimume/contacto" className="px-16 py-8 bg-[#1a1a1a] text-white font-black uppercase italic tracking-tighter rounded-full text-2xl hover:bg-[#3b82f6] transition-all shadow-2xl shadow-[#3b82f6]/20">
              Hablar con un Experto
            </Link>
            <Link href="/vimume/inversion" className="px-16 py-8 border border-black/10 text-[#1a1a1a] font-black uppercase italic tracking-tighter rounded-full text-2xl hover:bg-black hover:text-white transition-all">
              Explorar Inversión
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
