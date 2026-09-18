'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  ArrowLeft, 
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
  BookOpen
} from 'lucide-react';
import { 
  DOCTRINA_CEO_EMPRESARIO, 
  DOCTRINA_ARTISTA_SOBERANO, 
  refineQueryWithOracle,
  type OraclePersona,
  type OracleRefinedResult
} from '@/lib/oracle/quantum-oracle-engine';

type CompileMode = 'QUIRURGICO' | 'OMEGA_FULLSTACK';
type CompileEngine = 'OLLAMA' | 'CLOUD';

export default function VibeCodingCompilerPage() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<CompileMode>('OMEGA_FULLSTACK');
  const [engine, setEngine] = useState<CompileEngine>('OLLAMA');
  const [oraclePersona, setOraclePersona] = useState<OraclePersona>('CEO');
  const [oracleResult, setOracleResult] = useState<OracleRefinedResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledData, setCompiledData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [injected, setInjected] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const activeDoctrine = oraclePersona === 'CEO' ? DOCTRINA_CEO_EMPRESARIO : DOCTRINA_ARTISTA_SOBERANO;

  const handleRefineWithOracle = () => {
    if (!prompt.trim()) return;
    const refined = refineQueryWithOracle(prompt, oraclePersona);
    setOracleResult(refined);
  };

  const handleCompile = async () => {
    if (!prompt.trim()) return;
    setIsCompiling(true);
    setInjected(false);
    try {
      const res = await fetch('/api/admin/compile-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          intent: prompt, 
          mode, 
          engine,
          oraclePersona 
        })
      });
      const data = await res.json();
      if (data.success) {
        setCompiledData(data.compiled);
        if (data.oracle) {
          setOracleResult(data.oracle);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCompiling(false);
    }
  };

  const toggleVoice = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(prev => (prev ? prev + ' ' : '') + transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const yamlLines = useMemo(() => {
    const yaml: string = compiledData?.yaml ?? '';
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
  }, [compiledData]);

  const handleCopyYAML = () => {
    if (!compiledData?.yaml) return;
    navigator.clipboard.writeText(compiledData.yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInjectQueue = async () => {
    if (!compiledData?.jsonTask) return;
    setIsInjecting(true);
    try {
      const res = await fetch('/api/admin/tasks/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: compiledData.jsonTask })
      });
      const data = await res.json();
      if (data.success) {
        setInjected(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
        <span>/</span>
        <span>IA &amp; GPU</span>
        <span>/</span>
        <span className="text-[#ecb613]">Oráculo &amp; Meta-Compilador</span>
      </div>

      {/* Header S-Class */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white uppercase">
            META-COMPILADOR &amp; ORÁCULO CUÁNTICO S-CLASS
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
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition ${
                oraclePersona === 'CEO'
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
              className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition ${
                oraclePersona === 'ARTISTA'
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
          <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24] flex flex-col gap-4">
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

        {/* Right Column: Compiled Manifest DAG */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md flex flex-col flex-1 min-h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#ecb613]" />
                <span className="text-xs font-mono uppercase text-zinc-300">Manifiesto DAG para Bare-Metal</span>
              </div>
              {compiledData && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    ~{compiledData.estimatedTokens} tokens
                  </span>
                  <button onClick={handleCopyYAML} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar DAG'}</span>
                  </button>
                  <button onClick={handleInjectQueue} disabled={isInjecting || injected} className="px-3 py-1.5 rounded-lg bg-[#ecb613]/20 hover:bg-[#ecb613]/30 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-50">
                    {injected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{injected ? 'En Cola' : 'Inyectar a tasks_queue.json'}</span>
                  </button>
                </div>
              )}
            </div>
            {compiledData ? (
              <pre className="flex-1 p-4 rounded-xl bg-black border border-zinc-800 text-[11px] font-mono leading-relaxed overflow-x-auto selection:bg-emerald-950 selection:text-white">
                {yamlLines.map((line, i) => (
                  <div key={i} className={line.className}>{line.text || ' '}</div>
                ))}
              </pre>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-zinc-800 rounded-xl">
                <Terminal className="w-10 h-10 text-zinc-700 mb-3" />
                <p className="text-sm text-zinc-400 font-medium mb-1">Esperando entrada del Oráculo</p>
                <p className="text-xs text-zinc-600 font-mono max-w-sm">
                  Selecciona el Modo ({oraclePersona === 'CEO' ? 'CEO / Empresario' : 'Artista Soberano'}), escribe tu visión comercial a la izquierda y pulsa 'Compilar a DAG'.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
