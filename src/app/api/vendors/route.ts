import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

function normalizePhone(raw: string | undefined): string | null {
  if (!raw) return null;
  let cleaned = raw.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.slice(2);
  } else if (/^[6789]\d{8}$/.test(cleaned)) {
    cleaned = '+34' + cleaned;
  }
  if (!/^\+\d{9,15}$/.test(cleaned)) return null;
  return cleaned;
}

function isVerifiablePhone(raw: string | undefined): boolean {
  const normalized = normalizePhone(raw);
  if (normalized === null) return false;
  if (normalized === '+34693693048') return false;
  if (/^\+34(\d)\1{8}$/.test(normalized)) return false;
  return true;
}

type CatalogueEntry = {
  id: string;
  name: string;
  category: string;
  phone?: string;
  email?: string;
  verified: boolean;
  notes: string;
};

type RawProvider = {
  id?: string;
  slug?: string;
  name?: string;
  category?: string;
  vertical?: string;
  phone?: string;
  email?: string;
};

export async function GET() {
  try {
    const dbVendors = await prisma.vendor.findMany({
      orderBy: { name: 'asc' },
    });

    let catalogueVendors: CatalogueEntry[] = [];
    const ssotPath = path.join(process.cwd(), 'src/data/vampirized_providers.json');

    if (fs.existsSync(ssotPath)) {
      try {
        const raw = fs.readFileSync(ssotPath, 'utf-8');
        const parsed: unknown = JSON.parse(raw);

        let list: RawProvider[] = [];
        if (Array.isArray(parsed)) {
          list = parsed as RawProvider[];
        } else if (parsed && typeof parsed === 'object' && 'providers' in parsed) {
          const providers = (parsed as { providers?: unknown }).providers;
          list = Array.isArray(providers) ? (providers as RawProvider[]) : [];
        }

        catalogueVendors = list
          .filter((v: RawProvider) => Boolean(v.name) && Boolean(v.id || v.slug))
          .slice(0, 300)
          .map((v: RawProvider): CatalogueEntry => ({
            id: (v.id ?? v.slug) as string,
            name: v.name as string,
            category: v.category || v.vertical || 'General',
            phone: normalizePhone(v.phone) ?? undefined,
            email: v.email || undefined,
            verified: isVerifiablePhone(v.phone),
            notes: 'Homologado en Catálogo EAR OS',
          }))
          .filter((cv: CatalogueEntry) => cv.verified === true);
      } catch (e) {
        console.error('Error reading vampirized providers for vendors:', e);
      }
    }

    const merged = [
      ...dbVendors,
      ...catalogueVendors.filter(cv => !dbVendors.some(dv => dv.name.toLowerCase() === cv.name.toLowerCase()))
    ];

    return NextResponse.json(merged);
  } catch (error: unknown) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json([], { status: 200 });
  }
}
