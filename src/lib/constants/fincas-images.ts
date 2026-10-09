/**
 * IMÁGENES DE LA RED DE FINCAS HOMOLOGADAS S-CLASS
 * Mapa id-de-finca -> URL de portada. Fallback único y seguro.
 */

export const FINCA_IMAGES: Record<string, string> = {
    'villa-escorial-park': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    'finca-la-chopera': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
    'soto-de-mozanaque': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
    'finca-el-regajal': 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=1200&auto=format&fit=crop',
    'finca-aldea-santillana': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
    'la-casona-de-torrelodones': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
    'finca-las-tenadas': 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    'cigarral-del-angel': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    'finca-los-enebrales': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
    'la-quinta-de-jarama': 'https://images.unsplash.com/photo-1561128290-f1713cc2e8bb?q=80&w=1200&auto=format&fit=crop',
    'castillo-de-vinuelas': 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=1200&auto=format&fit=crop',
    'finca-valduerna': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
    'dehesa-de-valbueno': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
};

export const FINCA_FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop';

export function getFincaImage(id: string): string {
    return FINCA_IMAGES[id] ?? FINCA_FALLBACK_IMAGE;
}