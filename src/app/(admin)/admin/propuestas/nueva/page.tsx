/**
 * 🎙️ EAR OS V2 — NUEVA PROPUESTA POR VOZ / ASISTENTE DE CAMPO
 * ------------------------------------------------------------------
 * Pantalla para dictar en caliente al salir de una finca o reunión,
 * extraer entidades y emitir la propuesta oficial interactiva.
 *
 * S-Class W10-017: Suspense + ErrorBoundary sellados.
 */

import React, { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { VoiceProposalRecorder } from '@/components/admin/VoiceProposalRecorder';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Nueva Propuesta por Voz · EAR OS Admin',
};

function RecorderSkeleton(): React.ReactElement {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="w-full rounded-2xl border border-white/5 bg-[#07070b] p-8 animate-pulse"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-white/5" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-40 rounded bg-white/5" />
          <div className="h-2 w-24 rounded bg-white/5" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-24 w-full rounded-xl bg-white/5" />
        <div className="h-10 w-32 rounded-lg bg-white/5" />
      </div>
      <span className="sr-only">Cargando grabador de propuestas…</span>
    </div>
  );
}

function RecorderErrorFallback(): React.ReactElement {
  return (
    <div
      role="alert"
      className="w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center"
    >
      <p className="text-sm font-mono text-red-300">
        No se pudo inicializar el grabador de propuestas.
      </p>
      <p className="mt-2 text-xs text-neutral-500">
        Verifica el micrófono y recarga la página para reintentar.
      </p>
    </div>
  );
}

export default function NuevaPropuestaPage(): React.ReactElement {
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

        <ErrorBoundary fallback={<RecorderErrorFallback />}>
          <Suspense fallback={<RecorderSkeleton />}>
            <VoiceProposalRecorder />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}