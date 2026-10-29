/**
 * Declaración tipada de `scripts/fichas_db_rows.cjs` (W44).
 * Contrato único de filas para PostgreSQL: lo consumen el sincronizador y el
 * verificador. Cero `any`: si el módulo CJS cambia de forma, `tsc` rompe aquí.
 */

export interface FichaDbRow {
  readonly key: string;
  readonly vendorId: string | null;
  readonly slug: string | null;
  readonly name: string;
  readonly category: string | null;
  readonly province: string | null;
  readonly municipality: string | null;
  readonly phone: string | null;
  readonly priceEur: number | null;
  readonly rating: number | null;
  readonly verified: boolean;
  readonly completeness: number;
  readonly provenanceHash: string;
  readonly htmlSha256: string | null;
  readonly sources: readonly string[];
  readonly matchMode: string | null;
}

export interface FichaDbStats {
  readonly fichas: number;
  readonly planFichas: number;
  readonly htmlSelladas: number;
  readonly htmlAusentes: number;
  readonly htmlDigestsUnicos: number;
  readonly verificadas: number;
  readonly sinTelefono: number;
  readonly clavesVendor: number;
  readonly clavesCatalogo: number;
  readonly provenanceUnicos: number;
  readonly completenessMedia: number;
}

export interface DbTarget {
  readonly host: string;
  readonly port: string;
  readonly database: string | null;
  readonly user: string;
}

export interface UpsertArguments {
  readonly where: { readonly key: string };
  readonly create: Record<string, unknown>;
  readonly update: Record<string, unknown>;
}

export interface BuildRowsResult {
  readonly rows: FichaDbRow[];
  readonly stats: FichaDbStats;
  readonly htmlFiles: Map<string, string>;
}

export declare const PROVIDER_FICHA_COLUMNS: readonly (keyof FichaDbRow)[];
export declare const MANAGED_COLUMNS: readonly string[];

export declare function buildRows(options?: { readonly limit?: number }): BuildRowsResult;
export declare function fingerprintRows(rows: readonly FichaDbRow[]): string;
export declare function canonicalRow(row: FichaDbRow): string;
export declare function upsertArgs(row: FichaDbRow): UpsertArguments;
export declare function assertRowDoctrine(row: Record<string, unknown>): void;
export declare function describeDbTarget(rawUrl: string): DbTarget | null;
export declare function toRow(
  ficha: Record<string, unknown>,
  source?: { readonly htmlFile: string | null; readonly htmlSha256: string | null } | null,
): { readonly row: FichaDbRow; readonly htmlFile: string | null };
