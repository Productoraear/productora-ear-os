import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const QUEUE_FILE = path.join(ROOT_DIR, '.antigravity', 'tasks_queue.json');
const LOG_FILE = path.join(ROOT_DIR, '.antigravity', 'OMEGA_OVERNIGHT_AUDIT.log');
const BACKUP_DIR = path.join(ROOT_DIR, '.antigravity', 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// 1. Extraer API Key de .env.local
function getApiKey() {
  const envPath = path.join(ROOT_DIR, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/DEEPSEEK_API_KEY=([^\r\n]+)/);
    if (match) return match[1].trim();
  }
  return process.env.DEEPSEEK_API_KEY || null;
}

const API_KEY = getApiKey();
if (!API_KEY) {
  console.error('[DAEMON FATAL] No se encontró DEEPSEEK_API_KEY en .env.local');
  process.exit(1);
}

// 2. Cliente HTTPS stateless para DeepSeek API
function callDeepSeek(messages, maxTokens = 4096) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'deepseek-chat',
      messages,
      max_tokens: maxTokens,
      temperature: 0.1
    });

    const req = https.request('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 60000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`API Error HTTP ${res.statusCode}: ${body}`));
        }
        try {
          const parsed = JSON.parse(body);
          const reply = parsed.choices?.[0]?.message?.content || '';
          resolve({ reply, usage: parsed.usage });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('DeepSeek API request timed out (60s)'));
    });

    req.write(postData);
    req.end();
  });
}

