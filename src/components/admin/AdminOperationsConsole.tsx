'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  ShieldCheck,
  Database,
  CreditCard,
  Sparkles,
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import {
  ADMIN_SYSTEM_SCRIPTS,
  SCRIPT_CATEGORY_METADATA,
  ScriptCategory,
  SystemScriptItem,
} from '@/lib/constants/admin-system-scripts';

export default function AdminOperationsConsole() {
  const [selectedCategory, setSelectedCategory] = useState<ScriptCategory>('runtime_resilience');
  const [runningScriptId, setRunningScriptId] = useState<string | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string>(
    '# EAR OS S-CLASS · CONSOLA DE RESCATE Y OPERACIONES CEO\n# Selecciona una categoría y pulsa "Ejecutar Script" para iniciar.'
  );
  const [lastExecution, setLastExecution] = useState<{
    scriptId: string;
    success: boolean;
    durationMs: number;
    exitCode: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [memoryAlert, setMemoryAlert] = useState<boolean>(false);

  // Monitor simulado/proactivo de saturación de desarrollo
  useEffect(() => {
    // Si la memoria heap o sesión dura mucho, podemos mostrar un badge preventivo
    const checkTurbopackHealth = () => {
      // Detección heurística de rendimiento en cliente
      if (typeof window !== 'undefined' && (performance as any)?.memory) {
        const mem = (performance as any).memory;
        if (mem.usedJSHeapSize > 150 * 1024 * 1024) {
          setMemoryAlert(true);
        }
      }
    };
    checkTurbopackHealth();
  }, []);

  const handleRunScript = async (script: SystemScriptItem) => {
    setRunningScriptId(script.id);
    setConsoleOutput((prev) => `${prev}\n\n$ ${script.command}\n[INICIANDO]: Ejecutando ${script.name}...`);

    try {
      const res = await fetch('/api/admin/system/run-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId: script.id }),
      });

      const data = await res.json();

      if (data.success) {
        setConsoleOutput(
          (prev) => `${prev}\n[EXIT CODE 0] (${data.durationMs}ms):\n${data.output || 'Ejecución completada con éxito.'}`
        );
        setLastExecution({
          scriptId: script.id,
          success: true,
          durationMs: data.durationMs,
          exitCode: 0,
        });
      } else {
        setConsoleOutput(
          (prev) => `${prev}\n[ERROR - EXIT CODE ${data.exitCode}] (${data.durationMs || 0}ms):\n${data.output || data.error}`
        );
        setLastExecution({
          scriptId: script.id,
          success: false,
          durationMs: data.durationMs || 0,
          exitCode: data.exitCode || 1,
        });
      }
    } catch (err: any) {
      setConsoleOutput((prev) => `${prev}\n[FALLO DE RED / CUELLO DE BOTELLA]: ${err.message}`);
    } finally {
      setRunningScriptId(null);
    }
  };

  const filteredScripts = ADMIN_SYSTEM_SCRIPTS.filter((s) => s.category === selectedCategory);
  const activeCategoryMeta = SCRIPT_CATEGORY_METADATA[selectedCategory];

  const renderIcon = (cat: ScriptCategory) => {
    switch (cat) {
      case 'runtime_resilience':
        return <Flame className="w-4 h-4 text-[#FF2B44]" />;
      case 'type_sanity':
        return <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />;
      case 'database_seeds':
        return <Database className="w-4 h-4 text-[#ecb613]" />;
      case 'payments_webhooks':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'maintenance_housekeeping':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="w-full bg-[#08080C] border border-white/10 rounded-2xl p-6 text-white space-y-6 shadow-2xl">
      {/* ── ALERTA PROACTIVA DE SATURACIÓN ── */}
      {memoryAlert && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Aviso Preventivo de Memoria:</strong> El entorno local acumula bastante actividad. Si experimentas lentitud, usa el botón <strong>«Vaciar Caché .next»</strong> para prevenir congelamientos.
            </span>
          </div>
          <button
            onClick={() => setMemoryAlert(false)}
            className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-500/20 rounded hover:bg-amber-500/30"
          >
            Entendido
          </button>
        </div>
      )}

      {/* ── CABECERA DE LA CONSOLA ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-syne text-white flex items-center gap-2">
                Centro de Mando & Operaciones S-Class
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  NIVEL 1 · WEB
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Ejecución unificada de scripts de resiliencia, comprobación y mantenimiento sin abrir la terminal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Rescue.bat listo en raíz</span>
          </div>
        </div>
      </div>

      {/* ── SELECTOR DE CATEGORÍAS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {(Object.keys(SCRIPT_CATEGORY_METADATA) as ScriptCategory[]).map((cat) => {
          const meta = SCRIPT_CATEGORY_METADATA[cat];
          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-white/10 border-white/30 shadow-lg'
                  : 'bg-black/40 border-white/5 hover:bg-white/5 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between">
                {renderIcon(cat)}
                <span className="text-[9px] font-mono font-bold uppercase text-zinc-500">
                  {ADMIN_SYSTEM_SCRIPTS.filter((s) => s.category === cat).length} scripts
                </span>
              </div>
              <div>
                <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {meta.label}
                </span>
                <span className="text-[10px] text-zinc-500 line-clamp-1">{meta.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── GRILLA DE SCRIPTS DE LA CATEGORÍA ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono uppercase font-bold text-zinc-500">
            {activeCategoryMeta.label} ({filteredScripts.length})
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            Haga clic en «Ejecutar» para disparar en el backend local
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredScripts.map((script) => {
            const isRunning = runningScriptId === script.id;

            return (
              <div
                key={script.id}
                className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col justify-between gap-3 hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-white font-syne">{script.name}</span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                        script.isDangerous
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-white/10 text-zinc-300 border-white/15'
                      }`}
                    >
                      {script.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">{script.description}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <code className="text-[10px] font-mono text-zinc-500 truncate max-w-[170px]" title={script.command}>
                    {script.command}
                  </code>
                  <button
                    onClick={() => handleRunScript(script)}
                    disabled={isRunning}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      isRunning
                        ? 'bg-amber-500/20 text-amber-300 cursor-wait'
                        : script.isDangerous
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30'
                        : 'bg-[#ecb613] hover:bg-amber-400 text-black shadow-md'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Ejecutando...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Ejecutar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CONSOLA DE SALIDA TERMINAL EN VIVO ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Terminal className="w-4 h-4 text-[#ecb613]" />
            <span>Salida de Consola en Tiempo Real</span>
            {lastExecution && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  lastExecution.success
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                Exit {lastExecution.exitCode} ({lastExecution.durationMs}ms)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(consoleOutput);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
              onClick={() => setConsoleOutput('# Consola limpia.')}
              className="text-[11px] font-mono text-zinc-400 hover:text-white bg-white/5 px-2.5 py-1 rounded-lg"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-zinc-300 h-64 overflow-y-auto whitespace-pre-wrap selection:bg-[#ecb613] selection:text-black">
          {consoleOutput}
        </div>
      </div>
    </div>
  );
}
