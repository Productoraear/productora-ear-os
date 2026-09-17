'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  Lock, 
  Check, 
  Star, 
  Users, 
  Heart, 
  Building2, 
  Landmark, 
  Mic, 
  Music, 
  Volume2, 
  ArrowRight,
  Info
} from 'lucide-react';
import Link from 'next/link';

export interface ProductionPack {
  id: string;
  name: string;
  subtitle: string;
  category: 'boda' | 'mariachi' | 'solista' | 'finca' | 'b2g';
  basePrice: number;
  badge: string;
  description: string;
  features: string[];
  icon: any;
  highlight?: boolean;
}

export const PRODUCTION_PACKS: ProductionPack[] = [
  {
    id: 'solista_gala',
    name: 'Solista Lírico S-Class (Edwin Agudelo)',
    subtitle: 'Ceremonia Nupcial, Recepción o Banquete',
    category: 'solista',
    basePrice: 350.00,
    badge: 'Artista Insignia',
    description: 'Voz lírica de alta tesitura para firmas de acta, momentos solemnes y baladas de gala. Microfonía Shure Axient y sonido Bose.',
    features: ['Voz lírica en directo', 'Microfonía Shure Beta 87A', 'Sonido Bose S1 Pro', 'Repertorio personalizado'],
    icon: Mic
  },
  {
    id: 'mariachi_trio',
    name: "Mariachi 'Gala de Oro' (Trío Charro)",
    subtitle: 'Serenata Tradicional o Cóctel de Bienvenida',
    category: 'mariachi',
    basePrice: 550.00,
    badge: 'Favorito Bodas',
    description: '3 Músicos con auténtico traje de gala charro (voz, guitarra, trompeta). Serenatas sorpresa, cócteles y momentos alegres.',
    features: ['3 Músicos de gala', 'Traje charro completo', 'Clásicos mexicanos', 'Presión acústica < 75 dB'],
    icon: Sparkles
  },
  {
    id: 'mariachi_imperial',
    name: "Mariachi 'Imperial S-Class' (Quinteto)",
    subtitle: 'Edwin Agudelo + 4 Maestros de Gala',
    category: 'mariachi',
    basePrice: 850.00,
    badge: 'Top Selección',
    description: 'Quinteto estelar: tenor solista, guitarrón, vihuela, violín y trompeta solista. Sonorización Bose F1 Model 812 incluida.',
    features: ['5 Músicos de primer nivel', 'Sonido Bose F1 (12 W/pax)', 'Gran impacto visual', 'Sonoridad sin acoples'],
    icon: Music,
    highlight: true
  },
  {
    id: 'cuarteto_sinfonia',
    name: "Cuarteto de Cuerdas 'Sinfonía Nupcial'",
    subtitle: '2 Violines, Viola & Violonchelo Clásico',
    category: 'boda',
    basePrice: 650.00,
    badge: 'Ceremonias de Gala',
    description: 'Elegancia clásica para ceremonias religiosas y civiles. Piezas sacras, bandas sonoras de cine y adaptaciones pop elegantes.',
    features: ['4 Músicos de conservatorio', 'Microfonía DPA 4099', 'Repertorio clásico & bandas sonoras', 'Sonido puro sin distorsión'],
    icon: Heart
  },
  {
    id: 'pack_boda_completa',
    name: 'Pack Boda Integral S-Class (3 en 1)',
    subtitle: 'Ceremonia Lírica + Mariachi Cóctel + DJ Fiesta',
    category: 'boda',
    basePrice: 1450.00,
    badge: 'Mejor Valor',
    description: 'Cobertura total: Edwin Agudelo en ceremonia, Mariachi en cóctel y DJ profesional con sonido Bose F1 e iluminación en barra libre.',
    features: ['Ceremonia lírica completa', 'Pase de Mariachi en cóctel', 'DJ & iluminación barra libre', 'Técnico de sonido dedicado'],
    icon: Star,
    highlight: true
  },
  {
    id: 'pack_sonido_finca',
    name: 'Sonorización & Iluminación B2B Finca',
    subtitle: 'Garantía Acústica Certificada < 75 dB SPL',
    category: 'finca',
    basePrice: 600.00,
    badge: 'Cero Sanciones',
    description: 'Montaje de sonido Bose F1 y microfonía para fincas y espacios de eventos. Protección legal garantizada contra denuncias policiales.',
    features: ['Columnas Bose F1 Model 812', 'Microfonía inalámbrica Shure', 'Certificado sonométrico < 75 dB', '10% comisión para la finca'],
    icon: Volume2
  },
  {
    id: 'b2g_fiesta_patronal',
    name: 'Producción Municipal B2G (Art. 118 LCSP)',
    subtitle: 'Fiestas Patronales, Pregón o Día del Mayor',
    category: 'b2g',
    basePrice: 3800.00,
    badge: 'Contrato Menor < 14.250 €',
    description: 'Gran Ensamble Mariachi o orquesta de gala con escenario homologado, sonido de alta potencia, seguro de RC de 1.000.000 € y FacturaE con código DIR3.',
    features: ['Gran orquesta / ensamble', 'Sonido & iluminación de gran aforo', 'Seguro RC 1.000.000 €', 'Facturación electrónica FACe'],
    icon: Landmark
  }
];

