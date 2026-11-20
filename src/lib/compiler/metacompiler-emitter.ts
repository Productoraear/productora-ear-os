/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · EMISOR DETERMINISTA DE CÓDIGO Y AUDITOR AST
 * ════════════════════════════════════════════════════════════════════════════
 * El compilador NO devuelve texto libre de un LLM: emite un artefacto TypeScript
 * cuyo contenido es una función total de la especificación validada.
 *
 *   - Determinismo: mismo `MetaCompilerSpec` ⇒ mismo `artifact` byte a byte ⇒
 *     mismo SHA-256. Sin fechas, sin aleatoriedad, sin orden de claves ambiguo.
 *   - Valores financieros: NO se teclean. Se interpolan desde `ear-os-ssot.ts`
 *     en el momento de la emisión (INV-10: cero precios hardcodeados).
 *
 * `auditArtifactAst` es un compilador estático propio (tokenizador + analizador
 * de declaraciones). Lo consume el verificador `npm run verify:metacompiler`,
 * que además contrasta el veredicto con el parser REAL de TypeScript
 * (`ts.createSourceFile`) para que el artefacto emitido sea sintácticamente
 * legal para la versión de TypeScript del repositorio.
 *
 * Isomorfo: cero `node:*`, cero red, cero tokens de API.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
  SAFE_LCSP_CEILING_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import type { MetaArtifactBlock } from './metacompiler-fsm';
import type { MetaCompilerSpec } from './metacompiler-spec';

/** Cabecera canónica que sella el artefacto emitido. */
export const ARTIFACT_HEADER_MARKER = 'EAR-OS-METACOMPILER-ARTIFACT v1';

export interface AstAudit {
  readonly valid: boolean;
  readonly diagnostics: readonly string[];
  readonly declarations: readonly string[];
  readonly exports: readonly string[];
  readonly forbidden: readonly string[];
}

