'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Music, Mic2, HeartHandshake, Sparkles, Crown, AlertTriangle, Layers } from 'lucide-react';
import Link from 'next/link';

const perfiles = [
  {
    id: 'bodas',
    perfilNum: 'PERFIL 1 · B2C PRIVATE',
    title: 'BODAS, GALAS & CLIENTE BESPOKE',
    desc: 'No contrates a ciegas. Presupuesto exacto sin costes ocultos para bodas, aniversarios y galas privadas con Price-Lock SHA-256 (72h), sonorización Pista-BPM Bose/Shure, Plan B redundante in situ y congelación de tarifa con solo 10 € de depósito.',
    cta: 'COTIZACIÓN BESPOKE',
    icon: HeartHandshake,
    href: '/bodas',
    accent: '#ecb613',
    cardStyle: 'hover:border-[#ecb613]/80 hover:shadow-[0_0_40px_-5px_rgba(236,182,19,0.3)]',
    badgeStyle: 'bg-[#ecb613]/10 text-[#ecb613] border-[#ecb613]/30',
    btnStyle: 'bg-white/5 hover:bg-[#ecb613] hover:text-black border-white/10 hover:border-[#ecb613]'
  },
  {
    id: 'b2g',
    perfilNum: 'PERFIL 2 · PUBLIC SECTOR',
    title: 'INSTITUCIÓN & B2G (VIMUME)',
    desc: 'Ayuntamientos, comisiones y residencias. Contratación pública simplificada y adjudicación directa en <24h bajo el Art. 118 LCSP (<15.000 €), respaldada por fondos NextGenEU y protocolos de neuroestimulación cognitiva 40Hz.',
    cta: 'PLIEGOS B2G & VIMUME',
    icon: ShieldCheck,
    href: '/vimume',
    accent: '#3b82f6',
    cardStyle: 'hover:border-blue-500/50 hover:shadow-[0_0_35px_-5px_rgba(59,130,246,0.3)]',
    badgeStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    btnStyle: 'bg-white/5 hover:bg-blue-500 hover:text-white border-white/10 hover:border-blue-500'
  },
  {
    id: 'partners',
    perfilNum: 'PERFIL 3 · B2B NETWORK',
    title: 'PROVEEDOR, NODO & PARTNER B2B',
    desc: 'Los directorios tradicionales subastan tus leads a tu competencia. Reclama tu ficha soberana entre los 24.869 proveedores homologados (Line Array, microfonía, logística), con contacto directo a WhatsApp y cero comisiones.',
    cta: 'INGRESAR AL ECOSISTEMA',
    icon: Music,
    href: '/empresarios',
    accent: '#10b981',
    cardStyle: 'hover:border-emerald-500/50 hover:shadow-[0_0_35px_-5px_rgba(16,185,129,0.3)]',
    badgeStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    btnStyle: 'bg-white/5 hover:bg-emerald-500 hover:text-black border-white/10 hover:border-emerald-500'
  },
  {
    id: 'artistas',
    perfilNum: 'PERFIL 4 · TALENT VAULT',
    title: 'ARTISTA, PRODUCCIÓN & THE SIGNAL',
    desc: 'El 90% de los artistas independientes regala su margen por falta de estructura. Somete tu propuesta al Test de 10 Fases Meritorias para Diamantes Rojos y accede a la liquidación soberana bajo el split 80/10/10.',
    cta: 'EVALUAR EN THE SIGNAL',
    icon: Mic2,
    href: '/the-signal',
    accent: '#ecb613',
    cardStyle: 'border-[#ecb613]/50 hover:border-[#ecb613] hover:shadow-[0_0_50px_-5px_rgba(236,182,19,0.45)] bg-gradient-to-b from-[#110e05]/95 to-[#09090d]/95',
    badgeStyle: 'bg-[#ecb613] text-black font-black border-[#ecb613]',
    btnStyle: 'bg-[#ecb613] hover:bg-white text-black font-black border-[#ecb613] hover:border-white shadow-lg shadow-[#ecb613]/25'
  },
];

export default function CinematicHeroSClass() {
  return (
    <section className="relative min-h-screen w-full bg-[#050505] text-gray-200 overflow-hidden flex flex-col justify-center items-center px-4 sm:px-8 py-24 sm:py-32 selection:bg-[#ecb613]/30 font-sans">
      
      {/* Neblinas Volumétricas de Fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/15 blur-[160px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[160px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#ecb613]/5 blur-[140px] pointer-events-none" />

      {/* Encabezado Cinemático con Fusión Aditiva S-Class */}
      <div className="z-10 text-center max-w-5xl mb-14 mt-4 space-y-6">
        
        {/* Kicker Overline */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-black uppercase tracking-[0.35em]">
          <Layers size={13} className="text-[#ecb613]" />
          <span>ADAPTACIÓN MULTI-PERFIL · ORQUESTACIÓN S-CLASS</span>
        </div>

        {/* H1 Principal: Interrupción de Patrón */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-syne text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-[0.95]"
        >
          El 84% de los presupuestos <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">
            esconden un 35% de sobrecoste invisible.
          </span>
        </motion.h1>

        {/* H2 Secundario: Claridad Estructural */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-syne text-xl sm:text-2xl md:text-3xl font-bold text-gray-200 tracking-tight"
        >
          Cuatro Perfiles. Cuatro Caminos. <span className="text-[#ecb613]">Una Sola Inteligencia Soberana.</span>
        </motion.h2>

        {/* Subtítulo de Autoridad y Ejecución */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-inter text-sm sm:text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Eliminamos la intermediación parásita. Blindamos tu fecha con <strong className="text-white font-medium">Price-Lock SHA-256 (72h)</strong>, sonorización garantizada a <strong className="text-white font-medium">12 W/pax</strong> y ejecución técnica S-Class sin margen de error. Selecciona tu vector de entrada:
        </motion.p>
      </div>

      {/* Grid de 4 Perfiles Glassmorphism */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {perfiles.map((perfil, index) => (
          <Link href={perfil.href} key={perfil.id} className="group outline-none block h-full">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`relative h-full flex flex-col justify-between p-7 rounded-3xl bg-[#09090d]/85 backdrop-blur-xl border border-white/5 transition-all duration-500 overflow-hidden shadow-2xl ${perfil.cardStyle}`}
            >
              {/* Resplandor reactivo interno */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="space-y-6 z-10">
                {/* Header Icon + Perfil Badge */}
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <perfil.icon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase border ${perfil.badgeStyle}`}>
                    {perfil.perfilNum}
                  </span>
                </div>
                
                {/* Title & Desc */}
                <div className="space-y-2">
                  <h3 className="font-syne text-lg sm:text-xl font-bold uppercase text-white tracking-tight leading-snug group-hover:text-[#ecb613] transition-colors">
                    {perfil.title}
                  </h3>
                  <p className="font-inter text-gray-400 leading-relaxed text-xs font-light">
                    {perfil.desc}
                  </p>
                </div>
              </div>

              {/* Action Button CTA */}
              <div className="pt-6 z-10">
                <div className={`w-full py-3 px-4 rounded-xl border text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-300 ${perfil.btnStyle}`}>
                  <span>{perfil.cta}</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </motion.div>
          </Link>
        ))}
      </div>

    </section>
  );
}
