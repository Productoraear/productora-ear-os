// ============================================================================
// Ω-ADMIN · SSOT DE CONTRATOS DE RED DEL PANEL (W41_T01)
// ----------------------------------------------------------------------------
// Una sola verdad para el sobre de respuesta y el error tipado de /api/admin/*.
// Rutas reales (evidencia en src/app/api/admin/artists/route.ts:126):
//   éxito  -> { ok: true, data, total, page, size }
//   error  -> { ok: false, error: 'mensaje', issues?: [...] }
// Prohibido declarar aquí cifras de negocio: el dinero nace de ear-os-ssot.ts.
// ============================================================================

/** Códigos canónicos de fallo. Cerrados: nada de string libre aguas abajo. */
export type AdminErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION'
  | 'SERVER'
  | 'CONFIG';

/**
 * Fallo normalizado de red admin.
 * `status: 0` => no hubo respuesta HTTP válida (red caída o configuración ausente).
 */
export type AdminApiError = {
  status: number;
  code: AdminErrorCode;
  message: string;
  /** Detalle por campo que las rutas devuelven junto al error (Zod `issues`). */
  issues?: readonly string[];
};

/** Resultado discriminado: obliga a comprobar `ok` antes de leer `data`. */
export type AdminApiResult<T> =
  | { ok: true; data: T; total?: number }
  | { ok: false; error: AdminApiError };

/** Listado paginado ya normalizado: `rows` siempre es un array real. */
export type AdminListResponse<T> = { rows: T[]; total: number };

/** Verbos aceptados por el cliente único del panel. */
export type AdminHttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/** Opciones de `adminFetch`. Sin cabeceras manuales: el Bearer es obligatorio. */
export type AdminFetchInit = {
  method?: AdminHttpMethod;
  body?: unknown;
  signal?: AbortSignal;
};
