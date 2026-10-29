"use server";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SERVER ACTIONS — DATOS DE COBRO BAJO DEMANDA (BIZUM / TRANSFERENCIA / ...)
 * ════════════════════════════════════════════════════════════════════════════
 * Flujo comercial real: el cliente pide el número de Bizum (o la cuenta) desde
 * la ficha pública y el sistema se lo entrega SOLO después de capturar el lead
 * (nombre + teléfono) y registrar la solicitud en `ProviderPaymentRequestLog`.
 *
 * Garantías:
 *   1. Cero datos de cobro sin lead válido (la validación vive en el store).
 *   2. Despacho a n8n (`call-center-intake`) NO bloqueante + DLQ: si n8n cae,
 *      la fila queda con `deliveredN8n=false` y el repaso la reintenta.
 *   3. Errores tipados: jamás se filtra un mensaje de Prisma al navegador.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { dispatchToN8n } from '@/lib/services/n8n-dispatcher';
import { CENTRALITA } from '@/lib/phone-constants';
import {
  listPublicPaymentMethodOffers,
  markPaymentRequestDelivered,
  recordPaymentRequest,
  type PublicPaymentMethodOffer,
} from '@/lib/providers/provider-profile-store';

export interface PaymentDataRequestInput {
  readonly providerSlug: string;
  readonly providerName: string;
  readonly clientName: string;
  readonly clientPhone: string;
  readonly clientEmail?: string;
  readonly eventDate?: string;
  /** Tipos solicitados (`bizum`, `transferencia`...). Vacío ⇒ todos los activos. */
  readonly methodKinds?: readonly string[];
}

export interface DeliveredPaymentMethod {
  readonly kind: string;
  readonly label: string;
  readonly holder: string | null;
  readonly reference: string | null;
  readonly instructions: string | null;
}

export interface PaymentDataRequestResult {
  readonly ok: boolean;
  readonly requestId: string | null;
  readonly methods: readonly DeliveredPaymentMethod[];
  readonly error: string | null;
}

/** Traduce el código interno del store a copy humano (sin filtrar el stack). */
function toPublicError(error: unknown): string {
  const code = error instanceof Error ? error.message : '';
  switch (code) {
    case 'CLIENT_NAME_REQUIRED':
      return 'Escribe tu nombre completo para poder identificarte.';
    case 'CLIENT_PHONE_REQUIRED':
      return 'Necesitamos un teléfono válido (mínimo 9 dígitos) para enviarte el dato de cobro.';
    case 'PAYMENT_KIND_INVALID':
      return 'Ese método de cobro ya no está disponible. Elige otro.';
    case 'PROVIDER_SLUG_INVALID':
      return 'No hemos podido identificar al proveedor.';
    default:
      return `Ahora mismo no podemos entregarte los datos de cobro. Llámanos al ${CENTRALITA.display}.`;
  }
}

/** Métodos de cobro activos (tipo + etiqueta). Nunca el dato sensible. */
export async function listProviderPaymentOffersAction(
  providerSlug: string,
): Promise<readonly PublicPaymentMethodOffer[]> {
  try {
    return await listPublicPaymentMethodOffers(providerSlug);
  } catch (error: unknown) {
    console.error('[PAYMENT_OFFERS] Error listando oferta:', error);
    return [];
  }
}

/**
 * Entrega el dato de cobro a cambio de un lead real. Es el botón
 * «Pídeme el número de Bizum» de la ficha pública.
 */
export async function requestProviderPaymentDataAction(
  input: PaymentDataRequestInput,
): Promise<PaymentDataRequestResult> {
  try {
    const requestedKinds = Array.isArray(input.methodKinds)
      ? input.methodKinds.filter((kind): kind is string => typeof kind === 'string').slice(0, 9)
      : [];

    const { requestId, methods } = await recordPaymentRequest({
      providerSlug: input.providerSlug,
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      clientEmail: input.clientEmail,
      eventDate: input.eventDate,
      methodKinds: requestedKinds,
      channel: 'ficha-publica',
    });

    // Trazabilidad del lead en el Call Center (fire-and-forget + DLQ).
    void dispatchToN8n('call-center-intake', {
      event: 'provider-payment-data-request',
      requestId,
      providerSlug: input.providerSlug.slice(0, 120),
      providerName: input.providerName.slice(0, 160),
      clientName: input.clientName.slice(0, 120),
      clientPhone: input.clientPhone.slice(0, 40),
      clientEmail: (input.clientEmail ?? '').slice(0, 160),
      eventDate: (input.eventDate ?? '').slice(0, 40),
      methodKinds: methods.map((method) => method.kind).join(','),
      source: 'provider-profile',
      ts: new Date().toISOString(),
    })
      .then((result) => {
        if (!result.delivered) return undefined;
        return markPaymentRequestDelivered(requestId);
      })
      .catch((dispatchError: unknown) => {
        console.error('[PAYMENT_REQUEST] Despacho n8n fallido:', dispatchError);
      });

    return {
      ok: true,
      requestId,
      methods: methods.map((method) => ({
        kind: method.kind,
        label: method.label,
        holder: method.holder,
        reference: method.reference,
        instructions: method.instructions,
      })),
      error: null,
    };
  } catch (error: unknown) {
    console.error('[PAYMENT_REQUEST] Error entregando datos de cobro:', error);
    return { ok: false, requestId: null, methods: [], error: toPublicError(error) };
  }
}
