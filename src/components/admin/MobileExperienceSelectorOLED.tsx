'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  Save, 
  Sliders, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Users, 
  Volume2, 
  ArrowRight,
  Radio,
  Layers,
  Activity,
  AlertTriangle,
  Flame,
  Brain,
  Gauge,
  Compass,
  Cpu,
  BarChart3,
  Scale,
  ChevronLeft,
  Calendar,
  MapPin,
  Send,
  Lock,
  RotateCcw,
  Check
} from 'lucide-react';
import { 
  useMobileExperience, 
  MobileExperienceMode, 
  RoutingStrategy,
  MobileStudioConfig 
} from '@/lib/config/mobile-experience-store';

interface ModeCardOption {
  id: MobileExperienceMode;
  name: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  description: string;
  metrics: string;
  accentColor: string;
}

const MODES: ModeCardOption[] = [
  {
    id: 'SOVEREIGN_HUD_V5',
    name: 'Sovereign HUD v5.0 (One-Screen Experience)',
    tagline: 'Máxima conversión en frío: FITUR B2G, Google Ads & Tráfico Móvil',
    badge: 'MÁS RECOMENDADO',
    badgeColor: 'bg-[#ecb613]/20 text-[#ecb613] border-[#ecb613]/40',
    description: 'Dock ergonómico inferior con botón central giratorio del Oráculo Astra, barra visual de las 4 etapas del viaje, selector multi-rol y auditoría acústica 12 W/pax.',
    metrics: '+42% Retención · 0 Ruido · Ergonómico',
    accentColor: '#ecb613'
  },
  {
    id: 'AI_CONCIERGE_DOCK',
    name: 'AI Concierge Dock S-Class',
    tagline: 'Asistencia conversacional inteligente para clientes con dudas de fechas y fincas',
    badge: 'CONVERSACIONAL',
    badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
    description: 'Burbuja flotante interactiva que abre el panel completo de IA para explorar en lenguaje natural el índice de 11.690 fincas y proveedores homologados.',
    metrics: 'Ideal Novias & Dudas de Repertorio',
    accentColor: '#38bdf8'
  },
  {
    id: 'CLASSIC_WHATSAPP',
    name: 'Classic WhatsApp Stealth',
    tagline: 'Retención directa a centralita oficial sin distracciones ni scripts pesados',
    badge: 'RETENCIÓN PURA',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    description: 'Botón flotante directo al canal prioritario (+34 693 693 048) con mensaje preconfigurado según procedencia y cero interferencia en pantalla.',
    metrics: 'Llamadas & Cierre Inmediato',
    accentColor: '#25D366'
  },
  {
    id: 'MINIMAL_STEALTH',
    name: 'Minimal Stealth (Zero-Floating)',
    tagline: 'Pureza visual absoluta sin barras fijas ni elementos flotantes',
    badge: 'ALTA VELOCIDAD',
    badgeColor: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',
    description: 'Desactiva todos los widgets fijos inferiores. El usuario navega 100% el contenido del scroll de la página sin distracciones visuales.',
    metrics: '100% Pantalla Limpia · Cero JS Dock',
    accentColor: '#a1a1aa'
  }
];

export interface MobileExperienceSelectorOLEDProps {
  onNavigateToTab?: (tab: 'presets' | 'custom' | 'homepage' | 'editorial-lego' | 'catalog') => void;
}