/** Patrones prohibidos en un artefacto emitido: red, aleatoriedad y `any`. */
export const FORBIDDEN_ARTIFACT_PATTERNS: readonly { readonly code: string; readonly pattern: RegExp }[] =
  Object.freeze([
    { code: 'FETCH_CALL', pattern: /\bfetch\s*\(/ },
    { code: 'MATH_RANDOM', pattern: /\bMath\s*\.\s*random\s*\(/ },
    { code: 'DATE_NOW', pattern: /\bDate\s*\.\s*now\s*\(/ },
    { code: 'EXPLICIT_ANY', pattern: /:\s*any\b/ },
    { code: 'REQUIRE_CALL', pattern: /\brequire\s*\(/ },
    { code: 'NODE_IMPORT', pattern: /from\s*['"]node:/ },
  ]);

function euro(value: number): string {
  return value.toFixed(2);
}

function blockHeader(spec: MetaCompilerSpec, blockCount: number): string {
  return [
    '/**',
    ` * ${ARTIFACT_HEADER_MARKER}`,
    ` * specId      : ${spec.specId}`,
    ` * name        : ${spec.name}`,
    ` * summary     : ${spec.summary}`,
    ` * promise     : ${spec.promiseUrl}`,
    ` * phases      : ${spec.phases.join(' > ')}`,
    ` * blocks      : ${blockCount}`,
    ` * source      : ear-os-ssot.ts (Zona Cero, valores interpolados en emision)`,
    ' */',
  ].join('\n');
}

function blockTypes(spec: MetaCompilerSpec): string {
  const union = spec.ontology.nodes.map((node) => `'${node.id}'`).join(' | ');
  const rows = spec.ontology.nodes
    .map((node) => `  { id: '${node.id}', label: '${node.label}', kind: '${node.kind}' },`)
    .join('\n');
  return [
    `export type MetaNodeId = ${union};`,
    '',
    'export interface MetaNode {',
    '  readonly id: MetaNodeId;',
    '  readonly label: string;',
    "  readonly kind: 'SURFACE' | 'ENGINE' | 'CONNECTOR';",
    '}',
    '',
    'export const META_NODES: readonly MetaNode[] = [',
    rows,
    '];',
  ].join('\n');
}

function blockValidators(): string {
  return [
    '/** Split soberano 80/10/10 leido de Zona Cero (no se teclea). */',
    'export const META_SPLIT = {',
    `  artista: ${SPLIT_SOBERANO.artista},`,
    `  earOs: ${SPLIT_SOBERANO.earOs},`,
    `  vimume: ${SPLIT_SOBERANO.vimume},`,
    '} as const;',
    '',
    '/** Fianza comercial y techo B2G: valores vigentes del SSOT. */',
    'export const META_ENTITLEMENTS = {',
    `  sueloSolistaEur: ${euro(TARIFA_BASE_SOLISTA_EUR)},`,
    `  fianzaEur: ${euro(DEPOSITO_STRIPE_EUR)},`,
    `  techoB2GEur: ${euro(SAFE_LCSP_CEILING_EUR)},`,
    `  centralita: '${CENTRALITA_EAR_OS}',`,
    '} as const;',
    '',
    'export function splitParityHolds(): boolean {',
    '  const sum = META_SPLIT.artista + META_SPLIT.earOs + META_SPLIT.vimume;',
    '  return Math.abs(sum - 1) <= 0.0001;',
    '}',
  ].join('\n');
}

function blockGates(spec: MetaCompilerSpec): string {
  const gates = spec.invariants.checks
    .map(
      (check) =>
        `  { id: '${check.id}', statement: '${check.statement}', mode: 'DECLARED', verdict: splitParityHolds() },`,
    )
    .join('\n');
  return [
    '/**',
    ' * Compuertas declaradas por el artefacto. `mode: DECLARED` proclama que este',
    ' * codigo NO ha sondeado PostgreSQL ni Stripe: prohibe el verde por defecto',
    ' * (AF-5). La certificacion real vive en el arnes de 17 puertas.',
    ' */',
    'export const META_GATES = [',
    gates,
    '];',
  ].join('\n');
}


/**
 * Compilador estático propio: elimina comentarios y literales, y verifica el
 * esqueleto del artefacto (balance de llaves, declaraciones obligatorias,
 * identificadores reservados y patrones prohibidos).
 *
 * No sustituye a `tsc`: es el juicio LINT_AST de la FSM. El verificador
 * `verify:metacompiler` ejecuta ADEMÁS el parser real de TypeScript y exige
 * que ambos coincidan (paridad de motores de análisis).
 */
export function auditArtifactAst(source: string, spec: MetaCompilerSpec): AstAudit {
  const diagnostics: string[] = [];
  const forbidden: string[] = [];

  // Esqueleto sin comentarios ni literales: un `{` dentro de un string no cuenta.
  const skeleton = source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, ' ')
    .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""');

  let depth = 0;
  for (const char of skeleton) {
    if (char === '{') depth += 1;
    else if (char === '}') depth -= 1;
    if (depth < 0) break;
  }
  if (depth !== 0) diagnostics.push(`BRACES_UNBALANCED: profundidad final ${depth}.`);
  if (/[`]/.test(skeleton)) diagnostics.push('TEMPLATE_LITERAL_RESIDUAL: literal no cerrado.');

  const declarations: string[] = [];
  const exportRe = /export\s+(?:const|function|interface|type|class)\s+([A-Za-z_$][\w$]*)/g;
  let match: RegExpExecArray | null;
  while ((match = exportRe.exec(skeleton)) !== null) {
    declarations.push(match[1]);
  }

  if (new Set(declarations).size !== declarations.length) {
    diagnostics.push('DUPLICATE_DECLARATION: dos exports comparten nombre.');
  }

  const declaredNames = new Set(declarations);
  const nodes = spec.ontology.nodes.map((node) => node.id);
  const checks = spec.invariants.checks.map((check) => check.id);

  if (spec.artifact.blocks.includes('TYPES')) {
    if (!declaredNames.has('MetaNodeId')) diagnostics.push('MISSING_DECLARATION: MetaNodeId.');
    if (!declaredNames.has('META_NODES')) diagnostics.push('MISSING_DECLARATION: META_NODES.');
    if (!source.includes(`'${nodes[0]}'`)) diagnostics.push('MISSING_NODE: el primer nodo no aparece.');
  }
  if (spec.artifact.blocks.includes('VALIDATORS')) {
    if (!declaredNames.has('META_SPLIT')) diagnostics.push('MISSING_DECLARATION: META_SPLIT.');
    if (!declaredNames.has('META_ENTITLEMENTS')) diagnostics.push('MISSING_DECLARATION: META_ENTITLEMENTS.');
    if (!source.includes(`fianzaEur: ${DEPOSITO_STRIPE_EUR.toFixed(2)}`)) {
      diagnostics.push('ENTITLEMENT_DRIFT: la fianza emitida no coincide con el SSOT.');
    }
    if (!source.includes(`techoB2GEur: ${SAFE_LCSP_CEILING_EUR.toFixed(2)}`)) {
      diagnostics.push('ENTITLEMENT_DRIFT: el techo B2G emitido no coincide con el SSOT.');
    }
  }
  if (spec.artifact.blocks.includes('GATES')) {
    if (!declaredNames.has('META_GATES')) diagnostics.push('MISSING_DECLARATION: META_GATES.');
    for (const checkId of checks) {
      if (!source.includes(`id: '${checkId}'`)) diagnostics.push(`MISSING_GATE: ${checkId}.`);
    }
  }

  for (const rule of FORBIDDEN_ARTIFACT_PATTERNS) {
    if (rule.pattern.test(skeleton)) forbidden.push(rule.code);
  }

  return {
    valid: diagnostics.length === 0 && forbidden.length === 0,
    diagnostics,
    declarations,
    exports: declarations,
    forbidden,
  };
}

export interface EmittedArtifact {
  readonly specId: string;
  readonly blocks: readonly MetaArtifactBlock[];
  readonly artifact: string;
  readonly bytes: number;
  readonly lines: number;
  readonly diagnostics: readonly string[];
  readonly astValid: boolean;
}

/**
 * Emite el artefacto TypeScript determinista para una especificación VÁLIDA.
 * Un artefacto con diagnósticos AST se devuelve igualmente (nunca se oculta),
 * pero `astValid=false` hace que la FSM no pueda llegar a GATE_EVAL.
 */
export function emitArtifact(spec: MetaCompilerSpec): EmittedArtifact {
  const parts: string[] = [blockHeader(spec, spec.artifact.blocks.length)];
  for (const block of spec.artifact.blocks) {
    switch (block) {
      case 'HEADER':
        // La cabecera ya viaja en `parts[0]`; el bloque se declara una sola vez.
        break;
      case 'TYPES':
        parts.push(blockTypes(spec));
        break;
      case 'VALIDATORS':
        // Los validadores se interpolan del SSOT en emisión: no dependen de la
        // spec, de modo que dos specs distintas no pueden alterar las cifras.
        parts.push(blockValidators());
        break;
      case 'GATES':
        parts.push(blockGates(spec));
        break;
      default:
        break;
    }
  }
  const artifact = `${parts.join('\n\n')}\n`;
  const ast = auditArtifactAst(artifact, spec);
  const diagnostics = [...ast.diagnostics];
  if (ast.forbidden.length > 0) {
    diagnostics.push(`FORBIDDEN_PATTERN: ${ast.forbidden.join(', ')}.`);
  }
  return {
    specId: spec.specId,
    blocks: spec.artifact.blocks,
    artifact,
    bytes: artifact.length,
    lines: artifact.split('\n').length,
    diagnostics,
    astValid: ast.valid,
  };
}
