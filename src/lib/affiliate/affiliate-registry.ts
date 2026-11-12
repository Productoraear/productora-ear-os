/**
 * ════════════════════════════════════════════════════════════════════════════
 * PADRÓN DE AFILIADOS · RESOLUCIÓN SERVER-SIDE (SOLO SERVIDOR)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente única del listado de afiliados dados de alta en 1 clic. Es el MISMO
 * fichero que escribe `POST /api/affiliates/register`
 * (`src/data/affiliates_registered.json`), de modo que un coordinador de boda
 * o una finca que se da de alta obtiene su código y puede canjearlo de
 * inmediato en el simulador.
 *
 * SOLO SERVIDOR (usa `fs`). La capa pura de validación vive en
 * `solista-pricing.ts` (`validarCuponAfiliado`), que también consume el cliente.
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';
import type { AfiliadoCupon } from '@/lib/pricing/solista-pricing';

/** Ruta canónica compartida con `/api/affiliates/register`. */
export function affiliatesRegistryPath(): string {
  return path.join(process.cwd(), 'src', 'data', 'affiliates_registered.json');
}

/** Registro persistido de un afiliado (forma estable en disco). */
export interface AffiliateRegistryRecord extends AfiliadoCupon {
  readonly id?: string;
  readonly category?: string;
  readonly registeredAt?: string;
  readonly referralUrl?: string;
}

/**
 * Lee el padrón completo. FAIL-SAFE: sin fichero o con JSON corrupto devuelve
 * una lista vacía (ningún cupón se valida por accidente).
 */
export function readAffiliatesRegistry(): AffiliateRegistryRecord[] {
  try {
    const file = affiliatesRegistryPath();
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is AffiliateRegistryRecord =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as { affiliateCode?: unknown }).affiliateCode === 'string',
    );
  } catch (error: unknown) {
    console.warn('[AFFILIATES] Padrón ilegible, se opera sin cupones:', error);
    return [];
  }
}

/**
 * Padrón reducido al contrato mínimo del motor de precios: solo los afiliados
 * en estado activo, con los campos estrictamente necesarios.
 */
export function listActiveAffiliateCoupons(): AfiliadoCupon[] {
  return readAffiliatesRegistry()
    .filter((record) => {
      const status = (record.status || 'ACTIVE_HOMOLOGATED').toUpperCase();
      return status === 'ACTIVE_HOMOLOGATED' || status === 'ACTIVE';
    })
    .map((record) => ({
      affiliateCode: record.affiliateCode,
      name: record.name,
      companyName: record.companyName,
      status: record.status,
    }));
}

/** Afiliado concreto por código (comparación insensible a formato). */
export function findAffiliateByCode(code: string): AffiliateRegistryRecord | null {
  const target = code.trim().toUpperCase();
  if (target.length === 0) return null;
  return (
    readAffiliatesRegistry().find(
      (record) => record.affiliateCode.trim().toUpperCase() === target,
    ) ?? null
  );
}
