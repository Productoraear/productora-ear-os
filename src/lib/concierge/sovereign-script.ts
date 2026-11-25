/**
 * ════════════════════════════════════════════════════════════════════════════
 * GUION SOBERANO DEL MAÎTRE — VENTA CONCÉNTRICA (PATRÓN MULTI-TENANT ÚNICO)
 * ════════════════════════════════════════════════════════════════════════════
 * UN SOLO motor agéntico (`GenericConciergeAgent`) que hidrata su contexto,
 * herramientas y rol desde el `providerProfile` activo en la ruta. No hay un
 * agente por gremio: hay un agente y N entidades.
 *
 * Los dos guiones de este módulo son TEXTO DETERMINISTA (cero LLM): la política
 * comercial no se delega al modelo. El LLM puede reformular después, pero la
 * instrucción de cierre y el orden (ancla primero, satélite después) no.
 *
 *   1. REPLIEGUE CONCÉNTRICO (`buildConcentricRefusalScript`): el cliente pide
 *      un servicio ajeno dentro de la ficha. Se reconoce con autoridad, se
 *      aplaza con `stash_deferred_demand` y se reorienta al ancla.
 *   2. APERTURA POST-CONVERSIÓN (`buildPostConversionScript`): cobrada la
 *      fianza (100 €), se recupera la libreta y se abre el expediente.
 *
 * INVARIANTES:
 *   · Cero cifras inventadas: el importe de la fianza sale del SSOT
 *     (`DEPOSITO_STRIPE_EUR`, INV-03) y se formatea con coma decimal española.
 *   · Cero teléfonos de proveedor: el guion solo puede citar la centralita
 *     (`CENTRALITA_EAR_OS`, INV-12) si el llamante la inyecta.
 *   · Cero marcas de terceros ni promesas de disponibilidad sin verificar.
 *
 * MÓDULO PURO (cero I/O): lo consumen la ruta del concierge y el arnés.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { DEFERRED_DEMAND_LABELS, type DeferredDemandCategory } from '@/lib/concierge/deferred-demand';

/** Formato monetario español: 100 ⇒ «100,00». Cero Float en la salida. */
function eur(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

/** Prefijo literal de la libreta dentro del guion (prueba de captura). */
export const DEFERRED_DEMAND_SCRIPT_MARKER = 'Tomo nota en vuestro expediente';

export interface ConcentricRefusalInput {
  /** Etiqueta del servicio ajeno solicitado («fotografía y vídeo»). */
  readonly requestedLabel: string;
  /** Nombre comercial de la entidad en cuya ficha está el cliente. */
  readonly providerName: string;
  /** Propuesta principal de la entidad (menú, tarifa base, paquete). */
  readonly anchorOfferName: string | null;
  /**
   * Fianza exacta que la entidad publica en céntimos. `null` ⇒ se aplica el
   * suelo constitucional del SSOT (`DEPOSITO_STRIPE_EUR = 100,00 €`).
   */
  readonly depositCents?: number | null;
  /** Dato que falta para cerrar el ancla (aforo, fecha...). */
  readonly nextQuestion?: string | null;
}

/**
 * Guion del Maître (FASE 3). Reconoce la petición satélite, la apara en la
 * libreta y reorienta la conversación al ancla SIN decir «no» y SIN pedir
 * disculpas por un servicio que la entidad no presta.
 */
export function buildConcentricRefusalScript(input: ConcentricRefusalInput): string {
  const anchor: string =
    input.anchorOfferName !== null && input.anchorOfferName.trim().length > 0
      ? input.anchorOfferName.trim()
      : 'vuestra propuesta principal';

  const publishedCents: number | null =
    typeof input.depositCents === 'number' && Number.isFinite(input.depositCents) && input.depositCents > 0
      ? input.depositCents
      : null;
  // Suelo constitucional F6: mínimo 100,00 €; si el proveedor configura fianza superior, se respeta.
  const depositEur: number =
    publishedCents === null ? DEPOSITO_STRIPE_EUR : Math.max(publishedCents / 100, DEPOSITO_STRIPE_EUR);

  const nextQuestion: string =
    input.nextQuestion !== null && input.nextQuestion !== undefined && input.nextQuestion.trim().length > 0
      ? input.nextQuestion.trim()
      : '¿Revisamos el aforo y la fecha deseada?';

  return (
    `${DEFERRED_DEMAND_SCRIPT_MARKER} de ${input.requestedLabel}. Como responsable de sala, ` +
    `mi recomendación es que primero dejemos asegurada la fecha y la propuesta principal de ` +
    `${input.providerName} (${anchor}), que es la base del evento. Inmediatamente después de confirmar ` +
    `la reserva a vuestro nombre —con la fianza de ${eur(depositEur)} €, deducible del total—, abrimos ` +
    `vuestro expediente y cerramos cada una de estas prioridades para que encajen a la perfección. ` +
    nextQuestion
  );
}

export interface PostConversionInput {
  readonly providerName: string;
  readonly anchorOfferName: string | null;
  /** Peticiones ya presentadas (PRESENTED) de la libreta. */
  readonly demands: ReadonlyArray<{ readonly category: string; readonly rawPrompt: string }>;
  /** Máximo de prioridades enumeradas (legibilidad en móvil). */
  readonly maxListed?: number;
}

/** Frase humana de una demanda: etiqueta del gremio, no jerga de enum. */
function describeDemand(category: string): string {
  const label: string | undefined = (DEFERRED_DEMAND_LABELS as Record<string, string | undefined>)[category];
  return label ?? 'servicios complementarios';
}

/**
 * Diálogo post-conversión (FASE 4). Solo se construye si hay demanda real:
 * con la libreta vacía devuelve `null` y el webhook no emite nada (cero ruido).
 */
export function buildPostConversionScript(input: PostConversionInput): string | null {
  const limit: number = Math.min(Math.max(input.maxListed ?? 5, 1), 8);
  const unique: string[] = [];
  for (const demand of input.demands) {
    const phrase: string = describeDemand(demand.category);
    if (!unique.includes(phrase)) unique.push(phrase);
    if (unique.length >= limit) break;
  }
  if (unique.length === 0) return null;

  const anchor: string =
    input.anchorOfferName !== null && input.anchorOfferName.trim().length > 0
      ? input.anchorOfferName.trim()
      : 'vuestra propuesta principal';

  return (
    `Enhorabuena, vuestra reserva principal en ${input.providerName} (${anchor}) está confirmada. ` +
    `En vuestro dossier habíais indicado interés en ${unique.join(' · ')}. ` +
    '¿Cuál de estas prioridades queréis que dejemos resuelta ahora?'
  );
}

/**
 * ¿El gremio pedido es AJENO al de la entidad? Evita aplazar una demanda sobre
 * el propio producto (un DJ no genera una «demanda de música» en su ficha).
 * Comparación por palabra completa sobre el gremio declarado de la entidad.
 */
export function isSatelliteDemand(requested: DeferredDemandCategory, providerGremio: string | null): boolean {
  if (providerGremio === null) return true;
  const gremio: string = providerGremio
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const ownsIt: Readonly<Record<DeferredDemandCategory, RegExp>> = {
    MUSIC: /\b(dj|disco|musica|musical|orquesta|mariachi|cantante|solista|tenor|animacion)\b/,
    GASTRO_EXTRA: /\b(catering|restaurante|gastronomia|pasteleria|panaderia|bar|food)\b/,
    PHOTO: /\b(foto|fotografo|fotografia|video|videografo|audiovisual)\b/,
    TRANSPORT: /\b(autobus|autocar|transporte|traslado|limusina|microbus)\b/,
    DECORATION: /\b(decoracion|flores|floristeria|florista|iluminacion|escenografia)\b/,
  };

  return !ownsIt[requested].test(gremio);
}

