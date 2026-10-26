/**
 * Barrel del dominio de búsqueda unificado.
 * Importa SIEMPRE desde `@/lib/search` — nunca desde rutas sueltas,
 * para que exista un único punto de verdad (cero buscadores duplicados).
 */
export * from './unified-search-kernel';
