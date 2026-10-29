/**
 * ════════════════════════════════════════════════════════════════════════════
 * FICHA PROVIDER — RESOLUCIÓN REAL DE PROVEEDORES EN SERVIDOR (W43)
 * ════════════════════════════════════════════════════════════════════════════
 * Erradica la ceguera del Concierge y del Call Center sobre proveedores: dada
 * una URL de ficha (bodas.net u otra), una ruta interna `/proveedores/<slug>`,
 * un `vendorId` (`v-57523`) o un slug suelto, devuelve la ficha construida por
 * `scripts/build_provider_fichas.cjs` con su `provenanceHash`.
 *
 * CANDADOS:
 *  1. NUNCA se hace fetch de la URL del cliente (cero SSRF): sólo se parsea.
 *  2. Si los artefactos no existen, el store queda vacío y se avisa: el
 *     llamante recibe `null` y el prompt prohíbe inventar (cero fachadas).
 *  3. Lectura perezosa con caché global (patrón `edge-partition-loader`).
 *  4. Sólo servidor: usa `node:fs`. Jamás importar desde un Client Component.
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  entryToFicha,
  type ProviderFicha,
  type ProviderFichaGoldFile,
  type ProviderFichaIndexEntry,
  type ProviderFichaIndexFile,
} from '@/lib/providers/providerFichaTypes';

const DATA_DIR = path.join(process.cwd(), 'public', 'data', 'fichas');
const INDEX_PATH = path.join(DATA_DIR, 'fichas_index.json');
const GOLD_PATH = path.join(DATA_DIR, 'fichas_gold.json');

const MAX_RAW_CHARS = 2048;
const URL_RE: RegExp = /https?:\/\/[^\s<>"')]+/i;
const VENDOR_ID_PATTERNS: readonly RegExp[] = [/--e(\d{3,})/i, /\/vendor\/(\d+)/i, /[?&]id=(\d{4,})/i];

interface FichaStore {
  readonly loaded: boolean;
  readonly indexByKey: ReadonlyMap<string, ProviderFichaIndexEntry>;
  readonly indexBySlug: ReadonlyMap<string, ProviderFichaIndexEntry>;
  readonly indexByVendorId: ReadonlyMap<string, ProviderFichaIndexEntry>;
  readonly goldByKey: ReadonlyMap<string, ProviderFicha>;
}

const globalScan = globalThis as typeof globalThis & { __earFichaStore?: FichaStore };

/** Slug determinista idéntico al del builder. */
export function normalizeFichaSlug(value: unknown): string {
  return String(value === null || value === undefined ? '' : value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Extrae el id numérico de proveedor de una URL de ficha (sólo parseo). */
export function extractFichaVendorId(value: unknown): string | null {
  const raw: string = String(value === null || value === undefined ? '' : value);
  for (const pattern of VENDOR_ID_PATTERNS) {
    const match: RegExpExecArray | null = pattern.exec(raw);
    if (match !== null) return match[1];
  }
  return null;
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw: string = fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('[FICHA_PROVIDER] Artefacto ilegible', filePath, error);
    return null;
  }
}

function loadStore(): FichaStore {
  const cached: FichaStore | undefined = globalScan.__earFichaStore;
  if (cached !== undefined && cached.loaded) return cached;

  const indexFile: ProviderFichaIndexFile | null = readJsonFile<ProviderFichaIndexFile>(INDEX_PATH);
  const goldFile: ProviderFichaGoldFile | null = readJsonFile<ProviderFichaGoldFile>(GOLD_PATH);

  const indexByKey = new Map<string, ProviderFichaIndexEntry>();
  const indexBySlug = new Map<string, ProviderFichaIndexEntry>();
  const indexByVendorId = new Map<string, ProviderFichaIndexEntry>();
  const goldByKey = new Map<string, ProviderFicha>();

  if (indexFile !== null && Array.isArray(indexFile.entries)) {
    for (const entry of indexFile.entries) {
      if (!entry || typeof entry.key !== 'string') continue;
      indexByKey.set(entry.key, entry);
      if (entry.slug && !indexBySlug.has(entry.slug)) indexBySlug.set(entry.slug, entry);
      if (entry.key.startsWith('v-') && !indexByVendorId.has(entry.key.slice(2))) {
        indexByVendorId.set(entry.key.slice(2), entry);
      }
    }
  } else {
    console.warn('[FICHA_PROVIDER] Índice ausente: ejecuta node scripts/build_provider_fichas.cjs');
  }

  if (goldFile !== null && Array.isArray(goldFile.fichas)) {
    for (const ficha of goldFile.fichas) {
      if (ficha && typeof ficha.key === 'string') goldByKey.set(ficha.key, ficha);
    }
  }

  const store: FichaStore = { loaded: true, indexByKey, indexBySlug, indexByVendorId, goldByKey };
  globalScan.__earFichaStore = store;
  return store;
}

/** Ficha completa si está en el conjunto dorado; si no, elevación del índice. */
function toFicha(entry: ProviderFichaIndexEntry | undefined): ProviderFicha | null {
  if (entry === undefined) return null;
  const gold: ProviderFicha | undefined = loadStore().goldByKey.get(entry.key);
  return gold ?? entryToFicha(entry);
}

export function findFichaByVendorId(vendorId: unknown): ProviderFicha | null {
  const raw: string = String(vendorId === null || vendorId === undefined ? '' : vendorId);
  const numeric: string | null = extractFichaVendorId(raw);
  const normalized: string = numeric ?? raw.replace(/^v-/, '').replace(/\D/g, '');
  if (normalized.length < 3) return null;
  return toFicha(loadStore().indexByVendorId.get(normalized));
}

export function findFichaByKey(key: unknown): ProviderFicha | null {
  const raw: string = String(key === null || key === undefined ? '' : key).trim();
  if (raw.length === 0 || raw.length > 120) return null;
  return toFicha(loadStore().indexByKey.get(raw));
}

export function findFichaBySlug(slug: unknown): ProviderFicha | null {
  const normalized: string = normalizeFichaSlug(slug);
  if (normalized.length < 2) return null;
  const store: FichaStore = loadStore();
  const bySlug: ProviderFichaIndexEntry | undefined = store.indexBySlug.get(normalized);
  if (bySlug !== undefined) return toFicha(bySlug);
  // Rutas `/proveedores/<id>` y `<id>`: resolver por clave o por id de vendor.
  if (/^v-\d{3,}$/.test(normalized)) return toFicha(store.indexByKey.get(normalized));
  if (/^\d{3,}$/.test(normalized)) return toFicha(store.indexByVendorId.get(normalized));
  return null;
}

/**
 * Resuelve la ficha desde una URL (bodas.net, ruta interna) o texto libre.
 * Cadena determinista: vendorId de la URL → ruta `/proveedores/<slug>` → slug
 * completo del mensaje. Nunca abre la URL.
 */
export function resolveFichaFromUrlOrText(raw: unknown): ProviderFicha | null {
  if (raw === null || raw === undefined) return null;
  const text: string = String(raw).trim();
  if (text.length === 0) return null;
  const bounded: string = text.slice(0, MAX_RAW_CHARS);

  const urlMatch: RegExpExecArray | null = URL_RE.exec(bounded);
  const candidate: string = urlMatch !== null ? urlMatch[0] : bounded;

  const vendorId: string | null = extractFichaVendorId(candidate);
  if (vendorId !== null) {
    const byVendor: ProviderFicha | null = findFichaByVendorId(vendorId);
    if (byVendor !== null) return byVendor;
  }

  const pathMatch: RegExpExecArray | null = /\/proveedores\/([^/?#\s]+)/i.exec(candidate);
  if (pathMatch !== null) {
    const rawSlug: string = pathMatch[1].replace(/--e\d+$/i, '');
    const byPath: ProviderFicha | null = findFichaBySlug(rawSlug);
    if (byPath !== null) return byPath;
  }

  if (urlMatch !== null) {
    // URL de otro dominio (bodas.net): el slug vive antes del sufijo `--e<id>`.
    const segments: string[] = candidate.split('/').filter((part: string) => part.length > 0);
    const lastSegment: string | undefined = segments[segments.length - 1];
    if (lastSegment !== undefined) {
      const byLast: ProviderFicha | null = findFichaBySlug(lastSegment.replace(/--e\d+$/i, ''));
      if (byLast !== null) return byLast;
    }
    return null;
  }

  return findFichaBySlug(bounded) ?? findFichaByKey(bounded);
}

/** Diagnóstico: cuántas fichas tiene cargadas el proceso (auditoría viva). */
export function getFichaStoreStats(): {
  readonly entries: number;
  readonly gold: number;
  readonly verified: number;
  readonly loaded: boolean;
} {
  const store: FichaStore = loadStore();
  let verified = 0;
  for (const entry of store.indexByKey.values()) {
    if (entry.verified) verified += 1;
  }
  return { entries: store.indexByKey.size, gold: store.goldByKey.size, verified, loaded: store.loaded };
}

