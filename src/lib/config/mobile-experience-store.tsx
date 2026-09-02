'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type MobileExperienceMode = 
  | 'SOVEREIGN_HUD_V5' 
  | 'AI_CONCIERGE_DOCK' 
  | 'CLASSIC_WHATSAPP' 
  | 'MINIMAL_STEALTH';

export type RoutingStrategy = 'AUTONOMOUS_ADAPTIVE' | 'MANUAL_OVERRIDE';

export interface MobileStudioFeatures {
  showRoleSwitcher: boolean;
  showJourneyBar: boolean;
  showAIConciergeFloating: boolean;
  showDirectWhatsAppButton: boolean;
  ambientGlow: boolean;
}

export interface BanditConfig {
  enabled: boolean;
  explorationRate: number;
  weights: Record<string, number>;
}

export interface GuardrailsConfig {
  latencySlaMs: number;
  emergencyKillSwitch: boolean;
  shadowDomIsolation: boolean;
  degradeOnSlowConnection: boolean;
}

export interface PersonaConfig {
  activeTone: string;
  contextBoundary: string;
  retentionPhone: string;
}

export interface TelemetryConfig {
  effectiveContactRate: number;
  avgTimeToInteractSec: number;
  p95LatencyMs: number;
  sessionChurnRate: number;
}

export interface MobileStudioConfig {
  activeMode: MobileExperienceMode;
  routingStrategy: RoutingStrategy;
  banditTesting: BanditConfig;
  guardrails: GuardrailsConfig;
  persona: PersonaConfig;
  telemetry: TelemetryConfig;
  features: MobileStudioFeatures;
  rolesEnabled: string[];
  updatedAt: string;
}

export const DEFAULT_MOBILE_STUDIO_CONFIG: MobileStudioConfig = {
  activeMode: 'SOVEREIGN_HUD_V5',
  routingStrategy: 'AUTONOMOUS_ADAPTIVE',
  banditTesting: {
    enabled: true,
    explorationRate: 0.3,
    weights: {
      SOVEREIGN_HUD_V5: 0.55,
      AI_CONCIERGE_DOCK: 0.25,
      CLASSIC_WHATSAPP: 0.15,
      MINIMAL_STEALTH: 0.05
    }
  },
  guardrails: {
    latencySlaMs: 1200,
    emergencyKillSwitch: false,
    shadowDomIsolation: true,
    degradeOnSlowConnection: true
  },
  persona: {
    activeTone: 'HIGH_VALUE_COMMERCIAL',
    contextBoundary: 'SOVEREIGN_FULL_CATALOG',
    retentionPhone: '+34 693 693 048'
  },
  telemetry: {
    effectiveContactRate: 16.4,
    avgTimeToInteractSec: 2.8,
    p95LatencyMs: 420,
    sessionChurnRate: 5.2
  },
  features: {
    showRoleSwitcher: true,
    showJourneyBar: true,
    showAIConciergeFloating: false,
    showDirectWhatsAppButton: false,
    ambientGlow: true
  },
  rolesEnabled: ['novios', 'corporativo', 'artistas', 'b2g_institucional'],
  updatedAt: new Date().toISOString()
};

interface MobileExperienceContextType {
  config: MobileStudioConfig;
  setMode: (mode: MobileExperienceMode) => Promise<void>;
  setRoutingStrategy: (strategy: RoutingStrategy) => Promise<void>;
  updateConfig: (newConfig: Partial<MobileStudioConfig>) => Promise<void>;
  isLoading: boolean;
}

const MobileExperienceContext = createContext<MobileExperienceContextType | undefined>(undefined);

export function MobileExperienceProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<MobileStudioConfig>(DEFAULT_MOBILE_STUDIO_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Carga inicial: API + LocalStorage fallback
  useEffect(() => {
    let isMounted = true;
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/mobile-studio/config');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setConfig(prev => ({ ...prev, ...data }));
            localStorage.setItem('ear_mobile_studio_config', JSON.stringify(data));
          }
        } else {
          const cached = localStorage.getItem('ear_mobile_studio_config');
          if (cached && isMounted) {
            setConfig(JSON.parse(cached));
          }
        }
      } catch (err) {
        const cached = localStorage.getItem('ear_mobile_studio_config');
        if (cached && isMounted) {
          setConfig(JSON.parse(cached));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  const setMode = async (mode: MobileExperienceMode) => {
    await updateConfig({ activeMode: mode });
  };

  const setRoutingStrategy = async (strategy: RoutingStrategy) => {
    await updateConfig({ routingStrategy: strategy });
  };

  const updateConfig = async (newConfig: Partial<MobileStudioConfig>) => {
    const merged: MobileStudioConfig = {
      ...config,
      ...newConfig,
      features: {
        ...config.features,
        ...(newConfig.features || {})
      },
      banditTesting: {
        ...config.banditTesting,
        ...(newConfig.banditTesting || {})
      },
      guardrails: {
        ...config.guardrails,
        ...(newConfig.guardrails || {})
      },
      persona: {
        ...config.persona,
        ...(newConfig.persona || {})
      },
      telemetry: {
        ...config.telemetry,
        ...(newConfig.telemetry || {})
      },
      updatedAt: new Date().toISOString()
    };

    setConfig(merged);
    try {
      localStorage.setItem('ear_mobile_studio_config', JSON.stringify(merged));
      await fetch('/api/admin/mobile-studio/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
    } catch (error) {
      console.error('[MOBILE_STORE_UPDATE_ERROR]', error);
    }
  };

  return (
    <MobileExperienceContext.Provider value={{ config, setMode, setRoutingStrategy, updateConfig, isLoading }}>
      {children}
    </MobileExperienceContext.Provider>
  );
}

export function useMobileExperience() {
  const context = useContext(MobileExperienceContext);
  if (!context) {
    return {
      config: DEFAULT_MOBILE_STUDIO_CONFIG,
      setMode: async () => {},
      setRoutingStrategy: async () => {},
      updateConfig: async () => {},
      isLoading: false
    };
  }
  return context;
}
