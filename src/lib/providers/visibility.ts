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

export interface BlacklistData {
  policy: string;
  blacklisted_ids: string[];
  blacklisted_slugs: string[];
  optout_records?: Array<{ slug: string; reason?: string; timestamp: string }>;
}

const WHITELIST_PATH = path.join(process.cwd(), 'src', 'data', 'active_providers_whitelist.json');
const BLACKLIST_PATH = path.join(process.cwd(), 'src', 'data', 'blacklisted_providers.json');

/**
 * Obtiene la lista de exclusión (Blacklist / Opt-out)
 */
export function getBlacklist(): BlacklistData {
  try {
    if (fs.existsSync(BLACKLIST_PATH)) {
      const raw = fs.readFileSync(BLACKLIST_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[VISIBILITY] Error leyendo blacklisted_providers.json:', err);
  }
  return {
    policy: 'STRICT_OPTOUT_HONORED',
    blacklisted_ids: ['prov-6', 'peke-teso'],
    blacklisted_slugs: ['prov-6', 'peke-teso', '100-apodos'],
  };
}

/**
 * Verifica si un proveedor ha solicitado opt-out o está vetado de forma inmutable
 */
export function isProviderBlacklisted(provider: {
  id?: string;
  slug?: string;
  name?: string;
  atomic_specs?: { slug?: string };
}): boolean {
  if (!provider) return true;

  const name = (provider.name || '').toLowerCase().trim();
  const id = (provider.id || '').toLowerCase().trim();
  const slug = (provider.slug || provider.atomic_specs?.slug || '').toLowerCase().trim();

  // Veto inmutable hardcoded
  if (
    name.includes('peke teso') ||
    id.includes('peke-teso') ||
    slug.includes('peke-teso') ||
    id === 'prov-6' ||
    slug === 'prov-6' ||
    name.includes('100 apodos') ||
    slug.includes('100-apodos')
  ) {
    return true;
  }

  // Comprobar contra archivo blacklisted_providers.json
  const bl = getBlacklist();
  if (id && (bl.blacklisted_ids || []).includes(id)) return true;
  if (slug && (bl.blacklisted_slugs || []).includes(slug)) return true;

  return false;
}

/**
 * Obtiene la lista blanca activa de proveedores verificados
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

export type ProviderTier = 'SOVEREIGN' | 'CLAIMED' | 'DIRECTORY_UNCLAIMED' | 'BLACKLISTED';

/**
 * Determina el estado legal y nivel de membresía de un proveedor
 */
export function getProviderTier(provider: {
  id?: string;
  slug?: string;
  name?: string;
  atomic_specs?: { slug?: string };
}): ProviderTier {
  if (isProviderBlacklisted(provider)) {
    return 'BLACKLISTED';
  }

  const name = (provider.name || '').toLowerCase().trim();
  const id = (provider.id || '').toLowerCase().trim();
  const slug = (provider.slug || provider.atomic_specs?.slug || '').toLowerCase().trim();

  // 1. Soberano Inmutable: Edwin Agudelo y Productora EAR
  if (
    id === 'prov-ear-sovereign-01' ||
    id === 'prov-53' ||
    slug === 'edwin-agudelo' ||
    slug === 'productora-ear' ||
    slug === 'edwin-agudelo-canta-a-novios' ||
    name.includes('edwin agudelo') ||
    name.includes('productora ear')
  ) {
    return 'SOVEREIGN';
  }

  // 2. Verificación contra Whitelist Activa (Cuentas reclamadas y activadas)
  const currentWhitelist = getActiveWhitelist();
  const activeIds = (currentWhitelist.active_ids || []).map(x => x.toLowerCase().trim());
  const activeSlugs = (currentWhitelist.active_slugs || []).map(x => x.toLowerCase().trim());

  if ((id && activeIds.includes(id)) || (slug && activeSlugs.includes(slug))) {
    return 'CLAIMED';
  }

  // 3. Directorio Público Profesional no reclamado (Legítimo Safe Harbor LSSI Art. 16)
  return 'DIRECTORY_UNCLAIMED';
}

/**
 * Determina si un proveedor es visible públicamente en el directorio.
 * Directiva S-Class del CEO: NUNCA lanzar 404 para proveedores válidos.
 * Todos los perfiles son visibles excepto aquellos en la lista de exclusión/opt-out.
 */
export function isProviderPublic(
  provider: {
    id?: string;
    slug?: string;
    name?: string;
    atomic_specs?: { slug?: string };
  }
): boolean {
  if (!provider) return false;
  const tier = getProviderTier(provider);
  return tier !== 'BLACKLISTED';
}

/**
 * Alterna la verificación oficial de un proveedor
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
      policy: 'OPEN_DIRECTORY_WITH_OPTOUT',
      note: 'Directiva S-Class: Directorio público ético con modelo Safe Harbor LSSI Art. 16 y Opt-out en 1 clic.',
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
