/**
 * Declaración tipada de `scripts/fichas_db_sqlite_harness.cjs` (W44).
 * Arnés relacional embebido (`node:sqlite`) que ejecuta el MISMO patrón de
 * upsert por clave natural que el sincronizador. NO es PostgreSQL 16.
 */

import type { FichaDbRow } from './fichas_db_rows.cjs';

export interface HarnessAssertion {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

export interface HarnessResult {
  readonly engine: string;
  readonly sqliteVersion: string;
  readonly schemaColumns: readonly string[];
  readonly aliasCoverage: {
    readonly missingInSchema: readonly string[];
    readonly extraInSchema: readonly string[];
  };
  readonly passes: number;
  readonly rowsPerPass: number;
  readonly countAfterFirstPass: number;
  readonly countAfterSecondPass: number;
  readonly fingerprintPlan: string;
  readonly fingerprintFirst: string;
  readonly fingerprintSecond: string;
  readonly duplicateKeys: readonly string[];
  readonly rollback: { readonly inserted: number; readonly countAfterRollback: number };
  readonly assertions: readonly HarnessAssertion[];
  readonly failures: readonly string[];
  readonly ok: boolean;
}

export interface ModelField {
  readonly name: string;
  readonly type: string;
  readonly list: boolean;
  readonly optional: boolean;
  readonly isId: boolean;
}

export declare const MODEL_NAME: string;
export declare const SCHEMA_PATH: string;

export declare function parseModelFields(schemaSource: string): readonly ModelField[];
export declare function buildTableDdl(fields: readonly ModelField[]): string;
export declare function buildUpsertSql(columns: readonly string[]): string;
export declare function runRelationalHarness(
  rows: readonly FichaDbRow[],
  options?: { readonly passes?: number; readonly schemaPath?: string },
): HarnessResult;
