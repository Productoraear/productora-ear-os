/**
 * OPUS_CANONICAL_QUEUE · Fusión idempotente de las 9 tareas canónicas en
 * .antigravity/tasks_queue.json. NO sobrescribe la cola viva: hace backup,
 * añade solo las IDs ausentes y conserva el historial (tasks[] y completed[]).
 * Uso: node scripts/opus_append_canonical_queue.cjs
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const QUEUE = path.join(ROOT, '.antigravity', 'tasks_queue.json');
const TSX = 'node ./node_modules/tsx/dist/cli.mjs';
const TSC = 'node ./node_modules/typescript/bin/tsc --noEmit';

const raw = fs.readFileSync(QUEUE, 'utf8');
const queue = JSON.parse(raw);
const stamp = new Date().toISOString();
const backup = `${QUEUE}.bak.opus_canonical`;
if (!fs.existsSync(backup)) fs.writeFileSync(backup, raw, 'utf8');

/** script_to_create=true => el verificador no existe aún: DeepSeek debe compilarlo en scripts/. */
const def = (id, actor, target, description, script, command, files, extra = {}) => ({
  id,
  title: description,
  status: 'PENDING',
  priority: 'P1',
  actor,
  target_file: target,
  files,
  description,
  action: description,
  verification_script: script,
  test: `${TSC} && ${command}`,
  done_when: `tsc Exit 0 + ${command} Exit 0`,
  expected_exit: 0,
  created_at: stamp,
  origin: 'OPUS_CANONICAL_QUEUE_v14.0',
  ...extra,
});

const NEW_TASKS = [
  def('TASK-001-GEO-52-PROVINCIAS', 'CLIENTE', 'src/app/reservar/solista/page.tsx',
    'Selector provincial dinámico sobre las 52 provincias sin desvíos forzados a Madrid o Toledo',
    'scripts/verify_provinces_matrix.cjs', 'node scripts/verify_provinces_matrix.cjs',
    ['src/app/reservar/solista/page.tsx', 'src/app/api/geo/acoustic-calculate/route.ts', 'src/lib/geo/geo-acoustic-radar.ts'],
    { opus_note: 'Fase 1 aplicada por Opus: useState sin default, selector ALL_SPANISH_PROVINCES, API valida SpanishProvince. Pendiente: extender a /reservar, /artistas y logística derivada de provincia.' }),
  def('TASK-002-SEATING-PLANNER-MENUS', 'CLIENTE', 'src/components/seating/**',
    'Conexión del Seating Planner (2 a 12 sillas por mesa, alérgenos) con cotización de menús oficiales (145-185€)',
    'npm run verify:seating-planner', `${TSX} scripts/verify_seating_planner.ts`,
    ['src/components/seating/', 'scripts/verify_seating_planner.ts']),
  def('TASK-003-OTZARRETA-MAITRE-RAG', 'PROVEEDOR', 'src/app/api/chat/concierge/route.ts',
    'Inyección RAG del Maître de Restaurante Otzarreta (Derio, Bizkaia): menús 145-185€, 120 plazas párking, celíacos 0€ y exclusividad',
    'scripts/verify_concierge_otzarreta.cjs', 'node scripts/verify_concierge_otzarreta.cjs',
    ['src/app/api/chat/concierge/route.ts', 'scripts/verify_concierge_otzarreta.cjs'],
    { script_to_create: true }),
  def('TASK-004-ACOUSTIC-LAW-MONITORING', 'PROVEEDOR', 'src/lib/constants/ear-os-ssot.ts',
    'Protocolo sonométrico preventivo según Ley 37/2003 (<75 dB interior, 12 W/pax). ZONA CERO: solo verificar; mutar ear-os-ssot.ts requiere autorización del CEO',
    'node scripts/verify_sonometro_pwa.cjs', 'node scripts/verify_sonometro_pwa.cjs',
    ['scripts/verify_sonometro_pwa.cjs', 'src/lib/geo/geo-acoustic-radar.ts'], { zona_cero_readonly: true }),
  def('TASK-005-ARTIST-HUB-LOGISTICS', 'ARTISTA', 'src/lib/pricing/solista-pricing.ts',
    'Logística soberana de Edwin Agudelo desde Hub Méntrida (550€ base, 100 km exentos, 1,50 €/km extra)',
    'npm run verify:logistics', `${TSX} scripts/verify_logistics_multi_origin.ts`,
    ['src/lib/pricing/solista-pricing.ts', 'scripts/verify_logistics_multi_origin.ts']),
  def('TASK-006-SSOT-ZONA-CERO-HASH', 'PUENTE', 'src/lib/constants/ear-os-ssot.ts',
    'Verificación del Sentinel Hash SHA-256 e invariantes: suelo 350€, Split 80/10/10, fianza 100€, B2G 14.250€. Solo lectura',
    'npm run audit:ssot', `${TSX} scripts/baseline_ssot_integrity.ts`,
    ['scripts/baseline_ssot_integrity.ts'], { zona_cero_readonly: true }),
  def('TASK-007-ANTI-CRASH-CONCURRENCY', 'PUENTE', 'src/app/api/reservar/solista/deposit/route.ts',
    'Resiliencia ante 100 llamadas simultáneas: 0 errores 500 no tipados y anti-overbooking 1-win/99-block (409)',
    'scripts/audit_estres_estadio.mjs', 'node scripts/audit_estres_estadio.mjs',
    ['src/app/api/reservar/solista/deposit/route.ts', 'scripts/audit_estres_estadio.mjs']),
  def('TASK-008-DLP-SECRETS-AUDIT', 'PUENTE', 'src/**',
    'Auditoría DLP: 0 variables de servidor (STRIPE_SECRET_KEY, DB URLs) en componentes client-side',
    'npm run audit:public-secrets', 'node scripts/audit_public_secret_leaks.cjs',
    ['scripts/audit_public_secret_leaks.cjs']),
  def('TASK-009-AUTONOMOUS-AST-SCANNER', 'PUENTE', 'scripts/engine_autonomous_deep_audit.cjs',
    'Arnés de recorrido recursivo del árbol completo sin límites predefinidos de aserciones',
    'scripts/engine_autonomous_deep_audit.cjs', 'node scripts/engine_autonomous_deep_audit.cjs',
    ['scripts/engine_autonomous_deep_audit.cjs'], { script_to_create: true }),
];

const existing = new Set(queue.tasks.map((t) => t.id));
let added = 0;
for (const t of NEW_TASKS) {
  if (!existing.has(t.id)) {
    queue.tasks.push(t);
    added += 1;
  }
}

queue.project = 'EAR_OS_V2_INDUSTRIAL_REFACTOR';
queue.opus_canonical = {
  version: '14.0_OPUS_CANONICAL',
  timestamp: stamp,
  actors_covered: ['CLIENTE', 'PROVEEDOR_ARTISTA', 'PUENTE_EAR_OS'],
  task_ids: NEW_TASKS.map((t) => t.id),
  note: 'Fusionado sin destruir la cola viva. Verificadores con script_to_create=true los compila DeepSeek en scripts/.',
};

const out = JSON.stringify(queue, null, 2) + '\n';
fs.writeFileSync(QUEUE, out, 'utf8');
const sha = crypto.createHash('sha256').update(out).digest('hex');
console.log(`ADDED=${added} TOTAL_TASKS=${queue.tasks.length} SHA256=${sha}`);
