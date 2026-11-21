/**
 * VERIFICACIÓN DE CONTRATO · AGENTE CONCIERGE (P0 2026-11-21)
 * ─────────────────────────────────────────────────────────────────────────
 * Reproduce, sin red y sin LLM, las preguntas EXACTAS que el CEO pulsó como
 * chips en producción y exige que el motor determinista (el que corre cuando
 * no hay OPENROUTER_API_KEY) devuelva un hecho verificado y una acción viva.
 *
 * Criterio de paso por caso:
 *   · `handled === true`            → la intención se reconoce (no cae al genérico).
 *   · `action.url` no vacío         → el botón adjunto es navegable (0 clic muerto).
 *   · dirección/Derio en el texto   → el hecho sale del SSOT del proveedor.
 *
 * Exit 0 sólo si los 6 casos pasan. Ejecutar con:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_concierge_chips.ts
 */

import { resolveOtzarretaQuery } from '../src/lib/rag/provider-context';
import { resolveVoiceProfile } from '../src/lib/voice/voice-profile-engine';

interface ChipCase {
  readonly chip: string;
  readonly query: string;
  readonly expect: {
    readonly handled: boolean;
    readonly urlIncludes?: string;
    readonly replyIncludes?: readonly string[];
    readonly replyExcludes?: readonly string[];
  };
}

const CASES: readonly ChipCase[] = [
  {
    chip: 'Cómo llegar (reportado roto)',
    query: '¿Cómo llego al caserío en Derio (1902) y cuánto párking privado hay?',
    expect: {
      handled: true,
      urlIncludes: 'google.com/maps',
      replyIncludes: ['Derio', 'Santo Domingo Hiribidea', '120 plazas', '1902'],
    },
  },
  {
    chip: 'Cómo llegar (infinitivo)',
    query: '¿Cómo llegar al caserío?',
    expect: { handled: true, urlIncludes: 'google.com/maps', replyIncludes: ['120 plazas', '1902'] },
  },
  {
    chip: 'Menús desde',
    query: '¿Qué menús de celebración tienen y a partir de qué precio?',
    expect: {
      handled: true,
      replyIncludes: ['menú', '145', '155', '165', '185'],
      replyExcludes: ['100,00 €', '7 menús', 'Cantábrico', 'Especial Imperial', 'Menú Vasco'],
    },
  },
  {
    chip: 'Aforo',
    query: '¿Cuál es el aforo del salón acristalado interior y del jardín exterior?',
    expect: { handled: true, replyIncludes: ['200', '350', '120'] },
  },
  {
    chip: 'Parrilla y brasa',
    query: '¿Cómo es la parrilla de carbón de encina y sarmiento desde 1902?',
    expect: { handled: true, replyIncludes: ['sarmiento', '1902'] },
  },
  {
    chip: 'Bloqueo de fecha',
    query: 'Quiero bloquear la fecha con el depósito deducible de 100 €',
    expect: {
      handled: true,
      urlIncludes: '/calendario/catering/restaurante-otzarreta',
    },
  },
];

let failures = 0;

for (const testCase of CASES) {
  const result = resolveOtzarretaQuery(testCase.query);
  const problems: string[] = [];

  if (result.handled !== testCase.expect.handled) {
    problems.push(`handled=${String(result.handled)} (esperado ${String(testCase.expect.handled)})`);
  }

  const url = result.action?.url ?? '';
  if (!url) {
    problems.push('acción sin URL (clic muerto)');
  }
  if (testCase.expect.urlIncludes && !url.includes(testCase.expect.urlIncludes)) {
    problems.push(`URL "${url.slice(0, 60)}…" no contiene "${testCase.expect.urlIncludes}"`);
  }

  for (const token of testCase.expect.replyIncludes ?? []) {
    if (!result.reply.toLowerCase().includes(token.toLowerCase())) {
      problems.push(`respuesta sin el hecho "${token}"`);
    }
  }

  for (const forbidden of testCase.expect.replyExcludes ?? []) {
    if (result.reply.toLowerCase().includes(forbidden.toLowerCase())) {
      problems.push(`respuesta contiene dato derogado "${forbidden}"`);
    }
  }

  if (problems.length === 0) {
    console.log(`  [OK  ] ${testCase.chip}`);
  } else {
    failures++;
    console.log(`  [FAIL] ${testCase.chip}`);
    for (const problem of problems) console.log(`         > ${problem}`);
  }
}

const calendarVoiceProfile = resolveVoiceProfile('/calendario/catering/restaurante-otzarreta');
if (calendarVoiceProfile.tenantId === 'otzarreta') {
  console.log('  [OK  ] Voice profile (/calendario/catering/restaurante-otzarreta -> otzarreta)');
} else {
  failures++;
  console.log(`  [FAIL] Voice profile (/calendario/catering/restaurante-otzarreta -> ${calendarVoiceProfile.tenantId})`);
}

console.log('─────────────────────────────────────────────');
if (failures === 0) {
  console.log(`RESULTADO: ${CASES.length + 1}/${CASES.length + 1} comprobaciones responden con hecho verificado y URL viva.`);
  process.exit(0);
}
console.log(`RESULTADO: ${failures} comprobación(es) rota(s) de ${CASES.length + 1}.`);
process.exit(1);
