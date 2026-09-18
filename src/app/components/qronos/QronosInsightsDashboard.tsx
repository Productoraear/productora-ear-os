'use client';

import React from 'react';
import { Activity, Sparkles, TrendingUp, Cpu, Users, Shield, Layers, CheckCircle } from 'lucide-react';

export function QronosInsightsDashboard({ className = '' }: { className?: string }) {
  const tableProjects = [
    { name: 'Inteligencia Matutina Fincas', tasks: 239, qwen: 81, deepseek: 76, claude: 82 },
    { name: 'Respuesta Inmediata Leads', tasks: 181, qwen: 25, deepseek: 151, claude: 5 },
    { name: 'Auditoría Acústica Fincas', tasks: 95, qwen: 22, deepseek: 44, claude: 29 },
    { name: 'Call Center Outbound Queue', tasks: 88, qwen: 0, deepseek: 12, claude: 76 },
    { name: 'Agentes de Sourcing Scala', tasks: 72, qwen: 59, deepseek: 13, claude: 0 },
    { name: 'Stripe Price-Lock Follow-up', tasks: 51, qwen: 0, deepseek: 51, claude: 0 },
    { name: 'Mantenimiento Zero-Token ZTM', tasks: 50, qwen: 3, deepseek: 0, claude: 47 },
    { name: 'Licitaciones B2G Estado', tasks: 45, qwen: 18, deepseek: 21, claude: 6 },
    { name: 'Revisión Split 80/10/10', tasks: 43, qwen: 12, deepseek: 24, claude: 7 },
    { name: 'Operaciones Flota Méntrida', tasks: 38, qwen: 14, deepseek: 8, claude: 16 }
  ];

  const assigneeBars = [
    { label: 'EA', name: 'Edwin Agudelo', top: 22, mid: 46, bot: 14, color: 'bg-rose-500' },
    { label: 'QW', name: 'Qwen 27B Local', top: 19, mid: 41, bot: 12, color: 'bg-[#ecb613]' },
    { label: 'DS', name: 'DeepSeek Local', top: 17, mid: 37, bot: 11, color: 'bg-cyan-500' },
    { label: 'CL', name: 'Claude Architect', top: 17, mid: 37, bot: 11, color: 'bg-indigo-500' },
    { label: 'SN', name: 'Sentinel Reaper', top: 16, mid: 36, bot: 10, color: 'bg-emerald-500' },
    { label: 'CC', name: 'Call Center Agent', top: 14, mid: 31, bot: 9, color: 'bg-amber-500' },
    { label: 'WA', name: 'WhatsApp Closer', top: 12, mid: 25, bot: 7, color: 'bg-green-500' },
    { label: 'BG', name: 'B2G Hunter', top: 10, mid: 22, bot: 6, color: 'bg-purple-500' },
    { label: 'ZT', name: 'ZTM Reaper', top: 8, mid: 18, bot: 5, color: 'bg-blue-500' },
    { label: 'BO', name: 'Bose Acoustic', top: 7, mid: 16, bot: 5, color: 'bg-sky-500' },
    { label: 'ST', name: 'Stripe Guard', top: 6, mid: 14, bot: 4, color: 'bg-violet-500' },
    { label: 'FL', name: 'Flota Méntrida', top: 5, mid: 10, bot: 3, color: 'bg-orange-500' },
    { label: 'SC', name: 'Scala Lead', top: 4, mid: 8, bot: 2, color: 'bg-pink-500' },
    { label: 'VM', name: 'VIMUME Impact', top: 3, mid: 6, bot: 2, color: 'bg-teal-500' }
  ];

  return (
    <div className={`flex flex-col gap-5 rounded-xl border border-white/[0.08] bg-[#0d0d12] p-5 shadow-2xl text-white/80 ${className}`}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-sm">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#ecb613]" />
          <span className="font-display font-semibold text-white">Telemetría de Agentes & Rendimiento S-Class</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="text-amber-400">★</span>
          <span>GPU RX 7900 XTX 24GB</span>
        </div>
      </div>

      {/* FILA 1: 3 KPI CARDS + 1 BUDGET METER */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1 */}
        <div className="rounded-lg border border-white/[0.08] bg-zinc-900/60 p-4">
          <p className="text-xs text-white/50 font-mono uppercase tracking-wider">Tareas Agente Completadas</p>
          <p className="mt-1.5 text-2xl font-bold text-white font-mono">3.389</p>
          <p className="mt-1 text-[11px] text-emerald-400 font-mono">+18% esta semana</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-lg border border-white/[0.08] bg-zinc-900/60 p-4">
          <p className="text-xs text-white/50 font-mono uppercase tracking-wider">Tareas en Progreso Local</p>
          <p className="mt-1.5 text-2xl font-bold text-[#ecb613] font-mono">1.128</p>
          <p className="mt-1 text-[11px] text-white/40 font-mono">100% Bare-Metal Ollama</p>
        </div>

        {/* Card 3 */}
        <div className="rounded-lg border border-white/[0.08] bg-zinc-900/60 p-4">
          <p className="text-xs text-white/50 font-mono uppercase tracking-wider">Aprobaciones Humanas (CEO)</p>
          <p className="mt-1.5 text-2xl font-bold text-cyan-300 font-mono">729</p>
          <p className="mt-1 text-[11px] text-white/40 font-mono">Filtradas por Guardrail</p>
        </div>

        {/* Card 4: DAILY BUDGET / AHORRO CON SCANNER BEAM */}
        <div className="rounded-lg border border-white/[0.08] bg-zinc-900/60 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50 font-mono uppercase tracking-wider">Ahorro Intermediarios</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>
            <p className="mt-1 text-xl font-bold text-white font-mono">
              6.840 € <span className="text-xs text-white/40">/ 10.000 €</span>
            </p>
          </div>

          {/* BARRA CON ANIMACIÓN DE ESCANER LÁSER QRONOS */}
          <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.1] after:pointer-events-none after:absolute after:inset-y-0 after:w-10 after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent after:animate-[budget-meter-scan_4.5s_ease-in-out_infinite]">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#ecb613] via-amber-300 to-emerald-400 shadow-[0_0_8px_rgba(236,182,19,0.5)]" 
              style={{ width: '68.4%' }} 
            />
          </div>
          <p className="mt-1.5 text-[10px] text-zinc-400 font-mono">68.4% margen soberano capturado</p>
        </div>
      </div>

      {/* FILA 2: GRÁFICO DE BARRAS POR ASIGNACIÓN + TABLA MATRIZ */}
      <div className="grid gap-5 lg:grid-cols-12 items-stretch">
        
        {/* GRÁFICO DE BARRAS DE ASIGNACIÓN (ESTILO QRONOS) */}
        <div className="lg:col-span-6 rounded-lg border border-white/[0.08] bg-zinc-900/50 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-white/90">Carga de Tareas por Agente / Operador</span>
            <span className="text-[10px] font-mono text-zinc-500">14 Entidades Activas</span>
          </div>

          {/* CONTENEDOR DEL GRÁFICO */}
          <div className="relative h-44 w-full flex flex-col justify-between pt-2">
            
            {/* GUÍAS HORIZONTALES DASHED */}
            <div className="absolute inset-x-0 inset-y-2 flex flex-col justify-between pointer-events-none opacity-20 text-[8px] font-mono text-white/40">
              <div className="border-b border-dashed border-white/20 pb-0.5">180</div>
              <div className="border-b border-dashed border-white/20 pb-0.5">120</div>
              <div className="border-b border-dashed border-white/20 pb-0.5">60</div>
              <div className="border-b border-dashed border-white/20 pb-0.5">0</div>
            </div>

            {/* BARRAS APILADAS */}
            <div className="relative z-10 grid grid-cols-14 items-end gap-1 sm:gap-1.5 h-32 px-2">
              {assigneeBars.map((b, idx) => (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <div className="w-full max-w-[12px] flex flex-col justify-end rounded-t overflow-hidden">
                    <div className="bg-slate-200" style={{ height: `${b.top}%` }} title="Completadas" />
                    <div className="bg-[#ecb613]" style={{ height: `${b.mid}%` }} title="En Proceso" />
                    <div className="bg-amber-600" style={{ height: `${b.bot}%` }} title="En Revisión" />
                  </div>
                </div>
              ))}
            </div>

            {/* AVATARES INFERIORES */}
            <div className="grid grid-cols-14 gap-1 sm:gap-1.5 pt-2 border-t border-white/[0.08] px-2 text-center">
              {assigneeBars.map((b, idx) => (
                <div key={idx} className="flex justify-center" title={b.name}>
                  <span className="size-4 sm:size-5 rounded-full bg-zinc-800 border border-zinc-700 text-[8px] font-mono font-bold flex items-center justify-center text-zinc-300">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABLA MATRIZ DE PROYECTOS Y MODELOS (ESTILO QRONOS) */}
        <div className="lg:col-span-6 rounded-lg border border-white/[0.08] bg-zinc-900/50 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white/90">Distribución de Proyectos entre Motores IA</span>
            <span className="text-[10px] font-mono text-emerald-400">Exit Code 0</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-[11px] font-mono text-left">
              <thead>
                <tr className="border-b border-white/[0.08] text-white/40 text-[10px]">
                  <th className="pb-2 font-normal">Proyecto</th>
                  <th className="pb-2 font-normal text-right">Tareas</th>
                  <th className="pb-2 font-normal text-right text-[#ecb613]">Qwen 27B</th>
                  <th className="pb-2 font-normal text-right text-cyan-300">DeepSeek</th>
                  <th className="pb-2 font-normal text-right text-rose-300">Edwin / Cl</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {tableProjects.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-2 text-white/80 truncate max-w-[150px]">{row.name}</td>
                    <td className="py-2 text-right text-white/60">{row.tasks}</td>
                    <td className="py-2 text-right text-[#ecb613]">{row.qwen}</td>
                    <td className="py-2 text-right text-cyan-400">{row.deepseek}</td>
                    <td className="py-2 text-right text-rose-400">{row.claude}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
