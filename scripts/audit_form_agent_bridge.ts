/**
 * 🧪 AUDITOR — PUENTE FORMULARIO → FLOTA Ω (WAVE 43)
 * ---------------------------------------------------------------------------
 * Verifica, sin red y con coste 0,00 €, que el puente `formulario → agentBus →
 * n8n` no tiene fachadas:
 *   1. Los 8 `IntakeFormType` tienen ruta declarada (tabla cerrada).
 *   2. Ningún `entryAgent`/`chain.agent` es fantasma (existe en `OMEGA_FLEET_ROSTER`).
 *   3. Ninguna intención viola `FORBIDDEN_INTENTS` del bus (leído del fuente real).
 *   4. La cadena no revienta el presupuesto del bus (máx. 2 especialistas).
 *   5. Toda ruta que cotiza exige un canal de contacto verificable (teléfono/email).
 *   6. Cada superficie UI que llama a `submitFormToAgents` usa un `formType` real.
 *   7. Ningún componente cliente importa el motor de servidor (`formIntake.ts`:
 *      arrastra `node:fs` y el ledger → fuga de bundle garantizada).
 *   8. El endpoint `/api/agents/intake` existe, es `nodejs` + `force-dynamic` y
 *      usa `runFormIntake`.
 *   9. El cliente es tolerante a fallos (AbortController + keepalive + no-store).
 *  10. El recibo es presentacional y seguro (sin `dangerouslySetInnerHTML`).
 *
 * Uso:  npx --no-install tsx scripts/audit_form_agent_bridge.ts
 * Salida: Exit Code 0 = puente sellado · 1 = fachada detectada.
 * ---------------------------------------------------------------------------
 */

import fs from 'node:fs';
import path from 'node:path';

import { INTAKE_FORM_TYPES, INTAKE_ROUTES } from '../src/lib/agents/formIntakeRoutes';
import { OMEGA_DIVISION_COUNT, OMEGA_FLEET_ROSTER } from '../src/lib/agents/omegaFleet';
import type { AgentId } from '../src/lib/agents/agentBus';
import type { IntakeFormType } from '../src/lib/agents/formIntakeTypes';

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

function exists(relativePath: string): boolean {
  return fs.existsSync(path.join(ROOT, relativePath));
}

interface SourceFile {
  readonly rel: string;
  readonly text: string;
}

/** Cuarentena: copias históricas que jamás se sirven al cliente. */
const QUARANTINE: readonly string[] = ['src/adn_vault', 'node_modules', '.next'];

function walk(dirRel: string, out: SourceFile[]): void {
  const absolute: string = path.join(ROOT, dirRel);
  if (!fs.existsSync(absolute)) return;
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const childRel: string = `${dirRel}/${entry.name}`;
    if (QUARANTINE.some((q: string): boolean => childRel.startsWith(q))) continue;
    if (entry.isDirectory()) {
      walk(childRel, out);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(entry.name)) continue;
    out.push({ rel: childRel, text: fs.readFileSync(path.join(absolute, entry.name), 'utf8') });
  }
}

const sources: SourceFile[] = [];
walk('src', sources);

/* ── 1. Tabla de rutas cerrada (8 superficies reales) ──────────────────────── */
const routeKeys: readonly string[] = Object.keys(INTAKE_ROUTES).sort();
const declaredTypes: readonly IntakeFormType[] = [...INTAKE_FORM_TYPES].sort();
check(
  'Rutas: los 8 IntakeFormType tienen ruta declarada',
  routeKeys.length === 8 &&
    declaredTypes.length === 8 &&
    routeKeys.every((key: string, index: number): boolean => key === declaredTypes[index]),
  `types=${declaredTypes.length} · rutas=${routeKeys.length} · [${routeKeys.join(', ')}]`,
);

/* ── 2. Cero agentes fantasma ──────────────────────────────────────────────── */
const rosterIds: ReadonlySet<string> = new Set<string>(OMEGA_FLEET_ROSTER.map((spec): string => spec.id));
const ghostAgents: string[] = [];
for (const formType of INTAKE_FORM_TYPES) {
  const route = INTAKE_ROUTES[formType];
  const involved: readonly AgentId[] = [route.entryAgent, ...route.chain.map((step) => step.agent)];
  for (const agent of involved) {
    if (!rosterIds.has(agent)) ghostAgents.push(`${formType}→${agent}`);
  }
}
check(
  'Flota: 0 agentes fantasma en entryAgent/chain',
  ghostAgents.length === 0,
  ghostAgents.length === 0 ? `roster=${rosterIds.size} · divisiones=${OMEGA_DIVISION_COUNT}` : ghostAgents.join(', '),
);
check(
  'Flota: roster completo (48) y 6 divisiones',
  OMEGA_FLEET_ROSTER.length === 48 && OMEGA_DIVISION_COUNT === 6,
  `agentes=${OMEGA_FLEET_ROSTER.length} · divisiones=${OMEGA_DIVISION_COUNT}`,
);

