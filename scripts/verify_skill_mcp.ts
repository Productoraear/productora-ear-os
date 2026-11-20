/**
 * Verifica las herramientas MCP `list_ceo_skills` y `execute_ceo_skill` sobre
 * el router JSON-RPC real del MetaCompilador (transporte stdio simulado).
 */
import { routeJsonRpc, listToolsPayload, type McpHostContext } from '../src/lib/compiler/metacompiler-mcp';
import { createLocalRuntime } from '../src/lib/compiler/metacompiler-runtime';

let passed = 0;
let failed = 0;
const check = (label: string, condition: boolean, detail?: string): void => {
  if (condition) {
    passed += 1;
    console.log(`  [PASS] ${label}`);
  } else {
    failed += 1;
    console.log(`  [FAIL] ${label}${detail === undefined ? '' : ` :: ${detail}`}`);
  }
};

const host: McpHostContext = {
  runtime: createLocalRuntime(),
  gates: [],
  now: () => '2026-11-20T12:00:00.000Z',
};

/* ── A. tools/list declara los dos cartuchos ──────────────────────── */
console.log('\nA · tools/list');
const names = listToolsPayload().tools.map((tool) => tool.name as string);
check('declara list_ceo_skills', names.includes('list_ceo_skills'));
check('declara execute_ceo_skill', names.includes('execute_ceo_skill'));
check('las herramientas previas siguen ahí', names.includes('verify_ssot_hash') && names.includes('trigger_coolify_deploy'));

/* ── B. list_ceo_skills ───────────────────────────────────────────── */
console.log('\nB · list_ceo_skills');
const listResponse = await routeJsonRpc(
  {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: { name: 'list_ceo_skills', arguments: {} },
  },
  host,
);
const listPayload = listResponse !== null && 'result' in listResponse
  ? (listResponse.result as { structuredContent: Record<string, unknown> }).structuredContent
  : null;
check('responde con structuredContent', listPayload !== null);
check('cuenta 4 cartuchos', listPayload?.count === 4, String(listPayload?.count));
check('declara 0 tokens', listPayload?.externalTokenCost === 0);
check('probed=true', listPayload?.probed === true);

/* ── C. execute_ceo_skill · camino feliz ──────────────────────────── */
console.log('\nC · execute_ceo_skill (camino feliz)');
const execResponse = await routeJsonRpc(
  {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'execute_ceo_skill',
      arguments: {
        skillName: 'ceo-liquidation-split',
        role: 'CEO',
        payload: {
          eventName: 'Boda Otzarreta',
          eventDate: '2026-12-31',
          artistLabel: 'Eduardo Martínez',
          items: [{ concept: 'Menú 120 pax', amountEur: 9000 }],
        },
      },
    },
  },
  host,
);
const execPayload = execResponse !== null && 'result' in execResponse
  ? (execResponse.result as { structuredContent: Record<string, unknown>; isError: boolean })
  : null;
check('no es error', execPayload?.isError === false);
check('status VERIFICADO', execPayload?.structuredContent.status === 'VERIFICADO');
const artifacts = execPayload?.structuredContent.artifacts as readonly { sha256: string; byteLength: number; filename: string }[] | undefined;
check('un artefacto', artifacts?.length === 1);
check('SHA-256 de 64 hex', /^[a-f0-9]{64}$/.test(artifacts?.[0].sha256 ?? ''));
check('bytes > 0', (artifacts?.[0].byteLength ?? 0) > 0);
check('no transporta binario', (artifacts?.[0] as unknown as Record<string, unknown>).bytes === undefined);

/* ── D. Guards por MCP ────────────────────────────────────────────── */
console.log('\nD · Guards por MCP');
const roleResponse = await routeJsonRpc(
  {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'execute_ceo_skill',
      arguments: { skillName: 'ceo-liquidation-split', role: 'PROVEEDOR', payload: {} },
    },
  },
  host,
);
const rolePayload = roleResponse !== null && 'result' in roleResponse
  ? (roleResponse.result as { isError: boolean; structuredContent: Record<string, unknown> })
  : null;
check('rol ajeno → isError', rolePayload?.isError === true);
check('status ROLE_FORBIDDEN', rolePayload?.structuredContent.status === 'ROLE_FORBIDDEN');

const overResponse = await routeJsonRpc(
  {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'execute_ceo_skill',
      arguments: {
        skillName: 'ceo-lcsp-contract',
        role: 'CEO',
        payload: {
          counterparty: 'Ayuntamiento',
          mode: 'B2G',
          grossEur: 20000,
          eventDate: '2026-09-15',
          venue: 'Plaza',
          pax: 100,
          serviceSummary: 'Actuación musical para festejos',
        },
      },
    },
  },
  host,
);
const overPayload = overResponse !== null && 'result' in overResponse
  ? (overResponse.result as { isError: boolean; structuredContent: Record<string, unknown> })
  : null;
check('techo LCSP por MCP → error', overPayload?.isError === true);
check('status ABORTED_BY_POLICY', overPayload?.structuredContent.status === 'ABORTED_BY_POLICY');

const invalidResponse = await routeJsonRpc(
  { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'execute_ceo_skill', arguments: { skillName: 'x' } } },
  host,
);
// MCP devuelve los errores de herramienta dentro de `result.isError`, no como
// error JSON-RPC: es lo que exige la especificación (error de transporte ≠ error
// de herramienta). La aserción comprueba el camino real, no el deseado.
const invalidPayload = invalidResponse !== null && 'result' in invalidResponse
  ? (invalidResponse.result as { isError: boolean; structuredContent: Record<string, unknown> })
  : null;
check('params inválidos → isError', invalidPayload?.isError === true);
check('status INVALID_PARAMS', invalidPayload?.structuredContent.status === 'INVALID_PARAMS');

console.log(`\n=== ${passed} PASS · ${failed} FAIL ===`);
if (failed > 0) process.exit(1);
