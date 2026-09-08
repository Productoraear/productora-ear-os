import fs from 'fs';
import path from 'path';
import defaultWhitelist from '@/data/active_providers_whitelist.json';

export interface WhitelistData {
  policy: string;
  note?: string;
  active_ids: string[];
  active_slugs: string[];
  updated_at?: string;
}

const WHITELIST_PATH = path.join(process.cwd(), 'src', 'data', 'active_providers_whitelist.json');

/**
 * Obtiene la lista blanca activa de proveedores públicos
 */
export function getActiveWhitelist(): WhitelistData {
  try {
    if (fs.existsSync(WHITELIST_PATH)) {
      const raw = fs.readFileSync(WHITELIST_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[VISIBILITY] Error leyendo active_providers_whitelist.json, usando fallback estático:', err);
  }
  return defaultWhitelist as WhitelistData;
}

/**
 * Determina si un proveedor tiene visibilidad pública.
 * Por mandato S-Class del CEO: TODOS LOS PERFILES PERMANECEN EN OCULTO EXCEPTO EDWIN AGUDELO,
 * a menos que hayan sido activados explícitamente desde /admin/directorio.
 */
export function isProviderPublic(
  provider: {
    id?: string;
    slug?: string;
    name?: string;
    atomic_specs?: { slug?: string };
  },
  whitelist?: WhitelistData
): boolean {
  if (!provider) return false;

  const name = (provider.name || '').toLowerCase().trim();
  const id = (provider.id || '').toLowerCase().trim();
  const slug = (provider.slug || provider.atomic_specs?.slug || '').toLowerCase().trim();

  // 1. Veto Inmutable: Proveedores vetados o corruptos (Peke Teso, slop de blogs)
  if (name.includes('peke teso') || id.includes('peke-teso') || slug.includes('peke-teso') || id === 'prov-6') {
    return false;
  }
  if (name.includes('100 apodos') || slug.includes('100-apodos')) {
    return false;
  }

  // 2. Soberano Inmutable: Edwin Agudelo y Productora EAR siempre tienen visibilidad pública garantizada
  if (
    id === 'prov-ear-sovereign-01' ||
    id === 'prov-53' ||
    slug === 'edwin-agudelo' ||
    slug === 'productora-ear' ||
    slug === 'edwin-agudelo-canta-a-novios' ||
    name.includes('edwin agudelo') ||
    name.includes('productora ear')
  ) {
    return true;
  }

  // 3. Verificación contra Whitelist Activa (Activados desde /admin/directorio)
  const currentWhitelist = whitelist || getActiveWhitelist();
  const activeIds = (currentWhitelist.active_ids || []).map(x => x.toLowerCase().trim());
  const activeSlugs = (currentWhitelist.active_slugs || []).map(x => x.toLowerCase().trim());

  if (id && activeIds.includes(id)) return true;
  if (slug && activeSlugs.includes(slug)) return true;

  // Por defecto: OCULTO
  return false;
}

/**
 * Alterna la visibilidad pública de un proveedor (Activar / Ocultar)
 */
export function toggleProviderVisibility(id: string, slug?: string, setActive?: boolean): { success: boolean; active: boolean; active_ids: string[] } {
  try {
    const data = getActiveWhitelist();
    const activeIds = new Set((data.active_ids || []).map(x => x.trim()));
    const activeSlugs = new Set((data.active_slugs || []).map(x => x.trim()));

    const cleanId = id.trim();
    const cleanSlug = slug?.trim() || '';

    // No permitir ocultar a Edwin Agudelo (inmutable)
    if (cleanId === 'prov-ear-sovereign-01' || cleanSlug === 'edwin-agudelo') {
      return { success: true, active: true, active_ids: Array.from(activeIds) };
    }

    const currentlyActive = activeIds.has(cleanId) || (cleanSlug && activeSlugs.has(cleanSlug));
    const newActive = setActive !== undefined ? setActive : !currentlyActive;

    if (newActive) {
      activeIds.add(cleanId);
      if (cleanSlug) activeSlugs.add(cleanSlug);
    } else {
      activeIds.delete(cleanId);
      if (cleanSlug) activeSlugs.delete(cleanSlug);
    }

    const updatedData: WhitelistData = {
      policy: 'DENY_ALL_EXCEPT_WHITELIST',
      note: 'Directiva S-Class del CEO: Todos los perfiles permanecen en oculto por defecto excepto Edwin Agudelo. Activaciones controladas desde /admin/directorio.',
      active_ids: Array.from(activeIds),
      active_slugs: Array.from(activeSlugs),
      updated_at: new Date().toISOString()
    };

    fs.writeFileSync(WHITELIST_PATH, JSON.stringify(updatedData, null, 2), 'utf-8');
    return { success: true, active: newActive, active_ids: updatedData.active_ids };
  } catch (err) {
    console.error('[VISIBILITY] Error guardando cambios en active_providers_whitelist.json:', err);
    return { success: false, active: false, active_ids: [] };
  }
}
