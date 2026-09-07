'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Layers, 
  Sliders, 
  Terminal, 
  Eye, 
  Palette, 
  Type, 
  Maximize2, 
  Smartphone, 
  MousePointer, 
  Activity, 
  FileText, 
  ArrowRight,
  RefreshCw,
  Cpu,
  Zap
} from 'lucide-react';
import libraryData from '@/data/impecable-design-library.json';

type TabKey = 'biblioteca' | 'auditor' | 'prompt-builder' | 'toolbelt';

export default function EstudioDisenoPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('biblioteca');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('cinematic-monochrome');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Estados para el Auditor de Slop (Toggle en vivo)
  const [slopSimulated, setSlopSimulated] = useState<boolean>(false);
  const [activeDimension, setActiveDimension] = useState<number>(0);

  // Estados para el Prompt Builder de 4 partes
  const [builderEstetica, setBuilderEstetica] = useState<string>('Cinematic Monocromo S-Class (True Black #030305, refracción diamante Three.js)');
  const [builderReferencia, setBuilderReferencia] = useState<string>('Instrumentación analógica Bang & Olufsen con fluidez tipo Linear');
  const [builderIntencion, setBuilderIntencion] = useState<string>('Para ayuntamientos y particulares que buscan contratación con presupuesto cerrado');
  const [builderSiempre, setBuilderSiempre] = useState<string>('Split 80/10/10, Rider 12 W/pax Bose, Price-Lock SHA-256, 100% responsive sin desbordamientos');
  const [builderNunca, setBuilderNunca] = useState<string>('Degradados violetas de IA, w-screen 100vw, fuentes genéricas por defecto, fotos de stock crudas');

  const selectedFamily = libraryData.design_families.find(f => f.id === selectedFamilyId) || libraryData.design_families[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const compiledPrompt = `/* PROMPT DE 4 PARTES PARA QWEN / CLINE LOCAL */
1. ESTÉTICA:
${builderEstetica}

2. REFERENCIA:
${builderReferencia}

3. INTENCIÓN:
${builderIntencion}

4. GUÍAS INMUTABLES:
SIEMPRE:
- ${builderSiempre}
NUNCA (FILTRO ANTI-SLOP):
- ${builderNunca}`;

  return (
    <div className="relative w-full max-w-full min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black overflow-x-hidden">
      
      {/* ── HEADER SUPERIOR CON NAVEGACIÓN Y TELEMETRÍA ── */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono transition-colors"
          >
            <span className="text-[#FF2B44] font-bold">←</span>
            <span>VOLVER AL NÚCLEO</span>
          </Link>
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              ESTUDIO IMPECABLE
            </span>
            <span className="text-[10px] font-mono text-[#00E5FF] px-1.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
              QWEN & CLINE LOCAL
            </span>
          </div>
        </div>

        {/* Badges de Soberanía Local */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10">
            <Cpu size={12} className="text-[#ecb613]" />
            CERO DEPENDENCIAS CLAUDE
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10">
            <ShieldCheck size={12} className="text-emerald-400" />
            46 REGLAS ANTI-SLOP
          </span>
        </div>
      </header>

      {/* ── BANNER HERO DE IMPACTO ── */}
      <section className="relative pt-10 pb-8 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF2B44]/10 border border-[#FF2B44]/30 text-[#FF2B44] text-[11px] font-mono font-bold tracking-widest uppercase mb-4">
          <Zap size={13} />
          VOCABULARIO DE DISEÑO S-CLASS PARA AGENTES LOCALES
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-syne uppercase tracking-tight text-white leading-tight max-w-4xl mx-auto">
          BIBLIOTECA DE ESTILOS & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B44] via-[#00E5FF] to-[#ecb613] italic">
            AUDITORÍA ANTI-SLOP
          </span>
        </h1>
        <p className="mt-4 text-xs sm:text-sm font-mono text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Diseñado para elevar a Qwen 3.8 y Cline en GPU local al nivel estético de los mejores directores de arte, sin suscripciones de pago y con proyección visual en 5 estilos.
        </p>

        {/* ── SELECTOR DE PESTAÑAS PRINCIPALES ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 max-w-2xl mx-auto bg-black/60 border border-white/15 rounded-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveTab('biblioteca')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'biblioteca'
                ? 'bg-white text-black shadow-lg scale-[1.02]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers size={14} />
            <span>5 ESTILOS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('auditor')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'auditor'
                ? 'bg-[#FF2B44] text-white shadow-[0_0_20px_rgba(255,43,68,0.4)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck size={14} />
            <span>AUDITOR SLOP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prompt-builder')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'prompt-builder'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal size={14} />
            <span>PROMPT 4 PARTES</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('toolbelt')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === 'toolbelt'
                ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.4)] scale-[1.02]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders size={14} />
            <span>TOOLBELT 23</span>
          </button>
        </div>
      </section>

      {/* ── CONTENIDO PRINCIPAL POR PESTAÑAS ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">

        {/* ═════════ TAB 1: BIBLIOTECA DE 5 FAMILIAS ESTÉTICAS ═════════ */}
        {activeTab === 'biblioteca' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Banner explicativo del Paso 3 */}
            <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-white/5 via-white/[0.02] to-transparent border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold font-syne uppercase text-white flex items-center gap-2">
                  <Eye size={16} className="text-[#00E5FF]" />
                  REGLA DE ORO: &ldquo;NUNCA EN UNA TOMA. PROYECTA EN GRANDE.&rdquo;
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Evalúa las 5 familias estéticas antes de decidir. Compara lado a lado en lugar de adivinar en la terminal.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>5 Familias Registradas</span>
              </div>
            </div>

            {/* Grid de las 5 familias */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {libraryData.design_families.map((family) => {
                const isSelected = family.id === selectedFamilyId;
                return (
                  <div
                    key={family.id}
                    onClick={() => {
                      setSelectedFamilyId(family.id);
                      setBuilderEstetica(`${family.name} (${family.vocabulary.slice(0, 3).join(', ')})`);
                    }}
                    className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between text-left group relative overflow-hidden ${
                      isSelected
                        ? 'bg-white/10 border-white shadow-[0_0_30px_rgba(255,255,255,0.15)] scale-[1.02]'
                        : 'bg-black/50 hover:bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    style={{
                      borderColor: isSelected ? family.accent_color : undefined,
                    }}
                  >
                    {/* Indicador de acento superior */}
                    <div className="flex items-center justify-between">
                      <span 
                        className="w-3 h-3 rounded-full shadow-md"
                        style={{ backgroundColor: family.accent_color }}
                      />
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 uppercase">
                        {family.tag}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-bold font-syne text-white group-hover:text-white transition-colors">
                        {family.name}
                      </h4>
                      <p className="text-[11px] font-mono text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                        {family.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span style={{ color: family.accent_color }}>
                        {isSelected ? 'ACTIVO' : 'SELECCIONAR'}
                      </span>
                      <ArrowRight size={12} className={isSelected ? 'translate-x-1 transition-transform' : ''} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ficha Detallada de la Familia Seleccionada */}
            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-[#08090d] border border-white/15 shadow-2xl relative overflow-hidden">
              <div 
                className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ backgroundColor: selectedFamily.accent_color }}
              />

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedFamily.accent_color }}
                    />
                    <h3 className="text-xl sm:text-2xl font-black font-syne uppercase text-white">
                      {selectedFamily.name}
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 mt-1 max-w-2xl">
                    {selectedFamily.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBuilderEstetica(`${selectedFamily.name} (${selectedFamily.vocabulary.slice(0, 3).join(', ')})`);
                    setActiveTab('prompt-builder');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  style={{
                    backgroundColor: selectedFamily.accent_color,
                    color: selectedFamily.accent_color === '#FFFFFF' ? '#000' : '#FFF'
                  }}
                >
                  <Terminal size={14} />
                  <span>CREAR PROMPT CON ESTA ESTÉTICA</span>
                </button>
              </div>

              {/* 3 Columnas de Desglose de Entrada */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* 1. Vocabulario Visual */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider mb-3">
                    <Type size={13} style={{ color: selectedFamily.accent_color }} />
                    <span>VOCABULARIO VISUAL</span>
                  </div>
                  <ul className="space-y-1.5 text-xs font-mono text-zinc-300">
                    {selectedFamily.vocabulary.map((v, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-white/40">•</span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Palabras Clave de Prompt */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider mb-3">
                    <Palette size={13} style={{ color: selectedFamily.accent_color }} />
                    <span>PALABRAS CLAVE PARA PROMPTS</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFamily.keywords.map((kw, i) => (
                      <span 
                        key={i} 
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">BRIEF BASE:</span>
                    <p className="text-[11px] font-mono text-zinc-300 leading-relaxed">
                      {selectedFamily.brief}
                    </p>
                  </div>
                </div>

                {/* 3. Prompt de Imagen Héroe */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-white uppercase tracking-wider mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={13} style={{ color: selectedFamily.accent_color }} />
                        <span>PROMPT IMAGEN HÉROE</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedFamily.hero_image_prompt, 'hero-prompt')}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
                        title="Copiar prompt"
                      >
                        {copiedKey === 'hero-prompt' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-300 leading-relaxed bg-[#030305] p-3 rounded-xl border border-white/5 italic">
                      &ldquo;{selectedFamily.hero_image_prompt}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Aspect Ratio: 16:9</span>
                    <span>Higgsfield / Midjourney Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════ TAB 2: AUDITOR DE SLOP EN VIVO (7 DIMENSIONES) ═════════ */}
        {activeTab === 'auditor' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Control Interactivo: Slop Simulado vs Impecable */}
            <div className="p-6 rounded-3xl bg-black/70 border border-white/15 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black font-syne uppercase text-white flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  AUDITORÍA DE SLOP EN VIVO (46 PATRONES & 7 DIMENSIONES)
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Prueba el interruptor para contrastar un componente típico generado por IA con slop vs la versión curada S-Class.
                </p>
              </div>

              {/* Toggle de Simulación */}
              <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                <span className={`text-xs font-mono px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  !slopSimulated ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-400'
                }`}
                onClick={() => setSlopSimulated(false)}
                >
                  IMPECABLE S-CLASS
                </span>
                <span className={`text-xs font-mono px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  slopSimulated ? 'bg-[#FF2B44] text-white font-bold' : 'text-zinc-400'
                }`}
                onClick={() => setSlopSimulated(true)}
                >
                  AI SLOP CLICHÉ
                </span>
              </div>
            </div>

            {/* COMPARACIÓN VISUAL EN VIVO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Componente Renderizado en Vivo según estado */}
              <div className="p-6 sm:p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden"
                style={{
                  backgroundColor: slopSimulated ? '#1e1b4b' : '#030305',
                  borderColor: slopSimulated ? '#a855f7' : 'rgba(255,255,255,0.15)',
                  backgroundImage: slopSimulated ? 'linear-gradient(135deg, #3b0764 0%, #1e1b4b 50%, #1e3a8a 100%)' : undefined
                }}
              >
                <div className="text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-4"
                  style={{
                    backgroundColor: slopSimulated ? 'rgba(255,255,255,0.2)' : 'rgba(255,43,68,0.15)',
                    color: slopSimulated ? '#fff' : '#FF2B44',
                    border: slopSimulated ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,43,68,0.3)'
                  }}
                >
                  {slopSimulated ? '⚠️ PATRÓN SLOP DETECTADO' : '✨ CERTIFICADO S-CLASS'}
                </div>

                {slopSimulated ? (
                  /* VERSIÓN CON AI SLOP (Típico cliché genérico) */
                  <div className="space-y-4 font-sans">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      Revoluciona tu Experiencia Musical con IA
                    </h2>
                    <p className="text-sm text-purple-200">
                      Nuestra plataforma de última generación te ofrece soluciones innovadoras para tus eventos. Descubre el poder de la música sin fricción.
                    </p>
                    <div className="pt-2">
                      <button type="button" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium shadow-lg hover:opacity-90">
                        Comenzar Ahora →
                      </button>
                    </div>
                  </div>
                ) : (
                  /* VERSIÓN IMPECABLE S-CLASS (Alto contraste, tipografía Syne, datos exactos) */
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#00E5FF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                      <span>RIDER 12 W/PAX BOSE · PROTOCOLO ACTIVO</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase text-white tracking-tight leading-tight">
                      PRODUCCIÓN ACÚSTICA SOBERANA
                    </h2>
                    <p className="text-xs font-mono text-zinc-300 leading-relaxed max-w-md">
                      Split inmutable del 80% al artista. Auditoría de presión sonora &lt;75 dB SPL en residencias y Price-Lock criptográfico garantizado por 72 horas.
                    </p>
                    <div className="pt-2 flex items-center gap-3">
                      <button type="button" className="px-4 py-2 rounded-xl bg-[#ecb613] text-black font-mono font-bold text-xs hover:bg-amber-400 transition-transform active:scale-95 shadow-[0_0_20px_rgba(236,182,19,0.3)]">
                        AUDITAR EXPEDIENTE (ART. 118 LCSP)
                      </button>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Hub Méntrida · Km 0
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Diagnóstico de las 7 Dimensiones */}
              <div className="p-6 rounded-3xl bg-[#08090d] border border-white/10 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider mb-4">
                    DESGLOSE DE LAS 7 DIMENSIONES DEL SLOP
                  </h4>

                  <div className="space-y-2">
                    {libraryData.anti_slop_checklist_7_dimensions.map((dim, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveDimension(idx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          activeDimension === idx 
                            ? 'bg-white/10 border-white/30 shadow-md' 
                            : 'bg-black/40 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {slopSimulated ? (
                            <AlertTriangle size={14} className="text-[#FF2B44] shrink-0" />
                          ) : (
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          )}
                          <span className="text-xs font-mono font-bold text-white">
                            {dim.dimension}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {slopSimulated ? 'Falla detectada' : 'Pasa filtro'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detalle de la dimensión seleccionada */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono">
                    <span className="text-[10px] text-zinc-500 uppercase block mb-1">
                      {libraryData.anti_slop_checklist_7_dimensions[activeDimension].dimension} // DIAGNÓSTICO:
                    </span>
                    <p className="text-red-400/90 mb-1">
                      ❌ Slop: {libraryData.anti_slop_checklist_7_dimensions[activeDimension].slop_indicator}
                    </p>
                    <p className="text-emerald-400/90">
                      ✅ Estándar Impecable: {libraryData.anti_slop_checklist_7_dimensions[activeDimension].impeccable_standard}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ═════════ TAB 3: PROMPT BUILDER DE 4 PARTES ═════════ */}
        {activeTab === 'prompt-builder' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="p-6 rounded-3xl bg-black/70 border border-white/15">
              <h3 className="text-lg font-black font-syne uppercase text-white flex items-center gap-2">
                <Terminal size={20} className="text-[#00E5FF]" />
                GENERADOR DEL PROMPT DE 4 PARTES PARA AGENTES LOCALES
              </h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Construye prompts que previenen el slop antes de que el código se escriba. Diseñado para copiar y pegar en Cline o inyectar a Qwen 3.8.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulario de las 4 partes */}
              <div className="space-y-4">
                
                {/* 1. Estética */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <label className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase">
                    <span className="w-5 h-5 rounded-full bg-[#FF2B44] text-white flex items-center justify-center text-[10px]">1</span>
                    ESTÉTICA (FAMILIA DE DISEÑO)
                  </label>
                  <input
                    type="text"
                    value={builderEstetica}
                    onChange={(e) => setBuilderEstetica(e.target.value)}
                    className="w-full bg-[#050507] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                  <span className="text-[10px] font-mono text-zinc-500">
                    Ej: Cinematic Monocromo, Impresión Técnica, Dark Brutalist...
                  </span>
                </div>

                {/* 2. Referencia */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <label className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase">
                    <span className="w-5 h-5 rounded-full bg-[#00E5FF] text-black flex items-center justify-center text-[10px]">2</span>
                    REFERENCIA (SENSACIÓN EXACTA)
                  </label>
                  <input
                    type="text"
                    value={builderReferencia}
                    onChange={(e) => setBuilderReferencia(e.target.value)}
                    className="w-full bg-[#050507] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                  <span className="text-[10px] font-mono text-zinc-500">
                    Iguala la sensación del mundo real, nunca copies literalmente.
                  </span>
                </div>

                {/* 3. Intención */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <label className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase">
                    <span className="w-5 h-5 rounded-full bg-[#ecb613] text-black flex items-center justify-center text-[10px]">3</span>
                    INTENCIÓN (CONVERSIÓN Y AUDIENCIA)
                  </label>
                  <input
                    type="text"
                    value={builderIntencion}
                    onChange={(e) => setBuilderIntencion(e.target.value)}
                    className="w-full bg-[#050507] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                  <span className="text-[10px] font-mono text-zinc-500">
                    ¿Quién es el usuario y qué acción concreta debe realizar?
                  </span>
                </div>

                {/* 4. Guías (Siempre / Nunca) */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                  <label className="text-xs font-mono font-bold text-white flex items-center gap-2 uppercase">
                    <span className="w-5 h-5 rounded-full bg-emerald-400 text-black flex items-center justify-center text-[10px]">4</span>
                    GUÍAS ANTI-SLOP (SIEMPRE / NUNCA)
                  </label>
                  
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">SIEMPRE INCLUIR:</span>
                    <input
                      type="text"
                      value={builderSiempre}
                      onChange={(e) => setBuilderSiempre(e.target.value)}
                      className="w-full bg-[#050507] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-[#FF2B44] uppercase block mb-1">NUNCA PERMITIR (FILTRO):</span>
                    <input
                      type="text"
                      value={builderNunca}
                      onChange={(e) => setBuilderNunca(e.target.value)}
                      className="w-full bg-[#050507] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FF2B44]"
                    />
                  </div>
                </div>

              </div>

              {/* Salida Compilada lista para Copiar */}
              <div className="p-6 rounded-3xl bg-[#08090d] border border-white/15 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Terminal size={14} className="text-[#00E5FF]" />
                      <span className="text-xs font-mono font-bold text-white uppercase">
                        PAYLOAD COMPILADO PARA CLINE / QWEN
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(compiledPrompt, 'compiled-prompt')}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedKey === 'compiled-prompt' ? (
                        <>
                          <Check size={12} className="text-emerald-400" />
                          <span className="text-emerald-400">¡COPIADO!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>COPIAR PROMPT</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 rounded-2xl bg-black border border-white/10 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[380px]">
                    {compiledPrompt}
                  </pre>
                </div>

                <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                  <Cpu size={14} className="text-[#ecb613] shrink-0" />
                  <span>
                    Pega este prompt directamente en la consola de Cline o envíalo a tu orquestador local para que Qwen genere código 100% libre de slop.
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ═════════ TAB 4: TOOLBELT DE 23 COMANDOS ═════════ */}
        {activeTab === 'toolbelt' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-3xl bg-black/70 border border-white/15 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black font-syne uppercase text-white flex items-center gap-2">
                  <Sliders size={20} className="text-[#ecb613]" />
                  EL CINTURÓN DE HERRAMIENTAS DIRECTAS (23 COMANDOS LOCALES)
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Comandos de alta precisión para aplicar transformaciones inmediatas a cualquier componente sin rodeos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {libraryData.toolbelt_commands.map((t, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-black/60 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono font-bold text-xs">
                        {t.command}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(t.command, `cmd-${idx}`)}
                        className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      >
                        {copiedKey === `cmd-${idx}` ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                      {t.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
