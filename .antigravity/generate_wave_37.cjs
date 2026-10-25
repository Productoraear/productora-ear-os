// ═══════════════════════════════════════════════════════════════════════
// GENERADOR DE WAVE 37 — ANTIGRAVITY (ARQUITECTO)
// Ingesta de proveedores en particiones CDN (0 placeholders, verified real)
// + Captación activa de depósitos de 100 € (Stripe Price-Lock SHA-256).
// Preserva el historial `completed` de waves previas. Zona Cero intacta.
// ═══════════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');

const QUEUE = path.join(__dirname, 'tasks_queue.json');
const data = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));

const completed = Array.isArray(data.completed) ? data.completed : [];

const tasks = [
  {
    id: 'W37_T01_LEAN_EDGE_REGENERATE_VERIFIED',
    wave: 37,
    status: 'QUEUED',
    title: 'Regenerar particiones Edge CDN lean & verified (0 placeholders, teléfono real) desde el SSOT de proveedores',
    action: 'Ejecutar build_lean_verified_edge.cjs para regenerar public/data/providers/*.json filtrando SOLO proveedores con teléfono real verificable (excluye centralita +34 693 693 048 y vacíos). Después audit_placeholder_phones.cjs para confirmar placeholder=0.',
    files: [
      'scripts/build_lean_verified_edge.cjs',
      'scripts/audit_placeholder_phones.cjs',
    ],
    scaffold: '1) Ejecuta `node scripts/build_lean_verified_edge.cjs`. 2) Verifica que cada partición (finca, catering, musica, foto, decoracion, servicios, moda, transporte, sonido, wedding, senior_care) queda < 1 MB y que `verified:true` solo aparece en registros con teléfono real. 3) Ejecuta `node scripts/audit_placeholder_phones.cjs` y confirma placeholder=0 en las 11 particiones.',
    done_when: 'manifest.json regenerado con conteos reales y placeholder=0 en las 11 particiones Edge CDN.',
    test: 'node scripts/build_lean_verified_edge.cjs && node scripts/audit_placeholder_phones.cjs',
    validate: 'npx tsc --noEmit',
  },
  {
    id: 'W37_T02_PRUNE_PLACEHOLDER_AND_VERIFY_VENDORS',
    wave: 37,
    status: 'QUEUED',
    title: 'Podar placeholders/verified falso en data lakes y blindar /api/vendors contra fachadas',
    action: 'Ejecutar prune_placeholder_verified.cjs para eliminar registros con placeholder de los data lakes. Ejecutar verify_vendors_verified.cjs para garantizar que /api/vendors no reintroduce fachadas (Math.random, nombres fake) y que isVerifiablePhone excluye centralita.',
    files: [
      'scripts/prune_placeholder_verified.cjs',
      'scripts/verify_vendors_verified.cjs',
      'src/app/api/vendors/route.ts',
    ],
    scaffold: '1) Ejecuta `node scripts/prune_placeholder_verified.cjs`. 2) Ejecuta `node scripts/verify_vendors_verified.cjs`. 3) Si devuelve failed>0 (exit != 0), corrige src/app/api/vendors/route.ts para cumplir isVerifiablePhone y no reintroducir tokens prohibidos.',
    done_when: 'verify_vendors_verified.cjs devuelve failed=0 y exit code 0.',
    test: 'node scripts/verify_vendors_verified.cjs',
    validate: 'npx tsc --noEmit',
  },
  {
    id: 'W37_T03_MANIFEST_SYNC_CANONICAL',
    wave: 37,
    status: 'QUEUED',
    title: 'Sincronizar manifest.json y providers_canonical.json con los conteos reales de las particiones CDN',
    action: 'Ejecutar sync_providers_manifest.ps1 para regenerar manifest.json alineado con las particiones reales. Verificar que providers_canonical.json refleja los conteos y categorías del manifest.',
    files: [
      'scripts/sync_providers_manifest.ps1',
      'public/data/providers/manifest.json',
      'public/data/providers/providers_canonical.json',
    ],
    scaffold: '1) Ejecuta `pwsh -File scripts/sync_providers_manifest.ps1`. 2) Compara manifest.json contra los archivos *.json reales de public/data/providers/. 3) Alinea providers_canonical.json con los conteos y categorías del manifest.',
    done_when: 'manifest.json y providers_canonical.json reflejan los conteos reales de las 11 particiones (sin desalineación).',
    test: `node -e "const fs=require('fs');const m=JSON.parse(fs.readFileSync('public/data/providers/manifest.json','utf8'));let bad=0;for(const k of Object.keys(m)){const p='public/data/providers/'+k+'.json';if(!fs.existsSync(p))continue;const d=JSON.parse(fs.readFileSync(p,'utf8'));if(Array.isArray(d)&&d.length!==m[k].count){console.error('MISMATCH '+k+' manifest='+m[k].count+' real='+d.length);bad++;}}if(bad){process.exit(1);}console.log('MANIFEST_OK '+Object.keys(m).length+' particiones');"`,
    validate: 'npx tsc --noEmit',
  },
  {
    id: 'W37_T04_DEPOSIT_100_FLOW_AUDIT',
    wave: 37,
    status: 'QUEUED',
    title: 'Auditar el endpoint de depósito de 100 € para garantizar SSOT, lock atómico ACID y webhook n8n no bloqueante',
    action: "Verificar que src/app/api/reservar/solista/deposit/route.ts consume DEPOSITO_STRIPE_EUR del SSOT (sin hardcodear 100), verifica disponibilidad con checkDateAvailability (atomicDateLockEngine) y despacha fireAndForgetN8n('stripe-price-lock') no bloqueante.",
    files: [
      'src/app/api/reservar/solista/deposit/route.ts',
    ],
    scaffold: "1) Lee el archivo. 2) Confirma que DEPOSIT_CENTS deriva de `DEPOSITO_STRIPE_EUR * 100` (no literal). 3) Confirma checkDateAvailability ANTES de crear la sesión Stripe y retorno 409 en conflicto. 4) Confirma priceLockHash SHA-256 y fireAndForgetN8n('stripe-price-lock').",
    done_when: 'Sin importes hardcodeados; depósito = 10000 cts derivado del SSOT; lock atómico ACID y webhook n8n presentes.',
    test: null,
    validate: 'npx tsc --noEmit',
  },
  {
    id: 'W37_T05_RESERVAR_SOLISTA_CTA_DEPOSIT',
    wave: 37,
    status: 'QUEUED',
    title: 'Cablear el CTA de reserva de solista a la pasarela real de depósito de 100 € (Price-Lock SHA-256)',
    action: 'Verificar que src/app/reservar/solista/page.tsx enlaza el CTA de reserva al endpoint POST /api/reservar/solista/deposit y expone la garantía de depósito deducible de 100 € con verbo de valor.',
    files: [
      'src/app/reservar/solista/page.tsx',
    ],
    scaffold: '1) Lee el archivo. 2) Localiza el botón/CTA de reserva. 3) Confirma que dispara fetch a /api/reservar/solista/deposit con {fecha, formato, distanciaKm, horaFin, totalEstimado}. 4) Confirma copy con verbo de valor (Reservar Fecha con Price-Lock) y deducción íntegra del depósito.',
    done_when: 'CTA conectado al endpoint real de depósito, sin anclas vacías, con copy de valor y deducción íntegra.',
    test: null,
    validate: 'npx tsc --noEmit',
  },
  {
    id: 'W37_T06_PRICE_LOCK_ENGINE_SSOT',
    wave: 37,
    status: 'QUEUED',
    title: 'Auditar PriceLockEngine para consumir SSOT + SHA-256 y despachar n8n sin leads huérfanos',
    action: 'Verificar que src/features/finance/engine/PriceLockEngine.ts deriva el depósito del SSOT, genera hash SHA-256 y despacha a n8n stripe-price-lock de forma no bloqueante. Detectar duplicación con src/features/finance/services/PriceLockEngine.ts y consolidar si procede.',
    files: [
      'src/features/finance/engine/PriceLockEngine.ts',
      'src/features/finance/services/PriceLockEngine.ts',
    ],
    scaffold: '1) Lee ambos archivos. 2) Confirma que el motor canónico importa DEPOSITO_STRIPE_EUR de @/lib/constants/ear-os-ssot. 3) Confirma hash SHA-256. 4) Confirma despacho n8n no bloqueante sin leads huérfanos. 5) Si la copia services/ es redundante, consolida hacia engine/ y elimina la fachada.',
    done_when: 'PriceLockEngine alineado con SSOT, sin importes hardcodeados, con hash SHA-256 y despacho n8n no bloqueante.',
    test: null,
    validate: 'npx tsc --noEmit',
  }
];

