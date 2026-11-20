/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · CONTRATO DE TELEMETRÍA DEL CENTRO DE MANDO
 * ════════════════════════════════════════════════════════════════════════════
 * Tipos de la respuesta de `/api/admin/compiler/connectors` y de
 * `/api/admin/compiler/seal`. Viven aquí (isomorfo, sin `node:*`) porque los
 * consume un componente `'use client'`: importar el módulo servidor desde la UI
 * arrastraría Prisma al bundle del navegador y rompería el build.
 *
 * Regla: cada campo opcional indica una sonda que PUEDE faltar. Si falta, la UI
 * muestra "SIN_EVIDENCIA"; nunca asume el valor feliz.
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { ConnectorMatrix, ConnectorState } from './connector-matrix';
import type { MetaCompilerResult } from './metacompiler-engine';

export interface CatalogueHealth {
  readonly connectors: readonly { readonly id: string; readonly label: string }[];
  readonly file: {
    readonly ok: boolean;
    readonly bytes: number;
    readonly sha256: string | null;
    readonly errors: readonly string[];
  };
  readonly checkedAt: string;
}

export interface ConnectorsPayload {
  readonly store: 'DATABASE' | 'UNAVAILABLE';
  readonly persisted: boolean;
  readonly state: ConnectorState;
  readonly matrix: ConnectorMatrix;
  readonly catalogue: CatalogueHealth;
  readonly checkedAt: string;
}

export interface SealPayload {
  readonly status: 'SEALED' | 'ABORT';
  readonly blockers: readonly string[];
  readonly state: MetaCompilerResult['state'];
  readonly abortReason: MetaCompilerResult['abortReason'];
  readonly sealHash: string;
  readonly evidence: MetaCompilerResult['evidence'];
  readonly stats: MetaCompilerResult['stats'];
  readonly ssot: {
    readonly computedHash: string;
    readonly referenceHash: string;
    readonly intact: boolean;
  };
  readonly connectors: {
    readonly store: 'DATABASE' | 'UNAVAILABLE';
    readonly persisted: boolean;
    readonly parity: 'PASS' | 'FAIL';
    readonly activeCount: number;
    readonly totalCount: number;
    readonly doors: readonly { readonly door: string; readonly active: boolean }[];
  };
  readonly database: { readonly configured: boolean };
  readonly deploy: {
    readonly requested: boolean;
    readonly configured: boolean;
    readonly dispatched: boolean;
    readonly detail: string;
  };
  readonly operator: string;
  readonly checkedAt: string;
  readonly probed: true;
  readonly source: 'live';
  readonly mode: 'REAL';
}