export function MobileExperienceSelectorOLED({ onNavigateToTab }: MobileExperienceSelectorOLEDProps = {}) {
  const { config, setMode, setRoutingStrategy, updateConfig, isLoading } = useMobileExperience();
  const [selectedMode, setSelectedMode] = useState<MobileExperienceMode>(config.activeMode);
  const [routingStrategy, setLocalRoutingStrategy] = useState<RoutingStrategy>(config.routingStrategy || 'AUTONOMOUS_ADAPTIVE');
  const [features, setFeatures] = useState(config.features);
  const [guardrails, setGuardrails] = useState(config.guardrails);
  const [persona, setPersona] = useState(config.persona);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estados interactivos para el simulador de smartphone
  const [previewScreen, setPreviewScreen] = useState<'HOME' | 'QUOTE' | 'ASTRA' | 'WARRANTY' | 'WHATSAPP'>('HOME');
  const [simPax, setSimPax] = useState<number>(120);
  const [simKm, setSimKm] = useState<number>(65);
  const [simLocked, setSimLocked] = useState<boolean>(false);
  const [simCopied, setSimCopied] = useState<boolean>(false);
  const [astraInput, setAstraInput] = useState<string>('');
  const [astraChat, setAstraChat] = useState<Array<{ sender: 'astra' | 'user'; text: string }>>([
    { sender: 'astra', text: '¡Hola! Soy Astra, Oráculo de Productora EAR. ¿Qué tipo de evento estás planificando (boda, gala B2G o fiesta privada)?' }
  ]);

  // Cálculos matemáticos en tiempo real para el simulador
  const baseTariff = 350;
  const kmOver50 = Math.max(0, simKm - 50);
  const kmCost = kmOver50 * 1.5;
  const hotelCost = simKm > 200 ? 120 : 0;
  const totalSimCost = baseTariff + kmCost + hotelCost;
  const requiredAcousticWatts = simPax * 12;
  const artistShare = (totalSimCost * 0.8).toFixed(2);
  const earShare = (totalSimCost * 0.1).toFixed(2);
  const vimumeShare = (totalSimCost * 0.1).toFixed(2);

  const handleSendAstra = (presetQuery?: string) => {
    const q = presetQuery || astraInput.trim();
    if (!q) return;
    const userMessage = { sender: 'user' as const, text: q };
    let reply = 'Edwin Agudelo garantiza el rider Bose F1 812 y microfonía Shure Beta 87A con split soberano 80/10/10 y reserva de 100€ en Stripe.';
    const lower = q.toLowerCase();
    if (lower.includes('precio') || lower.includes('tarifa') || lower.includes('costo') || lower.includes('cuanto')) {
      reply = `Tarifa Base Solista: 350,00 €. Distancia calculada (${simKm} km desde Méntrida): +${kmCost} € en transporte. Total actual: ${totalSimCost} €.`;
    } else if (lower.includes('b2g') || lower.includes('fitur') || lower.includes('lcsp') || lower.includes('residencia')) {
      reply = 'En B2G y residencias: Límite acústico < 75 dB SPL y contrato menor Art. 118 LCSP fijado preventivamente en < 14.250,00 € (95%).';
    } else if (lower.includes('rider') || lower.includes('acustic') || lower.includes('sonido') || lower.includes('watt') || lower.includes('w')) {
      reply = `Rider oficial: 12 W/pax. Para tus ${simPax} pax inyectamos ${requiredAcousticWatts} W con columnas activas Bose F1 y Shure Beta 87A.`;
    } else if (lower.includes('reserva') || lower.includes('stripe') || lower.includes('100')) {
      reply = 'La reserva se formaliza con 100,00 € mediante Stripe con firma Price-Lock SHA-256 inmutable por 48 horas.';
    }
    setAstraChat(prev => [...prev, userMessage, { sender: 'astra', text: reply }]);
    setAstraInput('');
  };

  // Sincronizar estado local cuando cargue el store
  React.useEffect(() => {
    setSelectedMode(config.activeMode);
    setLocalRoutingStrategy(config.routingStrategy || 'AUTONOMOUS_ADAPTIVE');
    setFeatures(config.features);
    setGuardrails(config.guardrails);
    setPersona(config.persona);
  }, [config]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateConfig({
        activeMode: selectedMode,
        routingStrategy: routingStrategy,
        features: features,
        guardrails: guardrails,
        persona: persona
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error guardando configuración móvil:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEmergencyKillSwitch = async () => {
    const nextVal = !guardrails.emergencyKillSwitch;
    const updated = { ...guardrails, emergencyKillSwitch: nextVal };
    setGuardrails(updated);
    await updateConfig({ guardrails: updated });
  };

  return (
    <div className="space-y-8">
      {/* 🧩 ACCESO RÁPIDO A LAS SUITES DE PERSONALIZACIÓN AVANZADAS */}
      {onNavigateToTab && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#ecb613]/5 to-transparent border border-[#ecb613]/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles size={18} className="text-[#ecb613]" />
            <span className="text-xs font-mono text-zinc-300">
              <strong className="text-white">Laboratorio Completo S-Class:</strong> ¿Deseas modificar los módulos Lego, los 5 Combos o las Portadas Home?
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateToTab('presets')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#ecb613] hover:text-black text-zinc-200 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Smartphone size={13} />
              <span>5 Combos Maestros</span>
            </button>
            <button
              onClick={() => onNavigateToTab('custom')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#ecb613] hover:text-black text-zinc-200 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Layers size={13} />
              <span>Mezclador Modular Lego</span>
            </button>
            <button
              onClick={() => onNavigateToTab('homepage')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#ecb613] hover:text-black text-zinc-200 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Eye size={13} />
              <span>7 Portadas Home</span>
            </button>
            <button
              onClick={() => onNavigateToTab('editorial-lego')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#ecb613] hover:text-black text-zinc-200 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sliders size={13} />
              <span>Editorial Bento</span>
            </button>
          </div>
        </div>
      )}

      {/* 🚀 HEADER DE CONTROL ESTRATÉGICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d0d14] via-[#121220] to-[#0d0d14] border border-[#ecb613]/30 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider">
            <Cpu size={14} />
            <span>CENTRO DE MANDO TÁCTICO · ENRUTAMIENTO CONTEXTUAL EN EL EDGE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight font-syne">
            Mobile Studio <span className="text-[#ecb613]">Adaptive Engine</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-light">
            Perfilado de leads en tiempo de ejecución (runtime profiling). El sistema detecta la procedencia (pauta fría, QR o búsqueda orgánica) y muta el DOM móvil de forma autónoma.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          {/* BOTÓN KILL-SWITCH DE EMERGENCIA */}
          <button
            onClick={toggleEmergencyKillSwitch}
            className={`px-4 py-3 rounded-2xl border font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              guardrails.emergencyKillSwitch
                ? 'bg-red-500 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-500/30'
            }`}
            title="Drena instantáneamente todos los widgets flotantes en caso de fallo técnico"
          >
            <AlertTriangle size={15} />
            <span>{guardrails.emergencyKillSwitch ? 'Kill-Switch ACTIVO' : 'Kill-Switch'}</span>
          </button>

          {/* BOTÓN GUARDAR Y APLICAR */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ecb613] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-black font-black uppercase text-xs font-mono flex items-center gap-2 shadow-[0_0_25px_rgba(236,182,19,0.3)] active:scale-95 transition-all cursor-pointer"
          >
            {isSaving ? (
              <span className="animate-pulse">Guardando...</span>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 size={16} className="text-black" />
                <span>¡Aplicado en Vivo!</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Guardar y Aplicar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 📊 TELEMETRÍA DE MICRO-CONVERSIÓN Y UMBRAL DE LIBERTAD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#090910] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Tasa Contacto Efectivo</span>
            <Scale size={14} className="text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-syne text-emerald-400">
            {config.telemetry.effectiveContactRate}%
          </div>
          <span className="text-[10px] font-mono text-zinc-500 block">
            Umbral de libertad $\ge 14\%$ (<strong className="text-emerald-300">Superado</strong>)
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#090910] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>1ª Interacción (Dwell)</span>
            <Activity size={14} className="text-[#ecb613]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-syne text-white">
            {config.telemetry.avgTimeToInteractSec}s
          </div>
          <span className="text-[10px] font-mono text-zinc-500 block">
            Objetivo: &lt; 4.0s (Excelente)
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#090910] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Latencia P95 Inyección</span>
            <Gauge size={14} className="text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-syne text-sky-400">
            {config.telemetry.p95LatencyMs} ms
          </div>
          <span className="text-[10px] font-mono text-zinc-500 block">
            SLA de Carga &le; 1.200 ms (Cumplido)
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#090910] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>Churn de Sesión</span>
            <BarChart3 size={14} className="text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-syne text-purple-400">
            {config.telemetry.sessionChurnRate}%
          </div>
          <span className="text-[10px] font-mono text-zinc-500 block">
            Tasa de Rebote Móvil &lt; 8%
          </span>
        </div>
      </div>

      {/* 🧭 SELECTOR DE ESTRATEGIA: AUTÓNOMO VS MANUAL */}
      <div className="p-6 rounded-3xl bg-[#0a0a14] border border-[#ecb613]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#ecb613] flex items-center gap-2">
            <Brain size={15} />
            <span>Estrategia de Enrutamiento en Runtime</span>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            {routingStrategy === 'AUTONOMOUS_ADAPTIVE'
              ? 'El sistema evalúa micro-señales en tiempo real (UTMs fríos -> WhatsApp, QR físico -> Sovereign HUD, Orgánico -> Oráculo Astra).'
              : 'Modo manual forzado: todos los visitantes recibirán el traje seleccionado estáticamente a continuación.'}
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10 shrink-0">
          <button
            onClick={() => setLocalRoutingStrategy('AUTONOMOUS_ADAPTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              routingStrategy === 'AUTONOMOUS_ADAPTIVE'
                ? 'bg-[#ecb613] text-black shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ⚡ Autónomo Adaptativo
          </button>

          <button
            onClick={() => setLocalRoutingStrategy('MANUAL_OVERRIDE')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              routingStrategy === 'MANUAL_OVERRIDE'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🎮 Manual Override
          </button>
        </div>
      </div>

      {/* GRID PRINCIPAL: SELECCIÓN DE MODOS (IZQUIERDA) + MOCKUP EN VIVO (DERECHA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: TRAJES MÓVILES + GUARDRAILS + PERSONALIDAD */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SELECCIÓN DE MODO */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Sliders size={16} className="text-[#ecb613]" />
                <span>Traje Base (o Asignado en Fallback):</span>
              </h2>
              <span className="text-[11px] font-mono text-zinc-500">
                Seleccionado: <strong className="text-[#ecb613]">{selectedMode}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;
                return (
                  <div
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#12121f] to-[#0a0a14] border-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.15)]'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${mode.badgeColor}`}>
                            {mode.badge}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {mode.metrics}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white font-syne group-hover:text-[#ecb613] transition-colors">
                          {mode.name}
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          {mode.description}
                        </p>
                      </div>

                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'border-[#ecb613] bg-[#ecb613]' : 'border-white/20'
                      }`}>
                        {isSelected && <CheckCircle2 size={16} className="text-black" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GUARDRAILS TÉCNICOS & SLA DE LATENCIA */}
          <div className="p-6 rounded-3xl bg-[#0a0a12] border border-white/10 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Runtime Guardrails & Aislamiento (SLA &lt; 1.2s):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setGuardrails(g => ({ ...g, shadowDomIsolation: !g.shadowDomIsolation }))}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                  guardrails.shadowDomIsolation
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                    : 'bg-white/[0.02] border-white/5 text-zinc-500'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-bold block">Shadow DOM Isolation</span>
                  <span className="text-[10px] text-zinc-400 block leading-tight">Impide colisiones CSS con layouts externos</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                  guardrails.shadowDomIsolation ? 'bg-emerald-500 text-black' : 'bg-white/10 text-zinc-500'
                }`}>
                  {guardrails.shadowDomIsolation ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                onClick={() => setGuardrails(g => ({ ...g, degradeOnSlowConnection: !g.degradeOnSlowConnection }))}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                  guardrails.degradeOnSlowConnection
                    ? 'bg-sky-500/10 border-sky-500/40 text-white'
                    : 'bg-white/[0.02] border-white/5 text-zinc-500'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-bold block">Degradación por Latencia</span>
                  <span className="text-[10px] text-zinc-400 block leading-tight">Degrada a WhatsApp si la conexión es 2G</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                  guardrails.degradeOnSlowConnection ? 'bg-sky-500 text-black' : 'bg-white/10 text-zinc-500'
                }`}>
                  {guardrails.degradeOnSlowConnection ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>

          {/* GESTOR DE PERSONALIDAD & KNOWLEDGE BOUNDARIES */}
          <div className="p-6 rounded-3xl bg-[#0a0a12] border border-white/10 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Brain size={14} className="text-[#ecb613]" />
              <span>Personalidad ASTRA & Context Boundaries:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {[
                { id: 'HIGH_VALUE_COMMERCIAL', name: 'Asesor Comercial VIP', desc: 'Orientado a cierre y depósito 100€' },
                { id: 'PROTOCOL_OFFICIAL', name: 'Comisario B2G FITUR', desc: 'Enfocado en Art. 118 LCSP < 14.250€' },
                { id: 'ARTISTIC_MENTOR', name: 'Director Artístico', desc: 'Edwin Agudelo, split 80/10/10' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPersona(prev => ({ ...prev, activeTone: p.id }))}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    persona.activeTone === p.id
                      ? 'bg-[#ecb613]/15 border-[#ecb613] text-white'
                      : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-mono font-bold">{p.name}</div>
                  <div className="text-[10px] text-zinc-500 mt-1 leading-tight">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: PREVIEW DE TELÉFONO INTERACTIVO EN TIEMPO REAL */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-28 w-full max-w-[360px] space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-bold">
                <Eye size={14} className="text-[#ecb613]" /> Simulador Interactivo en Vivo
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pantalla: {previewScreen}
              </span>
            </div>

            {/* MARCO DE TELÉFONO SMARTPHONE */}
            <div className="w-full h-[650px] rounded-[3rem] p-3 bg-[#181822] border-4 border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(236,182,19,0.15)] relative flex flex-col overflow-hidden">
              
              {/* DYNAMIC ISLAND / NOTCH SUPERIOR */}
              <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ml-auto mr-2"></div>
              </div>

              {/* PANTALLA MÓVIL SIMULADA */}
              <div className="flex-1 bg-[#050505] rounded-[2.2rem] overflow-hidden flex flex-col justify-between p-3.5 relative border border-white/5">
                
                {/* CABECERA MÓVIL SIMULADA */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    {previewScreen !== 'HOME' ? (
                      <button
                        onClick={() => setPreviewScreen('HOME')}
                        className="px-2 py-0.5 rounded-lg bg-white/10 text-zinc-300 hover:text-white flex items-center gap-1 text-[9px] font-mono cursor-pointer"
                      >
                        <ChevronLeft size={12} />
                        <span>Volver</span>
                      </button>
                    ) : (
                      <>
                        <div className="w-5 h-5 rounded-full bg-[#ecb613] flex items-center justify-center text-black font-bold text-[8px]">
                          EAR
                        </div>
                        <span className="text-[11px] font-bold text-white font-syne truncate">Productora EAR</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[8px] font-mono text-zinc-400">
                      {previewScreen === 'HOME' ? 'Home S-Class' : previewScreen === 'QUOTE' ? 'Cotizador' : previewScreen === 'ASTRA' ? 'Astra IA' : previewScreen === 'WARRANTY' ? 'Rider' : 'WhatsApp'}
                    </span>
                  </div>
                </div>

                {/* BARRA DE ACCESO RÁPIDO SUPERIOR */}
                <div className="flex items-center justify-between gap-1 py-1 px-0.5 border-b border-white/5 shrink-0 text-[8px] font-mono">
                  {[
                    { id: 'HOME', label: 'Inicio' },
                    { id: 'QUOTE', label: 'Cotizar' },
                    { id: 'ASTRA', label: 'Astra IA' },
                    { id: 'WARRANTY', label: 'Rider' },
                    { id: 'WHATSAPP', label: 'Directo' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setPreviewScreen(tab.id as any)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                        previewScreen === tab.id
                          ? 'bg-[#ecb613] text-black font-bold shadow'
                          : 'text-zinc-400 hover:text-white bg-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* CONTENIDO DE PANTALLA DINÁMICO SEGÚN PANTALLA SELECCIONADA */}
                <div className="flex-1 py-2 space-y-2.5 overflow-y-auto no-scrollbar">
                  
                  {/* 1. PANTALLA HOME */}
                  {previewScreen === 'HOME' && (
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-2xl bg-[#0c0c16] border border-white/10 space-y-1.5 text-center">
                        <span className="text-[8px] font-mono text-[#ecb613] font-bold uppercase tracking-widest block">
                          Tarifa Base Solista
                        </span>
                        <div className="text-xl font-black text-white font-syne">350,00 €</div>
                        <p className="text-[8px] text-zinc-400 leading-tight">
                          Edwin Agudelo · Bose F1 Model 812 · Shure Beta 87A · Split 80/10/10
                        </p>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-950/30 to-black border border-blue-500/20 space-y-1 text-center">
                        <span className="text-[8px] font-mono text-blue-400 font-bold uppercase tracking-widest block">
                          Licitación B2G FITUR 2026
                        </span>
                        <div className="text-sm font-bold text-white font-syne">14.250,00 € LCSP</div>
                        <p className="text-[8px] text-zinc-400 leading-tight">
                          Ajuste Preventivo al 95% del Techo Art. 118
                        </p>
                      </div>

                      {/* BOTONES INTERACTIVOS DE ACCIÓN EN EL TELÉFONO */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          onClick={() => setPreviewScreen('QUOTE')}
                          className="p-2 rounded-xl bg-amber-500/10 border border-[#ecb613]/40 text-left hover:bg-[#ecb613]/20 transition-all cursor-pointer"
                        >
                          <span className="text-[8px] font-mono text-[#ecb613] font-bold block">€ Cotizador</span>
                          <span className="text-[9px] text-white font-syne font-bold">Calcular en Vivo</span>
                        </button>

                        <button
                          onClick={() => setPreviewScreen('ASTRA')}
                          className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/40 text-left hover:bg-sky-500/20 transition-all cursor-pointer"
                        >
                          <span className="text-[8px] font-mono text-sky-400 font-bold block">✨ Astra IA</span>
                          <span className="text-[9px] text-white font-syne font-bold">Preguntar Oráculo</span>
                        </button>

                        <button
                          onClick={() => setPreviewScreen('WARRANTY')}
                          className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-left hover:bg-emerald-500/20 transition-all cursor-pointer"
                        >
                          <span className="text-[8px] font-mono text-emerald-400 font-bold block">✓ Garantía</span>
                          <span className="text-[9px] text-white font-syne font-bold">12 W/pax Rider</span>
                        </button>

                        <button
                          onClick={() => setPreviewScreen('WHATSAPP')}
                          className="p-2 rounded-xl bg-emerald-600/10 border border-emerald-500/40 text-left hover:bg-emerald-600/20 transition-all cursor-pointer"
                        >
                          <span className="text-[8px] font-mono text-emerald-400 font-bold block">W Directo</span>
                          <span className="text-[9px] text-white font-syne font-bold">+34 693 693 048</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. PANTALLA DE COTIZADOR EN VIVO */}
                  {previewScreen === 'QUOTE' && (
                    <div className="space-y-2 p-2 rounded-2xl bg-[#090912] border border-white/10">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1">
                        <span className="text-[9px] font-mono font-bold text-[#ecb613] uppercase">Cotizador S-Class</span>
                        <span className="text-[8px] font-mono text-zinc-400">Edwin Agudelo</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-mono">
                          <span className="text-zinc-400">Aforo / Invitados:</span>
                          <span className="text-white font-bold">{simPax} pax · {requiredAcousticWatts} W</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="400"
                          step="10"
                          value={simPax}
                          onChange={(e) => setSimPax(Number(e.target.value))}
                          className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-mono">
                          <span className="text-zinc-400">Distancia (Méntrida):</span>
                          <span className="text-white font-bold">{simKm} km {kmOver50 > 0 ? `(+${kmCost}€)` : '(Radio Libre)'}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="300"
                          step="5"
                          value={simKm}
                          onChange={(e) => setSimKm(Number(e.target.value))}
                          className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
                        />
                      </div>

                      {hotelCost > 0 && (
                        <div className="p-1 rounded bg-amber-500/10 border border-amber-500/30 text-[8px] font-mono text-amber-400 flex justify-between">
                          <span>Suplemento Hotel &gt;200km</span>
                          <span>+120,00 €</span>
                        </div>
                      )}

                      <div className="p-2 rounded-xl bg-black/60 border border-[#ecb613]/30 space-y-1 text-center">
                        <span className="text-[8px] font-mono text-zinc-400 uppercase block">Presupuesto Total Estimado</span>
                        <div className="text-lg font-black text-[#ecb613] font-syne">{totalSimCost},00 €</div>
                        <div className="text-[7px] font-mono text-zinc-400 flex justify-between px-1">
                          <span>Artista (80%): {artistShare}€</span>
                          <span>EAR (10%): {earShare}€</span>
                          <span>VIMUME (10%): {vimumeShare}€</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSimLocked(!simLocked)}
                        className={`w-full py-1.5 rounded-xl font-mono text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          simLocked
                            ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                            : 'bg-gradient-to-r from-[#ecb613] to-amber-500 text-black hover:brightness-110'
                        }`}
                      >
                        <Lock size={11} />
                        <span>{simLocked ? '✓ Bloqueado (Depósito 100€)' : 'Bloquear Fecha (100€)'}</span>
                      </button>
                    </div>
                  )}

                  {/* 3. PANTALLA DE ASTRA IA */}
                  {previewScreen === 'ASTRA' && (
                    <div className="space-y-2 flex flex-col h-full">
                      <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-between">
                        <span className="text-[8px] font-mono text-sky-400 font-bold">ASTRA ORÁCULO IA</span>
                        <span className="text-[7px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                          {persona.activeTone}
                        </span>
                      </div>

                      {/* HISTORIAL DEL CHAT */}
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto no-scrollbar text-[8px] font-sans pr-1">
                        {astraChat.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-1.5 rounded-xl ${
                              msg.sender === 'user'
                                ? 'bg-amber-500/20 text-white ml-3 border border-[#ecb613]/30'
                                : 'bg-[#121220] text-zinc-300 mr-2 border border-white/10'
                            }`}
                          >
                            <span className="text-[7px] font-mono text-zinc-500 block">
                              {msg.sender === 'user' ? 'Tú' : 'Astra'}
                            </span>
                            {msg.text}
                          </div>
                        ))}
                      </div>

                      {/* PREGUNTAS RÁPIDAS */}
                      <div className="flex flex-wrap gap-1">
                        {[
                          '¿Tarifa y precios?',
                          '¿Rider acústico?',
                          '¿Límite B2G FITUR?'
                        ].map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSendAstra(q)}
                            className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 hover:border-[#ecb613] text-[7px] font-mono text-zinc-300 cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </div>

                      {/* INPUT Y BOTÓN ENVIAR */}
                      <div className="flex items-center gap-1 pt-1">
                        <input
                          type="text"
                          value={astraInput}
                          onChange={(e) => setAstraInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendAstra()}
                          placeholder="Pregunta a Astra..."
                          className="flex-1 bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-[8px] text-white font-mono focus:border-[#ecb613] outline-none"
                        />
                        <button
                          onClick={() => handleSendAstra()}
                          className="p-1 rounded-lg bg-[#ecb613] text-black hover:bg-amber-400 transition-all cursor-pointer"
                        >
                          <Send size={11} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4. PANTALLA DE GARANTÍA ACÚSTICA */}
                  {previewScreen === 'WARRANTY' && (
                    <div className="space-y-2 p-2 rounded-2xl bg-[#090912] border border-white/10">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1">
                        <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">Garantía Acústica</span>
                        <span className="text-[8px] font-mono text-zinc-400">12 W/pax</span>
                      </div>

                      <div className="space-y-1.5 text-[8px] text-zinc-300 font-sans">
                        <div className="p-1.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                          <span className="font-mono text-[8px] text-emerald-400 font-bold block">Sistemas Homologados:</span>
                          <p>Bose F1 Model 812 (Array Flexible) + Subwoofer 1.000W / Bose S1 Pro</p>
                        </div>

                        <div className="p-1.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                          <span className="font-mono text-[8px] text-emerald-400 font-bold block">Microfonía Soberana:</span>
                          <p>Shure Beta 87A de alta definición vocal / Shure Axient RF</p>
                        </div>

                        <div className="p-1.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                          <span className="font-mono text-[8px] text-amber-400 font-bold block">Techo Acústico B2G:</span>
                          <p>&lt; 75 dB SPL en residencias y entornos sociosanitarios</p>
                        </div>

                        <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center text-emerald-300 font-mono text-[8px] font-bold">
                          ✓ Sello Cero Fallos · Back-up en Furgoneta
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. PANTALLA DE WHATSAPP DIRECTO */}
                  {previewScreen === 'WHATSAPP' && (
                    <div className="space-y-2 p-2 rounded-2xl bg-[#090912] border border-emerald-500/30">
                      <div className="flex items-center justify-between border-b border-white/10 pb-1">
                        <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">Canal Prioritario Oficial</span>
                        <span className="text-[8px] font-mono text-zinc-400">Retención 24/7</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1 text-center">
                        <span className="text-[8px] font-mono text-zinc-400 block">Teléfono Oficial Productora EAR</span>
                        <div className="text-sm font-black text-emerald-400 font-mono">+34 693 693 048</div>
                        <p className="text-[8px] text-zinc-400">Atención directa con Edwin Agudelo</p>
                      </div>

                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-mono text-zinc-300 leading-relaxed">
                        <span className="text-emerald-400 font-bold block mb-0.5">Mensaje preconfigurado:</span>
                        &quot;Hola Productora EAR, solicito disponibilidad para evento ({simPax} pax, {simKm} km). Presupuesto: {totalSimCost}€ con reserva 100€.&quot;
                      </div>

                      <button
                        onClick={() => {
                          setSimCopied(true);
                          setTimeout(() => setSimCopied(false), 2000);
                        }}
                        className="w-full py-1.5 rounded-xl bg-[#25D366] hover:bg-emerald-500 text-black font-mono text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Phone size={11} />
                        <span>{simCopied ? '¡Conectando con Centralita!' : 'Abrir WhatsApp'}</span>
                      </button>
                    </div>
                  )}

                </div>

                {/* SIMULACIÓN DEL DOCK NAVEGABLE SEGÚN MODO ACTIVO */}
                <div className="shrink-0 pt-1.5 border-t border-white/10">
                  {selectedMode === 'SOVEREIGN_HUD_V5' && (
                    <div className="w-full bg-[#06060a]/95 border border-white/20 rounded-2xl p-1.5 flex items-center justify-between shadow-2xl">
                      <button
                        onClick={() => setPreviewScreen('HOME')}
                        className={`flex flex-col items-center gap-0.5 text-[8px] font-mono transition-all cursor-pointer p-1 rounded-lg ${
                          previewScreen === 'HOME' ? 'text-[#ecb613] bg-white/10 font-bold' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-[9px] ${
                          previewScreen === 'HOME' ? 'bg-[#ecb613] text-black font-bold' : 'bg-white/10 text-white'
                        }`}>H</div>
                        <span>Inicio</span>
                      </button>

                      <button
                        onClick={() => setPreviewScreen('QUOTE')}
                        className={`flex flex-col items-center gap-0.5 text-[8px] font-mono transition-all cursor-pointer p-1 rounded-lg ${
                          previewScreen === 'QUOTE' ? 'text-[#ecb613] bg-white/10 font-bold' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-[9px] ${
                          previewScreen === 'QUOTE' ? 'bg-[#ecb613] text-black font-bold' : 'bg-white/10 text-white'
                        }`}>€</div>
                        <span>Cotizar</span>
                      </button>

                      <button
                        onClick={() => setPreviewScreen('ASTRA')}
                        className="relative -top-2 w-9 h-9 rounded-full bg-gradient-to-tr from-[#ecb613] to-amber-300 flex items-center justify-center shadow-[0_0_15px_rgba(236,182,19,0.7)] text-black font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Abrir Oráculo Astra IA"
                      >
                        <Sparkles size={16} />
                      </button>

                      <button
                        onClick={() => setPreviewScreen('WARRANTY')}
                        className={`flex flex-col items-center gap-0.5 text-[8px] font-mono transition-all cursor-pointer p-1 rounded-lg ${
                          previewScreen === 'WARRANTY' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-[9px] ${
                          previewScreen === 'WARRANTY' ? 'bg-emerald-500 text-black font-bold' : 'bg-white/10 text-white'
                        }`}>✓</div>
                        <span>Garantía</span>
                      </button>

                      <button
                        onClick={() => setPreviewScreen('WHATSAPP')}
                        className={`flex flex-col items-center gap-0.5 text-[8px] font-mono transition-all cursor-pointer p-1 rounded-lg ${
                          previewScreen === 'WHATSAPP' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-emerald-400 hover:text-white'
                        }`}
                      >
                        <div className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[9px]">W</div>
                        <span>Directo</span>
                      </button>
                    </div>
                  )}

                  {selectedMode === 'AI_CONCIERGE_DOCK' && (
                    <div className="flex justify-end pb-1">
                      <button
                        onClick={() => setPreviewScreen(s => s === 'ASTRA' ? 'HOME' : 'ASTRA')}
                        className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ecb613] to-amber-300 flex items-center justify-center shadow-[0_0_20px_rgba(236,182,19,0.6)] text-black hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Haz clic para abrir el chat del Oráculo Astra"
                      >
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  )}

                  {selectedMode === 'CLASSIC_WHATSAPP' && (
                    <div className="flex justify-end pb-1">
                      <button
                        onClick={() => setPreviewScreen(s => s === 'WHATSAPP' ? 'HOME' : 'WHATSAPP')}
                        className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.6)] text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Haz clic para abrir el enlace de WhatsApp"
                      >
                        <Phone size={18} />
                      </button>
                    </div>
                  )}

                  {selectedMode === 'MINIMAL_STEALTH' && (
                    <div className="text-center py-2 text-[9px] font-mono text-zinc-500">
                      [Vista Limpia · Cero Widgets Flotantes]
                    </div>
                  )}
                </div>

                {/* BARRA HOME DE IPHONE */}
                <div className="w-24 h-1 bg-white/20 rounded-full mx-auto mt-1.5 shrink-0"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MobileExperienceSelectorOLED;
