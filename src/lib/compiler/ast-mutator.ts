/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · MOTOR DE MUTACIÓN AST DETERMINISTA (ZERO-TOKEN)
 * ════════════════════════════════════════════════════════════════════════════
 * Aplica mutaciones ESTRUCTURALES sobre la base de código usando el API real del
 * compilador de TypeScript (`ts.createSourceFile` + `ts.factory` + printer),
 * nunca `String.replace` ni expresiones regulares sobre el texto fuente.
 *
 * Por qué el API del compilador y no `ts-morph`:
 *   1. `ts-morph` NO está instalado en este repositorio (verificado con
 *      `Test-Path node_modules/ts-morph` ⇒ False). Añadir ~9 MB de dependencia
 *      para lo que el propio compilador ya expone incumple INV-15 (repo < 50 MB)
 *      sin ganancia funcional.
 *   2. `typescript@6.0.3` YA es dependencia de producción: el verificador
 *      `npm run verify:metacompiler` lo importa. Cero instalación, cero tokens.
 *
 * Por qué "estructural" y no textual:
 *   Una mutación textual puede insertar una disciplina dentro de un comentario,
 *   de un string o de un tipo no relacionado y "parecer" correcta. El AST sabe
 *   si el destino es realmente un `ArrayLiteralExpression` de `categories` o un
 *   `ObjectLiteralExpression` de `CONNECTORS`. Si no lo es, se RECHAZA.
 *
 * Contrato de honestidad (AF-5 / EP-2):
 *   - `applyMutations` NUNCA escribe en disco: devuelve texto mutado, SHA-256 de
 *     entrada y de salida y la lista de mutaciones aplicadas.
 *   - Una mutación cuya precondición no se cumple devuelve `status:'REJECTED'`
 *     con su código; el motor la convierte en ABORT. Nada de "aplicado a medias".
 *   - Idempotencia: aplicar dos veces la misma mutación produce el MISMO texto y
 *     `changed:false`, de modo que N ejecuciones ⇒ 1 efecto (INV-08).
 *
 * Server-only por construcción: importa `typescript`, que arrastra `node:*`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import ts from 'typescript';
import { sha256OfText, byteLengthUtf8 } from './metacompiler-hash';

/** Vocabulario cerrado de mutaciones. Fuera de esta lista no hay mutación. */
export const AST_MUTATION_KINDS = ['ONTOLOGY_NODE_ADD', 'CATEGORY_BINDING_SET'] as const;
export type AstMutationKind = (typeof AST_MUTATION_KINDS)[number];

/** Motivos de rechazo. Vocabulario cerrado: no existe "otro error". */
export const AST_REJECTION_CODES = [
  'PARSE_ERROR',
  'TARGET_NOT_FOUND',
  'TARGET_NOT_STATIC',
  'DUPLICATE_KEY',
  'INVALID_ID',
  'INVARIANT_BREACH',
] as const;
export type AstRejectionCode = (typeof AST_REJECTION_CODES)[number];

export interface AstMutation {
  readonly kind: AstMutationKind;
  /** `ONTOLOGY_NODE_ADD` → id de categoría. `CATEGORY_BINDING_SET` → id de conector. */
  readonly target: string;
  /** Sólo ONTOLOGY_NODE_ADD: etiqueta legible de la categoría. */
  readonly label?: string;
  /** Sólo ONTOLOGY_NODE_ADD: sector que recibe la categoría. */
  readonly sector?: string;
  /** Sólo ONTOLOGY_NODE_ADD: href canónico de la categoría. */
  readonly href?: string;
  /** Sólo CATEGORY_BINDING_SET: puerta destino. */
  readonly door?: string;
}

export interface AppliedMutation {
  readonly kind: AstMutationKind;
  readonly target: string;
  readonly status: 'APPLIED' | 'NOOP' | 'REJECTED';
  readonly code: AstRejectionCode | null;
  readonly detail: string;
}

export interface AstMutationResult {
  readonly sourceSha256: string;
  readonly mutatedSha256: string;
  readonly mutated: string;
  readonly changed: boolean;
  readonly bytesBefore: number;
  readonly bytesAfter: number;
  readonly applied: readonly AppliedMutation[];
  readonly rejected: readonly AppliedMutation[];
  /** `true` sólo si NINGUNA mutación fue rechazada. */
  readonly ok: boolean;
  /** Diagnósticos sintácticos del texto mutado (0 ⇒ el AST re-parsea limpio). */
  readonly syntaxErrors: readonly string[];
}

