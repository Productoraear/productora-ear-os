import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// 🔒 GUARDA DE SEGURIDAD ABSOLUTA S-CLASS: Lista de exclusión inmutable
const PROTECTED_ASSETS = [
  'EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md',
  'CLINE_OMEGA_KERNEL.md',
  '.env.production',
  'schema.prisma',
  'route.ts'
];

// 📊 Matriz de asignación de Gravedad Asistida autorizada
const MIGRATION_LEDGER = [
  { id: "ACT-001", src: "auditoria_forense_files.csv", dest: "data_vault/audits/auditoria_forense_files.csv" },
  { id: "ACT-002", src: "waybill_legacy.html", dest: "quarantine/legacy_html/waybill_legacy.html" },
  { id: "ACT-003", src: "tsc_errors.txt", dest: "logs/compilation_history/tsc_errors.txt" },
  { id: "ACT-004", src: "google_business_posts_drafts.md", dest: "docs/marketing/google_business_posts_drafts.md" },
  { id: "ACT-005", src: "_ALMACEN_DE_CUARENTENA_6M", dest: "quarantine/vault_purged" }
];

console.log('🏛️ EAR OS: INICIANDO OPERACIÓN QUIRÚRGICA FASE 207.B.1');
console.log('══════════════════════════════════════════════════════════');

let executed = 0;
let failures = 0;

MIGRATION_LEDGER.forEach(({ id, src, dest }) => {
  const sourcePath = path.join(ROOT_DIR, src);
  const targetPath = path.join(ROOT_DIR, dest);

  // Guardrail 1: Interceptación preventiva ante intentos de manipulación de archivos core
  if (PROTECTED_ASSETS.includes(src)) {
    console.error(`🛑 [VETO] INTENTO DE VIOLACIÓN DE SEGURIDAD DETECTADO EN ACALDE: ${src}`);
    failures++;
    return;
  }

  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️ [${id}] OMITIDO: El activo [${src}] no reside en la raíz. Sincronización previa asumida.`);
    return;
  }

  try {
    const targetDir = path.dirname(targetPath);
    
    // Crear el contenedor gravitacional de forma recursiva si no existe en el metal
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Mutación atómica a nivel de sistema de archivos
    fs.renameSync(sourcePath, targetPath);
    console.log(`✅ [${id}] PROCESADO: ${src} ➔ ${dest}`);
    executed++;
  } catch (err) {
    console.error(`❌ [${id}] ERROR CRÍTICO durante la transmutación de ${src}: ${err.message}`);
    failures++;
  }
});

console.log('══════════════════════════════════════════════════════════');
console.log(`📊 BALANCE FINAL: ${executed} operaciones exitosas | ${failures} fallos detectados.`);

if (failures === 0) {
  console.log('🟢 OPERACIÓN ATÓMICA EXITOSA. EL WORKSPACE HA SIDO PURGADO CON ÉXITO.');
  process.exit(0);
} else {
  console.error('🛑 VETO ESTRATÉGICO ACTIVADO: Se registraron anomalias en el Filesystem. Detener pipeline.');
  process.exit(1);
}
