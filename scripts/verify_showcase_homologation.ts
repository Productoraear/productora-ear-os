#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR FORMAL — HOMOLOGACIÓN DE ESCAPARATE EXTERNO (CABALLO DE TROYA)
 * ════════════════════════════════════════════════════════════════════════════
 * Valida `public/data/fichas/ezkertza_homologada.json` contra los contratos
 * REALES de TypeScript (cero fachada):
 *   1. Cada campo del artefacto pasa el Zod `ProviderProfileFieldSchema` y su
 *      `category` pertenece al enum `ProviderProfileCategoryEnum`.
 *   2. Cada clave del campo EXISTE en el catálogo SSOT
 *      (`buildProviderFieldSet('catering')` de `provider-field-catalog.ts`).
 *   3. `ProviderTrojanOnboardingSchema` RECHAZA el onboarding por los huecos
 *      declarados (`cifNif`, `billingIban`): prueba de que el resto es
 *      schema-limpio y de que los huecos se declaran, no se inventan.
 *   4. DERIVA SSOT: cada cifra del artefacto == su constante en `ear-os-ssot.ts`
 *      y su campo en `otzarreta-entity.ts`. Cualquier divergencia ABORTA.
 *   5. Contact-Gate: teléfono enmascarado, `exposePhone:false`, cero teléfono o
 *      email literal en campos públicos (INV-06 / INV-12).
 *
 * Uso: node ./node_modules/tsx/dist/cli.mjs scripts/verify_showcase_homologation.ts [--artifact=<ruta>]
 * Exit: 0 = todas las puertas PASS · 1 = alguna FAIL.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ProviderProfileFieldSchema,
  ProviderProfileCategoryEnum,
  ProviderTrojanOnboardingSchema,
} from '../src/lib/providers/trojan-horse-schema';
import { buildProviderFieldSet } from '../src/lib/providers/provider-field-catalog';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_RESERVA_EUR,
  SPLIT_SOBERANO,
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
  SOLISTA_KM_INCLUIDOS,
  LOGISTICA_EUR_PER_KM,
} from '../src/lib/constants/ear-os-ssot';
import {
  OTZARRETA_ENTITY,
  OTZARRETA_WEDDING_MENUS,
  OTZARRETA_SEATING_PRESET,
} from '../src/lib/constants/otzarreta-entity';

const REPO_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const DEFAULT_ARTIFACT = path.join(REPO_ROOT, 'public', 'data', 'fichas', 'ezkertza_homologada.json');

/* ─────────────────────────── Tipos del artefacto ─────────────────────────── */

interface HomologatedField {
  readonly key: string;
  readonly category: string;
  readonly publicVisible: boolean;
  readonly sensitive: boolean;
  readonly label: string;
  readonly value: string | number | boolean | string[];
  readonly verifiedByAdmin: boolean;
  readonly updatedAt: string;
}

interface HomologatedArtifact {
  readonly schemaVersion: string;
  readonly mode: string;
  readonly generatedAt: string;
  readonly source: { readonly kind: string; readonly provenanceSha256: string | null };
  readonly target: {
    readonly slug: string;
    readonly catalogCategory: string;
    readonly trojanCategory: string;
    readonly schemaFields: number;
    readonly projectedFields: number;
    readonly publicFields: number;
  };
  readonly identity: { readonly businessName: string; readonly municipality: string; readonly geo: { readonly lat: number; readonly lng: number } };
  readonly menus: {
    readonly fromEur: number;
    readonly toEur: number;
    readonly count: number;
    readonly catalogue: readonly { readonly name: string; readonly priceEur: number }[];
  };
  readonly capacity: { readonly salonPax: number; readonly jardinPax: number; readonly totalPax: number; readonly parkingPlazas: number };
  readonly contact: {
    readonly telDisplay: string;
    readonly telDigits: string;
    readonly maskedPhone: boolean;
    readonly traceId: string;
    readonly priceLock: { readonly algorithm: string; readonly fingerprint: string; readonly depositEur: number; readonly deducible: boolean };
  };
  readonly onboarding: {
    readonly providerSlug: string;
    readonly businessName: string;
    readonly contactPhone: string;
    readonly membershipTier: string;
    readonly acceptsAntiFraudPolicy: boolean;
    readonly fields: readonly HomologatedField[];
  };
  readonly roleMatrix: {
    readonly pacienteCeroArtista: { readonly baseEur: number; readonly estandarEur: number; readonly kmIncluidos: number; readonly eurPerKmExtra: number };
    readonly b2g: { readonly topePreventivoEur: number; readonly limiteLegalEur: number };
    readonly directorioAbierto: { readonly depositoDeducibleEur: number; readonly splitSoberano: { readonly artista: number; readonly earOs: number; readonly vimume: number } };
  };
  readonly doctrine: {
    readonly exposePhone: boolean;
    readonly maskedPhone: boolean;
    readonly sovereignDataUnlocked: boolean;
    readonly depositoDeducibleEur: number;
    readonly splitSoberano: { readonly artista: number; readonly earOs: number; readonly vimume: number };
  };
  readonly completeness: { readonly projected: number; readonly max: number; readonly score: number; readonly gaps: readonly string[] };
  readonly integrity: { readonly fieldsProjected: number; readonly publicFields: number; readonly faqTotal: number; readonly selfHash: string };
}