data._meta = {
  version: '9.6-OMEGA-WAVE-37-PROVIDER-CDN-INGESTA-AND-DEPOSIT-CAPTURE',
  doctrine:
    'WAVE 37: INGESTA DE PROVEEDORES EN PARTICIONES CDN + CAPTACIÓN ACTIVA DE DEPÓSITOS DE 100 € — Regeneración lean & verified (0 placeholders), sincronización de manifest y blindaje del flujo de depósito Stripe Price-Lock.',
  wave: 37,
  total_tasks: tasks.length,
};
data._instructions_for_worker =
  "Ejecuta SOLO via: call RUN_OMEGA.bat next  ->  lee .antigravity/MISSION_ACTIVE.json  ->  edita SOLO 'files'  ->  call RUN_OMEGA.bat complete <ID>. El complete ya ejecuta tsc + eslint + test. 1 tarea por sesion.";
data.tasks = tasks;
data.completed = completed;
data.metadata = {
  last_updated: new Date().toISOString(),
  total_pending: tasks.length,
  current_sprint: 'WAVE_37_PROVIDER_CDN_INGESTA_AND_DEPOSIT_CAPTURE',
  ceo_mandate:
    'Ingesta de proveedores en particiones CDN (0 placeholders, verified solo con teléfono real) y captación activa de depósitos de 100 € (Stripe Price-Lock SHA-256, 100% deducible).',
};

fs.writeFileSync(QUEUE, JSON.stringify(data, null, 2), 'utf8');
console.log('[WAVE 37] Generada con ' + tasks.length + ' tareas QUEUED. Pending: ' + tasks.length);
