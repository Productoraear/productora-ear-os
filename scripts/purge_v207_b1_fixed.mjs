import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PROTECTED_ASSETS = [
  'EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md',
  'CLINE_OMEGA_KERNEL.md',
  '.env.production',
  'schema.prisma',
  'route.ts'
];

const MIGRATION_LEDGER = [
  { id: "ACT-001", src: "auditoria_forense_files.csv", dest: path.join(ROOT_DIR, "data_vault/audits/auditoria_forense_files.csv") },
  { id: "ACT-002", src: "waybill_legacy.html", dest: path.join(ROOT_DIR, "quarantine/legacy_html/waybill_legacy.html") },
  { id: "ACT-003", src: "tsc_errors.txt", dest: path.join(ROOT_DIR, "logs/compilation_history/tsc_errors.txt") },
  { id: "ACT-004", src: "google_business_posts_drafts.md", dest: path.join(ROOT_DIR, "docs/marketing/google_business_posts_drafts.md") },
  { id: "ACT-005", src: "quarantine/vault_purged", dest: "C:\\99_CUARENTENA_EAR_OS\\vault_purged_2026_05_18" }
];

console.log('🏛️ EAR OS: RE-EJECUTANDO PURGA FÍSICA FASE 207.B.2.C (EXTRACCIÓN ABSOLUTA)');
let executed = 0;
let failures = 0;

MIGRATION_LEDGER.forEach(({ id, src, dest }) => {
  const sourcePath = path.isAbsolute(src) ? src : path.join(ROOT_DIR, src);
  const targetPath = path.isAbsolute(dest) ? dest : path.join(ROOT_DIR, dest);

  if (PROTECTED_ASSETS.includes(path.basename(src))) {
    console.error(`🛑 [VETO] INTENTO DE VIOLACIÓN DE SEGURIDAD DETECTADO: ${src}`);
    failures++;
    return;
  }

  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️ [${id}] OMITIDO: El activo [${src}] no existe.`);
    return;
  }

  try {
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.renameSync(sourcePath, targetPath);
    console.log(`✅ [${id}] PROCESADO: ${src} ➔ ${dest}`);
    executed++;
  } catch (err) {
    console.error(`❌ [${id}] ERROR CRÍTICO durante la transmutación de ${src}: ${err.message}`);
    failures++;
  }
});

console.log(`📊 BALANCE FINAL: ${executed} operaciones exitosas | ${failures} fallos detectados.`);

if (failures === 0) {
  console.log('🟢 OPERACIÓN ATÓMICA EXITOSA. LEGACY EXTRAÍDO DEL WORKSPACE.');
  process.exit(0);
} else {
  console.error('🛑 VETO ESTRATÉGICO ACTIVADO.');
  process.exit(1);
}
