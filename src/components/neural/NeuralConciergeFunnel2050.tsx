'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Mic,
  Calendar,
  Building2,
  Landmark,
  Volume2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Euro,
  Sun,
  Moon,
  Zap,
  Lock,
  Layers,
  Search,
  Award
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
  CENTRALITA_EAR_OS,
  LIMITE_SPL_DB
} from '@/lib/constants/ear-os-ssot';

interface EventCategory {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  basePriceEur: number;
  description: string;
  popularServices: string[];
}

const CATEGORIES: EventCategory[] = [
  {
    id: 'solista',
    name: 'Solista & Mariachis',
    badge: 'Voz Lírica y Emoción',
    tagline: 'Edwin Agudelo (Tenor) y repertorio de gala en directo',
    icon: Mic,
    basePriceEur: TARIFA_BASE_SOLISTA_EUR,
    description: 'La voz masculina de mayor impacto para ceremonias, cócteles y serenatas sin intermediarios.',
    popularServices: ['Ceremonia Religiosa / Civil', 'Cóctel Íntimo', 'Rancheras de Gala', 'Show Tenor 90 min']
  },
  {
    id: 'bodas',
    name: 'Bodas & Recepciones',
    badge: 'Producción 360°',
    tagline: 'Ceremonia, cóctel y barra libre sin acoples ni cortes',
    icon: Calendar,
    basePriceEur: 650,
    description: 'Gestión integral del hilo musical, sonido nupcial y animación acústica homologada.',
    popularServices: ['Sonido Ceremonia Bose', 'Microfonía Inalámbrica', 'Iluminación Pista', 'DJ Técnico Oficial']
  },
  {
    id: 'fincas',
    name: 'Fincas & Espacios',
    badge: 'Protección <75 dB',
    tagline: 'Directorio homologado con blindaje contra multas vecinales',
    icon: Building2,
    basePriceEur: 0,
    description: 'Espacios de ensueño verificados con acústica controlada y alianzas oficiales.',
    popularServices: ['Fincas en Toledo', 'Espacios en Madrid', 'Fincas Rústicas', 'Zonas Senior Protegidas']
  },
  {
    id: 'ayuntamientos',
    name: 'Ayuntamientos B2G',
    badge: 'Art. 118 LCSP',
    tagline: 'Contratación menor directa y simplificada (< 14.250 €)',
    icon: Landmark,
    basePriceEur: 1200,
    description: 'Festejos populares, pregones, día del mayor y eventos institucionales sin trabas administrativas.',
    popularServices: ['Pliego Técnico Menor', 'Concierto en Plaza', 'Limitador Homologado', 'Facturación FACe']
  },
  {
    id: 'sonido',
    name: 'Alquiler de Sonido',
    badge: 'Alta Fidelidad',
    tagline: 'Equipos Bose, Shure y Line Array ajustados por técnico',
    icon: Volume2,
    basePriceEur: 250,
    description: 'Alquiler de sonido profesional con transporte, montaje e ingeniería acústica incluida.',
    popularServices: ['Altavoces Bose L1 Pro', 'Microfonía Shure Axient', 'Mesa Digital Behringer', 'Iluminación LED']
  },
  {
    id: 'servicios360',
    name: 'Flores & Proveedores',
    badge: 'Red Homologada',
    tagline: 'Catering, floristería y hasta 200 servicios coordinados',
    icon: Sparkles,
    basePriceEur: 150,
    description: 'Unifica múltiples proveedores en un único interlocutor con contrato blindado.',
    popularServices: ['Decoración Floral', 'Cortador de Jamón', 'Fotomatón Vintage', 'Coordinador In-Situ']
  }
];

const PROVINCES = [
  { name: 'Toledo', distanceKm: 42, note: 'Hub Méntrida directo (0 € logística)' },
  { name: 'Madrid', distanceKm: 58, note: 'Comunidad de Madrid (Logística reducida)' },
  { name: 'Ávila', distanceKm: 85, note: 'Sierra y valles' },
  { name: 'Guadalajara', distanceKm: 110, note: 'Castilla-La Mancha' },
  { name: 'Segovia', distanceKm: 125, note: 'Castilla y León' },
  { name: 'Ciudad Real', distanceKm: 140, note: 'Centro peninsular' },
  { name: 'Cuenca', distanceKm: 165, note: 'Mancha alta' },
  { name: 'Nacional (Toda España)', distanceKm: 280, note: 'Desplazamiento con rider técnico' }
];

