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

  // En panel de administración (/admin) y paneles privados (/panel), no se inyectan interfaces públicas
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/panel')) {
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

  // 🧭 DOCTRINA DE AGENTES SINCRONIZADOS (SELLO DE DOMINIO):
  // El Concierge IA y el Oráculo Astra (HUD) se montan SIEMPRE en móvil.
  // El enrutador adaptativo es una capa de optimización, NO un interruptor que
  // deje la pantalla táctil sin agentes. Bug sellado: el evento `open-ai-concierge`
  // no tenía listener porque AIConciergeDock se importaba pero jamás se renderizaba.
  return (
    <>
      {/* Concierge IA Territorial — responde al evento `open-ai-concierge` del HUD */}
      <AIConciergeDock />

      {/* Navegación móvil + Oráculo Astra Copilot (roles, acústica 12 W/pax, IA y retención) */}
      <SovereignMobileHUD />

      {/* Refuerzo WhatsApp en estrategia clásica (solo desktop: en móvil el dock
          unificado ya cubre WhatsApp/Teléfono y cualquier flotante taparía el dock) */}
      {effectiveMode === 'CLASSIC_WHATSAPP' && <FloatingWhatsAppCta />}
    </>
  );
}

export default DynamicMobileExperienceOrchestrator;
