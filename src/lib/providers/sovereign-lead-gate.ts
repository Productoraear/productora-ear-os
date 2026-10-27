/**
 * ════════════════════════════════════════════════════════════════════════════
 * PEAJE SOBERANO · SOVEREIGN LEAD GATE (EAR OS S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * FALLO REAL REPORTADO POR EL CEO (2026-10-27):
 *   «Sale en primera fila el número de Eduardo, no hay peaje. Me imagino que lo
 *    mismo pasaría con otros proveedores.»
 *
 * DIAGNÓSTICO FORENSE:
 *   La ficha de un recinto colaborador publicaba la línea directa del gerente en
 *   el hero (CTA nº3), en las tarjetas de sede, en el footer y en el JSON-LD.
 *   Cualquier pareja podía saltarse la Conserjería EAR OS llamando directamente:
 *   CERO PEAJE, cero trazabilidad, cero split 80/10/10.
 *
 * DOCTRINA INMUTABLE (se suma a `contact-gate.ts`):
 *   1. La demanda derivada de un recinto/proveedor entra SIEMPRE por la
 *      Conserjería EAR OS (+34 693 693 048). Un único canal, una única caja.
 *   2. Su teléfono/email JAMÁS se pinta completo en una superficie comercial.
 *      Se muestra enmascarado (`maskPhoneForDisplay`) como señal de verificación
 *      y se entrega al confirmar la visita técnica.
 *   3. El JSON-LD se sanea en render (`sanitizeSchemaContact`): los buscadores y
 *      los rastreadores IA tampoco pueden extraer la línea del proveedor.
 *   4. Módulo PURO: sin `fs`, sin `node:*`, importable desde Server y Client
 *      Components sin arrastrar secretos.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { maskPhoneForDisplay } from '@/lib/providers/contact-gate';

/** Motivo comercial del contacto: define el copy pre-rellenado y la atribución. */
export type DemandIntent = 'disponibilidad' | 'visita-tecnica' | 'presupuesto' | 'bloqueo-fecha';

export interface SovereignDemandChannel {
  /** Nombre público del canal único de venta. */
  readonly label: string;
  /** Formato humano del número soberano. */
  readonly telDisplay: string;
  /** Dígitos E.164 sin símbolos (para `wa.me`). */
  readonly telDigits: string;
  /** Base del enlace de WhatsApp (sin query). */
  readonly whatsappBase: string;
  /** Terminal de bloqueo de fecha con depósito deducible. */
  readonly bookingsHref: string;
  /** Formulario de visita técnica / dossier. */
  readonly visitsHref: string;
}

const CENTRALITA_DIGITS: string = CENTRALITA_EAR_OS.replace(/\D/g, '');

/**
 * Canal único y verificable de captación. Congelado: ningún componente puede
 * reescribirlo en runtime para desviar un lead a una línea de proveedor.
 */
export const SOVEREIGN_DEMAND_CHANNEL: SovereignDemandChannel = Object.freeze({
  label: 'Conserjería EAR OS',
  telDisplay: CENTRALITA_EAR_OS,
  telDigits: CENTRALITA_DIGITS,
  whatsappBase: `https://wa.me/${CENTRALITA_DIGITS}`,
  bookingsHref: '/reservar/solista',
  visitsHref: '/contacto',
});

/** Copy por intención: el mensaje llega ya cualificado al Call Center. */
const INTENT_COPY: Readonly<Record<DemandIntent, string>> = Object.freeze({
  disponibilidad: 'disponibilidad real de fecha',
  'visita-tecnica': 'una visita técnica al recinto',
  presupuesto: 'un presupuesto cerrado',
  'bloqueo-fecha': 'el bloqueo de fecha con depósito deducible',
});

/** Estados de origen del contacto devueltos por el gate (auditoría). */
export type SupplierContactState = 'withheld' | 'masked-available';

/** Extrae los dígitos de un teléfono (o cadena vacía si no es válido). */
export function phoneDigits(phone: string | null | undefined): string {
  if (typeof phone !== 'string') return '';
  return phone.replace(/\D/g, '');
}

/** `true` solo si los dígitos corresponden a la centralita soberana. */
export function isSovereignDigits(digits: string): boolean {
  return digits === CENTRALITA_DIGITS;
}

/**
 * Sanitiza cualquier etiqueta que viaje en una URL o en el DOM:
 * colapsa espacios, elimina caracteres de control y acota la longitud.
 */
