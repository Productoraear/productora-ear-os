/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SRE WATCHDOG Y MOTOR DE AUTOCURA EN RUNTIME
 * ════════════════════════════════════════════════════════════════════════════
 * Monitorización continua cada 5 minutos e inspección determinista:
 *  - Verificación criptográfica del SSOT (Zona Cero inviolable).
 *  - Diagnóstico de memoria heap y latencia de respuesta.
 *  - Detección de degradación y activación de autocura (fallback resiliente).
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
    computeSsotHash,
    verifySsotIntegrity,
} from '@/lib/security/ssotIntegrityGuard';

/**
 * CORRECCIÓN FORENSE (2026-11-20, medida contra producción).
 *
 * Defecto real que este bloque cierra: el watchdog calculaba el SHA-256 del
 * TEXTO CRUDO del fichero (`src/lib/constants/ear-os-ssot.ts`) y lo comparaba
 * contra el hash de la SERIALIZACIÓN CANÓNICA del SSOT
 * (`computeSsotHash()` en `ssotIntegrityGuard.ts`). Son dos huellas de objetos
 * distintos: el hash de fichero depende de comentarios, espacios y saltos de
 * línea; el canónico sólo de los 17 valores del motor financiero.
 *
 * Consecuencia MEDIDA en producción (buildSha=a7fdd265): el fichero está
 * intacto —idéntico al de Git— y aun así `/api/health` publicaba
 * `status:"COMPROMISED"`, `computedSha256:"81c7e7b4…"`, `isHealthy:false` y la
 * alerta "SHA-256 de ear-os-ssot.ts difiere del patrón canónico". Un falso
 * positivo permanente: la única forma de "curarlo" era editar el SSOT para
 * forzar el hash, es decir, romper la Zona Cero para satisfacer al vigilante.
 *
 * La fuente de verdad del SSOT ya estaba definida una sola vez en
 * `ssotIntegrityGuard.ts` (constante + invariantes de negocio). Este módulo
 * deja de tener su propia copia del hash canónico y re-exporta el original:
 * una sola definición, cero deriva entre auditorías (SSOT único).
 */
export const CANONICAL_SSOT_SHA256: string = computeSsotHash();

export interface SystemHealthReport {
  timestamp: string;
  isHealthy: boolean;
  ssotIntegrity: {
    status: 'VERIFIED' | 'COMPROMISED';
    computedSha256: string;
    expectedSha256: string;
  };
  resources: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
    uptimeSeconds: number;
  };
  selfHealingActions: string[];
}

export function runSreIntegrityAudit(): SystemHealthReport {
  let computedSha = '';
  let ssotStatus: 'VERIFIED' | 'COMPROMISED' = 'COMPROMISED';
  const actions: string[] = [];

  /**
   * Se audita con `verifySsotIntegrity()`, la MISMA función que usan
   * `npm run audit:ssot` y los verificadores de arnés. Antes este watchdog leía
   * el fichero con `fs` y lo hasheaba en crudo, lo que producía un falso
   * `COMPROMISED` permanente en producción (ver comentario de la constante).
   * Ventaja adicional: ahora se validan también los invariantes de negocio
   * (350 € / 550 € / depósito 100 € / split 80-10-10 / techo LCSP), no sólo
   * la huella criptográfica.
   */
  try {
    const report = verifySsotIntegrity();
    computedSha = report.computedHash;
    if (report.intact) {
      ssotStatus = 'VERIFIED';
    } else if (report.computedHash !== report.referenceHash) {
      actions.push('ALERTA SRE: hash canónico del SSOT difiere del patrón sellado.');
    }
    for (const violation of report.violatedInvariants) {
      actions.push(`ALERTA SRE: invariante de negocio violado — ${violation}`);
    }
  } catch (err) {
    actions.push(`ALERTA SRE: Fallo al verificar el SSOT: ${err instanceof Error ? err.message : String(err)}`);
  }

  const mem = process.memoryUsage();
  const heapUsedMb = Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100;
  const heapTotalMb = Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100;
  const rssMb = Math.round((mem.rss / 1024 / 1024) * 100) / 100;

  if (heapUsedMb > 450) {
    actions.push('ACCIÓN SRE AUTOCURA: Disparado vaciado de caché y GC preventivo por uso elevado de memoria.');
  }

  return {
    timestamp: new Date().toISOString(),
    isHealthy: ssotStatus === 'VERIFIED',
    ssotIntegrity: {
      status: ssotStatus,
      computedSha256: computedSha,
      expectedSha256: CANONICAL_SSOT_SHA256
    },
    resources: {
      heapUsedMb,
      heapTotalMb,
      rssMb,
      uptimeSeconds: Math.round(process.uptime())
    },
    selfHealingActions: actions
  };
}
