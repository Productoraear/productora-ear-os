'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, Heart, X, Check, ShieldCheck, ArrowRight, 
  BookOpen, CreditCard, Sliders, MapPin, Users, Calendar, 
  Sun, Moon, Volume2, Award, ChevronRight, CheckCircle2, RotateCcw
} from 'lucide-react';
import { createEliteCheckout } from '@/app/actions/checkoutActions';

export interface FormatoArtistico {
  id: string;
  name: string;
  category: 'B2C' | 'B2B' | 'B2G';
  format: string;
  basePrice: number;
  minAttendees: number;
  maxAttendees: number;
  isOutdoorReady: boolean;
  tagline: string;
  specs: string[];
  rider: string;
  soundIncluded: boolean;
  badge: string;
  image: string;
  matchScore?: number;
}

const CATALAGO_FORMATOS: FormatoArtistico[] = [
  {
    id: 'solista-acustico',
    name: 'Edwin Agudelo — Solista de Gala & Piano Acústico',
    category: 'B2C',
    format: 'Voz Solista + Piano de Cola / Base Hi-Fi',
    basePrice: 650,
    minAttendees: 20,
    maxAttendees: 150,
    isOutdoorReady: false,
    tagline: 'Elegancia íntima para ceremonias nupciales, cócteles privados y veladas exclusivas.',
    specs: ['Microfonía Neumann / Shure KSM', 'Repertorio Lírico & Ranchero de Autor', 'Duración: 60-90 min', 'Elegancia Charra / Esmoquin'],
    rider: 'Conexión 220V + Espacio 3x2m',
    soundIncluded: true,
    badge: 'ALTA FIDELIDAD',
    image: '🎙️'
  },
  {
    id: 'cuarteto-gala',
    name: 'Mariachi Edwin Agudelo — Cuarteto Imperial',
    category: 'B2C',
    format: '4 Músicos de Gran Gala',
    basePrice: 950,
    minAttendees: 50,
    maxAttendees: 300,
    isOutdoorReady: true,
    tagline: 'La formación clásica por excelencia: impacto emocional, dinamismo y cercanía total.',
    specs: ['2 Trompetas de Élite', '1 Vihuela Tradicional', '1 Guitarrón Bajo', 'Sonido Autónomo Inalámbrico'],
    rider: 'Espacio 4x3m / Sin requerimiento de tarima pesada',
    soundIncluded: true,
    badge: 'TOP VENTAS B2C',
    image: '🎺'
  },
  {
    id: 'quinteto-real',
    name: 'Mariachi Edwin Agudelo — Quinteto de Honor',
    category: 'B2C',
    format: '5 Músicos de Alta Escuela',
    basePrice: 1250,
    minAttendees: 100,
    maxAttendees: 500,
    isOutdoorReady: true,
    tagline: 'La armonía perfecta con violín maestro para bodas prémium y aniversarios solemnes.',
    specs: ['1 Violín Solista', '2 Trompetas', '1 Vihuela', '1 Guitarrón', 'Traje Charro Bordado a Mano'],
    rider: 'Espacio 5x3m + Punto eléctrico',
    soundIncluded: true,
    badge: 'MÁXIMA RECOMENDACIÓN',
    image: '🎻'
  },
  {
    id: 'octeto-corporativo',
    name: 'Productora EAR — Octeto Magistral B2B',
    category: 'B2B',
    format: '8 Músicos Gran Formato',
    basePrice: 2400,
    minAttendees: 200,
    maxAttendees: 1200,
    isOutdoorReady: true,
    tagline: 'Presencia escénica imponente diseñada para convenciones empresariales y galas de marca.',
    specs: ['3 Violines', '2 Trompetas', 'Arpa / Acordeón', 'Vihuela & Guitarrón', 'Factura con IVA + Ledger ACID'],
    rider: 'Tarima mínima 6x4m + Monitores de escenario',
    soundIncluded: true,
    badge: 'ESTÁNDAR CORPORATIVO',
    image: '🌟'
  },
  {
    id: 'ensamble-monumental',
    name: 'Productora EAR — Ensamble Monumental & Show Ecuestre',
    category: 'B2B',
    format: '12-16 Músicos + Cuadro Escénico',
    basePrice: 4500,
    minAttendees: 500,
    maxAttendees: 3000,
    isOutdoorReady: true,
    tagline: 'Espectáculo audiovisual masivo con arreglos sinfónicos propios y solistas en directo.',
    specs: ['Sección de Cuerda Ampliada', 'Metales de Alta Presión', 'Sonido Line-Array Dedicado', 'Dirección Musical en Directo'],
    rider: 'Escenario 10x8m + Iluminación Robótica DMX',
    soundIncluded: true,
    badge: 'ALTO IMPACTO',
    image: '🐎'
  },
  {
    id: 'sinfonico-b2g',
    name: 'Productora EAR — Producción B2G Fiestas Patronales',
    category: 'B2G',
    format: 'Orquesta & Mariachi 20+ Artistas',
    basePrice: 6800,
    minAttendees: 1000,
    maxAttendees: 10000,
    isOutdoorReady: true,
    tagline: 'Licitación pública llave en mano para Ayuntamientos, Auditorios y Plazas Mayores.',
    specs: ['Sonorización L-Acoustics K2', 'Rider de Luces Beam/Wash', 'Seguro RC 1.000.000€', 'Alta SS 100% Certificada'],
    rider: 'Escenario Municipal Homologado + Acometida 32A/63A',
    soundIncluded: true,
    badge: 'LICITACIÓN HOMOLOGADA',
    image: '🏛️'
  }
];

