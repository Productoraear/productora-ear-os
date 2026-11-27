/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR EJECUTABLE — DOCTRINA DE LOS 4 COACHES DE IA (VELOCITY_MEDIA_S_CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Prueba mecánicamente, sin red y sin base de datos:
 *   1. El cuarteto canónico está completo (4 roles, sin duplicados, doctrina única).
 *   2. Cada coach declara `coreBelief` no vacío y un `validateOutput` funcional.
 *   3. Las guardas doctrinales RECHAZAN las violaciones reales y ACEPTAN el caso
 *      conforme (suelo/techo/split/km, gates CI, presupuestos de rendimiento,
 *      JUR-1/JUR-4 y Centralita canónica).
 *   4. Disciplina SSOT: el módulo no teclea ninguna cifra canónica.
 *
 * Exit Code 0 = todas las aserciones pasan. Exit Code 1 = alguna falla.
 * Uso: node ./node_modules/tsx/dist/cli.mjs scripts/verify_coach_doctrine.ts
 * ════════════════════════════════════════════════════════════════════════════
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  AI_COACHES,
  AI_COACH_ROLES,
  AI_COACH_COUNT,
  COACH_DOCTRINE,
  COACH_ROLE_FOCUS,
  evaluateCoachCompliance,
} from '../src/lib/agents/coachTypes';
import {
  TARIFA_BASE_SOLISTA_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  SPLIT_SOBERANO,
  SOLISTA_KM_INCLUIDOS,
  CENTRALITA_EAR_OS,
} from '../src/lib/constants/ear-os-ssot';

const scriptDir: string = path.dirname(fileURLToPath(import.meta.url));
const repoRoot: string = path.resolve(scriptDir, '..');

let passed = 0;
const failures: string[] = [];

function check(name: string, ok: boolean, detail?: string): void {
  if (ok) {
    passed += 1;
    console.log(`  PASS · ${name}`);
  } else {
    failures.push(name);
    console.log(`  FAIL · ${name}${detail !== undefined ? ` — ${detail}` : ''}`);
  }
}

const SPLIT_LABEL = `${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(
  SPLIT_SOBERANO.earOs * 100,
)}/${Math.round(SPLIT_SOBERANO.vimume * 100)}`;

/* ── BLOQUE 1 · Integridad del cuarteto ──────────────────────────────────── */

console.log('── BLOQUE 1 · Integridad del cuarteto de coaches ──');

check('el cuarteto declara exactamente 4 roles', AI_COACH_COUNT === 4, `encontrados ${AI_COACH_COUNT}`);
check('el roster no contiene roles duplicados', new Set(AI_COACH_ROLES).size === AI_COACH_ROLES.length);
check('doctrina única = VELOCITY_MEDIA_S_CLASS', COACH_DOCTRINE === 'VELOCITY_MEDIA_S_CLASS');

for (const role of AI_COACH_ROLES) {
  const coach = AI_COACHES[role];
  check(`[${role}] contrato presente con la doctrina canónica`, coach.role === role && coach.doctrine === COACH_DOCTRINE);
  check(`[${role}] coreBelief no vacío`, coach.coreBelief.trim().length > 0);
  check(`[${role}] validateOutput es función con veredicto booleano`, typeof coach.validateOutput('ok')?.isCompliant === 'boolean');
  check(`[${role}] foco operativo declarado`, COACH_ROLE_FOCUS[role].trim().length > 0);
}

/* ── BLOQUE 2 · Guardas doctrinales (rechazo + aceptación) ───────────────── */

console.log('── BLOQUE 2 · Guardas doctrinales por rol ──');

const strategicOk =
  `Suelo ${TARIFA_BASE_SOLISTA_EUR} €, techo B2G ${AJUSTE_PREVENTIVO_B2G_EUR} €, ` +
  `split ${SPLIT_LABEL}, exclusividad ${SOLISTA_KM_INCLUIDOS} km.`;
check('STRATEGIC acepta el caso canónico', evaluateCoachCompliance('STRATEGIC_COACH', strategicOk).isCompliant);
check(
  'STRATEGIC rechaza suelo por debajo de 350 €',
  !evaluateCoachCompliance('STRATEGIC_COACH', 'Podemos bajar el suelo a 300 € para cerrar.').isCompliant,
);
check(
  'STRATEGIC rechaza techo B2G por encima de 14.250 €',
  !evaluateCoachCompliance('STRATEGIC_COACH', 'El contrato menor del ayuntamiento puede llegar a 16.000 €.').isCompliant,
);
check(
  'STRATEGIC rechaza split no canónico',
  !evaluateCoachCompliance('STRATEGIC_COACH', 'Aplicamos un split 70/20/10 al artista.').isCompliant,
);
check(
  'STRATEGIC rechaza exclusividad de km inválida',
  !evaluateCoachCompliance('STRATEGIC_COACH', 'La exclusividad incluye 50 km.').isCompliant,
);

