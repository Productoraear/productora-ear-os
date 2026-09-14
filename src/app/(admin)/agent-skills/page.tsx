'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  ShieldCheck,
  Zap,
  Code2,
  Bug,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Cpu,
  FileText
} from 'lucide-react';

interface Stage {
  id: string;
  name: string;
  boxTitle: string;
  boxSubtitle: string;
  command: string;
  badgeColor: string;
  tagline: string;
  principles: string[];
  excuses: { excuse: string; rebuttal: string }[];
  status: 'READY' | 'ACTIVE' | 'PASSED';
}

const LIFECYCLE_STAGES: Stage[] = [
  {
    id: 'define',
    name: 'DEFINE',
    boxTitle: 'Idea',
    boxSubtitle: 'Refine',
    command: '/spec',
    badgeColor: '#3B82F6', // Blue
    tagline: 'Spec before code. No implementation without unambiguous acceptance criteria.',
    principles: [
      'Capturar user stories y contratos de entrada/salida antes de tocar una sola línea de código.',
      'Eliminar ambigüedades técnicas y suposiciones subjetivas ("vibe coding").',
      'Definir límites de error, tipos estrictos y dependencias directas.'
    ],
    excuses: [
      {
        excuse: 'Esta tarea es demasiado pequeña o simple para requerir una spec.',
        rebuttal: 'Las tareas "simples" sin spec generan la mayor cantidad de bugs y regresiones silenciosas.'
      },
      {
        excuse: 'Prefiero picar el código y escribir la documentación después.',
        rebuttal: 'La spec no es documentación decorativa; es el contrato de éxito comprobable.'
      }
    ],
    status: 'PASSED'
  },
  {
    id: 'plan',
    name: 'PLAN',
    boxTitle: 'Spec',
    boxSubtitle: 'PRD',
    command: '/plan',
    badgeColor: '#EF4444', // Red
    tagline: 'Small, atomic, dependency-ordered tasks. Sincronizado con tasks_queue.json.',
    principles: [
      'Desglosar el requerimiento en tareas atómicas de 20-30 minutos de ejecución máxima.',
      'Establecer orden estricto de dependencias (tipos primero, lógica después, vistas al final).',
      'Cada hito debe tener un comando de validación reproducible (npx tsc --noEmit).'
    ],
    excuses: [
      {
        excuse: 'Puedo programar todo de una sola vez en un paso gigante.',
        rebuttal: 'Los monolitos saturan la ventana de contexto y hacen imposible aislar errores de compilación.'
      },
      {
        excuse: 'El plan es obvio para cualquier desarrollador.',
        rebuttal: 'Si es obvio, desglosarlo en 3 pasos ordenados toma 30 segundos y garantiza Exit Code 0.'
      }
    ],
    status: 'PASSED'
  },
  {
    id: 'build',
    name: 'BUILD',
    boxTitle: 'Code',
    boxSubtitle: 'Impl',
    command: '/build',
    badgeColor: '#EAB308', // Yellow
    tagline: 'Build incrementally, one slice at a time. Server Components por defecto.',
    principles: [
      'Construcción modular bajo Next.js 14/15 App Router.',
      'Parámetros dinámicos siempre asíncronos (const p = await params).',
      'Cero tipos "any" implícitos; tipos estrictos y reutilizables en src/lib.'
    ],
    excuses: [
      {
        excuse: 'Usar any ahorra tiempo y no afecta a producción.',
        rebuttal: 'El tipo any destruye la seguridad del sistema y provoca fallos de hidratación en Netlify/Vercel.'
      },
      {
        excuse: 'Probaré si funciona en el navegador al terminar toda la vista.',
        rebuttal: 'La compilación continua en terminal detecta errores sintácticos antes de ensuciar el árbol Git.'
      }
    ],
    status: 'ACTIVE'
  },
  {
    id: 'verify',
    name: 'VERIFY',
    boxTitle: 'Test',
    boxSubtitle: 'Debug',
    command: '/test',
    badgeColor: '#10B981', // Green
    tagline: 'Tests are proof. Zero tolerance for unverified assumptions.',
    principles: [
      'Validación obligatoria de compilación estricta: npx tsc --noEmit -> Exit Code 0.',
      'Pruebas sintéticas de contratos de negocio (Tarifa 350€, Split 80/10/10, B2G < 14.250€).',
      'Verificación de endpoints API y proxies de telemetría.'
    ],
    excuses: [
      {
        excuse: 'No cambié nada crítico, seguro que sigue compilando.',
        rebuttal: 'Verificar cuesta 3 segundos. Asumir cuesta horas de depuración en despliegues fallidos.'
      },
      {
        excuse: 'Los tests unitarios son redundantes con Next.js.',
        rebuttal: 'Los tests son el seguro de vida que evita que un cambio rompa el cotizador neural.'
      }
    ],
    status: 'READY'
  },
  {
    id: 'review',
    name: 'REVIEW',
    boxTitle: 'QA',
    boxSubtitle: 'Gate',
    command: '/review',
    badgeColor: '#3B82F6', // Blue
    tagline: 'Gate quality before merge. Auditoría adversarial contra AI Slop y fugas.',
    principles: [
      'Auditoría de seguridad militar: HSTS, CSP estricto y saneamiento de entradas.',
      'Veto Estratégico inmutable: Prohibido exponer STRIPE_SECRET_KEY en cliente.',
      'Anti-Slop visual: Prohibidos degradados violeta/azul genéricos; estética OLED pura (#030305).'
    ],
    excuses: [
      {
        excuse: 'El código hace lo que pide, no hace falta revisar la estética ni la seguridad.',
        rebuttal: 'Un código funcional pero vulnerable o con AI Slop devalúa el estándar S-Class de EAR OS.'
      },
      {
        excuse: 'Revisaremos la seguridad en el próximo sprint.',
        rebuttal: 'La revisión de seguridad es una compuerta previa al commit, jamás posterior.'
      }
    ],
    status: 'READY'
  },
  {
    id: 'simplify',
    name: 'SIMPLIFY',
    boxTitle: 'Refactor',
    boxSubtitle: 'Clean',
    command: '/code-simplify',
    badgeColor: '#EF4444', // Red
    tagline: 'Clarity over cleverness. Poda de abstracciones innecesarias y código muerto.',
    principles: [
      'Eliminar props huérfanas, imports no utilizados y abstracciones prematuras (YAGNI).',
      'Reducir la complejidad ciclomática de funciones a menos de 50 líneas cuando sea posible.',
      'Preservar la legibilidad con tipografía Inter y Syne.'
    ],
    excuses: [
      {
        excuse: 'Podríamos necesitar esta clase o función genérica en el futuro.',
        rebuttal: 'YAGNI: El código no usado es pasivo técnico que confunde a los futuros agentes.'
      },
      {
        excuse: 'Es una solución muy ingeniosa en una sola línea.',
        rebuttal: 'Si necesitas un párrafo para descifrarla, es una mala solución.'
      }
    ],
    status: 'READY'
  },
  {
    id: 'ship',
    name: 'SHIP',
    boxTitle: 'Deploy',
    boxSubtitle: 'Prod',
    command: '/ship',
    badgeColor: '#10B981', // Green
    tagline: 'Faster is safer with verified quality gates. Repo ultraligero (<50 MB).',
    principles: [
      'Auditoría pre-commit estricta: git status limpio y sin binarios pesados > 1 MB.',
      'Despliegue a Netlify Edge / Vercel con respuesta HTTP 200 en todos los dominios.',
      'Cierre de hito con reporte estructurado en tasks_queue.json.'
    ],
    excuses: [
      {
        excuse: 'Usemos git add -A para terminar más rápido.',
        rebuttal: 'git add -A a ciegas puede commitear bases de datos de 200 MB y bloquear el repositorio.'
      },
      {
        excuse: 'El build falla en Netlify pero en local funciona.',
        rebuttal: 'La validación npx tsc --noEmit en local debe ser idéntica a la del runner de Netlify.'
      }
    ],
    status: 'READY'
  }
];

