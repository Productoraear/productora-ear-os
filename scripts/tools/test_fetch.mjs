import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.GEMINI_API_KEY;

async function testFetch() {
  console.log('🌐 Probando NATIVE FETCH a v1/models/embedding-001...');
  const url = `https://generativelanguage.googleapis.com/v1/models/embedding-001:embedContent?key=${API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { parts: [{ text: "test" }] }
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ ÉXITO en v1:', data.embedding.values.slice(0, 5), '...');
    } else {
      console.error('❌ FALLO en v1:', data.error.message);
    }
  } catch (e) {
    console.error('❌ Error de red:', e.message);
  }
}

testFetch();
