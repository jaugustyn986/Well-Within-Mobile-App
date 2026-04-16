import * as QueryParams from 'expo-auth-session/build/QueryParams';
import Constants from 'expo-constants';
import type { EmailOtpType, Session } from '@supabase/supabase-js';
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

type AuthCallbackParams = {
  access_token?: string;
  refresh_token?: string;
  token_hash?: string;
  type?: string;
  code?: string;
  error?: string;
  error_code?: string;
  error_description?: string;
};

function parseFragmentParams(url: string): Record<string, string> {
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) return {};
  const fragment = url.slice(hashIndex + 1);
  const parsed = new URLSearchParams(fragment);
  const result: Record<string, string> = {};
  parsed.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

function parseCallbackParams(url: string): AuthCallbackParams {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);

  const queryParams = Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
    if (typeof v === 'string') acc[k] = v;
    return acc;
  }, {});
  const fragmentParams = parseFragmentParams(url);
  return { ...fragmentParams, ...queryParams };
}

/**
 * Parse callback URL from magic link and set session. No custom token exchange.
 * Call when app opens via {scheme}://auth/callback?access_token=...&refresh_token=...
 */
export async function createSessionFromUrl(url: string): Promise<Session | null> {
  if (!hasSupabaseEnv() || !supabase) return null;
  const params = parseCallbackParams(url);

  if (params.error || params.error_code) {
    throw new Error(params.error_description ?? params.error ?? params.error_code);
  }

  if (params.access_token) {
    const { data, error } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token ?? '',
    });
    if (error) throw error;
    return data.session;
  }

  if (params.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) throw error;
    return data.session;
  }

  if (params.token_hash && params.type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: params.token_hash,
      type: params.type as EmailOtpType,
    });
    if (error) throw error;
    return data.session;
  }

  return null;
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
