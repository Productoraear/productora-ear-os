'use client';

import React, { useState } from 'react';
import VisionInput from '@/components/admin/VisionInput';
import MultiRailExecutionPanel from '@/components/admin/MultiRailExecutionPanel';
import CeoSkillsRack from '@/components/admin/CeoSkillsRack';
import type { CeoOperationalDimensionId } from '@/lib/compiler/ceo-operational-matrix';
import type { OracleRefinedOutput } from '@/lib/oraculo/oracle-refiner';

export default function CeoCockpitHub(): React.JSX.Element {
  const [selectedDimension, setSelectedDimension] = useState<CeoOperationalDimensionId>('CLIENTES_NOVIOS');
  const [rawVision, setRawVision] = useState<string>('');
  const [refinedOutput, setRefinedOutput] = useState<OracleRefinedOutput | null>(null);

  return (
    <div className="space-y-10">
      {/* 1. Matriz Canónica Multi-Rol de 8 Ejes (Cockpit Vision Input) */}
      <VisionInput
        selectedDimension={selectedDimension}
        onSelectDimension={setSelectedDimension}
        rawVision={rawVision}
        onChangeRawVision={setRawVision}
        onRefineComplete={setRefinedOutput}
        showRefinerOutput={true}
        title="COCKPIT CEO · MATRIZ MULTI-ROL DE 8 EJES"
        subtitle="Selecciona cualquiera de las 8 dimensiones operativas para compilar la visión en una Pepita de Oro y Megaprompt S-Class sin perder contexto ni invariantes de negocio."
      />

      {/* 2. Plano de Despacho Multi-Rail (7 Disparadores Industriales) */}
      <MultiRailExecutionPanel
        selectedDimension={selectedDimension}
        rawVision={rawVision}
        pepitaDeOro={refinedOutput?.pepitaDeOro || ''}
      />

      {/* 3. Cartuchos Ejecutivos Locales (0 Tokens) */}
      <div className="pt-4 border-t border-neutral-800">
        <CeoSkillsRack />
      </div>
    </div>
  );
}
