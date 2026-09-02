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
  Scale
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

export function MobileExperienceSelectorOLED() {
  const { config, setMode, setRoutingStrategy, updateConfig, isLoading } = useMobileExperience();
  const [selectedMode, setSelectedMode] = useState<MobileExperienceMode>(config.activeMode);
  const [routingStrategy, setLocalRoutingStrategy] = useState<RoutingStrategy>(config.routingStrategy || 'AUTONOMOUS_ADAPTIVE');
  const [features, setFeatures] = useState(config.features);
  const [guardrails, setGuardrails] = useState(config.guardrails);
  const [persona, setPersona] = useState(config.persona);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
          <div className="sticky top-28 w-full max-w-[340px] space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-bold">
                <Eye size={14} className="text-[#ecb613]" /> Vista Previa del Visitante
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Score: 88 (Lead Caliente)
              </span>
            </div>

            {/* MARCO DE TELÉFONO SMARTPHONE */}
            <div className="w-full h-[620px] rounded-[3rem] p-3 bg-[#181822] border-4 border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(236,182,19,0.1)] relative flex flex-col overflow-hidden">
              
              {/* DYNAMIC ISLAND / NOTCH SUPERIOR */}
              <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ml-auto mr-2"></div>
              </div>

              {/* PANTALLA MÓVIL SIMULADA */}
              <div className="flex-1 bg-[#050505] rounded-[2.2rem] overflow-hidden flex flex-col justify-between p-4 relative border border-white/5">
                
                {/* CABECERA MÓVIL SIMULADA */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#ecb613] p-0.5 flex items-center justify-center text-black font-bold text-[9px]">
                      EAR
                    </div>
                    <span className="text-xs font-bold text-white font-syne">Productora EAR</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500">Méntrida (Toledo)</span>
                </div>

                {/* CONTENIDO PRINCIPAL DE PANTALLA */}
                <div className="flex-1 py-4 space-y-3 overflow-y-auto no-scrollbar">
                  <div className="p-3 rounded-2xl bg-[#0c0c16] border border-white/10 space-y-1.5 text-center">
                    <span className="text-[8px] font-mono text-[#ecb613] font-bold uppercase tracking-widest block">
                      Tarifa Base Solista
                    </span>
                    <div className="text-xl font-black text-white font-syne">350,00 €</div>
                    <p className="text-[9px] text-zinc-400 leading-tight">
                      Bose F1 Model 812 · Shure Beta 87A · Split 80/10/10
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-950/30 to-black border border-blue-500/20 space-y-1 text-center">
                    <span className="text-[8px] font-mono text-blue-400 font-bold uppercase tracking-widest block">
                      Licitación B2G FITUR 2026
                    </span>
                    <div className="text-sm font-bold text-white font-syne">14.250,00 € LCSP</div>
                    <p className="text-[8px] text-zinc-400 leading-tight">
                      Edwin Agudelo E-Manager · 8 Mentorías Diáspora
                    </p>
                  </div>
                </div>

                {/* SIMULACIÓN DEL DOCK SEGÚN MODO ACTIVO */}
                <div className="shrink-0 pt-2">
                  {selectedMode === 'SOVEREIGN_HUD_V5' && (
                    <div className="w-full bg-[#06060a]/95 border border-white/20 rounded-2xl p-2 flex items-center justify-between shadow-2xl">
                      <div className="flex flex-col items-center gap-0.5 text-zinc-400 text-[8px] font-mono">
                        <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-white text-[9px]">H</div>
                        <span>Inicio</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 text-zinc-400 text-[8px] font-mono">
                        <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-white text-[9px]">€</div>
                        <span>Cotizar</span>
                      </div>
                      <div className="relative -top-2 w-9 h-9 rounded-full bg-gradient-to-tr from-[#ecb613] to-amber-300 flex items-center justify-center shadow-[0_0_15px_rgba(236,182,19,0.7)] text-black font-bold">
                        <Sparkles size={16} />
                      </div>
                      <div className="flex flex-col items-center gap-0.5 text-zinc-400 text-[8px] font-mono">
                        <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-white text-[9px]">✓</div>
                        <span>Garantía</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 text-emerald-400 text-[8px] font-mono">
                        <div className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[9px]">W</div>
                        <span>Directo</span>
                      </div>
                    </div>
                  )}

                  {selectedMode === 'AI_CONCIERGE_DOCK' && (
                    <div className="flex justify-end pb-2">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ecb613] to-amber-300 flex items-center justify-center shadow-[0_0_20px_rgba(236,182,19,0.6)] text-black">
                        <MessageSquare size={18} />
                      </div>
                    </div>
                  )}

                  {selectedMode === 'CLASSIC_WHATSAPP' && (
                    <div className="flex justify-end pb-2">
                      <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.6)] text-white">
                        <Phone size={18} />
                      </div>
                    </div>
                  )}

                  {selectedMode === 'MINIMAL_STEALTH' && (
                    <div className="text-center py-2 text-[9px] font-mono text-zinc-500">
                      [Vista Limpia · Cero Widgets Flotantes]
                    </div>
                  )}
                </div>

                {/* BARRA HOME DE IPHONE */}
                <div className="w-24 h-1 bg-white/20 rounded-full mx-auto mt-2"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MobileExperienceSelectorOLED;
