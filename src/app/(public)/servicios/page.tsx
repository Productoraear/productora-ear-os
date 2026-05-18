"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Landmark, 
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function ServiciosHubPage() {
  const categories = [
    {
      title: "Eventos Institucionales",
      desc: "Protocolo, elegancia y rigor para recepciones oficiales y actos de ayuntamientos.",
      icon: Landmark,
      href: "/servicios/eventos-institucionales",
      niches: ["Galas Municipales", "Actos de Patrimonio", "Protocolo Oficial"]
    },
    {
      title: "Corporativo & Empresa",
      desc: "Incentivos, cenas de gala y presentaciones de producto con impacto sonoro.",
      icon: Zap,
      href: "/servicios/corporativo",
      niches: ["Incentivos", "Cenas de Gala", "Lanzamientos"]
    },
    {
      title: "VIMUME (Impacto Social)",
      desc: "Intervenciones musicales terapéuticas en centros residenciales y fundaciones.",
      icon: Heart,
      href: ROUTES.vimume,
      niches: ["Centros de Día", "Residencias", "Proyectos ODS"]
    },
    {
      title: "Dossier Artístico",
      desc: "La trayectoria y autoridad de Edwin Agudelo como solista y director técnico.",
      icon: Star,
      href: ROUTES.dossier,
      niches: ["Edwin Agudelo Solista", "Mariachi de Gala", "Cantando a Caballo"]
    }
  ];

  return (
    <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative">
      
      {/* Dynamic Background Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card pointer-events-none z-0 opacity-40" />

      <section className="px-6 pt-48 pb-32 relative overflow-hidden z-10">
        {/* Atmosphere Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-md"
          >
            <Sparkles size={14} /> Catálogo de Servicios
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] italic text-foreground"
          >
            INFRAESTRUCTURA <br />
            <span className="text-muted-foreground/20">DE VALOR</span>
          </motion.h1>

          <p className="text-xl md:text-3xl text-muted-foreground font-medium leading-relaxed max-w-4xl mx-auto italic">
            "No vendemos música; diseñamos el ambiente de alta fidelidad que su institución o empresa requiere para trascender."
          </p>
        </div>
      </section>

      {/* 🛠️ SERVICES GRID */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              href={cat.href} 
              className="group p-16 bg-card border border-border rounded-[4rem] flex flex-col justify-between hover:border-primary/20 hover:shadow-2xl transition-all min-h-[450px]"
            >
              <div className="space-y-8">
                <div className="p-4 bg-muted rounded-2xl w-fit text-primary group-hover:scale-110 transition-transform border border-border">
                  <cat.icon size={32} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic text-foreground">{cat.title}</h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-sm italic">"{cat.desc}"</p>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-4">
                  {cat.niches.map((n, j) => (
                    <span 
                      key={j} 
                      className="px-4 py-1.5 bg-muted border border-border rounded-full text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground group-hover:gap-6 transition-all">
                Ver Detalles del Servicio <ArrowRight size={14} className="text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🧬 FAQ / DOCUMENTACIÓN RÁPIDA */}
      <section className="px-6 py-32 border-t border-border relative z-10 bg-card/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h3 className="text-5xl font-black uppercase italic tracking-tighter text-foreground">
                Garantía de <br/><span className="text-primary">Excelencia</span>
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed italic">
                Cada servicio incluye un protocolo de auditoría técnica que asegura que la calidad sonora y el comportamiento del personal cumplen con los estándares de PRODUCTORAEAR.
              </p>
              <div className="pt-8">
                <Link href={ROUTES.protocolo} className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                  Consultar Protocolo de Calidad <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            
            <div className="grid gap-6">
              {[
                { q: "¿Incluyen equipo de sonido?", a: "Sí, todos nuestros servicios incluyen ingeniería de sonido propia (EAR High Fidelity)." },
                { q: "¿Se desplazan fuera de la zona base?", a: "Operamos en todo el territorio nacional con logística especializada." },
                { q: "¿Cómo se formaliza la reserva?", a: "Mediante contrato de servicios institucionales tras validación de disponibilidad." }
              ].map((faq, i) => (
                <div key={i} className="p-8 bg-card border border-border rounded-3xl space-y-3 shadow-md hover:border-primary/20 transition-all">
                  <p className="font-black text-sm uppercase tracking-widest text-primary">{faq.q}</p>
                  <p className="text-muted-foreground text-xs italic font-medium">"{faq.a}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 📞 FINAL CTA */}
      <section className="px-6 py-40 bg-primary text-foreground relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] text-foreground">
            ¿Hablamos <br /> de su proyecto?
          </h2>
          <p className="text-xl font-black uppercase tracking-widest text-foreground/60">Activar canal de consulta directa</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
            <Link 
              href={ROUTES.contacto} 
              className="px-16 py-8 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-[0.4em] hover:scale-105 transition-all text-center"
            >
              SOLICITAR PRESUPUESTO
            </Link>
            <Link 
              href={ROUTES.dossier} 
              className="px-16 py-8 border-2 border-foreground text-foreground rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-foreground hover:text-background transition-all text-center"
            >
              VER DOSSIER TÉCNICO
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const Heart = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);
