'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Brain, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight, 
  Microscope,
  Zap,
  Ear,
  Layers,
  BarChart3,
  Speaker
} from 'lucide-react';
import { VIMUME_CLINICAL_SSOT } from '@/lib/constants/vimume-clinical-ssot';
import { VimumeAcousticEngine } from '@/components/vimume/VimumeAcousticEngine';
import { ClinicalMetricsChart } from '@/components/vimume/ClinicalMetricsChart';

export function VimumeBovedaEvidencia() {
  const [selectedMetric, setSelectedMetric] = useState<number>(0);

  return (
    <div className="space-y-12" data-observe-concierge id="seccion-evidencia" data-proactive-zone="evidencia">
      
      {/* CABECERA BENTO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-[#8b5cf6] text-[10px] font-mono tracking-widest uppercase font-bold">
            <Microscope size={13} />
            <span>NEUROCIENCIA APLICADA // PROTOCOLO DE INTERVENCIÓN CLÍNICA</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white font-syne tracking-tight">
            Bóveda de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-[#AAD6CD] to-[#ecb613]">Evidencia Clínica</span>
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl font-light">
            VIMUME no es animación geriátrica pasiva. Es una intervención acústica de precisión con evidencia cuantitativa (N = 45, <strong className="text-white">p &lt; 0.05</strong>) y control de presión neurosensorial estricto (<strong className="text-white">&lt; 75 dB SPL</strong>).
          </p>
        </div>

        {/* BADGE DE ACREDITACIÓN */}
        <div className="bg-black/60 border border-emerald-500/30 px-4 py-3 rounded-2xl flex items-center gap-3 w-fit">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="text-left">
            <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold block">Estatus de Evidencia</span>
            <span className="text-xs font-mono font-bold text-white">Nivel I-B • Ensayos Piloto Homologados</span>
          </div>
        </div>
      </div>

      {/* 🚀 1. MOTOR NEUROACÚSTICO MULTIHILO EN TIEMPO REAL (AudioWorklet & Canvas 60 FPS) */}
      <div className="space-y-4">
        <VimumeAcousticEngine />
      </div>

      {/* 📊 2. DASHBOARD CLÍNICO INTERACTIVO (RECHARTS N=45) */}
      <div className="space-y-4">
        <ClinicalMetricsChart />
      </div>

      {/* 🏛️ 3. BENTO GRID DE PROTOCOLO Y LÍMITES ACÚSTICOS BOSE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* PANEL 1: LA CIENCIA MIT PICOWER (6 COLS) */}
        <div className="md:col-span-6 rounded-[2rem] bg-gradient-to-br from-[#0e0c1a] via-[#07060d] to-black border border-[#8b5cf6]/40 p-6 sm:p-8 space-y-6 relative overflow-hidden group shadow-[0_0_50px_rgba(139,92,246,0.1)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8b5cf6]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-[#8b5cf6]">
              <Brain size={24} />
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 uppercase font-bold">
              Picower Institute (MIT) Protocol
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#AAD6CD] font-bold block">
              SINCRONIZACIÓN NEURAL COHERENTE
            </span>
            <h3 className="text-2xl font-black text-white font-syne uppercase">
              Ondas Gamma 40 Hz: Activación de Microglía
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              El pulso armónico a 40 Hz no solo evoca recuerdos; activa mecánicamente la microglía cerebral, induciendo un aclaramiento de placas <strong className="text-white">beta-amiloides</strong> y reduciendo la inflamación sináptica en el córtex auditivo y el hipocampo.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-zinc-500 block">Microglía</span>
              <span className="text-emerald-400 font-bold">+52% Activa</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-zinc-500 block">Red DMN</span>
              <span className="text-[#8b5cf6] font-bold">Resonancia</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-zinc-500 block">Tau Hiperfosf.</span>
              <span className="text-[#AAD6CD] font-bold">-34% Carga</span>
            </div>
          </div>
        </div>

        {/* PANEL 2: TECHO ACÚSTICO BOSE & ANTI-RECLUTAMIENTO (< 75 DB SPL) (6 COLS) */}
        <div className="md:col-span-6 rounded-[2rem] bg-gradient-to-br from-[#120f08] via-[#0a0805] to-black border border-[#ecb613]/40 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(236,182,19,0.08)]">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/20 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613]">
              <Ear size={24} />
            </div>
            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-mono text-red-400 uppercase font-bold">
              Barrera Anti-Reclutamiento Coclear
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] font-bold block">
              SEGURIDAD AUDIOLÓGICA GERIÁTRICA
            </span>
            <h3 className="text-2xl font-black text-white font-syne uppercase">
              Rider Bose (12 W/pax) & Límite &lt; 75 dB SPL
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              La presbiacusia reduce el rango dinámico auditivo: un nivel superior a 78 dB causa dolor y confusión sensorial inmediata en pacientes con audífonos. VIMUME opera con columnas Bose S1 Pro / F1 812 en dispersión ultra-amplia, limitación por hardware DSP Behringer XR18 y sonometría continua.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <ShieldCheck size={20} className="text-[#ecb613] shrink-0" />
            <span className="text-[11px] text-zinc-300 leading-snug">
              Despliegue distribuido de fuentes acústicas para evitar &quot;puntos calientes&quot;: presión sonora homogénea de ±1.5 dB en todo el salón residencial.
            </span>
          </div>
        </div>

        {/* PANEL 3: VENTANA DE REMINISCENCIA (1940-1970) (12 COLS) */}
        <div className="md:col-span-12 rounded-[2rem] bg-gradient-to-br from-[#120c18] via-[#09060c] to-black border border-pink-500/30 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <Sparkles size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold block">
                  NEURO-ARQUEOLOGÍA SONORA
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-syne uppercase">
                  Ventana de Reminiscencia Autobiográfica Preservada
                </h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-[10px] font-mono text-pink-400 uppercase font-bold w-fit">
              Circuitos Temporales Mediales
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-4xl">
            La huella musical forjada entre los 15 y 25 años de vida reside en circuitos temporales mediales protegidos contra la atrofia inicial de la enfermedad de Alzheimer. Recuperamos coplas, boleros y temas icónicos de posguerra que reactivan el habla y la identidad personal en sesiones estrictamente limitadas a 45-50 minutos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-pink-400 font-bold block uppercase">Copla & Pasodoble</span>
              <h4 className="text-xs font-bold text-white font-syne">Concha Piquer, Antonio Molina</h4>
              <p className="text-[11px] text-zinc-400 leading-tight">Anclaje de raíz cultural, orgullo e historia compartida.</p>
            </div>
            <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] font-bold block uppercase">Mariachi Terapéutico</span>
              <h4 className="text-xs font-bold text-white font-syne">Amor Eterno, El Rey</h4>
              <p className="text-[11px] text-zinc-400 leading-tight">Guitarrón marcando la cadencia rítmica subyacente.</p>
            </div>
            <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-[#AAD6CD] font-bold block uppercase">Bolero Íntimo</span>
              <h4 className="text-xs font-bold text-white font-syne">Bésame Mucho, Dos Gardenias</h4>
              <p className="text-[11px] text-zinc-400 leading-tight">Reconexión afectiva con cónyuges y familiares.</p>
            </div>
            <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-[#8b5cf6] font-bold block uppercase">Duración Calibrada</span>
              <h4 className="text-xs font-bold text-white font-syne">45 a 50 Minutos Máximo</h4>
              <p className="text-[11px] text-zinc-400 leading-tight">Protección absoluta contra la fatiga cognitiva.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
