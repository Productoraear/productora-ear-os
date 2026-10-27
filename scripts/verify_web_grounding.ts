/**
 * 🧪 VERIFICACIÓN FORENSE — GROUNDING WEB EN VIVO (DeepSeek Search & Fetch)
 * ---------------------------------------------------------------------------
 * Comprueba OFFLINE (coste $0, sin red) los candados de seguridad del grounding:
 *   1. Contrato del Search API (query 1-128 caracteres).
 *   2. Guardia SSRF (loopback, rangos privados, metadatos cloud, credenciales).
 *   3. Antifugas de PII en la query enviada a un tercero.
 *   4. Clasificador de necesidad (solo 3 supuestos de alto valor; ante duda null).
 *   5. Bloque de provenance (descarta fuentes privadas, cita URLs públicas).
 *
 * La prueba VIVA (llamada real facturable) se hace por HTTP contra el dev
 * server, que sí carga .env (ver informe del CEO).
 *
 * Uso:  npx --no-install tsx scripts/verify_web_grounding.ts
 * ---------------------------------------------------------------------------
 */

import {
  buildGroundingBlock,
  buildGroundingNeed,
  isPublicHttpUrl,
  sanitizeQueryFragment,
} from '../src/lib/agents/webGrounding';
import type { GroundingNeed } from '../src/lib/agents/webGrounding';
import { isValidSearchQuery } from '../src/lib/compiler/deepseek-inference';
import { EMPTY_CONSULTATION_SLOTS } from '../src/lib/agents/consultationTypes';
import type { ConsultationSlots } from '../src/lib/agents/consultationTypes';