/* ── 3. Intenciones legales (leídas del bus real, no copiadas a mano) ──────── */
const busSource: string = readSource('src/lib/agents/agentBus.ts');
const forbiddenStart: number = busSource.indexOf('const FORBIDDEN_INTENTS');
const forbiddenBlock: string =
  forbiddenStart < 0 ? '' : busSource.slice(forbiddenStart, busSource.indexOf('];', forbiddenStart) + 2);
const forbiddenIntents: readonly string[] = Array.from(
  forbiddenBlock.matchAll(/'([a-z_]+)'/g),
  (match: RegExpMatchArray): string => match[1] ?? '',
).filter((intent: string): boolean => intent.length > 0);

const invalidIntents: string[] = [];
for (const formType of INTAKE_FORM_TYPES) {
  const route = INTAKE_ROUTES[formType];
  const intents: readonly string[] = [route.entryIntent, ...route.chain.map((step) => step.intent)];
  for (const intent of intents) {
    if (!/^form_[a-z0-9_]{2,40}$/.test(intent) || forbiddenIntents.includes(intent)) {
      invalidIntents.push(`${formType}:${intent}`);
    }
  }
}
check(
  'Bus: intenciones con prefijo form_ y fuera de FORBIDDEN_INTENTS',
  invalidIntents.length === 0 && forbiddenIntents.length >= 6,
  invalidIntents.length === 0
    ? `FORBIDDEN_INTENTS leídas=${forbiddenIntents.length}`
    : invalidIntents.join(', '),
);

/* ── 4. Presupuesto del bus: máx. 2 especialistas por ruta ─────────────────── */
const chainLengths: readonly number[] = INTAKE_FORM_TYPES.map((formType): number => INTAKE_ROUTES[formType].chain.length);
const overBudget: readonly string[] = INTAKE_FORM_TYPES.filter(
  (_formType, index: number): boolean => (chainLengths[index] ?? 0) > 2,
).map((formType, index): string => `${formType}=${chainLengths[index] ?? 0}`);
check(
  'Bus: cadena ≤ 2 especialistas por ruta',
  overBudget.length === 0,
  overBudget.length === 0 ? `máx=${Math.max(...chainLengths)}` : overBudget.join(', '),
);

/* ── 5. Rutas que cotizan exigen canal de contacto ─────────────────────────── */
const contactless: readonly string[] = INTAKE_FORM_TYPES.filter((formType): boolean => {
  const route = INTAKE_ROUTES[formType];
  const hasContact: boolean =
    route.requiredFields.includes('clientPhone') || route.requiredFields.includes('clientEmail');
  return route.quotes && !hasContact;
}).map((formType): string => String(formType));
const emptyRequired: readonly string[] = INTAKE_FORM_TYPES.filter(
  (formType): boolean => INTAKE_ROUTES[formType].requiredFields.length === 0,
).map((formType): string => String(formType));
check(
  'Rutas: campos obligatorios declarados y contacto en las que cotizan',
  contactless.length === 0 && emptyRequired.length === 0,
  contactless.length === 0 && emptyRequired.length === 0
    ? 'quotes=true ⇒ phone|email'
    : `sinContacto=[${contactless.join(', ')}] vacías=[${emptyRequired.join(', ')}]`,
);

