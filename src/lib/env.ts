/**
 * Environment Variables Validation
 * ---------------------------------
 * Validates all required environment variables at build/runtime.
 * Import this file early in your application to catch missing env vars.
 */

import { z } from 'zod';

const envSchema = z.object({
  // Supabase (server-only)
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  // News refresh endpoint protection
  NEWS_REFRESH_SECRET: z.string().min(16, 'NEWS_REFRESH_SECRET must be at least 16 characters'),

  // Market news provider selection
  MARKET_NEWS_PROVIDER: z.enum(['marketaux', 'finnhub'], {
    errorMap: () => ({ message: 'MARKET_NEWS_PROVIDER must be either "marketaux" or "finnhub"' }),
  }),

  // Provider-specific API keys (validated conditionally below)
  MARKETAUX_API_KEY: z.string().optional(),
  FINNHUB_API_KEY: z.string().optional(),
});

// Type for the validated environment
export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables and returns typed env object.
 * Throws descriptive error if validation fails.
 */
function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEWS_REFRESH_SECRET: process.env.NEWS_REFRESH_SECRET,
    MARKET_NEWS_PROVIDER: process.env.MARKET_NEWS_PROVIDER,
    MARKETAUX_API_KEY: process.env.MARKETAUX_API_KEY,
    FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
  });

  if (!parsed.success) {
    const errors = parsed.error.errors
      .map((err) => `  - ${err.path.join('.')}: ${err.message}`)
      .join('\n');
    throw new Error(`❌ Invalid environment variables:\n${errors}`);
  }

  const env = parsed.data;

  // Conditional validation: ensure the selected provider has its API key
  if (env.MARKET_NEWS_PROVIDER === 'marketaux' && !env.MARKETAUX_API_KEY) {
    throw new Error('❌ MARKETAUX_API_KEY is required when MARKET_NEWS_PROVIDER is "marketaux"');
  }

  if (env.MARKET_NEWS_PROVIDER === 'finnhub' && !env.FINNHUB_API_KEY) {
    throw new Error('❌ FINNHUB_API_KEY is required when MARKET_NEWS_PROVIDER is "finnhub"');
  }

  return env;
}

/**
 * Validated environment variables.
 * Access these instead of process.env directly for type safety.
 */
export const env = validateEnv();

/**
 * Helper to get the active news provider API key
 */
export function getNewsProviderApiKey(): string {
  if (env.MARKET_NEWS_PROVIDER === 'marketaux') {
    return env.MARKETAUX_API_KEY!;
  }
  return env.FINNHUB_API_KEY!;
}
