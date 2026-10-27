/**
 * 🧪 VERIFICACIÓN FORENSE — PEAJE SOBERANO (WAVE 40)
 * ---------------------------------------------------------------------------
 * Reproduce el fallo reportado por el CEO:
 *   «Sale en primera fila el número de Eduardo, no hay peaje.»
 *
 * Comprueba, sin red y con coste $0,00:
 *   1. Que existe un único canal de venta (Conserjería EAR OS) y que los enlaces
 *      se construyen SIEMPRE con él.
 *   2. Que la línea del recinto solo se publica enmascarada.
 *   3. Que el JSON-LD se sanea (ni teléfono ni email de proveedor) y se inyecta
 *      el punto de contacto soberano.
 *   4. Que las superficies reales (`/otzarreta`, sus 126 landings, la ficha de
 *      reclamación) ya no contienen la línea del gerente.
 *   5. Que el Concierge IA tiene prohibido facilitarla.
 *
 * Uso:  npx --no-install tsx scripts/verify_lead_gate.ts
 * ---------------------------------------------------------------------------
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  SOVEREIGN_DEMAND_CHANNEL,
  buildDemandWhatsappUrl,
  isSovereignDigits,
  phoneDigits,
  sanitizeEntityLabel,
  sanitizeSchemaContact,
  schemaIsContactFree,
  sovereignContactPoint,
  supplierContactState,
  supplierContactWithheldNotice,
  supplierLineMask,
} from '../src/lib/providers/sovereign-lead-gate';
import { CENTRALITA_EAR_OS } from '../src/lib/constants/ear-os-ssot';
import { buildPageContextBlock, resolvePageContext } from '../src/lib/agents/pageContext';

interface CaseResult {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(name: string, ok: boolean, detail: string): void {
  cases.push({ name, ok, detail });
}

const ROOT: string = process.cwd();

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

/* ── 1. Canal único de venta ─────────────────────────────────────────────── */
check(
  'Canal: la Conserjería usa la centralita del SSOT',
  SOVEREIGN_DEMAND_CHANNEL.telDisplay === CENTRALITA_EAR_OS,
  SOVEREIGN_DEMAND_CHANNEL.telDisplay,
);
check(
  'Canal: dígitos E.164 correctos y reconocidos',
  SOVEREIGN_DEMAND_CHANNEL.telDigits === '34693693048' &&
    isSovereignDigits(SOVEREIGN_DEMAND_CHANNEL.telDigits) &&
    !isSovereignDigits('34619455396'),
  SOVEREIGN_DEMAND_CHANNEL.telDigits,
);
check(
  'Canal: base de WhatsApp apunta a la centralita',
  SOVEREIGN_DEMAND_CHANNEL.whatsappBase === 'https://wa.me/34693693048',
  SOVEREIGN_DEMAND_CHANNEL.whatsappBase,
);
check(
  'Canal: terminales de reserva y visita declaradas',
  SOVEREIGN_DEMAND_CHANNEL.bookingsHref === '/reservar/solista' &&
    SOVEREIGN_DEMAND_CHANNEL.visitsHref === '/contacto',
  `${SOVEREIGN_DEMAND_CHANNEL.bookingsHref} · ${SOVEREIGN_DEMAND_CHANNEL.visitsHref}`,
);

/* ── 2. Enlaces de demanda ───────────────────────────────────────────────── */
const visitUrl: string = buildDemandWhatsappUrl({
  entityName: 'Ezkertza Berria & Otzarreta',
  intent: 'visita-tecnica',
  detail: 'Derio / Zarautz',
});
const visitMessage: string = decodeURIComponent(visitUrl.split('?text=')[1] ?? '');
check(
  'Enlace: se construye sobre la centralita',
  visitUrl.startsWith('https://wa.me/34693693048?text='),
  visitUrl.slice(0, 48),
);
check(
  'Enlace: el mensaje cualifica la entidad y la intención',
  visitMessage.includes('Conserjería EAR OS') &&
    visitMessage.includes('Ezkertza Berria & Otzarreta') &&
    visitMessage.includes('visita técnica') &&
    visitMessage.includes('Derio / Zarautz'),
  visitMessage,
);
check(
  'Enlace: cero rastro de la línea del gerente',
  !visitUrl.includes('619455396') && !visitMessage.includes('619'),
  'sin línea de proveedor',
);
check(
  'Enlace: la etiqueta se sanea (salto de línea y etiquetas fuera)',
  !sanitizeEntityLabel('A\nB<script>alert(1)</script>').includes('\n') &&
    !sanitizeEntityLabel('A\nB<script>').includes('<'),
  sanitizeEntityLabel('A\nB<script>'),
);
check(
  'Enlace: la etiqueta se acota a 120 caracteres',
  sanitizeEntityLabel('x'.repeat(400)).length <= 120,
  `${sanitizeEntityLabel('x'.repeat(400)).length} chars`,
);

