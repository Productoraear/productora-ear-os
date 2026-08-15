import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-build.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are missing");
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
};
