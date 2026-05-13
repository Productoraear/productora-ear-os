import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY no encontrada.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function generateEmbeddings() {
  console.log('🚀 Iniciando proceso de vectorización neural...');
  console.log('API Key detectada (longitud):', process.env.GEMINI_API_KEY.length);
  
  const { data: vendors, error } = await supabase
    .from('ear_market_vendors')
    .select('id, name, category, location, description')
    .is('embedding', null)
    .limit(5); // Probar con 5

  if (error) {
    console.error('❌ Error leyendo de la bóveda:', error.message);
    return;
  }

  for (const vendor of vendors) {
    try {
      console.log(`🧠 Procesando ${vendor.name}...`);
      const textToEmbed = `${vendor.name} ${vendor.category} ${vendor.location} ${vendor.description}`;
      const result = await model.embedContent(textToEmbed);
      console.log('✅ Embedding generado:', result.embedding.values.slice(0, 5), '...');
    } catch (err) {
      console.error(`❌ Error:`, err.message);
    }
  }
}

generateEmbeddings();
