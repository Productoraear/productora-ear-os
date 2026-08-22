'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  Clock, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall, 
  Send, 
  Lock, 
  Building2, 
  Heart, 
  Activity, 
  Landmark,
  Zap,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export type MacroCategory = 'SOCIAL_WEDDINGS' | 'CORPORATE_B2B' | 'SILVER_VIMUME' | 'INSTITUTIONAL_B2G';

interface SubEvent {
  id: string;
  name: string;
  monthlySearches: string;
  painPoint: string;
  technicalSolution: string;
  acousticSpec: string;
  basePriceRange: string;
  badge: string;
}

const CATEGORIES_DATA: Record<MacroCategory, {
  title: string;
  icon: any;
  tagline: string;
  volumeBadge: string;
  gradient: string;
  subEvents: SubEvent[];
}> = {
  SOCIAL_WEDDINGS: {
    title: 'Vida Social & Bodas de Autor',
    icon: Heart,
    tagline: 'Emoción pura, estética impecable y 0 silencios incómodos',
    volumeBadge: '+45.000 búsquedas/mes',
    gradient: 'from-amber-500/20 via-[#ecb613]/10 to-transparent',
    subEvents: [
      {
        id: 'boda-gala',
        name: 'Boda de Lujo & Finca Exclusiva',
        monthlySearches: '18.400/mes',
        painPoint: 'El miedo a una pista vacía o micrófonos que acoplen durante los votos matrimoniales.',
        technicalSolution: 'Protocolo de Presión Acústica 12 W/pax con microfonía digital Shure Axient (cero cortes RF) y ensamble en directo de Edwin Agudelo.',
        acousticSpec: 'Bose F1 Model 812 + Behringer XR18 Digital Mixer',
        basePriceRange: '350 € (Solista) – 1.800 € (Gran Show)',
        badge: 'Top Conversión',
      },
      {
        id: 'serenata-vip',
        name: 'Serenata Sorpresa & Pedida de Mano',
        monthlySearches: '12.100/mes',
        painPoint: 'Músicos informales que llegan tarde y rompen el factor sorpresa.',
        technicalSolution: 'Llegada sincronizada por GPS, vestuario de gala mariachi impecable y repertorio a la carta (12-14 temas/hora).',
        acousticSpec: 'Equipo autónomo portátil de alta fidelidad inalámbrico',
        basePriceRange: '350 € – 550 €',
        badge: 'Garantía 100%',
      },
      {
        id: 'cumpleanos-15',
        name: 'Cumpleaños VIP & Fiestas de 15 Años',
        monthlySearches: '14.500/mes',
        painPoint: 'DJs con música desactualizada que no conectan con la juventud o familiares.',
        technicalSolution: 'Curaduría musical híbrida: bloque mariachi clásico + set urbano DJ actual con iluminación robótica sincronizada.',
        acousticSpec: 'Sistema PA 2.000W + Cabina LED S-Class',
        basePriceRange: '550 € – 1.200 €',
        badge: 'Alta Demanda',
      },
    ],
  },
  CORPORATE_B2B: {
    title: 'Corporativo & Marcas (B2B)',
    icon: Building2,
    tagline: 'Garantía 0 Fallos para Congresos, Galas y Lanzamientos de Producto',
    volumeBadge: '+28.000 búsquedas/mes',
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    subEvents: [
      {
        id: 'congreso-gala',
        name: 'Convención Anual & Cena de Gala',
        monthlySearches: '11.800/mes',
        painPoint: 'Un fallo en el atril o mala inteligibilidad de palabra arruina la imagen de marca ante inversores.',
        technicalSolution: 'Línea de retraso acústico calibrada, microfonía de diadema DPA y streaming multi-sala redundante.',
        acousticSpec: 'L-Acoustics Syva + Shure Axient Dual Channel',
        basePriceRange: '1.200 € – 3.500 €',
        badge: 'Factura NIF Inmediata',
      },
      {
        id: 'lanzamiento-producto',
        name: 'Presentación de Producto & Brand Experience',
        monthlySearches: '9.200/mes',
        painPoint: 'Falta de impacto sensorial y coordinación entre la música y la revelación visual.',
        technicalSolution: 'Sincronización Timecode SMPTE de iluminación, sonido y visuales con técnico de sala FOH dedicado.',
        acousticSpec: 'Array Lineal + Iluminación Robótica Beam/Wash',
        basePriceRange: '1.800 € – 6.000 €',
        badge: 'SLA S-Class',
      },
    ],
  },
  SILVER_VIMUME: {
    title: 'Silver Economy & Musicoterapia (VIMUME)',
    icon: Activity,
    tagline: 'Estimulación Neurocognitiva para Centros de Mayores y Alzheimer',
    volumeBadge: '+12.000 búsquedas/mes',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    subEvents: [
      {
        id: 'musicoterapia-alzheimer',
        name: 'Programa Clínico de Memoria Evocativa',
        monthlySearches: '7.300/mes',
        painPoint: 'Apatía y desconexión afectiva en personas de la tercera edad con deterioro neurodegenerativo.',
        technicalSolution: 'Metodología VIMUME: Cancionero biográfico en directo con frecuencias armónicas no invasivas (<75 dB).',
        acousticSpec: 'Monitores de campo cercano de respuesta plana de alta resolución',
        basePriceRange: 'Desde 290 € / sesión',
        badge: 'Validado en 5 Centros',
      },
      {
        id: 'gala-envejecimiento-activo',
        name: 'Jornadas de Convivencia Intergeneracional',
        monthlySearches: '4.700/mes',
        painPoint: 'Actividades aburridas sin dinamización emocional participativa.',
        technicalSolution: 'Concierto interactivo con Edwin Agudelo y ensamble acústico con dinámica de reminiscencia asistida.',
        acousticSpec: 'PA acústica cálida adaptada a audífonos',
        basePriceRange: '450 € – 900 €',
        badge: '10% Fondo Social EAR',
      },
    ],
  },
  INSTITUTIONAL_B2G: {
    title: 'Institucional & Ayuntamientos (B2G)',
    icon: Landmark,
    tagline: 'Conciertos y Fiestas Patronales bajo Marco LCSP (<15.000 €)',
    volumeBadge: '+18.000 búsquedas/mes',
    gradient: 'from-purple-500/20 via-amber-500/10 to-transparent',
    subEvents: [
      {
        id: 'fiestas-patronales',
        name: 'Concierto de Gala en Plaza Mayor',
        monthlySearches: '12.400/mes',
        painPoint: 'Reparos de intervención municipal por documentación técnica incompleta o sobrecostes.',
        technicalSolution: 'Expediente cerrado bajo contrato menor LCSP con memoria técnica, certificado de solidez y seguro RC 600.000€.',
        acousticSpec: 'Ground-Stack 12.000W dB Technologies + Escenografía',
        basePriceRange: '2.500 € – 8.500 €',
        badge: 'Portal de Licitaciones PLACSP',
      },
    ],
  },
};

