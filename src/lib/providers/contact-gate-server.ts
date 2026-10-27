/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONTACT GATE · RESOLUCIÓN SERVER-SIDE (tier real desde disco)
 * ════════════════════════════════════════════════════════════════════════════
 * Puente entre el tier persistido (`active_providers_whitelist.json`,
 * blacklist/opt-out) y la capa pura `contact-gate.ts`.
 *
 * SOLO SERVIDOR (usa `fs` a través de `visibility.ts`).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { getProviderTier } from '@/lib/providers/visibility';
import {
  resolveContactAccess,
  type ContactAccess,
  type ProviderContactTier,
} from '@/lib/providers/contact-gate';

export interface ProviderIdentityInput {
  id?: string;
  slug?: string;
  name?: string;
  atomic_specs?: { slug?: string };
}

/** Traduce el tier del directorio al vocabulario de la doctrina anti-picaresca. */
export function toContactTier(identity: ProviderIdentityInput): ProviderContactTier {
  const tier = getProviderTier(identity);
  switch (tier) {
    case 'SOVEREIGN':
      return 'SOVEREIGN';
    case 'CLAIMED':
      return 'PAYING_CLIENT';
    case 'BLACKLISTED':
      return 'BLACKLISTED';
    default:
      return 'DIRECTORY_UNCLAIMED';
  }
}

/** Acceso al contacto de una entidad, resuelto contra el estado real. */
export function evaluateProviderContactAccess(
  identity: ProviderIdentityInput,
  options?: { paidUnlock?: boolean },
): ContactAccess {
  return resolveContactAccess({
    tier: toContactTier(identity),
    paidUnlock: options?.paidUnlock,
  });
}

/**
 * Verifica SERVER-SIDE que el visitante pagó el desbloqueo de 1,00 € para esta
 * entidad concreta.
 *
 * Antes bastaba con añadir `?unlocked=true` a la URL para saltarse el candado.
 * Aquí se recupera la sesión real de Stripe y se exige:
 *   · pago completado (`payment_status === 'paid'`),
 *   · tipo de tripwire correcto,
 *   · slug coincidente con la ficha abierta.
 * Cualquier fallo (sin clave Stripe, sesión inexistente, slug ajeno) → `false`.
 */
export async function verifySupplierUnlockSession(
  sessionId: string | null | undefined,
  slug: string,
): Promise<boolean> {
  if (typeof sessionId !== 'string' || sessionId.trim().length < 8) return false;
  if (!process.env.STRIPE_SECRET_KEY?.trim()) return false;

  try {
    const { getStripe } = await import('@/lib/payments');
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId.trim().slice(0, 200));

    if (session.payment_status !== 'paid') return false;

    const metadata = (session.metadata ?? {}) as Record<string, string>;
    if (metadata.type !== 'TRIPWIRE_COUPLE_UNLOCK') return false;

    const sessionSlug = (metadata.slug || '').trim().toLowerCase();
    if (!sessionSlug || sessionSlug !== slug.trim().toLowerCase()) return false;

    return true;
  } catch (error) {
    console.warn('[CONTACT GATE] Verificación de desbloqueo fallida (fail-closed):', error);
    return false;
  }
}
