import 'react-native-url-polyfill/auto';
import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from '../config/env';

const { url, key } = getSupabaseConfig();

export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          storage: localStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : (null as unknown as ReturnType<typeof createClient>);
