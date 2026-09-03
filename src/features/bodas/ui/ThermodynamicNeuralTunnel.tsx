"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Volume2,
  CheckCircle2,
  Download,
  Phone,
  ArrowRight,
  ArrowLeft,
  Heart,
  Crown,
  MapPin,
  Sliders,
  Star,
  Users,
  X,
  Calendar,
  Check,
  Music,
  Camera,
  Utensils,
  Building2
} from 'lucide-react';
import { PROVINCIAS } from '@/lib/constants/seo-data';
import { CENTRALITA } from '@/lib/phone-constants';
import { api } from '@/lib/api';

// ==========================================
// 🎨 ATMÓSFERAS NUPCIALES S-CLASS
// ==========================================
export interface AtmosphereOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  accent: string;
  glow: string;
  musicRecommendation: string;
  acousticSpec: string;
}

export const ATMOSPHERES: AtmosphereOption[] = [
  {
    id: 'gran-gala',
    name: 'Gran Gala Imperial',
    subtitle: 'Distinción Clásica & Elegancia Pura',
    description: 'Ensamble de cuerdas, show estelar de Mariachi de gala con Edwin Agudelo y mantelería de alta costura.',
    icon: '🏛️',
    accent: '#ecb613',
    glow: 'rgba(236, 182, 19, 0.25)',
    musicRecommendation: 'Mariachi Sinfónico (6+ Músicos) + Cuarteto de Cuerdas',
    acousticSpec: 'Acústica Hi-Fi Shure Axient Digital & Neumann'
  },
  {
    id: 'rustico-bohemio',
    name: 'Rústico Bohemio',
    subtitle: 'Jardín Secreto & Finca con Encanto',
    description: 'Naturaleza viva, microfonía invisible, bombillería vintage y calidez acústica envolvente.',
    icon: '🌿',
    accent: '#10b981',
    glow: 'rgba(16, 185, 129, 0.25)',
    musicRecommendation: 'Solista Acústico (Guitarra & Voz) + Saxofón en el cóctel',
    acousticSpec: 'Bose F1 Model 812 con dispersión controlada'
  },
  {
    id: 'fiesta-rompedora',
    name: 'Fiesta & Gran Espectáculo',
    subtitle: 'Música en Directo & Diversión Total',
    description: 'Iluminación robótica, efectos de luces, DJ exclusivo y sonido de alta potencia para no parar de bailar.',
    icon: '⚡',
    accent: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.25)',
    musicRecommendation: 'DJ Premium + Percusión Electrónica + Efectos Especiales',
    acousticSpec: 'Line Array de alta definición / Sonido envolvente'
  },
  {
    id: 'intimista-velas',
    name: 'Íntima a la Luz de las Velas',
    subtitle: 'Emoción Pura & Velada Acogedora',
    description: 'Baladas y canciones memorables en directo, iluminación tenue y un ambiente cercano sin estridencias.',
    icon: '🕯️',
    accent: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.25)',
    musicRecommendation: 'Show Romántico Edwin Agudelo (Voz y piano/guitarra)',
    acousticSpec: 'Sonido suave y conversacional sin fatiga auditiva'
  }
];

// ==========================================
// 🛡️ PROVEEDORES HOMOLOGADOS
// ==========================================
interface MatchmakerProvider {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  rating: number;
  reviews: number;
  basePrice: number;
  province: string;
  distanceKm?: number;
  sla: string;
  img: string;
  tagline: string;
  services: string[];
  whatsappText: string;
}

