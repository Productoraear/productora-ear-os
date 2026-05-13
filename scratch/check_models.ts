import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function listModels() {
    try {
        // The SDK doesn't have a direct listModels, we usually use fetch or the official REST API
        // But we can try to see if we can use a different version
        console.log("Checking v1...");
        const modelV1 = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const resV1 = await modelV1.embedContent("test");
        console.log("v1 success!");
    } catch (e: any) {
        console.error("v1 failed:", e.message);
    }

    try {
        console.log("Checking v1beta with text-embedding-004...");
        // Re-trying what failed
        const modelV1beta = genAI.getGenerativeModel({ model: "text-embedding-004" }, { apiVersion: 'v1beta' });
        const resV1beta = await modelV1beta.embedContent("test");
        console.log("v1beta success!");
    } catch (e: any) {
        console.error("v1beta failed:", e.message);
    }
}

listModels();
