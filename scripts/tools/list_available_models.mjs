import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  console.log('🌐 Listando modelos disponibles...');
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Modelos disponibles:');
      data.models.forEach(m => console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`));
    } else {
      console.error('❌ FALLO:', data.error.message);
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

listModels();
