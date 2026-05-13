import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * 🌌 TEST ASTRA-RAG: SINAPSIS NEURAL
 * Verifica que el sistema puede buscar proveedores mediante similitud vectorial.
 */

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

async function testSinapsis() {
  const queryText = "Busco trajes de novio premium y joyería de alta gama";
  console.log(`🔍 Query del Comandante: "${queryText}"`);
  
  try {
    // 1. Generar Embedding de la Query
    console.log('🧠 Generando vector de consulta...');
    const result = await model.embedContent({
      content: { parts: [{ text: queryText }] },
      outputDimensionality: 768
    });
    const embedding = result.embedding.values;

    // 2. Búsqueda Vectorial en Supabase
    console.log('📡 Consultando Bóveda B2B (RPC: match_vendors)...');
    const { data, error } = await supabase.rpc('match_vendors', {
      query_embedding: embedding,
      match_threshold: 0.5, // Umbral de similitud
      match_count: 5
    });

    if (error) {
      if (error.message.includes('function match_vendors() does not exist')) {
        console.log('⚠️ Sinapsis incompleta: La función RPC "match_vendors" no existe en Supabase.');
        console.log('💡 Ejecute el SQL de activación de función que le proporcionará el Arquitecto.');
      } else {
        throw error;
      }
      return;
    }

    if (!data || data.length === 0) {
      console.log('❓ Sinapsis activa pero sin matches. ¿Están los 50 registros en la zona de umbral?');
    } else {
      console.log('✅ SINAPSIS CONFIRMADA. Resultados encontrados:');
      data.forEach((v, i) => {
        console.log(`   [${i+1}] ${v.name} | ${v.category} | Similitud: ${(v.similarity * 100).toFixed(2)}%`);
      });
    }
  } catch (err) {
    console.error('❌ Error crítico en la sinapsis:', err.message);
  }
}

testSinapsis();
