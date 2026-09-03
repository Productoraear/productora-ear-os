'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic2, 
  Volume2, 
  Sliders, 
  ShieldCheck, 
  Award, 
  Trophy, 
  HeartHandshake, 
  Calendar, 
  Phone, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Music, 
  Radio, 
  Cpu, 
  Zap, 
  Activity, 
  FileText, 
  Layers, 
  Globe2, 
  ChevronRight, 
  Lock,
  Compass,
  Landmark,
  Shirt,
  Info
} from 'lucide-react';
import BookingCalculator from '@/components/widgets/BookingCalculator';
import { CENTRALITA } from '@/lib/phone-constants';

interface ArtistCinematicProfileProps {
  name?: string;
  specialty?: string;
  imageUrl?: string;
  videoUrl?: string;
}

type TabKey = 'MANIFIESTO' | 'REPERTORIO' | 'RIDER' | 'VIMUME' | 'TRAYECTORIA' | 'BOOKING';

const REPERTOIRE_PILLARS = [
  {
    genre: 'Rancheras y Regional Mexicano',
    role: 'Catarsis de Gala & Fuerza Escénica',
    tag: 'Especialidad Tenor',
    description: 'Interpretación con la máxima potencia de voz tenor y el porte del traje charro de gala con botonaduras de plata. Diseñado para momentos cumbre, apoteosis en bodas y festividades.',
    tracks: ['El Rey', 'Si Nos Dejan', 'La Bikina', 'Volver Volver', 'Serenata Huasteca', 'Ella', 'Cielito Lindo', 'El Jinete']
  },
  {
    genre: 'Boleros S-Class',
    role: 'Intimidad Armónica & Sofisticación',
    tag: 'Microdinámica Vocal',
    description: 'Cadencia sutil, terciopelo armónico y elegancia atemporal. Ideal para cócteles selectos, cenas corporativas y recepciones de embajadas donde la conversación fluye en perfecta armonía.',
    tracks: ['Bésame Mucho', 'Sombras Nada Más', 'Sabor a Mí', 'Contigo en la Distancia', 'Reloj', 'Inolvidable', 'Adoro', 'Perfidia']
  },
  {
    genre: 'Baladas Universales y Canción de Autor',
    role: 'Clímax Emocional & Ceremonial',
    tag: 'Emoción Viva',
    description: 'Arreglos orquestados para momentos decisivos: aperturas de baile nupcial, homenajes y galas conmemorativas con tesitura lírica de amplio registro.',
    tracks: ['A Mi Manera (My Way)', 'Granada', 'Y Cómo Es Él', 'Amor Eterno', 'No Tengas Miedo', 'Hoy Tengo Ganas de Ti', 'Hasta Que Te Conocí', 'Como Yo Te Amo']
  }
];

const TECHNICAL_RIDER = [
  {
    icon: Mic2,
    category: 'Captación Vocal de Grado Broadcast',
    item: 'Shure GLXD4 & Axient Digital + Cápsula Beta 87A',
    specs: 'Micrófono de condensador supercardioide de alta precisión. Respuesta en frecuencia lineal (50 Hz - 20 kHz), rechazo extremo a acoples acústicos y rango dinámico superior para captar cada matiz del tenor sin compresión destructiva.',
    metric: 'Max SPL 140.5 dB · Condensador Broadcast'
  },
  {
    icon: Sliders,
    category: 'Mezcla y Procesamiento DSP en Sala',
    item: 'Consola Digital Behringer XR18 Air',
    specs: '18 canales de procesamiento digital con preamplificadores de diseño Midas, ecualización paramétrica de 4 bandas por canal, análisis de espectro RTA a 100 bandas en tiempo real y motores de efectos Lexicon integrados para una reverberación natural.',
    metric: '18 Canales Midas · Latencia < 0.8 ms'
  },
  {
    icon: Volume2,
    category: 'Difusión Acústica Principal (Line Array)',
    item: 'Bose F1 Model 812 + Subwoofer Activo F1',
    specs: 'Sistema de array flexible con 1.000 W de potencia bi-amplificada. Permite configurar patrones de cobertura vertical (Straight, C, J o Reverse J) para optimizar el campo reverberante del recinto y alcanzar la inteligibilidad STI > 0.75.',
    metric: '1.000 W RMS · Cobertura 100° H x 40° V'
  },
  {
    icon: Radio,
    category: 'Sistemas Satélites & Microzonas Autónomas',
    item: 'Bose S1 Pro Multi-Posición (Batería de Litio)',
    specs: 'Monitoreo de alta fidelidad y cobertura multi-ambiente para cócteles al aire libre o recepciones donde no se permiten cables visibles. Ecualización ToneMatch específica para voz y guitarra acústica.',
    metric: '109 dB Peak · 11 Horas Autonomía'
  }
];

