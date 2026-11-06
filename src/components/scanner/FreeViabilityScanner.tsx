'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Volume2,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Lock,
  Flame,
  Activity,
  FileText,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';

interface EventTypeOption {
  id: string;
  name: string;
  subtitle: string;
  splLimitDba: string;
  basePriceEur: number;
  badge: string;
}

const EVENT_TYPES: EventTypeOption[] = [
  {
    id: 'boda',
    name: 'Boda en Finca / Jardín',
    subtitle: 'Ceremonia, cóctel y banquete exterior e interior',
    splLimitDba: '85 - 90 dBA',
    basePriceEur: TARIFA_BASE_SOLISTA_EUR, // 350 €
    badge: 'Fincas Verificadas',
  },
  {
    id: 'plaza',
    name: 'Festejos Populares / Plaza',
    subtitle: 'Plazas municipales, ferias y recintos abiertos',
    splLimitDba: '90 - 102 dBA (Limitador telemático)',
    basePriceEur: 1200,
    badge: 'B2G LCSP Art. 118',
  },
  {
    id: 'corporativo',
    name: 'Gala Corporativa / Hotel',
    subtitle: 'Convenciones, galas privadas y cóctel de gala',
    splLimitDba: '70 - 80 dBA',
    basePriceEur: 650,
    badge: 'Acústica de Confort',
  },
  {
    id: 'vimume',
    name: 'Residencia Senior / VIMUME',
    subtitle: 'Sesión neuroacústica clínica no invasiva 40 Hz',
    splLimitDba: '65 - 75 dBA (No invasivo)',
    basePriceEur: 450,
    badge: 'Deducción 80% Ley 49/2002',
  },
];

interface ProvinceOption {
  id: string;
  name: string;
  distanceKm: number;
}

const PROVINCES: ProvinceOption[] = [
  { id: 'toledo', name: 'Toledo (Hub Méntrida)', distanceKm: 40 },
  { id: 'madrid', name: 'Madrid Capital / Sur', distanceKm: 55 },
  { id: 'madrid_norte', name: 'Madrid Sierra / Norte', distanceKm: 85 },
  { id: 'guadalajara', name: 'Guadalajara', distanceKm: 110 },
  { id: 'ciudad_real', name: 'Ciudad Real', distanceKm: 145 },
  { id: 'segovia', name: 'Segovia', distanceKm: 125 },
  { id: 'avila', name: 'Ávila', distanceKm: 115 },
  { id: 'otras', name: 'Otra Provincia (Nacional)', distanceKm: 220 },
];

