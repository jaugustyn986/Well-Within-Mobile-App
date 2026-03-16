import * as QueryParams from 'expo-auth-session/build/QueryParams';
import type { Session } from '@supabase/supabase-js';
import { hasSupabaseEnv } from '../config/env';
import { supabase } from '../lib/supabase';

/** Magic link must redirect to this URL so tapping the link opens the app (not localhost). */
const AUTH_CALLBACK_URL = 'wellwithin://auth/callback';

export function getRedirectUrl(): string {
  return AUTH_CALLBACK_URL;
}

/**
 * Parse callback URL from magic link and set session. No custom token exchange.
 * Call when app opens via wellwithin://auth/callback?access_token=...&refresh_token=...
 */
export async function createSessionFromUrl(url: string): Promise<Session | null> {
  if (!hasSupabaseEnv() || !supabase) return null;
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;
  if (!access_token) return null;
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token: refresh_token ?? '',
  });
  if (error) throw error;
  return data.session;
}

export async function signInWithOtp(email: string): Promise<{ error: Error | null }> {
  if (!hasSupabaseEnv() || !supabase) {
    return { error: new Error('Supabase is not configured') };
  }
  const redirectTo = getRedirectUrl();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  return { error: error ?? null };
}

export async function signOut(): Promise<void> {
  if (hasSupabaseEnv() && supabase) {
    await supabase.auth.signOut();
  }
}
