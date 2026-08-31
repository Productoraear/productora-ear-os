import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export interface ProviderRecord {
  id: string;
  shaHash?: string;
  name: string;
  category: string;
  province: string;
  municipality?: string | null;
  telephone?: string | null;
  priceRange?: string | null;
  rating?: number | null;
  reviewsCount?: number | null;
  description?: string | null;
  imageUrls: string[];
  claimToken: string;
  status: string;
}

/**
 * 🏛️ READ-LAYER S-CLASS CON CACHÉ DE REACT E ISR
 * ===============================================
 * Consulta la base de datos PostgreSQL/Prisma utilizando los índices B-Tree [province, category].
 * Si la base de datos no está disponible, cae de forma 100% segura en el fallback local JSON.
 */
export const getProvidersByLocation = cache(
  async (
    provinceQuery: string,
    categoryQuery?: string,
    limit: number = 8
  ): Promise<ProviderRecord[]> => {
    const normProv = (provinceQuery || '').toLowerCase().trim();
    const normCat = (categoryQuery || '').toLowerCase().trim();

    // 1. Intentar consulta optimizada a PostgreSQL / Prisma
    if (process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL) {
      try {
        const whereClause: any = {};

        if (normProv && normProv !== 'todas' && normProv !== 'espana') {
          whereClause.province = {
            contains: normProv,
            mode: 'insensitive',
          };
        }

        if (normCat && normCat !== 'all' && normCat !== 'todos') {
          whereClause.category = {
            contains: normCat,
            mode: 'insensitive',
          };
        }

        const dbRecords = await prisma.vendorShadowProfile.findMany({
          where: whereClause,
          orderBy: [
            { rating: 'desc' },
            { reviewsCount: 'desc' },
          ],
          take: limit,
        });

        if (dbRecords && dbRecords.length > 0) {
          return dbRecords.map((r) => ({
            id: r.id,
            shaHash: r.shaHash,
            name: r.name,
            category: r.category,
            province: r.province,
            municipality: r.municipality,
            telephone: r.telephone,
            priceRange: r.priceRange,
            rating: r.rating,
            reviewsCount: r.reviewsCount,
            description: r.description,
            imageUrls: r.imageUrls,
            claimToken: r.claimToken,
            status: r.status,
          }));
        }
      } catch (dbError) {
        console.warn('⚠️ [VAMPIRE SERVICE] Fallback a JSON local por error DB:', dbError);
      }
    }

    // 2. Fallback defensivo a vampirized_providers.json
    try {
      const jsonPath = path.join(process.cwd(), 'src', 'data', 'vampirized_providers.json');
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const jsonProviders: any[] = JSON.parse(raw);

        const filtered = jsonProviders
          .filter((p) => {
            const pProv = (p.provincia || p.province || '').toLowerCase();
            const pCat = (p.category || '').toLowerCase();
            const matchProv = !normProv || normProv === 'todas' || normProv === 'espana' || pProv.includes(normProv);
            const matchCat = !normCat || normCat === 'all' || normCat === 'todos' || pCat.includes(normCat);
            return matchProv && matchCat;
          })
          .slice(0, limit);

        return filtered.map((p, idx) => ({
          id: `fallback-${idx}`,
          name: p.name || 'Proveedor Homologado',
          category: p.category || 'Servicios para Eventos',
          province: p.provincia || p.province || 'España',
          municipality: p.municipality || null,
          telephone: p.telephone || null,
          priceRange: p.priceRange || p.price_range || null,
          rating: p.rating || 4.8,
          reviewsCount: p.reviewsCount || p.reviews_count || 12,
          description: p.description || null,
          imageUrls: Array.isArray(p.image_urls) ? p.image_urls : (p.images || []),
          claimToken: p.claimToken || `EAR-CLAIM-${idx}`,
          status: p.status || 'GHOST_UNCLAIMED',
        }));
      }
    } catch (fsError) {
      console.error('❌ [VAMPIRE SERVICE] Error en fallback JSON:', fsError);
    }

    return [];
  }
);

/**
 * Obtiene un proveedor por su claimToken único
 */
export const getProviderByClaimToken = cache(
  async (claimToken: string): Promise<ProviderRecord | null> => {
    if (!claimToken) return null;

    if (process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL) {
      try {
        const r = await prisma.vendorShadowProfile.findUnique({
          where: { claimToken },
        });
        if (r) {
          return {
            id: r.id,
            shaHash: r.shaHash,
            name: r.name,
            category: r.category,
            province: r.province,
            municipality: r.municipality,
            telephone: r.telephone,
            priceRange: r.priceRange,
            rating: r.rating,
            reviewsCount: r.reviewsCount,
            description: r.description,
            imageUrls: r.imageUrls,
            claimToken: r.claimToken,
            status: r.status,
          };
        }
      } catch {}
    }

    return null;
  }
);
