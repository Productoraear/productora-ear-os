'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMobileExperience, MobileExperienceMode } from '@/lib/config/mobile-experience-store';
import { MobileAdaptiveEngine, RuntimeProfile } from '@/lib/config/mobile-adaptive-engine';
import { SovereignMobileHUD } from '@/components/sclass/SovereignMobileHUD';
import { AIConciergeDock } from '@/components/chat/AIConciergeDock';
import { FloatingWhatsAppCta } from '@/components/ui/FloatingWhatsAppCta';

export function DynamicMobileExperienceOrchestrator() {
  const pathname = usePathname();
  const { config, isLoading } = useMobileExperience();
  const [profile, setProfile] = useState<RuntimeProfile | null>(null);

  // Evaluar perfilado en tiempo de ejecución (runtime profiling)
  useEffect(() => {
    if (!isLoading) {
      const evaluated = MobileAdaptiveEngine.evaluateProfile(config, pathname || '/');
      setProfile(evaluated);
    }
  }, [config, pathname, isLoading]);

  // En el panel de administración (/admin), no se inyectan interfaces públicas de cliente
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // 1. Guardrail: Kill-Switch Maestro de Emergencia
  if (config.guardrails?.emergencyKillSwitch) {
    return null;
  }

  // Determinar el modo activo: Si está en modo adaptativo usa el seleccionado por el motor, si no, el modo manual
  const effectiveMode: MobileExperienceMode = 
    config.routingStrategy === 'AUTONOMOUS_ADAPTIVE' && profile
      ? profile.selectedAdaptiveMode
      : config.activeMode;

  const { features } = config;

  return (
    <>
      {/* 1. MODO SOVEREIGN HUD V5 (SOLO NAVEGACIÓN MÓVIL REFINADA - CERO CHATBOTS FLOTANTES) */}
      {effectiveMode === 'SOVEREIGN_HUD_V5' && (
        <SovereignMobileHUD />
      )}

      {/* 2. MODO MINIMAL STEALTH / OMNI-BAR SUPREMACY: CERO WIDGETS FLOTANTES OBSOLETOS */}
      {effectiveMode !== 'SOVEREIGN_HUD_V5' && null}
    </>
  );
}

export default DynamicMobileExperienceOrchestrator;
