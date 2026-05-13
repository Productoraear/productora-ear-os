import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateSchema() {
  console.log('🌌 Actualizando esquema para soporte vectorial...');
  const { data, error } = await supabase.from('ear_market_vendors').select('*').limit(1);
  
  // Si podemos seleccionar *, probamos específicamente embedding
  const { error: vectorError } = await supabase.from('ear_market_vendors').select('embedding').limit(1);
  
  if (vectorError && vectorError.message.includes('column "embedding" does not exist')) {
    console.log('⚠️ Columna "embedding" no hallada. Comandante, ejecute esto en SQL Editor:');
    console.log('ALTER TABLE ear_market_vendors ADD COLUMN IF NOT EXISTS embedding vector(768);');
  } else if (vectorError) {
    console.log('❌ Error al verificar vectores:', vectorError.message);
  } else {
    console.log('✅ Soporte vectorial detectado en la bóveda.');
  }
}

updateSchema();
