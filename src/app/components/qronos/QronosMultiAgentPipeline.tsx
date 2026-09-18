'use client';

import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Radio, Terminal, Cpu } from 'lucide-react';

interface PipelineLog {
  id: string;
  time: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export function QronosMultiAgentPipeline({ 
  interactive = true, 
  className = '' 
}: { 
  interactive?: boolean; 
  className?: string; 
}) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [runsToday, setRunsToday] = useState<number>(1429);
  const [activeMessage, setActiveMessage] = useState<string>(
    'Lead verificado en Finca La Vega · Solista Edwin Agudelo asignado (350,00 € + Logística Méntrida Km 0)'
  );

  const logs: PipelineLog[] = [
    {
      id: '1',
      time: '10:42:15',
      agent: 'Lead Hunter',
      message: 'Lead absorbido de bodas.net (Toledo) · Requisitos: Bose 12W/pax + Shure Beta 87A',
      type: 'info'
    },
    {
      id: '2',
      time: '10:42:16',
      agent: 'Shared Context',
      message: 'Tarifa Base fijada en 350,00 € · Split 80/10/10 verificado · Token count: 0 (Bare-Metal ZTM)',
      type: 'success'
    },
    {
      id: '3',
      time: '10:42:17',
      agent: 'Router AMD 7900XTX',
      message: 'Qwen 27B orquesta despacho: Call Center Outbound y WhatsApp Price-Lock Hook activados',
      type: 'info'
    },
    {
      id: '4',
      time: '10:42:18',
      agent: 'Price-Lock Guard',
      message: 'Depósito 100,00 € Stripe Price-Lock SHA-256 generado y enviado al contacto (+34 693 048 440)',
      type: 'success'
    }
  ];

