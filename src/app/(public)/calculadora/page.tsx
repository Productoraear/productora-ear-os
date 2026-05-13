import CostCalculator from '@/app/components/CostCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculadora S-Class | EAR OS GOLD',
  description: 'Arquitectura de costes en tiempo real para eventos de alto impacto.',
};

export default function CalculadoraPage() {
  return <CostCalculator />;
}