const SEED_PROVIDERS: MatchmakerProvider[] = [
  {
    id: 'ear-edwin-solista',
    name: 'Show Solista Edwin Agudelo',
    category: 'musica',
    categoryLabel: 'Música en Vivo / Gala',
    rating: 5.0,
    reviews: 128,
    basePrice: 350,
    province: 'Madrid',
    sla: 'Sonido Bose F1 + Ramo en Directo & Fotos',
    img: '/images/mariachi.png',
    tagline: 'La voz más versátil y emocionante para bodas. Repertorio a medida y momentos sorpresa.',
    services: ['2 pases de actuación (12-14 canciones)', 'Sonorización profesional Bose', 'Ramo de flores en directo', 'Canción personalizada dedicada'],
    whatsappText: 'Hola Edwin, me gustaría consultar disponibilidad de tu Show Solista para mi boda.'
  },
  {
    id: 'ear-mariachi-gala-6',
    name: 'Mariachi Monumental de Gala (6+ Músicos)',
    category: 'musica',
    categoryLabel: 'Música en Vivo / Gala',
    rating: 5.0,
    reviews: 94,
    basePrice: 850,
    province: 'Madrid',
    sla: 'Trajes de Gala + Microfonía Shure Axient',
    img: 'https://cdn0.bodas.net/vendor/18155/3_2/960/jpeg/37cd5a92-15db-4fad-a82b-2e9166d3472b_1_118155-170648156716512.jpeg',
    tagline: 'Ensamble de máxima distinción con violines, trompetas y guitarrón para una entrada triunfal.',
    services: ['6 a 8 músicos de gala', 'Repertorio romántico y de fiesta', 'Sonorización inalámbrica sin cables'],
    whatsappText: 'Hola, deseo recibir información sobre el Mariachi Monumental para mi boda.'
  },
  {
    id: 'ear-dj-sound-design',
    name: 'DJ & Diseño Sonoro de Fiesta',
    category: 'dj',
    categoryLabel: 'DJ & Iluminación',
    rating: 4.9,
    reviews: 82,
    basePrice: 650,
    province: 'Madrid',
    sla: 'Iluminación Robótica + Cabina de Diseño',
    img: 'https://cdn0.bodas.net/vendor/81399/3_2/960/jpg/boda-ei-1007-byn_1_81399-173023204491839.jpeg',
    tagline: 'Música seleccionada al gusto de los novios, sin cortes y con iluminación espectacular.',
    services: ['Barra libre completa + música en el cóctel', 'Estructura de luces con cabezas móviles', 'Máquina de humo para el vals'],
    whatsappText: 'Hola, quiero incluir el servicio de DJ e Iluminación en mi propuesta.'
  },
  {
    id: 'ear-finca-palacio-imperial',
    name: 'Finca Palacio & Jardines',
    category: 'fincas',
    categoryLabel: 'Fincas & Espacios',
    rating: 4.9,
    reviews: 64,
    basePrice: 2800,
    province: 'Toledo',
    sla: 'Exclusividad 1 Boda al Día + Suite Nupcial',
    img: 'https://cdn0.bodas.net/vendor/35513/3_2/960/jpg/fotografia-bodas-thats-art-madrid-365_1_35513-172916297486252.jpeg',
    tagline: 'Jardines cuidados, salones climatizados y espacios cubiertos para el cóctel y banquete.',
    services: ['Capacidad flexible hasta 350 invitados', 'Plan alternativo cubierto incluido', 'Alojamiento para novios e invitados'],
    whatsappText: 'Hola, me gustaría consultar fechas disponibles para la Finca Palacio.'
  },
  {
    id: 'ear-foto-cinema-4k',
    name: 'Fotografía & Película Cinematográfica 4K',
    category: 'fotografia',
    categoryLabel: 'Fotografía & Vídeo',
    rating: 5.0,
    reviews: 73,
    basePrice: 1200,
    province: 'Madrid',
    sla: 'Cámaras 4K + Tomas Aéreas con Dron',
    img: 'https://cdn0.bodas.net/vendor/82870/3_2/960/jpg/img-1736_1_182870-173140714746623.jpeg',
    tagline: 'Un recuerdo imborrable capturado con estética de cine y fotos naturales sin posados forzados.',
    services: ['2 profesionales durante todo el evento', 'Tomas con dron homologado', 'Entrega rápida de fotos y tráiler'],
    whatsappText: 'Hola, me interesa el paquete de Fotografía y Película 4K.'
  },
  {
    id: 'ear-catering-autor',
    name: 'Catering Gourmet & Showcooking',
    category: 'catering',
    categoryLabel: 'Banquete & Gastronomía',
    rating: 4.9,
    reviews: 110,
    basePrice: 95,
    province: 'Madrid',
    sla: 'Menú Degustación + Cortador de Jamón',
    img: 'https://cdn0.bodas.net/vendor/95842/3_2/960/jpg/a-fuego-lento-18-09-21-0092_1_95842-164003758697938.jpeg',
    tagline: 'Gastronomía cuidada con productos de primera calidad, estaciones interactivas y barra libre.',
    services: ['Cóctel variado de bienvenida + Menú principal', 'Estación de corte de jamón ibérico', 'Menús especiales para alérgenos y vegetarianos'],
    whatsappText: 'Hola, deseo recibir la propuesta de menús de boda.'
  }
];