export default function TinderMatcherClient() {
  // --- MULTIDIMENSIONAL FILTERS ---
  const [clientSegment, setClientSegment] = useState<'B2C' | 'B2B' | 'B2G'>('B2C');
  const [attendees, setAttendees] = useState<number>(120);
  const [isOutdoor, setIsOutdoor] = useState<boolean>(false);
  const [urgency, setUrgency] = useState<'NORMAL' | 'ALTA' | 'EXPRESS'>('NORMAL');
  const [budgetTier, setBudgetTier] = useState<'STANDARD' | 'PREMIUM' | 'S_CLASS'>('PREMIUM');
  const [technicalLevel, setTechnicalLevel] = useState<'SOLO_SHOW' | 'CON_SONIDO' | 'FULL_RIDER'>('CON_SONIDO');
  const [province, setProvince] = useState<string>('Madrid');
  
  // UI States
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [matchSuccess, setMatchSuccess] = useState<FormatoArtistico | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);

  // --- SCORING ALGORITHM (SILICON VALLEY MATCHING ENGINE) ---
  const scoredFormats = useMemo(() => {
    return CATALAGO_FORMATOS.map(formato => {
      let score = 50; // Base score

      // Segment Matching (Weight: 35)
      if (formato.category === clientSegment) {
        score += 35;
      } else if (clientSegment === 'B2B' && formato.category === 'B2G') {
        score += 15;
      }

      // Attendees Capacity Matching (Weight: 25)
      if (attendees >= formato.minAttendees && attendees <= formato.maxAttendees) {
        score += 25;
      } else if (attendees < formato.minAttendees) {
        score -= 10;
      } else {
        score += 10; // Over capacity can still work with PA
      }

      // Outdoor Suitability (Weight: 15)
      if (isOutdoor && formato.isOutdoorReady) {
        score += 15;
      } else if (isOutdoor && !formato.isOutdoorReady) {
        score -= 20;
      }

      // Budget Alignment (Weight: 15)
      if (budgetTier === 'STANDARD' && formato.basePrice <= 1000) score += 15;
      if (budgetTier === 'PREMIUM' && formato.basePrice > 1000 && formato.basePrice <= 3000) score += 15;
      if (budgetTier === 'S_CLASS' && formato.basePrice > 2500) score += 15;

      // Ensure clamped between 45% and 99%
      const finalScore = Math.min(99, Math.max(45, score));
      return { ...formato, matchScore: finalScore };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [clientSegment, attendees, isOutdoor, budgetTier]);

  const topMatch = scoredFormats[0];
  const alternative1 = scoredFormats[1];
  const alternative2 = scoredFormats[2];

  const currentCard = scoredFormats[currentIndex % scoredFormats.length];

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleMatch = (card: FormatoArtistico) => {
    setMatchSuccess(card);
  };

  const handleFastTrackCheckout = async (card: FormatoArtistico) => {
    setIsProcessing(true);
    try {
      const depositCents = Math.round(card.basePrice * 0.30); // 30% deposit
      const session = await createEliteCheckout({
        artistId: card.id,
        clientId: `client-${clientSegment.toLowerCase()}-${Date.now()}`,
        origin: `${province}, España`,
        destination: `Servicio ${card.name}`,
        eventDate: new Date(Date.now() + 86400000 * (urgency === 'EXPRESS' ? 3 : 14)).toISOString().split('T')[0]
      });

      if (session?.url) {
        window.location.href = session.url;
      } else {
        alert('Redirigiendo a pasarela segura...');
      }
    } catch (err) {
      console.error(err);
      alert('Iniciando pasarela de reserva segura...');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 text-white">
      {/* 🧭 FILTERING CONTROLS BAR */}
      <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4a855]/10 border border-[#d4a855]/30 flex items-center justify-center text-[#d4a855]">
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">
                Filtros Multidimensionales de Precisión
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">
                Matching probabilístico calculado en tiempo real
              </p>
            </div>
          </div>

          {/* Segment Selector Tabs */}
          <div className="flex bg-black/50 p-1 rounded-2xl border border-white/10 overflow-x-auto scrollbar-hide">
            {(['B2C', 'B2B', 'B2G'] as const).map(seg => (
              <button
                key={seg}
                onClick={() => {
                  setClientSegment(seg);
                  setCurrentIndex(0);
                  setMatchSuccess(null);
                }}
                className={`flex-1 min-h-[44px] px-3 sm:px-5 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center justify-center ${
                  clientSegment === seg
                    ? 'bg-[#d4a855] text-black shadow-lg shadow-[#d4a855]/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {seg === 'B2C' ? '💍 Boda / Particular' : seg === 'B2B' ? '🏢 B2B' : '🏛️ B2G'}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Province */}
          <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
              <MapPin size={12} className="text-[#d4a855]" /> Provincia
            </label>
            <select
              value={province}
              onChange={e => setProvince(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-[#d4a855]"
            >
              <option value="Madrid">Madrid (Sede Central)</option>
              <option value="Toledo">Toledo / Castilla</option>
              <option value="Barcelona">Barcelona / Cataluña</option>
              <option value="Valencia">Valencia / Levante</option>
              <option value="Sevilla">Sevilla / Andalucía</option>
              <option value="Nacional">Resto de España</option>
            </select>
          </div>

          {/* Attendees Slider */}
          <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-1"><Users size={12} className="text-[#d4a855]" /> Asistentes</span>
              <span className="text-white font-mono font-bold">{attendees} pax</span>
            </label>
            <input
              type="range"
              min={20}
              max={1500}
              step={20}
              value={attendees}
              onChange={e => setAttendees(Number(e.target.value))}
              className="w-full accent-[#d4a855] bg-zinc-800 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Space Type */}
          <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
              {isOutdoor ? <Sun size={12} className="text-amber-400" /> : <Moon size={12} className="text-blue-400" />} Espacio
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => setIsOutdoor(false)}
                className={`flex-1 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all ${
                  !isOutdoor ? 'bg-[#d4a855] text-black' : 'bg-black/40 text-zinc-400'
                }`}
              >
                Interior
              </button>
              <button
                onClick={() => setIsOutdoor(true)}
                className={`flex-1 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all ${
                  isOutdoor ? 'bg-[#d4a855] text-black' : 'bg-black/40 text-zinc-400'
                }`}
              >
                Exterior
              </button>
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl border border-white/5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1">
              <Zap size={12} className="text-[#d4a855]" /> Plazo
            </label>
            <select
              value={urgency}
              onChange={e => setUrgency(e.target.value as any)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white font-bold outline-none focus:border-[#d4a855]"
            >
              <option value="NORMAL">Estándar (&gt; 30 días)</option>
              <option value="ALTA">Prioritario (&lt; 15 días)</option>
              <option value="EXPRESS">Express (&lt; 72 horas)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 🎯 MAIN MATCHING ARENA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Arena: Swipeable Tinder Card */}
        <div className="lg:col-span-7 relative min-h-[460px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {matchSuccess ? (
              <motion.div
                key="match-success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full bg-[#121212] border-2 border-[#d4a855] rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-[#d4a855] text-black text-[9px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                  MATCH CERTIFICADO ({matchSuccess.matchScore}%)
                </div>

                <div className="text-6xl pt-2">{matchSuccess.image}</div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#d4a855]">
                    {matchSuccess.badge}
                  </span>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-white">
                    {matchSuccess.name}
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">{matchSuccess.tagline}</p>
                </div>

                {/* Pricing Summary */}
                <div className="bg-black/60 border border-white/10 rounded-2xl p-4 flex justify-between items-center max-w-md mx-auto">
                  <div className="text-left">
                    <span className="text-[9px] text-zinc-500 font-mono uppercase block">Inversión Estimada</span>
                    <span className="text-2xl font-black text-white">{matchSuccess.basePrice}€ <span className="text-xs text-zinc-400 font-normal">+ IVA</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-[#d4a855] font-mono uppercase block">Depósito de Reserva (30%)</span>
                    <span className="text-lg font-black text-[#d4a855]">{Math.round(matchSuccess.basePrice * 0.30)}€</span>
                  </div>
                </div>

                {/* Dual Conversion Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => handleFastTrackCheckout(matchSuccess)}
                    disabled={isProcessing}
                    className="w-full py-4 bg-[#d4a855] hover:bg-[#e0b666] text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#d4a855]/20 active:scale-95"
                  >
                    <CreditCard size={18} />
                    {isProcessing ? 'Conectando Stripe...' : 'Reserva Express 1-Click (Bloqueo Inmediato 30%)'}
                  </button>

                  <a
                    href="/cotizador"
                    className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/10"
                  >
                    <BookOpen size={16} />
                    Configurar con Extras & Rider en Cotizador
                  </a>
                </div>

                <button
                  onClick={() => setMatchSuccess(null)}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-widest font-mono pt-2"
                >
                  ← Explorar otras alternativas
                </button>
              </motion.div>
            ) : currentCard ? (
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full bg-[#121212] border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative"
              >
                {/* Score & Category Tag */}
                <div className="flex justify-between items-center">
                  <span className="px-3.5 py-1.5 bg-[#d4a855]/10 text-[#d4a855] border border-[#d4a855]/30 text-[10px] font-mono font-black tracking-widest uppercase rounded-full flex items-center gap-1.5">
                    <Sparkles size={12} /> {currentCard.matchScore}% AFINIDAD SCORE
                  </span>
                  <span className="text-3xl">{currentCard.image}</span>
                </div>

                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">
                    {currentCard.category} // {currentCard.format}
                  </span>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mt-1">
                    {currentCard.name}
                  </h3>
                  <p className="text-xs text-zinc-400 italic mt-1 leading-relaxed">
                    "{currentCard.tagline}"
                  </p>
                </div>

                {/* Specs Box */}
                <div className="space-y-2.5 bg-black/60 p-4 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-[#d4a855] uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Ficha de Rendimiento & Rider:
                  </div>
                  <ul className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300 font-medium">
                    {currentCard.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-[#d4a855] shrink-0" /> {spec}
                      </li>
                    ))}
                  </ul>
                  <div className="text-[10px] text-zinc-500 pt-1 border-t border-white/5">
                    <strong>Rider Requerido:</strong> {currentCard.rider}
                  </div>
                </div>

                {/* Price & Swipe Controls */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase font-mono block">Tarifa Oficial Desde</span>
                    <span className="text-3xl font-black text-white">{currentCard.basePrice}€ <span className="text-xs font-normal text-zinc-400">+ IVA</span></span>
                  </div>
                  <div className="text-[10px] text-right text-zinc-400 font-mono">
                    Provincia: <strong className="text-white">{province}</strong><br />
                    Capacidad: <strong className="text-white">{currentCard.minAttendees}-{currentCard.maxAttendees} pax</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2 border-t border-white/5">
                  <button
                    onClick={handleNext}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-zinc-300 font-black uppercase text-xs tracking-widest rounded-2xl flex items-center justify-center gap-2 border border-white/10 transition-all"
                  >
                    <RotateCcw size={16} /> Ver Otra Opción
                  </button>
                  <button
                    onClick={() => handleMatch(currentCard)}
                    className="flex-1 py-4 bg-[#d4a855] hover:bg-[#e0b666] text-black font-black uppercase text-xs tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#d4a855]/20 transition-all active:scale-95"
                  >
                    <Heart size={16} fill="black" /> Seleccionar Match
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Right Arena: Prioritized Match Ranking & Alternative Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#d4a855] flex items-center gap-2">
              <Award size={16} /> Recomendación Nº 1 del Sistema
            </h4>
            
            {topMatch && (
              <div 
                onClick={() => setMatchSuccess(topMatch)}
                className="bg-black/60 border border-[#d4a855]/40 rounded-2xl p-4 hover:border-[#d4a855] cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black text-white group-hover:text-[#d4a855] transition-colors uppercase">
                    {topMatch.name}
                  </span>
                  <span className="text-xs font-black text-[#d4a855] font-mono">
                    {topMatch.matchScore}%
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 line-clamp-2">{topMatch.tagline}</p>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="font-bold text-white">{topMatch.basePrice}€</span>
                  <span className="text-[10px] text-[#d4a855] uppercase font-bold flex items-center gap-1">
                    Elegir Directo <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            )}

            <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pt-2">
              Alternativas Tácticas Recomendadas:
            </h5>

            <div className="space-y-2">
              {[alternative1, alternative2].filter(Boolean).map((alt, idx) => (
                <div 
                  key={alt.id}
                  onClick={() => setMatchSuccess(alt)}
                  className="bg-black/40 border border-white/5 rounded-2xl p-3.5 hover:border-white/20 cursor-pointer transition-all flex justify-between items-center text-xs group"
                >
                  <div>
                    <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white block">
                      {alt.name}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">
                      {alt.format} • {alt.basePrice}€
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-[#d4a855]">
                    {alt.matchScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
