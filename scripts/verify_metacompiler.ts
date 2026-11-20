/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — CERTIFICACIÓN DEL METACOMPILADOR (ARNÉS PROPIO, ZERO-TOKEN)
 * ════════════════════════════════════════════════════════════════════════════
 * `npm run verify:metacompiler` → Exit Code 0 sólo si TODAS las aserciones
 * pasan. No consulta ningún LLM: importa el MISMO motor que sirve la UI y lo
 * somete a pruebas de contrato, incluidas las FALSABLES:
 *
 *   A) FSM pura        — tabla de transición total, 7 estados, terminales.
 *   B) Paridad SSOT    — 19 constantes contra `ear-os-ssot.ts` + hash centinela.
 *   C) Determinismo    — misma spec ⇒ mismo artefacto byte a byte y mismo sello.
 *   D) AST             — el artefacto emitido pasa el parser REAL de TypeScript
 *                        y coincide con el juicio de `auditArtifactAst`.
 *   E) Falsabilidad    — spec con fase fuera de orden, nodo duplicado, hash
 *                        alterado y runtime mudo ⇒ ABORT con motivo correcto.
 *   F) Idempotencia    — N sembrados ⇒ 1 nodo (INV-08).
 *   G) MCP JSON-RPC    — initialize / tools/list / tools/call / error codes.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import fs from 'node:fs';
import ts from 'typescript';
import {
  META_FSM_STATES,
  META_TRANSITIONS,
  nextState,
  isTerminalState,
  resolveAbortReason,
  type MetaFsmPhase,
} from '@/lib/compiler/metacompiler-fsm';
import {
  DESIGN_CONSTITUTION,
  MetaCompilerSpecSchema,
  buildDefaultSpec,
  verifySpecDesignTime,
  type MetaCompilerSpec,
} from '@/lib/compiler/metacompiler-spec';
import { emitArtifact, auditArtifactAst, ARTIFACT_HEADER_MARKER } from '@/lib/compiler/metacompiler-emitter';
import { compileMetaSpec } from '@/lib/compiler/metacompiler-engine';
import { sha256OfText, byteLengthUtf8 } from '@/lib/compiler/metacompiler-hash';
import {
  createLocalRuntime,
  parseSvGates,
  SV_GATES_SCRIPT,
  type MetaCompilerRuntime,
} from '@/lib/compiler/metacompiler-runtime';
import { MCP_TOOLS, handleJsonRpcLine, callTool, type McpHostContext } from '@/lib/compiler/metacompiler-mcp';
import { verifySsotIntegrity, KNOWN_GOOD_SSOT_HASH } from '@/lib/security/ssotIntegrityGuard';
import {
  applyMutations,
  collectSyntaxErrors,
  collectTranspileErrors,
  CONNECTOR_DOOR_MAP,
  SAFE_NODE_ID,
  type AstMutation,
} from '@/lib/compiler/ast-mutator';
import {
  buildDefaultConnectorState,
  evaluateConnectorMatrix,
  toggleConnector,
  normaliseConnectorState,
  DOOR_HREFS,
  type ConnectorState,
} from '@/lib/compiler/connector-matrix';
import { CONNECTORS, ECOSYSTEM_SECTORS } from '@/lib/catalog/ecosystem-ontology';

const FIXED_NOW = '2026-11-20T00:00:00.000Z';

/** Ruta del fichero REAL que el mutador AST gobierna. */
const ONTOLOGY_FILE = 'src/lib/catalog/ecosystem-ontology.ts';

const BLOCKS = [
  'A_FSM',
  'B_PARITY',
  'C_DETERMINISM',
  'D_AST',
  'E_FALSABILITY',
  'F_IDEMPOTENCE',
  'G_MCP',
  'H_MUTATOR',
  'I_MATRIX',
  'J_MCP_HTTP',
  'K_LOYALTY',
] as const;
type Block = (typeof BLOCKS)[number];

interface Check {
  readonly block: Block;
  readonly id: string;
  readonly pass: boolean;
  readonly detail: string;
}

const checks: Check[] = [];

function check(block: Block, id: string, pass: boolean, detail: string): void {
  checks.push({ block, id, pass, detail });
}

function assertEqual(block: Block, id: string, actual: unknown, expected: unknown): void {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  check(block, id, pass, pass ? `= ${JSON.stringify(actual)}` : `esperado ${JSON.stringify(expected)} · obtenido ${JSON.stringify(actual)}`);
}

function clonSpec(mutate: (spec: MetaCompilerSpec) => void): unknown {
  const copy = JSON.parse(JSON.stringify(buildDefaultSpec())) as MetaCompilerSpec;
  mutate(copy);
  return copy;
}

function hostOf(runtime: MetaCompilerRuntime): McpHostContext {
  const gatesSource = readFileSync(path.join(process.cwd(), SV_GATES_SCRIPT), 'utf8');
  return {
    runtime,
    gates: parseSvGates(gatesSource),
    now: () => FIXED_NOW,
  };
}

