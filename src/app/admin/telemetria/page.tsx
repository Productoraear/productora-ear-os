'use client';
import React from 'react';
import { SYSTEM_HEALTH_CHECK } from '@/modules/telemetry/health_engine';

export default function TelemetryDashboardView() {
  return (
    <div className="p-8 bg-neutral-950 min-h-screen text-neutral-100 font-sans">
      <header className="mb-8 border-b border-amber-500/30 pb-4">
        <h1 className="text-3xl font-extrabold text-amber-500 tracking-tight">TELEMETRÍA GLOBAL DEL SISTEMA (EAR OS)</h1>
        <p className="text-sm text-neutral-400 mt-1">Auditoría en tiempo real del estado de los motores, latencias y despliegues bare-metal.</p>
      </header>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">🩺 Estado de Subsistemas S-Class</h2>
        <div className="space-y-4">
          {SYSTEM_HEALTH_CHECK.map((sys, idx) => (
            <div key={idx} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-amber-400">{sys.modulo}</h3>
                <span className="inline-block mt-1 text-xs text-neutral-400 font-mono">
                  Latencia de respuesta: <span className="text-white">{sys.latenciaMs} ms</span>
                </span>
              </div>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs px-3 py-1 rounded-lg font-bold font-mono">
                {sys.estado}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
