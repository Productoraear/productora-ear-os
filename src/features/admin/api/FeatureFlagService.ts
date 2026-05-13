import { prisma } from "@/lib/prisma";

/**
 * 🏛️ EAR OS GOLD - FEATURE FLAG ENGINE
 * Motor de control central para el encendido/apagado de módulos S-Class.
 */

// Caché en memoria para evitar saturar la DB en cada request (TTL: 60s)
const featureCache: Record<string, { isActive: boolean; timestamp: number }> = {};
const CACHE_TTL = 60 * 1000;

/**
 * Verifica si un módulo o funcionalidad específica está activo en el sistema.
 * Prioriza la seguridad y la latencia mediante un sistema de caché de nivel servidor.
 */
export async function isFeatureEnabled(featureName: string): Promise<boolean> {
  const now = Date.now();
  
  // 1. Verificación en Caché (Hit)
  if (featureCache[featureName] && (now - featureCache[featureName].timestamp < CACHE_TTL)) {
    return featureCache[featureName].isActive;
  }

  try {
    // 2. Consulta a Prisma (Soberanía de Datos)
    const feature = await prisma.systemFeature.findUnique({
      where: { name: featureName },
      select: { isActive: true }
    });

    const isActive = feature?.isActive ?? false;

    // 3. Actualización de Caché
    featureCache[featureName] = {
      isActive,
      timestamp: now
    };

    return isActive;
  } catch (error) {
    console.error(`[FEATURE_FLAG_ENGINE] Error evaluando estado de ${featureName}:`, error);
    // Fallback de seguridad: En caso de error, el módulo se considera APAGADO (Fail-Safe).
    return false;
  }
}

/**
 * Fuerza la limpieza de la caché de una funcionalidad (útil tras cambios en el Nexus Dashboard).
 */
export function invalidateFeatureCache(featureName: string) {
  delete featureCache[featureName];
}
