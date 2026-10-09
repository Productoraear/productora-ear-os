import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseUrl = (rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')))
    ? rawUrl
    : 'https://ear-os-production.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 🔒 FAIL-CLOSED SUPABASE (BLINDAJE SESSION_SECRET P0): sin anon key real, no hay cliente.
  if (!supabaseAnonKey || supabaseAnonKey.includes('dummy_anon_key_placeholder')) {
    throw new Error('[SUPABASE_CLIENT] NEXT_PUBLIC_SUPABASE_ANON_KEY no configurada (fail-closed).');
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};