/* ─────────────────────────── Utilidades ─────────────────────────── */

const PHONE_RE = /(?:\+34\s*)?[6-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/;
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function eq(actual: unknown, expected: unknown): boolean {
  return stableStringify(actual) === stableStringify(expected);
}

const gates: { readonly id: number; readonly title: string; readonly violations: readonly string[] }[] = [];
function gate(id: number, title: string, violations: readonly string[]): void {
  gates.push({ id, title, violations });
}

function readArtifactPath(): string {
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--artifact=')) return path.resolve(REPO_ROOT, arg.slice('--artifact='.length));
  }
  return DEFAULT_ARTIFACT;
}

function loadArtifact(filePath: string): HomologatedArtifact | null {
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, 'utf8')) as HomologatedArtifact;
}

/* ─────────────────────────── Puertas de verificación ─────────────────────────── */

function runGates(artifact: HomologatedArtifact): void {
  const catalogKeys = new Set(buildProviderFieldSet('catering').map((def) => def.key));

  // Puerta 1 · Esquema Zod por campo + categoría + pertenencia al catálogo.
  {
    const violations: string[] = [];
    for (const field of artifact.onboarding.fields) {
      if (!catalogKeys.has(field.key)) violations.push(`clave fuera del catálogo SSOT: ${field.key}`);
      if (!ProviderProfileCategoryEnum.safeParse(field.category).success) {
        violations.push(`category fuera del enum: ${field.category} (${field.key})`);
      }
      const parsed = ProviderProfileFieldSchema.safeParse(field);
      if (!parsed.success) {
        violations.push(`field no cumple ProviderProfileFieldSchema: ${field.key} → ${parsed.error.issues.map((i) => i.path.join('.')).join(',')}`);
      }
    }
    gate(1, 'Campos conformes a ProviderProfileFieldSchema + catálogo (380)', violations);
  }

  // Puerta 2 · El onboarding REAL sólo falla por los huecos declarados.
  {
    const violations: string[] = [];
    const candidate = {
      providerSlug: artifact.onboarding.providerSlug,
      businessName: artifact.onboarding.businessName,
      contactPhone: artifact.onboarding.contactPhone,
      membershipTier: artifact.onboarding.membershipTier,
      acceptsAntiFraudPolicy: artifact.onboarding.acceptsAntiFraudPolicy,
      fields: artifact.onboarding.fields,
    };
    const parsed = ProviderTrojanOnboardingSchema.safeParse(candidate);
    if (parsed.success) {
      violations.push('el esquema debería fallar por cifNif/billingIban ausentes (huecos no declarados)');
    } else {
      const paths = parsed.error.issues.map((issue) => issue.path.join('.'));
      if (!paths.includes('cifNif')) violations.push('el fallo del esquema no señala cifNif');
      if (!paths.includes('billingIban')) violations.push('el fallo del esquema no señala billingIban');
    }
    if (artifact.onboarding.acceptsAntiFraudPolicy !== true) violations.push('acceptsAntiFraudPolicy no es true literal');
    gate(2, 'ProviderTrojanOnboardingSchema rechaza sólo por huecos declarados (cifNif, billingIban)', violations);
  }

  // Puerta 3 · Deriva SSOT (ear-os-ssot.ts).
  {
    const violations: string[] = [];
    if (artifact.contact.telDisplay !== CENTRALITA_EAR_OS) violations.push(`Centralita desviada: ${artifact.contact.telDisplay}`);
    if (artifact.contact.telDigits !== digitsOnly(CENTRALITA_EAR_OS)) violations.push('telDigits != dígitos de la Centralita');
    if (artifact.contact.priceLock.depositEur !== DEPOSITO_RESERVA_EUR) violations.push('depósito del Price-Lock != SSOT');
    if (artifact.doctrine.depositoDeducibleEur !== DEPOSITO_RESERVA_EUR) violations.push('doctrina.depósito != SSOT');
    if (!eq(artifact.roleMatrix.directorioAbierto.splitSoberano, SPLIT_SOBERANO)) violations.push('split del directorio != SPLIT_SOBERANO');
    if (!eq(artifact.doctrine.splitSoberano, SPLIT_SOBERANO)) violations.push('doctrina.split != SPLIT_SOBERANO');
    if (artifact.roleMatrix.b2g.topePreventivoEur !== AJUSTE_PREVENTIVO_B2G_EUR) violations.push('tope B2G != AJUSTE_PREVENTIVO_B2G_EUR');
    if (artifact.roleMatrix.b2g.limiteLegalEur !== LIMITE_B2G_LCSP_EUR) violations.push('límite legal B2G != LIMITE_B2G_LCSP_EUR');
    const artist = artifact.roleMatrix.pacienteCeroArtista;
    if (artist.baseEur !== TARIFA_BASE_SOLISTA_EUR) violations.push('tarifa base artista != SSOT');
    if (artist.estandarEur !== TARIFA_ESTANDAR_SOLISTA_EUR) violations.push('tarifa estándar artista != SSOT');
    if (artist.kmIncluidos !== SOLISTA_KM_INCLUIDOS) violations.push('km incluidos != SSOT');
    if (artist.eurPerKmExtra !== LOGISTICA_EUR_PER_KM) violations.push('€/km extra != SSOT');
    gate(3, 'Deriva SSOT cero (centralita, depósito, split, B2G, tarifas solista)', violations);
  }

  // Puerta 4 · Deriva de entidad (otzarreta-entity.ts).
  {
    const violations: string[] = [];
    const firstMenu = OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? -1;
    const lastMenu = OTZARRETA_WEDDING_MENUS[OTZARRETA_WEDDING_MENUS.length - 1]?.priceEur ?? -1;
    if (artifact.menus.fromEur !== firstMenu) violations.push(`menú desde ${artifact.menus.fromEur} != entidad ${firstMenu}`);
    if (artifact.menus.toEur !== lastMenu) violations.push(`menú hasta ${artifact.menus.toEur} != entidad ${lastMenu}`);
    if (artifact.menus.count !== OTZARRETA_WEDDING_MENUS.length) violations.push('recuento de menús != entidad');
    if (artifact.capacity.salonPax !== OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax) violations.push('aforo salón != preset');
    if (artifact.capacity.jardinPax !== OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax) violations.push('aforo jardín != preset');
    if (artifact.capacity.totalPax !== OTZARRETA_ENTITY.capacityPax) violations.push('aforo total != entidad');
    if (artifact.capacity.parkingPlazas !== OTZARRETA_ENTITY.parkingSpaces) violations.push('parking != entidad');
    if (!eq(artifact.identity.geo, OTZARRETA_ENTITY.geo)) violations.push('geo != entidad');
    gate(4, 'Deriva de entidad cero (menús 145–185, aforos 200/350, parking 120, geo)', violations);
  }

  // Puerta 5 · Contact-Gate (INV-06 / INV-12).
  {
    const violations: string[] = [];
    if (artifact.contact.maskedPhone !== true) violations.push('contact.maskedPhone != true');
    if (artifact.doctrine.maskedPhone !== true) violations.push('doctrine.maskedPhone != true');
    if (artifact.doctrine.exposePhone !== false) violations.push('doctrine.exposePhone != false');
    for (const field of artifact.onboarding.fields) {
      if (field.publicVisible !== true) continue;
      const text = Array.isArray(field.value) ? field.value.join(' ') : String(field.value);
      // Único teléfono autorizado en público: la Centralita soberana.
      const withoutUrls = text.replace(/https?:\/\/\S+/g, ' ');
      const isCentralita = text.includes(CENTRALITA_EAR_OS) || digitsOnly(withoutUrls).includes(digitsOnly(CENTRALITA_EAR_OS));
      if (EMAIL_RE.test(withoutUrls)) violations.push(`email literal en campo público ${field.key}`);
      if (!isCentralita && PHONE_RE.test(withoutUrls)) violations.push(`teléfono literal en campo público ${field.key}`);
    }
    if (artifact.contact.telDigits !== digitsOnly(CENTRALITA_EAR_OS)) violations.push('el teléfono público no es la Centralita soberana');
    gate(5, 'Contact-Gate: teléfono enmascarado, cero PII literal en público', violations);
  }

  // Puerta 6 · Integridad del sello (selfHash) + llave soberana.
  {
    const violations: string[] = [];
    const { integrity, ...bodyWithoutIntegrity } = artifact;
    const recomputed = createHash('sha256').update(stableStringify(bodyWithoutIntegrity), 'utf8').digest('hex');
    if (recomputed !== integrity.selfHash) violations.push('selfHash no reproduce el cuerpo (sello manipulado)');
    if (artifact.doctrine.sovereignDataUnlocked !== false) violations.push('sovereignDataUnlocked != false');
    const lockedPublic = artifact.onboarding.fields.filter((f) => f.key.startsWith('rep.') && f.publicVisible === true);
    if (lockedPublic.length > 0) violations.push('datos de reputación públicos con la llave cerrada');
    gate(6, 'Sello selfHash íntegro + llave soberana cerrada', violations);
  }

  // Puerta 7 · Completitud honesta (huecos declarados ⇒ score < 380).
  {
    const violations: string[] = [];
    if (artifact.completeness.gaps.length > 0 && artifact.completeness.score >= artifact.completeness.max) {
      violations.push('completitud inflada con huecos declarados');
    }
    if (artifact.integrity.fieldsProjected !== artifact.onboarding.fields.length) violations.push('integrity.fieldsProjected != nº de campos');
    gate(7, 'Completitud honesta declarada (score < 380 con huecos)', violations);
  }
}

