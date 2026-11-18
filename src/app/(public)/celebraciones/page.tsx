import React from 'react';
import type { Metadata } from 'next';
import { JourneyPage } from '@/components/home/JourneyPage';

export const metadata: Metadata = {
  title: 'Celebraciones privadas y restauración · EAR OS',
  description: 'Restaurante Otzarreta en Derio, menús oficiales, música de gala y reserva con fianza deducible.',
  alternates: { canonical: 'https://productoraear.com/celebraciones' },
};

export default function CelebracionesPage(): React.JSX.Element {
  return <JourneyPage door="celebraciones" />;
}