/** Identificador seguro de nodo: MAYÚSCULAS, dígitos y guiones. */
export const SAFE_NODE_ID = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*$/;

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades de parseo y localización (API del compilador, no regex)
// ─────────────────────────────────────────────────────────────────────────────

function parse(source: string, fileName: string): ts.SourceFile {
  return ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

/** Diagnósticos sintácticos REALES del compilador (no un contador de llaves). */
export function collectSyntaxErrors(source: string, fileName = 'mutation.ts'): string[] {
  // `parseDiagnostics` no forma parte de la superficie pública de `SourceFile`,
  // pero el parser REAL sí lo adjunta. Se accede con un tipo estructural
  // declarado (cero `any`): si el compilador deja de exponerlo, `?? []` devuelve
  // una lista vacía y el verificador independiente (`ts.transpileModule`) sigue
  // siendo la red de seguridad de la sintaxis.
  const sourceFile = parse(source, fileName) as ts.SourceFile & {
    readonly parseDiagnostics?: readonly ts.Diagnostic[];
  };
  const diagnostics = sourceFile.parseDiagnostics ?? [];
  return diagnostics.map((diagnostic) => {
    const line =
      diagnostic.start === undefined
        ? '?'
        : String(sourceFile.getLineAndCharacterOfPosition(diagnostic.start).line + 1);
    return `L${line}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`;
  });
}

/**
 * Segunda opinión sintáctica: `ts.transpileModule` con `reportDiagnostics`.
 * Un fichero que pasa `collectSyntaxErrors` y falla aquí (o al revés) delata un
 * mutador que ha producido código ilegal. El verificador exige 0 en ambas.
 */
export function collectTranspileErrors(source: string, fileName = 'mutation.ts'): string[] {
  const output = ts.transpileModule(source, {
    fileName,
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.Latest, module: ts.ModuleKind.ESNext },
  });
  return (output.diagnostics ?? [])
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)
    .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '));
}


