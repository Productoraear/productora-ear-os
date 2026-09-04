"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Target, 
  GraduationCap, 
  Landmark, 
  History, 
  ShieldCheck, 
  Calendar, 
  Brain, 
  Megaphone, 
  Globe, 
  Lock, 
  Shirt, 
  Ticket, 
  Heart, 
  Scale, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Phone,
  CheckCircle2,
  Trophy,
  Award
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

type EcosystemTab = 'ESTRATEGIA' | 'MARCA' | 'METODOLOGIA' | 'CATEDRA' | 'BIOGRAFIA';

export const EdwinEcosystemHero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EcosystemTab>('ESTRATEGIA');

  return (
    <section className="relative w-full bg-[#050505] text-white pt-24 pb-16 px-4 md:px-8 font-sans overflow-hidden selection:bg-[#ecb613]/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-[#ecb613]/10 via-transparent to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* TOP LINK: VOLVER AL HUB */}
        <div>
          <Link 
            href="/artistas" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-[#ecb613] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Volver al Hub</span>
          </Link>
        </div>

        {/* HERO CARD & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PHOTO BOX CON BADGE */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-3xl overflow-hidden border border-[#ecb613]/30 bg-[#0a0a0f] shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
              {/* Imagen de Edwin Agudelo cantando */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop" 
                alt="Edwin Agudelo - Master Artist"
                className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Badge Cómplice Estratégico */}
              <div className="absolute bottom-0 inset-x-0 z-20 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center">
                <div className="w-full py-2.5 px-4 bg-[#ecb613] text-black font-black text-[11px] uppercase tracking-[0.25em] rounded-xl flex items-center justify-center gap-2 shadow-lg">
                  <ShieldCheck size={16} />
                  <span>Cómplice Estratégico</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN HEADLINE, QUOTE & 4 STAT BOXES */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tag Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-[#ecb613] text-black text-[10px] font-black uppercase tracking-widest font-mono">
                Compositor de la Igualdad
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest font-mono border border-white/10">
                CEO Productora EAR
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white font-syne leading-none">
              Edwin Agudelo
            </h1>

            {/* Quote Block */}
            <div className="border-l-2 border-[#ecb613] pl-6 py-2">
              <p className="text-lg md:text-xl text-white/80 italic font-light leading-relaxed">
                "No vendo música, diseño el activo patrimonial de tu talento. Mi compromiso es que dejes de sobrevivir y empieces a trascender."
              </p>
            </div>

            {/* 4 Stat Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-[#0e0e12] border border-white/5 text-center flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-black text-[#ecb613] font-syne leading-none mb-1">160k</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">KM Cantados</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e0e12] border border-white/5 text-center flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-black text-white font-syne leading-none mb-1">37</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Conciertos Int.</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e0e12] border border-white/5 text-center flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-black text-white font-syne leading-none mb-1">95%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Satisfacción</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0e0e12] border border-white/5 text-center flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-black text-white font-syne leading-none mb-1">24/7</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Compromiso</span>
              </div>
            </div>

            {/* 👑 FORMATOS OFICIALES DE CONTRATACIÓN S-CLASS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Formato 1: Solista Premium */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e0e14] to-[#15151e] border border-[#ecb613]/30 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-[#ecb613] text-black px-2.5 py-0.5 rounded-full font-mono">
                      SERVICIO DESTACADO
                    </span>
                    <span className="text-xl font-black text-[#ecb613] font-mono">350 €</span>
                  </div>
                  <h4 className="text-base font-black uppercase text-white font-syne">
                    Solista Premium S-Class
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Especial para <strong>Cumpleaños, Fiestas Privadas, Día de la Madre, Día del Padre y San Valentín</strong>. Voz y guitarra con sonido Bose y dedicatoria personalizada.
                  </p>
                </div>
                <Link
                  href="/cotizador?formato=solista-premium"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-[#ecb613] text-white hover:text-black font-black text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>Reservar Solista (350 €)</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Formato 2: Quinteto Mínimo 5 Músicos */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e0e14] to-[#15151e] border border-white/10 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-white/80 px-2.5 py-0.5 rounded-full font-mono border border-white/10">
                      MÍNIMO 5 MÚSICOS
                    </span>
                    <span className="text-xl font-black text-white font-mono">750 €</span>
                  </div>
                  <h4 className="text-base font-black uppercase text-white font-syne">
                    Quinteto de Gala S-Class
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Formato oficial de agrupación para <strong>Bodas, Ferias y Galas</strong>. 5 Maestros (Voz + 2 Trompetas + Vihuela + Guitarrón) con trajes charros y sonido multicanal.
                  </p>
                </div>
                <Link
                  href="/cotizador?formato=quinteto-5-musicos"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-[#ecb613] text-white hover:text-black font-black text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>Reservar Quinteto (750 €)</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* ECOSYSTEM TAB NAVIGATION */}
        <div className="flex flex-wrap gap-2 md:gap-3 p-2 bg-[#0c0c10] border border-white/10 rounded-2xl">
          <button
            onClick={() => setActiveTab('ESTRATEGIA')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'ESTRATEGIA' 
                ? 'bg-[#ecb613] text-black shadow-lg' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap size={15} />
            <span>Estrategia 360</span>
          </button>

          <button
            onClick={() => setActiveTab('MARCA')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'MARCA' 
                ? 'bg-[#ecb613] text-black shadow-lg' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Target size={15} />
            <span>Marca Personal</span>
          </button>

          <button
            onClick={() => setActiveTab('METODOLOGIA')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'METODOLOGIA' 
                ? 'bg-[#ecb613] text-black shadow-lg' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <GraduationCap size={15} />
            <span>Metodología EAR</span>
          </button>

          <button
            onClick={() => setActiveTab('CATEDRA')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'CATEDRA' 
                ? 'bg-[#ecb613] text-black shadow-lg' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Landmark size={15} />
            <span>Cátedra Mariachi</span>
          </button>

          <button
            onClick={() => setActiveTab('BIOGRAFIA')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'BIOGRAFIA' 
                ? 'bg-[#ecb613] text-black shadow-lg' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <History size={15} />
            <span>Biografía</span>
          </button>
        </div>

        {/* TAB 1: ESTRATEGIA 360 (RUTA DE CARRERA ARTÍSTICA) */}
        {activeTab === 'ESTRATEGIA' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            {/* Header de la Ruta */}
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-syne">
                Ruta de Carrera Artística
              </h2>
              <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto">
                Nuestra arquitectura de gestión cubre cada ángulo crítico de una carrera profesional.
              </p>
            </div>

            {/* Inversión Recomendada Banner */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#0d0d12] border border-[#ecb613]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613] font-mono block">
                  Inversión Recomendada
                </span>
                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                  <span className="text-4xl sm:text-5xl font-black text-white font-syne">€150</span>
                  <span className="text-sm font-bold text-white/50 uppercase tracking-widest">/ Mensual</span>
                </div>
                <p className="text-xs text-white/40 pt-1">
                  Planes Premium desde €1000/mes (Incluye fotos, video y acompañamiento)
                </p>
              </div>

              <a
                href={CENTRALITA.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-8 py-4 bg-[#ecb613] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(236,182,19,0.3)] hover:scale-105 cursor-pointer shrink-0"
              >
                <Calendar size={16} />
                <span>Agendar Cita de 30 Min (Sin Compromiso)</span>
              </a>
            </div>

            {/* 8 Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Desarrollo de Mentalidad */}
              <div className="p-6 rounded-3xl bg-[#0a0a0e] border border-white/5 hover:border-[#ecb613]/40 transition-all group space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors font-syne">
                  Desarrollo de Mentalidad
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Fomentamos creatividad, resiliencia y autenticidad. Talleres para abrazar el fracaso como motor de crecimiento.
                </p>
              </div>

              {/* Card 2: Branding & Marketing */}
              <div className="p-6 rounded-3xl bg-[#0a0a0e] border border-white/5 hover:border-[#ecb613]/40 transition-all group space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Megaphone size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors font-syne">
                  Branding & Marketing
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Estrategias innovadoras para destacar en mercados saturados. Tu marca es tu promesa.
                </p>
              </div>

              {/* Card 3: Networking Estratégico */}
              <div className="p-6 rounded-3xl bg-[#0a0a0e] border border-white/5 hover:border-[#ecb613]/40 transition-all group space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors font-syne">
                  Networking Estratégico
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Habilidades para construir relaciones de valor. Acceso directo a nuestra red de contactos internacional.
                </p>
              </div>

              {/* Card 4: Estrategia Exclusiva */}
              <div className="p-6 rounded-3xl bg-[#0a0a0e] border border-white/5 hover:border-[#ecb613]/40 transition-all group space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors font-syne">
                  Estrategia Exclusiva
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Contenido y acompañamiento premium solo para suscriptores certificados EAR.
                </p>
              </div>

              {/* Card 5: Merchandising de Autor */}
              <div className="p-6 rounded-3xl bg-[#0a0a0e] border border-white/5 hover:border-[#ecb613]/40 transition-all group space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shirt size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors font-syne">
                  Merchandising de Autor
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Diseño y producción de identidad tangible que refleja tu estilo y genera ingresos.
                </p>
              </div>

              {/* Card 6: Eventos & Ticketing */}
              <div className="p-6 rounded-3xl bg-[#0a0a0e] border border-white/5 hover:border-[#ecb613]/40 transition-all group space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Ticket size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors font-syne">
                  Eventos & Ticketing
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Asesoramiento en organización y venta de entradas para maximizar asistencia y retorno.
                </p>
              </div>

              {/* Card 7: Fan Experience */}
              <div className="p-6 rounded-3xl bg-[#0a0a0e] border border-white/5 hover:border-[#ecb613]/40 transition-all group space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors font-syne">
                  Fan Experience
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Meet & Greets, pases VIP y experiencias únicas para fidelizar a tu comunidad real.
                </p>
              </div>

              {/* Card 8: Blindaje Legal/Fiscal */}
              <div className="p-6 rounded-3xl bg-[#0a0a0e] border border-white/5 hover:border-[#ecb613]/40 transition-all group space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Scale size={24} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors font-syne">
                  Blindaje Legal/Fiscal
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Derechos de autor, contratos y planificación fiscal. Protegemos tu patrimonio futuro.
                </p>
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 2: MARCA PERSONAL */}
        {activeTab === 'MARCA' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 md:p-12 rounded-3xl bg-[#0a0a0e] border border-white/5 space-y-6"
          >
            <span className="text-[#ecb613] text-xs font-mono font-black uppercase tracking-[0.3em] block">
              Posicionamiento Asimétrico de Autoridad
            </span>
            <h3 className="text-3xl font-black uppercase text-white font-syne">
              Arquitectura de Marca para Artistas S-Class
            </h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-4xl">
              Un artista sin marca propia es un comodity expuesto a la guerra de precios. Edwin Agudelo enseña y estructura la transición hacia la <strong>autoridad indiscutible</strong>: diseño de identidad visual de gala, narrativa de origen indestructible, y un catálogo de productos con tickets desde 350€ hasta 3.000€ que eliminan la dependencia de intermediarios abusivos.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[#ecb613] font-black text-xl">01</span>
                <h4 className="font-bold text-sm text-white">Identidad Visual Soberana</h4>
                <p className="text-xs text-white/50">Paleta de color corporativa, trajes de autor y dossier digital.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[#ecb613] font-black text-xl">02</span>
                <h4 className="font-bold text-sm text-white">Narrativa del Héroe</h4>
                <p className="text-xs text-white/50">Transformación de la resiliencia en conexión emocional instantánea.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[#ecb613] font-black text-xl">03</span>
                <h4 className="font-bold text-sm text-white">Blindaje de Caché</h4>
                <p className="text-xs text-white/50">Estructura de precios fija con retención del 80% para el creador.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: METODOLOGÍA EAR */}
        {activeTab === 'METODOLOGIA' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 md:p-12 rounded-3xl bg-[#0a0a0e] border border-white/5 space-y-6"
          >
            <span className="text-[#ecb613] text-xs font-mono font-black uppercase tracking-[0.3em] block">
              Infraestructura de Gestión 360
            </span>
            <h3 className="text-3xl font-black uppercase text-white font-syne">
              El Sistema de los 4 Pilares de Productora EAR
            </h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-4xl">
              La metodología de Edwin Agudelo se sustenta en más de 25 años de experiencia empírica y 37 conciertos internacionales:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-base font-black text-[#ecb613] uppercase">Pilar 1: Presión Acústica Rigurosa</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Cálculo de 12 W/pax con matrices de audio Bose F1 y L-Acoustics para garantizar inteligibilidad perfecta en cualquier recinto.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-base font-black text-[#ecb613] uppercase">Pilar 2: Protocolo Plan B</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Redundancia total en microfonía inalámbrica Shure Axient Digital, amplificación y cableado ante contingencias.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-base font-black text-[#ecb613] uppercase">Pilar 3: Split Atómico Soberano</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  80% del valor para el talento ejecutor, 10% para custodia EAR OS y 10% para el fondo social VIMUME.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-base font-black text-[#ecb613] uppercase">Pilar 4: Blindaje B2G & Legal</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Cumplimiento estricto del Art. 118 LCSP para contratos menores con administraciones públicas y corporaciones.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: CÁTEDRA MARIACHI */}
        {activeTab === 'CATEDRA' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 md:p-12 rounded-3xl bg-[#0a0a0e] border border-white/5 space-y-6"
          >
            <span className="text-[#ecb613] text-xs font-mono font-black uppercase tracking-[0.3em] block">
              Patrimonio Cultural Inmaterial
            </span>
            <h3 className="text-3xl font-black uppercase text-white font-syne">
              Cátedra y Formación de Gala de Mariachi
            </h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-4xl">
              Edwin Agudelo preserva la pureza y el protocolo del Mariachi tradicional. Desde el corte exacto del traje de charro con botonadura de plata hasta la técnica de emisión vocal para tenor lírico al aire libre, cada ensamble bajo su dirección es un homenaje a la máxima excelencia musical.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <Trophy size={28} className="text-[#ecb613] mx-auto" />
                <h4 className="font-bold text-sm text-white">Gladiador Extranjero 2021</h4>
                <p className="text-xs text-white/50">Máximo reconocimiento al mérito artístico y cultural en España.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <Award size={28} className="text-[#ecb613] mx-auto" />
                <h4 className="font-bold text-sm text-white">Diploma Consular</h4>
                <p className="text-xs text-white/50">Certificado por el Consulado General de Colombia en Madrid.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                <Sparkles size={28} className="text-[#ecb613] mx-auto" />
                <h4 className="font-bold text-sm text-white">Premio Más Latinos</h4>
                <p className="text-xs text-white/50">Distinción a la trayectoria y liderazgo musical en Europa.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: BIOGRAFÍA */}
        {activeTab === 'BIOGRAFIA' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 md:p-12 rounded-3xl bg-[#0a0a0e] border border-white/5 space-y-6"
          >
            <span className="text-[#ecb613] text-xs font-mono font-black uppercase tracking-[0.3em] block">
              Historia de Resiliencia & Conquista
            </span>
            <h3 className="text-3xl font-black uppercase text-white font-syne">
              La Cátedra del Escenario y el Efecto Fénix
            </h3>
            <div className="space-y-4 text-white/70 text-sm md:text-base leading-relaxed max-w-4xl">
                Edwin descubrió su vocación por la música tradicional en su juventud, forjando su temple en los escenarios de alto rendimiento antes de establecerse como referente técnico y vocal en Europa.
              <p>
                Tras años de esfuerzo incansable asumiendo la dirección técnica de grandes salas de eventos, consolidó la coordinación de 37 macroconciertos internacionales (apoyando giras de artistas de renombre).
              </p>
              <p className="text-white font-bold italic border-l-2 border-[#ecb613] pl-4">
                Hoy, como fundador de Productora EAR y el movimiento VIMUME, su propósito es empoderar a la nueva generación de artistas para que conviertan su talento en un activo patrimonial indestructible.
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};
