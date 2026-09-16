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
  Square
} from 'lucide-react';

type CompileMode = 'QUIRURGICO' | 'OMEGA_FULLSTACK';
type CompileEngine = 'OLLAMA' | 'CLOUD';

export default function VibeCodingCompilerPage() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<CompileMode>('OMEGA_FULLSTACK');
  const [engine, setEngine] = useState<CompileEngine>('OLLAMA');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledData, setCompiledData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [injected, setInjected] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleCompile = async () => {
    if (!prompt.trim()) return;
    setIsCompiling(true);
    setInjected(false);
    try {
      const res = await fetch('/api/admin/compile-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent: prompt, mode, engine })
      });
      const data = await res.json();
      if (data.success) {
        setCompiledData(data.compiled);
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
    <div className="min-h-screen bg-[#030305] text-zinc-100 flex flex-col font-sans">
      <header className="border-b border-zinc-800 bg-zinc-950/60 backdrop-blur-xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#ecb613]/50 text-zinc-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#ecb613]" />
                Meta-Compilador Vibe Coding S-Class
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
                Omega v7.0
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">Lenguaje Natural Humano &mdash; Proto-Dialecto DAG (Exit Code 0)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>GPU Local / Edge Online</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" /> Tu Visión Comercial
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
              placeholder="Escribe en lenguaje natural lo que quieres construir o modificar..."
              rows={8}
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#ecb613] transition resize-none"
            />
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={toggleVoice}
                disabled={isCompiling}
                className={'px-3 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-50 ' + (isListening ? 'bg-[#FF2B44]/15 border-[#FF2B44]/50 text-[#FF2B44]' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-[#ecb613]/50')}
              >
                {isListening ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening ? 'Detener voz' : 'Hablar'}
              </button>
              <div className="text-[11px] font-mono text-zinc-500">SSOT: Méntrida, 350 EUR, Split 80/10/10</div>
              <button
                onClick={handleCompile}
                disabled={isCompiling || !prompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-500 text-black font-bold text-xs font-mono flex items-center gap-2 transition disabled:opacity-50"
              >
                <Zap className={'w-4 h-4 ' + (isCompiling ? 'animate-spin' : '')} />
                {isCompiling ? 'Compilando...' : 'Compilar a DAG'}
              </button>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 text-xs font-mono text-zinc-400 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-[#ecb613]" /> Blindaje Zero-Alucinación
            </div>
            <p className="text-[11px] text-zinc-500">Inyecta validación estricta: Next.js App Router (async params), Netlify &lt; 80 MB y npx tsc exit 0.</p>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md flex flex-col flex-1 min-h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#ecb613]" />
                <span className="text-xs font-mono uppercase text-zinc-300">Manifiesto DAG para IA</span>
              </div>
              {compiledData && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    ~{compiledData.estimatedTokens} tokens
                  </span>
                  <button onClick={handleCopyYAML} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar DAG para Cline / Cursor'}</span>
                  </button>
                  <button onClick={handleInjectQueue} disabled={isInjecting || injected} className="px-3 py-1.5 rounded-lg bg-[#ecb613]/20 hover:bg-[#ecb613]/30 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono flex items-center gap-1.5 transition disabled:opacity-50">
                    {injected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{injected ? 'En Cola' : 'Inyectar Directo a tasks_queue.json'}</span>
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
                <p className="text-sm text-zinc-400 font-medium mb-1">Esperando entrada de visión</p>
                <p className="text-xs text-zinc-600 font-mono max-w-sm">Escribe tu idea comercial a la izquierda y pulsa 'Compilar a DAG'.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
