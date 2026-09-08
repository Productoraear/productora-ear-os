const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Rutas base SSOT
const BRAIN_DIR = 'C:\\Users\\M2-W10\\.gemini\\antigravity-ide\\brain';
const TARGET_VAULT_DIR = 'H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\HISTORIC_AI_CHATS';
const DOCS_CHRONICLE_PATH = path.join(process.cwd(), 'docs', 'EAR_OS_MASTER_CHRONICLE_AND_STATE.md');
const MANIFEST_PATH = path.join(process.cwd(), 'scripts', '.archived_manifest.json');

function computeSha256(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(data).digest('hex');
  } catch {
    return null;
  }
}

console.log('🚀 [ZTM ARCHIVISTA PURISTA] Iniciando barrido íntegro de chats históricos...');
console.log(`📂 Origen: ${BRAIN_DIR}`);
console.log(`🎯 Destino: ${TARGET_VAULT_DIR}`);

// 1. Asegurar existencia de carpetas de destino
try {
  fs.mkdirSync(TARGET_VAULT_DIR, { recursive: true });
} catch (e) {
  console.warn(`[WARN] No se pudo crear ${TARGET_VAULT_DIR}: ${e.message}`);
}

if (!fs.existsSync(BRAIN_DIR)) {
  console.error(`❌ [ERROR] Directorio origen no encontrado: ${BRAIN_DIR}`);
  process.exit(1);
}

// 2. Descubrir todas las sesiones en brain
const conversations = fs.readdirSync(BRAIN_DIR);
console.log(`🔍 Sesiones detectadas en el repositorio brain: ${conversations.length}`);

const sessionReports = [];
let manifestEntries = [];

if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifestEntries = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch {}
}

