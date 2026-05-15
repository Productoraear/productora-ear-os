"use client";

import { motion } from "framer-motion";
import { FileText, Search, Music, Zap, CheckCircle, ArrowRight, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import PublicNavbar from "@/app/components/public/PublicNavbar";
import PublicFooter from "@/app/components/public/PublicFooter";
import { SubPageNavigation } from "@/app/components/public/SubPageNavigation";

const phases = [
  // ... (keep phases)
  {
    title: "Diagnóstico Sonoro",
    id: "diagnostico",
    icon: Search,
    content: "Evaluación técnica de la biografía musical del paciente. Identificamos los anclajes emocionales y las frecuencias de mayor respuesta cognitiva.",
    details: ["Mapeo de Memoria Auditiva", "Evaluación de Entorno", "Ficha Técnica Inicial"]
  },
  {
    title: "Curación & Diseño",
    id: "curacion",
    icon: Music,
    content: "Arquitectura de la sesión. Selección rigurosa de repertorio basada en el diagnóstico previo para asegurar la eficacia de la intervención.",
    details: ["Curación Musical Certificada", "Diseño de Paisaje Sonoro", "Validación de Contenidos"]
  },
  {
    title: "Intervención Técnica",
    id: "intervencion",
    icon: Activity,
    content: "Ejecución profesional con audio de alta fidelidad. El interventor guía la experiencia asegurando la estabilidad emocional del grupo.",
    details: ["Protocolo de Presencia", "Gestión de Dinámicas", "Control de Respuesta"]
  },
  {
    title: "Evaluación & Cierre",
    id: "evaluacion",
    icon: ShieldCheck,
    content: "Auditoría de resultados y reporte de impacto. Documentamos la evolución y ajustamos el protocolo para futuras sesiones.",
    details: ["Reporte de Indicadores", "Feedback Institucional", "Plan de Continuidad"]
  }
];

export default function ProtocoloPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em] block">VIMUME • PROTOCOLO OPERATIVO</span>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] max-w-4xl">
              Método de <br /> <span className="text-[#ecb613]">Intervención Clínica</span>
            </h1>
            <p className="text-white/40 text-xl max-w-2xl leading-relaxed italic">
              "Un sistema procedimentado para garantizar la seguridad, el rigor y el impacto medible en cada sesión sonora."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Fases del Protocolo */}
      <section className="py-32 px-6 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-10 rounded-[2.5rem] border-white/5 flex flex-col gap-8 group hover:border-[#ecb613]/30 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-[#ecb613]/10 flex items-center justify-center text-[#ecb613]">
                  <p.icon size={28} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">{p.title}</h3>
                  <p className="text-white/30 text-xs leading-relaxed italic">"{p.content}"</p>
                </div>
                
                <div className="space-y-3 pt-6 border-t border-white/5 mt-auto">
                  {p.details.map(detail => (
                    <div key={detail} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">
                      <CheckCircle size={10} className="text-[#ecb613]/50" /> {detail}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧬 PROFUNDIZACIÓN & NAVEGACIÓN */}
      <SubPageNavigation 
        relatedLinks={[
          { label: "Fundación", title: "Marco Científico VIMUME", href: ROUTES.fundacion },
          { label: "Roadmap", title: "Visión de Crecimiento 2026", href: ROUTES.roadmap },
          { label: "Blog", title: "Investigación & Técnica", href: ROUTES.blogTecnica }
        ]}
        nextStep={{
          label: "Ver Ficha Técnica",
          title: "Disponemos de documentación extendida sobre cada fase del protocolo para socios institucionales.",
          href: ROUTES.blogTecnica
        }}
      />

      <PublicFooter />
    </main>
  );
}
