const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============================================================================
// 🎻 OMEGA GRAVITATIONAL VAMPIRIZER - BIG BAND SYMPHONIC INGESTION CLI
// 100% Native High-Performance Execution for EAR OS (Silicon Valley Standard)
// ============================================================================

const DEFAULT_CLINICOS = [
  'musicoterapia', 'alzheimer', 'demencia', 'mayores', 'geriatr',
  'memoria', 'sensorial', 'neuro', 'terapia ocupacional', '40 hz',
  'protocolo', 'sesion', 'sesión', 'residencia', 'cognitiv',
  'clinical', 'clinico', 'clínico', 'vimume', 'edwin agudelo',
  'mariachi', 's-class', 'l-acoustics', 'axient', 'soberania'
];

const DEFAULT_EXCLUIR = [
  '01_vertical_eventos', '\\bodas\\', 'eve_miboda', 'identidad_ear',
  'ear-intelligence', 'ear_uber', 'earaitwinservice', 'earops',
  'earroutes', 'eardynamiccalculator', 'earbusinesssimulator',
  'earartisttracker', 'earhubtalent', 'heartbeatservice',
  'productora-ear-types', 'pricingear', 'wearyourstory',
  'knowledgearchitect', 'node_modules', '.d.ts', '.tmp', '.git'
];

function cosineSimilarity(vectorA, vectorB) {
  if (!vectorA || !vectorB || vectorA.length === 0 || vectorB.length === 0) return 0.0;
  const minLen = Math.min(vectorA.length, vectorB.length);
  let dotProduct = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < minLen; i++) {
    const a = vectorA[i], b = vectorB[i];
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  return (!normA || !normB) ? 0.0 : dotProduct / (normA * normB);
}

function normalizePath(filePath) {
  return String(filePath).replace(/\//g, '\\').toLowerCase();
}

function isVersionedCopy(filePath) {
  const filename = path.parse(String(filePath)).name.toLowerCase();
  const parts = filename.split('_');
  if (parts.length < 2) return false;
  return parts.slice(1).some(part => /^\d{4,}$/.test(part));
}

function deduplicationKey(filePath) {
  const filename = path.parse(String(filePath)).name.toLowerCase();
  const parts = filename.split('_');
  while (parts.length > 0 && /^\d{4,}$/.test(parts[parts.length - 1])) {
    parts.pop();
  }
  return parts.join('_');
}

function adjustedScore(rawScore, filePath, previewText) {
  const normPath = normalizePath(filePath);
  const filename = path.basename(filePath).toLowerCase();
  const fullText = `${normPath} ${previewText}`.toLowerCase();

  if (DEFAULT_EXCLUIR.some(p => normPath.includes(p) || filename.includes(p))) {
    return null;
  }

  const clinicalMatches = DEFAULT_CLINICOS.reduce((acc, term) => {
    return acc + (fullText.includes(term) ? 1 : 0);
  }, 0);

  if (clinicalMatches === 0 && rawScore < 0.65) {
    return null;
  }

  let bonus = 0.0;
  if (filename.includes('vimume')) bonus += 0.08;
  if (filename.includes('clinical') || filename.includes('clinico') || filename.includes('clínico')) bonus += 0.12;
  if (fullText.includes('protocolo') || fullText.includes('protocol')) bonus += 0.06;
  if (fullText.includes('edwin agudelo') || fullText.includes('agudelo')) bonus += 0.15;
  if (clinicalMatches >= 2) bonus += 0.05;
  if (clinicalMatches >= 4) bonus += 0.05;

  if (isVersionedCopy(filePath)) {
    bonus -= 0.20;
  }

  return rawScore + bonus;
}

function computeContentHash(content) {
  return crypto.createHash('sha256').update(String(content).trim().toLowerCase()).digest('hex');
}

async function fetchLocalEmbedding(text, apiUrl = 'http://127.0.0.1:1234/v1/embeddings', model = 'nomic-embed-text') {
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text, model }),
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.[0]?.embedding || null;
  } catch {
    return null;
  }
}