  const pipelineMessages = [
    'Lead verificado en Finca La Vega · Solista Edwin Agudelo asignado (350,00 € + Logística Méntrida)',
    'Contrato Menor B2G detectado en Plataforma del Estado (< 14.250 € Art. 118 LCSP)',
    'Call Center Outbound conectando llamada automatizada con Dirección de Fincas Madrid',
    'Depósito 100,00 € Stripe SHA-256 verificado · Estado: RESERVA FIRME',
    'Reconciliación de memoria Zero-Token (ZTM) completada en GPU RX 7900 XTX'
  ];

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
      setActiveMessage(pipelineMessages[Math.floor(Math.random() * pipelineMessages.length)]);
      setRunsToday((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleSimulateRun = () => {
    setActiveStep(0);
    setActiveMessage('Iniciando ciclo autónomo cuántico de prospección y cierre...');
    setRunsToday((prev) => prev + 1);
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-[14px] border border-white/[0.09] p-[5px] bg-[#070709] ${className}`}>
      <div className="mx-auto w-full overflow-hidden rounded-[10px] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(19,19,21,0.98),rgba(7,7,8,0.98))] font-sans shadow-2xl">
        
        {/* HEADER DEL PIPELINE */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="inline-block size-2 rounded-full bg-emerald-400 pipeline-status-dot animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.14em] text-white/70 font-semibold uppercase">
              ORQUESTADOR MULTI-AGENTE S-CLASS · EN VIVO
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-white/40 hidden sm:inline-flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#ecb613]" /> AMD RX 7900 XTX (24GB)
            </span>
            {interactive && (
              <button
                onClick={handleSimulateRun}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-[11px] font-mono transition-colors"
                title="Disparar nuevo ciclo de prueba"
              >
                <RefreshCw className="w-3 h-3 text-[#ecb613]" /> Disparar Run
              </button>
            )}
          </div>
        </div>

        {/* SVG ANIMATED PIPELINE WORKFLOW */}
        <div className="relative px-2 py-4 sm:px-4 sm:py-6 overflow-x-auto">
          <svg 
            width="100%" 
            viewBox="0 0 580 172" 
            className="min-w-[540px] block" 
            aria-label="Animated multi-agent workflow"
          >
            <defs>
              <linearGradient id="qronos-silver-flow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="42%" stopColor="#ecb613" />
                <stop offset="70%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#FF2B44" />
              </linearGradient>

              <linearGradient id="qronos-router-silver" x1="306" y1="53" x2="411" y2="123" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="28%" stopColor="#ecb613" />
                <stop offset="65%" stopColor="#22222a" />
                <stop offset="100%" stopColor="#070709" />
              </linearGradient>

              <marker 
                id="qronos-arrow" 
                viewBox="0 0 10 10" 
                refX="8" 
                refY="5" 
                markerWidth="5" 
                markerHeight="5" 
                orient="auto"
              >
                <path 
                  d="M2 1.5L7.5 5L2 8.5" 
                  fill="none" 
                  stroke="#ecb613" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </marker>
            </defs>

            {/* CONNECTION LINES (DASHED) */}
            <path d="M116,88 L158,88" fill="none" stroke="rgba(236,182,19,0.3)" strokeWidth="1.5" strokeDasharray="3 5" markerEnd="url(#qronos-arrow)" />
            <path d="M268,88 L306,88" fill="none" stroke="rgba(236,182,19,0.3)" strokeWidth="1.5" strokeDasharray="3 5" markerEnd="url(#qronos-arrow)" />
            
            {/* ROUTER TO AGENTS SPLIT */}
            <path d="M411,88 C425,88 435,50 448,50" fill="none" stroke="rgba(255,43,68,0.35)" strokeWidth="1.5" strokeDasharray="3 5" />
            <path d="M411,88 L448,88" fill="none" stroke="rgba(236,182,19,0.35)" strokeWidth="1.5" strokeDasharray="3 5" />
            <path d="M411,88 C425,88 435,126 448,126" fill="none" stroke="rgba(0,229,255,0.35)" strokeWidth="1.5" strokeDasharray="3 5" />

            {/* ANIMATING FLOW PARTICLES (animateMotion) */}
            <circle r="2.5" fill="url(#qronos-silver-flow)">
              <animateMotion dur="1.05s" repeatCount="indefinite" begin="0s" path="M116,88 L158,88" />
            </circle>
            <circle r="1.8" fill="#ecb613" opacity="0.75">
              <animateMotion dur="1.05s" repeatCount="indefinite" begin="0.35s" path="M116,88 L158,88" />
            </circle>

            <circle r="2.5" fill="url(#qronos-silver-flow)">
              <animateMotion dur="0.88s" repeatCount="indefinite" begin="0.18s" path="M268,88 L306,88" />
            </circle>
            <circle r="1.8" fill="#ecb613" opacity="0.75">
              <animateMotion dur="0.88s" repeatCount="indefinite" begin="0.62s" path="M268,88 L306,88" />
            </circle>

            {/* To Agent 1 (Sourcing) */}
            <circle r="2.2" fill="#34d399">
              <animateMotion dur="1.3s" repeatCount="indefinite" begin="0.08s" path="M411,88 C425,88 435,50 448,50" />
            </circle>
            {/* To Agent 2 (Call Center) */}
            <circle r="2.2" fill="#ecb613">
              <animateMotion dur="1.15s" repeatCount="indefinite" begin="0.28s" path="M411,88 L448,88" />
            </circle>
            {/* To Agent 3 (B2G Tenders) */}
            <circle r="2.2" fill="#FF2B44">
              <animateMotion dur="1.4s" repeatCount="indefinite" begin="0.45s" path="M411,88 C425,88 435,126 448,126" />
            </circle>

            {/* NODE 1: TRIGGER */}
            <g className="cursor-pointer">
              <rect x="16" y="66" width="100" height="44" rx="8" fill="#111115" stroke={activeStep === 0 ? '#ecb613' : 'rgba(255,255,255,0.12)'} strokeWidth={activeStep === 0 ? '1.5' : '0.6'} />
              <text x="66" y="83" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="monospace" letterSpacing=".08em">TRIGGER</text>
              <text x="66" y="99" textAnchor="middle" fontSize="11.5" fill="#ffffff" fontWeight="600" fontFamily="sans-serif">Lead Hunter</text>
              <text x="66" y="121" textAnchor="middle" fontSize="8" fill="rgba(236,182,19,0.7)" fontFamily="monospace">cron · webhook</text>
            </g>

            {/* NODE 2: SHARED CONTEXT */}
            <g className="cursor-pointer">
              <rect x="158" y="66" width="110" height="44" rx="8" fill="#111115" stroke={activeStep === 1 ? '#ecb613' : 'rgba(255,255,255,0.12)'} strokeWidth={activeStep === 1 ? '1.5' : '0.6'} />
              <text x="213" y="83" textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.4)" fontFamily="monospace" letterSpacing=".08em">SHARED CONTEXT</text>
              <text x="213" y="99" textAnchor="middle" fontSize="11" fill="#ffffff" fontWeight="600" fontFamily="sans-serif">ZTM Memory</text>
              <text x="213" y="121" textAnchor="middle" fontSize="8" fill="rgba(52,211,153,0.8)" fontFamily="monospace">Split 80/10/10</text>
            </g>

            {/* NODE 3: ROUTER / ORCHESTRATOR */}
            <g className="cursor-pointer">
              <rect x="306" y="53" width="105" height="70" rx="10" fill="#0c0c10" stroke="url(#qronos-router-silver)" strokeWidth="1.8" />
              <text x="358" y="76" textAnchor="middle" fontSize="9" fill="#ecb613" fontWeight="600" fontFamily="monospace" letterSpacing=".09em">ORQUESTADOR</text>
              <text x="358" y="95" textAnchor="middle" fontSize="12" fill="#ffffff" fontWeight="700" fontFamily="sans-serif">Qwen 27B Local</text>
              <circle cx="346" cy="111" r="2.8" fill="#ecb613" className="pipeline-pulse" />
              <circle cx="358" cy="111" r="2.8" fill="#ffffff" className="pipeline-pulse" style={{ animationDelay: '0.3s' }} />
              <circle cx="370" cy="111" r="2.8" fill="#FF2B44" className="pipeline-pulse" style={{ animationDelay: '0.6s' }} />
              <text x="358" y="137" textAnchor="middle" fontSize="8" fill="rgba(236,182,19,0.9)" fontFamily="monospace">GPU Bare-Metal</text>
            </g>

            {/* NODE 4A: AGENT 1 (Sourcing) */}
            <g className="cursor-pointer">
              <rect x="448" y="35" width="124" height="30" rx="7" fill="#111116" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
              <text x="502" y="53.5" textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">Fincas Sourcing</text>
              <circle cx="560" cy="43" r="3" fill="#22c55e" className="pipeline-status-dot" />
            </g>

            {/* NODE 4B: AGENT 2 (Call Center) */}
            <g className="cursor-pointer">
              <rect x="448" y="73" width="124" height="30" rx="7" fill="#111116" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
              <text x="502" y="91.5" textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">Call Center Outbound</text>
              <circle cx="560" cy="81" r="3" fill="#ecb613" className="pipeline-status-dot" />
            </g>

            {/* NODE 4C: AGENT 3 (B2G Tenders) */}
            <g className="cursor-pointer">
              <rect x="448" y="111" width="124" height="30" rx="7" fill="#111116" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
              <text x="502" y="129.5" textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">Licitaciones B2G</text>
              <circle cx="560" cy="119" r="3" fill="#FF2B44" className="pipeline-status-dot" />
            </g>
          </svg>
        </div>

        {/* LIVE TERMINAL MESSAGE BAR */}
        <div className="h-12 border-t border-white/[0.06] px-4 py-2 sm:px-5 flex items-center gap-2.5 bg-black/40">
          <span className="shrink-0 font-mono text-xs text-[#ecb613]">›</span>
          <p className="font-mono text-[11px] sm:text-xs text-white/70 truncate animate-fade-in">
            {activeMessage}
          </p>
        </div>

        {/* STATS FOOTER STRIP */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] px-4 py-3 sm:px-5 bg-black/60 font-mono text-[10px] sm:text-xs">
          <div>
            <span className="block text-[8px] sm:text-[9px] tracking-[0.1em] text-white/30 uppercase">Runs Hoy</span>
            <span className="text-white/80 font-semibold">{runsToday.toLocaleString()}</span>
          </div>
          <div>
            <span className="block text-[8px] sm:text-[9px] tracking-[0.1em] text-white/30 uppercase">Éxito SLA</span>
            <span className="text-emerald-400 font-semibold">99.9%</span>
          </div>
          <div>
            <span className="block text-[8px] sm:text-[9px] tracking-[0.1em] text-white/30 uppercase">Latencia Router</span>
            <span className="text-cyan-300 font-semibold">18ms (Ollama)</span>
          </div>
          <div className="ml-auto text-right">
            <span className="block text-[8px] sm:text-[9px] tracking-[0.1em] text-white/30 uppercase">Tarifa Solista</span>
            <span className="text-[#ecb613] font-semibold">350,00 € (Inmutable)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
