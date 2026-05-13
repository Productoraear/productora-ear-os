import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-pro" }); // just to get a model instance
    // Note: The SDK might not have a direct listModels, but I can try another model name.
    console.log('Probando con models/text-embedding-004...');
  } catch (e) {
    console.error(e);
  }
}

listModels();
