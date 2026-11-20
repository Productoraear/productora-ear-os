/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · MATRIZ EN CALIENTE DE LOS 5 CONECTORES
 * ════════════════════════════════════════════════════════════════════════════
 * Gobierna el estado activo/desactivado de las cinco entidades comerciales y su
 * enlace con el enrutador de las TRES PUERTAS (`/gobiernos`, `/celebraciones`,
 * `/profesionales`).
 *
 * Dos verdades separadas y explícitas:
 *   1. CATÁLOGO (sólo lectura): conectores y sectores declarados en
 *      `ecosystem-ontology.ts`. Es la fuente real; aquí NO se copia.
 *   2. ESTADO (mutable): qué conectores están activos. Vive en
 *      `providerProfileField` con clave única `(providerSlug, fieldKey)`, igual
 *      que el sembrado de ontología, para NO introducir DDL nueva (cero
 *      migraciones sobre producción).
 *
 * Invariante de negocio (por qué esto es más que un interruptor):
 *   Una puerta NO puede quedar vacía. Si desactivar un conector dejase alguna de
 *   las 3 puertas sin conector activo, la operación se RECHAZA con
 *   `DOOR_ORPHANED`. Un enrutador que envía a una puerta sin oferta es un clic
 *   muerto en una ruta que vende (INV-09).
 *
 * Isomorfo: sin `node:*`. Lo consumen el runtime de servidor, la ruta HTTP, la
 * UI y el verificador.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';
import { CONNECTORS, ECOSYSTEM_SECTORS, type ConnectorId } from '@/lib/catalog/ecosystem-ontology';
import { CONNECTOR_DOORS, CONNECTOR_DOOR_MAP, type ConnectorDoor } from './ast-mutator';

export const CONNECTOR_STATE_VERSION = 1 as const;

/**
 * Estado persistido. `active` es un mapa COMPLETO (no parcial): un estado a
 * medias mostraría conectores con estado indefinido en el panel.
 */
export const ConnectorStateSchema = z
  .object({
    version: z.literal(CONNECTOR_STATE_VERSION),
    active: z.object({
      CLIENTE: z.boolean(),
      PROVEEDOR: z.boolean(),
      AFILIADO: z.boolean(),
      MECENAS: z.boolean(),
      SOCIO_ESTRATEGICO: z.boolean(),
    }),
    updatedAt: z.string().min(20).max(40),
    updatedBy: z.string().min(1).max(64),
  })
  .strict();

export type ConnectorState = z.infer<typeof ConnectorStateSchema>;

/** Estado inicial declarado: los 5 conectores activos (ninguna puerta huérfana). */
export function buildDefaultConnectorState(
  updatedAt: string,
  updatedBy = 'metacompiler',
): ConnectorState {
  return {
    version: CONNECTOR_STATE_VERSION,
    active: {
      CLIENTE: true,
      PROVEEDOR: true,
      AFILIADO: true,
      MECENAS: true,
      SOCIO_ESTRATEGICO: true,
    },
    updatedAt,
    updatedBy,
  };
}

/** Ruta pública de cada puerta (las 3 del enrutador soberano). */
export const DOOR_HREFS: Readonly<Record<ConnectorDoor, string>> = Object.freeze({
  gobiernos: '/gobiernos',
  celebraciones: '/celebraciones',
  profesionales: '/profesionales',
});

/** Conectores con lógica de cobro/reparto ya implementada en el compilador. */
export const GOVERNED_CONNECTORS: readonly ConnectorId[] = Object.freeze([
  'CLIENTE',
  'PROVEEDOR',
  'AFILIADO',
  'MECENAS',
]);

/**
 * Normaliza cualquier estado leído de disco/DB contra el catálogo VIVO:
 *   - Conector nuevo en el catálogo ⇒ activo por defecto (no se pierde).
 *   - Conector borrado del catálogo ⇒ se descarta (no resucita).
 * Evita que la matriz muestre un conector que el enrutador ya no conoce.
 */
