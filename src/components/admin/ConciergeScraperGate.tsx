'use client';

import dynamic from 'next/dynamic';
import type React from 'react';

const ConciergeScraperPanel = dynamic(
  () => import('./ConciergeScraperPanel').then((m) => m.ConciergeScraperPanel),
  { ssr: false }
);

export function ConciergeScraperGate(): React.JSX.Element {
  return <ConciergeScraperPanel />;
}
