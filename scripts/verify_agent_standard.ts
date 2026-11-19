/**
 * VERIFICADOR · ESTÁNDAR MÍNIMO DE AGENTES IA (HubSpot + Agentes por Sector + MKT Hackers)
 * Uso: node ./node_modules/tsx/dist/cli.mjs scripts/verify_agent_standard.ts  (Exit 0 = cumple)
 */
import { readFileSync } from 'node:fs';
import {
  buildAgentMinimumStandardBlock,
  evaluateAgentStandard,
  AGENT_BASE_ROLES,
} from '../src/lib/agents/agent-minimum-standard';
import { DEPOSITO_STRIPE_EUR, CENTRALITA_EAR_OS } from '../src/lib/constants/ear-os-ssot';

const failures: string[] = [];
const check = (name: string, ok: boolean): void => {
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${name}`);
  if (!ok) failures.push(name);
};
const read = (p: string): string => readFileSync(p, 'utf8');

const block = buildAgentMinimumStandardBlock();
const report = evaluateAgentStandard(block);
check('Bloque cumple 9/9 piezas del estándar', report.ok && report.data?.passed === report.data?.total);
check('Marco de 7 agentes base presente', AGENT_BASE_ROLES.length === 7);
check('Depósito y Centralita salen del SSOT', block.includes(String(DEPOSITO_STRIPE_EUR)) && block.includes(CENTRALITA_EAR_OS));
check('Prompt vacío falla de forma controlada', evaluateAgentStandard('').ok === false);
check('Concierge público usa el estándar', read('src/lib/agents/chatGuard.ts').includes('buildAgentMinimumStandardBlock()'));
check('Oráculo usa el estándar', read('src/app/api/oracle/chat/route.ts').includes('buildAgentMinimumStandardBlock()'));
const cc = read('src/app/(admin)/admin/command-center/page.tsx');
check('Command-center sin oráculo simulado', !/handleSimulateConsult|setTimeout\(/.test(cc));
check('Command-center llama al endpoint real', cc.includes("/api/oracle/chat"));
check('Command-center envía lo que el CEO escribe', cc.includes('handleConsult(oracleQuery)'));
const conciergeRoute = read('src/app/api/concierge/chat/route.ts');
check('Endpoint /api/concierge/chat usa el estándar mínimo y add_to_cart', conciergeRoute.includes('buildAgentMinimumStandardBlock()') && conciergeRoute.includes('add_to_cart'));
const conciergeWidget = read('src/components/concierge/SovereignConciergeWidget.tsx');
check('SovereignConciergeWidget inyecta al Carrito Soberano (useCart/addItem)', conciergeWidget.includes('useCart') && conciergeWidget.includes('addItem'));

console.log(failures.length === 0 ? '\nRESULTADO: PASS' : `\nRESULTADO: FAIL (${failures.length})`);
process.exit(failures.length === 0 ? 0 : 1);
