'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Sparkles,
  Copy,
  Check,
  Send,
  Cpu,
  ShieldAlert,
  Zap,
  Code2,
  Mic,
  Cloud,
  Square,
  Crown,
  Music2,
  Flame,
  CheckCircle2,
  BrainCircuit,
  Gauge,
  RefreshCw,
  Loader2
} from 'lucide-react';
import {
  DOCTRINA_CEO_EMPRESARIO,
  DOCTRINA_ARTISTA_SOBERANO,
  refineQueryWithOracle,
  type OraclePersona,
  type OracleRefinedResult
} from '@/lib/oracle/quantum-oracle-engine';
import type { CompiledDAGResult } from '@/lib/compiler/omega-intent-compiler';
import {
  MASTER_OBJECTIVES,
  MASTER_TACTICS,
  MASTER_TARGETS,
  MASTER_DOMAINS,
  MASTER_STAKEHOLDERS,
  MASTER_EXECUTIVE_TEMPLATES,
  evaluatePromptReadiness,
  type MasterExecutiveTemplate
} from '@/lib/compiler/master-guide';

type CompileMode = 'QUIRURGICO' | 'OMEGA_FULLSTACK';
type CompileEngine = 'OLLAMA' | 'CLOUD';

/** Contrato estructural del SpeechRecognition del navegador (cero `any`). */
type SpeechRecognitionResultLike = {
  transcript: string;
};

