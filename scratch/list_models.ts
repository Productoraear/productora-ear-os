import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const apiKey = "AIzaSyB093msEV594kJJ5FZ7l9YWUzmHQZJUb9Y";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Note: The SDK doesn't have a direct listModels method, we have to use fetch or check documentation.
    // However, I can try the most common names.
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("test");
            console.log(`✅ MODELO ${m} FUNCIONA`);
            break;
        } catch (e) {
            console.log(`❌ MODELO ${m} NO DISPONIBLE: ${e.message}`);
        }
    }
  } catch (error) {
    console.error("❌ ERROR GENERAL:", error.message);
  }
}

listModels();
