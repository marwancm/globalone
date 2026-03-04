import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

let client: SupabaseClient | null = null;

export const createClient = () => {
  if (!client) {
    client = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
};
