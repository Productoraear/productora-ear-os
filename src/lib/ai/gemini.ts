import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  systemInstruction: "Eres el Cerebro LogÃ­stico de EAR OS. Tu misiÃ³n es optimizar la agenda de Edwin Agudelo y gestionar el matching de artistas y eventos."
});
