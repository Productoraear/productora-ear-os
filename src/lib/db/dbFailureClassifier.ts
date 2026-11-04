/**
 * ════════════════════════════════════════════════════════════════════════════
 * CLASIFICADOR DE FALLOS DE POSTGRESQL (AF-1 / AF-5 / INV-16)
 * ════════════════════════════════════════════════════════════════════════════
 * Traduce el error crudo de Prisma/PostgreSQL a un CÓDIGO ACCIONABLE.
 *
 * Motivación medida (hallazgo real, no hipótesis):
 * `src/app/(admin)/admin/page.tsx` registraba `code=UNKNOWN` porque Prisma 6
 * NO rellena `.code` en `PrismaClientInitializationError` — usa `.errorCode` y,
 * en la práctica, también lo deja `undefined`
 * (`errorCode: undefined, clientVersion: '6.12.0'` en `.antigravity/dev_err_live.txt`).
 * Consecuencia: «DB caída», «contraseña incorrecta», «falta `prisma db push`» y
 * «falta la variable de entorno» producían EL MISMO diagnóstico ilegible.
 * Una telemetría que no distingue la causa no sirve para remediarla.
 *
 * Reglas duras:
 *   · NUNCA devuelve ni registra el mensaje original ni la URL de conexión
 *     (SEC-3 / INV-14): el mensaje de Prisma puede arrastrar host, usuario y
 *     parámetros de conexión. Solo se devuelve `kind`, `code` y `action`.
 *   · Cero dependencias externas y cero `any` implícitos: se puede usar en
 *     Server Components, en un Route Handler y en scripts de auditoría.
 * ════════════════════════════════════════════════════════════════════════════
 */

export type DbFailureKind =
  | 'DB_URL_MISSING'
  | 'DB_UNREACHABLE'
  | 'DB_AUTH_FAILED'
  | 'DB_NOT_FOUND'
  | 'DB_SCHEMA_MISSING'
  | 'DB_POOL_TIMEOUT'
  | 'DB_CONNECTION_CLOSED'
  | 'DB_UNKNOWN';

export interface DbFailureReport {
  /** Naturaleza del fallo, deducida del código o de la firma del motor. */
  kind: DbFailureKind;
  /** Código de máquina (`P1001`, `28P01`, …) o `UNKNOWN`. Nunca credenciales. */
  code: string;
  /** Remediación en una línea, apta para el CEO y copiable a PowerShell. */
  action: string;
}

/** Códigos canónicos de Prisma (`P####`) → naturaleza del fallo. */
const PRISMA_CODE_KINDS: Readonly<Record<string, DbFailureKind>> = {
  P1000: 'DB_AUTH_FAILED',
  P1001: 'DB_UNREACHABLE',
  P1002: 'DB_POOL_TIMEOUT',
  P1003: 'DB_NOT_FOUND',
  P1009: 'DB_NOT_FOUND',
  P1010: 'DB_AUTH_FAILED',
  P1011: 'DB_CONNECTION_CLOSED',
  P1017: 'DB_CONNECTION_CLOSED',
  P2021: 'DB_SCHEMA_MISSING',
  P2022: 'DB_SCHEMA_MISSING',
  P2024: 'DB_POOL_TIMEOUT',
  P2028: 'DB_POOL_TIMEOUT',
  P2031: 'DB_CONNECTION_CLOSED',
};

/** SQLSTATE de PostgreSQL (5 caracteres) → naturaleza del fallo. */
const SQLSTATE_KINDS: Readonly<Record<string, DbFailureKind>> = {
  '28P01': 'DB_AUTH_FAILED',
  '28000': 'DB_AUTH_FAILED',
  '3D000': 'DB_NOT_FOUND',
  '42P01': 'DB_SCHEMA_MISSING',
  '42703': 'DB_SCHEMA_MISSING',
  '53300': 'DB_POOL_TIMEOUT',
  '57P01': 'DB_CONNECTION_CLOSED',
  '08006': 'DB_CONNECTION_CLOSED',
  '08003': 'DB_CONNECTION_CLOSED',
};

/**
 * Firmas de texto del motor. Se evalúan SOLO para deducir la causa: el mensaje
 * se lee en memoria y jamás se devuelve, se registra ni se serializa.
 */
