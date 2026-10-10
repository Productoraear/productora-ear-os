'use client';

import SovereignBudgetPlanner from './SovereignBudgetPlanner';

/**
 * 🏛️ TERMINAL SOBERANO MULTI-GREMIO // S-CLASS OMEGA
 * Unificación total: Planificador de Riqueza Nupcial (14 Partidas) +
 * Packs Canónicos Productora EAR + Radar Neural Multi-Gremio de 90.000 Proveedores.
 *
 * ♿ A11Y S-CLASS: Wrapper semántico con region landmark, aria-label descriptivo
 * y role="region" para garantizar navegación accesible por lectores de pantalla.
 */
export function CommercialEventCalculator(): React.JSX.Element {
  return (
    <section
      role="region"
      aria-label="Calculadora comercial de eventos — Terminal Soberano Multi-Gremio"
      aria-describedby="commercial-event-calculator-description"
      data-testid="commercial-event-calculator"
      className="w-full bg-[#030305] text-white"
    >
      <p id="commercial-event-calculator-description" className="sr-only">
        Planificador de riqueza nupcial con 14 partidas, packs canónicos de
        Productora EAR y radar neural multi-gremio de 90.000 proveedores.
      </p>
      <SovereignBudgetPlanner />
    </section>
  );
}

export default CommercialEventCalculator;