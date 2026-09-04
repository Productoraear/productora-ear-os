'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Activity, 
  Calculator, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Layers, 
  FileText, 
  Building2, 
  Phone, 
  ArrowRight, 
  Volume2, 
  HelpCircle,
  Feather,
  CheckCircle2,
  Speaker,
  Cpu,
  Radio,
  Sliders
} from 'lucide-react';
import Link from 'next/link';
import { CENTRALITA } from '@/lib/phone-constants';
import { VimumeBovedaEvidencia } from '@/components/vimume/VimumeBovedaEvidencia';
import { MecenazgoFiscalCalculator } from '@/components/vimume/MecenazgoFiscalCalculator';
import { VimumeColibriNarrative } from '@/components/vimume/VimumeColibriNarrative';
import { VimumeRagFaqSection } from '@/components/vimume/VimumeRagFaqSection';
import { VimumeOntologyExplorer } from '@/features/vimume/ui/VimumeOntologyExplorer';
import { LiveSonometryGuard } from '@/components/vimume/LiveSonometryGuard';
import { AIConciergeProactive } from '@/components/neural/AIConciergeProactive';

type VimumeTabId = 'evidencia' | 'mecenazgo' | 'colibri' | 'sonometria' | 'ontologia' | 'b2g_concertacion';

const TABS: { id: VimumeTabId; label: string; icon: React.ElementType }[] = [
  { id: 'evidencia', label: 'Bóveda de Evidencia (40Hz)', icon: Brain },
  { id: 'mecenazgo', label: 'Calculadora Fiscal (80%)', icon: Calculator },
  { id: 'colibri', label: 'El Legado del Colibrí', icon: Feather },
  { id: 'sonometria', label: 'Sonometría (<75 dB)', icon: Volume2 },
  { id: 'ontologia', label: 'Ontología 100 Niveles & RAG', icon: Layers },
  { id: 'b2g_concertacion', label: 'Concertación B2G / LCSP', icon: Building2 }
];

