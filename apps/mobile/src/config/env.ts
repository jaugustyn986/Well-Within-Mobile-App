/**
 * Supabase env config. Read by lib/supabase.ts.
 * Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in apps/mobile/.env (do not commit).
 */

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const isDev = __DEV__;

export function getSupabaseConfig(): { url: string; key: string } {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    if (isDev) {
      throw new Error(
        'Missing Supabase env: set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in apps/mobile/.env'
      );
    }
    return { url: '', key: '' };
  }
  return { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY };
}

export type SupabaseConfig = ReturnType<typeof getSupabaseConfig>;

export function hasSupabaseEnv(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}
