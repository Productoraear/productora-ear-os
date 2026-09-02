'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Newspaper, 
  Download, 
  Search, 
  Users, 
  Mic2, 
  Info, 
  Globe, 
  Share2,
  CheckCircle2,
  ShieldCheck,
  Activity,
  ArrowLeft,
  ArrowRight,
  Calculator,
  TrendingUp,
  Award,
  Phone,
  Mail,
  FileText,
  Sparkles
} from 'lucide-react';

export default function VimumePrensaPage() {
  const [centers, setCenters] = useState(5);
  const [months, setMonths] = useState(12);

  // Métrica SROI: Multiplicador 4.85x sobre la inversión base de 450€/mes por centro
  const baseInvestment = centers * months * 450;
  const sroiRatio = 4.85;
  const socialValueGenerated = Math.round(baseInvestment * sroiRatio);
  const seniorsImpacted = centers * 25;
  const hoursOfTherapy = centers * months * 8;

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-32 px-4 md:px-8 selection:bg-[#ecb613] selection:text-black font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <Link 
            href="/vimume" 
            className="inline-flex items-center gap-2 text-xs font-mono text-[#ecb613] hover:text-amber-300 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Volver al Hub VIMUME</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Impacto SROI Auditado 2026 • Ratio 4.85x</span>
          </div>
        </div>

        {/* Header Editorial */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono uppercase tracking-widest">
            <Newspaper size={14} />
            <span>SALA DE PRENSA &amp; COMUNICACIÓN INSTITUCIONAL // DOSSIER 2026</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
            Neurociencia, Memoria Viva <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-rose-300 to-pink-500">
              &amp; Trazabilidad SROI Cuantificada
            </span>
          </h1>
          <p className="text-white/70 text-sm md:text-base lg:text-lg max-w-3xl leading-relaxed">
            Dossier oficial para medios de comunicación, gabinetes institucionales y directores de RSC. Transformamos la estimulación neuroacústica en métricas auditables de Retorno Social de la Inversión (SROI).
          </p>
        </header>

        {/* SIMULADOR INTERACTIVO SROI */}
        <section className="rounded-[2.5rem] bg-[#09090d] border border-[#ecb613]/30 p-6 md:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#ecb613]/10 blur-[110px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Calculator size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400 font-bold block">
                  CALCULADORA DINÁMICA SROI / ESG
                </span>
                <h2 className="text-xl md:text-2xl font-black uppercase text-white font-syne">
                  Simulador de Impacto Social y Valor Monetizado
                </h2>
              </div>
            </div>
            <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#ecb613]">
              Algoritmo de Retorno: 4.85 € por cada 1 € invertido
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Controles del Simulador */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-white/60 uppercase">Centros Residenciales / Centros de Día</span>
                  <span className="font-mono font-bold text-white text-sm">{centers} Centros</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={centers}
                  onChange={(e) => setCenters(Number(e.target.value))}
                  className="w-full accent-[#ecb613] bg-neutral-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/30">
                  <span>1 Centro (Piloto Local)</span>
                  <span>25 Centros</span>
                  <span>50 Centros (Red Autonómica)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-white/60 uppercase">Duración del Programa</span>
                  <span className="font-mono font-bold text-[#ecb613] text-sm">{months} Meses</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="24"
                  step="3"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full accent-[#ecb613] bg-neutral-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/30">
                  <span>3 Meses (Trimestral)</span>
                  <span>12 Meses (Anual)</span>
                  <span>24 Meses (Plurianual)</span>
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase">Fundamento Metodológico SROI:</span>
                <p className="text-xs text-white/60 leading-relaxed">
                  Basado en la reducción auditada de agitación nocturna (-38%), menor administración de contenciones farmacológicas y reducción del síndrome de burnout en cuidadores profesionales.
                </p>
              </div>
            </div>

            {/* Tarjeta de Resultados Monetizados */}
            <div className="bg-black/80 border border-[#ecb613]/30 p-8 rounded-3xl space-y-6 shadow-2xl relative">
              <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                    VALOR SOCIAL MONETIZADO (SROI)
                  </span>
                  <span className="text-3xl md:text-4xl font-mono font-black text-emerald-400">
                    {socialValueGenerated.toLocaleString('es-ES')} €
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-white/40 uppercase block">Inversión Base</span>
                  <span className="text-sm font-mono text-white font-bold">{baseInvestment.toLocaleString('es-ES')} €</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">Mayores Beneficiados</span>
                  <p className="text-2xl font-black text-white font-mono">{seniorsImpacted}</p>
                  <span className="text-[10px] text-white/40">Residentes directos</span>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-mono text-white/40 uppercase block">Horas de Terapia</span>
                  <p className="text-2xl font-black text-[#ecb613] font-mono">{hoursOfTherapy} h</p>
                  <span className="text-[10px] text-white/40">Sesiones clínicas 40Hz</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs border-t border-white/5">
                <span className="font-mono text-white/60">Ratio de Multiplicación:</span>
                <span className="font-mono font-bold text-white bg-white/10 px-2.5 py-1 rounded-md">
                  1,00 € Invertido → 4,85 € Retorno Social
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MEDIA KIT, WHITEPAPER Y ATENCIÓN A MEDIOS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl flex flex-col justify-between space-y-6 hover:border-[#ecb613]/40 transition-all">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#ecb613] tracking-widest font-bold block">
                DOSSIER DE PRENSA 2026
              </span>
              <h3 className="text-xl font-bold text-white font-syne">Kit de Medios 4K HDR</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Logotipos vectoriales, fotografías en alta definición de sesiones de estimulación lírica y biografías completas del cuadro médico-artístico.
              </p>
            </div>
            <a
              href="mailto:prensa@edwinagudelo.es?subject=Solicitud%20Media%20Kit%20VIMUME"
              className="w-full py-3.5 border border-white/20 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors rounded-xl flex items-center justify-center gap-2"
            >
              <Download size={14} />
              <span>Solicitar Media Kit 4K</span>
            </a>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl flex flex-col justify-between space-y-6 hover:border-pink-500/40 transition-all">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase text-pink-400 tracking-widest font-bold block">
                PUBLICACIÓN CIENTÍFICA
              </span>
              <h3 className="text-xl font-bold text-white font-syne">Whitepaper Neuroacústico 40Hz</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Documento técnico sobre la estimulación binaural gamma, la atenuación de estrés mediante límite &lt;75 dB SPL y la reactivación de memoria episódica.
              </p>
            </div>
            <Link
              href="/vimume/protocolo"
              className="w-full py-3.5 border border-white/20 text-xs font-mono uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors rounded-xl flex items-center justify-center gap-2"
            >
              <FileText size={14} />
              <span>Ver Protocolo Clínico</span>
            </Link>
          </div>

          <div className="bg-gradient-to-b from-[#181206] to-black border border-[#ecb613]/30 p-8 rounded-3xl flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#ecb613] tracking-widest font-bold block">
                GABINETE &amp; ACREDITACIÓN
              </span>
              <h3 className="text-xl font-bold text-white font-syne">Entrevistas &amp; Cobertura</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                Gestión de entrevistas directas con Edwin Agudelo, acreditaciones para grabaciones in situ en residencias y reportajes audiovisuales.
              </p>
            </div>
            <a
              href="https://wa.me/34679286157?text=Hola,%20soy%20periodista%20y%20me%20gustaria%20acreditarme%20para%20cubrir%20VIMUME"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#ecb613] text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-white transition-all rounded-xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(236,182,19,0.3)]"
            >
              <Phone size={14} />
              <span>Contactar Gabinete Prensa</span>
            </a>
          </div>
        </section>

        {/* PIE DE PÁGINA INSTITUCIONAL DE PRENSA */}
        <footer className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-white">Jefa de Prensa: Eliana Tovar</span>
            <span>•</span>
            <a href="tel:+34679286157" className="hover:text-white transition-colors">+34 679 286 157</a>
            <span>•</span>
            <a href="mailto:prensa@edwinagudelo.es" className="hover:text-white transition-colors">prensa@edwinagudelo.es</a>
          </div>
          <div className="font-mono text-[10px] text-[#ecb613]">
            EAR OS V2 // VIMUME PRESS ROOM v2.0 — 100% OPERATIVO
          </div>
        </footer>

      </div>
    </main>
  );
}
