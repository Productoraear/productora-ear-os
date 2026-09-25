/**
 * 🎙️ EAR OS V2 — NUEVA PROPUESTA POR VOZ / ASISTENTE DE CAMPO
 * ------------------------------------------------------------------
 * Pantalla para dictar en caliente al salir de una finca o reunión,
 * extraer entidades y emitir la propuesta oficial interactiva.
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { VoiceProposalRecorder } from '@/components/admin/VoiceProposalRecorder';

export const metadata = {
  title: 'Nueva Propuesta por Voz · EAR OS Admin',
};

export default function NuevaPropuestaPage() {
  return (
    <div className="w-full min-h-screen bg-[#030305] text-white p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/admin/propuestas"
            className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Propuestas
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#ecb613] font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Motor La Máquina v2.0</span>
          </div>
        </div>

        <VoiceProposalRecorder />
      </div>
    </div>
  );
}
