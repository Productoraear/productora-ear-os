/**
 * ════════════════════════════════════════════════════════════════════════════════
 * CATÁLOGO FORMAL DE SCRIPTS DE OPERACIONES & RESILIENCIA (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════════
 * Clasificación canónica en 5 categorías para el Admin CEO y automatización de
 * mantenimiento del ecosistema.
 */

export type ScriptCategory =
  | 'runtime_resilience'
  | 'type_sanity'
  | 'database_seeds'
  | 'payments_webhooks'
  | 'maintenance_housekeeping';

export interface SystemScriptItem {
  id: string;
  name: string;
  command: string;
  category: ScriptCategory;
  description: string;
  badge: string;
  isDangerous?: boolean;
}

export const ADMIN_SYSTEM_SCRIPTS: readonly SystemScriptItem[] = Object.freeze([
  // ── 1. RESUCITADOR & EMERGENCIAS (RUNTIME RESILIENCE) ────────────────────────
  {
    id: 'res_ports_purge',
    name: 'Desbloquear Puerto 3007 & Node',
    command: 'powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force"',
    category: 'runtime_resilience',
    description: 'Mata procesos zombies de Node y Turbopack colgados en el puerto de desarrollo.',
    badge: 'Urgente',
    isDangerous: true,
  },
  {
    id: 'res_clean_cache',
    name: 'Vaciar Caché .next',
    command: 'powershell -Command "Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue"',
    category: 'runtime_resilience',
    description: 'Elimina artefactos de build corruptos de Turbopack sin tocar código fuente.',
    badge: 'Caché',
  },
  {
    id: 'res_full_rescue',
    name: 'Ejecutar Rescate Completo (rescue.ps1)',
    command: 'powershell -ExecutionPolicy Bypass -File ./scripts/rescue.ps1',
    category: 'runtime_resilience',
    description: 'Protocolo de Nivel 0: purga de puertos, vaciado de caché y reactivación.',
    badge: 'Pánico',
    isDangerous: true,
  },

  // ── 2. SANIDAD DE CÓDIGO & TIPADO (TYPE SANITY) ─────────────────────────────
  {
    id: 'type_check_full',
    name: 'Comprobación de Tipos (tsc)',
    command: 'npm run typecheck',
    category: 'type_sanity',
    description: 'Ejecuta tsc --noEmit con 6GB de memoria para validar 0 errores de tipado.',
    badge: 'Exit 0',
  },
  {
    id: 'type_audit_ssot',
    name: 'Auditoría de Integridad SSOT',
    command: 'npm run audit:ssot',
    category: 'type_sanity',
    description: 'Verifica que las constantes canónicas y el hash SHA-256 no hayan mutado.',
    badge: 'Zona Cero',
  },
  {
    id: 'type_verify_pricing',
    name: 'Verificar Fórmulas de Pricing (31/31)',
    command: 'npm run verify:pricing',
    category: 'type_sanity',
    description: 'Valida la unificación de tarifas (350 € + 1,50 €/km) y contratos financieros.',
    badge: 'Precios',
  },

  // ── 3. BASE DE DATOS & SEMILLAS (DATABASE & SEEDS) ──────────────────────────
  {
    id: 'db_seed_b2g',
    name: 'Semilla Nacional B2G (Ayuntamientos)',
    command: 'npm run seed:b2g',
    category: 'database_seeds',
    description: 'Inyecta datos de municipios y expedientes Art. 118 LCSP en la base de datos.',
    badge: 'B2G',
  },
  {
    id: 'db_sync_fichas',
    name: 'Sincronizar Fichas a PostgreSQL',
    command: 'npm run db:fichas:sync',
    category: 'database_seeds',
    description: 'Sube las fichas validadas de proveedores desde disco hacia la base de datos.',
    badge: 'Fichas',
  },
  {
    id: 'db_generate_prisma',
    name: 'Prisma Client Generate',
    command: 'npx prisma generate',
    category: 'database_seeds',
    description: 'Regenera los tipos de Prisma Client según el esquema de PostgreSQL.',
    badge: 'Prisma',
  },

  // ── 4. DESPLIEGUE & PASARELAS (SHIP & WEBHOOKS) ─────────────────────────────
  {
    id: 'pay_simulate_whatsapp',
    name: 'Simular Agente de WhatsApp & Webhooks',
    command: 'npm run simulate:whatsapp',
    category: 'payments_webhooks',
    description: 'Ejecuta la prueba de despacho de alertas hacia Telegram y pasarelas n8n.',
    badge: 'WhatsApp',
  },
  {
    id: 'pay_audit_landings',
    name: 'Auditar Atribución de Landings y Fianza',
    command: 'npm run attribution:audit',
    category: 'payments_webhooks',
    description: 'Comprueba que cada botón de depósito de 100 € conecte con el Stripe Price-Lock.',
    badge: 'Stripe 100 €',
  },

  // ── 5. HIGIENE & MANTENIMIENTO (HOUSEKEEPING) ────────────────────────────────
  {
    id: 'hk_landings_all',
    name: 'Reconstruir Landings de Dominancia',
    command: 'npm run landings:all',
    category: 'maintenance_housekeeping',
    description: 'Regenera landings de Otzarreta, Centralita Mariachis y EAR Eventos.',
    badge: 'Landings',
  },
  {
    id: 'hk_audit_contrast',
    name: 'Auditoría de Accesibilidad & Contraste WCAG',
    command: 'npm run audit:contrast:core',
    category: 'maintenance_housekeeping',
    description: 'Audita los ratios de contraste AA en las 10 rutas principales.',
    badge: 'WCAG',
  },
] as const);

export const SCRIPT_CATEGORY_METADATA: Record<
  ScriptCategory,
  { label: string; iconName: string; color: string; desc: string }
> = {
  runtime_resilience: {
    label: 'Resucitador & Emergencias',
    iconName: 'Flame',
    color: '#FF2B44',
    desc: 'Desbloqueo de puertos zombies (3007), purga de caché .next y resucitación.',
  },
  type_sanity: {
    label: 'Sanidad de Código & Tipos',
    iconName: 'ShieldCheck',
    color: '#00E5FF',
    desc: 'Verificaciones tsc, validación de Zona Cero SSOT y tarifas inmutables.',
  },
  database_seeds: {
    label: 'Base de Datos & Semillas',
    iconName: 'Database',
    color: '#ecb613',
    desc: 'Sincronización de fichas, semillas B2G y regeneración de esquemas Prisma.',
  },
  payments_webhooks: {
    label: 'Pasarelas & Webhooks',
    iconName: 'CreditCard',
    color: '#10B981',
    desc: 'Simulación de agentes WhatsApp, checkout Stripe 100 € y trazabilidad.',
  },
  maintenance_housekeeping: {
    label: 'Higiene & Mantenimiento',
    iconName: 'Sparkles',
    color: '#A78BFA',
    desc: 'Reconstrucción de landings de dominancia y auditorías estéticas.',
  },
};
