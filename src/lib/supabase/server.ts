import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export const createClient = () => {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseUrl = (rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')))
    ? rawUrl
    : 'https://ear-os-production.supabase.co';

  // 🔒 BLINDAJE P1-2: el cliente de SERVIDOR exige SERVICE_ROLE_KEY real.
  // Prohibido degradar silenciosamente a anon key o placeholder.
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseKey) {
    throw new Error('[SUPABASE_SERVER] SUPABASE_SERVICE_ROLE_KEY no definida en el entorno de servidor.');
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
};