export function VimumeClinicalPortal() {
  const [activeTab, setActiveTab] = useState<VimumeTabId>('evidencia');

  return (
    <div className="w-full space-y-12 relative">
      
      {/* 🌌 HERO SECTION ARISTOCRÁTICO TRUE BLACK */}
      <section className="relative rounded-[2.5rem] bg-[#050508] border border-white/10 p-6 sm:p-12 overflow-hidden shadow-[0_0_90px_rgba(139,92,246,0.1)]">
        {/* GLOW DE FONDO */}
        <div className="absolute -top-24 left-1/3 w-[500px] h-[500px] bg-[#8b5cf6]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-[400px] h-[400px] bg-[#ecb613]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          
          {/* BADGES METADATA */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/40 text-[#8b5cf6] text-[10px] font-mono tracking-widest uppercase font-bold">
              <Brain size={13} />
              <span>NODO 5 SSOT // PROYECTO VIMUME</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono tracking-widest uppercase font-bold">
              <Activity size={12} />
              <span>40 HZ GAMMA • N=45 (p &lt; 0.05)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono tracking-widest uppercase font-bold">
              <ShieldCheck size={12} />
              <span>&lt; 75 dB SPL CALIBRADO</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/40 text-[#ecb613] text-[10px] font-mono tracking-widest uppercase font-bold">
              <Sparkles size={12} />
              <span>LEY 49/2002 • 80% DEDUCCIÓN</span>
            </div>
          </div>

          {/* HEADLINE PRINCIPAL */}
          <div className="space-y-4 max-w-5xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[1.05]">
              Intervención Neuroacústica de Precisión y{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-[#AAD6CD] to-[#ecb613]">
                Mecenazgo de Alto Impacto
              </span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-3xl">
              Transformamos la estimulación para la tercera edad en un activo sociosanitario riguroso. Integramos la cadencia Gamma a 40 Hz, el control estricto de decibelios (&lt; 75 dB SPL) y el apalancamiento tributario de la Ley 49/2002 (Modelo 182 AEAT) para erradicar la agitación y reactivar memorias autobiográficas.
            </p>
          </div>

          {/* ACCIONES RÁPIDAS S-CLASS (Con Heurística Proactiva de Cursor) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <button
              type="button"
              data-proactive-zone="mecenazgo"
              onClick={() => setActiveTab('mecenazgo')}
              className="p-4 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 hover:border-[#8b5cf6] flex items-center justify-between group transition-all text-left cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-mono text-[#8b5cf6] block uppercase font-bold">Incentivo Fiscal Ley 49/2002</span>
                <h4 className="text-sm font-bold text-white">Calcular Deducción del 80%</h4>
              </div>
              <ArrowRight size={16} className="text-[#8b5cf6] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              data-proactive-zone="evidencia"
              onClick={() => setActiveTab('evidencia')}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#AAD6CD]/40 flex items-center justify-between group transition-all text-left cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-mono text-[#AAD6CD] block uppercase font-bold">Evidencia Clínica & Audio</span>
                <h4 className="text-sm font-bold text-white">40 Hz DSP & Estudio N=45</h4>
              </div>
              <ArrowRight size={16} className="text-zinc-400 group-hover:text-[#AAD6CD] group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={CENTRALITA.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366] flex items-center justify-between group transition-all text-left text-[#25D366] cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-mono block uppercase font-bold">Atención Sanitaria</span>
                <h4 className="text-sm font-bold">WhatsApp Terapeutas de Guardia</h4>
              </div>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </section>

      {/* 🧭 SELECTOR DE VISTAS TABS */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[#0a0a0f] border border-white/10 w-full overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-purple-700 text-white shadow-[0_0_25px_rgba(139,92,246,0.4)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 🚀 CONTENIDO PRINCIPAL POR PESTAÑA */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* VISTA 1: BÓVEDA DE EVIDENCIA (40Hz & Recharts) */}
          {activeTab === 'evidencia' && (
            <motion.div
              key="evidencia"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              <VimumeBovedaEvidencia />
              
              {/* Callout hacia Calculadora */}
              <div 
                className="p-8 rounded-3xl bg-gradient-to-r from-[#8b5cf6]/10 to-transparent border border-[#8b5cf6]/30 flex flex-col sm:flex-row items-center justify-between gap-6"
                data-proactive-zone="mecenazgo"
              >
                <div>
                  <h4 className="text-xl font-bold font-syne text-white uppercase">
                    Financia una sesión en una residencia de tu localidad
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                    Gracias a la Ley 49/2002, una aportación de 150 € tiene un coste neto real de solo 30 € tras la deducción del 80% en tu IRPF.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('mecenazgo')}
                  className="px-6 py-3.5 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(139,92,246,0.4)] shrink-0 transition-all cursor-pointer"
                >
                  Abrir Calculadora Fiscal
                </button>
              </div>
            </motion.div>
          )}

          {/* VISTA 2: CALCULADORA DE MECENAZGO */}
          {activeTab === 'mecenazgo' && (
            <motion.div
              key="mecenazgo"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
              data-observe-concierge
              id="seccion-mecenazgo"
              data-proactive-zone="mecenazgo"
            >
              <MecenazgoFiscalCalculator />
            </motion.div>
          )}

          {/* VISTA 3: EL LEGADO DEL COLIBRÍ */}
          {activeTab === 'colibri' && (
            <motion.div
              key="colibri"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              <VimumeColibriNarrative />
            </motion.div>
          )}

          {/* VISTA 4: SONOMETRÍA ACTIVA Y ENTREGA FÍSICA BOSE */}
          {activeTab === 'sonometria' && (
            <motion.div
              key="sonometria"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
              data-observe-concierge
              id="seccion-sonometria"
            >
              <LiveSonometryGuard 
                initialVenue="Centro Residencial Homologado VIMUME" 
                maxAllowedDb={75} 
                isVimumeMode={true} 
              />

              {/* 🏛️ ARQUITECTURA DE ENTREGA FÍSICA BOSE (12 W/PAX) */}
              <div className="rounded-[2.5rem] bg-gradient-to-b from-[#090910] to-black border border-white/10 p-6 sm:p-10 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono tracking-widest uppercase font-bold">
                      <Speaker size={13} />
                      <span>RIDER ACÚSTICO INSTITUCIONAL // HARDWARE Y CALIBRACIÓN IN SITU</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                      Entrega Física de la Presión Sonora: <span className="text-[#ecb613]">Sistemas Bose (12 W/pax)</span>
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    Homogeneidad: ±1.5 dB en Sala
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                      <Radio size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-white font-syne">1. Dispersión Espacial Flexible</h4>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      Uso de columnas <strong>Bose F1 Model 812</strong> en configuración curvilínea ("J-Shape") orientada al plano auditivo sentado de los residentes, complementado por satélites <strong>Bose S1 Pro</strong> a 12 W/pax. Evita el gradiente frontal violento (&gt;80 dB delante y &lt;60 dB detrás).
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center text-[#8b5cf6]">
                      <Cpu size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-white font-syne">2. DSP Behringer XR18 Clamped</h4>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      El flujo digital viaja desde la consola Behringer XR18 con limitador hardware infranqueable fijado a 74.0 dB SPL slow. Incluye filtro paso-alto en 35 Hz, resonancia calibrada en 40.0 Hz (Q=4.5) y corte suave en agudos (&gt;4.5 kHz) para anular el reclutamiento coclear.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#AAD6CD]/10 border border-[#AAD6CD]/30 flex items-center justify-center text-[#AAD6CD]">
                      <ShieldCheck size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-white font-syne">3. Calibración Clase 1 & Hash</h4>
                    <p className="text-xs text-zinc-300 font-light leading-relaxed">
                      Medición previa con sonómetro homologado IEC 61672-1 Clase 1 en 5 nodos de la sala. Se emite acta criptográfica SHA-256 de conformidad ambiental para la dirección médica del centro antes del inicio de la sesión.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* VISTA 5: ONTOLOGÍA Y RAG SSOT */}
          {activeTab === 'ontologia' && (
            <motion.div
              key="ontologia"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              <VimumeOntologyExplorer />
              <VimumeRagFaqSection />
            </motion.div>
          )}

          {/* VISTA 6: CONCERTACIÓN B2G / LCSP */}
          {activeTab === 'b2g_concertacion' && (
            <motion.div
              key="b2g_concertacion"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="rounded-[2.5rem] bg-[#07070a] border border-[#AAD6CD]/40 p-6 sm:p-10 space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AAD6CD]/10 border border-[#AAD6CD]/30 text-[#AAD6CD] text-[10px] font-mono tracking-widest uppercase font-bold">
                    <Building2 size={13} />
                    <span>CONTRATACIÓN MENOR ART. 118 LCSP (&lt; 15.000 €)</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne">
                    Expedientes para <span className="text-[#AAD6CD]">Ayuntamientos y Residencias</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-light">
                    Adjudicación directa en &lt; 24h con ajuste preventivo al 95% legal (14.250,00 €) y facturación electrónica Facturae v3.2.2 directa a FACe.
                  </p>
                </div>

                <Link
                  href="/b2g"
                  className="px-5 py-3 rounded-xl bg-[#AAD6CD] hover:bg-white text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(170,214,205,0.4)] transition-all shrink-0"
                >
                  <span>Abrir Portal B2G</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* GRID DE CARACTERÍSTICAS B2G */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-[#AAD6CD] uppercase font-bold block">Código CPV Homologado</span>
                  <h4 className="text-sm font-bold text-white">85311100-3 (Servicios Asistenciales)</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Alineado con el Clasificador Central de Productos de la Unión Europea y memorias de necesidad sin fraccionamiento.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-[#ecb613] uppercase font-bold block">Triple Código DIR3</span>
                  <h4 className="text-sm font-bold text-white">Oficina Contable, Gestor y Tramitador</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Validación formal en tiempo real para evitar rechazos en Intervención Municipal y acelerar el pago administrativo a 30 días.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-[#8b5cf6] uppercase font-bold block">Alineación ODS 2030</span>
                  <h4 className="text-sm font-bold text-white">ODS 3, ODS 10 y ODS 11</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Memoria técnica justificativa para memorias de alcaldía y fondos de cohesión social autonómicos.
                  </p>
                </div>
              </div>

              {/* CONTACTO DE RETENCIÓN */}
              <div className="bg-black/60 border border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Atención a Secretarías e Intervención</span>
                    <span className="text-sm font-bold font-mono text-white">{CENTRALITA.display}</span>
                  </div>
                </div>
                <a
                  href={CENTRALITA.tel}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-colors"
                >
                  Llamar a Intervención VIMUME
                </a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 🔮 ORÁCULO PREDICTIVO CON HEURÍSTICA DE CURSOR */}
      <AIConciergeProactive onSelectTab={(tabId) => setActiveTab(tabId as VimumeTabId)} />

    </div>
  );
}