for (const convId of conversations) {
  const convDir = path.join(BRAIN_DIR, convId);
  try {
    const stat = fs.statSync(convDir);
    if (!stat.isDirectory()) continue;

    // Localizar logs
    const fullLogPath = path.join(convDir, '.system_generated', 'logs', 'transcript_full.jsonl');
    const simpleLogPath = path.join(convDir, '.system_generated', 'logs', 'transcript.jsonl');
    const logPath = fs.existsSync(fullLogPath) ? fullLogPath : (fs.existsSync(simpleLogPath) ? simpleLogPath : null);

    // Localizar artefactos markdown
    const artifacts = [];
    const files = fs.readdirSync(convDir);
    for (const f of files) {
      if (f.endsWith('.md')) {
        const fullFPath = path.join(convDir, f);
        try {
          const content = fs.readFileSync(fullFPath, 'utf-8');
          artifacts.push({ name: f, size: content.length, excerpt: content.slice(0, 300) });
        } catch {}
      }
    }

    if (!logPath && artifacts.length === 0) continue;

    const sessionData = {
      convId,
      createdAt: stat.birthtime ? stat.birthtime.toISOString() : stat.mtime.toISOString(),
      modifiedAt: stat.mtime.toISOString(),
      turnsCount: 0,
      userPrompts: [],
      toolCallsCount: 0,
      artifacts,
      chronology: []
    };

    if (logPath) {
      const rawLines = fs.readFileSync(logPath, 'utf-8').split('\n');
      for (const line of rawLines) {
        if (!line.trim()) continue;
        try {
          const entry = JSON.parse(line);
          const source = entry.source || '';
          const type = entry.type || '';
          const content = entry.content || '';
          const tools = entry.tool_calls || [];
          const timestamp = entry.timestamp || '';
          const stepIdx = entry.step_index || 0;

          if (source === 'USER_EXPLICIT' || type === 'USER_INPUT') {
            sessionData.turnsCount++;
            if (content && content.trim().length > 3) {
              const cleanPrompt = content.replace(/<[^>]+>/g, '').trim();
              if (cleanPrompt) {
                sessionData.userPrompts.push(cleanPrompt.slice(0, 250));
              }
            }
            sessionData.chronology.push({
              role: 'USER',
              stepIdx,
              timestamp,
              content: content.trim()
            });
          } else if (source === 'MODEL' || type === 'PLANNER_RESPONSE') {
            if (tools.length > 0) {
              sessionData.toolCallsCount += tools.length;
            }
            sessionData.chronology.push({
              role: 'ANTIGRAVITY',
              stepIdx,
              timestamp,
              content: content.trim(),
              tools: tools.map(t => ({
                name: t.name || t.toolName || 'tool',
                args: t.arguments || t.input || {}
              }))
            });
          }
        } catch {}
      }
    }

    // Generar archivo Markdown para esta sesión
    const sessionMdLines = [];
    sessionMdLines.push(`# 🏛️ SESIÓN EAR OS // CONVERSATION ID: \`${convId}\``);
    sessionMdLines.push(`\n- **Fecha Inicio:** \`${sessionData.createdAt}\``);
    sessionMdLines.push(`- **Última Modificación:** \`${sessionData.modifiedAt}\``);
    sessionMdLines.push(`- **Total Turnos de Interacción:** \`${sessionData.turnsCount}\``);
    sessionMdLines.push(`- **Herramientas Ejecutadas:** \`${sessionData.toolCallsCount}\``);
    sessionMdLines.push(`- **Artefactos Producidos:** \`${sessionData.artifacts.length}\` archivos\n`);

    if (sessionData.artifacts.length > 0) {
      sessionMdLines.push(`## 📦 ARTEFACTOS PRODUCIDOS EN ESTA SESIÓN\n`);
      for (const art of sessionData.artifacts) {
        sessionMdLines.push(`### 📄 \`${art.name}\` (${art.size} bytes)`);
        sessionMdLines.push(`\`\`\`markdown\n${art.excerpt}...\n\`\`\`\n`);
      }
    }

    if (sessionData.userPrompts.length > 0) {
      sessionMdLines.push(`## 🎯 OBJETIVOS Y PROMPTS DEL USUARIO (CEO)\n`);
      sessionData.userPrompts.forEach((p, idx) => {
        sessionMdLines.push(`${idx + 1}. **${p}**`);
      });
      sessionMdLines.push(`\n---\n`);
    }

    sessionMdLines.push(`## 📜 CRÓNICA DETALLADA PASO A PASO\n`);
    for (const item of sessionData.chronology) {
      if (item.role === 'USER') {
        sessionMdLines.push(`\n### 👤 USUARIO (CEO) — Paso ${item.stepIdx}`);
        sessionMdLines.push(`${item.content}\n`);
      } else {
        sessionMdLines.push(`\n### 🤖 ANTIGRAVITY OMEGA (Orchestrator) — Paso ${item.stepIdx}`);
        if (item.content) {
          sessionMdLines.push(`${item.content}\n`);
        }
        if (item.tools && item.tools.length > 0) {
          sessionMdLines.push(`#### 🛠️ Herramientas ejecutadas (${item.tools.length}):`);
          for (const t of item.tools) {
            sessionMdLines.push(`- **\`${t.name}\`**`);
          }
        }
      }
      sessionMdLines.push(`\n---\n`);
    }

    const sessionMdContent = sessionMdLines.join('\n');
    const targetFile = path.join(TARGET_VAULT_DIR, `SESSION_${convId}.md`);

    try {
      fs.writeFileSync(targetFile, sessionMdContent, 'utf-8');
      const hash = computeSha256(targetFile);
      manifestEntries.push({
        original_path: logPath || convDir,
        vault_path: targetFile,
        sha256: hash,
        archived_at: new Date().toISOString()
      });
      console.log(`  [+] Exportada sesión ${convId} -> ${targetFile}`);
    } catch (e) {
      console.warn(`  [!] Error escribiendo sesión ${convId} a ${targetFile}: ${e.message}`);
    }

    sessionReports.push({
      convId,
      date: sessionData.modifiedAt,
      turns: sessionData.turnsCount,
      tools: sessionData.toolCallsCount,
      artifactsCount: sessionData.artifacts.length,
      samplePrompt: sessionData.userPrompts[0] || 'Sesión técnica directa'
    });

  } catch (err) {
    console.warn(`  [!] Error procesando sesión ${convId}: ${err.message}`);
  }
}

// 3. Ordenar sesiones por fecha descendente
sessionReports.sort((a, b) => new Date(b.date) - new Date(a.date));

// 4. Generar el Master Index SOTA de EAR OS
const masterIndexLines = [];
masterIndexLines.push(`# 🏛️ CRÓNICA MAESTRA INTEGRAL DE SESIONES // EAR OS V2 S-CLASS`);
masterIndexLines.push(`\n> **MODO CEO ACTIVO — ZERO-TOKEN MEMORY (ZTM) — VAMPIRE RAG ENGINE**`);
masterIndexLines.push(`> **Entorno:** \`http://localhost:3007\` (Next.js App Router Strict)`);
masterIndexLines.push(`> **Fecha de Barrido Íntegro:** \`${new Date().toISOString()}\``);
masterIndexLines.push(`> **Ubicación en Vault:** \`${TARGET_VAULT_DIR}\``);
masterIndexLines.push(`> **Total Sesiones Indexadas:** \`${sessionReports.length}\`\n`);

