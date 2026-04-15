import * as QueryParams from 'expo-auth-session/build/QueryParams';
import Constants from 'expo-constants';
import type { Session } from '@supabase/supabase-js';
import { hasSupabaseEnv } from '../config/env';
import { supabase } from '../lib/supabase';

function getAuthScheme(): string {
  const raw = Constants.expoConfig?.scheme;
  if (Array.isArray(raw)) return raw[0] ?? 'wellwithin';
  if (typeof raw === 'string' && raw.length > 0) return raw;
  return 'wellwithin';
}

/** Magic link redirects here so the OS can open the app. Scheme matches app.config (production vs dev). */
export function getRedirectUrl(): string {
  return `${getAuthScheme()}://auth/callback`;
}

/**
 * Parse callback URL from magic link and set session. No custom token exchange.
 * Call when app opens via {scheme}://auth/callback?access_token=...&refresh_token=...
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
