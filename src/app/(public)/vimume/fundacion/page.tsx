"use client";

import { motion } from "framer-motion";
import { Brain, Heart, Shield, Globe, ArrowRight, FileText, Landmark } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import PublicNavbar from "@/app/components/public/PublicNavbar";
import PublicFooter from "@/app/components/public/PublicFooter";
import { SubPageNavigation } from "@/app/components/public/SubPageNavigation";

const sections = [
  // ... (keep sections as they were)
  {
    title: "Memoria e Identidad",
    id: "identidad",
    icon: Landmark,
    content: "VIMUME nace como una respuesta a la erosión de la identidad en procesos de envejecimiento. No tratamos síntomas; preservamos la historia viva de las personas a través de su mapa sonoro emocional.",
    subtopics: ["Genealogía del Proyecto", "Valores Fundacionales", "Compromiso Ético"]
  },
  {
    title: "Marco Científico",
    id: "ciencia",
    icon: Brain,
    content: "Basado en principios de neuropsicología y musicoterapia avanzada. Nuestra intervención se apoya en la plasticidad neuronal y la evocación de recuerdos a largo plazo mediante estímulos auditivos de alta fidelidad.",
    subtopics: ["Investigación Clínica", "Publicaciones Relacionadas", "Validación Académica"]
  },
  {
    title: "Relación Humana",
    id: "humana",
    icon: Heart,
    content: "El centro de nuestra arquitectura es el vínculo. El protocolo asegura una interacción digna, respetuosa y profesional, eliminando la infantilización habitual en el trato sociosanitario.",
    subtopics: ["Protocolo de Acompañamiento", "Formación de Interventores", "Impacto Familiar"]
  }
];

export default function FundacionPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em] block">VIMUME • FUNDACIÓN</span>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] max-w-4xl">
              El Fundamento de la <br /> <span className="text-[#ecb613]">Dignidad Sonora</span>
            </h1>
            <p className="text-white/40 text-xl max-w-2xl leading-relaxed italic">
              "Una infraestructura dedicada a la preservación del legado humano y la salud emocional mediante la excelencia técnica."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid de Navegación Profunda */}
      <section className="py-32 px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-12 rounded-[3rem] border-white/5 flex flex-col gap-8 group hover:border-[#ecb613]/30 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#ecb613]/5 flex items-center justify-center text-[#ecb613]">
                <s.icon size={32} />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">{s.title}</h2>
              <p className="text-white/40 text-sm leading-relaxed italic">"{s.content}"</p>
              
              <div className="space-y-4 pt-8 border-t border-white/5">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#ecb613]/60">Áreas de profundización:</p>
                <div className="flex flex-col gap-3">
                  {s.subtopics.map(sub => (
                    <Link 
                      key={sub} 
                      href={ROUTES.blogInvestigacion}
                      className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all group/link"
                    >
                      {sub} <ArrowRight size={12} className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🧬 PROFUNDIZACIÓN & NAVEGACIÓN */}
      <SubPageNavigation 
        relatedLinks={[
          { label: "Metodología", title: "Protocolo Operativo VIMUME", href: ROUTES.protocolo },
          { label: "Trayectoria", title: "Edwin Agudelo Dossier", href: ROUTES.dossier },
          { label: "Evidencia", title: "Casos de Éxito & Blog", href: ROUTES.blog }
        ]}
        nextStep={{
          label: "Consultar Alianza",
          title: "La autoridad nace del rigor científico. ¿Desea integrar VIMUME en su institución?",
          href: ROUTES.contacto
        }}
      />
    </main>
  );
}
