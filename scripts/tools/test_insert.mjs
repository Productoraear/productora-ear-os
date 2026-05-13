import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testInsert() {
  console.log('🧪 Testing single insert into ear_market_vendors...');
  const { data, error } = await supabase.from('ear_market_vendors').insert([
    { name: 'Test Vendor', category: 'Test', location: 'Test', description: 'Test' }
  ]);
  
  if (error) {
    console.error('❌ Insert failed:', error.message);
  } else {
    console.log('✅ Insert successful!');
  }
}

testInsert();
