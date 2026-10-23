/**
 * ══════════════════════════════════════════════════════════════════════════════
 * EAR OS — QWEN LOCAL SECRET AUDITOR & REDACTOR (OFFLINE / ZERO-LEAK)
 * ══════════════════════════════════════════════════════════════════════════════
 * Utiliza el modelo local Qwen de Ollama (14B o 27B) en localhost:11434 para
 * auditar código, commits y configuraciones en busca de fugas de claves secretas.
 * 
 * 🛡️ 100% OFFLINE: Ni un solo byte de tus claves viaja a internet.
 * ══════════════════════════════════════════════════════════════════════════════
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const OLLAMA_HOST = 'localhost';
const OLLAMA_PORT = 11434;

// Modelos locales preferidos por orden de prioridad
const PREFERRED_MODELS = [
  'ear-14b-textos-sclass:latest',
  'ear-27b-apis-sclass:latest',
  'qwen3.5-35b-a3b:latest',
  'ear-32b-arquitecto-sclass:latest',
];

async function getAvailableModel() {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: OLLAMA_HOST,
        port: OLLAMA_PORT,
        path: '/api/tags',
        method: 'GET',
        timeout: 2000,
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            const installed = new Set((data.models || []).map((m) => m.name));
            for (const pref of PREFERRED_MODELS) {
              if (installed.has(pref)) return resolve(pref);
            }
            if (data.models && data.models.length > 0) {
              return resolve(data.models[0].name);
            }
          } catch (e) {}
          resolve(null);
        });
      }
    );
    req.on('error', () => resolve(null));
    req.end();
  });
}

async function askQwen(model, prompt) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.1, // Respuesta determinista de seguridad
        num_predict: 512,
      },
    });

    const req = http.request(
      {
        hostname: OLLAMA_HOST,
        port: OLLAMA_PORT,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            resolve(data.response || '');
          } catch (e) {
            reject(new Error('Respuesta no válida de Ollama'));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function auditText(textToAudit, contextName) {
  console.log(`\n🔍 [QWEN SECRET AUDITOR] Verificando ${contextName}...`);
  const model = await getAvailableModel();
  if (!model) {
    console.error('❌ Ollama no está respondiendo en http://localhost:11434');
    return;
  }
  console.log(`   Usando modelo local soberano: ${model}`);

  const prompt = `Actúa como auditor de ciberseguridad forense estricto. Analiza el siguiente texto en busca de claves secretas reales expuestas (API keys de Stripe, OpenAI, Google, contraseñas, tokens JWT, URLs de bases de datos con credenciales).

Responde en formato JSON estrictamente:
{
  "has_exposed_secrets": boolean,
  "detected_types": string[],
  "verdict": "SEGURO" | "PELIGRO_FUGA_DETECTADA",
  "recommendations": string
}

Texto a analizar:
"""
${textToAudit.slice(0, 3000)}
"""`;

  try {
    const rawReply = await askQwen(model, prompt);
    console.log('\n--- Veredicto de Qwen Local ---');
    console.log(rawReply);
    console.log('-------------------------------\n');
  } catch (err) {
    console.error('❌ Error al ejecutar auditoría local:', err.message);
  }
}

// CLI
const targetFile = process.argv[2] || '.env.example';
const fullPath = path.resolve(process.cwd(), targetFile);

if (!fs.existsSync(fullPath)) {
  console.error(`❌ Archivo no encontrado: ${fullPath}`);
  process.exit(1);
}

const content = fs.readFileSync(fullPath, 'utf8');
auditText(content, targetFile);