async function main(): Promise<void> {
  // ── A · FSM determinista ────────────────────────────────────────────────
  assertEqual('A_FSM', 'A1_estados', META_FSM_STATES.length, 7);
  assertEqual('A_FSM', 'A2_idle_pass', nextState('IDLE', 'PASS'), 'HASH_VERIF');
  assertEqual('A_FSM', 'A3_idle_fail_ilegal', nextState('IDLE', 'FAIL'), null);
  const phases: MetaFsmPhase[] = ['HASH_VERIF', 'TYPE_CHECK', 'LINT_AST', 'GATE_EVAL'];
  for (const phase of phases) {
    assertEqual('A_FSM', `A4_${phase}_pass`, nextState(phase, 'PASS'), META_TRANSITIONS[phase]);
    assertEqual('A_FSM', `A5_${phase}_fail`, nextState(phase, 'FAIL'), 'ABORT');
    assertEqual('A_FSM', `A6_${phase}_sinevidencia`, nextState(phase, 'SIN_EVIDENCIA'), 'ABORT');
  }
  assertEqual('A_FSM', 'A7_terminales', [isTerminalState('SEALED'), isTerminalState('ABORT'), isTerminalState('IDLE')], [true, true, false]);
  assertEqual('A_FSM', 'A8_aborto_hash', resolveAbortReason('HASH_VERIF', 'FAIL', true), 'HASH_MISMATCH');
  assertEqual('A_FSM', 'A9_aborto_invariante', resolveAbortReason('HASH_VERIF', 'FAIL', false), 'INVARIANT_VIOLATION');
  assertEqual('A_FSM', 'A10_aborto_sin_evidencia', resolveAbortReason('GATE_EVAL', 'SIN_EVIDENCIA'), 'NO_EVIDENCE');

  // ── B · Paridad con Zona Cero ───────────────────────────────────────────
  const design = verifySpecDesignTime(buildDefaultSpec());
  assertEqual('B_PARITY', 'B1_veredicto', design.verdict, 'PASS');
  assertEqual('B_PARITY', 'B2_constantes', design.parityChecked, DESIGN_CONSTITUTION.length + 2);
  assertEqual('B_PARITY', 'B3_precond', design.precondition, 'PASS');
  assertEqual('B_PARITY', 'B4_postcond', design.postcondition, 'PASS');
  assertEqual('B_PARITY', 'B5_ssot_parity', design.ssotParity, 'PASS');
  assertEqual('B_PARITY', 'B6_hallazgos', design.findings.length, 0);
  const ssot = verifySsotIntegrity();
  assertEqual('B_PARITY', 'B7_hash_zona_cero', ssot.computedHash, KNOWN_GOOD_SSOT_HASH);
  check('B_PARITY', 'B8_hash_longitud', ssot.computedHash.length === 64, `longitud=${ssot.computedHash.length}`);

  // ── C · Determinismo ────────────────────────────────────────────────────
  const spec = buildDefaultSpec();
  const first = emitArtifact(spec);
  const second = emitArtifact(spec);
  assertEqual('C_DETERMINISM', 'C1_artefacto_identico', first.artifact === second.artifact, true);
  check('C_DETERMINISM', 'C2_sha256_artefacto', /^[a-f0-9]{64}$/.test(sha256OfText(first.artifact)), `sha256=${sha256OfText(first.artifact)}`);
  assertEqual('C_DETERMINISM', 'C3_bytes_no_negativos', first.bytes > 0 && first.bytes === second.bytes, true);
  check('C_DETERMINISM', 'C4_sin_entropia', !/Date\.now|Math\.random/.test(first.artifact), 'artefacto sin fuente de entropia');
  check(
    'C_DETERMINISM',
    'C5_bytes_y_caracteres',
    byteLengthUtf8(first.artifact) >= first.artifact.length,
    `bytes=${byteLengthUtf8(first.artifact)} chars=${first.artifact.length}`,
  );

  const local = createLocalRuntime();
  const runA = await compileMetaSpec(spec, { now: FIXED_NOW, runtime: local });
  const runB = await compileMetaSpec(spec, { now: FIXED_NOW, runtime: createLocalRuntime() });
  assertEqual('C_DETERMINISM', 'C6_estado_sealed', runA.state, 'SEALED');
  assertEqual('C_DETERMINISM', 'C7_sello_identico', runA.sealHash, runB.sealHash);
  assertEqual('C_DETERMINISM', 'C8_traza_estados', runA.trace.map((line) => line.to), ['HASH_VERIF', 'TYPE_CHECK', 'LINT_AST', 'GATE_EVAL', 'SEALED']);
  assertEqual('C_DETERMINISM', 'C9_evidencia_completa', runA.stats.evidenceLines, 4);
  assertEqual('C_DETERMINISM', 'C10_fases_pass', runA.stats.phasesPassed, runA.stats.phasesRun);

  // ── D · AST: parser REAL de TypeScript vs. compilador estático propio ───
  const sourceFile = ts.createSourceFile('meta-artifact.ts', first.artifact, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
  const tsSyntax = (sourceFile as unknown as { parseDiagnostics?: readonly ts.Diagnostic[] }).parseDiagnostics ?? [];
  check('D_AST', 'D1_ts_parser_sin_errores', tsSyntax.length === 0, `diagnosticos_ts=${tsSyntax.length}`);
  const own = auditArtifactAst(first.artifact, spec);
  check('D_AST', 'D2_auditor_propio_valido', own.valid, `diagnosticos=${own.diagnostics.length}`);
  assertEqual('D_AST', 'D3_paridad_de_motores', own.valid, tsSyntax.length === 0);
  assertEqual('D_AST', 'D4_exports', own.declarations.slice().sort(), ['META_ENTITLEMENTS', 'META_GATES', 'META_NODES', 'META_SPLIT', 'MetaNode', 'MetaNodeId', 'splitParityHolds'].sort());
  check('D_AST', 'D5_cabecera', first.artifact.includes(ARTIFACT_HEADER_MARKER), 'marcador de cabecera presente');
  check('D_AST', 'D6_fianza_ssot', first.artifact.includes('fianzaEur: 100.00'), 'fianza 100,00 EUR interpolada del SSOT');
  check('D_AST', 'D7_techo_b2g', first.artifact.includes('techoB2GEur: 14250.00'), 'techo B2G 14.250,00 EUR interpolado del SSOT');
  check('D_AST', 'D8_cero_any', !/:\s*any\b/.test(first.artifact), '0 any explicito');

  // Falsabilidad del auditor: un literal prohibido inyectado debe ser rechazado.
  const corrupted = first.artifact.replace(
    'export const META_GATES',
    'export const LEAKED_VALUE: any = 1;\nexport const META_GATES',
  );
  const corruptedAudit = auditArtifactAst(corrupted, spec);
  check(
    'D_AST',
    'D9_detecta_any',
    corruptedAudit.valid === false && corruptedAudit.forbidden.includes('EXPLICIT_ANY'),
    `forbidden=${corruptedAudit.forbidden.join(',') || 'ninguno'}`,
  );
  // Y una declaración obligatoria eliminada también debe romper la auditoría.
  const truncated = auditArtifactAst(first.artifact.replace('export const META_GATES', 'export const NOT_GATES'), spec);
  check(
    'D_AST',
    'D10_detecta_declaracion_ausente',
    truncated.valid === false && truncated.diagnostics.some((diag) => diag.startsWith('MISSING_DECLARATION: META_GATES')),
    truncated.diagnostics.join(';') || 'sin diagnosticos',
  );

  // ── E · Falsabilidad del juicio de diseño ──────────────────────────────
  const badOrder = MetaCompilerSpecSchema.safeParse(clonSpec((s) => { s.phases = ['TYPE_CHECK', 'HASH_VERIF']; }));
  const badOrderDesign = badOrder.success ? verifySpecDesignTime(badOrder.data) : null;
  check('E_FALSABILITY', 'E1_fase_fuera_de_orden', badOrderDesign !== null && badOrderDesign.verdict === 'FAIL', `${badOrderDesign?.findings.map((f) => f.code).join(',')}`);
  const duplicated = verifySpecDesignTime({ ...spec, ontology: { nodes: [spec.ontology.nodes[0], spec.ontology.nodes[0]] } });
  check('E_FALSABILITY', 'E2_nodo_duplicado', duplicated.verdict === 'FAIL' && duplicated.findings.some((f) => f.code === 'DUPLICATE_NODE'), 'DUPLICATE_NODE');
  const noContract = verifySpecDesignTime({ ...spec, artifact: { blocks: ['HEADER'], includeGates: false } });
  check('E_FALSABILITY', 'E3_artefacto_sin_contrato', noContract.verdict === 'FAIL' && noContract.postcondition === 'FAIL', 'POSTCOND detectado');
  const badUrl = verifySpecDesignTime({ ...spec, promiseUrl: '/admin/compiler?x=1' });
  check('E_FALSABILITY', 'E4_promesa_no_canonica', badUrl.verdict === 'FAIL', 'PROMISE_URL_NOT_CANONICAL');
  const zodRejects = MetaCompilerSpecSchema.safeParse({ specId: 'X', name: 3 });
  check('E_FALSABILITY', 'E5_zod_estricto', zodRejects.success === false, 'rechaza spec mal formada');
  const traversal = MetaCompilerSpecSchema.safeParse(clonSpec((s) => { s.ontology.nodes[0].id = '../etc/passwd'; }));
  check('E_FALSABILITY', 'E6_path_traversal', traversal.success === false, 'rechaza ../etc/passwd');

  // Un artefacto con runtime mudo debe abortar en GATE_EVAL sin llegar a SEALED.
  const muteRuntime: MetaCompilerRuntime = {
    kind: 'LOCAL',
    platformSnapshot: async () => { throw new Error('DOWN'); },
    seedOntology: async () => { throw new Error('DOWN'); },
    probeGates: async () => { throw new Error('DOWN'); },
  };
  const muteRun = await compileMetaSpec(spec, { now: FIXED_NOW, runtime: muteRuntime });
  assertEqual('E_FALSABILITY', 'E7_runtime_mudo_aborta', muteRun.state, 'ABORT');
  assertEqual('E_FALSABILITY', 'E8_runtime_mudo_motivo', muteRun.abortReason, 'NO_EVIDENCE');
  const invalidRun = await compileMetaSpec({ specId: 'x' }, { now: FIXED_NOW, runtime: createLocalRuntime() });
  assertEqual('E_FALSABILITY', 'E9_spec_invalida_aborta', [invalidRun.state, invalidRun.abortReason], ['ABORT', 'ILLEGAL_TRANSITION']);

  // Un runtime sin capacidad de sembrado no puede firmar un SEALED con ontología.
  const noSeedRuntime: MetaCompilerRuntime = {
    kind: 'LOCAL',
    platformSnapshot: local.platformSnapshot,
    seedOntology: async () => { throw new Error('NO_SEED'); },
    probeGates: local.probeGates,
  };
  const noSeedRun = await compileMetaSpec(spec, { now: FIXED_NOW, runtime: noSeedRuntime, seedOntology: true });
  assertEqual('E_FALSABILITY', 'E10_sembrado_no_disponible', [noSeedRun.state, noSeedRun.abortReason], ['ABORT', 'NO_EVIDENCE']);

  // ── F · Idempotencia (INV-08) ──────────────────────────────────────────
  const seedRuntime = createLocalRuntime();
  const seedNodes = spec.ontology.nodes;
  const seed1 = await seedRuntime.seedOntology(seedNodes);
  const seed2 = await seedRuntime.seedOntology(seedNodes);
  const seed3 = await seedRuntime.seedOntology(seedNodes);
  assertEqual('F_IDEMPOTENCE', 'F1_primer_sembrado', seed1.inserted, seedNodes.length);
  assertEqual('F_IDEMPOTENCE', 'F2_segundo_sembrado', seed2.inserted, 0);
  assertEqual('F_IDEMPOTENCE', 'F3_tercer_sembrado', seed3.inserted, 0);
  assertEqual('F_IDEMPOTENCE', 'F4_total_estable', [seed1.total, seed2.total, seed3.total], [seedNodes.length, seedNodes.length, seedNodes.length]);
  const idempotentRun = await compileMetaSpec(spec, { now: FIXED_NOW, runtime: createLocalRuntime(), seedOntology: true });
  assertEqual('F_IDEMPOTENCE', 'F5_run_con_sembrado_sealed', idempotentRun.state, 'SEALED');
  assertEqual('F_IDEMPOTENCE', 'F6_sello_estable_con_sembrado', idempotentRun.sealHash, runA.sealHash);

  // ── G · MCP JSON-RPC ───────────────────────────────────────────────────
  const host = hostOf(createLocalRuntime());
  // El contrato MCP declara 10 herramientas: 6 originales + las 4 que exige la
  // directiva del Centro de Mando (audit_ssot_integrity, execute_isolated_gates,
  // mutate_ontology_node, trigger_coolify_deploy).
  check('G_MCP', 'G1_herramientas', MCP_TOOLS.length === 10, `total=${MCP_TOOLS.length}`);
  const runGatesTool = MCP_TOOLS.find((tool) => tool.name === 'run_sv_gates');
  check(
    'G_MCP',
    'G2_run_gates_deshabilitado',
    runGatesTool !== undefined && runGatesTool.description.includes('EXECUTION_DISABLED'),
    'run_sv_gates declara EXECUTION_DISABLED',
  );
  const init = await handleJsonRpcLine(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }), host);
  const initPayload = init === null ? {} : (JSON.parse(init) as { result?: { serverInfo?: { name?: string } } });
  assertEqual('G_MCP', 'G3_initialize', initPayload.result?.serverInfo?.name, 'ear-os-metacompiler');
  const list = await handleJsonRpcLine(JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list' }), host);
  const listPayload = list === null ? { result: { tools: [] } } : (JSON.parse(list) as { result: { tools: unknown[] } });
  assertEqual('G_MCP', 'G4_tools_list', listPayload.result.tools.length, MCP_TOOLS.length);
  const notification = await handleJsonRpcLine(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }), host);
  assertEqual('G_MCP', 'G5_notificacion_sin_respuesta', notification, null);
  const badJson = await handleJsonRpcLine('{no-json', host);
  const badJsonCode = badJson === null ? 0 : (JSON.parse(badJson) as { error: { code: number } }).error.code;
  assertEqual('G_MCP', 'G6_parse_error', badJsonCode, -32700);
  const badMethod = await handleJsonRpcLine(JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'x/y' }), host);
  const badMethodCode = badMethod === null ? 0 : (JSON.parse(badMethod) as { error: { code: number } }).error.code;
  assertEqual('G_MCP', 'G7_method_not_found', badMethodCode, -32601);
  const ssotCall = await handleJsonRpcLine(JSON.stringify({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'verify_ssot_hash', arguments: {} } }), host);
  const ssotStructured = ssotCall === null ? {} : (JSON.parse(ssotCall) as { result: { structuredContent: { status: string; computedHash: string } } }).result.structuredContent;
  assertEqual('G_MCP', 'G8_verify_ssot_hash', [ssotStructured.status, ssotStructured.computedHash === KNOWN_GOOD_SSOT_HASH], ['VERIFICADO', true]);
  const refused = await handleJsonRpcLine(JSON.stringify({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'run_sv_gates', arguments: {} } }), host);
  const refusedStatus = refused === null ? {} : (JSON.parse(refused) as { result: { structuredContent: { status: string } } }).result.structuredContent;
  assertEqual('G_MCP', 'G9_run_gates_rechazado', refusedStatus.status, 'EXECUTION_DISABLED');
  const injected = await handleJsonRpcLine(JSON.stringify({ jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'inject_ontology_node', arguments: { id: 'nodo-verificador', label: 'Nodo verificador', kind: 'ENGINE' } } }), host);
  const injectedStatus = injected === null ? {} : (JSON.parse(injected) as { result: { structuredContent: { status: string } } }).result.structuredContent;
  assertEqual('G_MCP', 'G10_inject_nodo', injectedStatus.status, 'INSERTADO');
  const gatesCall = await handleJsonRpcLine(JSON.stringify({ jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'list_sv_gates', arguments: {} } }), host);
  const gatesStructured = gatesCall === null ? {} : (JSON.parse(gatesCall) as { result: { structuredContent: { total: number; executed: boolean } } }).result.structuredContent;
  assertEqual('G_MCP', 'G11_arnes_17', [gatesStructured.total, gatesStructured.executed], [17, false]);
  const invalidTool = await handleJsonRpcLine(JSON.stringify({ jsonrpc: '2.0', id: 8, method: 'tools/call', params: { name: 'inject_ontology_node', arguments: { id: '../x', label: 'x', kind: 'ENGINE' } } }), host);
  const invalidStatus = invalidTool === null ? {} : (JSON.parse(invalidTool) as { result: { structuredContent: { status: string } } }).result.structuredContent;
  assertEqual('G_MCP', 'G12_params_invalidos', invalidStatus.status, 'INVALID_PARAMS');

  // ── H · MUTADOR AST DETERMINISTA (sobre el fichero REAL) ────────────────
  // Se muta en MEMORIA y se compara el texto resultante: el verificador no
  // escribe jamás en el árbol de trabajo (CHG-4: nada de diffs colaterales).
  const ontologySource = readFileSync(path.join(process.cwd(), ONTOLOGY_FILE), 'utf8');
  assertEqual('H_MUTATOR', 'H1_fuente_parsea', collectSyntaxErrors(ontologySource).length, 0);
  const sourceMutated = applyMutations(ontologySource, [
    { kind: 'ONTOLOGY_NODE_ADD', target: 'VERIFY-CATEGORY', label: 'Categoria de verificacion', href: '/verificacion', sector: 'HOSTELERIA' },
  ]);
  assertEqual('H_MUTATOR', 'H2_aplicada', sourceMutated.applied[0]?.status, 'APPLIED');
  assertEqual('H_MUTATOR', 'H3_ok', sourceMutated.ok, true);
  assertEqual('H_MUTATOR', 'H4_sintaxis_parser', sourceMutated.syntaxErrors.length, 0);
  assertEqual('H_MUTATOR', 'H5_sintaxis_transpiler', collectTranspileErrors(sourceMutated.mutated).length, 0);
  assertEqual('H_MUTATOR', 'H6_hash_cambia', sourceMutated.sourceSha256 !== sourceMutated.mutatedSha256, true);
  const repeat = applyMutations(ontologySource, [
    { kind: 'ONTOLOGY_NODE_ADD', target: 'VERIFY-CATEGORY', label: 'Categoria de verificacion', href: '/verificacion', sector: 'HOSTELERIA' },
  ]);
  assertEqual('H_MUTATOR', 'H7_determinismo', repeat.mutatedSha256, sourceMutated.mutatedSha256);
  const rerun = applyMutations(sourceMutated.mutated, [
    { kind: 'ONTOLOGY_NODE_ADD', target: 'VERIFY-CATEGORY', label: 'Categoria de verificacion', href: '/verificacion', sector: 'HOSTELERIA' },
  ]);
  assertEqual('H_MUTATOR', 'H8_idempotencia', rerun.mutated === sourceMutated.mutated, true);
  assertEqual('H_MUTATOR', 'H9_idempotencia_noop', rerun.applied[0]?.status, 'NOOP');
  const astTraversal = applyMutations(ontologySource, [
    { kind: 'ONTOLOGY_NODE_ADD', target: '../../etc/passwd', label: 'x', href: '/x', sector: 'HOSTELERIA' },
  ]);
  assertEqual('H_MUTATOR', 'H10_rechazo_traversal', astTraversal.rejected[0]?.code, 'INVALID_ID');
  const escape = applyMutations(ontologySource, [
    { kind: 'ONTOLOGY_NODE_ADD', target: `c::import('child_process')`, label: 'x', href: '/x', sector: 'HOSTELERIA' },
  ]);
  assertEqual('H_MUTATOR', 'H11_rechazo_simbolos', escape.rejected[0]?.code, 'INVALID_ID');
  const unknownSector = applyMutations(ontologySource, [
    { kind: 'ONTOLOGY_NODE_ADD', target: 'VERIFY-ORPHAN', label: 'x', href: '/x', sector: 'INEXISTENTE' },
  ]);
  assertEqual('H_MUTATOR', 'H12_rechazo_sector', unknownSector.rejected[0]?.code, 'TARGET_NOT_FOUND');
  const broken = applyMutations('export const CONNECTORS = Object.freeze([ ', []);
  check('H_MUTATOR', 'H13_parse_error', broken.rejected.every((entry) => entry.code === 'PARSE_ERROR'), `rechazos=${broken.rejected.length}`);

  // ── I · MATRIZ DE 5 CONECTORES Y ENRUTADOR DE 3 PUERTAS ─────────────────
  const defaultState = buildDefaultConnectorState(FIXED_NOW);
  const baseMatrix = evaluateConnectorMatrix(defaultState, FIXED_NOW);
  assertEqual('I_MATRIX', 'I1_cinco_conectores', baseMatrix.totalCount, 5);
  assertEqual('I_MATRIX', 'I2_todos_activos', baseMatrix.activeCount, 5);
  assertEqual('I_MATRIX', 'I3_paridad', baseMatrix.parity, 'PASS');
  assertEqual('I_MATRIX', 'I4_tres_puertas', baseMatrix.doors.length, 3);
  assertEqual('I_MATRIX', 'I5_puertas_hrefs', baseMatrix.doors.map((door) => door.href), ['/gobiernos', '/celebraciones', '/profesionales']);
  assertEqual('I_MATRIX', 'I6_sin_huerfanas', baseMatrix.orphanDoors.length, 0);
  assertEqual('I_MATRIX', 'I7_declarados', baseMatrix.rows.map((row) => row.id).join(','), CONNECTORS.map((connector) => connector.id).join(','));
  assertEqual(
    'I_MATRIX',
    'I8_conectores_por_puerta',
    baseMatrix.doors.reduce((sum, door) => sum + door.connectors.length, 0),
    5,
  );
  const orphanAttempt = toggleConnector(defaultState, { id: 'MECENAS', active: false }, FIXED_NOW, 'verify');
  assertEqual('I_MATRIX', 'I9_bloquea_huerfana', orphanAttempt.code, 'DOOR_ORPHANED');
  assertEqual('I_MATRIX', 'I10_estado_intacto', orphanAttempt.state.active.MECENAS, true);
  const applied = toggleConnector(defaultState, { id: 'PROVEEDOR', active: false }, FIXED_NOW, 'verify');
  assertEqual('I_MATRIX', 'I11_conmuta', applied.code, 'APPLIED');
  assertEqual('I_MATRIX', 'I12_cuatro_activos', applied.matrix.activeCount, 4);
  const noop = toggleConnector(defaultState, { id: 'CLIENTE', active: true }, FIXED_NOW, 'verify');
  assertEqual('I_MATRIX', 'I13_noop', noop.code, 'NOOP');
  assertEqual('I_MATRIX', 'I14_puerta_canonica', CONNECTOR_DOOR_MAP.MECENAS === 'gobiernos', true);
  assertEqual('I_MATRIX', 'I15_door_hrefs', DOOR_HREFS.gobiernos, '/gobiernos');
  // La invariante se prueba al revés: NINGUNA secuencia de conmutaciones puede
  // dejar una puerta huérfana, porque cada intento que la rompería se rechaza y
  // devuelve el estado intacto. Se recorren los 5 conectores y se exige que toda
  // conmutación ACEPTADA mantenga `orphanDoors === []`.
  //
  // Reparto real del catálogo (medido, no supuesto):
  //   /gobiernos      ← MECENAS (único)
  //   /celebraciones  ← CLIENTE (único)
  //   /profesionales  ← PROVEEDOR, AFILIADO, SOCIO_ESTRATEGICO
  // ⇒ son IRRENUNCIABLES 3 conectores: el último de cada puerta.
  let integrityState = defaultState;
  const rejectedIds: string[] = [];
  for (const connector of CONNECTORS) {
    const attempt = toggleConnector(integrityState, { id: connector.id, active: false }, FIXED_NOW, 'verify');
    if (!attempt.ok) {
      rejectedIds.push(connector.id);
      assertEqual('I_MATRIX', `I16_intacto_${connector.id}`, attempt.state.active[connector.id], true);
      continue;
    }
    integrityState = attempt.state;
    assertEqual('I_MATRIX', `I16_sin_huerfanas_${connector.id}`, attempt.matrix.orphanDoors.length, 0);
  }
  // Tres puertas ⇒ exactamente tres conectores irrenunciables, y son éstos.
  assertEqual('I_MATRIX', 'I16_irrenunciables', rejectedIds.join(','), 'CLIENTE,MECENAS,SOCIO_ESTRATEGICO');
  const sectorsBound = ECOSYSTEM_SECTORS.every((sector) =>
    baseMatrix.doors.some((door) => door.door === sector.primaryDoor),
  );
  assertEqual('I_MATRIX', 'I17_sectores_en_puertas', sectorsBound, true);
  const forged = normaliseConnectorState({ version: 99, active: {}, updatedAt: 'x', updatedBy: '' }, FIXED_NOW);
  assertEqual('I_MATRIX', 'I18_estado_forjado_normalizado', forged.version, 1);

  // ── J · MCP HTTP: HERRAMIENTAS NUEVAS Y DEFAULT-DENY ────────────────────
  const toolNames = MCP_TOOLS.map((tool) => tool.name);
  assertEqual('J_MCP_HTTP', 'J1_audit_ssot', toolNames.includes('audit_ssot_integrity'), true);
  assertEqual('J_MCP_HTTP', 'J2_execute_gates', toolNames.includes('execute_isolated_gates'), true);
  assertEqual('J_MCP_HTTP', 'J3_mutate_node', toolNames.includes('mutate_ontology_node'), true);
  assertEqual('J_MCP_HTTP', 'J4_trigger_deploy', toolNames.includes('trigger_coolify_deploy'), true);

  const auditCall = await callTool('audit_ssot_integrity', {}, hostOf(createLocalRuntime()));
  assertEqual('J_MCP_HTTP', 'J5_audit_verificado', auditCall.payload.status, 'VERIFICADO');

  const gatesCallDirect = await callTool('execute_isolated_gates', {}, hostOf(createLocalRuntime()));
  assertEqual('J_MCP_HTTP', 'J6_gates_deshabilitado', gatesCallDirect.payload.status, 'EXECUTION_DISABLED');

  // Host SIN capacidad de mutación (como el transporte stdio): debe declararlo.
  const muteMutation = await callTool('mutate_ontology_node', {
    id: 'VERIFY-NODE', label: 'nodo', href: '/x', sector: 'HOSTELERIA',
  }, hostOf(createLocalRuntime()));
  assertEqual('J_MCP_HTTP', 'J7_mutacion_sin_evidencia', muteMutation.payload.status, 'SIN_EVIDENCIA');

  // Host CON capacidad de mutación en dryRun: aplica y NO escribe.
  const dryHost: McpHostContext = {
    ...hostOf(createLocalRuntime()),
    mutation: {
      file: ONTOLOGY_FILE,
      async mutate() {
        return {
          ok: true, changed: true, wrote: false,
          sourceSha256: 'a'.repeat(64), mutatedSha256: 'b'.repeat(64),
          applied: ['APPLIED:VERIFY-NODE'], rejected: [], syntaxErrors: [],
        };
      },
    },
  };
  const dryCall = await callTool('mutate_ontology_node', {
    id: 'VERIFY-NODE', label: 'nodo', href: '/x', sector: 'HOSTELERIA', dryRun: true,
  }, dryHost);
  assertEqual('J_MCP_HTTP', 'J8_dry_run_no_escribe', [dryCall.ok, dryCall.payload.wrote], [true, false]);

  // Traversal por la puerta MCP: Zod lo rechaza ANTES de tocar el AST.
  const traversalCall = await callTool('mutate_ontology_node', {
    id: '../etc/passwd', label: 'x', href: '/x', sector: 'HOSTELERIA',
  }, dryHost);
  assertEqual('J_MCP_HTTP', 'J9_traversal_rechazado', traversalCall.payload.status, 'INVALID_PARAMS');

  // Deploy sin webhook configurado: nunca simula.
  const noDeploy = await callTool('trigger_coolify_deploy', {
    confirm: true, sealHash: 'c'.repeat(64),
  }, hostOf(createLocalRuntime()));
  assertEqual('J_MCP_HTTP', 'J10_deploy_no_configurado', noDeploy.payload.status, 'DEPLOY_NOT_CONFIGURED');

  // Deploy con webhook pero con sello inventado: SEAL_MISMATCH y sin disparo.
  const forgedSealHost: McpHostContext = {
    ...hostOf(createLocalRuntime()),
    deploy: { configured: true, isSealed: () => false, trigger: async () => ({ dispatched: true, detail: 'no debe ejecutarse' }) },
  };
  const forgedDeploy = await callTool('trigger_coolify_deploy', {
    confirm: true, sealHash: 'd'.repeat(64),
  }, forgedSealHost);
  assertEqual('J_MCP_HTTP', 'J11_sello_invalido', forgedDeploy.payload.status, 'SEAL_MISMATCH');

  const missingConfirm = await callTool('trigger_coolify_deploy', { sealHash: 'e'.repeat(64) }, forgedSealHost);
  assertEqual('J_MCP_HTTP', 'J12_confirmacion_obligatoria', missingConfirm.payload.status, 'INVALID_PARAMS');

  // ── K · LEALTAD: ZONA CERO INTACTA Y CERO ENTROPÍA EN LOS MÓDULOS NUEVOS ─
  const ssotAfter = verifySsotIntegrity();
  assertEqual('K_LOYALTY', 'K1_ssot_intacto_tras_pruebas', ssotAfter.computedHash, KNOWN_GOOD_SSOT_HASH);
  assertEqual('K_LOYALTY', 'K2_ontologia_sin_mutar_en_disco', readFileSync(path.join(process.cwd(), ONTOLOGY_FILE), 'utf8'), ontologySource);
  for (const file of ['src/lib/compiler/ast-mutator.ts', 'src/lib/compiler/connector-matrix.ts', 'src/lib/compiler/metacompiler-server-hosts.ts']) {
    const text = readFileSync(path.join(process.cwd(), file), 'utf8');
    check('K_LOYALTY', `K3_sin_entropia_${path.basename(file)}`, !/Date\.now\(\)|Math\.random\(\)/.test(text), `${file} sin Date.now()/Math.random()`);
  }
  check('K_LOYALTY', 'K4_id_gramatica', SAFE_NODE_ID.test('BODA-REAL') && !SAFE_NODE_ID.test('boda-real'), 'MAYUSCULAS y guiones');
  const mutationDestructive = applyMutations(ontologySource, [], ONTOLOGY_FILE);
  assertEqual('K_LOYALTY', 'K5_sin_mutaciones_sin_cambio', mutationDestructive.sourceSha256, mutationDestructive.mutatedSha256);

  report();


}