type SpeechRecognitionEventLike = {
  results: Array<Array<SpeechRecognitionResultLike>>;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

type SelectableGpuModel = {
  id: string;
  label: string;
  paramSize: string;
  numCtx?: number;
  role?: string;
};

type GpuStatusPayload = {
  online: boolean;
  usedVramMB: number;
  totalVramMB: number;
  freeVramMB: number;
  loadedModels: Array<{ name: string; vramMB: number; contextSize: number }>;
};

export default function MasterCompilerPage() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<CompileMode>('OMEGA_FULLSTACK');
  const [engine, setEngine] = useState<CompileEngine>('CLOUD');
  const [oraclePersona, setOraclePersona] = useState<OraclePersona>('CEO');
  const [selectedObjective, setSelectedObjective] = useState<string>('VENTAS');
  const [selectedTactic, setSelectedTactic] = useState<string>('SOBREDEMANDA');
  const [selectedTargetAgent, setSelectedTargetAgent] = useState<string>('CLINE');
  const [selectedDomain, setSelectedDomain] = useState<string>('PRODUCTORA_EAR');
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('CEO_INTERNO');
  const [oracleResult, setOracleResult] = useState<OracleRefinedResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledData, setCompiledData] = useState<CompiledDAGResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [injected, setInjected] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('qwen3.8-27b-fast:latest');
  const [forgeEnabled, setForgeEnabled] = useState<boolean>(true);
  const [masterPrompt, setMasterPrompt] = useState<string | null>(null);
  const [editableYaml, setEditableYaml] = useState<string>('');
  const [editableTitle, setEditableTitle] = useState<string>('');
  const [editableAction, setEditableAction] = useState<string>('');
  const [editableFiles, setEditableFiles] = useState<string>('');
  const [editableValidation, setEditableValidation] = useState<string>('npx tsc --noEmit -> Exit Code 0');
  const [isEditingDag, setIsEditingDag] = useState<boolean>(false);
  const [isEditingMaster, setIsEditingMaster] = useState<boolean>(true);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [injectMessage, setInjectMessage] = useState<string | null>(null);
  const [gpuStatus, setGpuStatus] = useState<GpuStatusPayload | null>(null);
  const [gpuModels, setGpuModels] = useState<SelectableGpuModel[]>([]);
  const [isPreloading, setIsPreloading] = useState<string | null>(null);
  const [isRefreshingGpu, setIsRefreshingGpu] = useState(false);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const activeDoctrine = oraclePersona === 'CEO' ? DOCTRINA_CEO_EMPRESARIO : DOCTRINA_ARTISTA_SOBERANO;
  const readiness = useMemo(() => evaluatePromptReadiness(prompt), [prompt]);

  const handleApplyTemplate = (tpl: MasterExecutiveTemplate) => {
    setSelectedDomain(tpl.domain);
    setSelectedStakeholder(tpl.stakeholder);
    setSelectedObjective(tpl.objective);
    setSelectedTactic(tpl.tactic);
    setSelectedTargetAgent(tpl.targetAgent);
    setPrompt(tpl.promptTemplate);
  };

  const refreshGpuStatus = useCallback(async () => {
    setIsRefreshingGpu(true);
    try {
      const res = await fetch('/api/admin/gpu-status', { method: 'GET' });
      const data = await res.json();
      if (data?.ok) {
        setGpuStatus(data.gpu ?? null);
        const selectable: SelectableGpuModel[] = Array.isArray(data.selectableModels)
          ? data.selectableModels
          : [];
        setGpuModels(selectable);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshingGpu(false);
    }
  }, []);

  useEffect(() => {
    void refreshGpuStatus();
  }, [refreshGpuStatus]);

  const handlePreloadModel = useCallback(async (modelId: string) => {
    setIsPreloading(modelId);
    try {
      const res = await fetch('/api/admin/gpu-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelId })
      });
      const data = await res.json();
      if (data?.ok) {
        setGpuStatus(data.gpu ?? null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPreloading(null);
    }
  }, []);

  const handleRefineWithOracle = () => {
    if (!prompt.trim()) return;
    const refined = refineQueryWithOracle(prompt, oraclePersona);
    setOracleResult(refined);
  };

  const handleCompile = async () => {
    if (!prompt.trim()) return;
    setIsCompiling(true);
    setInjected(false);
    setInjectMessage(null);
    setCompileError(null);
    setMasterPrompt(null);
    setLastLatency(null);
    try {
      const res = await fetch('/api/admin/compile-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: prompt,
          objective: selectedObjective,
          tactic: selectedTactic,
          targetAgent: selectedTargetAgent,
          domain: selectedDomain,
          stakeholder: selectedStakeholder,
          mode,
          engine,
          oraclePersona,
          model: selectedModel,
          forge: forgeEnabled
        })
      });
      const data = await res.json();
      if (data.success && data.compiled) {
        const comp: CompiledDAGResult = data.compiled;
        setCompiledData(comp);
        setEditableYaml(comp.yaml ?? '');
        setEditableTitle(comp.jsonTask?.title ?? `B0.Omega: ${prompt.slice(0, 50)}`);
        setEditableAction(comp.jsonTask?.action ?? prompt);
        setEditableFiles(Array.isArray(comp.jsonTask?.files) ? comp.jsonTask.files.join('\n') : '');
        setEditableValidation(comp.jsonTask?.validation ?? 'npx tsc --noEmit -> Exit Code 0');
        if (data.oracle) {
          setOracleResult(data.oracle);
        }
        if (typeof data.masterPrompt === 'string' && data.masterPrompt) {
          setMasterPrompt(data.masterPrompt);
        } else if (comp.jsonTask?.scaffold) {
          setMasterPrompt(comp.jsonTask.scaffold);
        }
        if (typeof data.latencyMs === 'number') {
          setLastLatency(data.latencyMs);
        }
      } else {
        setCompileError(data?.error || `Error HTTP ${res.status} al compilar.`);
      }
    } catch (e) {
      console.error(e);
      setCompileError(e instanceof Error ? e.message : 'Fallo de red al compilar.');
    } finally {
      setIsCompiling(false);
      void refreshGpuStatus();
    }
  };

  const toggleVoice = async () => {
    const speechWindow = window as WindowWithSpeech;
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      setPrompt(prev => (prev ? prev + ' ' : '') + transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const yamlLines = useMemo(() => {
    const yaml: string = editableYaml || compiledData?.yaml || '';
    if (!yaml) return [];
    return yaml.split('\n').map((line) => {
      const trimmed = line.trimStart();
      if (trimmed.startsWith('#')) {
        return { text: line, className: 'text-zinc-500' };
      }
      if (/^[A-Z_]+:/.test(trimmed)) {
        return { text: line, className: 'text-[#ecb613]' };
      }
      if (/-\s*STEP_\d+:/.test(line)) {
        return { text: line, className: 'text-cyan-300' };
      }
      if (line.includes('"')) {
        return { text: line, className: 'text-emerald-400' };
      }
      return { text: line, className: 'text-zinc-300' };
    });
  }, [editableYaml, compiledData]);

  const handleCopyYAML = () => {
    const textToCopy = editableYaml || compiledData?.yaml || '';
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMasterPrompt = () => {
    if (!masterPrompt) return;
    navigator.clipboard.writeText(masterPrompt);
    setCopiedMaster(true);
    setTimeout(() => setCopiedMaster(false), 2000);
  };

  const handleInjectQueue = async () => {
    const baseTask = compiledData?.jsonTask;
    const filesArray = editableFiles
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const payloadTask = {
      id: baseTask?.id || `omega-custom-${Date.now().toString().slice(-4)}`,
      title: (editableTitle || baseTask?.title || `B0.Omega: ${prompt.slice(0, 50)}`).slice(0, 230),
      status: 'QUEUED' as const,
      description: (editableAction || prompt || baseTask?.description || 'Orden personalizada CEO').slice(0, 1900),
      files: filesArray.length > 0 ? filesArray : (baseTask?.files ?? ['src/app/(admin)/admin/page.tsx']),
      action: (editableAction || prompt || baseTask?.action || 'Ejecutar directiva CEO').slice(0, 1800),
      scaffold: (masterPrompt || editableYaml || baseTask?.scaffold || prompt).slice(0, 7800),
      done_when: (editableValidation || baseTask?.done_when || 'npx tsc --noEmit -> Exit Code 0').slice(0, 480),
      validation: (editableValidation || baseTask?.validation || 'npx tsc --noEmit -> Exit Code 0').slice(0, 480),
    };

    setIsInjecting(true);
    setInjectMessage(null);
    try {
      const res = await fetch('/api/admin/tasks/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: payloadTask })
      });
      const data = await res.json();
      if (data.ok || data.success) {
        setInjected(true);
        setInjectMessage(`Tarea inyectada en tasks_queue.json con ID: ${data.task?.id || payloadTask.id}`);
      } else {
        setInjectMessage(`Error al inyectar: ${data.error || 'Verifica tu sesión admin'}`);
      }
    } catch (e) {
      console.error(e);
      setInjectMessage('Error de red al inyectar en tasks_queue.json');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] space-y-6 max-w-7xl mx-auto font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
        <span>/</span>
        <span>IA &amp; GPU</span>
        <span>/</span>
        <span className="text-[#ecb613]">Oráculo &amp; Compilador Maestro</span>
      </div>

      {/* Header S-Class */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-syne tracking-tight text-white uppercase">
            COMPILADOR MAESTRO &amp; ORÁCULO CUÁNTICO S-CLASS
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Bóveda de Crecimiento &bull; <span className="text-[#ecb613]">tasks_queue.json</span> &bull; Doctrina Inmutable Exit Code 0
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 font-bold flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>AMD RX 7900 XTX (24GB)</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-xs font-mono text-[#ecb613] font-bold">
            Exit Code 0
          </div>
        </div>
      </div>

      {/* Selector Soberano del Oráculo: Modo CEO vs Modo Artista */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#09090f] via-[#0b0b14] to-[#08080c] border border-zinc-800/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" />
              <span>Prisma Cognitivo del Oráculo</span>
            </div>
            <h3 className="text-lg font-bold font-['Syne'] text-white">
              {oraclePersona === 'CEO' ? '👑 Modo CEO & Empresario de Alto Standing' : '🎸 Modo Artista Soberano & Mentoría Musical'}
            </h3>
            <p className="text-xs text-zinc-400 max-w-2xl">
              {activeDoctrine.nombre}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950/90 p-1.5 rounded-xl border border-zinc-800">
            <button
              onClick={() => {
                setOraclePersona('CEO');
                setOracleResult(null);
              }}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition ${oraclePersona === 'CEO'
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Modo CEO / Empresario</span>
            </button>

            <button
              onClick={() => {
                setOraclePersona('ARTISTA');
                setOracleResult(null);
              }}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition ${oraclePersona === 'ARTISTA'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
            >
              <Music2 className="w-3.5 h-3.5" />
              <span>Modo Artista Soberano</span>
            </button>
          </div>
        </div>

        {/* Levers Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 mt-4 border-t border-zinc-800/60">
          {activeDoctrine.principios.slice(0, 3).map((p, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-[11px] font-mono text-zinc-300 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613] shrink-0 mt-0.5" />
              <span className="line-clamp-2">{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid Two-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Prompt & Controls */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" /> Visión del Negocio
              </label>
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                {(['QUIRURGICO', 'OMEGA_FULLSTACK'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={'px-2.5 py-1 text-[10px] font-mono rounded-md transition ' + (mode === m ? 'bg-[#ecb613] text-black font-bold' : 'text-zinc-400 hover:text-white')}
                  >
                    {m === 'QUIRURGICO' ? 'Quirúrgico' : 'Omega Full-Stack'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[10px] font-mono uppercase text-zinc-500">Motor de ejecución</label>
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 ml-auto">
                {(['OLLAMA', 'CLOUD'] as const).map(e => (
                  <button
                    key={e}
                    onClick={() => setEngine(e)}
                    className={'px-2.5 py-1 text-[10px] font-mono rounded-md transition flex items-center gap-1 ' + (engine === e ? 'bg-[#ecb613] text-black font-bold' : 'text-zinc-400 hover:text-white')}
                  >
                    {e === 'OLLAMA' ? <Cpu className="w-3 h-3" /> : <Cloud className="w-3 h-3" />}
                    {e === 'OLLAMA' ? 'Ollama Local' : 'Cloud Edge'}
                  </button>
                ))}
              </div>
            </div>

            {/* GPU Inference Control Panel */}
            {engine === 'OLLAMA' && (
              <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase text-cyan-300 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5" /> Modelo GPU & Telemetría VRAM
                  </label>
                  <button
                    onClick={() => void refreshGpuStatus()}
                    disabled={isRefreshingGpu}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-300 transition disabled:opacity-50"
                    title="Refrescar estado de la GPU"
                  >
                    <RefreshCw className={'w-3.5 h-3.5 ' + (isRefreshingGpu ? 'animate-spin' : '')} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                    <div className="text-[10px] font-mono text-zinc-500">VRAM Ocupada</div>
                    <div className="text-sm font-mono text-cyan-300 font-bold">
                      {gpuStatus ? ((gpuStatus.usedVramMB / 1024).toFixed(1) + ' GB') : '—'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                    <div className="text-[10px] font-mono text-zinc-500">VRAM Libre</div>
                    <div className="text-sm font-mono text-emerald-400 font-bold">
                      {gpuStatus ? ((gpuStatus.freeVramMB / 1024).toFixed(1) + ' GB') : '—'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-center">
                    <div className="text-[10px] font-mono text-zinc-500">Iteración</div>
                    <div className="text-sm font-mono text-[#ecb613] font-bold">
                      {lastLatency !== null ? (lastLatency + ' ms') : '—'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono text-zinc-500">Modelo de razonamiento</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    {gpuModels.length === 0
                      ? [
                        { id: 'qwen3.8-27b-fast:latest', label: 'Qwen3.8 27B FAST', paramSize: '27B' },
                        { id: 'ear-32b-architect:latest', label: 'EAR-32B Architect', paramSize: '32B' },
                        { id: 'ear-14b-speed:latest', label: 'EAR-14B Speed', paramSize: '14B' }
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedModel(m.id)}
                          className={'px-2 py-2 rounded-lg border text-[10px] font-mono transition ' + (selectedModel === m.id ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-cyan-500/30')}
                        >
                          {m.paramSize} &bull; {m.label.replace('Qwen3.8 27B FAST', '27B Fast').replace('EAR-32B Architect', '32B Arch').replace('EAR-14B Speed', '14B Speed')}
                        </button>
                      ))
                      : gpuModels.map(m => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedModel(m.id)}
                          className={'px-2 py-2 rounded-lg border text-[10px] font-mono transition ' + (selectedModel === m.id ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-cyan-500/30')}
                        >
                          {m.paramSize} &bull; {m.label}
                        </button>
                      ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-3.5 h-3.5 text-[#ecb613]" />
                    <span className="text-[10px] font-mono text-zinc-400">Forja el Prompt Maestro (nivel frontera)</span>
                  </div>
                  <button
                    onClick={() => setForgeEnabled(v => !v)}
                    className={'relative w-9 h-5 rounded-full transition ' + (forgeEnabled ? 'bg-[#ecb613]' : 'bg-zinc-700')}
                    title={forgeEnabled ? 'Forja activada' : 'Forja desactivada'}
                  >
                    <span className={'absolute top-0.5 w-4 h-4 rounded-full bg-black transition ' + (forgeEnabled ? 'left-4' : 'left-0.5')} />
                  </button>
                </div>

                <button
                  onClick={() => void handlePreloadModel(selectedModel)}
                  disabled={isPreloading !== null}
                  className="w-full px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isPreloading === selectedModel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  {isPreloading === selectedModel ? 'Cargando en VRAM...' : 'Precargar modelo en VRAM (adiós cold-start)'}
                </button>
              </div>
            )}

            
            {/* 🧭 SELECTORES DE LA GUÍA MAESTRA · SSOT: src/lib/compiler/master-guide.ts */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-[#ecb613]/25 space-y-3.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#ecb613] font-bold flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-[#ecb613]" /> Guía Maestra S-Class (Control 100% Autónomo CEO)
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Doctrina Exit Code 0</span>
              </div>

              {/* Galería de Plantillas Ejecutivas 1-Clic */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#ecb613]">⚡ Plantillas Ejecutivas de 1 Clic (Carga Automática)</label>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {MASTER_EXECUTIVE_TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="p-2 rounded-xl text-left border bg-black/50 border-zinc-800 hover:border-[#ecb613]/60 text-zinc-300 hover:text-white text-[11px] font-mono transition"
                    >
                      <div className="font-bold truncate text-white">{tpl.title}</div>
                      <div className="text-[9px] text-[#ecb613] truncate">{tpl.badge}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 0A: Dominio / Unidad de Negocio Aislada */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">0A. Unidad de Negocio / Dominio Aislado</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {MASTER_DOMAINS.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedDomain(item.id)}
                      className={'p-2 rounded-xl text-left border text-xs font-mono transition ' + (selectedDomain === item.id ? 'bg-[#ecb613]/15 border-[#ecb613] text-[#ecb613] font-bold' : 'bg-black/40 border-zinc-800/80 text-zinc-400 hover:text-white')}
                    >
                      <div className="truncate">{item.label}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{item.hint}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 0B: Perfil de Cliente / Interlocutor */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">0B. Perfil de Interlocutor / Cliente</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {MASTER_STAKEHOLDERS.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedStakeholder(item.id)}
                      className={'p-2 rounded-xl text-left border text-xs font-mono transition ' + (selectedStakeholder === item.id ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300 font-bold' : 'bg-black/40 border-zinc-800/80 text-zinc-400 hover:text-white')}
                    >
                      <div className="truncate">{item.label}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{item.hint}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 1: Objetivo de Negocio */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">1. Objetivo de Negocio</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {MASTER_OBJECTIVES.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedObjective(item.id)}
                      className={'p-2 rounded-xl text-left border text-xs font-mono transition ' + (selectedObjective === item.id ? 'bg-[#ecb613]/15 border-[#ecb613] text-[#ecb613] font-bold' : 'bg-black/40 border-zinc-800/80 text-zinc-400 hover:text-white')}
                    >
                      <div className="truncate">{item.label}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{item.hint}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 2: Táctica de la Bóveda de Crecimiento */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">2. Táctica de la Bóveda de Crecimiento</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {MASTER_TACTICS.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTactic(item.id)}
                      className={'p-2 rounded-xl text-left border text-xs font-mono transition ' + (selectedTactic === item.id ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold' : 'bg-black/40 border-zinc-800/80 text-zinc-400 hover:text-white')}
                    >
                      <div className="truncate">{item.label}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{item.hint}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 3: Destinatario del Prompt */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">3. ¿A qué IA o Agente se lo entregarás?</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {MASTER_TARGETS.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTargetAgent(item.id)}
                      className={'p-2 rounded-xl text-center border text-xs font-mono transition ' + (selectedTargetAgent === item.id ? 'bg-[#FF2B44]/15 border-[#FF2B44] text-[#FF2B44] font-bold' : 'bg-black/40 border-zinc-800/80 text-zinc-400 hover:text-white')}
                    >
                      <div className="truncate">{item.label}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{item.hint}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auditor Pre-Vuelo en Vivo */}
              <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-300 uppercase">Auditor Pre-Vuelo de Claridad</span>
                  <span className={readiness.score >= 75 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    Precisión: {readiness.score}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {readiness.checks.map(chk => (
                    <div
                      key={chk.id}
                      title={chk.tip}
                      className={'px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1.5 ' + (chk.passed ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/20' : 'bg-zinc-900/60 text-zinc-500 border border-zinc-800')}
                    >
                      <CheckCircle2 className={'w-3 h-3 shrink-0 ' + (chk.passed ? 'text-emerald-400' : 'text-zinc-600')} />
                      <span className="truncate">{chk.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={
                oraclePersona === 'CEO'
                  ? "Ejemplo: Diseñar una estrategia de sobredemanda para captar 20 fincas de bodas en Valencia y Sevilla sin pagar a directorios..."
                  : "Ejemplo: Negociar con una pareja indecisa que pide rebajar el caché de 350 € sin devaluar la solvencia de Edwin Agudelo..."
              }
              rows={7}
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#ecb613] transition resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVoice}
                  disabled={isCompiling}
                  className={'px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-50 ' + (isListening ? 'bg-[#FF2B44]/15 border-[#FF2B44]/50 text-[#FF2B44]' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-[#ecb613]/50')}
                >
                  {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isListening ? 'Detener' : 'Voz'}
                </button>

                <button
                  onClick={handleRefineWithOracle}
                  disabled={!prompt.trim() || isCompiling}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-[#ecb613] text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-40"
                  title="Amplificar con los principios de la Bóveda de Crecimiento"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Refinar con Oráculo</span>
                </button>
              </div>

              <button
                onClick={handleCompile}
                disabled={isCompiling || !prompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-500 text-black font-bold text-xs font-mono flex items-center gap-2 transition disabled:opacity-50 shadow-lg shadow-[#ecb613]/20"
              >
                <Zap className={'w-4 h-4 ' + (isCompiling ? 'animate-spin' : '')} />
                {isCompiling ? 'Compilando...' : 'Compilar a DAG'}
              </button>
            </div>
          </div>

          {/* Oracle Insight Preview Card */}
          {oracleResult && (
            <div className="p-4 rounded-2xl bg-[#090910] border border-[#ecb613]/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#ecb613] font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Directivas del Oráculo ({oracleResult.persona})
                </span>
                <span className="text-[10px] text-zinc-500">Regla 10 Activa</span>
              </div>

              <div className="text-xs font-mono text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-zinc-800 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                {oracleResult.refinedPrompt}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {oracleResult.tacticalLevers.map((lever, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
                    &bull; {lever}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 text-xs font-mono text-zinc-400 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-[#ecb613]" /> Blindaje Zero-Alucinación
            </div>
            <p className="text-[11px] text-zinc-500">
              Validación inmutable: SSOT Méntrida, 350 € Solista, Split 80/10/10, Depósito Stripe 100 € SHA-256 y Exit Code 0.
            </p>
          </div>
        </div>

        {/* Right Column: Compiled Manifest DAG & Editable Studio */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {compileError && (
            <div className="p-4 rounded-2xl bg-[#FF2B44]/10 border border-[#FF2B44]/40 text-xs font-mono text-[#FF2B44]">
              {compileError}
            </div>
          )}

          {injectMessage && (
            <div className={'p-4 rounded-2xl border text-xs font-mono ' + (injected ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-amber-500/10 border-amber-500/40 text-amber-300')}>
              {injectMessage}
            </div>
          )}

          {/* Forged Master Prompt Studio (Edición Palabra por Palabra) */}
          <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-[#ecb613]/30 backdrop-blur-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#ecb613]" />
                <span className="text-xs font-mono uppercase text-[#ecb613] font-bold">
                  Estudio de Prompt Maestro (Editable Bit a Bit / Palabra por Palabra)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingMaster(v => !v)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono transition"
                >
                  {isEditingMaster ? 'Ver Modo Lectura' : 'Editar Texto Libre'}
                </button>
                <button
                  type="button"
                  onClick={handleCopyMasterPrompt}
                  disabled={!masterPrompt}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-40"
                >
                  {copiedMaster ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMaster ? 'Copiado' : 'Copiar Prompt Maestro'}</span>
                </button>
              </div>
            </div>

            {/* Inyección rápida de bloques modulares al Prompt Maestro */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase mr-1">Insertar bloque:</span>
              {[
                { label: '+ Regla 350€ Solista', snippet: '\n- [REGLA SSOT]: Respetar suelo canónico de 350,00 € para Solista (Edwin Agudelo) + 1,50 €/km desde km 50.' },
                { label: '+ Split 80/10/10 Céntimos', snippet: '\n- [REGLA SPLIT]: Calcular reparto 80% Artista / 10% EAR OS / 10% VIMUME en céntimos enteros (integer cents).' },
                { label: '+ Acústica Ley 37/2003', snippet: '\n- [REGLA ACÚSTICA]: Garantizar < 75 dB SPL (salud pública) y 12 W/pax con limitador homologado.' },
                { label: '+ Techo B2G 14.250€', snippet: '\n- [REGLA B2G]: Contrato menor Art. 118 LCSP con tope preventivo en 14.250,00 € y SROI 4.85x.' },
                { label: '+ Cero Emojis / UNSLOP', snippet: '\n- [UNSLOP OLED]: Fondo #030305, un solo acento (#ecb613), iconos Lucide strokeWidth 1.5, cero emojis.' },
              ].map((blk) => (
                <button
                  key={blk.label}
                  type="button"
                  onClick={() => setMasterPrompt(prev => (prev || prompt || '') + blk.snippet)}
                  className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-[#ecb613]/50 text-[10px] font-mono text-zinc-300 transition"
                >
                  {blk.label}
                </button>
              ))}
            </div>

            {isEditingMaster ? (
              <textarea
                value={masterPrompt ?? ''}
                onChange={e => setMasterPrompt(e.target.value)}
                placeholder="Aquí aparecerá el Prompt Maestro al pulsar 'Compilar a DAG', o puedes escribir/pegar y modificar cualquier palabra, frase o bloque directamente aquí antes de copiarlo o inyectarlo a la cola..."
                rows={14}
                className="w-full p-4 rounded-xl bg-black border border-[#ecb613]/30 text-xs font-mono leading-relaxed text-zinc-200 focus:outline-none focus:border-[#ecb613] resize-y"
              />
            ) : (
              <pre className="p-4 rounded-xl bg-black border border-[#ecb613]/20 text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap text-zinc-300 max-h-96">
                {masterPrompt || 'Pulsa "Compilar a DAG" o activa "Editar Texto Libre" para redactar tu propio Prompt Maestro.'}
              </pre>
            )}
          </div>

          {/* Control Quirúrgico de la Tarea antes de Inyectar a tasks_queue.json */}
          <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-mono uppercase text-zinc-300 font-bold">
                Parámetros Exactos de la Orden para tasks_queue.json (100% Editables)
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Modifica cualquier campo libremente</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400">Título de la Tarea</label>
                <input
                  type="text"
                  value={editableTitle}
                  onChange={e => setEditableTitle(e.target.value)}
                  placeholder="Ej: B0.Omega: Unificar fichas y cotizador..."
                  className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400">Comando de Verificación (Done When)</label>
                <input
                  type="text"
                  value={editableValidation}
                  onChange={e => setEditableValidation(e.target.value)}
                  placeholder="npx tsc --noEmit -> Exit Code 0"
                  className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-[#ecb613]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400">Archivos Autorizados (1 por línea)</label>
                <textarea
                  value={editableFiles}
                  onChange={e => setEditableFiles(e.target.value)}
                  rows={3}
                  placeholder={'src/app/(admin)/admin/page.tsx\nsrc/components/hubs/SovereignIntentHubView.tsx'}
                  className="mt-1 w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-[#ecb613]"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400">Resumen de Acción Ejecutiva</label>
                <textarea
                  value={editableAction}
                  onChange={e => setEditableAction(e.target.value)}
                  rows={3}
                  placeholder="Describe exactamente qué cambio quieres que ejecute el obrero..."
                  className="mt-1 w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#ecb613]"
                />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md flex flex-col flex-1 min-h-[380px]">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#ecb613]" />
                <span className="text-xs font-mono uppercase text-zinc-300">Manifiesto DAG YAML · servidor propio</span>
              </div>
              <div className="flex items-center gap-2">
                {compiledData && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    ~{Math.round((editableYaml || compiledData.yaml).length / 4)} tokens
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingDag(v => !v)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono transition"
                >
                  {isEditingDag ? 'Vista Coloreada' : 'Editar YAML'}
                </button>
                <button onClick={handleCopyYAML} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar DAG'}</span>
                </button>
                <button onClick={handleInjectQueue} disabled={isInjecting} className="px-3 py-1.5 rounded-lg bg-[#ecb613]/20 hover:bg-[#ecb613]/30 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-50">
                  {injected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isInjecting ? 'Inyectando...' : injected ? 'En Cola (Re-inyectar)' : 'Inyectar a tasks_queue.json'}</span>
                </button>
              </div>
            </div>
            {isEditingDag ? (
              <textarea
                value={editableYaml}
                onChange={e => setEditableYaml(e.target.value)}
                rows={14}
                placeholder="Puedes editar cada línea del YAML aquí..."
                className="flex-1 w-full p-4 rounded-xl bg-black border border-[#ecb613]/30 text-[11px] font-mono leading-relaxed text-zinc-200 focus:outline-none focus:border-[#ecb613]"
              />
            ) : compiledData || editableYaml ? (
              <pre className="flex-1 p-4 rounded-xl bg-black border border-zinc-800 text-[11px] font-mono leading-relaxed overflow-x-auto selection:bg-emerald-950 selection:text-white max-h-96">
                {yamlLines.map((line, i) => (
                  <div key={i} className={line.className}>{line.text || ' '}</div>
                ))}
              </pre>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-zinc-800 rounded-xl">
                <Terminal className="w-10 h-10 text-zinc-700 mb-3" />
                <p className="text-sm text-zinc-400 font-medium mb-1">Esperando entrada del Oráculo o Edición Directa</p>
                <p className="text-xs text-zinc-600 font-mono max-w-sm">
                  Escribe tu visión comercial a la izquierda y pulsa &apos;Compilar a DAG&apos;, o edita directamente el Prompt Maestro arriba e inyéctalo a la cola.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
