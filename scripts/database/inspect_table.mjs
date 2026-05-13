import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectTable() {
  console.log('🔍 Inspecting hunter_intel...');
  
  // Try to get one row
  const { data, error } = await supabase.from('hunter_intel').select('*').limit(1);
  
  if (error) {
    console.error('❌ Error selecting from table:', error.message);
  } else {
    console.log('✅ Table is accessible. Data:', data);
  }
}

inspectTable();