/** Informe final + Exit Code. Un solo fallo ⇒ Exit 1 (nada de medias tintas). */
function report(): void {
  const failed = checks.filter((entry) => !entry.pass);
  console.log('── METACOMPILER CERTIFICATION ─────────────────────────────────────');
  for (const block of BLOCKS) {
    const blockChecks = checks.filter((entry) => entry.block === block);
    const blockFailed = blockChecks.filter((entry) => !entry.pass);
    const verdict = blockFailed.length === 0 ? 'PASS' : 'FAIL';
    console.log(`${block.padEnd(16)} ${String(blockChecks.length).padStart(2)} aserciones · ${verdict}`);
    for (const entry of blockChecks) {
      if (entry.pass) continue;
      console.log(`   ✘ ${entry.id}: ${entry.detail}`);
    }
  }
  console.log('───────────────────────────────────────────────────────────────────');
  console.log(`TOTAL: ${checks.length} aserciones · PASS=${checks.length - failed.length} · FAIL=${failed.length}`);
  console.log(`SSOT_HASH: ${KNOWN_GOOD_SSOT_HASH}`);
  console.log(failed.length === 0 ? 'VEREDICTO: PASS' : 'VEREDICTO: FAIL');

  // Resultado legible por máquina (para el orquestador que lanza el proceso).
  const outcome = path.join(process.cwd(), '.antigravity', 'reports', 'META_COMPILER_CERT.json');
  try {
    fs.mkdirSync(path.dirname(outcome), { recursive: true });
    fs.writeFileSync(
      outcome,
      JSON.stringify(
        {
          verdict: failed.length === 0 ? 'PASS' : 'FAIL',
          assertions: checks.length,
          passed: checks.length - failed.length,
          failed: failed.length,
          blocks: BLOCKS.map((block) => ({
            block,
            assertions: checks.filter((entry) => entry.block === block).length,
            failures: checks.filter((entry) => entry.block === block && !entry.pass).map((entry) => entry.id),
          })),
          ssotHash: KNOWN_GOOD_SSOT_HASH,
          checkedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
      'utf8',
    );
  } catch (error) {
    console.error(`No se pudo escribir ${outcome}: ${error instanceof Error ? error.message : String(error)}`);
  }

  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? `${error.message}\n${error.stack ?? ''}` : String(error);
  console.error('VEREDICTO: FAIL (excepción no controlada)');
  console.error(message);
  process.exit(1);
});




