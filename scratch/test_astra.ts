import { GoogleGenerativeAI } from '@google/generative-ai';

async function testApiKey() {
  const apiKey = "AIzaSyB093msEV594kJJ5FZ7l9YWUzmHQZJUb9Y";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  try {
    const result = await model.generateContent("Hola Astra, ¿estás operativa?");
    console.log("✅ TEST EXITOSO:", result.response.text());
  } catch (error) {
    console.error("❌ TEST FALLIDO:", error.message);
  }
}

testApiKey();