const RECOGNITIONS = [
  {
    year: '2021',
    award: 'Gladiador Extranjero de Oro',
    organization: 'Asociación Internacional de Mérito Cultural en España',
    desc: 'Máxima distinción conferida en territorio español en reconocimiento a la trayectoria artística, resiliencia escénica y liderazgo en la música en vivo.'
  },
  {
    year: '2022',
    award: 'Diploma de Honor Consular',
    organization: 'Consulado General de Colombia en Madrid',
    desc: 'Certificación oficial de excelencia y embajador cultural por la preservación de la tradición lírica y el impacto comunitario en la Unión Europea.'
  },
  {
    year: '2023',
    award: 'Premio Más Latinos — Trayectoria Continental',
    organization: 'Premios Más Latinos Europa',
    desc: 'Galardón al mérito musical y gestión escénica por la dirección de espectáculos de alta fidelidad en los principales recintos del continente.'
  },
  {
    year: '2024',
    award: 'Compositor de la Igualdad & SROI VIMUME',
    organization: 'Observatorio Sociosanitario & Agenda 2030',
    desc: 'Distinción al diseño acústico terapéutico y la creación del protocolo neuroacústico de recuperación de memoria biográfica en centros de mayores.'
  }
];

export default function ArtistCinematicProfile({
  name = 'Edwin Agudelo',
  specialty = 'Voz, Oficio y Escenario',
  imageUrl = '/images/brand/ear_diamante_central.png',
  videoUrl = ''
}: ArtistCinematicProfileProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('MANIFIESTO');

  return (
    <div className="relative min-h-screen bg-[#050507] text-white selection:bg-[#ecb613] selection:text-black font-sans">
      
      {/* ── BARRA SUPERIOR DE AUTORIDAD ── */}
      <aside aria-label="Gobernanza y Sello" className="border-b border-white/10 bg-[#09090d]/80 backdrop-blur-md px-6 py-2.5 text-xs text-white/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#ecb613] animate-pulse" />
            <span className="font-mono uppercase tracking-widest text-[#ecb613] font-bold text-[11px]">
              S-Class Sovereign Artist Dossier
            </span>
            <span className="text-white/30">•</span>
            <span className="hidden sm:inline">Sony Music / Warner Authority Standard</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Hub Central: <strong>Méntrida (Toledo)</strong></span>
            <span>Teléfono Oficial: <a href="tel:+34693693048" className="text-[#ecb613] hover:underline font-bold">+34 693 693 048</a></span>
          </div>
        </div>
      </aside>

      {/* ── HERO CINEMATOGRÁFICO MONOCROMO S-CLASS ── */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 sm:px-10 lg:px-12 border-b border-white/10">
        {/* Iluminación de fondo radial sutil */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[1100px] bg-gradient-radial from-[#ecb613]/10 via-[#258DCD]/5 to-transparent blur-[160px]" />

        <div className="relative mx-auto max-w-7xl">
          
          {/* Breadcrumb / Retorno al Grafo Neuronal */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/50 hover:text-[#ecb613] transition-colors"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span>Centro Gravitacional EAR OS</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* RETRATO CINEMATOGRÁFICO DE AUTORIDAD */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden border border-[#ecb613]/30 bg-[#09090d] shadow-[0_25px_60px_rgba(0,0,0,0.9)] group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-black/40 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop" 
                  alt={`${name} - Tenor & Master Artist`}
                  className="h-full w-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Sello de Autenticidad */}
                <div className="absolute top-4 right-4 z-20 rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#AAD6CD]">
                  Paciente Cero EAR OS
                </div>

                {/* Badge Inferior */}
                <div className="absolute bottom-0 inset-x-0 z-20 p-5 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Tesitura Principal</p>
                      <p className="font-syne text-sm font-bold text-[#ecb613]">Tenor Lírico / Escénico</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Cierre Criptográfico</p>
                      <p className="font-mono text-xs font-bold text-white">SHA-256 Price-Lock</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MANIFIESTO HEADLINE & CTA DE CIERRE */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#ecb613] px-3.5 py-1 text-[10px] font-mono font-black uppercase tracking-widest text-black">
                  Artista Insignia
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest text-white/80">
                  Fundador Productora EAR
                </span>
                <span className="rounded-full border border-[#AAD6CD]/30 bg-[#AAD6CD]/10 px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#AAD6CD]">
                  Director Proyecto VIMUME
                </span>
              </div>

              <div>
                <h1 className="font-syne text-5xl sm:text-7xl font-black uppercase tracking-tight text-white leading-none">
                  {name}
                </h1>
                <p className="mt-3 font-syne text-xl sm:text-2xl font-light tracking-wide text-[#ecb613]">
                  {specialty}
                </p>
              </div>

              {/* Declaración Inmutable de Oficio */}
              <div className="border-l-2 border-[#ecb613] pl-6 py-2 bg-white/[0.02] rounded-r-2xl">
                <p className="text-base sm:text-lg text-white/85 font-light leading-relaxed italic">
                  &ldquo;Artista, cantante y compositor de amplia trayectoria y oficio real sobre el escenario. No vendemos números; diseñamos una arquitectura acústica y emocional indestructible que transforma un evento en un recuerdo de por vida.&rdquo;
                </p>
              </div>

              {/* STAT GRID S-CLASS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] p-4 text-center">
                  <span className="block font-syne text-2xl sm:text-3xl font-black text-[#ecb613]">160k+</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">KM de Giras</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] p-4 text-center">
                  <span className="block font-syne text-2xl sm:text-3xl font-black text-white">37</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Conciertos Int.</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] p-4 text-center">
                  <span className="block font-syne text-2xl sm:text-3xl font-black text-[#AAD6CD]">12 W</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Presión / Pax</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] p-4 text-center">
                  <span className="block font-syne text-2xl sm:text-3xl font-black text-white">80/10/10</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Split Soberano</span>
                </div>
              </div>

              {/* CTAS DE ALTO VALOR */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#cotizador-cierre"
                  className="rounded-xl bg-[#ecb613] px-8 py-4 font-mono text-xs font-black uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(236,182,19,0.3)] transition-all hover:scale-105 hover:bg-white flex items-center gap-3"
                >
                  <Lock size={15} />
                  <span>Bloquear Fecha — Depósito 100 €</span>
                </a>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Productora EAR, deseo contratar a Edwin Agudelo tras revisar su Ficha Integral S-Class.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/10 flex items-center gap-2"
                >
                  <Phone size={14} className="text-[#ecb613]" />
                  <span>Contacto Directo (+34 693 693 048)</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── NAVEGACIÓN INMERSIVA POR TABS ── */}
      <nav aria-label="Navegación de secciones del perfil" className="sticky top-0 z-40 border-b border-white/10 bg-[#050507]/90 backdrop-blur-xl px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              { key: 'MANIFIESTO', label: 'El Manifiesto & Biografía', icon: FileText },
              { key: 'REPERTORIO', label: 'Repertorio & Catarsis', icon: Music },
              { key: 'RIDER', label: 'Rider Técnico S-Class', icon: Radio },
              { key: 'VIMUME', label: 'Proyecto VIMUME (Neuroacústica)', icon: Activity },
              { key: 'TRAYECTORIA', label: 'Reconocimientos & Hitos', icon: Trophy },
              { key: 'BOOKING', label: 'Cotizador & Contratación', icon: Calendar }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── CUERPO PRINCIPAL DE LA FICHA INTEGRAL ── */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12 space-y-20">
        
        {/* TAB 1: EL MANIFIESTO (BIOGRAFÍA Y PROPÓSITO) */}
        {activeTab === 'MANIFIESTO' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                A. Identidad & Misión Vital
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                De Amagá a la Cumbre de la Producción Escénica
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                El valor de Edwin Agudelo trasciende la partitura: representa la confluencia entre el dominio visceral del escenario y el rigor de la ingeniería acústica y logística.
              </p>
            </div>

            {/* BENTO GRID BIOGRÁFICO */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Origen y Forja de Carácter */}
              <div className="md:col-span-7 rounded-3xl border border-white/10 bg-[#09090d] p-8 space-y-4">
                <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#ecb613]">
                  1975 — Origen & Temple
                </span>
                <h3 className="font-syne text-2xl font-bold uppercase text-white">
                  Raíces en Amagá y la Cátedra de la Calle
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Nacido en Amagá, Antioquia (1975), Edwin descubrió a temprana edad la sonoridad y el desgarro de la música tradicional en Medellín. A los 16 años ya lideraba presentaciones en directo con agrupaciones profesionales como <em>Tropical Mix</em>. En 1997 da el salto transoceánico a España, donde compaginó los oficios más duros —desde el corte de aluminio y la mecánica de motocicletas hasta el volante de su propio taxi— con el perfeccionamiento continuo de su emisión lírica.
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  Esta experiencia forjó una resiliencia escénica única: comprender que cada minuto frente a un público es un pacto de entrega irrenunciable, sin artificios ni concesiones a la mediocridad.
                </p>
              </div>

              {/* Productor en Retaguardia */}
              <div className="md:col-span-5 rounded-3xl border border-[#ecb613]/30 bg-gradient-to-br from-[#0e0e14] to-[#161622] p-8 space-y-4">
                <span className="rounded-full bg-[#ecb613] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-black">
                  37 Macroconciertos
                </span>
                <h3 className="font-syne text-2xl font-bold uppercase text-white">
                  Dirección Técnica & Gestión de Giras
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  Más allá del micrófono, Edwin ha ejercido como director y coordinador técnico de 37 grandes producciones internacionales en recintos icónicos de Europa, coordinando fechas históricas como las giras de <strong>Ana Gabriel</strong> en La Cubierta de Leganés y la Plaza de Toros de Valencia.
                </p>
                <div className="border-t border-white/10 pt-4 font-mono text-xs text-[#AAD6CD]">
                  Garantía de rider, distribución de corriente, seguridad perimetral y coordinación de backline de gran escala.
                </div>
              </div>

              {/* El Manifiesto del Activo Patrimonial */}
              <div className="md:col-span-12 rounded-3xl border border-white/10 bg-[#09090d] p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2 space-y-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#ecb613]">
                      Declaración Fundamental EAR OS
                    </span>
                    <h3 className="font-syne text-3xl font-black uppercase text-white">
                      &ldquo;El talento sin estructura es entropía&rdquo;
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      El modelo de Productora EAR no concibe la música como un pasatiempo efímero ni como una mercancía de bajo coste. Cada presentación de Edwin Agudelo se concibe como un activo patrimonial: un despliegue riguroso donde el artista percibe el 80% del valor, la plataforma garantiza la soberanía técnica y el 10% financia la musicoterapia sociosanitaria de VIMUME.
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l-0 lg:border-l border-white/10 lg:pl-8 space-y-2 text-center">
                    <ShieldCheck size={44} className="text-[#ecb613]" />
                    <span className="font-syne text-lg font-bold text-white uppercase">Cero Subcontratas</span>
                    <p className="font-mono text-xs text-white/50">Trato directo con la dirección de Productora EAR y el artista principal.</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: REPERTORIO Y CATARSIS EMOCIONAL */}
        {activeTab === 'REPERTORIO' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                B. Diseño Acústico & Emoción
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                Repertorio y Catarsis Emocional
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                El repertorio de Edwin Agudelo no es una sucesión aleatoria de temas: es una curva de anclaje neuroemocional calculada para generar picos de clímax, solemnidad e inolvidabilidad en momentos clave del evento.
              </p>
            </div>

            {/* 3 PILARES DEL REPERTORIO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {REPERTOIRE_PILLARS.map((pillar, idx) => (
                <div 
                  key={idx}
                  className="rounded-3xl border border-white/10 bg-[#09090d] p-8 flex flex-col justify-between space-y-6 hover:border-[#ecb613]/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#ecb613]">
                        {pillar.tag}
                      </span>
                      <Music size={18} className="text-white/40" />
                    </div>
                    <h3 className="font-syne text-2xl font-black uppercase text-white">
                      {pillar.genre}
                    </h3>
                    <p className="font-mono text-xs text-[#AAD6CD] uppercase tracking-wide">
                      {pillar.role}
                    </p>
                    <p className="text-xs text-white/60 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block">
                      Obras Emblemáticas del Setlist:
                    </span>
                    <ul className="grid grid-cols-2 gap-2 text-xs font-mono text-white/80">
                      {pillar.tracks.map((t, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <span className="h-1 w-1 rounded-full bg-[#ecb613]" />
                          <span className="truncate">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* AVISO DE PROTOCOLO ACÚSTICO */}
            <div className="rounded-2xl border border-white/10 bg-[#0c0c12] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#ecb613]/10 flex items-center justify-center shrink-0">
                  <Sliders size={22} className="text-[#ecb613]" />
                </div>
                <div>
                  <h4 className="font-syne text-base font-bold text-white uppercase">Repertorio Personalizado con 30 Días de Antelación</h4>
                  <p className="text-xs text-white/50">Disponibilidad de más de 350 canciones orquestadas. Posibilidad de arreglos especiales para ceremonias o peticiones familiares exclusivas.</p>
                </div>
              </div>
              <a
                href={`https://wa.me/34693693048?text=${encodeURIComponent('Deseo consultar el setlist completo de canciones de Edwin Agudelo.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-xl bg-white/10 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all"
              >
                Solicitar Catálogo Completo (350+ Temas)
              </a>
            </div>
          </motion.div>
        )}

        {/* TAB 3: RIDER TÉCNICO Y ARSENAL S-CLASS */}
        {activeTab === 'RIDER' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                C. Transparencia de Autoridad & Ficha Técnica
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                Rider Técnico y Presión Acústica Innegociable
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                Destruimos la incertidumbre del cliente con un despliegue técnico de grado concierto. No operamos con altavoces comerciales portátiles: garantizamos 12 W/pax mediante sistemas Bose F1 y microfonía de condensador Shure.
              </p>
            </div>

            {/* 4 TARJETAS TÉCNICAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {TECHNICAL_RIDER.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx}
                    className="rounded-3xl border border-white/10 bg-[#09090d] p-8 space-y-4 hover:border-[#ecb613]/30 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#ecb613] font-bold">
                          {item.category}
                        </span>
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <Icon size={20} className="text-[#ecb613]" />
                        </div>
                      </div>
                      <h3 className="font-syne text-xl font-bold uppercase text-white">
                        {item.item}
                      </h3>
                      <p className="text-xs text-white/60 leading-relaxed">
                        {item.specs}
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-3 flex items-center justify-between font-mono text-[11px] text-[#AAD6CD]">
                      <span>Certificación EAR OS</span>
                      <strong>{item.metric}</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* NORMATIVA ACÚSTICA MATRIZ */}
            <div className="rounded-3xl border border-[#ecb613]/40 bg-gradient-to-br from-[#0c0c12] to-[#14141e] p-8 md:p-10 space-y-6">
              <div className="flex items-center gap-3">
                <Radio className="text-[#ecb613]" size={28} />
                <h3 className="font-syne text-2xl font-black uppercase text-white">
                  Matriz de Cobertura y Logística S-Class
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-2">
                  <span className="text-[#ecb613] font-bold text-lg block">12 W / pax</span>
                  <span className="text-white uppercase font-bold block">Interiores de Gala</span>
                  <p className="text-white/50 leading-relaxed">Presión acústica óptima sin fatiga auditiva. Inteligibilidad de la palabra hablada superior al 90%.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-2">
                  <span className="text-[#ecb613] font-bold text-lg block">18 W / pax</span>
                  <span className="text-white uppercase font-bold block">Exteriores & Fincas</span>
                  <p className="text-white/50 leading-relaxed">Reserva dinámica contra viento y atenuación natural en espacios abiertos de hasta 500 invitados.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-2">
                  <span className="text-[#AAD6CD] font-bold text-lg block">&lt; 75 dB SPL</span>
                  <span className="text-white uppercase font-bold block">VIMUME Sociosanitario</span>
                  <p className="text-white/50 leading-relaxed">Techo acústico inmutable en residencias de mayores para proteger la salud auditiva de los residentes.</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between text-xs text-white/50 font-mono gap-3">
                <span>Logística S-Class: Hub Central Méntrida (Toledo) • Furgonetas 14 plazas de convoy con backline integrado.</span>
                <span className="text-[#ecb613]">1,50 €/km a partir del km 50 • Hotel (+120 €) si fin &ge; 03:00 AM o &gt; 200 km.</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: IMPACTO SOCIOSANITARIO (PROYECTO VIMUME) */}
        {activeTab === 'VIMUME' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                D. Propósito Superior & Retorno Social
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                Proyecto VIMUME: Viaje Musical por la Memoria
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                La dimensión artística de Edwin Agudelo alcanza su cumbre en la intervención neuroacústica. Como creador de VIMUME, su voz es la herramienta de reactivación de la memoria biográfica en personas con Alzheimer.
              </p>
            </div>

            {/* BENTO VIMUME */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              <div className="md:col-span-8 rounded-3xl border border-white/10 bg-[#09090d] p-8 md:p-10 space-y-5">
                <span className="rounded-full bg-[#AAD6CD]/10 border border-[#AAD6CD]/30 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#AAD6CD]">
                  Neuroacústica & Frecuencia Gamma 40Hz
                </span>
                <h3 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-white">
                  El Rescate de la Identidad Bloqueada
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Basado en investigaciones contemporáneas de neurociencia del sonido, el Proyecto VIMUME utiliza canciones del siglo XX en vivo (rancheras clásicas, pasodobles, boleros de oro) entrelazadas con estímulos de 40Hz para sincronizar las ondas cerebrales en personas de la tercera edad con deterioro cognitivo.
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  Pacientes no verbales vuelven a pronunciar oraciones completas al conectar con la vibración directa y cercana de la voz de Edwin Agudelo, produciendo una catarsis familiar de valor incalculable.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-[#ecb613] font-bold uppercase block">&bull; SROI Multiplicador</span>
                    <p className="text-xs text-white/50">Retorno social verificado de 4.2x por cada euro invertido en centros sociosanitarios.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-[#ecb613] font-bold uppercase block">&bull; Split Solidario 80/10/10</span>
                    <p className="text-xs text-white/50">El 10% de cada evento privado o corporativo de Edwin Agudelo subsidia sesiones VIMUME en residencias públicas.</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e0e14] to-[#081226] p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <Activity size={36} className="text-[#AAD6CD]" />
                  <h4 className="font-syne text-xl font-bold uppercase text-white">
                    Homologación B2G & Techo Art. 118 LCSP
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    VIMUME está adaptado para contratación directa por Ayuntamientos, Diputaciones y Consellerías bajo la figura de Contrato Menor de Servicios (&lt; 15.000 € netos) con ajuste automático preventivo a 14.250 €.
                  </p>
                </div>
                <Link
                  href="/vimume/b2g"
                  className="rounded-xl border border-[#AAD6CD]/40 bg-[#AAD6CD]/10 px-5 py-3.5 text-center font-mono text-xs font-bold uppercase tracking-widest text-[#AAD6CD] hover:bg-[#AAD6CD] hover:text-black transition-all"
                >
                  Ver Dossier Clínico VIMUME
                </Link>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 5: TRAYECTORIA Y RECONOCIMIENTOS */}
        {activeTab === 'TRAYECTORIA' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                E. Autoridad Institucional
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                Premios, Distinciones y Reconocimientos
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                Más de dos décadas de oficio real reconocidas por instituciones gubernamentales, cuerpos consulares y certámenes internacionales en España y América Latina.
              </p>
            </div>

            {/* TIMELINE DE RECONOCIMIENTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {RECOGNITIONS.map((rec, i) => (
                <div 
                  key={i}
                  className="rounded-3xl border border-white/10 bg-[#09090d] p-8 space-y-4 hover:border-[#ecb613]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-[#ecb613]">
                      {rec.year}
                    </span>
                    <Trophy size={22} className="text-white/30" />
                  </div>
                  <h3 className="font-syne text-xl font-bold uppercase text-white">
                    {rec.award}
                  </h3>
                  <p className="font-mono text-xs text-[#AAD6CD]">
                    {rec.organization}
                  </p>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {rec.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CIFRAS AUDITADAS */}
            <div className="rounded-3xl border border-white/10 bg-[#0a0a0f] p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <span className="font-syne text-3xl sm:text-4xl font-black text-white block">25+</span>
                <span className="font-mono text-xs text-white/50 uppercase">Años de Oficio Real</span>
              </div>
              <div>
                <span className="font-syne text-3xl sm:text-4xl font-black text-[#ecb613] block">350+</span>
                <span className="font-mono text-xs text-white/50 uppercase">Obras Orquestadas</span>
              </div>
              <div>
                <span className="font-syne text-3xl sm:text-4xl font-black text-[#AAD6CD] block">100%</span>
                <span className="font-mono text-xs text-white/50 uppercase">Voz en Directo</span>
              </div>
              <div>
                <span className="font-syne text-3xl sm:text-4xl font-black text-white block">4.9/5</span>
                <span className="font-mono text-xs text-white/50 uppercase">Satisfacción Auditada</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: COTIZADOR & CIERRE TRANSACCIONAL */}
        {activeTab === 'BOOKING' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                F. Cierre Transaccional Inmediato
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                Formatos Oficiales & Reserva con Depósito de 100 €
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                Seleccione el formato oficial de Edwin Agudelo, calcule el desplazamiento desde el Hub Central en Méntrida (Toledo) y bloquee su fecha con firma criptográfica SHA-256 en Stripe.
              </p>
            </div>

            {/* GRID DE FORMATOS S-CLASS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="rounded-3xl border border-[#ecb613]/40 bg-[#09090d] p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#ecb613] px-2.5 py-0.5 font-mono text-[9px] font-black uppercase text-black">
                      Tarifa Base Solista
                    </span>
                    <span className="font-mono text-xl font-bold text-[#ecb613]">350,00 €</span>
                  </div>
                  <h3 className="font-syne text-lg font-bold text-white uppercase">Solista de Gala (Edwin Agudelo)</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Voz de tenor y guitarra acústica en vivo. Sistema de sonido Bose autónomo y microfonía Shure. Ideal para cumpleaños íntimos, aniversarios y serenatas exclusivas.
                  </p>
                </div>
                <div className="border-t border-white/10 pt-3 text-[11px] font-mono text-white/40">
                  Depósito 100 € • Split 80/10/10
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#09090d] p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase text-white/80">
                      Mínimo 5 Músicos
                    </span>
                    <span className="font-mono text-xl font-bold text-white">750,00 €</span>
                  </div>
                  <h3 className="font-syne text-lg font-bold text-white uppercase">Quinteto de Gala Mariachi</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Voz principal + 2 Trompetas + Vihuela + Guitarrón. Trajes charros de gala impecables con botonadura de plata y ecualización multicanal Behringer XR18.
                  </p>
                </div>
                <div className="border-t border-white/10 pt-3 text-[11px] font-mono text-white/40">
                  Depósito 100 € • Ideal Bodas & Ferias
                </div>
              </div>

              <div className="rounded-3xl border border-[#AAD6CD]/40 bg-[#09090d] p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#AAD6CD] px-2.5 py-0.5 font-mono text-[9px] font-black uppercase text-black">
                      Suelo Innegociable
                    </span>
                    <span className="font-mono text-xl font-bold text-[#AAD6CD]">3.800,00 €</span>
                  </div>
                  <h3 className="font-syne text-lg font-bold text-white uppercase">Boda S-Class Diamond 360</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Sonorización de 3 espacios simultáneos (Ceremonia, Cóctel y Baile), microfonía Axient RF, 18 W/pax en exteriores y actuación principal de Edwin Agudelo.
                  </p>
                </div>
                <div className="border-t border-white/10 pt-3 text-[11px] font-mono text-white/40">
                  Depósito 100 € • Bloqueo 72h Garantizado
                </div>
              </div>

            </div>

            {/* COTIZADOR EMBEBIDO */}
            <div id="cotizador-cierre" className="rounded-3xl border border-white/10 bg-[#09090d] p-6 md:p-10 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ecb613] font-bold">
                  Motor de Cotización Transaccional EAR OS v2
                </span>
                <h3 className="font-syne text-2xl font-black uppercase text-white mt-1">
                  Calcular y Bloquear Fecha en 1-Clic
                </h3>
                <p className="text-xs text-white/50 mt-1">
                  Cálculo automático de kilometraje desde Méntrida (1,50 €/km), suplemento hotelero (+120 €) y recargo acústico por aforo (12-18 W/pax).
                </p>
              </div>

              <BookingCalculator />
            </div>

          </motion.div>
        )}

      </div>

      {/* ── FOOTER DE AUTORIDAD Y CONTACTO ── */}
      <footer className="border-t border-white/10 bg-[#070709] px-6 py-12 text-center sm:text-left text-xs text-white/50">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="font-syne font-bold text-white text-sm uppercase">Productora EAR & Edwin Agudelo</p>
            <p>Hub Central: Méntrida (Toledo) • Sede Operativa de Gestión y Logística 360.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px]">
            <a href={`tel:${CENTRALITA.display}`} className="text-white hover:text-[#ecb613]">
              {CENTRALITA.display}
            </a>
            <span className="text-white/20">•</span>
            <a href="mailto:direccion@productoraear.com" className="text-white hover:text-[#ecb613]">
              direccion@productoraear.com
            </a>
            <span className="text-white/20">•</span>
            <Link href="/vimume" className="text-[#AAD6CD] hover:underline">
              Proyecto VIMUME
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
