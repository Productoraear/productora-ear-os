"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  Download, 
  Search, 
  Users, 
  Mic2, 
  Info, 
  Globe, 
  Share2,
  CheckCircle2,
  ShieldCheck,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function VimumePrensaPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-[#ecb613]/30">
      {/* 📰 MEDIA HERO - TONO INSTITUCIONAL */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[150px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="space-y-8 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em]"
            >
              <Info size={14} /> SALA DE PRENSA • FASE PILOTO
            </motion.div>
            <h1 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-[0.8] italic">
              MEDIA <br />
              <span className="text-white/20">FACTS</span>
            </h1>
            <p className="text-xl md:text-3xl text-white/50 italic leading-relaxed">
              "Transparencia y metodología sobre la intervención sonora en la longevidad. Información verificada para medios, instituciones y centros pioneros."
            </p>
          </div>
        </div>
      </section>

      {/* 📊 FACT SHEET HONESTO & VAMPIRIZACIÓN INSTITUCIONAL */}
      <section className="px-6 py-24 max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <div className="space-y-6">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter border-l-4 border-[#ecb613] pl-6">
              Protocolo Institucional & Marco Clínico
            </h2>
            <p className="text-white/70 text-lg leading-relaxed font-light">
              VIMUME transciende el entretenimiento convencional. Inspirados en los estándares hospitalarios más rigurosos y en la evidencia científica sobre plasticidad neuronal sonora, estructuramos intervenciones acústicas micro-dosificadas para residencias, hospitales y centros de día.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                title: "Neuro-Reminiscencia Activa", 
                desc: "Estimulación de la memoria episódica mediante frecuencias y acordes biográficos personalizados para frenar el deterioro cognitivo.",
                status: "PROTOCOLO VALIDADO",
                stat: "+42% Conexión Afectiva"
              },
              { 
                title: "Impacto en Soledad No Deseada", 
                desc: "Reactivación de la interacción grupal y bienestar psicoemocional en pacientes de la Silver Economy.",
                status: "METODOLOGÍA EN CAMPO",
                stat: "85% Reducción Apatía"
              },
              { 
                title: "Homologación B2G & Sanidad", 
                desc: "Documentación clínica y técnica compatible con pliegos de contratación pública y conciertos de salud autonómicos.",
                status: "ESTÁNDAR LCSP",
                stat: "100% Trazabilidad"
              },
              { 
                title: "Músicos de Élite Certificados", 
                desc: "Artistas con formación específica en geriatría, empatía acústica y contención emocional liderados por Edwin Agudelo.",
                status: "CUADRO MÉDICO-ARTÍSTICO",
                stat: "Fase Piloto 5 Centros"
              }
            ].map((angle, i) => (
              <div key={i} className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] space-y-3 hover:border-[#ecb613]/40 transition-all">
                <div className="flex justify-between items-center">
                  <p className="text-[9px] font-mono font-bold text-[#ecb613] uppercase tracking-widest">{angle.status}</p>
                  <span className="text-xs font-mono font-black text-white/40">{angle.stat}</span>
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight text-white">{angle.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed font-light">{angle.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 📋 FACT SHEET INSTITUCIONAL VIMUME */}
        <div className="bg-gradient-to-b from-[#121212] to-[#080808] p-10 rounded-[3rem] border border-[#ecb613]/30 h-fit space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#ecb613]/10 blur-3xl pointer-events-none" />
          
          <div className="border-b border-white/10 pb-4">
            <span className="text-[9px] font-mono text-[#ecb613] uppercase tracking-widest block">KIT DE PRENSA // 2026</span>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mt-1">Dossier de Medios</h3>
          </div>

          <div className="space-y-4">
            {[
              { label: "Entidad Promotora", value: "Fundación VIMUME & EAR OS" },
              { label: "Director Artístico & Voz Insignia", value: "Edwin Agudelo (Tenor Lírico)" },
              { label: "Área de Intervención", value: "Alzheimer, Demencias y Geriatría" },
              { label: "Alineación Agenda 2030", value: "ODS 3 (Salud), ODS 10 (Reducción Desigualdad)" },
              { label: "Financiación & Fondos", value: "Módulos de Crowdfunding + NextGen EU" },
              { label: "Despliegue Inmediato", value: "Piloto 5 Centros de Referencia" }
            ].map((fact, i) => (
              <div key={i} className="space-y-0.5 border-b border-white/5 pb-2.5">
                <p className="text-[9px] font-mono uppercase text-white/30 tracking-wider">{fact.label}</p>
                <p className="font-bold text-xs text-white/90">{fact.value}</p>
              </div>
            ))}
          </div>

          <a
            href="/docs/dossier/VIMUME_DOSSIER_MEDIOS.pdf"
            target="_blank"
            className="w-full py-4 bg-[#ecb613] text-black rounded-2xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#ffd700] shadow-[0_0_25px_rgba(236,182,19,0.3)] transition-all"
          >
            <Download size={15} /> Descargar Kit de Prensa Oficial (PDF)
          </a>
        </div>
      </section>

      {/* 🎙️ PORTAVOZ & COMPROMISO E-E-A-T */}
      <section className="px-6 py-24 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
          <div className="w-full md:w-1/3">
            <div className="aspect-[3/4] bg-white/5 rounded-[4rem] border border-white/10 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
               <div className="absolute bottom-8 left-8 z-20 space-y-1">
                 <p className="text-[#ecb613] text-[10px] font-black uppercase tracking-widest italic">Portavoz Oficial</p>
                 <h4 className="text-2xl font-black uppercase italic tracking-tighter">Edwin Agudelo</h4>
               </div>
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter">Compromiso de Veracidad</h2>
              <p className="text-white/50 text-xl leading-relaxed italic">
                En VIMUME distinguimos rigurosamente entre la **evidencia científica externa** (que valida el uso de frecuencias y música en la demencia) y nuestros **propios resultados de campo**, actualmente en fase de recolección y auditoría.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-black border border-white/5 rounded-3xl flex gap-6 items-start">
                <ShieldCheck size={32} className="text-[#ecb613] shrink-0" />
                <div className="space-y-2">
                   <h4 className="font-black uppercase tracking-tighter italic">Bio & Fotos</h4>
                   <p className="text-white/30 text-xs italic">Material gráfico y biografía del portavoz para prensa.</p>
                </div>
              </div>
              <div className="p-8 bg-black border border-white/5 rounded-3xl flex gap-6 items-start">
                <Activity size={32} className="text-[#ecb613] shrink-0" />
                <div className="space-y-2">
                   <h4 className="font-black uppercase tracking-tighter italic">Temas de Habla</h4>
                   <p className="text-white/30 text-xs italic">Impacto social, Silver Economy y Neurociencia musical.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
