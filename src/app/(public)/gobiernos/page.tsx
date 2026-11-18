import React from 'react';
import type { Metadata } from 'next';
import { DoorShell } from '@/components/home/DoorShell';

export const metadata: Metadata = {
  title: 'Administración pública e instituciones · EAR OS',
  description: 'Contratación menor de festejos, ciclos culturales e infraestructura conforme al artículo 118 de la LCSP.',
  alternates: { canonical: 'https://productoraear.com/gobiernos' },
};

export default function GobiernosPage(): React.JSX.Element {
  return <DoorShell door="gobiernos" />;
}