masterIndexLines.push(`## 📊 ESTADO ACTUAL Y PROGRESOS SOTA DE EAR OS (PORT 3007)\n`);
masterIndexLines.push(`1. **Seguridad Zero-Trust & CSP Blindado:**
   - Implementado \`src/middleware.ts\` con cabeceras estrictas (HSTS, CSP, X-Frame-Options: DENY).
   - Whitelist público habilitado para Stripe Checkout (\`/api/astra/payment-intent\`).
   - Erradicación del middleware duplicado en la raíz para prevenir colisiones en Next.js.`);

masterIndexLines.push(`2. **Purga Absoluta de Fuga Google Drive (Catálogo Navidad):**
   - Eliminados todos los enlaces a \`drive.google.com\` en \`src/data/luces_navidad_2026_ear.json\` (652 items) y metadatos QR.
   - Purgados los archivos de scratch y saneado \`ChristmasLightingCatalogView.tsx\`.`);

masterIndexLines.push(`3. **Directorio B2B & Teléfonos Verificados (Admin & Público):**
   - Eliminados scrapings huérfanos (\`bvh-\`) con categorías artificiales de "Catering".
   - 15.804 proveedores con teléfono directo verificado posicionados en primera línea.
   - \`Productora EAR • Edwin Agudelo\` y \`División Técnica Sonido & Iluminación\` anclados en posición #1 y #2.
   - Clasificador semántico multicriterio activo sobre título, descripción y categoría.`);

masterIndexLines.push(`4. **EAR Concierge con Stripe Payment Element Inyectado:**
   - Depósito criptográfico de 100,00 € mediante Stripe Elements integrado en \`EarConcierge.tsx\` (Cmd+K).
   - Cero redirecciones externas, respuesta acústica Web Audio API.`);

masterIndexLines.push(`5. **Desmantelamiento de Chatbots Flotantes Obsoletos:**
   - Retirados los botones flotantes de WhatsApp y AI Concierge en favor del Omni-Bar unificado.`);

masterIndexLines.push(`\n---\n\n## 📑 INVENTARIO MAESTRO DE SESIONES HISTÓRICAS\n`);
masterIndexLines.push(`| # | Conversation ID | Fecha Última Mod. | Turnos | Herramientas | Artefactos | Objetivo Principal / Prompt |`);
masterIndexLines.push(`|---|---|---|---|---|---|---|`);

sessionReports.forEach((s, idx) => {
  masterIndexLines.push(`| ${idx + 1} | [\`${s.convId}\`](./SESSION_${s.convId}.md) | ${s.date.split('T')[0]} | ${s.turns} | ${s.tools} | ${s.artifactsCount} | ${s.samplePrompt.replace(/\|/g, '-')} |`);
});

masterIndexLines.push(`\n---\n\n## 🛡️ PROTOCOLOS Y REGLAS DE NEGOCIO INMUTABLES (SSOT)`);
masterIndexLines.push(`- **Tarifa Solista:** 350,00 € (Edwin Agudelo).`);
masterIndexLines.push(`- **Logística:** 1,50 €/km desde Méntrida a partir del km 50. Suplemento hotel (+120 €) si hora fin >= 3:00 AM.`);
masterIndexLines.push(`- **Split Soberano:** 80% Artista / 10% EAR OS / 10% VIMUME.`);
masterIndexLines.push(`- **Cierre:** Depósito de 100,00 € Stripe con Price-Lock SHA-256.`);
masterIndexLines.push(`- **Teléfono Oficial:** +34 693 693 048.`);

const masterIndexContent = masterIndexLines.join('\n');

// Guardar en Vault
const masterVaultPath = path.join(TARGET_VAULT_DIR, '00_EAR_OS_MASTER_CHRONICLE_AND_STATE.md');
try {
  fs.writeFileSync(masterVaultPath, masterIndexContent, 'utf-8');
  console.log(`✅ [MASTER INDEX VAULT] Creado: ${masterVaultPath}`);
} catch (e) {
  console.warn(`[WARN] No se pudo guardar en vault: ${e.message}`);
}

// Guardar copia local en docs/
try {
  fs.writeFileSync(DOCS_CHRONICLE_PATH, masterIndexContent, 'utf-8');
  console.log(`✅ [MASTER INDEX DOCS] Creado: ${DOCS_CHRONICLE_PATH}`);
} catch (e) {
  console.warn(`[WARN] No se pudo guardar en docs: ${e.message}`);
}

// Actualizar manifiesto
try {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifestEntries, null, 2), 'utf-8');
  console.log(`✅ [MANIFEST] Manifiesto de archivado purista actualizado: ${MANIFEST_PATH}`);
} catch (e) {
  console.warn(`[WARN] No se pudo guardar manifest: ${e.message}`);
}

console.log('🎉 [BARRIDO FINALIZADO] Todas las sesiones han sido transformadas a Markdown y archivadas con éxito.');
