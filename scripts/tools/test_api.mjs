import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // Note: The @google/generative-ai SDK does not have a listModels method in the client directly.
    // It's usually done via a lower-level client or just by trial and error.
    // However, I can try to use a model that definitely exists to see if the API key works.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log('✅ API Key funcional. Respuesta:', result.response.text());
  } catch (e) {
    console.error('❌ Error de API:', e.message);
  }
}

listModels();
