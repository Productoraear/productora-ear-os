import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseUrl = (rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')))
    ? rawUrl
    : 'https://ear-os-production.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_service_key_placeholder';

  return createSupabaseClient(supabaseUrl, supabaseKey);
};
