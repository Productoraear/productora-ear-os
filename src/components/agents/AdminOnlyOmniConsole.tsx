'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { OmniAgentConsoleModal } from '@/components/agents/OmniAgentConsoleModal';

/**
 * Aislamiento de la consola Omni (AGENTS.md §1.2): la consola de supervisión con
 * trazas de daemon, voz y bus de agentes es una herramienta INTERNA del CEO.
 * Nunca se monta en la web pública; el cliente se atiende por WhatsApp.
 */
const INTERNAL_PREFIXES: readonly string[] = ['/admin', '/panel/agentes'];

export function AdminOnlyOmniConsole(): React.JSX.Element | null {
  const pathname = usePathname();
  const isInternal: boolean =
    typeof pathname === 'string' &&
    INTERNAL_PREFIXES.some((prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!isInternal) return null;
  return <OmniAgentConsoleModal />;
}