/* ── 3. Máscara y estado del contacto ────────────────────────────────────── */
const masked: string = supplierLineMask('+34 619 455 396');
check(
  'Máscara: la línea del gerente se publica enmascarada',
  masked === '+34 6•• ••• •96' && !masked.includes('619455396'),
  masked,
);
check(
  'Máscara: sin teléfono no se inventa nada',
  supplierLineMask(null) === '••• ••• •••' && supplierLineMask('') === '••• ••• •••',
  supplierLineMask(null),
);
check(
  'Estado: auditable para telemetría',
  supplierContactState('+34 619 455 396') === 'masked-available' &&
    supplierContactState(null) === 'withheld',
  `${supplierContactState('+34 619 455 396')} · ${supplierContactState(null)}`,
);
check(
  'Estado: normalización de dígitos',
  phoneDigits('+34 619 455 396') === '34619455396' && phoneDigits(null) === '',
  phoneDigits('+34 619 455 396'),
);

/* ── 4. Aviso honesto al cliente ─────────────────────────────────────────── */
const notice: string = supplierContactWithheldNotice('Ezkertza Berria & Otzarreta');
check(
  'Aviso: canal único + entrega en visita técnica',
  notice.includes(CENTRALITA_EAR_OS) &&
    notice.includes('Ezkertza Berria & Otzarreta') &&
    notice.includes('visita técnica'),
  notice.slice(0, 90),
);
check('Aviso: jamás incluye la línea del recinto', !notice.includes('619'), 'sin línea directa');

/* ── 5. Saneado del JSON-LD ──────────────────────────────────────────────── */
const rawFixture = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Restaurante Otzarreta',
  telephone: '+34 943 131 243',
  email: 'otzarreta@restauranteotzarreta.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Zarautz' },
  offers: { '@type': 'Offer', price: 100, priceCurrency: 'EUR' },
  sameAs: ['https://www.restauranteotzarreta.com'],
};

check(
  'JSON-LD: el original sin sanear SÍ expone la línea (el guardián lo detecta)',
  schemaIsContactFree(rawFixture) === false,
  'fuga detectada antes de sanear',
);

const sanitized = sanitizeSchemaContact(rawFixture, 'Gipuzkoa');
check(
  'JSON-LD: tras sanear no queda teléfono ni email de proveedor',
  schemaIsContactFree(sanitized) === true,
  JSON.stringify(sanitized).slice(0, 120),
);
check(
  'JSON-LD: la línea y el email del recinto desaparecen del payload',
  !JSON.stringify(sanitized).includes('943131243') &&
    !JSON.stringify(sanitized).includes('@restauranteotzarreta') &&
    !JSON.stringify(sanitized).includes('"email"'),
  'sin teléfono ni email',
);
check(
  'JSON-LD: se inyecta el punto de contacto soberano',
  JSON.stringify(sanitized).includes(CENTRALITA_EAR_OS) &&
    JSON.stringify(sanitized).includes('ContactPoint'),
  CENTRALITA_EAR_OS,
);
check(
  'JSON-LD: se preservan los datos comerciales legítimos',
  JSON.stringify(sanitized).includes('"price":100') &&
    JSON.stringify(sanitized).includes('Zarautz'),
  'offers + dirección intactos',
);
check(
  'JSON-LD: el saneador es puro (no muta el original)',
  rawFixture.telephone === '+34 943 131 243' && rawFixture.email.length > 0,
  'inmutable',
);

