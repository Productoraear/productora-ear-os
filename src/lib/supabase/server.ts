import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      return createSupabaseClient(supabaseUrl, supabaseKey);
    } catch (e) {
      console.warn('⚠️ [SUPABASE] Error initializing real client, using fallback mock', e);
    }
  }

  // Resilient fallback mock for build / CI / local development without live Supabase
  return {
    from: (_table: string) => ({
      select: (_query?: string) => ({
        eq: (_col: string, _val: any) => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({ data: [], error: null })
        }),
        order: () => ({ data: [], error: null }),
        single: async () => ({ data: null, error: null }),
      }),
      insert: async (_data: any) => ({ data: null, error: null }),
      update: (_data: any) => ({
        eq: (_col: string, _val: any) => async () => ({ data: null, error: null }),
      }),
      delete: () => ({
        eq: (_col: string, _val: any) => async () => ({ data: null, error: null }),
      })
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    }
  } as any;
}