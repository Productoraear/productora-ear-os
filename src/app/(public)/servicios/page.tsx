'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Shield, Zap, Activity, Award, CheckCircle2, 
  Layers, Sliders, ArrowRight, Lock, Unlock, Radio, Users, 
  Cpu, Music, Flame, GlassWater, Crown, Disc, Utensils, 
  Headphones, Camera, Video, Lightbulb, ClipboardList, ChevronRight
} from 'lucide-react';
import publicCatalog from '@/data/catalog/vampire_public_catalog_zk.json';
import { useEventCart, CartItem } from '@/context/EventCartContext';
import { NeuralJourneyApex } from '@/app/components/SClassScreens/NeuralJourneyApex';
import { EventEngineProvider } from '@/contexts/EventEngineContext';
import type { AuraType, ClimaxType, ServiceCategory, WeddingPreferences } from '@/lib/engines/weddingMatchEngine';

// Activos de Infraestructura Propia (Tier 0 - Margen >75% / S-Class Certified)
const TIER_ZERO_ARSENAL: CartItem[] = [
  {
    slug: 'bose-f1-array-pack',
    rawName: 'Sistema PA Line Array Bose F1 Model 812 + Dual Subwoofers (4000W Peak)',
    category: 'Ingeniería Acústica S-Class',
    itemType: 'HARDWARE_RIDER',
    estimatedPrice: 450,
    technicalWatts: 2000,
  },
  {
    slug: 'behringer-xr18-air-pack',
    rawName: 'Mesa Digital Behringer XR18 Air + Microfonía Shure Axient / Beta 87A',
    category: 'Control & Manejo de Señal',
    itemType: 'HARDWARE_RIDER',
    estimatedPrice: 220,
    technicalWatts: 0,
  },
  {
    slug: 'edwin-agudelo-tenor-mariachi',
    rawName: 'Edwin Agudelo — Tenor Solista & Mariachi Show Imperial (Direct Booking)',
    category: 'Booking Principal de Autor',
    itemType: 'ARTIST_DIRECT',
    estimatedPrice: 750,
    technicalWatts: 0,
  }
];

const ATMOSPHERES = [
  {
    id: 'gala',
    name: 'Gala Imperial & Black Tie',
    desc: 'Lujo sutil, iluminación cálida, acústica cristalina sin fatiga auditiva.',
    icon: Crown,
    glow: 'from-amber-500/20 to-yellow-600/10',
    border: 'border-amber-500/30 text-amber-300',
    tag: 'PRESTIGE TIER'
  },
  {
    id: 'fiesta',
    name: 'Fiesta Rompedora & Vanguardia',
    desc: 'Alta presión sonora, cabezas móviles Beam/Wash y DJ live sincronizado.',
    icon: Flame,
    glow: 'from-pink-500/20 to-purple-600/10',
    border: 'border-pink-500/30 text-pink-300',
    tag: 'HIGH ENERGY'
  },
  {
    id: 'b2g',
    name: 'Institucional / B2G Soberano',
    desc: 'Pliegos homologados, póliza RC 1M€, oratoria nítida y protocolo oficial.',
    icon: Shield,
    glow: 'from-blue-500/20 to-cyan-600/10',
    border: 'border-blue-500/30 text-blue-300',
    tag: 'GOVERNMENT READY'
  },
  {
    id: 'intimo',
    name: 'Íntimo, Acústico & Signature',
    desc: 'Voz lírica directa, cuerdas acústicas de concierto y microfonía de estudio.',
    icon: GlassWater,
    glow: 'from-emerald-500/20 to-teal-600/10',
    border: 'border-emerald-500/30 text-emerald-300',
    tag: 'BOUTIQUE'
  }
];

export default function UnifiedMatchmakerPage() {
  return (
    <EventEngineProvider>
      <UnifiedMatchmakerContent />
    </EventEngineProvider>
  );
}

