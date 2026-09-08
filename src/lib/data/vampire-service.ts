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

let cachedLocalProviders: any[] | null = null;

function getCachedFallbackProviders(): any[] {
  if (cachedLocalProviders) return cachedLocalProviders;
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'vampirized_providers.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf-8');
      cachedLocalProviders = JSON.parse(raw);
      return cachedLocalProviders || [];
    }
  } catch (err) {
    console.error('❌ [VAMPIRE SERVICE] Error cargando caché de proveedores:', err);
  }
  return [];
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

    // 2. Fallback defensivo a vampirized_providers.json (Con caché singleton en memoria)
    try {
      const jsonProviders = getCachedFallbackProviders();

      const filtered = jsonProviders
        .filter((p) => {
          if (!p || !p.name) return false;
          const pProv = (p.provincia || p.province || '').toLowerCase();
          const pCat = (p.category || '').toLowerCase();
          const matchProv = !normProv || normProv === 'todas' || normProv === 'espana' || pProv.includes(normProv);
          const matchCat = !normCat || normCat === 'all' || normCat === 'todos' || normCat === 'eventos' || pCat.includes(normCat);
          return matchProv && matchCat;
        })
        .slice(0, limit);

      const categoryFallbacks: Record<string, string> = {
        finca: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
        catering: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
        decoracion: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
        musica: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
        sonido: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
        foto: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop",
        wedding: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop",
        moda: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop",
        transporte: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
        servicios: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
      };

      return filtered.map((p, idx) => {
        const catKey = (p.category || 'servicios').toLowerCase();
        const fallbackImg = categoryFallbacks[catKey] || categoryFallbacks.servicios;
        const validImg = (p.img && typeof p.img === 'string' && p.img.startsWith('http')) 
          ? p.img 
          : ((p.gallery && p.gallery[0] && p.gallery[0].startsWith('http')) ? p.gallery[0] : fallbackImg);

        return {
          id: p.id || `prov-${idx}`,
          name: p.name || 'Proveedor Homologado',
          category: p.category || 'servicios',
          province: p.provincia || p.province || 'España',
          municipality: p.locality || p.municipality || null,
          telephone: p.phone || p.telephone || '+34 693 693 048',
          priceRange: p.priceRange || (p.basePrice ? `Desde ${p.basePrice} €` : 'Desde 350 €'),
          rating: typeof p.rating === 'number' ? p.rating : 4.9,
          reviewsCount: typeof p.reviews === 'number' ? p.reviews : (p.reviewsCount || 18),
          description: p.description || `${p.name} proveedor homologado con infraestructura y garantía EAR OS.`,
          imageUrls: [validImg],
          claimToken: p.claimToken || `EAR-CLAIM-${idx}`,
          status: p.status || 'VERIFIED_S_CLASS',
        };
      });
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
