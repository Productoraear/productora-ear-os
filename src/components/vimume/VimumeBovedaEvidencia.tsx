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
  BarChart3
} from 'lucide-react';
import { VIMUME_CLINICAL_SSOT, ClinicalStudyMetric } from '@/lib/constants/vimume-clinical-ssot';

export function VimumeBovedaEvidencia() {
  const [activeFrequencyTab, setActiveFrequencyTab] = useState<'40hz' | 'delta_theta' | 'beta'>('40hz');
  const [selectedMetric, setSelectedMetric] = useState<number>(0);

  return (
    <div className="space-y-10">
      
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

      {/* BENTO GRID MAESTRO (5 PANELES) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* PANEL 1: LA FRECUENCIA REINA 40 HZ GAMMA (7 COLS) */}
        <div className="md:col-span-7 rounded-[2rem] bg-gradient-to-br from-[#0e0c1a] via-[#07060d] to-black border border-[#8b5cf6]/40 p-6 sm:p-8 space-y-6 relative overflow-hidden group shadow-[0_0_50px_rgba(139,92,246,0.1)]">
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
            <h3 className="text-2xl sm:text-3xl font-black text-white font-syne uppercase">
              Ondas Gamma 40 Hz: Activación de Microglía
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              El pulso armónico a 40 Hz no solo evoca recuerdos; activa mecánicamente la microglía cerebral, induciendo un aclaramiento de placas <strong className="text-white">beta-amiloides</strong> y reduciendo la inflamación sináptica en el córtex auditivo y el hipocampo.
            </p>
          </div>

          {/* SIMULADOR OSCILATORIO INTERACTIVO */}
          <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-zinc-400">ESPECTRO DE RESONANCIA CEREBRAL:</span>
              <span className="text-[#8b5cf6] font-bold">40.00 HZ [GAMMA EXACTA]</span>
            </div>

            {/* ONDAS VISUALES SVG */}
            <div className="h-16 w-full flex items-center justify-center overflow-hidden bg-black/40 rounded-xl px-2">
              <svg className="w-full h-12" preserveAspectRatio="none" viewBox="0 0 400 60">
                <path
                  d="M0,30 Q10,5 20,30 T40,30 T60,30 T80,30 T100,30 T120,30 T140,30 T160,30 T180,30 T200,30 T220,30 T240,30 T260,30 T280,30 T300,30 T320,30 T340,30 T360,30 T380,30 T400,30"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
                <path
                  d="M0,30 Q10,15 20,30 T40,30 T60,30 T80,30 T100,30 T120,30 T140,30 T160,30 T180,30 T200,30 T220,30 T240,30 T260,30 T280,30 T300,30 T320,30 T340,30 T360,30 T380,30 T400,30"
                  fill="none"
                  stroke="#AAD6CD"
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                />
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                <span className="text-zinc-500 block">Microglía</span>
                <span className="text-emerald-400 font-bold">+52% Activa</span>
              </div>
              <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                <span className="text-zinc-500 block">Red DMN</span>
                <span className="text-[#8b5cf6] font-bold">Resonancia</span>
              </div>
              <div className="p-2 rounded bg-white/[0.02] border border-white/5">
                <span className="text-zinc-500 block">Tau Hiperfosf.</span>
                <span className="text-[#AAD6CD] font-bold">-34% Carga</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2: TECHO ACÚSTICO < 75 DB SPL (5 COLS) */}
        <div className="md:col-span-5 rounded-[2rem] bg-gradient-to-br from-[#120f08] via-[#0a0805] to-black border border-[#ecb613]/40 p-6 sm:p-8 space-y-5 relative overflow-hidden shadow-[0_0_50px_rgba(236,182,19,0.08)]">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/20 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613]">
              <Ear size={24} />
            </div>
            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-mono text-red-400 uppercase font-bold">
              Barrera Anti-Reclutamiento
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] font-bold block">
              SEGURIDAD AUDIOLÓGICA GERIÁTRICA
            </span>
            <h3 className="text-2xl font-black text-white font-syne uppercase">
              Límite Estricto: &lt; 75 dB SPL
            </h3>
            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              La presbiacusia reduce el rango dinámico auditivo: un nivel superior a 78 dB causa dolor y confusión sensorial inmediata en pacientes con audífonos. VIMUME opera con sonometría activa calibrada.
            </p>
          </div>

          <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Presión Sonora en Sala:</span>
              <span className="text-emerald-400 font-bold">68.4 dB SPL (ZONA VERDE)</span>
            </div>

            {/* MEDIDOR SPL VISUAL */}
            <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden relative">
              <div className="bg-gradient-to-r from-emerald-500 via-yellow-500 to-[#ecb613] h-full w-[70%]" />
              <div className="absolute right-[25%] top-0 bottom-0 w-0.5 bg-red-500" title="Corte 75 dB" />
            </div>

            <div className="flex justify-between text-[9px] font-mono text-zinc-500">
              <span>Silencio (30 dB)</span>
              <span className="text-emerald-400 font-bold">VIMUME (65-72 dB)</span>
              <span className="text-red-400 font-bold">LÍMITE (75 dB)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <ShieldCheck size={18} className="text-[#ecb613] shrink-0" />
            <span className="text-[11px] text-zinc-400 leading-snug">
              Prohibidos amplificadores descontrolados. Uso exclusivo de arreglos Bose S1 Pro / F1 812 a 12 W/pax.
            </span>
          </div>
        </div>

        {/* PANEL 3: COHORTE CLÍNICA N=45 (p < 0.05) (6 COLS) */}
        <div className="md:col-span-6 rounded-[2rem] bg-gradient-to-br from-[#081216] via-[#050b0e] to-black border border-[#AAD6CD]/40 p-6 sm:p-8 space-y-5">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-[#AAD6CD]/20 border border-[#AAD6CD]/40 flex items-center justify-center text-[#AAD6CD]">
              <BarChart3 size={24} />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#AAD6CD]/10 border border-[#AAD6CD]/30 text-[10px] font-mono text-[#AAD6CD] uppercase font-bold">
              Significación p &lt; 0.05
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#AAD6CD] font-bold block">
              VALIDACIÓN COHORTE N=45 (5 CENTROS)
            </span>
            <h3 className="text-2xl font-black text-white font-syne uppercase">
              Reducción de Agitación y Fármacos
            </h3>
            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              Métricas pre y post sesión registradas por equipos de terapia ocupacional y enfermería en personas con deterioro cognitivo moderado/severo (GDS 4-6).
            </p>
          </div>

          {/* SELECTOR DE MÉTRICAS */}
          <div className="space-y-2">
            {VIMUME_CLINICAL_SSOT.CLINICAL_TRIAL_RESULTS.map((metricItem, idx) => (
              <div 
                key={metricItem.metric}
                onClick={() => setSelectedMetric(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedMetric === idx
                    ? 'bg-[#AAD6CD]/15 border-[#AAD6CD] text-white'
                    : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span>{metricItem.metric}</span>
                  <span className="text-[#AAD6CD]">{metricItem.pValue}</span>
                </div>
                <div className="text-[11px] text-zinc-300 mt-1">{metricItem.clinicalSignificance}</div>
                <div className="text-[9px] text-zinc-500 font-mono mt-0.5">{metricItem.instrument}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL 4: VENTANA DE REMINISCENCIA (1940-1970) (6 COLS) */}
        <div className="md:col-span-6 rounded-[2rem] bg-gradient-to-br from-[#120c18] via-[#09060c] to-black border border-pink-500/30 p-6 sm:p-8 space-y-5">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Sparkles size={24} />
            </div>
            <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-[10px] font-mono text-pink-400 uppercase font-bold">
              Neuro-Arqueología Sonora
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold block">
              MEMORIA AUTOBIOGRÁFICA PRESERVADA
            </span>
            <h3 className="text-2xl font-black text-white font-syne uppercase">
              La Llave de los Recuerdos Primarios
            </h3>
            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              La huella musical forjada entre los 15 y 25 años de vida reside en circuitos temporales mediales protegidos. Recuperamos coplas, boleros y temas icónicos de posguerra que reactivan el habla y la identidad personal.
            </p>
          </div>

          {/* GÉNEROS Y REPERTORIO CURADO */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-black/50 border border-white/10 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-pink-400 font-bold block uppercase">Copla & Pasodoble</span>
              <h4 className="text-xs font-bold text-white">Concha Piquer, Antonio Molina</h4>
              <p className="text-[10px] text-zinc-400 leading-tight">Anclaje de raíz, orgullo e historia compartida.</p>
            </div>
            <div className="bg-black/50 border border-white/10 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] font-bold block uppercase">Mariachi Terapéutico</span>
              <h4 className="text-xs font-bold text-white">Amor Eterno, El Rey</h4>
              <p className="text-[10px] text-zinc-400 leading-tight">Guitarrón marcando los 40 Hz de cadencia rítmica.</p>
            </div>
            <div className="bg-black/50 border border-white/10 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#AAD6CD] font-bold block uppercase">Bolero Íntimo</span>
              <h4 className="text-xs font-bold text-white">Bésame Mucho, Dos Gardenias</h4>
              <p className="text-[10px] text-zinc-400 leading-tight">Reconexión afectiva con cónyuges y familiares.</p>
            </div>
            <div className="bg-black/50 border border-white/10 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#8b5cf6] font-bold block uppercase">Duración Calibrada</span>
              <h4 className="text-xs font-bold text-white">45 a 50 Minutos Máximo</h4>
              <p className="text-[10px] text-zinc-400 leading-tight">Protección contra el agotamiento atencional y fatiga.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
