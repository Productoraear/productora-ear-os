import type React from 'react';
import { requireAdminFromHeaders } from '@/lib/security/adminGuard';
import { OmniAgentConsoleGate } from './OmniAgentConsoleGate';

/**
 * Aislamiento de la consola Omni (AGENTS.md §1.2): la consola de supervisión con
 * trazas de daemon, voz y bus de agentes es una herramienta INTERNA del CEO.
 * Poda estricta en servidor: sólo se instancia si la sesión admin verifica en servidor.
 */
export async function AdminOnlyOmniConsole(): Promise<React.JSX.Element | null> {
  const auth = await requireAdminFromHeaders();
  if (!auth.ok) {
    return null;
  }
  return <OmniAgentConsoleGate />;
}

