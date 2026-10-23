/**
 * Productora EAR OS :: Script Autónomo de Clonación de Voz de Edwin Agudelo
 * ---------------------------------------------------------------------------
 * Cero consumo de GPU local: Toma las notas de voz de WhatsApp (.mp3, .ogg, .opus, .m4a)
 * y las clona instantáneamente en la nube vía ElevenLabs Instant Voice Cloning (IVC).
 *
 * Uso:
 *   1. Coloca 2 a 5 audios de WhatsApp en: public/media/edwin/voice_samples/
 *   2. Asegúrate de tener ELEVENLABS_API_KEY en .env.local
 *   3. Ejecuta: node scripts/clone_edwin_voice.cjs
 */

const fs = require('fs');
const path = require('path');

const SAMPLES_DIR = path.join(__dirname, '..', 'public', 'media', 'edwin', 'voice_samples');
const ENV_PATH = path.join(__dirname, '..', '.env.local');

function getEnvKey(key) {
  if (process.env[key]) return process.env[key];
  if (fs.existsSync(ENV_PATH)) {
    const lines = fs.readFileSync(ENV_PATH, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(new RegExp(`^${key}=(.*)$`));
      if (match) return match[1].trim();
    }
  }
  return null;
}

function saveEnvKey(key, value) {
  let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content += `\n${key}=${value}\n`;
  }
  fs.writeFileSync(ENV_PATH, content, 'utf8');
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════════════');
  console.log('🎙️  CLONACIÓN INSTANTÁNEA DE VOZ DE EDWIN AGUDELO (CLOUD ZERO-GPU)');
  console.log('═══════════════════════════════════════════════════════════════════════════\n');

  if (!fs.existsSync(SAMPLES_DIR)) {
    fs.mkdirSync(SAMPLES_DIR, { recursive: true });
  }

  const files = fs.readdirSync(SAMPLES_DIR)
    .filter(f => !f.endsWith('.md') && !f.startsWith('.'))
    .map(f => path.join(SAMPLES_DIR, f));

  console.log(`📁 Directorio de muestras: ${SAMPLES_DIR}`);
  console.log(`🎵 Audios detectados: ${files.length}`);

  if (files.length === 0) {
    console.log('\n⚠️  [ACCIÓN REQUERIDA]:');
    console.log('   No se han encontrado archivos de audio en la carpeta.');
    console.log('   Por favor, copia 2 a 5 notas de voz de WhatsApp de Edwin en:');
    console.log(`   ${SAMPLES_DIR}`);
    console.log('   Formatos soportados: .opus, .ogg, .mp3, .m4a, .wav\n');
    return;
  }

  files.forEach(f => console.log(`   - ${path.basename(f)} (${(fs.statSync(f).size / 1024).toFixed(1)} KB)`));

  const apiKey = getEnvKey('ELEVENLABS_API_KEY');
  if (!apiKey) {
    console.log('\n⚠️  [CLAVE API PENDIENTE]:');
    console.log('   Se requiere ELEVENLABS_API_KEY en .env.local para clonar la voz en la nube.');
    console.log('   Puedes obtener una clave gratuita o de suscripción en https://elevenlabs.io');
    console.log('   Mientras tanto, el sistema utilizará el motor Web Speech con normalización fonética S-Class.\n');
    return;
  }

  console.log('\n🚀 Subiendo muestras a ElevenLabs para clonación instantánea...');

  const formData = new FormData();
  formData.append('name', 'Edwin Agudelo - Concierge Oficial');
  formData.append('description', 'Voz oficial de Edwin Agudelo para atención y cotización personalizada de bodas y eventos en Productora EAR.');

  for (const file of files) {
    const buffer = fs.readFileSync(file);
    const blob = new Blob([buffer]);
    formData.append('files', blob, path.basename(file));
  }

  try {
    const res = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('\n❌ Error al crear la voz en ElevenLabs:', data);
      return;
    }

    const voiceId = data.voice_id;
    console.log(`\n✅ ¡Voz clonada exitosamente en la nube!`);
    console.log(`   Voice ID: ${voiceId}`);

    saveEnvKey('ELEVENLABS_EDWIN_VOICE_ID', voiceId);
    console.log(`   Guardado ELEVENLABS_EDWIN_VOICE_ID en .env.local`);
    console.log('\n🎉 ¡A partir de ahora las respuestas del asistente pueden hablar con la voz real de Edwin Agudelo!');
  } catch (err) {
    console.error('\n❌ Fallo en la conexión con ElevenLabs:', err);
  }
}

main().catch(console.error);
