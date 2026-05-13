import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function findTable() {
  console.log('🔍 Searching for ear_market_vendors across schemas...');
  
  const schemas = ['public', 'storage', 'auth', 'extensions'];
  for (const schema of schemas) {
      console.log(`Checking schema: ${schema}...`);
      const { data, error } = await supabase
        .from(schema === 'public' ? 'ear_market_vendors' : `${schema}.ear_market_vendors`)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
          console.log(`✅ Table FOUND in schema: ${schema}`);
          return;
      } else {
          console.log(`❌ Not in ${schema}: ${error.message}`);
      }
  }
}

findTable();
