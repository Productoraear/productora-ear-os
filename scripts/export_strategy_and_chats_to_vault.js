/**
 * 🏛️ EAR OS - EXPORTADOR MASIVO DE ESTRATEGIA Y CHATS HISTÓRICOS A BÓVEDA
 * Exporta crónicas, transcripciones masivas (.txt -> .md) y manuales estratégicos
 * Destino: H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\01_ESTRATEGIA_Y_CHATS\
 */

import fs from 'fs';
import path from 'path';

const TARGET_DIR = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\01_ESTRATEGIA_Y_CHATS';
const DOCS_DIR = path.resolve(process.cwd(), 'docs');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

console.log('🚀 Iniciando exportación masiva a:', TARGET_DIR);

let exportedCount = 0;
let totalBytes = 0;

// 1. Archivos directos en docs
const directDocs = [
  { src: 'EAR_OS_MASTER_FULL_CHAT_CHRONICLE_SOVEREIGN.md', target: '00_EAR_OS_MASTER_FULL_CHAT_CHRONICLE_SOVEREIGN.md' },
  { src: 'EAR_OS_MASTER_CHRONICLE_AND_STATE.md', target: '00_EAR_OS_MASTER_CHRONICLE_AND_STATE.md' },
  { src: 'EAR_OS_MASTER_AUDIT_200_QUESTIONS_SSOT.md', target: '00_EAR_OS_MASTER_AUDIT_200_QUESTIONS_SSOT.md' },
  { src: 'ANTIGRAVITY_CHATS_FORENSIC_SUMMARY.md', target: '00_ANTIGRAVITY_CHATS_FORENSIC_SUMMARY.md' },
  { src: 'ANTIGRAVITY_CONTINUITY.md', target: '00_ANTIGRAVITY_CONTINUITY.md' },
  { src: 'GEMINI_3_PRO_INSTRUCTIONS.md', target: '00_GEMINI_3_PRO_INSTRUCTIONS.md' },
  { src: 'Orquestación Autónoma para Ecosistema EAR OS.md', target: '00_Orquestacion_Autonoma_Ecosistema_EAR_OS.md' },
  { src: 'VENTAJA_COMPETITIVA_MOAT.md', target: '00_VENTAJA_COMPETITIVA_MOAT.md' },
  { src: 'BRAND_MANUAL_SSOT.md', target: '00_BRAND_MANUAL_SSOT.md' },
  { src: 'MANUAL_DE_PROPIETARIO_EAR_OS_V2.md', target: '00_MANUAL_DE_PROPIETARIO_EAR_OS_V2.md' },
  // Archivos gigantes de texto convertidos a Markdown
  { src: 'c.txt', target: 'CHAT_MAESTRO_VOLUMEN_C_60MB.md', isText: true, title: 'Crónica Masiva Histórica - Volumen C' },
  { src: 'd.txt', target: 'CHAT_MAESTRO_VOLUMEN_D_21MB.md', isText: true, title: 'Crónica Masiva Histórica - Volumen D' },
  { src: 'g h l.txt', target: 'CHAT_MAESTRO_VOLUMEN_GHL_65MB.md', isText: true, title: 'Crónica Masiva Histórica - Volumen GHL' },
  { src: 'extracted_giants_summary.txt', target: 'RESUMEN_FORENSE_GIGANTES_HISTORICOS_12MB.md', isText: true, title: 'Resumen Forense Gigantes Históricos' }
];

for (const item of directDocs) {
  const srcPath = path.join(DOCS_DIR, item.src);
  const targetPath = path.join(TARGET_DIR, item.target);

  if (fs.existsSync(srcPath)) {
    const stat = fs.statSync(srcPath);
    console.log(`📦 Procesando: ${item.src} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);

    if (item.isText) {
      // Convertir a Markdown con encabezado formal
      const content = fs.readFileSync(srcPath, 'utf8');
      const mdHeader = `# 📜 ${item.title}\n**Origen:** \`docs/${item.src}\` | **Tamaño:** ${(stat.size / 1024 / 1024).toFixed(2)} MB\n**Exportado para:** Bóveda Estratégica EAR OS\n\n---\n\n\`\`\`\n`;
      const mdFooter = `\n\`\`\`\n`;
      fs.writeFileSync(targetPath, mdHeader + content + mdFooter, 'utf8');
    } else {
      fs.copyFileSync(srcPath, targetPath);
    }

    exportedCount++;
    totalBytes += stat.size;
    console.log(`  ✓ Guardado en: ${targetPath}`);
  } else {
    console.warn(`  ⚠️ No encontrado: ${srcPath}`);
  }
}

// 2. Exportar carpetas estratégicas completas de docs/
const subdirs = ['contexto_historico', 'iniciativas', 'marketing', 'crm', 'b2g', 'patentes'];

for (const sub of subdirs) {
  const subPath = path.join(DOCS_DIR, sub);
  if (fs.existsSync(subPath)) {
    const files = fs.readdirSync(subPath);
    for (const f of files) {
      if (f.endsWith('.md') || f.endsWith('.txt')) {
        const fSrc = path.join(subPath, f);
        const stat = fs.statSync(fSrc);
        const fTargetName = `${sub.toUpperCase()}_${f.replace(/\.txt$/, '.md')}`;
        const fTarget = path.join(TARGET_DIR, fTargetName);
        fs.copyFileSync(fSrc, fTarget);
        exportedCount++;
        totalBytes += stat.size;
      }
    }
  }
}

console.log('======================================================');
console.log(`✅ EXPORTACIÓN COMPLETADA`);
console.log(`Archivos transferidos: ${exportedCount}`);
console.log(`Volumen total: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`Destino confirmado: ${TARGET_DIR}`);
console.log('======================================================');
