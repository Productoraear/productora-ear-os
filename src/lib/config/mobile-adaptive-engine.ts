'use client';

import { MobileExperienceMode, MobileStudioConfig } from './mobile-experience-store';

export interface RuntimeProfile {
  intentScore: number;
  sourceType: 'PAID_COLD' | 'QR_VENUE' | 'ORGANIC_SEARCH' | 'DIRECT_RETURN';
  connectionSpeed: string;
  isSlowConnection: boolean;
  dwellTimeSeconds: number;
  selectedAdaptiveMode: MobileExperienceMode;
  degradedBySla: boolean;
}

/**
 * Motor de Enrutamiento Contextual y Perfilado de Lead en Tiempo Real (Runtime Profiling)
 * Transforma el layout de la web pública de forma autónoma según micro-señales del usuario.
 */
export class MobileAdaptiveEngine {
  private static startTime: number = Date.now();
  private static dwellSeconds: number = 0;
  private static isDegraded: boolean = false;

  /**
   * Evalúa las micro-señales del entorno del cliente y determina el traje óptimo.
   */
  public static evaluateProfile(config: MobileStudioConfig, pathname: string): RuntimeProfile {
    if (typeof window === 'undefined') {
      return {
        intentScore: 50,
        sourceType: 'DIRECT_RETURN',
        connectionSpeed: '4g',
        isSlowConnection: false,
        dwellTimeSeconds: 0,
        selectedAdaptiveMode: config.activeMode,
        degradedBySla: false
      };
    }

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.dwellSeconds = elapsed;

    // 1. Detección de Parámetros de Adquisición (UTMs y QR)
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = (urlParams.get('utm_source') || '').toLowerCase();
    const utmMedium = (urlParams.get('utm_medium') || '').toLowerCase();
    const ref = (urlParams.get('ref') || '').toLowerCase();
    const referrer = (document.referrer || '').toLowerCase();

    let sourceType: RuntimeProfile['sourceType'] = 'DIRECT_RETURN';

    if (ref.includes('qr') || utmSource.includes('qr') || urlParams.has('venue')) {
      sourceType = 'QR_VENUE';
    } else if (
      utmSource.includes('meta') || 
      utmSource.includes('facebook') || 
      utmSource.includes('instagram') || 
      utmSource.includes('tiktok') || 
      utmMedium.includes('cpc') || 
      utmMedium.includes('paid')
    ) {
      sourceType = 'PAID_COLD';
    } else if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('ecosia')) {
      sourceType = 'ORGANIC_SEARCH';
    }

    // 2. Telemetría de Red y SLA de Latencia
    const navConn = (navigator as any).connection;
    const connectionSpeed = navConn?.effectiveType || '4g';
    const isSlowConnection = connectionSpeed === '2g' || connectionSpeed === 'slow-2g';

    // 3. Cálculo de Score de Intención (0 - 100)
    let intentScore = 45; // Base neutra
    if (sourceType === 'QR_VENUE') intentScore += 35; // Usuario ya está en el evento
    if (sourceType === 'PAID_COLD') intentScore -= 15; // Tráfico frío necesita derivación rápida
    if (sourceType === 'ORGANIC_SEARCH') intentScore += 20; // Búsqueda intencional
    if (pathname.includes('/checkout') || pathname.includes('/presupuesto')) intentScore += 25;
    if (pathname.includes('/artistas/') || pathname.includes('/arsenal')) intentScore += 15;
    if (elapsed > 15) intentScore += 10;
    intentScore = Math.min(100, Math.max(0, intentScore));

    // 4. Guardrail de Latencia SLA (<1.2s) y Kill-Switch de Emergencia
    if (config.guardrails?.emergencyKillSwitch) {
      return {
        intentScore,
        sourceType,
        connectionSpeed,
        isSlowConnection,
        dwellTimeSeconds: elapsed,
        selectedAdaptiveMode: 'MINIMAL_STEALTH',
        degradedBySla: true
      };
    }

    if (config.guardrails?.degradeOnSlowConnection && isSlowConnection) {
      this.isDegraded = true;
      return {
        intentScore,
        sourceType,
        connectionSpeed,
        isSlowConnection,
        dwellTimeSeconds: elapsed,
        selectedAdaptiveMode: 'CLASSIC_WHATSAPP',
        degradedBySla: true
      };
    }

    // 5. Estrategia de Enrutamiento (Manual Override vs. Autónomo Adaptativo)
    let selectedMode: MobileExperienceMode = config.activeMode;

    if (config.routingStrategy === 'AUTONOMOUS_ADAPTIVE') {
      if (sourceType === 'PAID_COLD') {
        // En pauta fría: derivación directa a retención telefónica o WhatsApp para evitar fricción
        selectedMode = 'CLASSIC_WHATSAPP';
      } else if (sourceType === 'QR_VENUE') {
        // En eventos presenciales / QR: experiencia completa autoservicio One-Screen
        selectedMode = 'SOVEREIGN_HUD_V5';
      } else if (intentScore > 70) {
        // Lead de alta temperatura: Sovereign HUD v5 con Oráculo Astra
        selectedMode = 'SOVEREIGN_HUD_V5';
      } else {
        // Multi-Armed Bandit testing para el resto de tráfico
        selectedMode = this.allocateBanditMode(config.banditTesting?.weights);
      }
    }

    return {
      intentScore,
      sourceType,
      connectionSpeed,
      isSlowConnection,
      dwellTimeSeconds: elapsed,
      selectedAdaptiveMode: selectedMode,
      degradedBySla: this.isDegraded
    };
  }

  /**
   * Distribución Multi-Armed Bandit basada en pesos históricos del dashboard.
   */
  private static allocateBanditMode(weights?: Record<string, number>): MobileExperienceMode {
    if (!weights) return 'SOVEREIGN_HUD_V5';

    const rand = Math.random();
    let cumulative = 0;

    for (const [mode, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (rand <= cumulative) {
        return mode as MobileExperienceMode;
      }
    }

    return 'SOVEREIGN_HUD_V5';
  }
}