export default function NeuralConciergeFunnel2050() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const [selectedCatId, setSelectedCatId] = useState<string>('solista');
  const [selectedProvinceIndex, setSelectedProvinceIndex] = useState<number>(0);
  const [eventDate, setEventDate] = useState<string>('');
  const [leadInteractionCount, setLeadInteractionCount] = useState<number>(0);
  const [showDossierModal, setShowDossierModal] = useState<boolean>(false);

  useEffect(() => {
    // Lead temperature telemetric scoring
    const timer = setTimeout(() => {
      setLeadInteractionCount((c) => c + 1);
    }, 4000);
    return () => clearTimeout(timer);
  }, [selectedCatId, selectedProvinceIndex]);

  const activeCategory = useMemo(() => {
    return CATEGORIES.find((c) => c.id === selectedCatId) || CATEGORIES[0];
  }, [selectedCatId]);

  const activeProvince = useMemo(() => {
    return PROVINCES[selectedProvinceIndex] || PROVINCES[0];
  }, [selectedProvinceIndex]);

  // Logística SSOT: 1.50 €/km a partir del km 50
  const logisticCostEur = useMemo(() => {
    if (activeProvince.distanceKm <= 50) return 0;
    return Math.round((activeProvince.distanceKm - 50) * 1.5);
  }, [activeProvince]);

  const totalEstimateEur = useMemo(() => {
    return activeCategory.basePriceEur + logisticCostEur;
  }, [activeCategory, logisticCostEur]);

  // Lead temperature: si interactúa y define fecha -> 'Caliente / Listo para Bloqueo'
  const isHotLead = eventDate !== '' || leadInteractionCount >= 2;

  return (
    <section className="relative w-full overflow-hidden transition-colors duration-500 py-10 md:py-16">
      {/* Selector Flotante de Estética S-Class (Luxury Champagne / OLED Profundo) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono tracking-wider uppercase opacity-75">
            {isHotLead ? '🎯 Modo Neural Activo · Cotización en Tiempo Real' : '⚡ Consola Neural EAR OS · Vanguardia 2050'}
          </span>
        </div>

        {/* Botón Switch Modo Dual */}
        <button
          onClick={toggleTheme}
          aria-label="Conmutar Estética"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-300 border shadow-sm ${
            isLight
              ? 'bg-white border-zinc-200 text-zinc-800 hover:border-amber-400'
              : 'bg-zinc-900/80 border-white/10 text-zinc-300 hover:border-[#ecb613]'
          }`}
        >
          {isLight ? (
            <>
              <Moon size={13} className="text-amber-600" />
              <span>Modo OLED Noche</span>
            </>
          ) : (
            <>
              <Sun size={13} className="text-[#ecb613]" />
              <span>Modo Editorial Marfil</span>
            </>
          )}
        </button>
      </div>

      {/* Titular Principal — Claridad Absoluta & Confianza de Lujo */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-xs font-mono font-medium border transition-colors shadow-sm bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400">
          <Award size={13} />
          <span>GARANTÍA MUTUA · PRECIO OFICIAL · CERO INTERMEDIARIOS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-serif mb-4 leading-tight">
          Elige tu música y producción.{' '}
          <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
            Reserva con certeza en 3 clics.
          </span>
        </h1>

        <p className={`text-base sm:text-lg max-w-3xl mx-auto leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
          Desde el show solista insignia de <strong>Edwin Agudelo (350 €)</strong> hasta bodas completas, fincas protegidas y fiestas patronales. Precios transparentes respaldados por contrato y depósito deducible.
        </p>
      </div>

      {/* CONSOLA NEURAL UNIFICADA (Uber + Airbnb + Tinder + Amazon) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className={`rounded-3xl border transition-all duration-500 overflow-hidden shadow-2xl backdrop-blur-xl ${
            isLight
              ? 'bg-white/95 border-zinc-200/80 shadow-amber-900/5'
              : 'bg-[#09090d]/90 border-white/10 shadow-black'
          }`}
        >
          {/* PASO 1: SELECCIONAR CATEGORÍA (Píldoras Interactivas) */}
          <div className="p-4 sm:p-6 border-b border-inherit">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold tracking-wider uppercase opacity-60">
                Paso 1 · ¿Qué necesitas para tu evento?
              </span>
              <span className="text-xs font-mono text-amber-500 font-bold">
                {activeCategory.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = cat.id === selectedCatId;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCatId(cat.id);
                      setLeadInteractionCount((c) => c + 1);
                    }}
                    className={`relative p-3 sm:p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-300 border text-xs cursor-pointer ${
                      isSelected
                        ? isLight
                          ? 'bg-amber-50/90 border-amber-400 text-amber-950 shadow-md scale-[1.02]'
                          : 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_20px_rgba(236,182,19,0.2)] scale-[1.02]'
                        : isLight
                        ? 'bg-zinc-50/60 border-zinc-200/60 text-zinc-700 hover:bg-zinc-100/80'
                        : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
                    }`}
                  >
                    <IconComponent size={20} className={isSelected ? 'text-amber-500' : 'opacity-60'} />
                    <span className="font-bold mt-2 tracking-tight">{cat.name}</span>
                    <span className="text-[10px] opacity-70 mt-0.5 line-clamp-1">{cat.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 2: UBICACIÓN & FECHA (ESTILO UBER / AIRBNB) */}
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-inherit">
            {/* Ubicación / Provincia */}
            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-black/40 border-white/5'}`}>
              <div className="flex items-center gap-2 mb-2 text-xs font-mono font-semibold opacity-70">
                <MapPin size={14} className="text-amber-500" />
                <span>¿Dónde se celebra? (GPS & Distancia desde Méntrida)</span>
              </div>
              <select
                aria-label="Selecciona la provincia o zona"
                value={selectedProvinceIndex}
                onChange={(e) => setSelectedProvinceIndex(Number(e.target.value))}
                className={`w-full p-3 rounded-xl border text-sm font-medium transition-colors outline-none cursor-pointer ${
                  isLight
                    ? 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-500'
                    : 'bg-zinc-900 border-white/10 text-white focus:border-amber-400'
                }`}
              >
                {PROVINCES.map((prov, idx) => (
                  <option key={prov.name} value={idx}>
                    {prov.name} — {prov.distanceKm} km ({prov.note})
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha del Evento */}
            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-black/40 border-white/5'}`}>
              <div className="flex items-center gap-2 mb-2 text-xs font-mono font-semibold opacity-70">
                <Calendar size={14} className="text-amber-500" />
                <span>¿Qué fecha tienes prevista?</span>
              </div>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-3 rounded-xl border text-sm font-medium transition-colors outline-none cursor-pointer ${
                  isLight
                    ? 'bg-white border-zinc-300 text-zinc-900 focus:border-amber-500'
                    : 'bg-zinc-900 border-white/10 text-white focus:border-amber-400'
                }`}
              />
            </div>
          </div>

          {/* PASO 3: COTIZACIÓN TRANSPARENTE & DOBLE VÍA DE CIERRE */}
          <div className="p-4 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Información y Servicios Populares */}
              <div className="lg:col-span-7">
                <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider mb-2 bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {activeCategory.tagline}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2">
                  {activeCategory.name} en {activeProvince.name}
                </h2>
                <p className={`text-sm mb-4 leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  {activeCategory.description}
                </p>

                {/* Chips de Servicios incluidos */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeCategory.popularServices.map((service) => (
                    <span
                      key={service}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        isLight
                          ? 'bg-zinc-100 border-zinc-200 text-zinc-700'
                          : 'bg-zinc-900 border-white/10 text-zinc-300'
                      }`}
                    >
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      <span>{service}</span>
                    </span>
                  ))}
                </div>

                {/* Sello de Garantía y Split Soberano */}
                <div className="flex items-center gap-4 text-xs font-mono opacity-80 pt-2 border-t border-inherit">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Split 80/10/10 Canónico</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Lock size={12} className="text-amber-500" />
                    <span>Price-Lock SHA-256</span>
                  </span>
                  <span>·</span>
                  <span>&lt; {LIMITE_SPL_DB} dB Homologado</span>
                </div>
              </div>

              {/* Tarjeta de Liquidación & Botones de Acción */}
              <div
                className={`lg:col-span-5 p-6 rounded-2xl border transition-all ${
                  isLight
                    ? 'bg-gradient-to-br from-amber-50/70 to-white border-amber-200/80 shadow-lg'
                    : 'bg-gradient-to-br from-zinc-900/90 to-black border-amber-500/30 shadow-[0_0_30px_rgba(236,182,19,0.1)]'
                }`}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-mono uppercase opacity-70">Presupuesto Estimado</span>
                  <span className="text-xs font-mono text-emerald-500 font-bold">Sin Sorpresas</span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold tracking-tight font-mono text-amber-500">
                    {totalEstimateEur.toLocaleString('es-ES')} €
                  </span>
                  <span className="text-xs opacity-60">
                    ({activeCategory.basePriceEur} € base + {logisticCostEur} € transporte)
                  </span>
                </div>

                {/* 2 VÍAS DE CIERRE S-CLASS */}
                <div className="space-y-3">
                  {/* Ruta Blindaje VIP (100 € Stripe Deducible) */}
                  <Link
                    href={`/reservar/solista?date=${encodeURIComponent(eventDate)}&province=${encodeURIComponent(activeProvince.name)}`}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black hover:brightness-105 transition-all shadow-[0_0_20px_rgba(236,182,19,0.35)] hover:scale-[1.01] font-mono cursor-pointer"
                  >
                    <Lock size={14} />
                    <span>Bloquear Fecha con {DEPOSITO_STRIPE_EUR} € (Deducible)</span>
                  </Link>

                  {/* Ruta Libre (WhatsApp Directo) */}
                  <a
                    href={`https://wa.me/34693693048?text=${encodeURIComponent(
                      `Hola Edwin, quiero consultar disponibilidad para ${activeCategory.name} en ${activeProvince.name} para la fecha ${eventDate || 'a definir'}. Presupuesto estimado: ${totalEstimateEur} €.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-xs border transition-all ${
                      isLight
                        ? 'bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-50'
                        : 'bg-zinc-900 border-white/15 text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    <MessageCircle size={14} className="text-emerald-500" />
                    <span>Asesoría Rápida por WhatsApp (0 €)</span>
                  </a>

                  {/* Micro-Compromiso 1 €: Explorar Fincas & Proveedores */}
                  <button
                    onClick={() => setShowDossierModal(true)}
                    className="w-full text-center text-[11px] font-mono opacity-70 hover:opacity-100 transition-opacity underline pt-1 cursor-pointer"
                  >
                    ¿Necesitas más opciones? Desbloquear Dossier Proveedores (1 € descontable)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL MICRO-COMPROMISO 1 € (DOSSIER CONFIDENCIAL PROVEEDORES) */}
      {showDossierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl relative ${
              isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#09090d] border-white/10 text-white'
            }`}
          >
            <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-bold mb-2">
              <Zap size={14} />
              <span>FILTRO NEURAL AVANZADO · MICRO-COMPROMISO 1 €</span>
            </div>
            <h3 className="text-xl font-bold font-serif mb-2">Dossier Confidencial de Proveedores</h3>
            <p className="text-xs opacity-75 mb-4 leading-relaxed">
              Filtra entre nuestra base de datos de proveedores homologados en <strong>{activeProvince.name}</strong> por fecha, capacidad y acústica garantizada. El euro se resta íntegro de cualquier contratación final.
            </p>

            <div className="space-y-2 mb-5 text-xs font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Teléfonos reales verificados sin intermediarios</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Disponibilidad confirmada en {activeProvince.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>100% Deducible de tu factura</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/34693693048?text=${encodeURIComponent(
                  `Deseo solicitar el Dossier Confidencial de Proveedores para ${activeProvince.name} con micro-compromiso de 1 € deducible.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-black text-center transition-all shadow-md font-mono"
              >
                Acceder al Dossier (1 €)
              </a>
              <button
                onClick={() => setShowDossierModal(false)}
                className="py-3 px-4 rounded-xl text-xs font-mono opacity-70 hover:opacity-100 transition-opacity"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
