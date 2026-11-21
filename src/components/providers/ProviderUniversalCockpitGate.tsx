'use client';

import dynamic from 'next/dynamic';
import type React from 'react';
import type { ProviderUniversalCockpitProps } from './ProviderUniversalCockpit';

const ProviderUniversalCockpit = dynamic(
  () => import('./ProviderUniversalCockpit').then((m) => m.ProviderUniversalCockpit),
  { ssr: false }
);

export function ProviderUniversalCockpitGate(props: ProviderUniversalCockpitProps): React.JSX.Element {
  return <ProviderUniversalCockpit {...props} />;
}