export function FreeViabilityScanner() {
  const [selectedEventType, setSelectedEventType] = useState<string>('boda');
  const [selectedProvince, setSelectedProvince] = useState<string>('madrid');
  const [aforo, setAforo] = useState<number>(120);
  const [isCopied, setIsCopied] = useState(false);

  const eventConfig = useMemo(() => {
    return EVENT_TYPES.find((e) => e.id === selectedEventType) || EVENT_TYPES[0];
  }, [selectedEventType]);

  const provinceConfig = useMemo(() => {
    return PROVINCES.find((p) => p.id === selectedProvince) || PROVINCES[1];
  }, [selectedProvince]);

  // Cálculo Canónico de Logística S-Class:
  // 1,50 €/km a partir del km 50 (+ 120 € hotel si > 200 km)
  const logisticsCost = useMemo(() => {
    const km = provinceConfig.distanceKm;
    let cost = 0;
    if (km > 50) {
      cost += (km - 50) * 1.5;
    }
    if (km > 200) {
      cost += 120.0; // Suplemento de pernocta canónico
    }
    return cost;
  }, [provinceConfig]);

  // Cálculo de Potencia Acústica (12 W/pax reglamentario)
  const totalWatts = useMemo(() => {
    return aforo * WATTS_PER_PAX;
  }, [aforo]);

  // Presupuesto Total Estimado en Céntimos Enteros
  const totalEstimatedEur = useMemo(() => {
    return eventConfig.basePriceEur + logisticsCost;
  }, [eventConfig, logisticsCost]);

  const cleanPhone = CENTRALITA_EAR_OS.replace(/[^0-9]/g, '');

  const whatsappMessage = useMemo(() => {
    const msg =
      `Hola Productora EAR, he completado el Escáner de Viabilidad:\n` +
      `• Tipo: ${eventConfig.name}\n` +
      `• Ubicación: ${provinceConfig.name} (~${provinceConfig.distanceKm} km)\n` +
      `• Aforo: ${aforo} personas (${totalWatts} W recomendados)\n` +
      `• Límite Acústico: ${eventConfig.splLimitDba}\n` +
      `• Presupuesto Estimado: ${totalEstimatedEur.toFixed(2)} € (Suelo + Logística)\n` +
      `• Fianza Deducible: ${DEPOSITO_STRIPE_EUR} €\n` +
      `Deseo consultar disponibilidad de fecha.`;
    return encodeURIComponent(msg);
  }, [eventConfig, provinceConfig, aforo, totalWatts, totalEstimatedEur]);

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[11px] font-mono uppercase tracking-widest mb-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Escáner Diagnóstico en 60 Segundos</span>
          </div>
          <h2 className="text-[20px] font-bold font-syne text-white tracking-tight leading-snug">
            Diagnóstico Acústico, Logístico & Presupuestario
          </h2>
          <p className="text-[13px] text-zinc-400 font-montserrat mt-1">
            Auditoría preliminar instantánea para verificar decibelios legales (Ley 37/2003) y coste real sin sorpresas.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[12px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full w-fit">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>SSOT Auditado en Céntimos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* PARÁMETROS DEL ESCÁNER (Columna Izquierda 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* PASO 1: TIPO DE EVENTO */}
          <div>
            <label className="block text-[12px] font-mono text-zinc-400 uppercase tracking-wider mb-2.5">
              1. Selecciona el Tipo de Evento o Proyecto
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EVENT_TYPES.map((type) => {
                const isSelected = type.id === selectedEventType;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedEventType(type.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/60 shadow-[0_0_15px_rgba(236,182,19,0.15)]'
                        : 'bg-zinc-900/60 border-white/5 hover:bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[13px] font-montserrat font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                        {type.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-zinc-400 border border-white/10">
                        {type.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{type.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 2: UBICACIÓN Y KILOMETRAJE */}
          <div>
            <label className="block text-[12px] font-mono text-zinc-400 uppercase tracking-wider mb-2.5">
              2. Ubicación del Evento (Cálculo GPS desde Hub Méntrida)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PROVINCES.map((prov) => {
                const isSelected = prov.id === selectedProvince;
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => setSelectedProvince(prov.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-200'
                        : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[12px] font-montserrat font-semibold block truncate">
                      {prov.name.split('(')[0].trim()}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      ~{prov.distanceKm} km
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 3: AFORO DE INVITADOS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-mono text-zinc-400 uppercase tracking-wider">
                3. Aforo de Asistentes Previsto
              </label>
              <div className="text-[14px] font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
                {aforo} pax
              </div>
            </div>

            <input
              type="range"
              min={30}
              max={600}
              step={10}
              value={aforo}
              onChange={(e) => setAforo(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-1.5">
              <span>30 pax (Intimista)</span>
              <span>150 pax (Boda Estándar)</span>
              <span>600 pax (Gala / Concierto)</span>
            </div>
          </div>
        </div>

        {/* TARJETA DE RESULTADO INSTANTÁNEO (Columna Derecha 5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-zinc-900/80 p-5 sm:p-6 backdrop-blur-xl relative flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Dictamen Técnico Instantáneo
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Prescripción Acústica */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Normativa Acústica Ley 37/2003</span>
              </div>
              <div className="text-[15px] font-mono font-bold text-white">
                {eventConfig.splLimitDba}
              </div>
              <div className="text-[11px] text-zinc-400 font-montserrat">
                Refuerzo acústico calibrado: <strong>{totalWatts} W RMS</strong> ({WATTS_PER_PAX} W/pax telemétrico)
              </div>
            </div>

            {/* Desglose Presupuestario */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[12px] font-montserrat text-zinc-400">
                <span>Honorarios Base Servicio</span>
                <span className="font-mono text-white">{eventConfig.basePriceEur.toFixed(2)} €</span>
              </div>
              <div className="flex items-center justify-between text-[12px] font-montserrat text-zinc-400">
                <span>Logística ({provinceConfig.distanceKm} km desde Méntrida)</span>
                <span className="font-mono text-white">
                  {logisticsCost === 0 ? '0,00 € (Incluido)' : `${logisticsCost.toFixed(2)} €`}
                </span>
              </div>
              <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                <span className="text-[13px] font-montserrat font-bold text-white">
                  Presupuesto Total Estimado
                </span>
                <span className="text-[18px] font-mono font-extrabold text-amber-300">
                  {totalEstimatedEur.toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Blindaje de Fianza */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-montserrat text-amber-200 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <span>
                Fianza oficial deducible de <strong>{DEPOSITO_STRIPE_EUR} €</strong> vía Stripe Price-Lock (100% reintegrable si no se formaliza).
              </span>
            </div>
          </div>

          {/* Botones de Acción Inmediata */}
          <div className="pt-5 space-y-2.5">
            <Link
              href={`/reservar/acuerdo?tipo=${eventConfig.id}&provincia=${provinceConfig.id}&distancia=${provinceConfig.distanceKm}&aforo=${aforo}&total=${totalEstimatedEur.toFixed(2)}&watts=${totalWatts}&dba=${encodeURIComponent(eventConfig.splLimitDba)}`}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-[13px] font-montserrat transition-all shadow-[0_0_20px_rgba(236,182,19,0.25)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Aprobar Acuerdo & Bloquear Fecha ({DEPOSITO_STRIPE_EUR} €)</span>
            </Link>

            <a
              href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-semibold text-[12px] font-montserrat transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Enviar Informe Completo a mi WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