export function normaliseConnectorState(candidate: unknown, updatedAt: string): ConnectorState {
  const parsed = ConnectorStateSchema.safeParse(candidate);
  if (!parsed.success) return buildDefaultConnectorState(updatedAt);
  const active: Record<ConnectorId, boolean> = { ...parsed.data.active };
  for (const connector of CONNECTORS) {
    if (active[connector.id] !== true && active[connector.id] !== false) {
      active[connector.id] = true;
    }
  }
  return {
    version: CONNECTOR_STATE_VERSION,
    active,
    updatedAt: parsed.data.updatedAt,
    updatedBy: parsed.data.updatedBy,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Evaluación de la matriz
// ─────────────────────────────────────────────────────────────────────────────

export interface DoorRoute {
  readonly door: ConnectorDoor;
  readonly href: string;
  readonly sectors: readonly string[];
  /** Conectores activos cuya ruta cae en esta puerta. */
  readonly connectors: readonly ConnectorId[];
  readonly active: boolean;
}

export interface ConnectorRow {
  readonly id: ConnectorId;
  readonly label: string;
  readonly summary: string;
  readonly href: string;
  readonly door: ConnectorDoor;
  readonly active: boolean;
  /** Conector con lógica de negocio declarada en el MetaCompilador. */
  readonly governed: boolean;
}

export interface ConnectorMatrix {
  readonly rows: readonly ConnectorRow[];
  readonly doors: readonly DoorRoute[];
  readonly activeCount: number;
  readonly totalCount: number;
  /** Puertas sin ningún conector activo. Debe ser `[]` para poder sellar. */
  readonly orphanDoors: readonly ConnectorDoor[];
  readonly parity: 'PASS' | 'FAIL';
  readonly findings: readonly string[];
  readonly probed: true;
  readonly source: 'live';
  readonly mode: 'REAL';
  readonly checkedAt: string;
}

/**
 * Evalúa la matriz. Función PURA de `(state, checkedAt)` y del catálogo
 * importado: mismos argumentos ⇒ mismo resultado (test de determinismo).
 */
export function evaluateConnectorMatrix(state: ConnectorState, checkedAt: string): ConnectorMatrix {
  const findings: string[] = [];

  const rows: ConnectorRow[] = CONNECTORS.map((connector) => ({
    id: connector.id,
    label: connector.label,
    summary: connector.summary,
    href: connector.href,
    door: CONNECTOR_DOOR_MAP[connector.id] ?? 'celebraciones',
    active: state.active[connector.id] === true,
    governed: GOVERNED_CONNECTORS.includes(connector.id),
  }));

  const doors: DoorRoute[] = CONNECTOR_DOORS.map((door) => {
    const connectors = rows.filter((row) => row.door === door && row.active).map((row) => row.id);
    return {
      door,
      href: DOOR_HREFS[door],
      sectors: ECOSYSTEM_SECTORS.filter((sector) => sector.primaryDoor === door).map(
        (sector) => sector.id,
      ),
      connectors,
      active: connectors.length > 0,
    };
  });

  const orphanDoors = doors.filter((door) => !door.active).map((door) => door.door);
  for (const door of orphanDoors) findings.push(`DOOR_ORPHANED: ${door} sin conector activo.`);

  return {
    rows,
    doors,
    activeCount: rows.filter((row) => row.active).length,
    totalCount: rows.length,
    orphanDoors,
    parity: findings.length === 0 ? 'PASS' : 'FAIL',
    findings,
    probed: true,
    source: 'live',
    mode: 'REAL',
    checkedAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Conmutación en caliente (la operación que ejecuta el botón del panel)
// ─────────────────────────────────────────────────────────────────────────────

export interface ConnectorToggleRequest {
  readonly id: ConnectorId;
  readonly active: boolean;
}

export interface ConnectorToggleResult {
  readonly ok: boolean;
  readonly code: 'APPLIED' | 'NOOP' | 'UNKNOWN_CONNECTOR' | 'DOOR_ORPHANED';
  readonly detail: string;
  readonly state: ConnectorState;
  readonly matrix: ConnectorMatrix;
}

/**
 * Conmuta un conector y devuelve el estado + la matriz YA reevaluada.
 * Si la conmutación dejaría una puerta huérfana, NO se aplica y se devuelve
 * `DOOR_ORPHANED` con el estado original intacto (transacción de negocio: o se
 * aplica entera o no se aplica).
 */
export function toggleConnector(
  current: ConnectorState,
  request: ConnectorToggleRequest,
  updatedAt: string,
  updatedBy: string,
): ConnectorToggleResult {
  if (!CONNECTORS.some((connector) => connector.id === request.id)) {
    return {
      ok: false,
      code: 'UNKNOWN_CONNECTOR',
      detail: `El conector «${request.id}» no existe en el catálogo.`,
      state: current,
      matrix: evaluateConnectorMatrix(current, updatedAt),
    };
  }

  if (current.active[request.id] === request.active) {
    return {
      ok: true,
      code: 'NOOP',
      detail: `«${request.id}» ya estaba ${request.active ? 'activo' : 'inactivo'}: sin cambios.`,
      state: current,
      matrix: evaluateConnectorMatrix(current, updatedAt),
    };
  }

  const candidate: ConnectorState = {
    version: CONNECTOR_STATE_VERSION,
    active: { ...current.active, [request.id]: request.active },
    updatedAt,
    updatedBy,
  };
  const matrix = evaluateConnectorMatrix(candidate, updatedAt);

  if (matrix.orphanDoors.length > 0) {
    return {
      ok: false,
      code: 'DOOR_ORPHANED',
      detail: `Rechazado: dejaría sin conector activo ${matrix.orphanDoors.join(', ')} (INV-09).`,
      state: current,
      matrix: evaluateConnectorMatrix(current, updatedAt),
    };
  }

  return {
    ok: true,
    code: 'APPLIED',
    detail: `«${request.id}» => ${request.active ? 'activo' : 'inactivo'}.`,
    state: candidate,
    matrix,
  };
}