function extractCodeBlock(text) {
  const match = text.match(/```(?:tsx|typescript|jsx|javascript)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  return text.trim();
}

function log(msg) {
  const entry = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(msg);
  fs.appendFileSync(LOG_FILE, entry, 'utf8');
}

function validateTS() {
  try {
    execSync('npx tsc --noEmit', { cwd: ROOT_DIR, stdio: 'pipe' });
    return { ok: true, error: null };
  } catch (err) {
    return { ok: false, error: err.stdout?.toString() || err.stderr?.toString() || err.message };
  }
}

const SYSTEM_PROMPT = `Eres el Cirujano Full-Stack S-Class de EAR OS. Tu misión es aplicar la "Revisión y Sellado Integral S-Class" al archivo TSX Next.js 15 proporcionado.

REGLAS INMUTABLES (DOCTRINA AGENTS.MD):
1. PRECIO TRANSPARENTE: Exponer el precio oficial SSOT (Tarifa Solista 350 € o packs) consumiendo 'TARIFA_BASE_SOLISTA_EUR' o 'DEPOSITO_STRIPE_EUR' de '@/lib/constants/ear-os-ssot'. Cero textos de "consultar".
2. CTA DE CIERRE REAL: Enlazar botones/links a rutas de conversión reales (/reservar/solista, /alquiler, /checkout o WhatsApp directo +34 693 693 048 consumiendo 'CENTRALITA_EAR_OS' de '@/lib/constants/ear-os-ssot'). Cero href="#" ni anclas vacías.
3. JSON-LD SCHEMA.ORG: Incluir o verificar bloque structured data <script type="application/ld+json"> (Product u Offer) con precio coherente con el SSOT (350.00 EUR).
4. ESTÉTICA LUXURY OLED: Contenedores rounded-3xl bg-[#09090d]/80 border border-white/10 con micro-animaciones hover. Cero w-screen (usar w-full overflow-x-hidden).
5. BLINDAJE ZONA CERO & TYPESCRIPT:
   - Usa constantes canónicas de '@/lib/constants/ear-os-ssot'.
   - 0 variables o imports sin usar.
   - 0 any implícitos.
   - Respeta estrictamente 'use client' si el componente usa hooks React o framer-motion.
   - Conserva la lógica de negocio previa, la metadata y la semántica completa.

RESPUESTA REQUERIDA:
Devuelve ÚNICAMENTE el código TSX completo y sellado dentro de un único bloque de código \`\`\`tsx ... \`\`\`. Sin introducciones, sin explicaciones, sin texto antes ni después.`;

async function processTask(task) {
  const targetRelPath = task.files[0];
  const targetAbsPath = path.join(ROOT_DIR, targetRelPath);

  if (!fs.existsSync(targetAbsPath)) {
    log(`[ERROR] Archivo no existe: ${targetRelPath}`);
    return false;
  }

  log(`\n======================================================`);
  log(`INICIANDO TAREA: ${task.id} — ${task.title}`);
  log(`ARCHIVO: ${targetRelPath}`);

  // Backup
  const originalCode = fs.readFileSync(targetAbsPath, 'utf8');
  const backupFile = path.join(BACKUP_DIR, `${task.id}_${path.basename(targetRelPath)}.bak`);
  fs.writeFileSync(backupFile, originalCode, 'utf8');

  const userPrompt = `Aplica el Sellado Integral S-Class al siguiente archivo TSX:
Ruta: ${targetRelPath}
Instrucciones de la tarea:
${task.action}

CÓDIGO ORIGINAL:
\`\`\`tsx
${originalCode}
\`\`\``;

  try {
    log(`[AI] Solicitando Sellado S-Class a DeepSeek-V3...`);
    const { reply, usage } = await callDeepSeek([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ]);

    log(`[AI] Recibido (${usage?.total_tokens ?? '?'} tokens). Escribiendo archivo...`);
    const newCode = extractCodeBlock(reply);
    fs.writeFileSync(targetAbsPath, newCode, 'utf8');

    // Validación TS
    log(`[TS] Validando npx tsc --noEmit...`);
    let tsResult = validateTS();

    if (!tsResult.ok) {
      log(`[TS WARN] Error de compilación detectado. Iniciando reparación automática...`);
      log(`Detalle error: ${tsResult.error.slice(0, 300)}...`);

      const repairPrompt = `El código generado tiene el siguiente error de compilación con TypeScript:
${tsResult.error.slice(0, 1500)}

Corrige el error de inmediato asegurando que 'npx tsc --noEmit' devuelva Exit Code 0 y cumpliendo todas las reglas S-Class. Devuelve SOLO el código TSX corregido dentro de \`\`\`tsx ... \`\`\`.`;

      const repairRes = await callDeepSeek([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: `\`\`\`tsx\n${newCode}\n\`\`\`` },
        { role: 'user', content: repairPrompt }
      ]);

      const repairedCode = extractCodeBlock(repairRes.reply);
      fs.writeFileSync(targetAbsPath, repairedCode, 'utf8');

      log(`[TS] Re-validando npx tsc --noEmit tras reparación...`);
      tsResult = validateTS();
    }

    if (!tsResult.ok) {
      log(`[FAIL] Reparación fallida para ${task.id}. Restaurando backup.`);
      fs.writeFileSync(targetAbsPath, originalCode, 'utf8');
      return false;
    }

    // Éxito: ejecutar omega.js complete
    log(`[OMEGA] tsc Exit Code 0 verificado. Sellando tarea con omega.js...`);
    execSync(`node .antigravity/omega.js complete ${task.id}`, { cwd: ROOT_DIR, stdio: 'pipe' });
    log(`[ÉXITO] ${task.id} completada y sellada con Exit Code 0.`);
    return true;

  } catch (err) {
    log(`[EXCEPCIÓN] Error procesando ${task.id}: ${err.message}`);
    fs.writeFileSync(targetAbsPath, originalCode, 'utf8');
    return false;
  }
}

async function run(single = false) {
  log(`=== OMEGA NIGHT AUTONOMOUS DAEMON INICIADO ===`);
  const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
  const pendingTasks = queue.tasks.filter(t => t.status === 'QUEUED');

  log(`Tareas pendientes en cola: ${pendingTasks.length}`);

  let successCount = 0;
  let failCount = 0;

  for (const task of pendingTasks) {
    const success = await processTask(task);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    if (single) {
      log(`[TEST SINGLE] Modo de prueba de 1 tarea finalizado.`);
      break;
    }

    // Pausa preventiva de 2 segundos entre tareas para respetar rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  log(`\n=== RESUMEN EJECUCIÓN ===`);
  log(`Tareas completadas con éxito: ${successCount}`);
  log(`Tareas fallidas/restauradas: ${failCount}`);
  log(`=== FIN RUNNER ===\n`);
}

const isSingle = process.argv.includes('--single');
run(isSingle);