const MESSAGE_SIGNATURES: ReadonlyArray<{ pattern: RegExp; kind: DbFailureKind }> = [
  { pattern: /environment variable not found/i, kind: 'DB_URL_MISSING' },
  {
    pattern: /can'?t reach database server|could not connect to server|ECONNREFUSED|ENOTFOUND/i,
    kind: 'DB_UNREACHABLE',
  },
  {
    pattern: /authentication failed|password authentication|role .* does not exist/i,
    kind: 'DB_AUTH_FAILED',
  },
  { pattern: /database .* does not exist/i, kind: 'DB_NOT_FOUND' },
  {
    pattern: /does not exist in the current database|relation .* does not exist|table .* does not exist/i,
    kind: 'DB_SCHEMA_MISSING',
  },
  {
    pattern: /timed out fetching a new connection|too many connections|pool timeout/i,
    kind: 'DB_POOL_TIMEOUT',
  },
  {
    pattern: /server has closed the connection|connection (?:closed|terminated|reset)/i,
    kind: 'DB_CONNECTION_CLOSED',
  },
];

/** Remediación concreta por naturaleza de fallo (una sola acción atómica). */
const REMEDIATION: Readonly<Record<DbFailureKind, string>> = {
  DB_URL_MISSING:
    'Define POSTGRES_PRISMA_URL y POSTGRES_URL_NON_POOLING en .env.local; sin ellas Prisma no arranca.',
  DB_UNREACHABLE:
    'Arranca PostgreSQL 16 y comprueba el puerto: netstat -ano | findstr :5432',
  DB_AUTH_FAILED:
    'Revisa usuario/contraseña y pg_hba.conf del rol definido en POSTGRES_PRISMA_URL.',
  DB_NOT_FOUND: 'La base de datos no existe: createdb -U postgres ear_os',
  DB_SCHEMA_MISSING:
    'El esquema no está aplicado: npx prisma db push (o npx prisma migrate deploy).',
  DB_POOL_TIMEOUT:
    'El pool de conexiones está agotado: sube connection_limit o reduce la concurrencia.',
  DB_CONNECTION_CLOSED:
    'El servidor cerró la conexión: reintenta y revisa reinicios de PostgreSQL/pgbouncer.',
  DB_UNKNOWN:
    'SIN_EVIDENCIA de causa: revisa el log del servidor PostgreSQL antes de tocar código.',
};

/** Forma válida de un código de máquina publicable (sin datos personales). */
const MACHINE_CODE = /^(?:P\d{4}|[0-9A-Z]{5})$/;

function readStringProp(source: unknown, key: string): string | null {
  if (typeof source !== 'object' || source === null) return null;
  const value = (source as Record<string, unknown>)[key];
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Extrae el código de máquina: `errorCode` (Prisma) → `code` (Prisma/SQLSTATE)
 * → `UNKNOWN`. Se descarta cualquier valor que no encaje con `MACHINE_CODE`
 * para no filtrar jamás la cadena de conexión.
 */
export function extractDbErrorCode(err: unknown): string {
  const candidates = [readStringProp(err, 'errorCode'), readStringProp(err, 'code')];
  for (const candidate of candidates) {
    if (candidate !== null && MACHINE_CODE.test(candidate)) return candidate;
  }
  return 'UNKNOWN';
}

/**
 * Clasifica un error de acceso a PostgreSQL. Función pura y total: no lanza
 * nunca y siempre devuelve un informe con `action` ejecutable.
 */
export function classifyDbFailure(err: unknown): DbFailureReport {
  const code = extractDbErrorCode(err);

  // Anotación explícita `| undefined`: sin ella TypeScript ≥5.6 emite TS2869
  // («right operand of ?? is unreachable») porque el indexado de un
  // `Record<string, T>` se considera no nulo con `noUncheckedIndexedAccess` OFF.
  const prismaKind: DbFailureKind | undefined = PRISMA_CODE_KINDS[code];
  const sqlstateKind: DbFailureKind | undefined = SQLSTATE_KINDS[code];
  const byCode = prismaKind ?? sqlstateKind;
  if (byCode !== undefined) {
    return { kind: byCode, code, action: REMEDIATION[byCode] };
  }

  const message = readStringProp(err, 'message');
  if (message !== null) {
    for (const signature of MESSAGE_SIGNATURES) {
      if (signature.pattern.test(message)) {
        return { kind: signature.kind, code, action: REMEDIATION[signature.kind] };
      }
    }
  }

  return { kind: 'DB_UNKNOWN', code, action: REMEDIATION.DB_UNKNOWN };
}