interface CaseResult {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(name: string, ok: boolean, detail: string): void {
  cases.push({ name, ok, detail });
}

function slotsWith(overrides: Partial<ConsultationSlots>): ConsultationSlots {
  return { ...EMPTY_CONSULTATION_SLOTS, ...overrides };
}

/* ── 1. Contrato de la query (Search API) ────────────────────────────────── */
check(
  'Contrato: query vacía rechazada',
  isValidSearchQuery('   ') === false && isValidSearchQuery('') === false,
  `'' => ${isValidSearchQuery('')} · '   ' => ${isValidSearchQuery('   ')}`,
);
check(
  'Contrato: query de 128 caracteres aceptada y 129 rechazada',
  isValidSearchQuery('a'.repeat(128)) === true && isValidSearchQuery('a'.repeat(129)) === false,
  `128 => ${isValidSearchQuery('a'.repeat(128))} · 129 => ${isValidSearchQuery('a'.repeat(129))}`,
);

/* ── 2. Guardia SSRF ─────────────────────────────────────────────────────── */
const blockedUrls: readonly string[] = [
  'http://localhost/admin',
  'http://127.0.0.1:3000/api',
  'http://169.254.169.254/latest/meta-data/',
  'http://192.168.1.10/router',
  'http://10.0.0.5/internal',
  'http://172.16.4.9/coolify',
  'file:///etc/passwd',
  'javascript:alert(1)',
  'https://user:pass@example.com/x',
  'https://metadata.google.internal/computeMetadata/v1/',
  'https://nodo.local/panel',
];
const leaked: string[] = blockedUrls.filter((url: string) => isPublicHttpUrl(url));
check(
  'SSRF: bloquea loopback, privados, metadatos, credenciales y esquemas raros',
  leaked.length === 0,
  `fugas=${JSON.stringify(leaked)}`,
);

const allowedUrls: readonly string[] = ['https://www.productoraear.com', 'http://example.es/aviso-legal'];
const rejected: string[] = allowedUrls.filter((url: string) => !isPublicHttpUrl(url));
check('SSRF: permite URLs públicas http(s) legítimas', rejected.length === 0, `rechazadas=${JSON.stringify(rejected)}`);

/* ── 3. Antifugas de PII ─────────────────────────────────────────────────── */
const dirty: string = 'Soy Ana 693693048 ana@bodas.es "Casa Pepe" <script>';
const clean: string = sanitizeQueryFragment(dirty);
check(
  'PII: elimina teléfono, email, comillas y etiquetas antes de enviar la query',
  !clean.includes('693693048') &&
    !clean.includes('ana@bodas.es') &&
    !clean.includes('"') &&
    !clean.includes('<') &&
    clean.includes('Casa Pepe'),
  `resultado="${clean}"`,
);

/* ── 4. Clasificador de necesidad ────────────────────────────────────────── */
const normativa: GroundingNeed | null = buildGroundingNeed({
  slots: slotsWith({ city: 'Toledo' }),
  message: '¿Cuántos decibelios permite el ayuntamiento por la noche?',
});
check(
  'Necesidad: normativa acústica municipal con localidad detectada',
  normativa !== null &&
    normativa.kind === 'normativa_municipal' &&
    normativa.query.includes('Toledo') &&
    normativa.query.length <= 128,
  normativa === null ? 'null' : `${normativa.kind} · "${normativa.query}" (${normativa.query.length})`,
);

const licitacion: GroundingNeed | null = buildGroundingNeed({
  slots: slotsWith({ city: 'Aranjuez' }),
  message: 'Necesito una licitación menor para las fiestas patronales',
});
check(
  'Necesidad: licitación B2G con el año en curso (dato volátil)',
  licitacion !== null &&
    licitacion.kind === 'licitacion_b2g' &&
    licitacion.query.includes(String(new Date().getFullYear())),
  licitacion === null ? 'null' : `"${licitacion.query}"`,
);

const nada: GroundingNeed | null = buildGroundingNeed({
  slots: EMPTY_CONSULTATION_SLOTS,
  message: 'Hola, quería información general',
});
check(
  'Coste: una consulta genérica NO dispara búsqueda (ahorro garantizado)',
  nada === null,
  `resultado=${String(nada)}`,
);

const externo: GroundingNeed | null = buildGroundingNeed({
  slots: slotsWith({ city: 'Sevilla' }),
  message: '¿Cuál es el aforo máximo del recinto?',
  activeEntityName: 'Hacienda Los Olivos',
});
check(
  'Necesidad: recinto externo no homologado (aforo)',
  externo !== null && externo.kind === 'recinto_externo' && externo.query.includes('Hacienda Los Olivos'),
  externo === null ? 'null' : `"${externo.query}"`,
);

const homologado: GroundingNeed | null = buildGroundingNeed({
  slots: slotsWith({ city: 'Madrid' }),
  message: '¿Cuál es el aforo del recinto?',
  activeEntityName: 'Finca La Chopera',
});
check(
  'Coste: una finca HOMOLOGADA no dispara búsqueda (ya está en el SSOT)',
  homologado === null,
  `resultado=${String(homologado)}`,
);

/* ── 5. Bloque de provenance ─────────────────────────────────────────────── */
const need: GroundingNeed = { kind: 'normativa_municipal', query: 'q', label: 'Ordenanza de ruido de Toledo' };
const composed = buildGroundingBlock(need, [
  { title: 'Ordenanza municipal', url: 'https://www.toledo.es/ordenanza-ruido', summary: 'Límite 55 dB de noche.', content: '' },
  { title: 'Metadatos', url: 'http://169.254.169.254/latest', summary: 'secreto', content: '' },
]);
check(
  'Provenance: descarta fuentes privadas y cita la URL pública',
  composed.block.includes('[fuente: https://www.toledo.es/ordenanza-ruido]') &&
    !composed.block.includes('169.254') &&
    composed.sources.length === 1,
  `sources=${JSON.stringify(composed.sources)}`,
);
check(
  'Provenance: el bloque es Markdown y conserva saltos de línea',
  composed.block.startsWith('## CONTEXTO WEB VERIFICADO') && composed.block.includes('\n- '),
  `líneas=${composed.block.split('\n').length}`,
);

/* ── Informe ─────────────────────────────────────────────────────────────── */
const passed: number = cases.filter((c) => c.ok).length;
for (const c of cases) {
  console.log(`${c.ok ? '✅' : '❌'} ${c.name}\n   ${c.detail}`);
}
console.log(`\n${passed}/${cases.length} comprobaciones superadas (coste de red: $0,00).`);
process.exitCode = passed === cases.length ? 0 : 1;
