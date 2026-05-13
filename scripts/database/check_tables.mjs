import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function listTables() {
  console.log('🔍 Checking Supabase Tables...');
  const tables = ['users', 'artists', 'events', 'transactions', 'hunter_intel', 'rag_knowledge_vault', 'ear_market_vendors'];
  for (const table of tables) {
    const { error: tableError } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (tableError) {
      console.log(`❌ Table ${table} NOT found or error: ${tableError.message}`);
    } else {
      console.log(`✅ Table ${table} FOUND.`);
    }
  }
}

listTables();