check(
  'TACTICAL acepta tarea cerrada con Exit Code 0',
  evaluateCoachCompliance('TACTICAL_COACH', 'El gate está listo: npm run typecheck con Exit Code 0.').isCompliant,
);
check(
  'TACTICAL rechaza declarar completado sin evidencia',
  !evaluateCoachCompliance('TACTICAL_COACH', 'Todo listo, ya está hecho.').isCompliant,
);
check(
  'TACTICAL rechaza gestores distintos de npm',
  !evaluateCoachCompliance('TACTICAL_COACH', 'Instala con pnpm install.').isCompliant,
);

check(
  'INSIGHTS acepta presupuesto de rendimiento dentro de umbral',
  evaluateCoachCompliance('INSIGHTS_COACH', 'CLS 0,02 · LCP 1,8 s · INP 120 ms · conversión 12 % medida en Clarity.')
    .isCompliant,
);
check(
  'INSIGHTS rechaza CLS por encima de 0,05',
  !evaluateCoachCompliance('INSIGHTS_COACH', 'El CLS está en 0,12.').isCompliant,
);
check(
  'INSIGHTS rechaza cifra de embudo sin fuente trazable',
  !evaluateCoachCompliance('INSIGHTS_COACH', 'La conversión sube un 40 %.').isCompliant,
);

check(
  'COMMUNICATION acepta cierre con la Centralita canónica',
  evaluateCoachCompliance('COMMUNICATION_COACH', `Contáctanos por WhatsApp en ${CENTRALITA_EAR_OS} y cerramos.`)
    .isCompliant,
);
check(
  'COMMUNICATION rechaza marcas de terceros (JUR-4)',
  !evaluateCoachCompliance('COMMUNICATION_COACH', 'Publica la reseña en bodas.net.').isCompliant,
);
check(
  'COMMUNICATION rechaza contacto sin la Centralita canónica',
  !evaluateCoachCompliance('COMMUNICATION_COACH', 'Escríbenos por WhatsApp.').isCompliant,
);

check(
  'mensaje vacío es no conforme en los 4 roles',
  AI_COACH_ROLES.every((role) => !evaluateCoachCompliance(role, '   ').isCompliant),
);

/* ── BLOQUE 3 · Disciplina SSOT (cero cifras tecleadas) ──────────────────── */

console.log('── BLOQUE 3 · Disciplina SSOT del módulo ──');

const moduleSource: string = readFileSync(
  path.join(repoRoot, 'src', 'lib', 'agents', 'coachTypes.ts'),
  'utf8',
);

check('el módulo importa del SSOT canónico', moduleSource.includes('ear-os-ssot'));
check('el módulo usa SPLIT_SOBERANO (no ratio tecleado)', moduleSource.includes('SPLIT_SOBERANO'));
check('el módulo usa CENTRALITA_EAR_OS (no teléfono tecleado)', moduleSource.includes('CENTRALITA_EAR_OS'));
check('sin cifras canónicas tecleadas (350,0 / 14250)', !moduleSource.includes('350.0') && !moduleSource.includes('14250'));
check(
  'declara la unión de los 4 roles de la directiva',
  ['STRATEGIC_COACH', 'TACTICAL_COACH', 'INSIGHTS_COACH', 'COMMUNICATION_COACH'].every((r) =>
    moduleSource.includes(`'${r}'`),
  ),
);
check('declara la interfaz AICoachContract', moduleSource.includes('interface AICoachContract'));
check('declara el literal de doctrina', moduleSource.includes("'VELOCITY_MEDIA_S_CLASS'"));

/* ── RESULTADO ───────────────────────────────────────────────────────────── */

console.log('\n────────────────────────────────────────────────────────────');
if (failures.length === 0) {
  console.log(`RESULTADO: ${passed}/${passed} ASERCIONES PASS · EXIT CODE 0`);
  process.exit(0);
} else {
  console.log(`RESULTADO: ${passed} PASS · ${failures.length} FAIL`);
  for (const f of failures) console.log(`  · ${f}`);
  process.exit(1);
}
