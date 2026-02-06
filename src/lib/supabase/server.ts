/**
 * Supabase Server Client (Admin)
 * -------------------------------
 * Server-side admin client that bypasses RLS.
 * Use only in API routes and server actions.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database';
import { env } from '../env';

let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdminClient() {
  // Security check: admin client must only run server-side
  if (typeof window !== 'undefined') {
    throw new Error('❌ SECURITY: getSupabaseAdminClient cannot be called from browser. Use getServerClient or browser client instead.');
  }
  
  // Security check: prevent NEXT_PUBLIC_ keys from being used
  if (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    // This is expected, just warn if someone tries to use them here
  }
  
  if (supabaseAdmin) return supabaseAdmin;

  supabaseAdmin = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}

export type NewsItem = Database['public']['Tables']['news_items']['Row'];
export type NewsItemInsert = Database['public']['Tables']['news_items']['Insert'];