function loadDocuments() {
  const possiblePaths = [
    'D:\\EAR_OS_INTEL_BUNKER\\_vector_db\\embeddings.json',
    'D:\\EAR_OS_INTEL_BUNKER\\_vector_db\\vimume_clinico_v1.json',
    path.join(process.cwd(), 'src', 'data', 'ear-rag-database.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return { docs: parsed, sourcePath: p };
        if (parsed?.documentos && Array.isArray(parsed.documentos)) return { docs: parsed.documentos, sourcePath: p };
      } catch {}
    }
  }
  return { docs: [], sourcePath: 'none' };
}

async function main() {
  const query = process.argv.slice(2).join(' ').trim();

  if (!query) {
    console.log('=' .repeat(88));
    console.log('🎻 USO: node scripts/ingestion/gravitational_vampirizer.js "consulta semántica"');
    console.log('=' .repeat(88));
    return;
  }

  console.log('=' .repeat(88));
  console.log(`🌌 INICIANDO EXTRACCIÓN GRAVITACIONAL S-CLASS`);
  console.log(`CONSULTA: "${query}"`);
  console.log('=' .repeat(88));

  const { docs, sourcePath } = loadDocuments();
  if (docs.length === 0) {
    console.log('❌ No se encontraron bases de conocimiento en las rutas estratégicas.');
    return;
  }

  const queryEmbedding = await fetchLocalEmbedding(query);
  const results = [];
  const seenKeys = new Set();
  const seenHashes = new Set();

  for (const doc of docs) {
    const filePath = doc.ruta || doc.path || doc.archivo || doc.title || 'unknown';
    const text = doc.texto || doc.text || doc.content || doc.preview || '';
    const preview = text.slice(0, 500);

    const hash = doc.hash_fuente || computeContentHash(text);
    if (seenHashes.has(hash)) continue;
    seenHashes.add(hash);

    const key = deduplicationKey(filePath);
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    let rawScore = 0.0;
    if (queryEmbedding && doc.embedding && doc.embedding.length > 0) {
      rawScore = cosineSimilarity(queryEmbedding, doc.embedding);
    } else {
      const lowerQ = query.toLowerCase();
      const terms = lowerQ.split(/\s+/).filter(t => t.length > 2);
      const lowerDoc = `${filePath} ${text} ${(doc.tags || []).join(' ')}`.toLowerCase();

      let termMatches = 0;
      for (const term of terms) {
        if (lowerDoc.includes(term)) termMatches++;
      }
      rawScore = terms.length > 0 ? termMatches / terms.length : 0.0;
    }

    const scoreAjustado = adjustedScore(rawScore, filePath, preview);
    if (scoreAjustado === null || scoreAjustado <= 0) continue;

    results.push({
      path: filePath,
      preview,
      score: rawScore,
      adjustedScore: scoreAjustado
    });
  }

  results.sort((a, b) => b.adjustedScore - a.adjustedScore);

  console.log(`\n📊 FUENTE ACTIVA: ${sourcePath}`);
  console.log(`DOCUMENTOS EN ÍNDICE: ${docs.length}`);
  console.log(`DOCUMENTOS FILTRADOS DE ALTA SEÑAL: ${results.length}`);
  console.log(`MODO EMBEDDING: ${queryEmbedding ? 'LOCAL_NOMIC_VECTOR' : 'GRAVITATIONAL_LEXICAL_FALLBACK'}`);
  console.log('=' .repeat(88));

  results.slice(0, 15).forEach((doc, idx) => {
    console.log(`\n#${idx + 1} | SIMILITUD: ${doc.score.toFixed(4)} | AJUSTADA: ${doc.adjustedScore.toFixed(4)}`);
    console.log(`ARCHIVO: ${path.basename(doc.path)}`);
    console.log(`RUTA: ${doc.path}`);
    console.log(`CONTEXTO: ${doc.preview.replace(/\s+/g, ' ').slice(0, 240)}...`);
  });

  console.log('\n✅ EXTRACCIÓN_GRAVITACIONAL_OK (100% ADITIVO)');
}

main().catch(console.error);