/* ─────────────────────────── Ejecución ─────────────────────────── */

function main(): number {
  const filePath = readArtifactPath();
  console.log('═'.repeat(78));
  console.log('VERIFICADOR — HOMOLOGACIÓN DE ESCAPARATE EXTERNO (CABALLO DE TROYA)');
  console.log('═'.repeat(78));
  console.log(`[artefacto] ${path.relative(REPO_ROOT, filePath).split(path.sep).join('/')}`);

  const artifact = loadArtifact(filePath);
  if (artifact === null) {
    console.log('[Ω-HOMOLOG] SIN_EVIDENCIA — el artefacto no existe (bloquea release).');
    return 1;
  }

  runGates(artifact);
  console.log('');

  let failed = 0;
  for (const g of gates) {
    const ok = g.violations.length === 0;
    if (!ok) failed += 1;
    console.log(`  ${ok ? 'PASS' : 'FAIL'} · Puerta ${g.id} — ${g.title}`);
    for (const v of g.violations) console.log(`         · ${v}`);
  }
  console.log('');

  const total = gates.length;
  if (failed === 0) {
    console.log(`[Ω-HOMOLOG] RESULTADO: ${total}/${total} puertas VERIFICADO (Exit 0).`);
    return 0;
  }
  console.log(`[Ω-HOMOLOG] RESULTADO: ${total - failed}/${total} puertas — SOSPECHOSO (bloquea release).`);
  return 1;
}

process.exit(main());