const PROVINCE_PRESETS = [
  { label: 'Hub Central Méntrida (Toledo)', km: 0, note: 'Km 0 Operativo' },
  { label: 'Madrid Capital / Sur', km: 46, note: '46 km · 0 € extra' },
  { label: 'Toledo Capital', km: 52, note: '52 km · 3 € extra' },
  { label: 'Ávila Capital', km: 63, note: '63 km · 19,50 € extra' },
  { label: 'Guadalajara Capital', km: 98, note: '98 km · 72 € extra' },
  { label: 'Segovia Capital', km: 110, note: '110 km · 90 € extra' },
  { label: 'Ciudad Real', km: 141, note: '141 km · 136,50 € extra' },
  { label: 'Personalizado / Otra Demarcación', km: -1, note: 'Ajuste manual' }
];

export function CommercialEventCalculator() {
  const [selectedPackId, setSelectedPackId] = useState<string>('mariachi_imperial');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'boda' | 'mariachi' | 'solista' | 'finca' | 'b2g'>('all');
  const [distance, setDistance] = useState<number>(46); // Default Madrid 46 km
  const [selectedPreset, setSelectedPreset] = useState<number>(1);
  const [customKm, setCustomKm] = useState<number>(150);
  const [endTime, setEndTime] = useState<string>('23:00');
  const [pax, setPax] = useState<number>(120);

  // Stripe Checkout state
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);

  const selectedPack = useMemo(() => {
    return PRODUCTION_PACKS.find(p => p.id === selectedPackId) || PRODUCTION_PACKS[0];
  }, [selectedPackId]);

  const effectiveKm = selectedPreset === 7 ? customKm : PROVINCE_PRESETS[selectedPreset].km;

  // Logistics & Hotel calculations
  const FREE_KM = 50;
  const KM_RATE = 1.50;
  const HOTEL_FEE = 120.00;

  const logisticsCost = useMemo(() => {
    if (effectiveKm <= FREE_KM) return 0;
    return (effectiveKm - FREE_KM) * KM_RATE;
  }, [effectiveKm]);

  const requiresHotel = useMemo(() => {
    if (effectiveKm > 200) return true;
    const hour = parseInt(endTime.split(':')[0], 10);
    if (hour >= 3 && hour <= 6) return true;
    return false;
  }, [effectiveKm, endTime]);

  const hotelCost = requiresHotel ? HOTEL_FEE : 0;
  const baseRate = selectedPack.basePrice;
  const totalBudget = baseRate + logisticsCost + hotelCost;

  // Split calculations
  const artistSplit = totalBudget * 0.80;
  const infraSplit = totalBudget * 0.10;
  const vimumeSplit = totalBudget * 0.10;
  const fiscalDeductionMax = vimumeSplit * 0.80; // Ley 49/2002: hasta 80% deducible

  // Preset changer
  const handlePresetChange = (index: number) => {
    setSelectedPreset(index);
    if (index !== 7) {
      setDistance(PROVINCE_PRESETS[index].km);
    }
  };

  // WhatsApp Message
  const whatsappUrl = useMemo(() => {
    const text = encodeURIComponent(
      `Hola Edwin, he cotizado el pack *${selectedPack.name}* para un evento de ~${pax} invitados a ${effectiveKm} km de Méntrida (finalización ~${endTime}).\n` +
      `Presupuesto total estimado: ${totalBudget.toFixed(2)} € (Base: ${baseRate.toFixed(2)} € + Logística: ${logisticsCost.toFixed(2)} €${hotelCost > 0 ? ` + Hotel: ${hotelCost.toFixed(2)} €` : ''}).\n` +
      `Quiero verificar disponibilidad y formalizar el bloqueo con el depósito de 100 €.`
    );
    return `https://wa.me/34693693048?text=${text}`;
  }, [selectedPack, pax, effectiveKm, endTime, totalBudget, baseRate, logisticsCost, hotelCost]);

  // Stripe Price-Lock Checkout
  const handleDepositCheckout = async () => {
    setDepositError(null);
    setDepositLoading(true);
    try {
      const res = await fetch('/api/reservar/solista/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
          formato: selectedPack.name,
          distanciaKm: effectiveKm,
          horaFin: endTime,
          totalEstimado: Number(totalBudget.toFixed(2)),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'No se pudo generar la sesión de pago.');
      }
      window.location.href = data.url;
    } catch (err: any) {
      setDepositError(err.message || 'Error al conectar con Stripe.');
      setDepositLoading(false);
    }
  };

  const filteredPacks = useMemo(() => {
    if (selectedCategory === 'all') return PRODUCTION_PACKS;
    return PRODUCTION_PACKS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="w-full space-y-12">
      
      {/* 👑 HEADER PRINCIPAL DEL COTIZADOR */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-xs font-mono text-[#ecb613] tracking-widest uppercase">
          <Calculator size={14} />
          COTIZADOR OFICIAL S-CLASS // TRANSPARENCIA TOTAL
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-syne leading-tight">
          Cotiza tu Evento en 1 Clic // <span className="text-[#ecb613]">Precio Cerrado</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Selecciona tu formato musical o técnico, calcula la logística exacta desde Méntrida (Km 0) y bloquea tu fecha con garantía contractual y fianza protegida de 100 €.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 🎴 COLUMNA IZQUIERDA: CONFIGURADOR DE EVENTO */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* PASO 1: SELECTOR DE PACKS DE PRODUCCIÓN */}
          <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={18} className="text-[#ecb613]" /> 1. Elige tu Formato o Pack de Producción
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Tarifas oficiales cerradas. Rider acústico Bose y microfonía Shure incluidos.
                </p>
              </div>
            </div>

            {/* Categorías Filter */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Todos los Formatos' },
                { id: 'mariachi', label: 'Mariachis' },
                { id: 'boda', label: 'Bodas & Cuerdas' },
                { id: 'solista', label: 'Solistas Líricos' },
                { id: 'finca', label: 'Fincas B2B' },
                { id: 'b2g', label: 'Ayuntamientos' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_15px_rgba(236,182,19,0.3)]'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid de Packs */}
            <div className="grid grid-cols-1 gap-3.5">
              {filteredPacks.map(pack => {
                const isSelected = selectedPackId === pack.id;
                const Icon = pack.icon;

                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPackId(pack.id)}
                    className={`relative rounded-xl border p-4 sm:p-5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                      isSelected
                        ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.2)] ring-1 ring-[#ecb613]'
                        : 'bg-[#050505] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl border shrink-0 ${
                        isSelected 
                          ? 'bg-[#ecb613] text-black border-[#ecb613]' 
                          : 'bg-white/5 text-[#ecb613] border-white/10'
                      }`}>
                        <Icon size={22} />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                            {pack.badge}
                          </span>
                          {pack.highlight && (
                            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#ecb613]/20 text-[#ecb613] font-bold">
                              Recomendado
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-base text-white group-hover:text-[#ecb613] transition-colors">
                          {pack.name}
                        </h4>
                        <p className="text-xs text-zinc-400 font-light line-clamp-2">
                          {pack.description}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 flex sm:flex-col items-center sm:items-end justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Desde</span>
                        <span className="text-xl font-bold font-mono text-[#ecb613]">
                          {pack.basePrice.toFixed(2)} €
                        </span>
                      </div>
                      <div className={`mt-2 px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                        isSelected ? 'bg-[#ecb613] text-black' : 'bg-white/5 text-zinc-400'
                      }`}>
                        {isSelected ? <Check size={13} /> : null}
                        <span>{isSelected ? 'Seleccionado' : 'Elegir'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PASO 2: LOGÍSTICA & DISTANCIA DESDE MÉNTRIDA */}
          <div className="bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin size={18} className="text-[#ecb613]" /> 2. Ubicación & Logística (Km 0 Méntrida)
            </h3>
            <p className="text-xs text-zinc-400">
              Despliegue logístico desde el Hub Central en Méntrida (Toledo). Los primeros 50 km están 100% bonificados (0 €). Kilómetros posteriores a 1,50 €/km.
            </p>

            {/* Presets de Demarcaciones */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PROVINCE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetChange(idx)}
                  className={`p-3 rounded-xl border text-left transition-all text-xs font-mono ${
                    selectedPreset === idx
                      ? 'bg-[#ecb613]/15 border-[#ecb613] text-white shadow'
                      : 'bg-[#050505] border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <strong className="block text-white truncate text-[11px] mb-1">{preset.label.split('/')[0]}</strong>
                  <span className="text-[10px] text-[#ecb613] block">{preset.note}</span>
                </button>
              ))}
            </div>

            {/* Slider de Kilometraje personalizado si está seleccionado */}
            {selectedPreset === 7 && (
              <div className="space-y-2 p-4 bg-black/50 border border-white/10 rounded-xl animate-in fade-in">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-300">
                  <span>Distancia exacta desde Méntrida:</span>
                  <span className="text-[#ecb613] font-bold text-sm">{customKm} km</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="10"
                  value={customKm}
                  onChange={(e) => setCustomKm(Number(e.target.value))}
                  className="w-full accent-[#ecb613]"
                />
              </div>
            )}

            {/* Hora de fin y Asistentes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <Clock size={13} className="text-[#ecb613]" /> Hora Estimada de Finalización
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#ecb613]"
                />
                <span className="text-[10px] text-zinc-500 font-mono block">
                  Finalizaciones post 03:00 AM requieren +120 € de pernoctación técnica.
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <Users size={13} className="text-[#ecb613]" /> Invitados Estimados (Pax)
                </label>
                <div className="flex items-center gap-2">
                  {[50, 100, 200, 350].map(n => (
                    <button
                      key={n}
                      onClick={() => setPax(n)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                        pax === n
                          ? 'bg-[#ecb613] text-black border-[#ecb613]'
                          : 'bg-[#111] border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono block">
                  Calibración acústica automática: 12 W/pax Bose garantizados.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 📜 COLUMNA DERECHA: DESGLOSE ECONÓMICO & CIERRE */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0A0A0C] border border-[#ecb613]/30 rounded-2xl p-6 sm:p-8 sticky top-24 shadow-[0_0_60px_rgba(236,182,19,0.06)] space-y-6">
            
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block mb-1">
                Resumen de tu Cotización Oficial
              </span>
              <h3 className="text-xl font-bold font-syne text-white uppercase">
                {selectedPack.name}
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                {effectiveKm} km de logística · Fin ~{endTime} · ~{pax} pax
              </p>
            </div>

            {/* DESGLOSE ECONÓMICO */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-zinc-300">
                <span>Tarifa Base Oficial ({selectedPack.name.split('(')[0]})</span>
                <span className="text-white font-bold">{baseRate.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between items-center text-zinc-300">
                <span>
                  Logística Méntrida ({effectiveKm <= FREE_KM ? 'Gratis 50 km' : `${effectiveKm - FREE_KM} km extra`})
                </span>
                <span className={logisticsCost > 0 ? 'text-white font-bold' : 'text-emerald-400 font-bold'}>
                  {logisticsCost > 0 ? `+${logisticsCost.toFixed(2)} €` : '0,00 €'}
                </span>
              </div>

              {hotelCost > 0 && (
                <div className="flex justify-between items-center text-amber-300">
                  <span>Suplemento Pernoctación (&gt; 200 km o post 03:00)</span>
                  <span className="font-bold">+{hotelCost.toFixed(2)} €</span>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">Total Presupuesto</span>
                  <span className="text-2xl font-black font-mono text-[#ecb613]">
                    {totalBudget.toFixed(2)} €
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">IVA no incluido</span>
              </div>
            </div>

            {/* SPLIT SOBERANO 80/10/10 */}
            <div className="bg-[#050505] p-4 rounded-xl border border-white/10 space-y-2 text-[11px] font-mono">
              <span className="text-zinc-400 font-bold uppercase block tracking-wider text-[10px]">
                Desglose Ético Split 80/10/10
              </span>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-[9px] text-zinc-500 block">80% Artistas</span>
                  <span className="font-bold text-white">{artistSplit.toFixed(2)} €</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-[9px] text-zinc-500 block">10% EAR OS</span>
                  <span className="font-bold text-zinc-300">{infraSplit.toFixed(2)} €</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-[#8b5cf6]/30">
                  <span className="text-[9px] text-[#8b5cf6] block font-bold">10% VIMUME</span>
                  <span className="font-bold text-[#8b5cf6]">{vimumeSplit.toFixed(2)} €</span>
                </div>
              </div>
              <div className="text-[10px] text-emerald-400 pt-1 flex items-center gap-1.5">
                <ShieldCheck size={13} className="shrink-0" />
                <span>Deducción fiscal IRPF/Sociedades de hasta {fiscalDeductionMax.toFixed(2)} € (Ley 49/2002)</span>
              </div>
            </div>

            {/* DEPÓSITO INMUTABLE */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-xs font-bold font-mono">
                <span className="text-emerald-300">Depósito para Bloqueo Oficial</span>
                <span className="text-emerald-400 text-sm">100,00 €</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">
                El depósito formaliza la fianza inmutable (válida 72h). El resto se liquida el día del evento.
              </p>
            </div>

            {/* ACCIONES DE CIERRE DIRECTO */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleDepositCheckout}
                disabled={depositLoading}
                className="w-full py-4 px-6 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(236,182,19,0.35)] hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
              >
                <Lock size={15} />
                <span>{depositLoading ? 'Conectando con Stripe...' : 'Bloquear Fecha con 100 € en Stripe'}</span>
              </button>

              {depositError && (
                <p className="text-xs text-red-400 font-mono text-center">
                  {depositError}
                </p>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle size={16} />
                <span>Enviar Presupuesto a WhatsApp Oficial</span>
              </a>

              <div className="flex items-center justify-center gap-2 pt-2 text-xs text-zinc-500 font-mono">
                <Phone size={12} className="text-[#ecb613]" />
                <span>Atención inmediata:</span>
                <a href="tel:+34693693048" className="text-white hover:underline">+34 693 693 048</a>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
