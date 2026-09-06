import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
  cleanUpIdentityProviders,
  ProviderCleanupRequiredError,
} from './providerCleanup.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
    if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' });

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const authorization = request.headers.get('Authorization');

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return json(500, { error: 'Account deletion is not configured.' });
    }
    if (!authorization?.startsWith('Bearer ')) {
      return json(401, { error: 'Authentication required.' });
    }

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userError } = await callerClient.auth.getUser();
    if (userError || !userData.user) {
      return json(401, { error: 'Your session is no longer valid. Please sign in again.' });
    }

    try {
      await cleanUpIdentityProviders(userData.user);
    } catch (error: unknown) {
      if (error instanceof ProviderCleanupRequiredError) {
        return json(409, {
          error: 'This sign-in provider needs an account-deletion adapter before deletion can continue.',
        });
      }
      return json(500, { error: 'Could not complete identity-provider cleanup.' });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userData.user.id, false);
    if (deleteError) return json(500, { error: 'Could not delete the account.' });

    return json(200, { ok: true });
  },
};
