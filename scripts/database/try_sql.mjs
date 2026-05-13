import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function tryExecSql() {
  console.log('🚀 Attempting to run SQL via RPC...');
  const sql = fs.readFileSync('scripts/setup_vendors_table.sql', 'utf8');
  
  const { data, error } = await supabase.rpc('exec_sql', { query_text: sql });
  
  if (error) {
    console.error('❌ RPC exec_sql failed:', error.message);
    console.log('💡 This is expected if the security function hasn\'t been created yet.');
  } else {
    console.log('✅ SQL executed successfully via RPC!');
  }
}

tryExecSql();
