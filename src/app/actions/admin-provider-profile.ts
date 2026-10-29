"use server";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SERVER ACTIONS — FICHA EDITABLE DEL PROVEEDOR (300+ CAMPOS)
 * ════════════════════════════════════════════════════════════════════════════
 * Cada acción exige sesión admin verificada en SERVIDOR (Firebase Bearer ⇒
 * `requireAdminFromHeaders`). Sin sesión no hay lectura ni escritura.
 * Devuelven datos 100% serializables (sin Date, sin Prisma models).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { revalidatePath } from 'next/cache';
import { requireAdminFromHeaders } from '@/lib/security/adminGuard';
import {
  deleteProviderPaymentMethod,
  loadProviderProfile,
  normalizeProviderSlug,
  saveProviderProfileValues,
  setProviderPaymentMethodActive,
  upsertProviderPaymentMethod,
  type ProviderPaymentMethodView,
  type ProviderProfileSnapshot,
  type SaveProfileResult,
} from '@/lib/providers/provider-profile-store';

async function requireAdminEmail(): Promise<string> {
  const auth = await requireAdminFromHeaders();
  if (!auth.ok) throw new Error('UNAUTHORIZED_ACCESS');
  return auth.email || auth.uid;
}

/** Lee la ficha de un proveedor (valores + métodos de cobro). */
export async function loadProviderProfileAction(
  providerSlug: string,
  category: string,
): Promise<ProviderProfileSnapshot> {
  await requireAdminEmail();
  try {
    return await loadProviderProfile(providerSlug, category);
  } catch (error: unknown) {
    console.error('[ADMIN_PROFILE] Error leyendo ficha:', error);
    throw new Error(error instanceof Error ? error.message : 'PROFILE_LOAD_FAILED');
  }
}

/** Guarda en bloque los campos modificados del drawer. */
export async function saveProviderProfileAction(
  providerSlug: string,
  category: string,
  values: Record<string, string>,
): Promise<SaveProfileResult> {
  const updatedBy = await requireAdminEmail();
  try {
    const result = await saveProviderProfileValues({ providerSlug, category, values, updatedBy });
    revalidatePath('/admin/proveedores');
    revalidatePath(`/proveedores/${normalizeProviderSlug(providerSlug)}`);
    return result;
  } catch (error: unknown) {
    console.error('[ADMIN_PROFILE] Error guardando ficha:', error);
    throw new Error(error instanceof Error ? error.message : 'PROFILE_SAVE_FAILED');
  }
}

/** Crea/actualiza un método de cobro (Bizum, transferencia, tarjeta...). */
export async function saveProviderPaymentMethodAction(
  providerSlug: string,
  payload: {
    kind: string;
    label: string;
    holder?: string;
    reference?: string;
    instructions?: string;
    isActive?: boolean;
    requiresLeadCapture?: boolean;
    sortOrder?: number;
  },
): Promise<ProviderPaymentMethodView> {
  const updatedBy = await requireAdminEmail();
  try {
    const method = await upsertProviderPaymentMethod({ providerSlug, ...payload, updatedBy });
    revalidatePath(`/proveedores/${normalizeProviderSlug(providerSlug)}`);
    return method;
  } catch (error: unknown) {
    console.error('[ADMIN_PROFILE] Error guardando método de cobro:', error);
    throw new Error(error instanceof Error ? error.message : 'PAYMENT_SAVE_FAILED');
  }
}

/** Activa o desactiva un método de cobro. */
export async function toggleProviderPaymentMethodAction(
  providerSlug: string,
  kind: string,
  isActive: boolean,
): Promise<{ updated: number }> {
  const updatedBy = await requireAdminEmail();
  try {
    const updated = await setProviderPaymentMethodActive({ providerSlug, kind, isActive, updatedBy });
    revalidatePath(`/proveedores/${normalizeProviderSlug(providerSlug)}`);
    return { updated };
  } catch (error: unknown) {
    console.error('[ADMIN_PROFILE] Error activando método de cobro:', error);
    throw new Error(error instanceof Error ? error.message : 'PAYMENT_TOGGLE_FAILED');
  }
}

/** Elimina un método de cobro. */
export async function deleteProviderPaymentMethodAction(
  providerSlug: string,
  kind: string,
): Promise<{ deleted: number }> {
  await requireAdminEmail();
  try {
    const deleted = await deleteProviderPaymentMethod({ providerSlug, kind });
    revalidatePath(`/proveedores/${normalizeProviderSlug(providerSlug)}`);
    return { deleted };
  } catch (error: unknown) {
    console.error('[ADMIN_PROFILE] Error eliminando método de cobro:', error);
    throw new Error(error instanceof Error ? error.message : 'PAYMENT_DELETE_FAILED');
  }
}
