/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS · EXPEDIENTE CONTRACTUAL (`/reservar/contrato`)
 * ════════════════════════════════════════════════════════════════════════════
 * Server Component: resuelve los datos ANTES de renderizar. Hasta v1 este
 * contrato se podía abrir sin proveedor y con fecha ficticia (`2026-11-20`),
 * lo que permitía imprimir un「contrato」con datos inventados.
 *
 * Reglas de esta capa:
 *   1. Titular: sólo `?proveedor=<slug>` (o `?provider=<slug>` heredado) y se
 *      resuelve contra el registro real. NUNCA se acepta una razón social por
 *      texto libre (veto anti-suplantación).
 *   2. Importe: `?amount=` válido o `TARIFA_BASE_SOLISTA_EUR` del SSOT. Cero
 *      tarifas hardcodeadas.
 *   3. Fecha/plaza sin dato verificado ⇒ «Pendiente de confirmar».
 *   4. `robots: noindex`: es un borrador operativo, no una landing pública.
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { Metadata } from 'next';
import React from 'react';

import { TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';
import { resolveProviderContractSubject } from '@/lib/providers/provider-contract-resolver';
import {
  CONTRACT_PENDING_LABEL,
  CONTRACT_UNRESOLVED_PROVIDER,
  ContractSigningClient,
  type ContractSigningInitial,
} from './ContractSigningClient';

type QueryValue = string | string[] | undefined;

interface PageProps {
  readonly searchParams: Promise<Record<string, QueryValue>>;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const REQUEST_ID = /^[A-Za-z0-9_-]{3,48}$/;
const MAX_CONTRACT_AMOUNT_EUR = 100_000;

export const metadata: Metadata = {
  title: 'Expediente contractual · Borrador operativo · EAR OS',
  description:
    'Borrador operativo del expediente de reserva con depósito deducible, rider acústico y split soberano. Pendiente de revisión jurídica.',
  robots: { index: false, follow: false },
};

function pick(query: Record<string, QueryValue>, key: string): string | null {
  const value = query[key];
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return null;
}

function todayRequestId(): string {
  const iso = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `REQ-${iso}`;
}

function resolveAmount(raw: string | null): number {
  if (!raw) return TARIFA_BASE_SOLISTA_EUR;
  const parsed = Number(raw.replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > MAX_CONTRACT_AMOUNT_EUR) {
    return TARIFA_BASE_SOLISTA_EUR;
  }
  return Math.round(parsed * 100) / 100;
}

export default async function ContractPage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const query = await searchParams;

  const slugParam = pick(query, 'proveedor') ?? pick(query, 'provider');
  const subject = resolveProviderContractSubject(slugParam);

  const rawRequestId = pick(query, 'requestId');
  const requestId =
    rawRequestId && REQUEST_ID.test(rawRequestId.trim()) ? rawRequestId.trim() : todayRequestId();

  const rawDate = pick(query, 'date');
  const rawCity = pick(query, 'city');

  const initial: ContractSigningInitial = {
    requestId,
    providerName: subject?.displayName ?? CONTRACT_UNRESOLVED_PROVIDER,
    providerSlug: subject?.slug ?? null,
    clientName: pick(query, 'client')?.trim() || 'Contratante por identificar',
    eventDate: rawDate && ISO_DATE.test(rawDate.trim()) ? rawDate.trim() : CONTRACT_PENDING_LABEL,
    eventCity: rawCity?.trim() || CONTRACT_PENDING_LABEL,
    baseAmount: resolveAmount(pick(query, 'amount')),
  };

  return <ContractSigningClient initial={initial} />;
}