// ==========================================
// 📱 TARJETA INTERACTIVA DE PROVEEDOR
// ==========================================
interface SwipeCardProps {
  provider: MatchmakerProvider;
  onSwipe: (direction: 'left' | 'right') => void;
  onContactWhatsApp: () => void;
}

const ProviderCard: React.FC<SwipeCardProps> = ({ provider, onSwipe, onContactWhatsApp }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 0.9, 1, 0.9, 0.5]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 90) {
      onSwipe('right');
    } else if (info.offset.x < -90) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute top-0 left-0 w-full bg-[#0d0d14] border border-[#ecb613]/30 rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] cursor-grab active:cursor-grabbing select-none"
    >
      {/* Swipe Feedback */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-6 right-6 z-30 px-4 py-2 bg-emerald-500 text-black font-black text-xs uppercase tracking-widest rounded-xl rotate-12 border-2 border-white shadow-xl"
      >
        ❤️ GUARDAR EN MI BODA
      </motion.div>

      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-6 left-6 z-30 px-4 py-2 bg-zinc-800 text-white font-black text-xs uppercase tracking-widest rounded-xl -rotate-12 border border-white/20 shadow-xl"
      >
        ✕ SIGUIENTE
      </motion.div>

      {/* Media & Header */}
      <div className="relative h-64 sm:h-72 w-full bg-black">
        <img
          src={provider.img}
          alt={provider.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/30 to-transparent" />

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#ecb613]/50 text-[#ecb613] text-[10px] font-black uppercase tracking-wider font-mono">
            {provider.categoryLabel}
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-wider font-mono flex items-center gap-1">
            <ShieldCheck size={12} />
            Garantía de Calidad
          </span>
        </div>

        <div className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl bg-black/90 backdrop-blur-md border border-white/20 text-right">
          <span className="text-[10px] text-white/50 block font-mono">Inversión Estimada</span>
          <span className="text-xl font-black text-[#ecb613] font-syne">
            {provider.basePrice < 150 ? `${provider.basePrice}€ / persona` : `${provider.basePrice}€`}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-syne tracking-tight">
              {provider.name}
            </h3>
            <div className="flex items-center gap-1 text-[#ecb613] text-xs font-mono font-bold">
              <Star size={14} className="fill-current" />
              <span>{provider.rating.toFixed(1)}</span>
              <span className="text-white/40">({provider.reviews} opiniones)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/60 font-mono">
            <MapPin size={13} className="text-[#ecb613]" />
            <span>{provider.province}</span>
            {provider.distanceKm !== undefined && (
              <span className="text-[#ecb613]">· a {provider.distanceKm} km</span>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
          {provider.tagline}
        </p>

        <div className="space-y-1.5 pt-2 border-t border-white/5">
          {provider.services.map((srv, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-white/70 font-mono">
              <CheckCircle2 size={12} className="text-[#ecb613] shrink-0" />
              <span className="truncate">{srv}</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80 font-mono flex items-center gap-2">
          <Sparkles size={14} className="text-[#ecb613] shrink-0" />
          <span className="truncate">{provider.sla}</span>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-3 gap-3 pt-3">
          <button
            onClick={() => onSwipe('left')}
            className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <X size={15} />
            <span>Siguiente</span>
          </button>

          <button
            onClick={onContactWhatsApp}
            className="py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/40 text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Phone size={13} />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => onSwipe('right')}
            className="py-3 px-4 rounded-xl bg-[#ecb613] hover:bg-white text-black text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#ecb613]/20 cursor-pointer"
          >
            <Heart size={14} className="fill-current" />
            <span>Guardar</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
};

// ==========================================
// 🚀 ASISTENTE DE EXPERIENCIA NUPCIAL
// ==========================================
interface ThermodynamicNeuralTunnelProps {
  initialProvince?: string;
  initialService?: string;
}

export const ThermodynamicNeuralTunnel: React.FC<ThermodynamicNeuralTunnelProps> = ({
  initialProvince = 'Madrid',
  initialService = 'Servicio Integral'
}) => {
  // Current Step in the Couple's Journey: 1, 2, 3, 4
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Atmosphere Selection
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<string>('gran-gala');

  // Geolocation & Budget
  const [province, setProvince] = useState<string>(initialProvince);
  const [geoLocating, setGeoLocating] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [totalBudget, setTotalBudget] = useState<number>(8000);
  const [guestCount, setGuestCount] = useState<number>(120);

  // Natural Language Input
  const [userInput, setUserInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [adviceGenerated, setAdviceGenerated] = useState(false);

  // Providers & Selection
  const [availableProviders, setAvailableProviders] = useState<MatchmakerProvider[]>(SEED_PROVIDERS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [matchedProviders, setMatchedProviders] = useState<MatchmakerProvider[]>([]);

  // Contact Data
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: ''
  });
  const [downloadedDossier, setDownloadedDossier] = useState(false);

  // Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("La ubicación no está disponible en este navegador.");
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setProvince('Madrid');
        setGeoLocating(false);
      },
      (err) => {
        console.warn("Geolocation fallback:", err);
        setGeoLocating(false);
      }
    );
  };

  const handleAnalyzeInput = () => {
    if (!userInput.trim()) return;
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      setAdviceGenerated(true);
    }, 700);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const current = availableProviders[currentIndex];
    if (!current) return;

    if (direction === 'right') {
      if (!matchedProviders.some(p => p.id === current.id)) {
        setMatchedProviders(prev => [...prev, current]);
      }
    }

    if (currentIndex < availableProviders.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentStep(4);
    }
  };

  const handleContactWhatsApp = (p: MatchmakerProvider) => {
    const messageLines = [
      `👑 *SOLICITUD DE RESERVA S-CLASS — EAR OS 2026*`,
      `─────────────────────────────`,
      `📍 *Ubicación:* ${province}`,
      `🎨 *Atmósfera:* ${activeAtmosphere.name}`,
      `👥 *Invitados:* ${guestCount} pax`,
      `💰 *Presupuesto Estimado:* ${totalBudget} €`,
      ``,
      `📋 *PARTIDAS Y ACTIVOS RESERVADOS:*`,
      `1. *${p.name}* (${p.categoryLabel}) — ${p.basePrice < 150 ? `${p.basePrice}€/pax` : `${p.basePrice}€`}`,
      ``,
      `🛡️ *GARANTÍAS INCLUIDAS:*`,
      `• Blindaje Plan B Redundante`,
      `• Sonorización Pista-BPM (Cero Distorsión)`,
      `• Presupuesto Cerrado Sin Sorpresas`,
      `─────────────────────────────`,
      userInput.trim() ? `💬 *Mensaje de la Pareja:* "${userInput.trim()}"` : `💬 *Mensaje de la Pareja:* "Hola Edwin, queremos consultar la disponibilidad formal de nuestra fecha."`
    ];

    window.open(`https://wa.me/34693693048?text=${encodeURIComponent(messageLines.join('\n'))}`, '_blank');
  };

  const handleLeadSubmit = async () => {
    try {
      await api.submitLead({
        type: 'business_audit',
        source: `bodas_${province.toLowerCase()}`,
        section: `step_${currentStep}`,
        data: {
          ...leadData,
          atmosphere: selectedAtmosphere,
          budget: totalBudget,
          guests: guestCount,
          matchesCount: matchedProviders.length,
          matches: matchedProviders.map(m => m.name)
        },
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Telemetry lead submission:", e);
    }
  };

  const activeAtmosphere = useMemo(() => {
    return ATMOSPHERES.find(a => a.id === selectedAtmosphere) || ATMOSPHERES[0];
  }, [selectedAtmosphere]);

  return (
    <div className="w-full bg-[#050505] text-white selection:bg-[#ecb613]/30 font-sans relative overflow-hidden py-10 px-4 md:px-8">

      {/* Ambient Lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] blur-[160px] pointer-events-none transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${activeAtmosphere.glow} 0%, transparent 70%)` }}
      />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">

        {/* 🌟 STEP INDICATOR */}
        <div className="flex items-center justify-between max-w-2xl mx-auto border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${currentStep >= 1 ? 'bg-[#ecb613] text-black' : 'bg-white/10 text-white/40'
              }`}>
              1
            </span>
            <span className="text-xs font-mono text-white/70 hidden sm:inline">Tu Visión</span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-white/10" />

          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${currentStep >= 2 ? 'bg-[#ecb613] text-black' : 'bg-white/10 text-white/40'
              }`}>
              2
            </span>
            <span className="text-xs font-mono text-white/70 hidden sm:inline">Atmósfera & Lugar</span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-white/10" />

          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${currentStep >= 3 ? 'bg-[#ecb613] text-black' : 'bg-white/10 text-white/40'
              }`}>
              3
            </span>
            <span className="text-xs font-mono text-white/70 hidden sm:inline">Tus Artistas</span>
          </div>

          <div className="w-8 sm:w-16 h-0.5 bg-white/10" />

          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${currentStep >= 4 ? 'bg-[#ecb613] text-black' : 'bg-white/10 text-white/40'
              }`}>
              4
            </span>
            <span className="text-xs font-mono text-white/70 hidden sm:inline">Tu Propuesta</span>
          </div>
        </div>

        {/* =========================================================================
            PASO 1: TU VISIÓN & ASESORÍA PERSONALIZADA
        ========================================================================= */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black tracking-[0.4em] uppercase font-mono">
              <Sparkles size={14} />
              <span>Asistente Personalizado de Bodas</span>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-syne leading-tight">
                No contrates a ciegas para el día <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">
                  más importante de vuestra vida
                </span>
              </h2>

              <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
                Sonorización Pista-BPM Bose/Shure, Plan B redundante in situ y congelación de tarifa en 72h con un depósito inicial de solo 10 €. Cuéntanos vuestra visión:
              </p>
            </div>

            {/* Expansive Textbox */}
            <div className="max-w-3xl mx-auto bg-[#0a0a0f] border border-white/10 focus-within:border-[#ecb613]/50 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-6 text-left transition-all">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#ecb613]">
                  ¿Cómo imagináis vuestra celebración?
                </label>
                <p className="text-xs text-white/50">
                  Fecha aproximada, número de invitados, detalles especiales o qué estilo de música y ambiente no puede faltar.
                </p>
              </div>

              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                rows={4}
                placeholder="Ej: Nos casamos el próximo otoño en Madrid con unos 130 invitados. Queremos una ceremonia emotiva con música en directo, un cóctel animado con un Mariachi de gala sorpresa y una fiesta con un DJ que mantenga a todo el mundo bailando..."
                className="w-full bg-black/60 border border-white/10 p-5 rounded-2xl text-white placeholder-white/20 text-sm sm:text-base focus:border-[#ecb613] outline-none transition-all resize-none font-medium leading-relaxed"
              />

              {adviceGenerated && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs text-white/80 leading-relaxed font-light"
                >
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono uppercase">
                    <CheckCircle2 size={15} />
                    <span>Propuesta Técnica Viable Detectada</span>
                  </div>
                  <p>
                    Hemos analizado vuestra petición. Para este tipo de celebración recomendamos una combinación de <strong>Música en Vivo de Gala</strong> en momentos cumbre, sonorización nítida y un equipo que garantice el protocolo sin sobrecostes.
                  </p>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-[11px] font-mono text-white/40">
                  <ShieldCheck size={14} className="text-[#ecb613]" />
                  <span>Sin compromiso · Atención directa de profesionales</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {!adviceGenerated && userInput.trim() && (
                    <button
                      onClick={handleAnalyzeInput}
                      disabled={analyzing}
                      className="px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
                    >
                      {analyzing ? 'Analizando...' : 'Comprobar Opciones'}
                    </button>
                  )}

                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full sm:w-auto px-8 py-4 bg-[#ecb613] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 transition-all cursor-pointer hover:scale-105"
                  >
                    <span>Continuar a Elegir Atmósfera</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* =========================================================================
            PASO 2: ATMÓSFERAS & GEOLOCALIZACIÓN
        ========================================================================= */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-[#ecb613]">
                Paso 2 de 4
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne">
                Elegid el Estilo de Vuestra Boda
              </h2>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Seleccionad la atmósfera que mejor describe vuestra personalidad para sugeriros a los artistas y espacios más adecuados.
              </p>
            </div>

            {/* 4 Atmospheres Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ATMOSPHERES.map((atm) => {
                const isSelected = selectedAtmosphere === atm.id;
                return (
                  <div
                    key={atm.id}
                    onClick={() => setSelectedAtmosphere(atm.id)}
                    className={`p-6 sm:p-8 rounded-[2.5rem] bg-[#0c0c14] border transition-all cursor-pointer space-y-4 relative overflow-hidden group shadow-xl ${isSelected ? 'border-[#ecb613] shadow-[0_15px_40px_rgba(236,182,19,0.15)] bg-gradient-to-b from-[#161208] to-[#0c0c14]' : 'border-white/10 hover:border-white/30'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-4xl">{atm.icon}</div>
                      {isSelected && (
                        <span className="px-3.5 py-1 rounded-full bg-[#ecb613] text-black text-[10px] font-black uppercase font-mono tracking-wider">
                          ✓ Seleccionada
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-2xl font-black uppercase text-white font-syne">{atm.name}</h3>
                      <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider block font-bold">{atm.subtitle}</span>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      {atm.description}
                    </p>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 text-[11px] font-mono text-white/80">
                      <div className="text-[#ecb613] font-bold">🎵 Música recomendada: {atm.musicRecommendation}</div>
                      <div className="text-white/50">🔊 {atm.acousticSpec}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Geolocation & Budget Config */}
            <div className="p-8 rounded-[2.5rem] bg-[#0c0c14] border border-white/10 space-y-8 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                  <h3 className="text-xl font-black uppercase text-white font-syne flex items-center gap-2">
                    <Sliders size={20} className="text-[#ecb613]" />
                    <span>Ubicación y Estimación de Invitados</span>
                  </h3>
                  <p className="text-xs text-white/50 font-mono">
                    Ajustamos los profesionales según la cercanía para optimizar vuestro presupuesto.
                  </p>
                </div>

                <button
                  onClick={handleDetectLocation}
                  disabled={geoLocating}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white flex items-center gap-2 transition-all cursor-pointer"
                >
                  <MapPin size={14} className="text-[#ecb613]" />
                  <span>{geoLocating ? 'Detectando...' : userCoords ? '✓ Ubicación Detectada' : 'Usar mi ubicación'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/60 uppercase block font-bold">Provincia</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 p-3.5 rounded-xl text-xs text-white outline-none focus:border-[#ecb613] font-mono capitalize"
                  >
                    {PROVINCIAS.map(p => (
                      <option key={p} value={p} className="bg-black text-white capitalize">{p}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white/60 uppercase font-bold">Presupuesto Estimado</span>
                    <span className="text-[#ecb613] font-bold">{totalBudget.toLocaleString()} €</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={25000}
                    step={500}
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full accent-[#ecb613] cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white/60 uppercase font-bold">Número de Invitados</span>
                    <span className="text-emerald-400 font-bold">{guestCount} personas</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={400}
                    step={10}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-white/10 text-white/60 hover:text-white rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  Paso Anterior
                </button>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-10 py-4 bg-[#ecb613] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 shadow-xl transition-all cursor-pointer hover:scale-105"
                >
                  <span>Ver Artistas y Proveedores Disponibles</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            PASO 3: SELECCIÓN INTERACTIVA DE ARTISTAS & SERVICIOS
        ========================================================================= */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 max-w-xl mx-auto"
          >
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-[#ecb613]">
                Paso 3 de 4
              </span>
              <h2 className="text-3xl font-black uppercase text-white font-syne">
                Descubre tus Artistas y Servicios
              </h2>
              <p className="text-xs text-white/50 font-mono">
                Opción {currentIndex + 1} de {availableProviders.length} · Provincia: {province}
              </p>
            </div>

            {/* Card Container */}
            <div className="relative h-[600px] w-full max-w-md mx-auto">
              <AnimatePresence>
                {currentIndex < availableProviders.length ? (
                  <ProviderCard
                    key={availableProviders[currentIndex].id}
                    provider={availableProviders[currentIndex]}
                    onSwipe={handleSwipe}
                    onContactWhatsApp={() => handleContactWhatsApp(availableProviders[currentIndex])}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#0c0c14] border border-[#ecb613]/40 rounded-[2.5rem] space-y-6">
                    <div className="w-16 h-16 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613]">
                      <CheckCircle2 size={36} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black uppercase text-white font-syne">¡Selección Completada!</h3>
                      <p className="text-xs text-white/60 font-mono">
                        Tenéis {matchedProviders.length} servicios guardados en vuestro plan de boda.
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-8 py-4 bg-[#ecb613] text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-white transition-all cursor-pointer"
                    >
                      Ver mi Plan Nupcial Completo
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <button
                onClick={() => handleSwipe('left')}
                className="w-14 h-14 rounded-full bg-black/80 border border-white/10 hover:border-white/30 text-white/60 flex items-center justify-center shadow-xl transition-all cursor-pointer active:scale-95"
                title="Siguiente opción"
              >
                <X size={20} />
              </button>

              <button
                onClick={() => {
                  if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
                }}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white flex items-center justify-center text-xs transition-all cursor-pointer"
                title="Ver anterior"
              >
                ↺
              </button>

              <button
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 rounded-full bg-[#ecb613] hover:bg-white text-black flex items-center justify-center shadow-2xl shadow-[#ecb613]/30 transition-all cursor-pointer active:scale-95 hover:scale-105"
                title="Guardar en mi boda"
              >
                <Heart size={24} className="fill-current" />
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setCurrentStep(4)}
                className="text-xs font-mono text-white/50 hover:text-[#ecb613] transition-colors cursor-pointer"
              >
                {matchedProviders.length > 0
                  ? `Ver mi selección actual (${matchedProviders.length} servicios guardados) →`
                  : 'Saltar directo a la propuesta final →'}
              </button>
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            PASO 4: PLAN NUPCIAL & CONTACTO DIRECTO
        ========================================================================= */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-4xl mx-auto"
          >
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-black uppercase tracking-[0.4em] text-[#ecb613]">
                Paso 4 de 4
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne">
                Vuestra Propuesta Personalizada
              </h2>
              <p className="text-xs sm:text-sm text-white/60 font-mono">
                Atmósfera: {activeAtmosphere.name} · Provincia: {province} · {guestCount} invitados
              </p>
            </div>

            {/* Matched Services List */}
            <div className="space-y-4">
              {matchedProviders.length === 0 ? (
                <div className="p-8 text-center bg-[#0a0a0f] border border-white/10 rounded-3xl space-y-4">
                  <p className="text-sm text-white/60">No habéis añadido servicios individuales a la selección.</p>
                  <button
                    onClick={() => { setCurrentIndex(0); setCurrentStep(3); }}
                    className="px-6 py-3 bg-[#ecb613] text-black font-black text-xs uppercase rounded-xl cursor-pointer"
                  >
                    Ver Artistas Disponibles
                  </button>
                </div>
              ) : (
                matchedProviders.map((p) => (
                  <div
                    key={p.id}
                    className="p-6 rounded-3xl bg-[#0c0c14] border border-[#ecb613]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <img src={p.img} alt={p.name} className="w-16 h-16 rounded-2xl object-cover border border-white/10" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-[#ecb613] font-mono font-bold uppercase">
                            {p.categoryLabel}
                          </span>
                          <span className="text-xs font-mono text-emerald-400">⭐ {p.rating}</span>
                        </div>
                        <h4 className="text-lg font-black uppercase text-white font-syne mt-1">{p.name}</h4>
                        <p className="text-xs text-white/50 font-mono">{p.sla}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 border-white/5">
                      <span className="text-lg font-black text-[#ecb613] font-syne">
                        {p.basePrice < 150 ? `${p.basePrice}€/pax` : `${p.basePrice}€`}
                      </span>
                      <button
                        onClick={() => handleContactWhatsApp(p)}
                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Phone size={13} />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Booking & Dossier Block */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-[#100d04] via-[#0c0c14] to-[#0c0c14] border border-[#ecb613]/60 text-center space-y-6 shadow-2xl">
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase text-white font-syne">
                  Consultar Disponibilidad de Fecha con Asesor Nupcial
                </h3>
                <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed font-light">
                  Edwin Agudelo y el equipo de producción os confirmarán la disponibilidad exacta y os enviarán la propuesta formal sin compromiso.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent([
                    `👑 *SOLICITUD DE RESERVA S-CLASS — EAR OS 2026*`,
                    `─────────────────────────────`,
                    `📍 *Ubicación:* ${province}`,
                    `🎨 *Atmósfera:* ${activeAtmosphere.name}`,
                    `👥 *Invitados:* ${guestCount} pax`,
                    `💰 *Presupuesto Estimado:* ${totalBudget} €`,
                    ``,
                    `📋 *PARTIDAS Y ACTIVOS RESERVADOS:*`,
                    matchedProviders.length > 0
                      ? matchedProviders.map((m, idx) => `${idx + 1}. *${m.name}* (${m.categoryLabel}) — ${m.basePrice < 150 ? `${m.basePrice}€/pax` : `${m.basePrice}€`}`).join('\n')
                      : `1. *Producción Nupcial Integral ${activeAtmosphere.name}* — ${totalBudget} €`,
                    ``,
                    `🛡️ *GARANTÍAS INCLUIDAS:*`,
                    `• Blindaje Plan B Redundante`,
                    `• Sonorización Pista-BPM (Cero Distorsión)`,
                    `• Presupuesto Cerrado Sin Sorpresas`,
                    `─────────────────────────────`,
                    userInput.trim() ? `💬 *Mensaje de la Pareja:* "${userInput.trim()}"` : `💬 *Mensaje de la Pareja:* "Hola Edwin, queremos consultar la disponibilidad formal de nuestra fecha."`
                  ].join('\n'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4.5 bg-[#25D366] hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-2xl transition-all cursor-pointer hover:scale-105"
                >
                  <Phone size={16} />
                  <span>Enviar Consulta por WhatsApp</span>
                </a>

                <button
                  onClick={() => { setDownloadedDossier(true); handleLeadSubmit(); }}
                  className="w-full sm:w-auto px-8 py-4.5 bg-[#ecb613] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
                >
                  <Download size={16} />
                  <span>{downloadedDossier ? '✓ Dossier Solicitado' : 'Descargar Propuesta en PDF'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-mono text-white/40 hover:text-white underline cursor-pointer"
                >
                  Modificar datos y reiniciar consulta
                </button>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
};

export default ThermodynamicNeuralTunnel;
