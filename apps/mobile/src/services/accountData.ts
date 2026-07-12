import type { Session } from '@supabase/supabase-js';
import { hasSupabaseEnv } from '../config/env';
import { supabase } from '../lib/supabase';
import { clearAllEntries } from './storageV2';

export type AccountDataActionResult = {
  error: string | null;
};

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}

async function getAuthenticatedSession(): Promise<{
  session: Session | null;
  error: string | null;
}> {
  if (!hasSupabaseEnv() || !supabase) {
    return { session: null, error: 'Cloud backup is not configured.' };
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) return { session: null, error: error.message };
  if (!data.session?.user?.id) {
    return { session: null, error: 'Please sign in again before deleting cloud data.' };
  }
  return { session: data.session, error: null };
}

/**
 * Deletes chart rows for the current authenticated account and records a reset
 * marker that stale devices must acknowledge before they can push again.
 * This contract depends on account identity, not the sign-in method.
 */
export async function deleteBackedUpChartData(): Promise<AccountDataActionResult> {
  const auth = await getAuthenticatedSession();
  if (!auth.session) return { error: auth.error };

  const { data, error } = await supabase.rpc('delete_my_chart_data');
  if (error) return { error: error.message };

  const resetAt = typeof data === 'string' ? data : null;
  if (!resetAt || Number.isNaN(Date.parse(resetAt))) {
    return { error: 'The server did not confirm when the chart data was deleted.' };
  }

  try {
    await clearAllEntries(resetAt);
  } catch (error: unknown) {
    return {
      error: `Backed-up chart data was deleted, but this device could not finish clearing its local copy. ${errorMessage(
        error,
        'Reopen the app and sync before adding another entry.',
      )}`,
    };
  }

  return { error: null };
}

/**
 * Invokes the privileged backend account-deletion adapter, then clears only
 * local app/session state. Privileged credentials never enter the app bundle.
 */
export async function deleteCurrentAccount(): Promise<AccountDataActionResult> {
  const auth = await getAuthenticatedSession();
  if (!auth.session) return { error: auth.error };

  const { data, error } = await supabase.functions.invoke<{ ok?: boolean; error?: string }>(
    'delete-account',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.session.access_token}` },
    },
  );

  if (error) return { error: errorMessage(error, 'Could not delete the account.') };
  if (!data?.ok) return { error: data?.error ?? 'The server did not confirm account deletion.' };

  let localCleanupError: string | null = null;
  try {
    await clearAllEntries();
  } catch (cleanupError: unknown) {
    localCleanupError = errorMessage(cleanupError, 'Could not clear this device.');
  }

  try {
    const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' });
    if (signOutError) {
      localCleanupError = localCleanupError
        ? `${localCleanupError} ${signOutError.message}`
        : signOutError.message;
    }
  } catch (signOutError: unknown) {
    localCleanupError = localCleanupError
      ? `${localCleanupError} ${errorMessage(signOutError, 'Could not clear the local session.')}`
      : errorMessage(signOutError, 'Could not clear the local session.');
  }

  if (localCleanupError) {
    return {
      error: `Your account was deleted, but local cleanup was incomplete. ${localCleanupError}`,
    };
  }

  return { error: null };
}
