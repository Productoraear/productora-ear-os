/**
 * Script de validación de Abacus.AI RouteLLM
 * Uso: node scripts/test_abacus_api.cjs [TU_API_KEY_OPCIONAL]
 */

const https = require('https');

const apiKey = process.argv[2] || process.env.ABACUS_API_KEY;

if (!apiKey) {
  console.log('\n❌ [ABACUS TEST] No se proporcionó ninguna API Key.');
  console.log('   Uso: node scripts/test_abacus_api.cjs <TU_API_KEY>');
  console.log('   O define la variable de entorno ABACUS_API_KEY en tu .env\n');
  process.exit(1);
}

console.log('\n🚀 [ABACUS TEST] Probando conectividad con https://routellm.abacus.ai/v1...');
console.log('   Modelo: claude-3-5-sonnet (vía Abacus RouteLLM)');

const payload = JSON.stringify({
  model: 'claude-3-5-sonnet',
  messages: [
    { role: 'system', content: 'Eres el motor IA forense S-Class de Productora EAR.' },
    { role: 'user', content: 'Confirma tu estado en una frase corta y precisa.' }
  ],
  max_tokens: 100,
  temperature: 0.5
});

const options = {
  hostname: 'routellm.abacus.ai',
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        const json = JSON.parse(data);
        const reply = json.choices?.[0]?.message?.content;
        console.log('\n✅ [CONEXIÓN EXITOSA S-CLASS]');
        console.log('   Respuesta recibida:', reply);
        console.log('   Tokens usados:', json.usage);
        console.log('   ¡Tu suscripción de Abacus.AI está lista para abastecer a EAR OS y tus agentes!\n');
      } catch (e) {
        console.log('\n⚠️ Respuesta recibida pero error de parseo JSON:', data);
      }
    } else {
      console.log(`\n❌ Error HTTP ${res.statusCode}:`, data);
    }
  });
});

req.on('error', (err) => {
  console.error('\n❌ Error de red al conectar con Abacus.AI:', err.message);
});

req.write(payload);
req.end();