/* ── 6. Cableado real de superficies UI ────────────────────────────────────── */
const wired: Map<string, string[]> = new Map<string, string[]>();
const unknownTypes: string[] = [];
const CALL_PATTERN: RegExp = /submitFormToAgents\(\s*'([a-z_]+)'/g;

for (const file of sources) {
  if (file.rel.startsWith('src/lib/')) continue;
  for (const match of file.text.matchAll(CALL_PATTERN)) {
    const formType: string = match[1] ?? '';
    if (!routeKeys.includes(formType)) {
      unknownTypes.push(`${file.rel} → ${formType}`);
      continue;
    }
    const list: string[] = wired.get(formType) ?? [];
    if (!list.includes(file.rel)) list.push(file.rel);
    wired.set(formType, list);
  }
}

check(
  'UI: todo submitFormToAgents usa un formType declarado',
  unknownTypes.length === 0 && wired.size > 0,
  unknownTypes.length === 0 ? `${wired.size}/8 superficies cableadas` : unknownTypes.join(', '),
);

const SALES_SURFACES: readonly { readonly formType: string; readonly rel: string }[] = [
  { formType: 'booking_request', rel: 'src/components/booking/RequestToBookModal.tsx' },
  { formType: 'provider_claim', rel: 'src/components/providers/ClaimProviderModal.tsx' },
];
const unmounted: readonly string[] = SALES_SURFACES.filter(
  (surface): boolean => !(wired.get(surface.formType) ?? []).includes(surface.rel),
).map((surface): string => surface.rel);

check(
  'UI: los modales de venta y de reclamo llaman a la flota',
  unmounted.length === 0,
  unmounted.length === 0 ? SALES_SURFACES.map((s): string => s.formType).join(' + ') : `sin cablear: ${unmounted.join(', ')}`,
);

/* ── 7. Frontera servidor/cliente (node:fs jamás al bundle) ────────────────── */
const serverLeaks: string[] = [];
for (const file of sources) {
  const isClientSurface: boolean =
    file.text.includes("'use client'") ||
    file.text.includes('"use client"') ||
    file.rel.startsWith('src/components/') ||
    file.rel.startsWith('src/features/');
  if (!isClientSurface) continue;
  if (/from\s+'@\/lib\/agents\/formIntake'/.test(file.text)) serverLeaks.push(file.rel);
}
const rawEndpointHits: readonly string[] = sources
  .filter((file): boolean => !file.rel.startsWith('src/lib/'))
  .filter((file): boolean => !file.rel.startsWith('src/app/api/agents/intake/'))
  .filter((file): boolean => file.text.includes('/api/agents/intake'))
  .map((file): string => file.rel);
check(
  'Bundle: frontera servidor/cliente intacta (sin formIntake.ts ni URL cruda)',
  serverLeaks.length === 0 && rawEndpointHits.length === 0,
  serverLeaks.length === 0 && rawEndpointHits.length === 0
    ? 'solo formIntakeClient.ts habla con el endpoint'
    : `motor=[${serverLeaks.join(', ')}] url=[${rawEndpointHits.join(', ')}]`,
);

/* ── 8. Endpoint de ingesta blindado ───────────────────────────────────────── */
const ROUTE_REL: string = 'src/app/api/agents/intake/route.ts';
const routeSource: string = exists(ROUTE_REL) ? readSource(ROUTE_REL) : '';
check(
  'API: /api/agents/intake expone GET+POST, nodejs y force-dynamic',
  routeSource.includes('export async function GET') &&
    routeSource.includes('export async function POST') &&
    routeSource.includes("runtime = 'nodejs'") &&
    routeSource.includes("dynamic = 'force-dynamic'") &&
    routeSource.includes('runFormIntake') &&
    routeSource.includes('isKillSwitchActive') &&
    routeSource.includes('SlidingWindowRateLimiter'),
  exists(ROUTE_REL) ? 'kill-switch + rate-limit + runFormIntake' : 'FALTA el fichero',
);

/* ── 9. Cliente tolerante (nunca bloquea la venta) ─────────────────────────── */
const CLIENT_REL: string = 'src/lib/agents/formIntakeClient.ts';
const clientSource: string = exists(CLIENT_REL) ? readSource(CLIENT_REL) : '';
check(
  'Cliente: AbortController + keepalive + no-store + null ante fallo',
  clientSource.includes('AbortController') &&
    clientSource.includes('keepalive: true') &&
    clientSource.includes("cache: 'no-store'") &&
    /catch\s*{\s*return null;/.test(clientSource) &&
    clientSource.includes('export function createIntakeKey'),
  exists(CLIENT_REL) ? 'nunca lanza' : 'FALTA el fichero',
);

/* ── 10. Recibo presentacional y seguro ────────────────────────────────────── */
const RECEIPT_REL: string = 'src/components/agents/AgentIntakeReceipt.tsx';
const receiptSource: string = exists(RECEIPT_REL) ? readSource(RECEIPT_REL) : '';
check(
  'Recibo: sin innerHTML, sin estado propio y con hueco reservado (CLS)',
  receiptSource.length > 0 &&
    !receiptSource.includes('dangerouslySetInnerHTML') &&
    receiptSource.includes('min-h-') &&
    !receiptSource.includes('useState') &&
    !receiptSource.includes('useEffect'),
  exists(RECEIPT_REL) ? 'presentacional puro' : 'FALTA el fichero',
);

/* ── Cierre ────────────────────────────────────────────────────────────────── */
const failed: readonly CaseResult[] = cases.filter((item: CaseResult): boolean => !item.ok);
const wiredTypes: readonly string[] = Array.from(wired.keys()).sort();
const orphanTypes: readonly string[] = routeKeys.filter((key: string): boolean => !wiredTypes.includes(key));

const line: string = '═'.repeat(78);
console.log(line);
console.log('AUDITOR PUENTE FORMULARIO → FLOTA Ω · ZONA CERO INTACTA');
console.log(line);
for (const item of cases) {
  console.log(`${item.ok ? '✅' : '❌'} ${item.name} — ${item.detail}`);
}
console.log(line);
console.log(`CENSO CABLEADO (${wiredTypes.length}/8):`);
for (const formType of wiredTypes) {
  console.log(`  · ${formType} ← ${(wired.get(formType) ?? []).join(' , ')}`);
}
if (orphanTypes.length > 0) {
  console.log(`⚠️  SIN_CABLEAR (${orphanTypes.length}): ${orphanTypes.join(', ')}`);
}
console.log(
  JSON.stringify({
    pass: cases.length - failed.length,
    total: cases.length,
    wired: wiredTypes,
    orphans: orphanTypes,
    exit: failed.length === 0 ? 0 : 1,
  }),
);
console.log(line);

if (failed.length > 0) {
  for (const item of failed) console.error(`FALLO: ${item.name} → ${item.detail}`);
  process.exit(1);
}
console.log('PUENTE SELLADO: 0 fachadas en formulario → agentBus → n8n.');
process.exit(0);
