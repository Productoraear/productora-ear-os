const fs = require('fs');
const https = require('https');

function getEnv(key) {
  for (const f of ['.env.local', '.env']) {
    if (fs.existsSync(f)) {
      const content = fs.readFileSync(f, 'utf8');
      const m = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
      if (m && m[1]) return m[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  return '';
}

const apiKey = getEnv('ABACUS_API_KEY');
const baseUrl = getEnv('ABACUS_BASE_URL') || 'https://apps.abacus.ai/api/chatllm/v1';

console.log('=== AUDITORIA ABACUS.AI MODELOS DISPONIBLES ===');
console.log('Target Base URL:', baseUrl);
console.log('API Key detected:', apiKey ? `${apiKey.substring(0, 10)}... (Length: ${apiKey.length})` : 'NO');

if (!apiKey) {
  console.error('ERROR: No ABACUS_API_KEY found.');
  process.exit(1);
}

function checkUrl(urlStr, label) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(urlStr);
      const req = https.request({
        hostname: parsed.hostname,
        path: parsed.pathname,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'User-Agent': 'EAR_OS_Auditor/1.0'
        },
        timeout: 10000
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          console.log(`\n[${label}] Status: ${res.statusCode}`);
          try {
            const parsedJson = JSON.parse(body);
            if (parsedJson.data && Array.isArray(parsedJson.data)) {
              console.log(`[${label}] Modelos encontrados: ${parsedJson.data.length}`);
              parsedJson.data.forEach(m => console.log(`   👉 ${m.id}`));
            } else if (parsedJson.models) {
              console.log(`[${label}] Modelos encontrados: ${parsedJson.models.length}`);
              parsedJson.models.forEach(m => console.log(`   👉 ${m.id || m.name || m}`));
            } else {
              console.log(`[${label}] Respuesta JSON:`, JSON.stringify(parsedJson).substring(0, 300));
            }
          } catch (e) {
            console.log(`[${label}] Respuesta texto (no JSON):`, body.substring(0, 300));
          }
          resolve();
        });
      });
      req.on('error', (err) => {
        console.log(`[${label}] Error de conexión:`, err.message);
        resolve();
      });
      req.end();
    } catch (e) {
      console.log(`[${label}] Error:`, e.message);
      resolve();
    }
  });
}

async function run() {
  await checkUrl(`${baseUrl.replace(/\/$/, '')}/models`, 'APPS_ABACUS_CHATLLM');
  await checkUrl('https://routellm.abacus.ai/v1/models', 'ROUTELLM_ABACUS');
}

run();
