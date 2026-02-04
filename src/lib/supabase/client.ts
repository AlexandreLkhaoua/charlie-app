/**
 * Supabase Browser Client
 * -----------------------
 * Client-side Supabase client for authentication and user-scoped queries.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
  
  // If no URL/key, return a dummy client that won't crash
  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Supabase] No credentials found, running in demo mode');
    // Return a minimal mock that satisfies the type
    return createBrowserClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  }
  
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
