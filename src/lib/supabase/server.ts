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