function findVariable(sourceFile: ts.SourceFile, name: string): ts.VariableDeclaration | null {
  let found: ts.VariableDeclaration | null = null;
  const visit = (node: ts.Node): void => {
    if (found !== null) return;
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name) {
      found = node;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}

interface FrozenArrayTarget {
  readonly statement: ts.VariableStatement;
  readonly array: ts.ArrayLiteralExpression;
}

/**
 * Localiza el array estático de `Object.freeze([...])` (o array directo)
 * asignado a `<name>`. Devuelve `null` si no es un literal estático: el llamante
 * rechaza con `TARGET_NOT_STATIC` en lugar de intentar una cirugía a ciegas.
 */
function findFrozenArray(sourceFile: ts.SourceFile, name: string): FrozenArrayTarget | null {
  const declaration = findVariable(sourceFile, name);
  if (declaration === null || declaration.initializer === undefined) return null;

  let initializer: ts.Expression = declaration.initializer;
  if (ts.isCallExpression(initializer)) {
    const callee = initializer.expression;
    const isFreeze =
      ts.isPropertyAccessExpression(callee) &&
      ts.isIdentifier(callee.expression) &&
      callee.expression.text === 'Object' &&
      callee.name.text === 'freeze';
    if (!isFreeze || initializer.arguments.length !== 1) return null;
    initializer = initializer.arguments[0];
  }
  if (!ts.isArrayLiteralExpression(initializer)) return null;

  const statement = declaration.parent.parent;
  if (!ts.isVariableStatement(statement)) return null;
  return { statement, array: initializer };
}

/** ¿El objeto literal declara `property: 'value'`? (lectura estructural real). */
function objectHasStringProperty(
  object: ts.ObjectLiteralExpression,
  property: string,
  value: string,
): boolean {
  return object.properties.some((entry) => {
    if (!ts.isPropertyAssignment(entry)) return false;
    const key =
      ts.isIdentifier(entry.name) || ts.isStringLiteral(entry.name) ? entry.name.text : '';
    return (
      key === property && ts.isStringLiteral(entry.initializer) && entry.initializer.text === value
    );
  });
}

function propertyOf(
  object: ts.ObjectLiteralExpression,
  name: string,
): ts.PropertyAssignment | null {
  for (const entry of object.properties) {
    if (ts.isPropertyAssignment(entry) && ts.isIdentifier(entry.name) && entry.name.text === name) {
      return entry;
    }
  }
  return null;
}

function rejected(mutation: AstMutation, code: AstRejectionCode, detail: string): AppliedMutation {
  return { kind: mutation.kind, target: mutation.target, status: 'REJECTED', code, detail };
}

// ─────────────────────────────────────────────────────────────────────────────
// MUTACIÓN · ONTOLOGY_NODE_ADD
//   Inserta un `CategoryDef` en `categories` del sector indicado. Reutiliza el
//   helper `c(...)` si el array ya lo usa, para no cambiar el estilo del fichero.
// ─────────────────────────────────────────────────────────────────────────────

function buildOntologyNode(
  sourceFile: ts.SourceFile,
  mutation: AstMutation,
): { readonly node: ts.Expression | null; readonly outcome: AppliedMutation } {
  const factory = ts.factory;
  if (!SAFE_NODE_ID.test(mutation.target)) {
    return {
      node: null,
      outcome: rejected(mutation, 'INVALID_ID', `id «${mutation.target}» no cumple ${String(SAFE_NODE_ID)}.`),
    };
  }
  if (mutation.sector === undefined || mutation.label === undefined || mutation.href === undefined) {
    return {
      node: null,
      outcome: rejected(mutation, 'TARGET_NOT_STATIC', 'ONTOLOGY_NODE_ADD exige sector, label y href.'),
    };
  }

  const frozen = findFrozenArray(sourceFile, 'ECOSYSTEM_SECTORS');
  if (frozen === null) {
    return {
      node: null,
      outcome: rejected(mutation, 'TARGET_NOT_STATIC', 'ECOSYSTEM_SECTORS no es un array estático.'),
    };
  }

  const sector = frozen.array.elements.find(
    (element): element is ts.ObjectLiteralExpression =>
      ts.isObjectLiteralExpression(element) && objectHasStringProperty(element, 'id', mutation.sector ?? ''),
  );
  if (sector === undefined) {
    return {
      node: null,
      outcome: rejected(mutation, 'TARGET_NOT_FOUND', `Sector «${mutation.sector}» inexistente.`),
    };
  }

  const categories = propertyOf(sector, 'categories');
  if (categories === null || !ts.isArrayLiteralExpression(categories.initializer)) {
    return {
      node: null,
      outcome: rejected(mutation, 'TARGET_NOT_STATIC', '`categories` no es un array literal.'),
    };
  }

  const alreadyThere = categories.initializer.elements.some(
    (element) =>
      ts.isCallExpression(element) &&
      element.arguments.some((arg) => ts.isStringLiteral(arg) && arg.text === mutation.target),
  );
  if (alreadyThere) {
    return {
      node: null,
      outcome: {
        kind: mutation.kind,
        target: mutation.target,
        status: 'NOOP',
        code: null,
        detail: `La categoría «${mutation.target}» ya existe en «${mutation.sector}»: efecto idempotente.`,
      },
    };
  }

  const usesHelper = categories.initializer.elements.some(
    (element) => ts.isCallExpression(element) && ts.isIdentifier(element.expression) && element.expression.text === 'c',
  );
  const node = usesHelper
    ? factory.createCallExpression(factory.createIdentifier('c'), undefined, [
        factory.createStringLiteral(mutation.target),
        factory.createStringLiteral(mutation.label),
        factory.createStringLiteral(mutation.href),
      ])
    : factory.createObjectLiteralExpression(
        [
          factory.createPropertyAssignment('id', factory.createStringLiteral(mutation.target)),
          factory.createPropertyAssignment('label', factory.createStringLiteral(mutation.label)),
          factory.createPropertyAssignment('href', factory.createStringLiteral(mutation.href)),
        ],
        false,
      );

  return {
    node,
    outcome: {
      kind: mutation.kind,
      target: mutation.target,
      status: 'APPLIED',
      code: null,
      detail: `Categoría «${mutation.target}» → sector «${mutation.sector}».`,
    },
  };
}

/**
 * Aplica una mutación ONTOLOGY_NODE_ADD al AST y devuelve el `SourceFile`
 * reescrito. La sustitución se hace sobre el `VariableStatement` real del array
 * `ECOSYSTEM_SECTORS`, de modo que el resto del fichero viaja intacto byte a byte.
 */
function applyOntologyNode(
  sourceFile: ts.SourceFile,
  mutation: AstMutation,
): { readonly file: ts.SourceFile | null; readonly outcome: AppliedMutation } {
  const built = buildOntologyNode(sourceFile, mutation);
  if (built.node === null) return { file: null, outcome: built.outcome };

  const frozen = findFrozenArray(sourceFile, 'ECOSYSTEM_SECTORS');
  if (frozen === null) {
    return { file: null, outcome: rejected(mutation, 'TARGET_NOT_STATIC', 'ECOSYSTEM_SECTORS no es estático.') };
  }
  const factory = ts.factory;
  const sectorId = mutation.sector ?? '';

  const newSector = (element: ts.Expression): ts.Expression => {
    if (!ts.isObjectLiteralExpression(element) || !objectHasStringProperty(element, 'id', sectorId)) {
      return element;
    }
    return factory.createObjectLiteralExpression(
      element.properties.map((entry) => {
        if (entry.name === undefined || !ts.isIdentifier(entry.name) || entry.name.text !== 'categories') {
          return entry;
        }
        if (!ts.isPropertyAssignment(entry) || !ts.isArrayLiteralExpression(entry.initializer)) return entry;
        const updated = factory.createArrayLiteralExpression(
          [...entry.initializer.elements, built.node as ts.Expression],
          true,
        );
        return factory.createPropertyAssignment(entry.name, updated);
      }),
      true,
    );
  };

  const updatedArray = factory.createArrayLiteralExpression(
    frozen.array.elements.map(newSector),
    true,
  );
  const updatedStatement = factory.createVariableStatement(
    frozen.statement.modifiers,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('ECOSYSTEM_SECTORS'),
          frozen.statement.declarationList.declarations[0].exclamationToken,
          frozen.statement.declarationList.declarations[0].type,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(factory.createIdentifier('Object'), 'freeze'),
            undefined,
            [updatedArray],
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );

  return { file: replaceStatement(sourceFile, frozen.statement, updatedStatement), outcome: built.outcome };
}

/** Sustituye un `Statement` por otro preservando el orden y el resto del árbol. */
function replaceStatement(
  sourceFile: ts.SourceFile,
  target: ts.Statement,
  replacement: ts.Statement,
): ts.SourceFile {
  const statements = sourceFile.statements.map((entry) => (entry === target ? replacement : entry));
  return ts.factory.updateSourceFile(sourceFile, statements);
}

// ─────────────────────────────────────────────────────────────────────────────
// MUTACIÓN · CATEGORY_BINDING_SET
//   Fija la puerta (`href`) de un conector en `CONNECTORS`. Es la mutación que
//   enlaza la matriz de 5 conectores con el enrutador de las 3 puertas sin
//   tocar el modelo de datos ni la Zona Cero.
// ─────────────────────────────────────────────────────────────────────────────

export const CONNECTOR_DOORS = ['gobiernos', 'celebraciones', 'profesionales'] as const;
export type ConnectorDoor = (typeof CONNECTOR_DOORS)[number];

/** Conector → puerta canónica. Contrato de negocio, no preferencia de UI. */
export const CONNECTOR_DOOR_MAP: Readonly<Record<string, ConnectorDoor>> = Object.freeze({
  CLIENTE: 'celebraciones',
  PROVEEDOR: 'profesionales',
  AFILIADO: 'profesionales',
  MECENAS: 'gobiernos',
  SOCIO_ESTRATEGICO: 'profesionales',
});

function applyConnectorBinding(
  sourceFile: ts.SourceFile,
  mutation: AstMutation,
): { readonly file: ts.SourceFile | null; readonly outcome: AppliedMutation } {
  const door = mutation.door ?? CONNECTOR_DOOR_MAP[mutation.target];
  if (door === undefined || !(CONNECTOR_DOORS as readonly string[]).includes(door)) {
    return {
      file: null,
      outcome: rejected(mutation, 'INVARIANT_BREACH', `Puerta «${String(mutation.door)}» fuera del enrutador de 3 puertas.`),
    };
  }
  const expected = CONNECTOR_DOOR_MAP[mutation.target];
  if (expected === undefined) {
    return { file: null, outcome: rejected(mutation, 'TARGET_NOT_FOUND', `Conector «${mutation.target}» no declarado.`) };
  }
  if (expected !== door) {
    return {
      file: null,
      outcome: rejected(
        mutation,
        'INVARIANT_BREACH',
        `«${mutation.target}» pertenece a la puerta «${expected}»; se pidió «${door}».`,
      ),
    };
  }

  const frozen = findFrozenArray(sourceFile, 'CONNECTORS');
  if (frozen === null) {
    return { file: null, outcome: rejected(mutation, 'TARGET_NOT_STATIC', 'CONNECTORS no es un array estático.') };
  }
  const factory = ts.factory;
  const targetDoor = `/guia-${door}`;
  let touched = false;

  const newElement = (element: ts.Expression): ts.Expression => {
    if (!ts.isObjectLiteralExpression(element) || !objectHasStringProperty(element, 'id', mutation.target)) {
      return element;
    }
    touched = true;
    return factory.createObjectLiteralExpression(
      element.properties.map((entry) => {
        if (!ts.isPropertyAssignment(entry) || !ts.isIdentifier(entry.name) || entry.name.text !== 'href') {
          return entry;
        }
        return factory.createPropertyAssignment(entry.name, factory.createStringLiteral(targetDoor));
      }),
      true,
    );
  };

  const updatedArray = factory.createArrayLiteralExpression(frozen.array.elements.map(newElement), true);
  if (!touched) {
    return { file: null, outcome: rejected(mutation, 'TARGET_NOT_FOUND', `Conector «${mutation.target}» inexistente.`) };
  }
  const updatedStatement = factory.createVariableStatement(
    frozen.statement.modifiers,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('CONNECTORS'),
          frozen.statement.declarationList.declarations[0].exclamationToken,
          frozen.statement.declarationList.declarations[0].type,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(factory.createIdentifier('Object'), 'freeze'),
            undefined,
            [updatedArray],
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
  return {
    file: replaceStatement(sourceFile, frozen.statement, updatedStatement),
    outcome: {
      kind: mutation.kind,
      target: mutation.target,
      status: 'APPLIED',
      code: null,
      detail: `Conector «${mutation.target}» enlazado a la puerta «${door}» (${targetDoor}).`,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// APLICADOR DETERMINISTA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Printer único del módulo. `removeComments: false` es deliberado: el fichero
 * conserva su documentación (un mutador que borra comentarios destruye la
 * trazabilidad de la doctrina). El ancho y el salto de línea se fijan para que
 * dos ejecuciones en Windows y en Linux produzcan el MISMO texto.
 */
function createPrinter(): ts.Printer {
  return ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
    omitTrailingSemicolon: false,
  });
}

/**
 * Aplicador determinista de mutaciones sobre UN texto fuente.
 *
 * Precondición : el texto parsea sin errores de sintaxis.
 * Postcondición: si no hay UNA SOLA mutación aplicada, el texto devuelto es el
 *                ORIGINAL byte a byte (un mutador que reimprime sin cambios
 *                destruye el `git diff`: eso es corrupción, no mutación). Sólo
 *                los ficheros realmente tocados se reimprimen.
 *
 * `ok === false` si alguna mutación fue rechazada o si el texto resultante no
 * parsea: el motor lo convierte en ABORT y NO escribe nada (nunca a medias).
 */
export function applyMutations(
  source: string,
  mutations: readonly AstMutation[],
  fileName = 'ecosystem-ontology.ts',
): AstMutationResult {
  const sourceErrors = collectSyntaxErrors(source, fileName);
  if (sourceErrors.length > 0) {
    return {
      sourceSha256: sha256OfText(source),
      mutatedSha256: sha256OfText(source),
      mutated: source,
      changed: false,
      bytesBefore: byteLengthUtf8(source),
      bytesAfter: byteLengthUtf8(source),
      applied: [],
      rejected: mutations.map((mutation) => rejected(mutation, 'PARSE_ERROR', sourceErrors.join('; '))),
      ok: false,
      syntaxErrors: sourceErrors,
    };
  }

  const printer = createPrinter();
  let current = parse(source, fileName);
  let touched = false;
  const applied: AppliedMutation[] = [];
  const denied: AppliedMutation[] = [];

  for (const mutation of mutations) {
    const outcome =
      mutation.kind === 'ONTOLOGY_NODE_ADD'
        ? applyOntologyNode(current, mutation)
        : applyConnectorBinding(current, mutation);
    if (outcome.file === null) {
      (outcome.outcome.status === 'REJECTED' ? denied : applied).push(outcome.outcome);
      continue;
    }
    current = outcome.file;
    touched = true;
    applied.push(outcome.outcome);
  }

  // Sin mutación efectiva ⇒ se devuelve el original íntegro (cero diff espurio).
  const mutated = touched ? printer.printFile(current) : source;
  const syntaxErrors = collectSyntaxErrors(mutated, fileName);

  return {
    sourceSha256: sha256OfText(source),
    mutatedSha256: sha256OfText(mutated),
    mutated,
    changed: mutated !== source,
    bytesBefore: byteLengthUtf8(source),
    bytesAfter: byteLengthUtf8(mutated),
    applied,
    rejected: denied,
    ok: denied.length === 0 && syntaxErrors.length === 0,
    syntaxErrors,
  };
}