const serviceGraph = sanitizeSchemaContact(
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Banquete de boda',
    provider: {
      '@type': 'Restaurant',
      name: 'Ezkertza Berria',
      telephone: '+34 944 544 476',
    },
  },
  'Bizkaia',
);
check(
  'JSON-LD: proveedor anidado saneado y con contacto soberano',
  schemaIsContactFree(serviceGraph) === true &&
    !JSON.stringify(serviceGraph).includes('944544476') &&
    JSON.stringify(serviceGraph).includes('ContactPoint'),
  'Service.provider saneado',
);
check(
  'JSON-LD: `contactPoint` solo aporta la línea soberana',
  sovereignContactPoint('Bizkaia')['telephone'] === CENTRALITA_EAR_OS &&
    sovereignContactPoint('Bizkaia')['contactType'] === 'reservations',
  JSON.stringify(sovereignContactPoint('Bizkaia')),
);

/* ── 6. Superficies públicas reales ──────────────────────────────────────── */
const SUPPLIER_DIGITS: readonly string[] = ['619455396', '944544476', '943131243', '943134095'];
const hub: string = readSource('src/app/(public)/otzarreta/page.tsx');
const cluster: string = readSource('src/app/(public)/otzarreta/[slug]/page.tsx');
const claim: string = readSource('src/app/(public)/reclamar-perfil/page.tsx');

check(
  'Superficie /otzarreta: cero líneas del gerente o de las sedes',
  SUPPLIER_DIGITS.every((digits: string) => !hub.includes(digits)),
  'hub limpio',
);
check(
  'Superficie /otzarreta: sin volcado de `venue.phones`',
  !hub.includes('venue.phones.join') && !hub.includes('affiliatedVenues[0].phones'),
  'sin arrays de teléfonos',
);
check(
  'Superficie /otzarreta: el CTA directo ya no existe',
  !hub.includes('eduardoDirectWhatsapp') && !hub.includes('WhatsApp Eduardo'),
  'CTA neutralizado',
);
check(
  'Superficie /otzarreta: JSON-LD saneado en render',
  hub.includes('sanitizeSchemaContact'),
  'saneador aplicado',
);
check(
  'Superficie clúster (126 landings): cero líneas del recinto',
  SUPPLIER_DIGITS.every((digits: string) => !cluster.includes(digits)) &&
    cluster.includes('sanitizeSchemaContact') &&
    !cluster.includes('landing.email}'),
  'landings limpias',
);
check(
  'Superficie reclamación: el teléfono del proveedor va enmascarado',
  claim.includes('maskPhoneForDisplay') && !/\{vendorData\.phone\}/.test(claim),
  'máscara aplicada',
);

/* ── 7. Auditor de CI ────────────────────────────────────────────────────── */
const audit: string = readSource('scripts/audit_phone_exposure.cjs');
const packageJson: string = readSource('package.json');
check(
  'CI: el auditor cubre enlaces, literales y renders',
  audit.includes('SUPPLIER_CONTACT_LINK') &&
    audit.includes('SUPPLIER_PHONE_LITERAL') &&
    audit.includes('SUPPLIER_PHONE_RENDER'),
  '3 reglas del peaje',
);
check(
  'CI: `audit:phone` está en el gate de pre-push',
  packageJson.includes('"audit:phone"') &&
    /gate:prepush"\s*:\s*"[^"]*audit:phone/.test(packageJson) &&
    /gate:prepush"\s*:\s*"[^"]*verify:leadgate/.test(packageJson),
  'gate:prepush',
);

/* ── 8. Concierge IA blindado ────────────────────────────────────────────── */
const venueBlock: string = buildPageContextBlock(resolvePageContext({ pathname: '/otzarreta' }));
check(
  'Concierge: el prompt declara la Conserjería como canal único',
  venueBlock.includes('Conserjería EAR OS') && venueBlock.includes(CENTRALITA_EAR_OS),
  'canal único en prompt',
);
check(
  'Concierge: prohibido facilitar teléfonos o emails del recinto',
  venueBlock.includes('PROHIBIDO facilitar teléfonos o emails'),
  'veto explícito',
);
check(
  'Concierge: la ficha sigue sin contener líneas del recinto',
  SUPPLIER_DIGITS.every((digits: string) => !venueBlock.includes(digits)),
  'ficha limpia',
);

/* ── Informe ─────────────────────────────────────────────────────────────── */
const passed: number = cases.filter((c: CaseResult) => c.ok).length;
for (const c of cases) {
  console.log(`${c.ok ? '✅' : '❌'} ${c.name}\n   ${c.detail}`);
}
console.log(`\n${passed}/${cases.length} comprobaciones superadas · PEAJE SOBERANO verificado.`);
process.exitCode = passed === cases.length ? 0 : 1;

