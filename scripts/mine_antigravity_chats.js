const fs = require('fs');
const path = require('path');

const BRAIN_DIR = 'C:\\Users\\M2-W10\\.gemini\\antigravity-ide\\brain';

const SEARCH_TOPICS = {
  'Tinder/Swipe & Matchmaking': /tinder|swipe|matchmaking|cardstack|tindermatcher|baraja/i,
  'Calculadora Acústica & Watts/Pax': /technicalwatts|bose\s*f1|behringer|xr18|shure|soundcalculation|vatios|aforo/i,
  'Bespoke Pricer & Price-Lock 72h': /pricelock|congelador|sha256|bespokepricer|freezeprice|tarifa/i,
  'Divi Transmuter & UI Onyx': /divitransmuter|auraonyx|sclassscreens|fenixcommand|omnibus/i,
  'Gestor Artistas & Edwin Agudelo': /mariachi|edwin\s*agudelo|tenor|dossier|artistroster/i,
  'Ledger / Commission 80/10/10 & Vimume': /commissionledger|split801010|aurawallet|vimume|boveda/i,
  'Sovereign Auth & Zero-Knowledge Claim': /sovereignlogin|claimtoken|claimtokenhash|zeroknowledge/i
};

console.log('⚡ [BRAIN DISCOVERY] Minando transcripciones y artefactos de todas las sesiones de Antigravity...');

if (!fs.existsSync(BRAIN_DIR)) {
  console.error('❌ No se encontró el directorio brain:', BRAIN_DIR);
  process.exit(1);
}

const conversations = fs.readdirSync(BRAIN_DIR);
console.log(`📂 Total de sesiones históricas detectadas: ${conversations.length}`);

const sessionInsights = [];

conversations.forEach((convId) => {
  const convPath = path.join(BRAIN_DIR, convId);
  try {
    if (!fs.statSync(convPath).isDirectory()) return;

    // Buscar artefactos markdown y logs
    const artifacts = [];
    const files = fs.readdirSync(convPath);
    
    files.forEach(f => {
      if (f.endsWith('.md') || f.endsWith('.json')) {
        const fPath = path.join(convPath, f);
        try {
          const content = fs.readFileSync(fPath, 'utf-8');
          const matched = [];
          for (const [topic, regex] of Object.entries(SEARCH_TOPICS)) {
            if (regex.test(content)) matched.push(topic);
          }
          if (matched.length > 0) {
            artifacts.push({ file: f, path: fPath, topics: matched, size: content.length });
          }
        } catch {}
      }
    });

    // Buscar en logs transcript.jsonl
    const logsPath = path.join(convPath, '.system_generated', 'logs', 'transcript.jsonl');
    let logMatches = [];
    if (fs.existsSync(logsPath)) {
      try {
        const logContent = fs.readFileSync(logsPath, 'utf-8');
        for (const [topic, regex] of Object.entries(SEARCH_TOPICS)) {
          if (regex.test(logContent)) logMatches.push(topic);
        }
      } catch {}
    }

    if (artifacts.length > 0 || logMatches.length > 0) {
      sessionInsights.push({
        conversationId: convId,
        artifactsCount: artifacts.length,
        artifacts,
        logTopics: logMatches,
        allTopics: Array.from(new Set([...artifacts.flatMap(a => a.topics), ...logMatches]))
      });
    }
  } catch {}
});

sessionInsights.sort((a, b) => b.allTopics.length - a.allTopics.length || b.artifactsCount - a.artifactsCount);

console.log(`\n📊 [RESUMEN DE MINERÍA DE CHATS ANTIGRAVITY]`);
console.log(`- Sesiones con arquitectura y código relevante: ${sessionInsights.length}\n`);

console.log('🔍 [TOP SESIONES CONSTRUIDAS EN ESTE PC]:');
sessionInsights.slice(0, 15).forEach((sess, idx) => {
  console.log(`${idx + 1}. 🧠 Sesión: ${sess.conversationId}`);
  console.log(`   🛠️ Tópicos: ${sess.allTopics.join(' | ')}`);
  console.log(`   📄 Artefactos clave: ${sess.artifacts.map(a => a.file).join(', ') || 'Logs de sesión'}`);
  console.log('---');
});

fs.writeFileSync(
  path.join(process.cwd(), 'scripts', 'antigravity_chats_mined_report.json'),
  JSON.stringify(sessionInsights, null, 2),
  'utf-8'
);
console.log(`💾 Reporte completo de chats guardado en: scripts/antigravity_chats_mined_report.json`);
