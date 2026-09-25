/**
 * 👑 EAR OS V2 — PÁGINA PÚBLICA DE PROPUESTA S-CLASS
 * ------------------------------------------------------------------
 * Enlace soberano para el cliente (/propuesta/[token]).
 * Inyecta el componente interactivo y el rastreador de telemetría.
 * Server Component con resolución async de parámetros (Next.js App Router).
 */

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { obtenerPropuestaPorToken } from '@/lib/proposals/proposal-store';
import { ProposalInteractiveClient } from '@/components/proposals/ProposalInteractiveClient';
import { ProposalTelemetryTracker } from '@/components/proposals/ProposalTelemetryTracker';

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const propuesta = await obtenerPropuestaPorToken(resolvedParams.token);

  if (!propuesta) {
    return {
      title: 'Propuesta no encontrada · Productora EAR',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `Propuesta #${propuesta.numero} · ${propuesta.cliente.nombre} · Productora EAR`,
    description: `Propuesta de producción y sonorización para ${propuesta.cliente.fincaOEspacio}.`,
    robots: { index: false, follow: false },
  };
}

export default async function PropuestaPublicaPage({ params }: PageProps) {
  const resolvedParams = await params;
  const propuesta = await obtenerPropuestaPorToken(resolvedParams.token);

  if (!propuesta) {
    notFound();
  }

  return (
    <>
      <ProposalInteractiveClient propuestaInicial={propuesta} />
      <ProposalTelemetryTracker token={propuesta.token} />
    </>
  );
}
