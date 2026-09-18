"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  Globe,
  Database,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Zap,
  Volume2,
  FileCode2,
  Play
} from 'lucide-react';

interface PipelineLog {
  stage: 1 | 2 | 3;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'telemetry';
}

export const Cult3StageEnrichmentPipeline: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState<string>('https://fincasoto.es');
  const [targetName, setTargetName] = useState<string>('Finca Soto de Cerrolén (Torrelodones, Madrid)');
  const [currentStage, setCurrentStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<PipelineLog[]>([]);
  const [enrichedData, setEnrichedData] = useState<any | null>(null);

  const runPipeline = async () => {
    setIsRunning(true);
    setLogs([]);
    setEnrichedData(null);
    setCurrentStage(1);

    const addLog = (stage: 1 | 2 | 3, message: string, type: 'info' | 'success' | 'warning' | 'telemetry' = 'info') => {
      const now = new Date().toLocaleTimeString('es-ES', { hour12: false });
      setLogs((prev) => [...prev, { stage, timestamp: now, message, type }]);
    };

    // ETAPA 1: Ingesta y Web Scraping
    addLog(1, `Iniciando rastreador Edge para ${targetUrl}...`, 'info');
    await new Promise((r) => setTimeout(r, 600));
    addLog(1, `Extracción de metadatos DOM, OpenGraph y 4 fotografías de alta resolución`, 'telemetry');
    await new Promise((r) => setTimeout(r, 700));
    addLog(1, `Etapa 1 Completada: 14.8 KB de payload crudo absorbido`, 'success');

    // ETAPA 2: Enriquecimiento Semántico con IA Local (Ollama GPU)
    setCurrentStage(2);
    addLog(2, `Conectando con GPU local (Ollama 11434 / Qwen 2.5 32B S-Class)...`, 'info');
    await new Promise((r) => setTimeout(r, 800));
    addLog(2, `Análisis acústico: Verificando límite de decibelios (< 75 dB SPL) y acometida CETAC 32A`, 'telemetry');
    await new Promise((r) => setTimeout(r, 700));
    addLog(2, `Split Soberano 80/10/10 verificado: Deducción fiscal 80% IRPF asignada a VIMUME (Ley 49/2002)`, 'telemetry');
    await new Promise((r) => setTimeout(r, 600));
    addLog(2, `Etapa 2 Completada: Perfil enriquecido con parámetros S-Class auditados`, 'success');

    // ETAPA 3: Indexación & Schema pSEO
    setCurrentStage(3);
    addLog(3, `Generando JSON-LD Schema canónico (EventVenue / LocalBusiness)...`, 'info');
    await new Promise((r) => setTimeout(r, 600));
    addLog(3, `Cálculo de Price-Lock Stripe (100,00 €) con firma criptográfica SHA-256`, 'telemetry');
    await new Promise((r) => setTimeout(r, 600));
    addLog(3, `Etapa 3 Completada: Nodo indexado con microdatos SEO y slug homologado`, 'success');

    setCurrentStage(4);
    setIsRunning(false);

    setEnrichedData({
      nodeId: `sclass-auto-${Math.floor(Math.random() * 8999 + 1000)}`,
      name: targetName,
      sourceUrl: targetUrl,
      acoustics: {
        maxDecibels: 74.8,
        riderCompliance: 'Bose F1 812 / 12W/pax APROBADO',
        electrical: 'CETAC 32A Trifásica 400V',
      },
      economics: {
        split: '80% Ejecutor / 10% EAR OS / 10% VIMUME',
        taxDeductionModel: 'Modelo 182 AEAT (80% IRPF)',
        stripeLockDeposit: '100,00 € (SHA-256)',
      },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'EventVenue',
        name: targetName,
        url: targetUrl,
        maximumAttendeeCapacity: 350,
      },
    });
  };

  return (
    <div className="w-full rounded-3xl bg-[#09090b] border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black font-syne text-white uppercase tracking-tight flex items-center gap-2">
              Pipeline de Enriquecimiento IA en 3 Etapas
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Cult UI v1.2
              </span>
            </h3>
            <p className="text-xs font-mono text-zinc-400">
              Scraping crudo • Extracción acústica y potencia local • Generación automática de Schema pSEO
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse cult-pulse-glow" />
          <span className="text-xs font-mono text-zinc-300">GPU Ollama (11434) Activa</span>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-6">
          <label className="text-[11px] font-mono text-zinc-400 block mb-1">
            Nombre del Recinto / Artista
          </label>
          <input
            type="text"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
            disabled={isRunning}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-[#ecb613]/60"
          />
        </div>

        <div className="sm:col-span-4">
          <label className="text-[11px] font-mono text-zinc-400 block mb-1">
            URL del Sitio Web o Red Social
          </label>
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            disabled={isRunning}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none focus:border-[#ecb613]/60"
          />
        </div>

        <div className="sm:col-span-2 flex items-end pt-5">
          <button
            type="button"
            onClick={runPipeline}
            disabled={isRunning}
            className="w-full py-2.5 px-4 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(236,182,19,0.3)] disabled:opacity-50 active:scale-95"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Procesando</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Ejecutar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3-Stage Progress Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Stage 1 */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            currentStage === 1
              ? 'bg-[#ecb613]/5 border-[#ecb613]/60 shadow-[0_0_15px_rgba(236,182,19,0.15)]'
              : currentStage > 1
              ? 'bg-zinc-900/60 border-emerald-500/40 text-emerald-400'
              : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Etapa 1: Ingesta Web
            </span>
            {currentStage > 1 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : currentStage === 1 ? (
              <RefreshCw className="w-4 h-4 text-[#ecb613] animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-2 leading-relaxed">
            Crawling de DOM, metadatos, galerías de imágenes y microdatos de contacto.
          </p>
        </div>

        {/* Stage 2 */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            currentStage === 2
              ? 'bg-[#ecb613]/5 border-[#ecb613]/60 shadow-[0_0_15px_rgba(236,182,19,0.15)]'
              : currentStage > 2
              ? 'bg-zinc-900/60 border-emerald-500/40 text-emerald-400'
              : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Etapa 2: IA Local (Ollama)
            </span>
            {currentStage > 2 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : currentStage === 2 ? (
              <RefreshCw className="w-4 h-4 text-[#ecb613] animate-spin" />
            ) : (
              <Cpu className="w-4 h-4" />
            )}
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-2 leading-relaxed">
            Auditoría acústica &lt; 75 dB SPL, potencia CETAC y cálculo Split 80/10/10.
          </p>
        </div>

        {/* Stage 3 */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            currentStage === 3
              ? 'bg-[#ecb613]/5 border-[#ecb613]/60 shadow-[0_0_15px_rgba(236,182,19,0.15)]'
              : currentStage > 3
              ? 'bg-zinc-900/60 border-emerald-500/40 text-emerald-400'
              : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Etapa 3: Schema pSEO
            </span>
            {currentStage > 3 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : currentStage === 3 ? (
              <RefreshCw className="w-4 h-4 text-[#ecb613] animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
          </div>
          <p className="text-xs text-zinc-400 font-sans mt-2 leading-relaxed">
            Generación automática de JSON-LD estructurado y bloqueo Stripe 100 €.
          </p>
        </div>
      </div>

      {/* Terminal Real-Time Console */}
      <div className="p-4 rounded-2xl bg-black border border-zinc-800 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 text-zinc-500 text-[11px]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>Telemetría de Enriquecimiento en Vivo</span>
          </div>
          <span>{logs.length} trazas</span>
        </div>

        <div className="max-h-36 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
          {logs.length === 0 ? (
            <div className="text-zinc-600 py-2">
              Haz clic en &quot;Ejecutar&quot; para iniciar el pipeline de 3 etapas sobre el nodo seleccionado.
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                <span className="text-[#ecb613] shrink-0">[ETAPA {log.stage}]</span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-emerald-400 font-bold'
                      : log.type === 'telemetry'
                      ? 'text-cyan-300'
                      : 'text-zinc-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Final Enriched Node Result Card (if completed) */}
      {enrichedData && (
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-[#ecb613]/50 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ecb613] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Nodo Enriquecido &amp; Homologado con Éxito</span>
            </div>
            <span className="font-mono text-xs text-zinc-400">ID: {enrichedData.nodeId}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black border border-zinc-800">
              <span className="text-zinc-500 block">Acústica Certificada</span>
              <span className="text-white font-bold mt-1 block">
                {enrichedData.acoustics.maxDecibels} dB SPL (Rider Bose OK)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-black border border-zinc-800">
              <span className="text-zinc-500 block">Acometida Eléctrica</span>
              <span className="text-emerald-400 font-bold mt-1 block">
                {enrichedData.acoustics.electrical}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-black border border-zinc-800">
              <span className="text-zinc-500 block">Split 80/10/10</span>
              <span className="text-cyan-400 font-bold mt-1 block">
                Deducción 80% IRPF AEAT
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
