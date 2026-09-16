import fs from 'fs';
import path from 'path';

const VAULT_CHATS_DIR = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\01_ESTRATEGIA_Y_CHATS';

console.log('================================================================');
console.log('🏛️ EAR OS // AUDITORÍA Y ACTUALIZACIÓN DE BÓVEDA DE CHATS');
console.log('Ruta:', VAULT_CHATS_DIR);
console.log('================================================================');

if (!fs.existsSync(VAULT_CHATS_DIR)) {
  console.error(`[ERROR] No se encuentra el directorio: ${VAULT_CHATS_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(VAULT_CHATS_DIR).filter(f => !f.startsWith('.'));
console.log(`\n📁 [INVENTARIO EN BÓVEDA] ${files.length} archivos detectados:`);

let targetFile = null;
let candidates = [];

for (const file of files) {
  const fullPath = path.join(VAULT_CHATS_DIR, file);
  const stat = fs.statSync(fullPath);
  const sizeKb = stat.size / 1024;
  const sizeMb = sizeKb / 1024;
  console.log(`   - ${file.padEnd(50)} | ${sizeKb.toFixed(1).padStart(10)} KB | ${sizeMb.toFixed(2).padStart(6)} MB`);

  // Detectar archivos relacionados con crónicas de chat / estrategia o cercanos a 6887 KB
  if (
    file.includes('CHRONICLE') ||
    file.includes('CHAT') ||
    file.includes('ANTIGRAVITY') ||
    file.includes('MEGA_EXPORT') ||
    Math.abs(sizeKb - 6887) < 1500
  ) {
    candidates.push({ file, fullPath, size: stat.size, sizeKb });
  }
}

// Elegir el archivo objetivo principal
if (candidates.length > 0) {
  // Ordenar por cercanía a 6887 KB o por nombre maestro
  candidates.sort((a, b) => Math.abs(a.sizeKb - 6887) - Math.abs(b.sizeKb - 6887));
  targetFile = candidates[0];
  console.log(`\n🎯 [ARCHIVO IDENTIFICADO]: ${targetFile.file}`);
  console.log(`   Tamaño previo: ${targetFile.sizeKb.toFixed(2)} KB (${targetFile.size} bytes)`);
} else {
  // Fallback: usar el primer archivo de crónica disponible
  targetFile = {
    file: '00_EAR_OS_MASTER_FULL_CHAT_CHRONICLE_SOVEREIGN.md',
    fullPath: path.join(VAULT_CHATS_DIR, '00_EAR_OS_MASTER_FULL_CHAT_CHRONICLE_SOVEREIGN.md'),
    size: 0,
    sizeKb: 0
  };
}

const CHRONICLE_UPDATE = `

================================================================================
🏛️ HITO DE ARQUITECTURA S-CLASS: PILAR I — OMNI-COCKPIT CENTRAL & ORÁCULO
TIMESTAMP: ${new Date().toISOString()} | REPO: EAR_OS_V2 | MODO: BARE-METAL SOBERANO
================================================================================

1. DEMOLICIÓN Y PURGA DE RUTAS OBSOLETAS (EXIT CODE 0):
   - Eliminación total de 'src/app/(nexus)/admin/' (15 subcarpetas obsoletas y layout redundante erradicados).
   - Eliminación total de 'src/app/(public)/admin/' (eliminado conflicto de colisión en App Router de Next.js).
   - Unificación de todo el gobierno administrativo bajo la partición protegida 'src/app/(admin)/'.

2. COMPONENTE ORÁCULO S-CLASS ('src/components/admin/OracleAmbientInterface.tsx'):
   - Interfaz centinela minimalista flotante en 'fixed bottom-6 right-6 z-50'.
   - Estética OLED '#050508' con glow ambiental dorado '#ecb613' (30% opacidad, desenfoque radial).
   - Telemetría activa SSOT:
     * Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME.
     * Price-Lock Stripe: Depósito inmutable de 100,00 € con token criptográfico SHA-256.
     * Contratación Menor B2G: Límite preventivo Art. 118 LCSP < 14.250,00 € y acústico < 75 dB SPL.

3. SIDEBAR MAESTRA DE DOMINANCIA ('src/app/(admin)/layout.tsx'):
   - Barra lateral colapsable dinámica (transición 'w-72' a 'w-20').
   - 10 Módulos de gobierno integral:
     1. Omni-Cockpit Central (/admin) [CORE]
     2. Scala Leads & Sourcing (/admin/sourcing) [LEADS]
     3. Proveedores Directorio 26K+ (/admin/proveedores) [26.4K]
     4. Flota & Logística en Vivo (/admin/flota) [KM 0]
     5. Red de Afiliados (/admin/afiliados) [SPLIT]
     6. B2G & Licitaciones <14.250€ (/admin/licitaciones) [LEGAL]
     7. Tesorería & Depósitos Stripe (/admin/tesoreria) [100€]
     8. Voice Studio IA (/admin/voice-studio) [GPU]
     9. Telemetría Bare-Metal (/admin/telemetria) [OLLAMA]
     10. Centro de Mando & Skills (/admin/command-center) [ROOT]
   - Integración nativa del componente OracleAmbientInterface en layout raíz.

4. OMNI-COCKPIT MASTER DASHBOARD ('src/app/(admin)/page.tsx'):
   - Grid de 4 tarjetas KPI de alta fidelidad:
     * 26.418 Proveedores indexados en Data Lake local (+100% Soberano).
     * 100,00 € Depósito Stripe (Price-Lock 48h).
     * 1,50 €/km Logística Méntrida Km 0 (>50km + 120€ hotel >200km o >3:00 AM).
     * < 14.250 € Licitaciones Menores Festejos B2G (<75 dB SPL).
   - Accesos directos a prospección continua Scala Leads, inferencia Voice Studio y telemetría de inferencia local.

5. BLINDAJE DE SEGURIDAD EN EDGE ('src/middleware.ts'):
   - Verificación de sesión administrativa obligatoria: 'admin_session' || 'ear_session' || 'ear_admin_token'.
   - Redirección automática no-cache a '/login' para accesos no autenticados en producción.
   - Bloqueo anti-scraping para bots en rutas '/api/'.

6. RESOLUCIÓN DE TIPOS Y COMPILACIÓN (EXIT CODE 0):
   - Purga de artefactos cacheados en '.next/' tras la eliminación de las rutas viejas.
   - Validación integral TypeScript: 'npx tsc --noEmit' -> Exit Code 0.
================================================================================
`;

// Realizar append
fs.appendFileSync(targetFile.fullPath, CHRONICLE_UPDATE, 'utf8');

// Medir tamaño resultante
const updatedStat = fs.statSync(targetFile.fullPath);
const newSizeKb = updatedStat.size / 1024;
const deltaBytes = updatedStat.size - targetFile.size;
const deltaKb = deltaBytes / 1024;

console.log('\n================================================================');
console.log('✅ [ACTUALIZACIÓN COMPLETADA CON ÉXITO]');
console.log(`Archivo Actualizado:  ${targetFile.file}`);
console.log(`Ruta Absoluta:        ${targetFile.fullPath}`);
console.log(`Tamaño Anterior:      ${targetFile.sizeKb.toFixed(2)} KB`);
console.log(`Tamaño Resultante:    ${newSizeKb.toFixed(2)} KB`);
console.log(`INCREMENTO REGISTRADO: +${deltaKb.toFixed(2)} KB (+${deltaBytes} bytes)`);
console.log('================================================================\n');
