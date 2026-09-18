'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Play, CheckCircle2, ChevronRight, X, AlertCircle, Sparkles, Filter } from 'lucide-react';

export interface GanttTrack {
  id: string;
  name: string;
  trigger: string;
  triggerType: 'cron' | 'webhook' | 'hourly' | 'adaptive' | 'event' | 'agent';
  dotColor: string;
  gradientClass: string;
  leftPercent: number;
  widthPercent: number;
  milestones: { name: string; positionPercent: number; status: 'done' | 'active' | 'pending' }[];
  description: string;
  executionTime: string;
  targetService: string;
  ssotRule: string;
}

export function QronosGanttScheduler({ className = '' }: { className?: string }) {
  const [selectedTrack, setSelectedTrack] = useState<GanttTrack | null>(null);

  const tracks: GanttTrack[] = [
    {
      id: 'track-1',
      name: 'Inteligencia Matutina & Sourcing Fincas',
      trigger: 'Cron · 08:30 AM',
      triggerType: 'cron',
      dotColor: 'bg-cyan-400',
      gradientClass: 'from-cyan-600/80 via-cyan-400 to-cyan-200',
      leftPercent: 10,
      widthPercent: 48,
      milestones: [
        { name: 'Scrape Fincas', positionPercent: 35, status: 'done' },
        { name: 'Filtrado ZTM', positionPercent: 72, status: 'active' }
      ],
      description: 'Extracción programada de bodas.net, Google Maps y registros públicos en Toledo y Madrid. Purifica contactos a < 1MB JSON.',
      executionTime: '08:30 AM (Diario)',
      targetService: 'Scraping Worker / ZTM Absorber',
      ssotRule: 'Repo < 50MB · Bóveda de Ingesta en H:\\EAR_VAULT_GOLDEN_NUGGETS.json'
    },
    {
      id: 'track-2',
      name: 'Respuesta Inmediata a Leads Webhook',
      trigger: 'Webhook · Instantáneo',
      triggerType: 'webhook',
      dotColor: 'bg-emerald-400',
      gradientClass: 'from-emerald-600/80 via-emerald-400 to-emerald-200',
      leftPercent: 4,
      widthPercent: 68,
      milestones: [
        { name: 'Enriquecer Lead', positionPercent: 28, status: 'done' },
        { name: 'Calificar Presupuesto', positionPercent: 60, status: 'done' }
      ],
      description: 'Disparador reactivo al ingresar solicitud en formulariodebodas.com o WhatsApp. Calcula tarifa Edwin Agudelo (350€ + km).',
      executionTime: 'En tiempo real (< 250ms)',
      targetService: 'Stripe Price-Lock Engine / Call Center',
      ssotRule: 'Split 80/10/10 · 1,50 €/km desde Méntrida a partir del km 50'
    },
    {
      id: 'track-3',
      name: 'Call Center Outbound & Despacho Fincas',
      trigger: 'Horario · 10:00 - 14:00',
      triggerType: 'hourly',
      dotColor: 'bg-amber-400',
      gradientClass: 'from-amber-600/80 via-amber-400 to-amber-200',
      leftPercent: 20,
      widthPercent: 62,
      milestones: [
        { name: 'Marcar Lote', positionPercent: 24, status: 'done' },
        { name: 'Auditoría Voz', positionPercent: 52, status: 'active' },
        { name: 'Escalar Cierre', positionPercent: 78, status: 'pending' }
      ],
      description: 'Llamadas outbound inteligentes con guion pre-aprobado. Ofrece exclusividad acústica Bose y split 10% para la finca.',
      executionTime: 'Bloque comercial L-V 10:00 - 14:00',
      targetService: 'Asterisk / Twilio Outbound SIP',
      ssotRule: 'Rider Acústico 12 W/pax · Bose F1 812 / S1 Pro, Shure Beta 87A'
    },
    {
      id: 'track-4',
      name: 'Rastreo Licitaciones B2G Plataforma del Estado',
      trigger: 'Cron · 14:30 PM',
      triggerType: 'cron',
      dotColor: 'bg-rose-400',
      gradientClass: 'from-rose-600/80 via-rose-400 to-rose-200',
      leftPercent: 42,
      widthPercent: 45,
      milestones: [
        { name: 'Filtro <14.250€', positionPercent: 30, status: 'done' },
        { name: 'Pliego Acústico', positionPercent: 70, status: 'active' }
      ],
      description: 'Auditoría automática del DOUE y Plataforma de Contratación del Sector Público para contratos menores de sonido y orquesta.',
      executionTime: '14:30 PM (Diario)',
      targetService: 'B2G Tender Engine (src/lib/vimume/b2g-tender-engine.ts)',
      ssotRule: 'Zona Cero Inmutable: < 14.250,00 € Art. 118 LCSP y < 75 dB SPL'
    },
    {
      id: 'track-5',
      name: 'Liquidación Tesorería & Stripe Price-Lock',
      trigger: 'Event-Driven · Al Pago',
      triggerType: 'event',
      dotColor: 'bg-indigo-400',
      gradientClass: 'from-indigo-600/80 via-indigo-400 to-indigo-200',
      leftPercent: 65,
      widthPercent: 32,
      milestones: [
        { name: 'Verificar Depósito', positionPercent: 35, status: 'done' },
        { name: 'Despacho Split', positionPercent: 75, status: 'done' }
      ],
      description: 'Generación y confirmación del depósito inmutable de 100,00 € en Stripe con hash SHA-256 de bloqueo de fecha y tarifa.',
      executionTime: 'Instantáneo tras webhook Stripe',
      targetService: 'Stripe Webhook Listener / Payout Engine',
      ssotRule: 'Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME'
    },
    {
      id: 'track-6',
      name: 'Mantenimiento Zero-Token Memory (ZTM)',
      trigger: 'Agente · 20:00 PM',
      triggerType: 'agent',
      dotColor: 'bg-sky-400',
      gradientClass: 'from-sky-600/80 via-sky-400 to-sky-200',
      leftPercent: 12,
      widthPercent: 52,
      milestones: [
        { name: 'Compactar', positionPercent: 36, status: 'done' },
        { name: 'Persistir Bóveda', positionPercent: 76, status: 'done' }
      ],
      description: 'Consolidación de logs, purgando contextos pesados a resúmenes estadísticos JSON (<300 tokens) para evitar colapsos de Ollama.',
      executionTime: '20:00 PM (Diario)',
      targetService: 'ZTM Reaper & Vault Indexer',
      ssotRule: 'Prohibido leer CSVs masivos en contexto · Ollama Window 32768'
    }
  ];

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0c10] text-white/80 shadow-2xl ${className}`}>
      
      {/* HEADER DE CONTROL */}
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5 bg-[#09090c]">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-[#ecb613]" />
          <span className="font-display font-semibold text-sm sm:text-base text-white">
            Cronograma Autónomo S-Class (Gantt Multi-Agente)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-white/50">
            6 PIPELINES VIGENTES
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-white/50">
          <span className="inline-block size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sincronizado con GPU local</span>
        </div>
      </div>

      {/* GANTT TIMELINE CONTAINER */}
      <div className="relative overflow-x-auto">
        <div className="min-w-[760px] p-4 sm:p-6">
          
          {/* DIAS DE LA SEMANA / ENCABEZADO TEMPORAL */}
          <div className="grid grid-cols-7 border-b border-white/[0.07] pb-3 text-center font-mono text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">
            <div>LUN · 08:00</div>
            <div>MAR · 11:00</div>
            <div>MIÉ · 14:00</div>
            <div>JUE · 17:00</div>
            <div>VIE · 20:00</div>
            <div>SÁB · EVENTOS</div>
            <div>DOM · CIERRE</div>
          </div>

          {/* TRACKS DE EJECUCIÓN */}
          <div className="relative mt-4 space-y-6">
            
            {/* GUÍAS VERTICALES DE FONDO */}
            <div className="absolute inset-0 grid grid-cols-7 pointer-events-none opacity-20">
              <span className="border-r border-dashed border-white/10" />
              <span className="border-r border-dashed border-white/10" />
              <span className="border-r border-dashed border-white/10" />
              <span className="border-r border-dashed border-white/10" />
              <span className="border-r border-dashed border-white/10" />
              <span className="border-r border-dashed border-white/10" />
              <span className="border-r border-dashed border-white/10" />
            </div>

            {tracks.map((track) => (
              <div 
                key={track.id} 
                onClick={() => setSelectedTrack(track)}
                className="relative z-10 group cursor-pointer"
              >
                {/* Título de la pista y disparador */}
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-sm ${track.dotColor}`} />
                    <span className="text-xs sm:text-sm font-medium text-white/85 group-hover:text-[#ecb613] transition-colors">
                      {track.name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-white/40">
                    {track.trigger}
                  </span>
                </div>

                {/* Barra de progreso interactiva con hitos */}
                <div className="relative h-6 rounded-md border border-white/[0.09] bg-white/[0.03] shadow-inner overflow-visible">
                  <div 
                    className={`absolute inset-y-0 rounded-md bg-gradient-to-r ${track.gradientClass} shadow-md opacity-85 group-hover:opacity-100 transition-opacity`}
                    style={{ left: `${track.leftPercent}%`, width: `${track.widthPercent}%` }}
                  >
                    {/* Hitos / Diamantes */}
                    {track.milestones.map((m, idx) => (
                      <div 
                        key={idx}
                        className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
                        style={{ left: `${m.positionPercent}%` }}
                      >
                        <span 
                          className={`size-2 rotate-45 border ${
                            m.status === 'done' 
                              ? 'bg-white border-white shadow-sm' 
                              : m.status === 'active'
                              ? 'bg-[#ecb613] border-[#ecb613] animate-pulse shadow-[0_0_6px_#ecb613]'
                              : 'bg-zinc-800 border-zinc-500'
                          }`}
                        />
                        <span className="absolute -top-5 whitespace-nowrap font-mono text-[8px] text-white/60 group-hover:text-white transition-colors">
                          {m.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER DEL GANTT */}
          <div className="mt-8 flex flex-wrap items-center justify-between border-t border-white/[0.07] pt-4 font-mono text-[10px] text-white/40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rotate-45 bg-white" /> Ejecutado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rotate-45 bg-[#ecb613]" /> En Proceso
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rotate-45 bg-zinc-700" /> Planificado
              </span>
            </div>
            <span>99.99% Fiabilidad de Disparo · Zero Token Thrashing</span>
          </div>
        </div>
      </div>

      {/* MODAL DETALLES DEL TRACK SELECCIONADO */}
      {selectedTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0c0c12] p-6 shadow-2xl">
            <button
              onClick={() => setSelectedTrack(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <span className={`size-3 rounded-full ${selectedTrack.dotColor}`} />
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Detalles del Pipeline</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">
              {selectedTrack.name}
            </h3>

            <p className="text-sm text-zinc-300 leading-relaxed mb-5">
              {selectedTrack.description}
            </p>

            <div className="space-y-3 bg-zinc-900/60 rounded-xl p-4 border border-zinc-800/80 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Disparador / Gatillo:</span>
                <span className="text-white font-semibold">{selectedTrack.trigger}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Servicio Ejecutor:</span>
                <span className="text-[#ecb613] font-semibold">{selectedTrack.targetService}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Frecuencia:</span>
                <span className="text-white">{selectedTrack.executionTime}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
                <span className="text-emerald-400 font-semibold block mb-0.5">Regla de Negocio SSOT:</span>
                {selectedTrack.ssotRule}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTrack(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 font-medium"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert(`Disparando forzado inmediato de: ${selectedTrack.name}`);
                  setSelectedTrack(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#ecb613] text-black text-sm font-bold hover:bg-[#ffc629] flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-black" /> Ejecutar Ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
