import React from 'react';
import type { Metadata } from 'next';
import { AgentMonitorCeoWorkspace } from '@/components/admin/AgentMonitorCeoWorkspace';

export const metadata: Metadata = {
  title: 'Monitor de Agentes S-Class · Panel de Control del CEO',
  description: 'Espacio de trabajo para supervisar sesiones, revisar aprobaciones, controlar presupuestos y restaurar puntos de control.',
};

export default function AgentMonitorPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold font-display text-white">
          Monitor de Agentes & Tool Calls (S-Class)
        </h1>
        <p className="text-xs text-zinc-400 font-sans mt-1">
          Supervisión en tiempo real de los 7 elementos: sesiones, timeline, puertas de aprobación, medidor de costes y cola de tareas.
        </p>
      </div>

      <AgentMonitorCeoWorkspace />
    </div>
  );
}
