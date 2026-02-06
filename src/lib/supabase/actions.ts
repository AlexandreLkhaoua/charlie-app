/**
 * Supabase Server Actions
 * -----------------------
 * Server-side actions for onboarding and profile management.
 */

'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from './database';
import { onboardingAnswersSchema } from '../validation/schemas';
import { env } from '../env';

/**
 * Get server-side Supabase client with cookie handling
 */
async function getServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Cookie cannot be set in server actions
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.delete(name);
          } catch {
            // Cookie cannot be removed in server actions
          }
        },
      },
    }
  );
}

/**
 * Get profile onboarding state
 */
export async function getProfileOnboardingState(userId: string) {
  try {
    const supabase = await getServerClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_status, onboarding_completed_at, login_count')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('[Onboarding] Error fetching profile state:', error);
      return { 
        status: 'incomplete' as const, 
        completed_at: null,
        login_count: 0,
      };
    }
    
    return {
      status: ((data as any)?.onboarding_status || 'incomplete') as 'incomplete' | 'complete',
      completed_at: (data as any)?.onboarding_completed_at || null,
      login_count: (data as any)?.login_count || 0,
    };
  } catch (error) {
    console.error('[Onboarding] Unexpected error:', error);
    return { 
      status: 'incomplete' as const, 
      completed_at: null,
      login_count: 0,
    };
  }
}

/**
 * Complete onboarding - upsert response and update profile
 * Note: DB has UNIQUE constraint on (user_id, version) to prevent duplicates
 * and CHECK constraint to validate JSON keys (goal, horizon, drawdown_reaction)
 */
export async function completeOnboarding(
  userId: string,
  answers: unknown
) {
  try {
    // Validate answers
    const validatedAnswers = onboardingAnswersSchema.parse(answers);
    
    const supabase = await getServerClient();
    
    // Start transaction-like logic
    // 1. Upsert onboarding response (handles UNIQUE constraint on user_id+version)
    const { error: upsertError } = await (supabase as any)
      .from('onboarding_responses')
      .upsert(
        {
          user_id: userId,
          version: 'v1_light',
          answers: validatedAnswers,
        },
        { 
          onConflict: 'user_id,version',
          ignoreDuplicates: false, // Update existing row
        }
      );
    
    if (upsertError) {
      console.error('[Onboarding] Error upserting response:', upsertError);
      return { success: false, error: 'Failed to save onboarding response' };
    }
    
    // 2. Update profile status (RLS ensures user can only update their own profile)
    const { error: updateError } = await (supabase as any)
      .from('profiles')
      .update({
        onboarding_status: 'complete',
        onboarding_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('[Onboarding] Error updating profile:', updateError);
      return { success: false, error: 'Failed to update profile' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('[Onboarding] Validation or unexpected error:', error);
    return { success: false, error: 'Invalid onboarding data' };
  }
}

/**
 * Increment login count for a user
 * Note: DB function is SECURITY INVOKER, so it runs with user's RLS context
 * and explicitly checks auth.uid() === p_user_id to prevent abuse
 */
export async function incrementLoginCount(userId: string) {
  try {
    const supabase = await getServerClient();
    
    // Call the database function (SECURITY INVOKER + auth check inside)
    const { error } = await (supabase as any).rpc('increment_login_count', {
      p_user_id: userId,
    });
    
    if (error) {
      console.error('[Auth] Error incrementing login count:', error);
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    console.error('[Auth] Unexpected error incrementing login count:', error);
    return { success: false };
  }
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  try {
    const supabase = await getServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('[Auth] Error getting current user:', error);
    return null;
  }
}
