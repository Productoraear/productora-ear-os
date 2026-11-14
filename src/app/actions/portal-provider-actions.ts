'use server';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SERVER ACTIONS — PORTAL DEL PROVEEDOR SOBERANO (/portal/proveedor)
 * ════════════════════════════════════════════════════════════════════════════
 * Permite a los proveedores de la plataforma autogestionar su Ficha Universal
 * de 380 campos, consultar su estado de sincronización y actualizar valores.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { revalidatePath } from 'next/cache';
import {
  loadProviderProfile,
  normalizeProviderSlug,
  saveProviderProfileValues,
  type ProviderProfileSnapshot,
  type SaveProfileResult,
} from '@/lib/providers/provider-profile-store';
import {
  mapTrojanCategoryToCatalog,
  type ProviderProfileCategory,
} from '@/lib/providers/trojan-horse-schema';

/**
 * Carga el snapshot de la ficha del proveedor para el portal.
 */
export async function loadPortalProviderProfileAction(
  providerSlug: string,
  category: ProviderProfileCategory | string,
): Promise<ProviderProfileSnapshot> {
  const catalogCategory = (category in {
    FINCA_ALQUILER: 1,
    RESTAURANTE_BODA: 1,
    CATERING_BODA: 1,
    MUSICA_DIRECTO: 1,
    FOTOGRAFIA_VIDEO: 1,
    FLORISTERIA_DECORACION: 1,
    WEDDING_PLANNER: 1,
    SERVICIOS_COMPLEMENTARIOS: 1,
  })
    ? mapTrojanCategoryToCatalog(category as ProviderProfileCategory)
    : category;

  try {
    return await loadProviderProfile(providerSlug, catalogCategory);
  } catch (error: unknown) {
    console.error('[PORTAL_PROVIDER] Error cargando ficha:', error);
    throw new Error(error instanceof Error ? error.message : 'PORTAL_PROFILE_LOAD_FAILED');
  }
}

/**
 * Guarda los campos actualizados desde el Cockpit Soberano.
 */
export async function savePortalProviderProfileAction(
  providerSlug: string,
  category: ProviderProfileCategory | string,
  values: Record<string, string>,
): Promise<SaveProfileResult> {
  const catalogCategory = (category in {
    FINCA_ALQUILER: 1,
    RESTAURANTE_BODA: 1,
    CATERING_BODA: 1,
    MUSICA_DIRECTO: 1,
    FOTOGRAFIA_VIDEO: 1,
    FLORISTERIA_DECORACION: 1,
    WEDDING_PLANNER: 1,
    SERVICIOS_COMPLEMENTARIOS: 1,
  })
    ? mapTrojanCategoryToCatalog(category as ProviderProfileCategory)
    : category;

  try {
    const result = await saveProviderProfileValues({
      providerSlug,
      category: catalogCategory,
      values,
      updatedBy: 'provider_self',
    });
    revalidatePath('/portal/proveedor');
    revalidatePath(`/proveedores/${normalizeProviderSlug(providerSlug)}`);
    return result;
  } catch (error: unknown) {
    console.error('[PORTAL_PROVIDER] Error guardando ficha:', error);
    throw new Error(error instanceof Error ? error.message : 'PORTAL_PROFILE_SAVE_FAILED');
  }
}
