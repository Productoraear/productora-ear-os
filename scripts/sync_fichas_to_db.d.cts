/**
 * Declaración tipada de `scripts/sync_fichas_to_db.cjs` (W44).
 * Sólo se declara la superficie que consume `verify_fichas_db.ts`: la capa de
 * base de datos, reutilizada en lugar de reimplementada (una sola definición
 * de upsert/lectura = cero deriva entre escribir y verificar).
 */

import type { FichaDbRow } from './fichas_db_rows.cjs';

export interface PrismaFichaDelegate {
  count(args?: { readonly where?: { readonly key?: { readonly in: readonly string[] } } }): Promise<number>;
  findMany(args: unknown): Promise<readonly Record<string, unknown>[]>;
  upsert(args: unknown): Promise<Record<string, unknown>>;
}

export interface PrismaLike {
  readonly providerFicha: PrismaFichaDelegate;
  $queryRaw(strings: TemplateStringsArray, ...values: readonly unknown[]): Promise<unknown>;
  $transaction(operations: readonly Promise<unknown>[]): Promise<readonly unknown[]>;
  $disconnect(): Promise<void>;
}

export interface DatabaseResolution {
  readonly key: string;
  readonly url: string;
}

export declare const EXIT_OK: number;
export declare const EXIT_FAIL: number;
export declare const EXIT_UNAVAILABLE: number;

export declare function loadEnvironment(): void;
export declare function resolveDatabaseUrl(): DatabaseResolution | null;
export declare function createPrismaClient(datasourceUrl: string): PrismaLike;
export declare function selectColumns(): Record<string, boolean>;
export declare function pingDatabase(prisma: PrismaLike, timeoutMs: number): Promise<void>;
export declare function upsertBatches(
  prisma: PrismaLike,
  rows: readonly FichaDbRow[],
  chunkSize: number,
): Promise<{ readonly batches: number; readonly written: number }>;
export declare function readBackRows(
  prisma: PrismaLike,
  keys: readonly string[],
  chunkSize: number,
): Promise<FichaDbRow[]>;
export declare function isUnavailableError(error: unknown): boolean;
export declare function chunkRows<T>(items: readonly T[], size: number): T[][];
export declare function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T>;
