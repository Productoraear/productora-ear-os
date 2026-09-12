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
    setActiveTab('ROSTER_14');
    setTimeout(() => {
      const el = document.getElementById('cotizador-cierre');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-[#030305] text-white selection:bg-[#FF2B44] selection:text-white font-sans pt-28 md:pt-32">
      
      {/* ── BARRA SUPERIOR DE DISPONIBILIDAD Y TRATO DIRECTO ── */}
      <aside aria-label="Contacto Directo" className="border-b border-white/10 bg-[#07070b]/90 backdrop-blur-xl px-6 py-2.5 text-xs text-white/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[#FF2B44] animate-pulse" />
            <span className="font-mono uppercase tracking-[0.15em] text-[#FF2B44] font-bold text-[11px]">
              Contratación Directa sin Intermediarios
            </span>
            <span className="text-white/20">•</span>
            <span className="hidden sm:inline font-mono text-[11px] text-[#AAD6CD]">Solo 1 actuación por fecha para máxima entrega</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Base: <strong className="text-white">Méntrida (Toledo)</strong></span>
            <span>WhatsApp Directo: <a href="tel:+34693693048" className="text-[#FF2B44] hover:underline font-bold">+34 693 693 048</a></span>
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
                    title="Edwin Agudelo en Vivo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                
                {/* Barra de Telemetría Inferior */}
                <div className="px-5 py-3.5 bg-[#08080c] border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#FF2B44] animate-ping" />
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF2B44] font-bold">
                      Directo de Gala · Voz & Corazón
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-white/60">
                    <span className="text-[#AAD6CD]">Sonido Bose 2.000W</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/80">Pistas Master de Alta Fidelidad</span>
                  </div>
                </div>

              </div>
            </div>

            {/* PROPUESTA DE VALOR DE IMPACTO INMEDIATO (VOZ REAL DE EDWIN) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#FF2B44] px-3.5 py-1 text-[10px] font-mono font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(255,43,68,0.4)]">
                  Cantante & Compositor
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-white/80">
                  Música de Gala
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
                  Voz Lírica, Tradición y Conexión con tu Gente
                </p>
              </div>

              {/* PROPUESTA CERCANA Y EMPÁTICA */}
              <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.04] to-transparent p-5 space-y-2.5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF2B44]" />
                <h2 className="font-syne text-lg sm:text-xl font-bold text-white tracking-wide leading-snug">
                  Hacer de vuestro día especial algo verdaderamente memorable
                </h2>
                <p className="font-sans text-xs sm:text-sm text-white/75 font-normal leading-relaxed">
                  Me ocupo de conocer vuestra historia para elegir juntos las canciones que llegan a la fibra. Desde el homenaje más emotivo a vuestros seres queridos hasta la fiesta donde todos cantan y sonríen.
                </p>
              </div>

              {/* DATOS DE CONFIANZA */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                <div className="rounded-xl border border-white/10 bg-[#09090e] p-2.5 text-center">
                  <span className="block font-syne text-lg sm:text-xl font-black text-[#FF2B44]">25+</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/50">Años Oficio</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#09090e] p-2.5 text-center">
                  <span className="block font-syne text-lg sm:text-xl font-black text-white">100%</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/50">En Vivo</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#09090e] p-2.5 text-center">
                  <span className="block font-syne text-lg sm:text-xl font-black text-[#AAD6CD]">4</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/50">Formatos</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#09090e] p-2.5 text-center">
                  <span className="block font-syne text-lg sm:text-xl font-black text-white">Bose</span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/50">Sonido 2.000W</span>
                </div>
              </div>

              {/* ACCIONES DE CIERRE DIRECTO */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => handleSelectFormatAndQuote('solista-edwin-agudelo')}
                  className="rounded-xl bg-[#FF2B44] px-6 py-3.5 font-mono text-xs font-black uppercase tracking-[0.15em] text-white shadow-[0_0_25px_rgba(255,43,68,0.4)] transition-all hover:scale-105 hover:bg-white hover:text-black flex items-center gap-2.5 cursor-pointer"
                >
                  <Lock size={14} />
                  <span>Reservar Fecha (100 €)</span>
                </button>
                <button
                  onClick={() => setActiveTab('ROSTER_14')}
                  className="rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                >
                  <Layers size={14} className="text-[#AAD6CD]" />
                  <span>Ver Opciones y Tarifas</span>
                </button>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, deseo consultar disponibilidad para tu actuación.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-[#AAD6CD]/40 bg-[#AAD6CD]/10 px-4 py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#AAD6CD] transition-colors hover:bg-[#AAD6CD]/20 flex items-center gap-2"
                >
                  <Phone size={13} />
                  <span>Hablar con Edwin</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── LA OFERTA IRRESISTIBLE S-CLASS (SECUENCIA DE 8 PASOS DE VALOR) ── */}
      <SClassIrresistibleOffer
        promiseBadge="CONTRATACIÓN DIRECTA // PACK SOLISTA PREMIUM"
        headlinePromise="Convierte tu evento en una ovación histórica que tus invitados recordarán durante décadas"
        subPromise="No contratas minutos de música de fondo; aseguras una presencia escénica visceral con tesitura de tenor lírico y la sonorización de alta fidelidad más nítida de Madrid y Toledo."
        benefits={[
          {
            title: "Emoción y Respeto a tu Historia",
            desc: "Primero conocemos vuestra historia y elegimos juntos las canciones para llegar hasta la fibra, creando un repertorio a medida."
          },
          {
            title: "Sonido Bose 2.000W Impecable",
            desc: "Claridad cristalina sin fatiga auditiva. Microfonía profesional Shure Beta 87A para que cada estrofa e instrumento se escuche perfecto."
          },
          {
            title: "Trato Directo y Cercano con Edwin",
            desc: "Hablas directamente con el artista. Puntualidad impecable, traje de gala charro artesanal y compromiso total con tu celebración."
          }
        ]}
        deliverablesBadge="ENTREGABLES DEL SHOW SOLISTA PREMIUM"
        deliverablesTitle="Todo lo que incluye el Show Solista Premium (350 €) para tu gran día"
        deliverables={[
          {
            spec: "Actuación en Directo (Edwin Agudelo)",
            detail: "Show de 60 minutos con máxima flexibilidad (2 salidas de 30 minutos: la primera dedicada a homenajeados y la segunda para complacer peticiones)."
          },
          {
            spec: "Equipo Profesional Bose 2.000W",
            detail: "Sonorización de alta gama con cobertura hasta 300 personas en interiores y exteriores con microfonía Shure Beta 87A."
          },
          {
            spec: "Photocall Temático con Sombreros Charros",
            detail: "Llevamos sombreros artesanales para que todos tus invitados participen y se lleven un recuerdo visual inolvidable."
          },
          {
            spec: "Sesión de Fotos en las Mesas con el Artista",
            detail: "Edwin se acerca mesa por mesa para compartir con los invitados y tomar fotos de recuerdo en alta resolución sin molestias."
          },
          {
            spec: "Ramo de Flores de Cortesía",
            detail: "Entregado en mano durante el tema de apertura para que se lo ofrezcas a tu pareja, madre o persona homenajeada."
          },
          {
            spec: "Exclusividad Absoluta de Fecha",
            detail: "Solo trabajo con vosotras esa fecha. Máxima frescura vocal y dedicación al 100% a vuestro evento."
          }
        ]}
        priceAnchor={{
          totalValueEstimate: "750,00 €",
          finalPrice: "350,00 €",
          depositAmount: "100,00 €",
          periodOrFormat: "Show Solista Premium Completo",
          legalNote: "Tarifa para eventos en radio de 50 km desde Méntrida. Kilometraje adicional: 1,50 €/km."
        }}
        guarantee={{
          badgeText: "GARANTÍA Y COMPROMISO DIRECTO",
          title: "Garantía de Satisfacción por Escrito",
          description: "Nos aseguramos de cuidar cada detalle y filtrar cualquier contenido inadecuado para que toda la familia y amigos disfruten plenamente. Tu reserva de 100 € queda bloqueada con firma Price-Lock válida 72 horas."
        }}
        bonuses={[
          {
            title: "Canción Personalizada y Dedicatoria de Entrada",
            realValue: "120,00 €",
            description: "Adaptamos la primera canción con dedicatoria expresa a los homenajeados para arrancar con el máximo impacto emocional."
          },
          {
            title: "Micrófono Inalámbrico Extra para Brindis",
            realValue: "80,00 €",
            description: "Dejamos a disposición de la familia o anfitriones un micrófono Shure profesional conectado al sistema Bose para discursos."
          }
        ]}
        objections={[
          {
            question: "¿Qué ocurre si la ceremonia o la cena se retrasa?",
            answer: "No te preocupes. Como profesionales con más de 25 años de oficio, llegamos con antelación y nos coordinamos con el maître o wedding planner para ajustar el inicio al instante perfecto."
          },
          {
            question: "¿Y si el espacio de la finca o salón es reducido?",
            answer: "El sistema Bose F1 / S1 Pro ocupa un espacio mínimo en el suelo ofreciendo una cobertura de 100 grados sin tapar la vista de los comensales."
          },
          {
            question: "¿Se puede ampliar a Grupo o Mariachi completo si decidimos crecer?",
            answer: "Totalmente. Si deseas dar el salto a Mariachi de 6 músicos (600 €), 9 músicos (900 €) o Gran Ensamble de 13 músicos (1.300 €), tu depósito se descuenta íntegramente."
          }
        ]}
        scarcity={{
          urgencyBadge: "CUPO ESTRICTO: SOLO 1 ACTUACIÓN POR FECHA",
          limitText: "Para garantizar la máxima entrega y frescura vocal, solo atiendo una contratación por jornada. Las fechas de fin de semana se reservan con meses de antelación.",
          ctaPrimaryText: "Reservar Fecha Ahora (100 €)",
          checkoutUrl: "/checkout/presupuesto?format=solista-edwin-agudelo&base=350",
          whatsappText: "Hola Edwin, deseo verificar si tienes disponible mi fecha para la actuación de Solista Premium 350€."
        }}
      />

      {/* ── NAVEGACIÓN INMERSIVA POR TABS ── */}
      <nav aria-label="Navegación de secciones del perfil" className="sticky top-0 z-40 border-b border-white/10 bg-[#050507]/90 backdrop-blur-xl px-6 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              { key: 'MANIFIESTO', label: 'Biografía & Oficio', icon: FileText },
              { key: 'ROSTER_14', label: 'Formatos & Tarifas (4 Opciones)', icon: Layers },
              { key: 'REPERTORIO', label: 'Repertorio & Emoción', icon: Music },
              { key: 'RIDER', label: 'Sonido Bose 2.000W', icon: Radio },
              { key: 'VIMUME', label: 'Proyecto VIMUME', icon: Activity },
              { key: 'TRAYECTORIA', label: 'Reconocimientos', icon: Trophy },
              { key: 'BOOKING', label: 'Cotizador & Fecha', icon: Calendar }
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

        {/* TAB 2: CATÁLOGO OFICIAL DE FORMATOS (4 OPCIONES) */}
        {activeTab === 'ROSTER_14' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl space-y-3">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF2B44] font-bold">
                  B. Formatos y Tarifas Oficiales
                </span>
                <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                  Las 4 Fórmulas de Actuación
                </h2>
                <p className="text-white/70 text-base leading-relaxed">
                  Desde el show individual con experiencia interactiva completa hasta la imponencia acústica de la gran agrupación en directo. Elige la fórmula que mejor se adapte a tu celebración.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#09090e] p-4 text-xs font-mono text-white/70 space-y-1">
                <div className="flex items-center gap-2 text-[#AAD6CD]">
                  <CheckCircle2 size={14} />
                  <span>Reserva con solo 100 €</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <CheckCircle2 size={14} className="text-[#FF2B44]" />
                  <span>Solo 1 evento por día</span>
                </div>
              </div>
            </div>

            {/* COMPARADOR VISUAL INTERACTIVO S-CLASS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SCLASS_ROSTER_14_FORMATS.map((format, index) => {
                const isSolista = format.id === 'solista-edwin-agudelo';
                const isSelected = selectedFormatId === format.id;

                return (
                  <div
                    key={format.id}
                    onClick={() => setSelectedFormatId(format.id)}
                    className={`rounded-3xl border p-6 flex flex-col justify-between space-y-6 transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected 
                        ? 'border-[#FF2B44] bg-[#0c090e] shadow-[0_0_35px_rgba(255,43,68,0.2)]' 
                        : 'border-white/10 bg-[#09090d] hover:border-white/25'
                    }`}
                  >
                    {/* Badge de Distinción de Estrategia */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                          isSolista 
                            ? 'bg-[#FF2B44]/20 text-[#FF2B44] border border-[#FF2B44]/30' 
                            : 'bg-[#AAD6CD]/10 text-[#AAD6CD] border border-[#AAD6CD]/25'
                        }`}>
                          {isSolista ? 'Show + Complementos' : `${format.members} Músicos en Vivo`}
                        </span>
                        <span className="font-mono text-2xl font-black text-white group-hover:text-[#FF2B44] transition-colors">
                          {format.basePrice} €
                        </span>
                      </div>

                      <div>
                        <h3 className="font-syne text-xl font-bold uppercase text-white leading-tight">
                          {format.name}
                        </h3>
                        <p className="mt-1 font-mono text-[11px] text-[#AAD6CD]">
                          {format.duration}
                        </p>
                      </div>

                      <p className="text-xs text-white/70 leading-relaxed min-h-[50px]">
                        {format.description}
                      </p>

                      {/* Diferenciador Visual: ¿Lleva complementos o es fuerza escénica pura? */}
                      <div className="rounded-2xl border border-white/5 bg-black/40 p-3.5 space-y-2.5 font-mono text-[11px]">
                        <span className="text-[10px] uppercase tracking-wider text-white/50 block font-bold">
                          {isSolista ? 'Atrezzo y Extras Incluidos:' : 'Presencia Escénica:'}
                        </span>

                        {isSolista ? (
                          <ul className="space-y-1.5 text-xs text-white/80">
                            <li className="flex items-center gap-1.5 text-emerald-400">
                              <Check size={12} /> Photocall con sombreros
                            </li>
                            <li className="flex items-center gap-1.5 text-emerald-400">
                              <Check size={12} /> Fotos directas en las mesas
                            </li>
                            <li className="flex items-center gap-1.5 text-emerald-400">
                              <Check size={12} /> Ramo de flores sorpresa
                            </li>
                            <li className="flex items-center gap-1.5 text-emerald-400">
                              <Check size={12} /> Dedicatoria personalizada
                            </li>
                          </ul>
                        ) : (
                          <ul className="space-y-1.5 text-xs text-white/80">
                            <li className="flex items-center gap-1.5 text-[#AAD6CD]">
                              <Users size={12} /> Edwin + {format.members - 1} músicos acompañantes
                            </li>
                            <li className="flex items-center gap-1.5 text-[#AAD6CD]">
                              <Check size={12} /> Trompetas, vihuela y guitarrón
                            </li>
                            <li className="flex items-center gap-1.5 text-[#AAD6CD]">
                              <Check size={12} /> Fuerza y acústica viva en directo
                            </li>
                            <li className="flex items-center gap-1.5 text-white/50 text-[10px]">
                              (No requiere atrezzo; la música es el espectáculo)
                            </li>
                          </ul>
                        )}

                        <div className="border-t border-white/5 pt-2 text-[10px] text-white/50 truncate">
                          Rider: {format.rider}
                        </div>
                      </div>
                    </div>

                    {/* Botón de Selección / Cotización */}
                    <div className="space-y-2 border-t border-white/10 pt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectFormatAndQuote(format.id);
                        }}
                        className={`w-full rounded-xl py-3 text-center font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF2B44] text-white shadow-lg shadow-[#FF2B44]/25'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <Lock size={13} />
                        <span>Elegir y Cotizar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SECCIÓN DEL COTIZADOR INTEGRADO CON EL FORMATO SELECCIONADO */}
            <div id="cotizador-cierre" className="rounded-3xl border border-white/10 bg-[#09090d] p-6 md:p-10 space-y-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF2B44] font-bold">
                    Cotización Rápida y Transparente
                  </span>
                  <h3 className="font-syne text-2xl font-black uppercase text-white mt-1">
                    Calcular Presupuesto con Kilometraje Exacto
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Tarifa del formato elegido desde Méntrida (Toledo). 50 km incluidos; 1,50 €/km adicional.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#AAD6CD]/30 bg-[#AAD6CD]/10 px-4 py-2 text-right">
                  <span className="font-mono text-[10px] uppercase text-[#AAD6CD] block">Reserva Protegida</span>
                  <strong className="font-mono text-xs text-white">100 € Depósito en Stripe</strong>
                </div>
              </div>

              <BookingCalculator initialFormatId={selectedFormatId} />
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
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF2B44] font-bold">
                G. Reserva y Presupuesto
              </span>
              <h2 className="font-syne text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                Cotización de Actuación
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                Elige tu formato (Solista Premium o Agrupación), calcula la distancia desde Méntrida (Toledo) y asegura tu fecha con el depósito de 100 €.
              </p>
            </div>

            {/* COTIZADOR EMBEBIDO */}
            <div className="rounded-3xl border border-white/10 bg-[#09090d] p-6 md:p-10 space-y-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF2B44] font-bold">
                    Tarifa Oficial Directa
                  </span>
                  <h3 className="font-syne text-2xl font-black uppercase text-white mt-1">
                    Calcular y Reservar Fecha
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    Sin intermediarios. Kilometraje: 1,50 €/km después de los primeros 50 km.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#AAD6CD]/30 bg-[#AAD6CD]/10 px-4 py-2 text-right">
                  <span className="font-mono text-[10px] uppercase text-[#AAD6CD] block">Depósito Inicial</span>
                  <strong className="font-mono text-xs text-white">100,00 € en Stripe</strong>
                </div>
              </div>

              <BookingCalculator initialFormatId={selectedFormatId} />
            </div>

          </motion.div>
        )}

      </div>

    </div>
  );
}