function UnifiedMatchmakerContent() {
  const { cart, addToCart, removeFromCart, totalBudget, totalWatts, hardwareMargin } = useEventCart();
  const router = useRouter();

  const [atmosphere, setAtmosphere] = useState('gala');
  const [guests, setGuests] = useState<number>(150);
  const [priceLockActive, setPriceLockActive] = useState(true);
  const [activeTab, setActiveTab] = useState<'tier0' | 'catalog'>('tier0');
  const [isNeuralModalOpen, setIsNeuralModalOpen] = useState(false);
  const [neuralResults, setNeuralResults] = useState<WeddingPreferences | null>(null);

  // Autocalculadora de potencia acústica según aforo (12W por persona en exterior/gala)
  const requiredWatts = useMemo(() => guests * 12, [guests]);
  const activeAtmosphereData = useMemo(() => ATMOSPHERES.find(a => a.id === atmosphere) || ATMOSPHERES[0], [atmosphere]);

  const handleNeuralComplete = (prefs: WeddingPreferences) => {
    setNeuralResults(prefs);
    setGuests(prefs.guestCount);
    setIsNeuralModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans pb-40">
      {/* BACKGROUND CINEMATIC AURAS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#ecb613]/10 via-[#d4af37]/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[160px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-28">
        
        {/* HEADER S-CLASS HERO */}
        <div className="border-b border-white/10 pb-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[11px] font-mono tracking-widest uppercase mb-4">
                <Sparkles size={13} className="animate-pulse" />
                <span>ECOSISTEMA DE MATCHMAKING & ATMÓSFERA S-CLASS</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
                DISEÑO DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-[#ffd700] to-[#fff5c0]">ATMÓSFERA & INGENIERÍA</span>
              </h1>
              <p className="text-sm md:text-base text-white/60 max-w-2xl mt-2">
                Simulador de Presión Sonora, Balance Acústico y Contratación Directa sin intermediarios con Price-Lock 72h garantizado.
              </p>
            </div>

            {/* BOTÓN PRICE-LOCK */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPriceLockActive(!priceLockActive)}
              className={`px-5 py-3 rounded-2xl text-xs font-mono font-bold flex items-center gap-3 transition-all duration-500 border ${
                priceLockActive
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-xl'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-[#ecb613]/40'
              }`}
            >
              {priceLockActive ? <Lock size={16} className="text-emerald-400" /> : <Unlock size={16} />}
              <div className="text-left">
                <div className="text-[10px] tracking-wider uppercase opacity-75">Garantía Soberana</div>
                <div>{priceLockActive ? 'SHA-256 Price-Lock Activo' : 'Activar Bloqueo 72h'}</div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* BENTO GRID: ATMÓSFERAS Y AFORO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          
          {/* SELECTOR DE ATMÓSFERAS (7 COLS) */}
          <div className="lg:col-span-7 bg-[#0a0a0a]/80 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                  <Disc size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">1. Curaduría de Atmósfera</h3>
                  <p className="text-xs text-white/40">Define la firma emocional y el estándar de decibelios</p>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                {activeAtmosphereData.tag}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {ATMOSPHERES.map((atm) => {
                const IconComponent = atm.icon;
                const isSelected = atmosphere === atm.id;
                return (
                  <motion.div
                    key={atm.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setAtmosphere(atm.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? `bg-gradient-to-br ${atm.glow} border-[#ecb613] shadow-[0_0_25px_rgba(236,182,19,0.15)]`
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <IconComponent size={20} className={isSelected ? 'text-[#ecb613]' : 'text-white/40'} />
                        {isSelected && <CheckCircle2 size={16} className="text-[#ecb613]" />}
                      </div>
                      <h4 className="text-sm font-bold text-white tracking-tight">{atm.name}</h4>
                      <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">{atm.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* SIMULADOR DE AFORO & PRESIÓN ACÚSTICA (5 COLS) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0a0a0a]/90 to-[#050505] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">2. Aforo & Cálculo Acústico</h3>
                  <p className="text-xs text-white/40">Telemetría de potencia sugerida según invitados</p>
                </div>
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">Invitados (PAX)</span>
                  <div className="text-2xl md:text-3xl font-black text-white mt-1">{guests} <span className="text-xs text-[#ecb613] font-mono">PAX</span></div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">Potencia Requerida</span>
                  <div className="text-2xl md:text-3xl font-black text-cyan-400 mt-1">~{requiredWatts} <span className="text-xs font-mono">W</span></div>
                </div>
              </div>

              {/* SLIDER */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-white/60 font-mono">
                  <span>Escala de Evento:</span>
                  <span className="text-[#ecb613] font-bold">
                    {guests < 80 ? 'Íntimo / Sala' : guests < 300 ? 'Gala / Boda Grande' : 'Gran Formato / Festival'}
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="1200"
                  step="10"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full accent-[#ecb613] bg-white/10 h-2 rounded-lg cursor-pointer transition-all"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/30 pt-1">
                  <span>30 PAX</span>
                  <span>500 PAX</span>
                  <span>1200 PAX</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-mono">
              <span className="flex items-center gap-1.5"><Shield size={13} className="text-emerald-400" /> Presión Acústica Certificada</span>
              <span className="text-emerald-400">12W / PAX</span>
            </div>
          </div>
        </div>

        {/* TABS DE SELECCIÓN DE REPERTORIO / ARSENAL */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('tier0')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tier0'
                  ? 'bg-[#ecb613] text-black shadow-[0_0_25px_rgba(236,182,19,0.3)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={15} />
              INFRAESTRUCTURA TÉCNICA & ARTISTAS S-CLASS ({TIER_ZERO_ARSENAL.length})
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeTab === 'catalog'
                  ? 'bg-[#ecb613] text-black shadow-[0_0_25px_rgba(236,182,19,0.3)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={15} />
              CATÁLOGO NACIONAL ZK ({(publicCatalog as any[]).length})
            </button>
          </div>

          {/* TRIGGER TÚNEL NEURAL MULTI-PANTALLA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsNeuralModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#d4a855] via-[#ecb613] to-[#ffd700] text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_30px_rgba(212,168,85,0.4)]"
          >
            <Sparkles size={16} className="animate-spin" />
            <span>Iniciar Túnel Neural Multi-Pantalla →</span>
          </motion.button>
        </div>

        {/* MODAL DEL TÚNEL NEURAL S-CLASS */}
        <AnimatePresence>
          {isNeuralModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 overflow-y-auto"
            >
              <div className="relative w-full max-w-6xl bg-zinc-950 border border-[#d4a855]/30 rounded-[3rem] p-6 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
                <button
                  onClick={() => setIsNeuralModalOpen(false)}
                  className="absolute top-8 right-8 text-white/50 hover:text-white px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono"
                >
                  ✕ Cerrar
                </button>
                <NeuralJourneyApex
                  isOpen={isNeuralModalOpen}
                  onClose={() => setIsNeuralModalOpen(false)}
                  onComplete={handleNeuralComplete}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECCIÓN 1: ARSENAL PROPIO TIER 0 */}
        {activeTab === 'tier0' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-in fade-in duration-500">
            {TIER_ZERO_ARSENAL.map((item) => {
              const isInCart = cart.some((i) => i.slug === item.slug);
              return (
                <div
                  key={item.slug}
                  className={`rounded-3xl p-6 border transition-all duration-500 backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden group ${
                    isInCart
                      ? 'bg-gradient-to-b from-[#ecb613]/10 to-[#0a0a0a] border-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.15)]'
                      : 'bg-[#0a0a0a]/80 border-white/10 hover:border-white/20 hover:shadow-2xl'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono tracking-wider font-bold px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
                        {item.category}
                      </span>
                      {item.technicalWatts ? (
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                          {item.technicalWatts}W RMS
                        </span>
                      ) : null}
                    </div>
                    <h3 className="font-bold text-lg text-white group-hover:text-[#ecb613] transition-colors leading-snug">
                      {item.rawName}
                    </h3>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-white/40 block">Tarifa Oficial</span>
                      <span className="text-2xl font-black text-white">{item.estimatedPrice} <span className="text-xs text-[#ecb613]">€</span></span>
                    </div>
                    <button
                      onClick={() => {
                        if (isInCart) {
                          removeFromCart(item.slug);
                        } else {
                          addToCart(item);
                        }
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        isInCart
                          ? 'bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/60'
                          : 'bg-[#ecb613] text-black hover:bg-[#ffd700] shadow-[0_0_20px_rgba(236,182,19,0.2)]'
                      }`}
                    >
                      {isInCart ? 'Retirar' : '+ Inyectar al Pack'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SECCIÓN 2: CATÁLOGO DE PROVEEDORES INDEXADOS */}
        {activeTab === 'catalog' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-in fade-in duration-500">
            {(publicCatalog as any[]).slice(0, 24).map((vendor: any) => {
              const isInCart = cart.some((i) => i.slug === vendor.slug);
              return (
                <div
                  key={vendor.slug}
                  className="rounded-3xl p-6 bg-[#0a0a0a]/70 border border-white/5 hover:border-white/20 transition-all backdrop-blur-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-[#ecb613] bg-[#ecb613]/10 px-2.5 py-0.5 rounded-full border border-[#ecb613]/20">
                        Verificado ZK
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-white truncate">{vendor.rawName}</h3>
                    <p className="text-xs text-white/50 line-clamp-3 mt-2 leading-relaxed">
                      {vendor.description || 'Proveedor verificado bajo la infraestructura técnica de Productora EAR.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <Link href={`/proveedores/${vendor.slug}`} className="text-xs text-white/50 hover:text-[#ecb613] transition underline font-mono">
                      Escaparate →
                    </Link>
                    <button
                      onClick={() => {
                        if (isInCart) {
                          removeFromCart(vendor.slug);
                        } else {
                          addToCart({
                            slug: vendor.slug,
                            rawName: vendor.rawName,
                            category: 'Servicio Complementario B2B',
                            itemType: 'VENDOR_SERVICE',
                            estimatedPrice: 500,
                            technicalWatts: 0,
                          });
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition ${
                        isInCart ? 'bg-red-950/60 text-red-300 border border-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isInCart ? 'Quitar' : '+ Añadir'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* DOCK BAR FLOTANTE RESUMEN S-CLASS */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl bg-[#0a0a0a]/90 border border-[#ecb613]/40 p-4 md:p-5 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center justify-between gap-4 z-50 backdrop-blur-2xl"
          >
            <div className="flex items-center gap-6 md:gap-10">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">Inversión Estimada:</span>
                <p className="text-2xl md:text-3xl font-black text-[#ecb613] font-mono">{totalBudget.toLocaleString()} <span className="text-sm">€</span></p>
              </div>
              <div className="border-l border-white/10 pl-6">
                <span className="text-[10px] font-mono text-white/40 uppercase block">Presión Acústica:</span>
                <p className="text-lg md:text-xl font-bold text-cyan-400 font-mono">{totalWatts.toLocaleString()} <span className="text-xs">W RMS</span></p>
              </div>
              <div className="hidden lg:block border-l border-white/10 pl-6">
                <span className="text-[10px] font-mono text-white/40 uppercase block">Margen Directo:</span>
                <p className="text-sm font-bold text-emerald-400 font-mono">~{hardwareMargin.toLocaleString()} €</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <Link
                href="/presupuesto"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition text-center"
              >
                Ajustar Desglose
              </Link>
              <Link
                href="/checkout/presupuesto"
                className="px-6 py-3 bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-bold text-xs font-mono rounded-2xl shadow-[0_0_25px_rgba(236,182,19,0.3)] hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
              >
                Bloquear Reserva ({totalBudget}€) →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
