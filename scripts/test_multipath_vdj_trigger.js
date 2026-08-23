/**
 * 🎧 EAR OS — MULTI-PATH VDJ TRIGGER SIMULATOR v4.17
 * Prueba la captura simultánea en Documentos Locales y Documentos OneDrive.
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { processHistoryFile } = require('./ear_session_watcher');

const HOME = os.homedir();

const localHistoryDir    = path.join(HOME, 'Documents', 'VirtualDJ', 'History');
const oneDriveHistoryDir = path.join(HOME, 'OneDrive', 'Documents', 'VirtualDJ', 'History');

// Crear carpetas
[localHistoryDir, oneDriveHistoryDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const m3uLocal = `#EXTM3U\n#EXTVDJ:<DECK 1>\n#EXTINF:275,Adalberto Santiago - Dios Me Libre\nG:\\\\Adalberto Santiago - Super Apollo 47_50 - 01-05 Dios Me Libre.flac\n#EXTINF:250,Adalberto Santiago - Vigilándote\nG:\\\\Adalberto Santiago - Super Apollo 47_50 - 01-01 Vigilándote.flac\n`;
const m3uOneDrive = `#EXTM3U\n#EXTVDJ:<DECK 2>\n#EXTINF:310,Adalberto Santiago - Sabroso (Cantando)\nG:\\\\Adalberto Santiago - Super Apollo 47_50 - 01-02 Sabroso (Cantando).flac\n#EXTINF:245,Adalberto Santiago - Campanera\nG:\\\\Adalberto Santiago - Super Apollo 47_50 - 01-03 Campanera.flac\n`;

const fileLocal    = path.join(localHistoryDir, '2026-08-23_LOCAL_SIM.m3u');
const fileOneDrive = path.join(oneDriveHistoryDir, '2026-08-23_ONEDRIVE_SIM.m3u');

console.log('═══════════════════════════════════════════════════════════════');
console.log('  🎧 EAR OS — PRUEBA DE DISPARO FORZADO MULTI-RUTA (v4.17)');
console.log('═══════════════════════════════════════════════════════════════');

console.log('[1/2] Escribiendo archivo en ruta Local:', fileLocal);
fs.writeFileSync(fileLocal, m3uLocal, 'utf-8');
processHistoryFile(fileLocal);

console.log('\n[2/2] Escribiendo archivo en ruta OneDrive:', fileOneDrive);
fs.writeFileSync(fileOneDrive, m3uOneDrive, 'utf-8');
processHistoryFile(fileOneDrive);

console.log('\n───────────────────────────────────────────────────────────────');
const desktopFiles = fs.readdirSync(path.join(HOME, 'Desktop')).filter(f => f.includes('EAR_OS_SESION_') || f.includes('EAR_OS_VDJ_'));
const certFiles = fs.readdirSync(path.join(HOME, '.ear-os', 'certificates'));

console.log('💻 Actas generadas en el Escritorio:', desktopFiles.length, 'archivos');
desktopFiles.slice(-4).forEach(f => console.log(`   ✓ Desktop\\${f}`));

console.log('\n🏛️ Certificados archivados en Bóveda:', certFiles.length, 'actas');
certFiles.slice(-4).forEach(f => console.log(`   ✓ ~/.ear-os/certificates/${f}`));
console.log('═══════════════════════════════════════════════════════════════\n');