export default function AgentSkillsPage() {
  const [selectedStage, setSelectedStage] = useState<Stage>(LIFECYCLE_STAGES[0]);

  return (
    <div className="min-h-screen bg-[#030305] text-[#F3F4F6] font-sans antialiased selection:bg-[#ecb613]/20 selection:text-[#ecb613] pb-24 w-full overflow-x-hidden">
      {/* Header S-Class */}
      <header className="border-b border-[#1A1A24] bg-[#050507]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/command-center"
              className="p-2.5 rounded-lg border border-[#262638] bg-[#09090F] hover:border-[#ecb613]/50 text-[#A1A1AA] hover:text-[#F3F4F6] transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] font-semibold">
                  ADDY OSMANI // AGENT SKILLS
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  7 QUALITY GATES ACTIVAS
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-serif mt-1">
                Ciclo de Vida de Ingeniería Senior (Agent Skills)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/addyosmani/agent-skills"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg border border-[#262638] bg-[#09090F] hover:border-zinc-500 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Repo Oficial GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-10">
        {/* ========================================================================= */}
        {/* EL DIAGRAMA VISUAL DEL CICLO DE VIDA (Fiel a la captura del usuario)       */}
        {/* ========================================================================= */}
        <div className="p-8 rounded-2xl border border-[#1A1A24] bg-[#07070B] shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1A1A24]">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ecb613]" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Flujo Canónico: De la Idea al Despliegue en Producción
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              Clic en cualquier fase para inspeccionar directivas y anti-rationalization
            </span>
          </div>

          {/* Diagrama de Cajas Horizontales */}
          <div className="overflow-x-auto pb-4">
            <div className="flex items-center gap-3 min-w-[920px] justify-between">
              {LIFECYCLE_STAGES.map((stage, idx) => {
                const isSelected = selectedStage.id === stage.id;
                return (
                  <React.Fragment key={stage.id}>
                    {/* Caja de Fase */}
                    <button
                      type="button"
                      onClick={() => setSelectedStage(stage)}
                      className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all cursor-pointer flex-1 group relative ${
                        isSelected
                          ? 'border-[#ecb613] bg-[#ecb613]/10 scale-105 shadow-lg shadow-[#ecb613]/10'
                          : 'border-[#1F1F2E] bg-[#0C0C14] hover:border-zinc-500 hover:bg-[#12121E]'
                      }`}
                    >
                      {/* Nombre de Fase Superior */}
                      <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold mb-2">
                        {stage.name}
                      </span>

                      {/* Caja Interna [Idea | Refine] */}
                      <div className="w-full py-3 px-2 rounded-lg border border-dashed border-zinc-700/80 bg-[#050508] flex flex-col items-center justify-center font-mono">
                        <span className="text-sm font-bold text-white">{stage.boxTitle}</span>
                        <span className="text-xs text-zinc-400">{stage.boxSubtitle}</span>
                      </div>

                      {/* Comando Slash Inferior */}
                      <span
                        style={{ color: stage.badgeColor }}
                        className="text-xs font-mono font-bold mt-2.5 px-2 py-0.5 rounded bg-[#050508] border border-zinc-800"
                      >
                        {stage.command}
                      </span>

                      {/* Estado */}
                      <div className="mt-2 flex items-center gap-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            stage.status === 'ACTIVE'
                              ? 'bg-[#EAB308] animate-pulse'
                              : stage.status === 'PASSED'
                              ? 'bg-[#10B981]'
                              : 'bg-zinc-600'
                          }`}
                        />
                        <span className="text-[9px] font-mono text-zinc-400">{stage.status}</span>
                      </div>
                    </button>

                    {/* Flecha conectora */}
                    {idx < LIFECYCLE_STAGES.length - 1 && (
                      <div className="text-zinc-600 font-mono text-lg font-bold select-none px-1">
                        →
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DETALLE DE LA FASE SELECCIONADA & ANTI-RATIONALIZATION                     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Principios y Mandatos de la Fase */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-xl border border-[#1A1A24] bg-[#09090F] space-y-5">
              <div className="flex items-center justify-between border-b border-[#1A1A24] pb-4">
                <div className="flex items-center gap-3">
                  <span
                    style={{ backgroundColor: `${selectedStage.badgeColor}20`, borderColor: `${selectedStage.badgeColor}50`, color: selectedStage.badgeColor }}
                    className="text-sm font-mono font-bold px-3 py-1 rounded-lg border"
                  >
                    {selectedStage.command}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Fase {selectedStage.name} ({selectedStage.boxTitle} & {selectedStage.boxSubtitle})
                  </h3>
                </div>
              </div>

              {/* Tagline */}
              <div className="p-4 rounded-lg bg-[#050507] border border-[#1A1A24]">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                  Principio Rector
                </span>
                <p className="text-sm text-zinc-200 font-serif italic">
                  "{selectedStage.tagline}"
                </p>
              </div>

              {/* Reglas de la Fase */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  Checklist Obligatorio para el Agente
                </h4>
                <ul className="space-y-2.5">
                  {selectedStage.principles.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                      <span className="font-mono text-zinc-600 font-bold mt-0.5">{i + 1}.</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Criterios de Salida */}
              <div className="p-4 rounded-lg bg-[#0D0D15] border border-[#222230] space-y-2">
                <span className="text-[11px] font-mono text-zinc-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  Exit Criteria (Compuerta de Calidad)
                </span>
                <p className="text-xs text-zinc-400 font-mono">
                  No se permite avanzar a la siguiente fase sin validación estricta de TypeScript:
                  <code className="text-[#ecb613] ml-1">{"npx tsc --noEmit -> Exit Code 0"}</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Matriz Anti-Rationalization (Excusas vs. Réplicas) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-xl border border-[#1A1A24] bg-[#09090F] space-y-5">
              <div className="flex items-center justify-between border-b border-[#1A1A24] pb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                  <h3 className="text-lg font-bold text-white">Matriz Anti-Racionalización</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                  Zero Shortcuts
                </span>
              </div>

              <p className="text-xs text-zinc-400">
                Los agentes IA suelen buscar atajos o justificar por qué saltarse un paso. Esta tabla desmantela cada excusa:
              </p>

              <div className="space-y-4">
                {selectedStage.excuses.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-[#262638] bg-[#050507] space-y-2.5"
                  >
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-[#EF4444] font-mono font-bold">EXCUSA:</span>
                      <p className="text-zinc-400 italic">"{item.excuse}"</p>
                    </div>
                    <div className="flex items-start gap-2 text-xs pt-2 border-t border-[#1A1A24]">
                      <span className="text-[#10B981] font-mono font-bold">RÉPLICA:</span>
                      <p className="text-zinc-200 font-medium">{item.rebuttal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lanzador Directo en Servidor */}
            <div className="p-6 rounded-xl border border-[#222230] bg-[#09090F] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Lanzador Local de Agent Skills</h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Ejecuta INSTALAR_AGENT_SKILLS.bat en la terminal para sincronizar las 24 skills.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1.5 rounded bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 font-bold">
                INSTALAR_AGENT_SKILLS.bat
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
