import React from 'react';
import type { Metadata } from 'next';
import { JourneyPage } from '@/components/home/JourneyPage';

export const metadata: Metadata = {
  title: 'Profesionales, creadores y afiliados · EAR OS',
  description: 'Alta de ficha, alquiler técnico y red de afiliados con cobro garantizado.',
  alternates: { canonical: 'https://productoraear.com/profesionales' },
};

export default function ProfesionalesPage(): React.JSX.Element {
  return <JourneyPage door="profesionales" />;
}
