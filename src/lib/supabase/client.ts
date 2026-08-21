import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseUrl = (rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')))
    ? rawUrl
    : 'https://ear-os-production.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_placeholder';

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};
