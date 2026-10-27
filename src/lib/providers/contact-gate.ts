/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONTACT GATE · DOCTRINA ANTI-PICARESCA (EAR OS S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * REGLA INMUTABLE DEL CEO:
 *   Ningún teléfono, WhatsApp ni email de una entidad de las categorías de
 *   proveedores o artistas se muestra al público si esa entidad no ha pasado
 *   por caja o no es cliente de pago.
 *
 * Estados posibles:
 *   · SOVEREIGN        → línea propia de Productora EAR (siempre visible).
 *   · PAYING_CLIENT    → entidad reclamada y activa (whitelist de pago).
 *   · PAID_UNLOCK      → el visitante pagó el desbloqueo de 1,00 € (Stripe).
 *   · DIRECTORY_UNCLAIMED → ficha del directorio sin reclamar: contacto RETENIDO.
 *   · BLACKLISTED      → opt-out/veto: nunca, bajo ninguna circunstancia.
 *
 * CAPA PURA (sin `fs`, sin `node:*`): puede importarse desde componentes
 * `'use client'`. La resolución del tier desde disco vive en
 * `contact-gate-server.ts`.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Nivel de derecho de contacto de una entidad. */
export type ProviderContactTier =
  | 'SOVEREIGN'
  | 'PAYING_CLIENT'
  | 'DIRECTORY_UNCLAIMED'
  | 'BLACKLISTED';

export interface ContactAccess {
  readonly tier: ProviderContactTier;
  /** `true` solo si está permitido publicar el número real. */
  readonly canRevealPhone: boolean;
  /** `true` si el botón de WhatsApp puede apuntar al número de la entidad. */
  readonly canRevealWhatsapp: boolean;
  /** Explicación trazable (UI + telemetría). */
  readonly reason: string;
  /** Acción comercial que debe ofrecerse cuando el contacto está retenido. */
  readonly unlockCta: 'unlock-1eur' | 'claim-profile' | null;
}

export interface ContactAccessInput {
  readonly tier: ProviderContactTier;
  /** El visitante ya pagó el desbloqueo (1,00 €) para esta entidad. */
  readonly paidUnlock?: boolean;
}

/**
 * Resolución pura del acceso al contacto.
 * FAIL-CLOSED: cualquier tier desconocido o ausencia de datos retiene el número.
 */
export function resolveContactAccess(input: ContactAccessInput): ContactAccess {
  const paidUnlock = input.paidUnlock === true;

  if (input.tier === 'BLACKLISTED') {
    return {
      tier: 'BLACKLISTED',
      canRevealPhone: false,
      canRevealWhatsapp: false,
      reason: 'Entidad en opt-out/veto: contacto bloqueado de forma permanente.',
      unlockCta: null,
    };
  }

  if (input.tier === 'SOVEREIGN') {
    return {
      tier: 'SOVEREIGN',
      canRevealPhone: true,
      canRevealWhatsapp: true,
      reason: 'Línea propia de Productora EAR (artista insignia del roster).',
      unlockCta: null,
    };
  }

  if (input.tier === 'PAYING_CLIENT') {
    return {
      tier: 'PAYING_CLIENT',
      canRevealPhone: true,
      canRevealWhatsapp: true,
      reason: 'Cliente de pago con ficha reclamada y activa.',
      unlockCta: null,
    };
  }

  if (paidUnlock) {
    return {
      tier: 'DIRECTORY_UNCLAIMED',
      canRevealPhone: true,
      canRevealWhatsapp: true,
      reason: 'Desbloqueo de contacto abonado (1,00 € descontable de la reserva).',
      unlockCta: null,
    };
  }

  return {
    tier: 'DIRECTORY_UNCLAIMED',
    canRevealPhone: false,
    canRevealWhatsapp: false,
    reason: 'Ficha del directorio sin reclamar: el contacto exige desbloqueo de 1,00 €.',
    unlockCta: 'unlock-1eur',
  };
}

/**
 * Enmascara un teléfono para mostrarlo como señuelo verificable sin filtrarlo.
 * `+34 693 693 048` → `+34 6•• ••• •48`
 */
export function maskPhoneForDisplay(phone: string | null | undefined): string {
  if (typeof phone !== 'string') return '••• ••• •••';
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.length < 6) return '••• ••• •••';

  const prefix = digits.startsWith('+34') ? '+34 ' : digits.startsWith('+') ? `${digits.slice(0, 3)} ` : '';
  const local = digits.startsWith('+34') ? digits.slice(3) : digits.replace(/^\+/, '');
  if (local.length < 6) return `${prefix}••• ••• •••`;

  const head = local.slice(0, 1);
  const tail = local.slice(-2);
  return `${prefix}${head}•• ••• •${tail}`;
}

/**
 * Devuelve el número que puede usarse en un enlace `tel:`/`wa.me`.
 * Si el acceso está retenido, devuelve `null` (nunca el número real).
 */
export function gatedPhoneNumber(
  providerPhone: string | null | undefined,
  access: ContactAccess,
): string | null {
  if (!access.canRevealPhone) return null;
  if (typeof providerPhone !== 'string') return null;
  const clean = providerPhone.trim();
  return clean.length >= 6 ? clean : null;
}

/**
 * Número de WhatsApp efectivo para el CTA.
 * Retenido → `fallbackCentralita` (la línea oficial del CEO), jamás el de la entidad.
 */
export function gatedWhatsappNumber(
  providerPhone: string | null | undefined,
  access: ContactAccess,
  fallbackCentralita: string,
): string {
  const gated = gatedPhoneNumber(providerPhone, access);
  const chosen = gated ?? fallbackCentralita;
  return chosen.replace(/\D/g, '');
}

/** Etiqueta honesta para el bloque de contacto de una ficha. */
export function contactLabelForAccess(access: ContactAccess): string {
  switch (access.tier) {
    case 'SOVEREIGN':
      return 'Línea oficial Productora EAR';
    case 'PAYING_CLIENT':
      return 'Contacto directo verificado';
    case 'BLACKLISTED':
      return 'Contacto no disponible';
    default:
      return access.canRevealPhone ? 'Contacto desbloqueado' : 'Contacto protegido';
  }
}
