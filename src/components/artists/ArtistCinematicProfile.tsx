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
  Info,
  Users,
  Clock,
  Check
} from 'lucide-react';
import BookingCalculator from '@/components/widgets/BookingCalculator';
import SClassIrresistibleOffer from '@/components/sclass/SClassIrresistibleOffer';
import { CENTRALITA } from '@/lib/phone-constants';
import { SCLASS_ROSTER_14_FORMATS, FormatPricing } from '@/lib/constants/pricing-catalog';

interface ArtistCinematicProfileProps {
  name?: string;
  specialty?: string;
  imageUrl?: string;
  videoUrl?: string;
}

type TabKey = 'MANIFIESTO' | 'ROSTER_14' | 'REPERTORIO' | 'RIDER' | 'VIMUME' | 'TRAYECTORIA' | 'BOOKING';
type RosterCategoryFilter = 'TODOS' | 'SOLISTA' | 'CAMARA' | 'ENSAMBLE' | 'ESPECIALIDAD' | 'TECNICA' | 'B2G';

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
  imageUrl = '/images/brand/ear_logo_official_diamond.png',
  videoUrl = ''
}: ArtistCinematicProfileProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('MANIFIESTO');
  const [rosterFilter, setRosterFilter] = useState<RosterCategoryFilter>('TODOS');
  const [selectedFormatId, setSelectedFormatId] = useState<string>('solista-edwin-agudelo');

  const filteredRoster = rosterFilter === 'TODOS'
    ? SCLASS_ROSTER_14_FORMATS
    : SCLASS_ROSTER_14_FORMATS.filter(f => f.category === rosterFilter);

  const handleSelectFormatAndQuote = (formatId: string) => {
    setSelectedFormatId(formatId);
    setActiveTab('BOOKING');
    setTimeout(() => {
      const el = document.getElementById('cotizador-cierre');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-[#030305] text-white selection:bg-[#FF2B44] selection:text-white font-sans pt-28 md:pt-32">
      
      {/* ── BARRA SUPERIOR DE AUTORIDAD Y CONTACTO DIRECTO ── */}
      <aside aria-label="Gobernanza y Sello" className="border-b border-white/10 bg-[#07070b]/90 backdrop-blur-xl px-6 py-2 text-xs text-white/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[#FF2B44] animate-pulse" />
            <span className="font-mono uppercase tracking-[0.2em] text-[#FF2B44] font-bold text-[11px]">
              Dossier Oficial de Artista Homologado
            </span>
            <span className="text-white/20">•</span>
            <span className="hidden sm:inline font-mono text-[11px] text-[#AAD6CD]">Protocolo Acústico Certificado 12 W/pax</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Base Logística: <strong className="text-white">Méntrida (Toledo)</strong></span>
            <span>Atención Directa: <a href="tel:+34693693048" className="text-[#FF2B44] hover:underline font-bold">+34 693 693 048</a></span>
          </div>
        </div>
      </aside>

      {/* ── HERO HIGH-END S-CLASS MASTER IMPACT ── */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-8 lg:px-12 border-b border-white/10">
        {/* Halo volumétrico de alta gama */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[550px] w-[1000px] bg-gradient-radial from-[#FF2B44]/15 via-[#258DCD]/5 to-transparent blur-[140px]" />

        <div className="relative mx-auto max-w-7xl space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* VÍDEO EN ALTA RETENCIÓN 1080p (SIN FUGAS A YOUTUBE) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative w-full rounded-3xl overflow-hidden border border-white/15 bg-black shadow-[0_25px_70px_rgba(0,0,0,0.95)] group">
                
                {/* Frame de Vídeo High-End con Parámetros Anti-Fuga */}
                <div className="relative w-full aspect-video bg-black overflow-hidden">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/fLT4-kqfdI4?rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&fs=1&disablekb=0"
                    title="Edwin Agudelo - Master Showcase en Directo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                
                {/* Barra de Telemetría Inferior High-End */}
                <div className="px-5 py-3.5 bg-[#08080c] border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#FF2B44] animate-ping" />
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF2B44] font-bold">
                      Directo de Gala · Máxima Calidad
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-white/60">
                    <span className="text-[#AAD6CD]">Bose F1 (12 W/pax)</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/80">Shure Beta 87A</span>
                  </div>
                </div>

              </div>
            </div>

            {/* PROPUESTA DE VALOR DE IMPACTO INMEDIATO */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#FF2B44] px-3.5 py-1 text-[10px] font-mono font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(255,43,68,0.4)]">
                  Tenor Lírico Solista
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-white/80">
                  Productora EAR
                </span>
                <span className="rounded-full border border-[#AAD6CD]/30 bg-[#AAD6CD]/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#AAD6CD]">
                  Proyecto VIMUME
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
                  {name}
                </h1>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#AAD6CD] font-bold">
                  {specialty}
                </p>
              </div>

              {/* PROPUESTA DE VALOR DIRECTA: CONVIERTE TU EVENTO EN UNA OVACIÓN HISTÓRICA */}
              <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.04] to-transparent p-5 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF2B44]" />
                <h2 className="font-syne text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
                  Convierte tu evento en una ovación que tus invitados recordarán durante décadas
                </h2>
                <p className="font-sans text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                  No vendemos minutos de música de fondo; aseguramos una presencia escénica visceral con tesitura de tenor lírico y la sonorización de alta fidelidad más limpia de Madrid y Toledo.
                </p>
              </div>

              {/* DATOS DE AUTORIDAD COMPACTOS */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                <div className="rounded-xl border border-white/10 bg-[#09090e] p-2.5 text-center">
                  <span className="block font-syne text-lg sm:text-xl font-black text-[#FF2B44]">160k+</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/50">KM Escenario</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#09090e] p-2.5 text-center">
                  <span className="block font-syne text-lg sm:text-xl font-black text-white">37</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/50">Giras Int.</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#09090e] p-2.5 text-center">
                  <span className="block font-syne text-lg sm:text-xl font-black text-[#AAD6CD]">14</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/50">Formatos</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#09090e] p-2.5 text-center">
                  <span className="block font-syne text-lg sm:text-xl font-black text-white">80/10/10</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/50">Soberano</span>
                </div>
              </div>

              {/* ACCIONES DE CIERRE DIRECTO */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => handleSelectFormatAndQuote('solista-edwin-agudelo')}
                  className="rounded-xl bg-[#FF2B44] px-6 py-3.5 font-mono text-xs font-black uppercase tracking-[0.15em] text-white shadow-[0_0_25px_rgba(255,43,68,0.4)] transition-all hover:scale-105 hover:bg-white hover:text-black flex items-center gap-2.5 cursor-pointer"
                >
                  <Lock size={14} />
                  <span>Bloquear Fecha (100 €)</span>
                </button>
                <button
                  onClick={() => setActiveTab('ROSTER_14')}
                  className="rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                >
                  <Layers size={14} className="text-[#AAD6CD]" />
                  <span>Ver los 14 Formatos</span>
                </button>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, deseo consultar disponibilidad para tu actuación de Tenor Solista Mariachi 350€.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-[#AAD6CD]/40 bg-[#AAD6CD]/10 px-4 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#AAD6CD] transition-colors hover:bg-[#AAD6CD]/20 flex items-center gap-2"
                >
                  <Phone size={13} />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── LA OFERTA IRRESISTIBLE S-CLASS (SECUENCIA DE 8 PASOS DE VALOR) ── */}
      <SClassIrresistibleOffer
        promiseBadge="CONTRATACIÓN DIRECTA S-CLASS // EDWIN AGUDELO"
        headlinePromise="Convierte tu evento en una ovación histórica que tus invitados recordarán durante décadas"
        subPromise="No contratas minutos de música de fondo; aseguras una presencia escénica arrolladora con tesitura de tenor lírico y la sonorización de alta fidelidad más nítida de Madrid y Toledo."
        benefits={[
          {
            title: "Catarsis Emocional Garantizada",
            desc: "Dominio absoluto del clímax festivo y ceremonial. Repertorio de mariachi, rancheras de gala y boleros que erizan la piel y levantan a todos los invitados."
          },
          {
            title: "Cero Distorsión y Cero Acoples",
            desc: "Ingeniería de sonido militarizada: micrófonos Shure Axient Beta 87A y columnas Bose F1 con presión homogénea de 12 W/pax sin fatiga auditiva."
          },
          {
            title: "Trato Directo sin Intermediarios",
            desc: "Hablas directamente con el artista principal y la dirección técnica de Productora EAR. 100% de compromiso, puntualidad británica y traje charro impecable."
          }
        ]}
        deliverablesBadge="ENTREGABLES TANGIBLES Y COMPROMISOS EXACTOS"
        deliverablesTitle="Lo que recibes en tu celebración sin sorpresas ni letra pequeña"
        deliverables={[
          {
            spec: "1x Tenor Solista en Vivo (Edwin Agudelo)",
            detail: "Actuación estelar de 60 minutos ininterrumpidos con traje de gala charro artesanal y botonaduras de plata."
          },
          {
            spec: "Sistema de PA Bose F1 Model 812",
            detail: "Despliegue acústico con dispersión vertical flexible homologado a 12 W por invitado hasta 300 personas."
          },
          {
            spec: "Microfonía Inalámbrica Shure Beta 87A",
            detail: "Cápsula de condensador súpercardioide para una inteligibilidad de la voz cristalina en interiores y exteriores."
          },
          {
            spec: "Transporte y Montaje Técnico Incluido",
            detail: "Llegada con 60 minutos de antelación para prueba de sonido sin interferir con la recepción de invitados."
          }
        ]}
        priceAnchor={{
          totalValueEstimate: "750,00 €",
          finalPrice: "350,00 €",
          depositAmount: "100,00 €",
          periodOrFormat: "Tarifa Suelo Oficial Solista (1 hora)",
          legalNote: "Tarifa base para eventos en radio de 50 km desde Hub Méntrida. Kilometraje adicional: 1,50 €/km."
        }}
        guarantee={{
          badgeText: "GARANTÍA SOBERANA RIESGO CERO",
          title: "Garantía de Satisfacción Total y Acústica Homologada",
          description: "Si el despliegue técnico o la calidad vocal no cumple con los estándares certificados de Productora EAR OS, tienes respaldo directo de la dirección. Tu reserva de 100 € queda protegida con firma criptográfica SHA-256 válida durante 72 horas."
        }}
        bonuses={[
          {
            title: "Dedicatoria y Canción Personalizada de Entrada",
            realValue: "120,00 €",
            description: "Adaptamos la primera canción con dedicatoria expresa a los novios, homenajeados o directivos de la empresa para arrancar con impacto emocional máximo."
          },
          {
            title: "Micrófono Inalámbrico Extra para Discursos",
            realValue: "80,00 €",
            description: "Dejamos a disposición de la familia o anfitriones un micrófono Shure profesional conectado al sistema Bose para brindis y discursos sin coste."
          }
        ]}
        objections={[
          {
            question: "¿Qué ocurre si la ceremonia o la cena se retrasa?",
            answer: "No te preocupes. Como profesionales con más de 25 años de oficio, llegamos con antelación y nuestro equipo se coordina con el maître o wedding planner para ajustar el inicio al instante perfecto."
          },
          {
            question: "¿Y si el espacio de la finca o salón es reducido?",
            answer: "El sistema Bose F1 está diseñado específicamente para ocupar menos de 1 metro cuadrado en el escenario ofreciendo una cobertura de 100 grados sin tapar la vista de los comensales."
          },
          {
            question: "¿Se puede ampliar a Dúo, Trío o Mariachi completo si decidimos crecer?",
            answer: "Absolutamente. Tu depósito de 100 € bloquea la fecha de Edwin Agudelo y se descuenta íntegramente si decides escalar a cualquiera de los 14 Formatos Homologados (hasta 12 músicos)."
          }
        ]}
        scarcity={{
          urgencyBadge: "CUPO ESTRICTO: MÁXIMO 1 ACTUACIÓN POR FECHA",
          limitText: "Para garantizar la máxima frescura vocal y el estándar acústico de gala, Edwin Agudelo solo atiende una contratación por jornada. Las fechas de fin de semana se reservan habitualmente con meses de antelación.",
          ctaPrimaryText: "Bloquear Fecha Ahora (100 €)",
          checkoutUrl: "/checkout/presupuesto?format=solista-edwin-agudelo&base=350",
          whatsappText: "Hola Edwin, deseo verificar si tienes disponible mi fecha para la actuación de Solista Mariachi 350€."
        }}
      />

      {/* ── NAVEGACIÓN INMERSIVA POR TABS ── */}
      <nav aria-label="Navegación de secciones del perfil" className="sticky top-0 z-40 border-b border-white/10 bg-[#050507]/90 backdrop-blur-xl px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              { key: 'MANIFIESTO', label: 'Manifiesto & Biografía', icon: FileText },
              { key: 'ROSTER_14', label: 'Roster Homologado (14 Formatos)', icon: Layers },
              { key: 'REPERTORIO', label: 'Repertorio & Catarsis', icon: Music },
              { key: 'RIDER', label: 'Rider Técnico S-Class', icon: Radio },
              { key: 'VIMUME', label: 'Proyecto VIMUME', icon: Activity },
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
                    ? 'bg-[#FF2B44] text-white shadow-lg shadow-[#FF2B44]/25'
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
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF2B44] font-bold">
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
              {/* Origen y Forja de Carácter (Efecto Fénix & Hitos Innegociables) */}
              <div className="md:col-span-12 rounded-3xl border border-[#FF2B44]/30 bg-gradient-to-br from-[#09090d] via-[#12080c] to-[#09090d] p-8 space-y-6 shadow-[0_0_40px_rgba(255,43,68,0.1)]">
                <span className="rounded-full bg-[#FF2B44] px-3.5 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                  Hitos Innegociables S-Class
                </span>
                <h3 className="font-syne text-2xl font-bold uppercase text-white">
                  La Cátedra del Escenario y el Efecto Fénix
                </h3>
                <p className="text-sm text-white/80 leading-relaxed max-w-3xl">
                  El recorrido de Edwin Agudelo es el testimonio de un dominio absoluto sobre el escenario y la acústica, forjando una resiliencia única donde cada minuto frente al público es un pacto de entrega irrenunciable, sin artificios ni concesiones a la mediocridad.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#AAD6CD] font-bold">Hito 1: Identidad Sonora</span>
                    <p className="text-sm text-white leading-relaxed">
                      Tenor solista especialista en Rancheras, Boleros y Baladas. Dominio escénico absoluto y máxima potencia vocal sin compresión destructiva.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF2B44] font-bold">Hito 2: Autoridad Técnica</span>
                    <p className="text-sm text-white leading-relaxed">
                      Productor Audiovisual y "Paciente Cero" / Creador del ecosistema EAR OS. Garantiza la sonorización de alta gama con un despliegue acústico estricto de 12 W/pax.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#00E5FF] font-bold">Hito 3: Propósito y Trascendencia</span>
                    <p className="text-sm text-white leading-relaxed">
                      Director y arquitecto del Proyecto VIMUME (Intervención Neuroacústica a 40 Hz Gamma). Diseñador de terapias de reminiscencia sonora para el tratamiento cognitivo.
                    </p>
                  </div>
                </div>
              </div>

              {/* El Manifiesto del Activo Patrimonial */}
              <div className="md:col-span-12 rounded-3xl border border-white/10 bg-[#09090d] p-8 md:p-12 hover:border-[#FF2B44]/30 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2 space-y-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#FF2B44] font-bold">
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
                    <ShieldCheck size={44} className="text-[#FF2B44]" />
                    <span className="font-syne text-lg font-bold text-white uppercase">Cero Subcontratas</span>
                    <p className="font-mono text-xs text-white/50">Trato directo con la dirección de Productora EAR y el artista principal.</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: ROSTER HOMOLOGADO (14 FORMATOS) */}
        {activeTab === 'ROSTER_14' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl space-y-3">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                  B. Catálogo Oficial Homologado
                </span>
                <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                  Roster Soberano de 14 Formatos
                </h2>
                <p className="text-white/60 text-base leading-relaxed">
                  Tarifas suelo inmutables blindadas por contrato, presión acústica calculada a 12 W/pax, split soberano 80/10/10 y reserva instantánea con 100 € de depósito en Stripe con firma SHA-256.
                </p>
              </div>

              {/* Filtros de Categoría */}
              <div className="flex flex-wrap gap-2">
                {(['TODOS', 'SOLISTA', 'CAMARA', 'ENSAMBLE', 'ESPECIALIDAD', 'TECNICA', 'B2G'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setRosterFilter(cat)}
                    className={`rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition-all cursor-pointer ${
                      rosterFilter === cat
                        ? 'bg-[#ecb613] text-black shadow-md'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* BENTO GRID DE LOS 14 FORMATOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoster.map((format, index) => (
                <div
                  key={format.id}
                  className="rounded-3xl border border-white/10 bg-[#09090d] p-7 flex flex-col justify-between space-y-6 hover:border-[#ecb613]/50 transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header Card */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#ecb613]">
                        #{index + 1} · {format.category}
                      </span>
                      <span className="font-mono text-2xl font-black text-[#ecb613]">
                        {format.basePrice} €
                      </span>
                    </div>

                    <div>
                      <h3 className="font-syne text-xl font-bold uppercase text-white group-hover:text-[#ecb613] transition-colors">
                        {format.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-[11px] text-white/50">
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-[#AAD6CD]" />
                          {format.members} {format.members === 1 ? 'músico' : 'músicos'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-[#AAD6CD]" />
                          {format.duration}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-white/65 leading-relaxed">
                      {format.description}
                    </p>

                    {/* Especificaciones Técnicas y Acústicas */}
                    <div className="rounded-2xl border border-white/5 bg-black/40 p-3.5 space-y-2 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-[#AAD6CD]">
                        <span>Rider Acústico:</span>
                        <strong>{format.wattsPerPax > 0 ? `${format.wattsPerPax} W/pax` : 'Visual 4K'}</strong>
                      </div>
                      <div className="flex items-center justify-between text-white/60">
                        <span>Margen Operativo:</span>
                        <span className="text-emerald-400 font-bold">&ge; {Math.round(format.minGrossMargin * 100)}%</span>
                      </div>
                      <div className="truncate text-white/40 text-[10px] border-t border-white/5 pt-1.5">
                        {format.rider}
                      </div>
                    </div>
                  </div>

                  {/* CTA de la Card */}
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <button
                      onClick={() => handleSelectFormatAndQuote(format.id)}
                      className="w-full rounded-xl bg-white/10 py-3 text-center font-mono text-xs font-black uppercase tracking-wider text-white hover:bg-[#ecb613] hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Lock size={13} />
                      <span>Cotizar & Bloquear (100 €)</span>
                    </button>
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/40 px-1">
                      <span>Split: 80/10/10</span>
                      <span>Price-Lock SHA-256</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BANNER DE RETENCIÓN DE ROSTER */}
            <div className="rounded-3xl border border-[#ecb613]/30 bg-gradient-to-r from-[#0c0c12] via-[#12121c] to-[#0c0c12] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ecb613] font-bold">
                  Soberanía de Contratación Centralizada
                </span>
                <h3 className="font-syne text-2xl font-black uppercase text-white">
                  ¿Desea combinar múltiples formatos para su evento?
                </h3>
                <p className="text-xs text-white/60 max-w-2xl leading-relaxed">
                  Podemos paquetizar Dúo de Ceremonia + Saxo Lounge para Cóctel + Boda Diamond 360 o Discomóvil Bose con tarifa combinada optimizada y gestión logística unificada desde Méntrida.
                </p>
              </div>
              <a
                href={`https://wa.me/34693693048?text=${encodeURIComponent('Hola Productora EAR, deseo cotizar un paquete con varios formatos del Roster.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-xl bg-[#ecb613] px-7 py-4 font-mono text-xs font-black uppercase tracking-widest text-black hover:bg-white transition-all shadow-lg shadow-[#ecb613]/20"
              >
                Paquete Multi-Formato Personalizado
              </a>
            </div>
          </motion.div>
        )}

        {/* TAB 3: REPERTORIO Y CATARSIS EMOCIONAL */}
        {activeTab === 'REPERTORIO' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                C. Diseño Acústico & Emoción
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

        {/* TAB 4: RIDER TÉCNICO Y ARSENAL S-CLASS */}
        {activeTab === 'RIDER' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                D. Transparencia de Autoridad & Ficha Técnica
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

        {/* TAB 5: IMPACTO SOCIOSANITARIO (PROYECTO VIMUME) */}
        {activeTab === 'VIMUME' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                E. Propósito Superior & Retorno Social
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

        {/* TAB 6: TRAYECTORIA Y RECONOCIMIENTOS */}
        {activeTab === 'TRAYECTORIA' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                F. Autoridad Institucional
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

        {/* TAB 7: COTIZADOR & CIERRE TRANSACCIONAL */}
        {activeTab === 'BOOKING' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="max-w-3xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#ecb613] font-bold">
                G. Cierre Transaccional Inmediato
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                Cotización Dinámica de los 14 Formatos
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                Seleccione el formato oficial deseado, calcule el desplazamiento exacto desde el Hub Central en Méntrida (Toledo) y bloquee su fecha con firma criptográfica SHA-256 en Stripe mediante el depósito reembolsable de 100 €.
              </p>
            </div>

            {/* COTIZADOR EMBEBIDO CON PRECARGA DE FORMATO */}
            <div id="cotizador-cierre" className="rounded-3xl border border-white/10 bg-[#09090d] p-6 md:p-10 space-y-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#ecb613] font-bold">
                    Motor de Cotización Transaccional EAR OS v2
                  </span>
                  <h3 className="font-syne text-2xl font-black uppercase text-white mt-1">
                    Calcular y Bloquear Fecha en 1-Clic
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    Tarifa suelo protegida, kilometraje forense (1,50 €/km &gt; 50 km) y suplemento de hotel (+120 €).
                  </p>
                </div>
                <div className="rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 px-4 py-2 text-right">
                  <span className="font-mono text-[10px] uppercase text-[#ecb613] block">Garantía S-Class</span>
                  <strong className="font-mono text-xs text-white">Margen Operativo &ge; 58%</strong>
                </div>
              </div>

              <BookingCalculator initialFormatId={selectedFormatId} />
            </div>

          </motion.div>
        )}

      </div>

      {/* ── FOOTER DE AUTORIDAD Y CONTACTO ── */}
      <footer className="border-t border-white/10 bg-[#070709] px-6 py-12 text-center sm:text-left text-xs text-white/50">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="font-syne font-bold text-white text-sm uppercase">Productora EAR & Roster Soberano S-Class</p>
            <p>Hub Central: Méntrida (Toledo) • 14 Formatos Homologados • Split Inmutable 80/10/10.</p>
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
