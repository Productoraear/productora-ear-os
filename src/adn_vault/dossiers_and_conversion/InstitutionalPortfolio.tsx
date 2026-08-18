'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Target, Users, BarChart, ShieldCheck, Download, ExternalLink, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 🏛️ INSTITUTIONAL PORTFOLIO (VAMPIRIZED ADAPTER)
 * Unifica la autoridad de VIMUME y Eventos 360 en un dossier dinámico.
 */
const InstitutionalPortfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'VIMUME' | 'B2B' | 'IMPACT' | 'SOBERANIA'>('VIMUME');

  const sections = {
    VIMUME: {
      title: "Viaje Musical por la Memoria",
      subtitle: "Proyecto B2G / Clínico",
      description: "Nuestra iniciativa de reconexión neurológica para la Comisión Europea y Ayuntamientos.",
      metrics: [
        { label: "Impacto Emocional", value: "92%" },
        { label: "Centros Activos", value: "24" },
        { label: "Memoria Recuperada", value: "Alta" }
      ],
      features: [
        "Protocolo de Reminiscencia Propietario",
        "Remasterización de Audio Bio-Orientada",
        "Informes de Seguimiento Clínico"
      ]
    },
    B2B: {
      title: "Eventos 360 de Autor",
      subtitle: "Producción de Alto Nivel",
      description: "Ingeniería de experiencias para corporaciones y grandes marcas.",
      metrics: [
        { label: "Asistentes", value: "10k+" },
        { label: "Satisfacción", value: "99%" },
        { label: "Ahorro Logístico", value: "15%" }
      ],
      features: [
        "Diseño Conceptual Disruptivo",
        "Gestión Integral de Proveedores",
        "Marketing de Guerrilla Integrado"
      ]
    },
    IMPACT: {
      title: "Impacto & Estrategia",
      subtitle: "Socio de Inversión en Legado",
      description: "Modelo de financiación y retorno social para empresas con propósito.",
      metrics: [
        { label: "Inversión Social", value: "2M€+" },
        { label: "Voluntarios", value: "500" },
        { label: "Retorno de Marca", value: "X3" }
      ],
      features: [
        "Humanización de Marca Radical",
        "Contenido Audiovisual de Alto Impacto",
        "Certificación de Responsabilidad Social"
      ]
    },
    SOBERANIA: {
      title: "Soberanía de Cómputo",
      subtitle: "Motores Neuronales Locales Activos",
      description: "Infraestructura autónoma de bajo nivel para garantizar la privacidad y procesamiento in-house de datos B2G y clínicos.",
      metrics: [
        { label: "Kernels AI Activos", value: "369" },
        { label: "Contratos Datos", value: "44" },
        { label: "Dependencia Externa", value: "0%" }
      ],
      features: [
        "Tensor Processing Local Integrado",
        "FlatBuffers para Contratos de Datos Seguros",
        "Ejecución S-Class (Air-Gapped Ready)"
      ]
    }
  };

  return (
    <div className="py-24 bg-black selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-white font-syne tracking-tighter mb-6">
            DOSSIER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-[#8a6b0d]">INSTITUCIONAL</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto font-light">
            Explora la arquitectura de nuestros sistemas de impacto y la ingeniería detrás de cada producción de éxito.
          </p>
        </div>

        {/* Tab Navigation (Adaptador) */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-white/5 p-1.5 rounded-full border border-white/5 backdrop-blur-xl">
            {(Object.keys(sections) as Array<keyof typeof sections>).map((key) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={cn(
                  "px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500",
                  activeSection === key 
                    ? "bg-[#ecb613] text-black shadow-[0_0_25px_rgba(236,182,19,0.3)] scale-105" 
                    : "text-white/40 hover:text-white"
                )}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-8">
              <div>
                <span className="text-[#ecb613] font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
                  {sections[activeSection].subtitle}
                </span>
                <h3 className="text-4xl md:text-5xl font-bold text-white font-syne leading-tight">
                  {sections[activeSection].title}
                </h3>
                <p className="text-white/60 text-lg font-light mt-6 leading-relaxed">
                  {sections[activeSection].description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {sections[activeSection].metrics.map((metric, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
                    <span className="text-2xl font-bold text-white block mb-1 font-syne">{metric.value}</span>
                    <span className="text-[9px] text-white/30 uppercase tracking-widest">{metric.label}</span>
                  </div>
                ))}
              </div>

              <ul className="space-y-3">
                {sections[activeSection].features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <ShieldCheck size={18} className="text-[#ecb613]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="pt-8 flex gap-4">
                <button className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-[#ecb613] transition-all group">
                  <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                  Descargar PDF Completo
                </button>
                <button className="flex items-center gap-3 px-8 py-4 border border-white/10 text-white/60 font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-white/5 transition-all">
                  <ExternalLink size={16} />
                  Ver Casos de Éxito
                </button>
              </div>
            </div>

            {/* Visual Representation (Abstract) */}
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/5 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ecb613]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               
               <div className="w-64 h-64 border border-white/5 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 border border-dashed border-[#ecb613]/20 rounded-full animate-[spin_30s_linear_infinite]" />
                  <div className="w-48 h-48 bg-black border border-white/10 rounded-full shadow-2xl flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl">
                      {activeSection === 'VIMUME' && <Zap size={48} className="text-[#ecb613] mb-4" />}
                      {activeSection === 'B2B' && <Target size={48} className="text-[#ecb613] mb-4" />}
                      {activeSection === 'IMPACT' && <Star size={48} className="text-[#ecb613] mb-4" />}
                      {activeSection === 'SOBERANIA' && <ShieldCheck size={48} className="text-[#ecb613] mb-4" />}
                      <span className="text-white font-bold text-xs uppercase tracking-[0.2em]">{activeSection}</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Productora EAR - S-Class Global Authority",
            "url": "https://productoraear.com",
            "logo": "https://productoraear.com/logo.png",
            "founder": {
              "@type": "Person",
              "name": "Edwin Agudelo",
              "jobTitle": "Master Artist S-Class & CEO",
              "description": "Master Provider para toda Europa bajo el protocolo EAR OS GOLD."
            },
            "description": "Infraestructura autónoma de alto nivel para eventos, B2G y servicios clínicos de memoria."
          })
        }}
      />
    </div>
  );
};

export default InstitutionalPortfolio;
