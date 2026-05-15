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

      {/* 📊 FACT SHEET HONESTO */}
      <section className="px-6 py-24 max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <div className="space-y-6">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter border-l-4 border-[#ecb613] pl-6">Estado del Proyecto</h2>
            <p className="text-white/60 text-lg leading-relaxed italic">
              VIMUME se encuentra actualmente en **fase de despliegue piloto** y consolidación metodológica. Nuestra misión es documentar y estandarizar el impacto de la reminiscencia musical basada en evidencia científica externa (MIT, Tsai Lab, entre otros) mediante protocolos propios aplicados en entornos controlados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                title: "Ángulo: Soledad No Deseada", 
                desc: "La música como catalizador de conexión social en centros de mayores y domicilios.",
                status: "Línea de investigación abierta"
              },
              { 
                title: "Estimulación No Farmacológica", 
                desc: "Protocolos de reminiscencia para mejorar el bienestar emocional en estadios iniciales de demencia.",
                status: "Metodología en validación"
              }
            ].map((angle, i) => (
              <div key={i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-4">
                <p className="text-[9px] font-black text-[#ecb613] uppercase tracking-widest">{angle.status}</p>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">{angle.title}</h3>
                <p className="text-white/40 text-sm italic leading-relaxed">"{angle.desc}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* 📋 FACT SHEET CARD */}
        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 h-fit space-y-10">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter border-b border-white/5 pb-4">Fact Sheet</h3>
          <div className="space-y-6">
            {[
              { label: "Estado Actual", value: "Despliegue Piloto" },
              { label: "Foco 2026", value: "Centros Pioneros" },
              { label: "Metodología", value: "Reminiscencia Contextual" },
              { label: "Alineación ODS", value: "3, 10, 11 (Salud y Bienestar)" },
              { label: "Próximo Hito", value: "Convocatoria 5 Centros" }
            ].map((fact, i) => (
              <div key={i} className="space-y-1">
                <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">{fact.label}</p>
                <p className="font-bold text-sm text-white/80">{fact.value}</p>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#ecb613] hover:text-black transition-all">
            <Download size={14} /> Dossier de Contexto (PDF)
          </button>
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