export function sanitizeEntityLabel(raw: string, maxChars: number = 120): string {
  if (typeof raw !== 'string') return '';
  const clean: string = raw
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[{}<>`$]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return clean.length > maxChars ? `${clean.slice(0, maxChars - 1)}…` : clean;
}

export interface DemandWhatsappInput {
  /** Nombre público de la entidad (recinto, proveedor, artista). */
  readonly entityName: string;
  /** Motivo comercial del contacto. */
  readonly intent: DemandIntent;
  /** Detalle opcional: municipio, formato de evento, fecha tentativa. */
  readonly detail?: string;
}

/**
 * Construye el enlace de WhatsApp del PEAJE SOBERANO.
 * El texto cualifica el lead y deja constancia de la entidad de origen.
 */
export function buildDemandWhatsappUrl(input: DemandWhatsappInput): string {
  const entity: string = sanitizeEntityLabel(input.entityName);
  const detailLabel: string =
    typeof input.detail === 'string' ? sanitizeEntityLabel(input.detail, 80) : '';
  const detail: string = detailLabel.length > 0 ? ` (${detailLabel})` : '';
  const message: string =
    `Hola ${SOVEREIGN_DEMAND_CHANNEL.label}, solicito ${INTENT_COPY[input.intent]} ` +
    `para ${entity}${detail}. Vengo de la web oficial de Productora EAR.`;
  return `${SOVEREIGN_DEMAND_CHANNEL.whatsappBase}?text=${encodeURIComponent(message)}`;
}

/**
 * Señuelo verificable: la línea del proveedor se muestra enmascarada para
 * acreditar que existe y está auditada, sin permitir el desvío del lead.
 */
export function supplierLineMask(phone: string | null | undefined): string {
  const digits: string = phoneDigits(phone);
  if (digits.length < 9) return '••• ••• •••';
  return maskPhoneForDisplay(phone);
}

/** Estado público del contacto de un proveedor (trazable en telemetría). */
export function supplierContactState(phone: string | null | undefined): SupplierContactState {
  return phoneDigits(phone).length >= 9 ? 'masked-available' : 'withheld';
}

/**
 * Aviso honesto para el cliente: el canal es único y la línea directa se
 * entrega al confirmar la visita (filtro de compromiso mutuo).
 */
export function supplierContactWithheldNotice(entityName: string): string {
  const entity: string = sanitizeEntityLabel(entityName) || 'la casa colaboradora';
  return (
    `Canal único de reservas: ${SOVEREIGN_DEMAND_CHANNEL.label} ` +
    `(${SOVEREIGN_DEMAND_CHANNEL.telDisplay}). Por acuerdo de exclusividad, la línea directa de ` +
    `${entity} se facilita al confirmar la visita técnica.`
  );
}

/** Tipos schema.org que pueden llevar `contactPoint` (y por tanto se sanean). */
const COMMERCE_SCHEMA_TYPES: ReadonlySet<string> = new Set([
  'Restaurant',
  'EventVenue',
  'LocalBusiness',
  'FoodEstablishment',
  'Organization',
  'PerformingArtsTheater',
  'Hotel',
]);

/** Claves de contacto que NUNCA deben llegar al HTML/JSON-LD público. */
const SUPPLIER_CONTACT_KEYS: ReadonlySet<string> = new Set(['telephone', 'faxNumber', 'email']);

/** Punto de contacto soberano inyectado en el JSON-LD saneado. */
export function sovereignContactPoint(areaServed?: string): Readonly<Record<string, unknown>> {
  const base: Record<string, unknown> = {
    '@type': 'ContactPoint',
    name: `${SOVEREIGN_DEMAND_CHANNEL.label} · Reservas y visitas técnicas`,
    telephone: SOVEREIGN_DEMAND_CHANNEL.telDisplay,
    contactType: 'reservations',
    availableLanguage: ['es'],
    url: SOVEREIGN_DEMAND_CHANNEL.whatsappBase,
  };
  const area: string = typeof areaServed === 'string' ? sanitizeEntityLabel(areaServed) : '';
  if (area.length > 0) base.areaServed = area;
  return Object.freeze(base);
}

function isCommerceNode(record: Record<string, unknown>): boolean {
  const raw: unknown = record['@type'];
  if (typeof raw === 'string') return COMMERCE_SCHEMA_TYPES.has(raw);
  if (Array.isArray(raw)) {
    return raw.some((type: unknown) => typeof type === 'string' && COMMERCE_SCHEMA_TYPES.has(type));
  }
  return false;
}

/**
 * Saneador recursivo del JSON-LD: elimina `telephone`, `faxNumber` y `email` de
 * cualquier profundidad e inyecta el `contactPoint` soberano en los nodos
 * comerciales. PURA: no muta el objeto original (seguro con datos congelados).
 */
export function sanitizeSchemaContact(node: unknown, areaServed?: string): unknown {
  if (Array.isArray(node)) {
    return node.map((item: unknown) => sanitizeSchemaContact(item, areaServed));
  }
  if (node === null || typeof node !== 'object') return node;

  const record = node as Record<string, unknown>;
  const clean: Record<string, unknown> = {};

  for (const key of Object.keys(record)) {
    if (SUPPLIER_CONTACT_KEYS.has(key)) continue;
    clean[key] = sanitizeSchemaContact(record[key], areaServed);
  }

  if (isCommerceNode(clean)) {
    clean.contactPoint = sovereignContactPoint(areaServed);
  }

  return clean;
}

/**
 * Guardián de runtime: `true` si el JSON-LD ya saneado no expone líneas de
 * proveedor (ni teléfono ni email) en ninguna profundidad.
 */
export function schemaIsContactFree(node: unknown): boolean {
  const serialized: string = JSON.stringify(node) ?? '';
  const telephones: readonly string[] = serialized.match(/"telephone"\s*:\s*"[^"]*"/g) ?? [];
  const onlySovereign: boolean = telephones.every((entry: string) =>
    entry.includes(SOVEREIGN_DEMAND_CHANNEL.telDisplay),
  );
  const noEmail: boolean = !/"email"\s*:/.test(serialized);
  const noFax: boolean = !/"faxNumber"\s*:/.test(serialized);
  return onlySovereign && noEmail && noFax;
}
