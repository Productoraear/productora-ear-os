import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ═══════════════════════════════════════════════════════════════════════════
// BLINDAJE ANTI-FACHADA (W37_T02) — Doctrina del Dato Verificado:
// solo se sirven proveedores con un teléfono REAL verificable. El flag
// `verified` persistido en el data lake NUNCA se confía: se recalcula aquí
// con isVerifiablePhone (centralita +34 693 693 048, vacío, repetido o
// inválido => registro descartado). Cero generadores aleatorios de relleno,
// cero nombres sintéticos: si no hay teléfono real, no hay proveedor.
// ═══════════════════════════════════════════════════════════════════════════

const PLACEHOLDER_CANON = '+34693693048';
const MAX_CATALOGUE_VENDORS = 300;
const PHONE_KEY_RE = /^(phone|telephone|telefono|telefonos|tel|movil|whatsapp|mobile)$/;
const DIACRITICS_RE = /[\u0300-\u036f]/g;

function normalizePhone(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  const text = String(raw).trim();
  if (!text) return null;
  let cleaned = text.replace(/[^0-9+]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('00')) {
    cleaned = `+${cleaned.slice(2)}`;
  }
  if (cleaned.startsWith('+')) {
    const digits = cleaned.slice(1);
    if (!/^\d{9,15}$/.test(digits)) return null;
    if (digits.length === 11 && digits.startsWith('34')) return `+34${digits.slice(2)}`;
    return `+${digits}`;
  }
  if (/^34\d{9}$/.test(cleaned)) return `+${cleaned}`;
  if (/^[6789]\d{8}$/.test(cleaned)) return `+34${cleaned}`;
  if (/^\d{9,15}$/.test(cleaned)) return `+${cleaned}`;
  return null;
}

function isVerifiablePhone(raw: unknown): boolean {
  const normalized = normalizePhone(raw);
  if (normalized === null) return false;
  if (normalized === PLACEHOLDER_CANON) return false;
  if (/^\+34(\d)\1{8}$/.test(normalized)) return false;
  return true;
}

function isPhoneKey(key: string): boolean {
  const plain = key.normalize('NFD').replace(DIACRITICS_RE, '').toLowerCase();
  return PHONE_KEY_RE.test(plain);
}

function pickVerifiablePhone(record: Record<string, unknown>): string | null {
  for (const key of Object.keys(record)) {
    if (!isPhoneKey(key)) continue;
    const value = record[key];
    if (isVerifiablePhone(value)) return normalizePhone(value);
  }
  return null;
}

type CatalogueEntry = {
  id: string;
  name: string;
  category: string;
  phone: string;
  email?: string;
  verified: boolean;
  notes: string;
};

type CatalogueCache = {
  key: string;
  vendors: CatalogueEntry[];
};

let catalogueCache: CatalogueCache | null = null;

function extractProviderList(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) return parsed;
  if (parsed !== null && typeof parsed === 'object' && 'providers' in parsed) {
    const providers = (parsed as { providers?: unknown }).providers;
    return Array.isArray(providers) ? providers : [];
  }
  return [];
}

function readString(record: Record<string, unknown>, keys: readonly string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  }
  return '';
}

function loadCatalogueVendors(ssotPath: string): CatalogueEntry[] {
  if (!fs.existsSync(ssotPath)) return [];

  const stats = fs.statSync(ssotPath);
  const cacheKey = `${ssotPath}|${stats.mtimeMs}|${stats.size}`;
  if (catalogueCache !== null && catalogueCache.key === cacheKey) {
    return catalogueCache.vendors;
  }

  const parsed: unknown = JSON.parse(fs.readFileSync(ssotPath, 'utf-8'));
  const list = extractProviderList(parsed);
  const vendors: CatalogueEntry[] = [];

  for (const item of list) {
    if (vendors.length >= MAX_CATALOGUE_VENDORS) break;
    if (item === null || typeof item !== 'object' || Array.isArray(item)) continue;
    const record = item as Record<string, unknown>;

    const name = readString(record, ['name']);
    const id = readString(record, ['id', 'slug']);
    if (!name || !id) continue;

    const phone = pickVerifiablePhone(record);
    if (phone === null) continue;

    const verified = isVerifiablePhone(phone);
    if (!verified) continue;

    vendors.push({
      id,
      name,
      category: readString(record, ['category', 'vertical']) || 'General',
      phone,
      email: readString(record, ['email']) || undefined,
      verified,
      notes: 'Homologado en Catálogo EAR OS',
    });
  }

  catalogueCache = { key: cacheKey, vendors };
  return vendors;
}

export async function GET() {
  let dbVendors: Awaited<ReturnType<typeof prisma.vendor.findMany>> = [];
  try {
    dbVendors = await prisma.vendor.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (dbError: unknown) {
    // La caída de PostgreSQL no puede tumbar el catálogo verificado en disco.
    console.error('Error fetching DB vendors (se sirve el catálogo verificado):', dbError);
  }

  try {
    const ssotPath = path.join(process.cwd(), 'src/data/vampirized_providers.json');
    const catalogueVendors = loadCatalogueVendors(ssotPath);

    const merged = [
      ...dbVendors,
      ...catalogueVendors.filter(
        (cv) => !dbVendors.some((dv) => dv.name.toLowerCase() === cv.name.toLowerCase()),
      ),
    ];

    return NextResponse.json(merged);
  } catch (error: unknown) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json([], { status: 200 });
  }
}
