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

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

type ProfileStateSelect = Pick<
  ProfileRow,
  'onboarding_status' | 'onboarding_completed_at' | 'login_count'
>;

type OnboardingResponseInsert =
  Database['public']['Tables']['onboarding_responses']['Insert'];

type IncrementLoginArgs =
  Database['public']['Functions']['increment_login_count']['Args'];

/* -------------------------------------------------------------------------- */
/*                               Supabase Client                               */
/* -------------------------------------------------------------------------- */

async function getServerClient() {
  const cookieStore = await cookies();
  const key = env.SUPABASE_ANON_KEY;

  const looksLikeServiceRole =
    key.includes('service_role') ||
    (key.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.') &&
      key.includes('"role":"service_role"'));

  if (looksLikeServiceRole) {
    throw new Error(
      'SECURITY: getServerClient must use ANON key, not SERVICE_ROLE'
    );
  }

  return createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) => {
        try {
          cookieStore.set(name, value, options);
        } catch {}
      },
      remove: (name) => {
        try {
          cookieStore.delete(name);
        } catch {}
      },
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                           Onboarding – Read state                           */
/* -------------------------------------------------------------------------- */

export async function getProfileOnboardingState(userId: string) {
  try {
    const supabase = await getServerClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_status, onboarding_completed_at, login_count')
      .eq('id', userId)
      .returns<ProfileStateSelect[]>()
      .maybeSingle();

    if (error || !data) {
      return {
        status: 'incomplete' as const,
        completed_at: null,
        login_count: 0,
      };
    }

    return {
      status: (data.onboarding_status ?? 'incomplete') as
        | 'incomplete'
        | 'complete',
      completed_at: data.onboarding_completed_at ?? null,
      login_count: data.login_count ?? 0,
    };
  } catch {
    return {
      status: 'incomplete' as const,
      completed_at: null,
      login_count: 0,
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                          Onboarding – Complete flow                         */
/* -------------------------------------------------------------------------- */

export async function completeOnboarding(userId: string, answers: unknown) {
  try {
    const validatedAnswers = onboardingAnswersSchema.parse(answers);
    const supabase = await getServerClient();

    const payload: OnboardingResponseInsert = {
      user_id: userId,
      version: 'v1_light',
      answers: validatedAnswers as OnboardingResponseInsert['answers'],
    };

    const { error: upsertError } = await supabase
      .from('onboarding_responses')
      .upsert([payload], { onConflict: 'user_id,version' });

    if (upsertError) {
      return { success: false, error: 'Failed to save onboarding response' };
    }

    const now = new Date().toISOString();

    const update: ProfileUpdate = {
      onboarding_status: 'complete',
      onboarding_completed_at: now,
      updated_at: now,
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update(update)
      .eq('id', userId);

    if (updateError) {
      return { success: false, error: 'Failed to update profile' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Invalid onboarding data' };
  }
}

/* -------------------------------------------------------------------------- */
/*                            Auth – Login counter                             */
/* -------------------------------------------------------------------------- */

export async function incrementLoginCount(userId: string) {
  try {
    const supabase = await getServerClient();

    const args: IncrementLoginArgs = { user_id_param: userId };
    const { error } = await supabase.rpc('increment_login_count', args);

    if (error) return { success: false };
    return { success: true };
  } catch {
    return { success: false };
  }
}

/* -------------------------------------------------------------------------- */
/*                              Auth – Current user                            */
/* -------------------------------------------------------------------------- */

export async function getCurrentUser() {
  try {
    const supabase = await getServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) return null;
    return data.user;
  } catch {
    return null;
  }
}