export function NeuroFunnelSClass() {
  const [selectedMacro, setSelectedMacro] = useState<MacroCategory>('SOCIAL_WEDDINGS');
  const [selectedSubEvent, setSelectedSubEvent] = useState<SubEvent>(CATEGORIES_DATA.SOCIAL_WEDDINGS.subEvents[0]);
  const [daysUntilEvent, setDaysUntilEvent] = useState<number>(45);
  const [estimatedBudget, setEstimatedBudget] = useState<number>(850);
  const [province, setProvince] = useState<string>('Madrid');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [leadCaptured, setLeadCaptured] = useState<boolean>(false);

  // ⚡ Algoritmo Matemático de Urgencia S-Class
  const isEmergency = useMemo(() => {
    return daysUntilEvent <= 14 || estimatedBudget >= 15000;
  }, [daysUntilEvent, estimatedBudget]);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone.trim()) return;
    setLeadCaptured(true);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-8">

      {/* 🚨 Alerta Inteligente de Conserje de Emergencia si aplica */}
      {isEmergency && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/80 via-[#09090d] to-amber-950/60 border border-rose-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center shrink-0">
              <Flame size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-rose-300 font-bold tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                CONSERJE DE EMERGENCIA S-CLASS ACTIVADO
              </div>
              <h4 className="text-sm font-bold text-white">
                Tu evento es en {daysUntilEvent} días o supera los 15.000€. Bloqueamos unidad táctica inmediata.
              </h4>
            </div>
          </div>
          <a
            href="tel:+34693693048"
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white text-xs font-mono font-black uppercase rounded-2xl flex items-center gap-2 shrink-0 shadow-lg shadow-rose-950/50 transition-all hover:scale-105"
          >
            <PhoneCall size={14} />
            <span>Llamar Centralita (+34 693 693 048)</span>
          </a>
        </motion.div>
      )}

      {/* 🧭 FASE 1: Bento Grid de Macrocategorías por Volumen SEO */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#ecb613] font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap size={12} />
              <span>Fase 1: Selecciona la Naturaleza de tu Evento</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-syne text-white tracking-tight">
              ¿Qué tipo de atmósfera buscas crear?
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500 hidden sm:block">Demanda en Tiempo Real</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(CATEGORIES_DATA) as MacroCategory[]).map((catKey) => {
            const cat = CATEGORIES_DATA[catKey];
            const isSelected = selectedMacro === catKey;
            const Icon = cat.icon;

            return (
              <button
                key={catKey}
                onClick={() => {
                  setSelectedMacro(catKey);
                  setSelectedSubEvent(cat.subEvents[0]);
                }}
                className={`p-6 rounded-3xl text-left border transition-all duration-300 relative overflow-hidden group ${
                  isSelected
                    ? 'border-[#ecb613] bg-[#09090d] shadow-xl shadow-amber-950/20 scale-[1.02]'
                    : 'border-white/10 bg-[#09090d]/60 hover:border-white/30 hover:bg-[#09090d]'
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cat.gradient} rounded-bl-full pointer-events-none`} />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                      isSelected 
                        ? 'bg-[#ecb613] text-black border-[#ecb613]' 
                        : 'bg-white/5 text-zinc-300 border-white/10 group-hover:text-white'
                    }`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                      {cat.volumeBadge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-syne">{cat.title}</h3>
                    <p className="text-xs text-zinc-400 font-light mt-1 line-clamp-2">{cat.tagline}</p>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#ecb613] font-bold">
                    <span>{isSelected ? 'Configurando' : 'Explorar'}</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 🎭 Selector de Micro-Eventos */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
        {CATEGORIES_DATA[selectedMacro].subEvents.map((sub) => {
          const isSubSelected = selectedSubEvent.id === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubEvent(sub)}
              className={`px-4 py-2 rounded-2xl text-xs font-mono transition-all flex items-center gap-2 border ${
                isSubSelected
                  ? 'bg-white text-black font-bold border-white shadow-md'
                  : 'bg-white/5 text-zinc-400 hover:text-white border-white/10 hover:border-white/20'
              }`}
            >
              <span>{sub.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                isSubSelected ? 'bg-black text-[#ecb613]' : 'bg-white/10 text-zinc-400'
              }`}>
                {sub.monthlySearches}
              </span>
            </button>
          );
        })}
      </div>

      {/* 🔬 FASE 2: El Momento WOW (Diagnostic View & Psicomarketing) */}
      <AnimatePresence mode="wait">
        <motion.section
          key={selectedSubEvent.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-10 rounded-3xl bg-[#09090d] border border-white/10 relative overflow-hidden space-y-8"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />

          {/* Diagnostic Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono text-[#ecb613] font-bold uppercase mb-2">
                <Sparkles size={12} />
                <span>Auditoría de Riesgo Técnico & Calibración S-Class</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-syne text-white">
                {selectedSubEvent.name}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-400 block">Tarifa Oficial Verificada</span>
              <span className="text-xl font-bold font-mono text-[#ecb613]">{selectedSubEvent.basePriceRange}</span>
            </div>
          </div>

          {/* Grid de Diagnóstico Psicológico y Solución */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* El Dolor Oculto */}
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
                <AlertCircle size={16} />
                <span>El Punto de Fricción Oculto</span>
              </div>
              <p className="text-sm text-zinc-300 font-light leading-relaxed">
                {selectedSubEvent.painPoint}
              </p>
            </div>

            {/* La Solución Técnica Innegociable */}
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <ShieldCheck size={16} />
                <span>Solución Técnica Blindada (12 W/pax)</span>
              </div>
              <p className="text-sm text-zinc-300 font-light leading-relaxed">
                {selectedSubEvent.technicalSolution}
              </p>
              <div className="pt-2 border-t border-emerald-500/20 flex items-center gap-2 text-[11px] font-mono text-emerald-300">
                <Volume2 size={14} />
                <span>Rider: <strong>{selectedSubEvent.acousticSpec}</strong></span>
              </div>
            </div>
          </div>

          {/* ⚡ Calibrador Interactivo de Parámetros */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">
              Personaliza tus Parámetros para el Price-Lock 72h
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Días para el evento */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 flex justify-between">
                  <span>Días para el Evento:</span>
                  <span className="text-white font-bold">{daysUntilEvent} días</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="180"
                  value={daysUntilEvent}
                  onChange={(e) => setDaysUntilEvent(Number(e.target.value))}
                  className="w-full accent-[#ecb613] bg-zinc-800"
                />
              </div>

              {/* Presupuesto Estimado */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 flex justify-between">
                  <span>Presupuesto Objetivo:</span>
                  <span className="text-[#ecb613] font-bold">{estimatedBudget} €</span>
                </label>
                <input
                  type="range"
                  min="350"
                  max="20000"
                  step="50"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                  className="w-full accent-[#ecb613] bg-zinc-800"
                />
              </div>

              {/* Provincia */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400">Provincia del Evento:</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-[#050505] border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:border-[#ecb613] outline-none"
                >
                  <option value="Madrid">Madrid (Radio 50km sin coste)</option>
                  <option value="Toledo">Toledo (+0.35€/km)</option>
                  <option value="Guadalajara">Guadalajara (+0.35€/km)</option>
                  <option value="Segovia">Segovia (+0.35€/km)</option>
                  <option value="Valencia">Valencia (Gira / Dietas)</option>
                  <option value="Barcelona">Barcelona (Gira / Dietas)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 🎯 FASE 3: Lead Capture / El Peaje de Valor & Stripe Lock */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#ecb613]/10 via-[#09090d] to-amber-950/20 border border-[#ecb613]/40 space-y-6">
            {!leadCaptured ? (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-[10px] font-mono uppercase text-[#ecb613] font-bold tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
                    <Lock size={12} />
                    <span>Fase 3: Bloqueo de Disponibilidad & Blueprint Cifrado</span>
                  </div>
                  <h4 className="text-xl font-bold font-syne text-white">
                    Recibe la Propuesta Técnica con Price-Lock 72h SHA-256
                  </h4>
                  <p className="text-xs text-zinc-400 font-light">
                    Te enviaremos el dossier PDF detallado con desglose horario, rider y link de reserva con señal del 30% en Stripe.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <input
                    type="tel"
                    placeholder="Tu WhatsApp o Teléfono (+34 600 000 000)"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="flex-1 px-5 py-3.5 bg-[#050505] border border-white/20 rounded-2xl text-xs font-mono text-white placeholder-zinc-500 focus:border-[#ecb613] outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs font-black uppercase rounded-2xl transition-all shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <span>Generar Cotización y Bloquear</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 justify-center sm:justify-start">
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> Sin spam</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> Respuesta en &lt;15 min</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> Depósito 30% Stripe</span>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="text-lg font-bold font-syne text-white">¡Dossier Técnico & Price-Lock Generado!</h4>
                <p className="text-xs text-zinc-300 font-mono max-w-md mx-auto">
                  Hemos transmitido tus especificaciones a Centralita Técnica. Recibirás tu presupuesto oficial cifrado al número <strong>{contactPhone}</strong>.
                </p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/34693693048?text=Hola,%20he%20solicitado%20un%20Price-Lock%20para%20mi%20evento"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold uppercase transition-all"
                  >
                    <Send size={14} />
                    <span>Abrir Chat Prioritario en WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>

        </motion.section>
      </AnimatePresence>

    </div>
  );
}
