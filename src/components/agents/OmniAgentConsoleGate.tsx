'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import type React from 'react';

const INTERNAL_PREFIXES: readonly string[] = ['/admin', '/panel/agentes'];

const OmniAgentConsoleModal = dynamic(
  () => import('./OmniAgentConsoleModal').then((m) => m.OmniAgentConsoleModal),
  { ssr: false }
);

export function OmniAgentConsoleGate(): React.JSX.Element | null {
  const pathname = usePathname();
  const isInternal: boolean =
    typeof pathname === 'string' &&
    INTERNAL_PREFIXES.some((prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!isInternal) return null;
  return <OmniAgentConsoleModal />;
}
