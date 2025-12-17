/**
 * Supabase Server Client
 * ----------------------
 * ⚠️  SERVER ONLY - DO NOT IMPORT IN CLIENT COMPONENTS ⚠️
 *
 * This module provides a Supabase admin client using the Supabase secret key.
 * It bypasses Row Level Security (RLS) and should only be used in:
 * - API routes (app/api/*)
 * - Server actions
 * - Server components that need write access
 *
 * For client-side read-only access, create a separate client with anon key.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../env';

// Type for our database (can be extended with generated types later)
export type Database = {
  public: {
    Tables: {
      news_items: {
        Row: {
          id: string;
          provider: string;
          provider_id: string | null;
          url: string;
          title: string;
          summary: string | null;
          source: string | null;
          image_url: string | null;
          published_at: string;
          lang: string | null;
          tickers: string[];
          content_hash: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['news_items']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['news_items']['Insert']>;
      };
    };
    Functions: {
      get_latest_news: {
        Args: { p_limit?: number; p_offset?: number };
        Returns: Database['public']['Tables']['news_items']['Row'][];
      };
      get_portfolio_news: {
        Args: { p_tickers: string[]; p_limit?: number; p_offset?: number };
        Returns: Database['public']['Tables']['news_items']['Row'][];
      };
      upsert_news_item: {
        Args: {
          p_provider: string;
          p_provider_id: string | null;
          p_url: string;
          p_title: string;
          p_summary: string | null;
          p_source: string | null;
          p_image_url: string | null;
          p_published_at: string;
          p_lang: string | null;
          p_tickers: string[];
          p_content_hash: string;
        };
        Returns: string;
      };
    };
  };
};

// Singleton instance for the admin client
let supabaseAdmin: SupabaseClient<Database> | null = null;

/**
 * Returns a Supabase client with admin/service role privileges.
 * This client bypasses RLS - use with caution!
 *
 * @example
 * ```ts
 * // In an API route or server action
 * const supabase = getSupabaseAdminClient();
 * const { data, error } = await supabase
 *   .from('news_items')
 *   .insert({ ... });
 * ```
 */
export function getSupabaseAdminClient(): SupabaseClient<Database> {
  if (supabaseAdmin) {
    return supabaseAdmin;
  }

  supabaseAdmin = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: {
      // Disable auto-refresh and persistence for server-side usage
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}

/**
 * Helper type for news_items row
 */
export type NewsItem = Database['public']['Tables']['news_items']['Row'];
export type NewsItemInsert = Database['public']['Tables']['news_items']['Insert'];
