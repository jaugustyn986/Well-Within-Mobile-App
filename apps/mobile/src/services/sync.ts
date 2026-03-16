import { hasSupabaseEnv } from '../config/env';
import { supabase } from '../lib/supabase';
import { validateDailyEntry } from '../lib/validateEntry';
import { mergeOne, type RemoteRow } from './merge';
import {
  getStoredState,
  writeStoredState,
  type StoredEntriesState,
  type StoredEntryRecord,
} from './storageV2';

export async function pullRemoteEntries(userId: string): Promise<{ error: string | null }> {
  if (!hasSupabaseEnv() || !supabase) {
    return { error: 'Supabase is not configured' };
  }
  const { data: rows, error } = await supabase
    .from('daily_entries')
    .select('entry_date, entry_payload, client_updated_at, deleted_at')
    .eq('user_id', userId)
    .order('server_updated_at', { ascending: false });
  if (error) {
    const state = await getStoredState();
    await writeStoredState({ ...state, lastSyncError: error.message });
    return { error: error.message };
  }
  const state = await getStoredState();
  const entriesByDate = { ...state.entriesByDate };
  const remoteList = (rows ?? []) as RemoteRow[];
  for (const row of remoteList) {
    const result = validateDailyEntry(row.entry_payload);
    if (!result.success) continue;
    const date = row.entry_date;
    const local = entriesByDate[date];
    const merged = mergeOne(date, local, row);
    if (merged) entriesByDate[date] = merged;
  }
  const newState: StoredEntriesState = {
    ...state,
    entriesByDate,
    lastSuccessfulSyncAt: new Date().toISOString(),
    lastSyncError: null,
  };
  await writeStoredState(newState);
  return { error: null };
}

export async function pushDirtyEntries(userId: string): Promise<{ error: string | null }> {
  if (!hasSupabaseEnv() || !supabase) {
    return { error: 'Supabase is not configured' };
  }
  const state = await getStoredState();
  const toPush = Object.entries(state.entriesByDate).filter(([, r]) => r.dirty);
  let lastError: string | null = null;
  const updates: Array<{ date: string; record: StoredEntryRecord }> = [];
  for (const [date, record] of toPush) {
    if (record.deleted) {
      const { error } = await supabase
        .from('daily_entries')
        .upsert(
          {
            user_id: userId,
            entry_date: date,
            entry_payload: record.entry,
            client_updated_at: record.clientUpdatedAt,
            deleted_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,entry_date' }
        );
      if (error) {
        lastError = error.message;
        continue;
      }
      updates.push({ date, record: { ...record, dirty: false } });
    } else {
      const result = validateDailyEntry(record.entry);
      if (!result.success) continue;
      const { error } = await supabase.from('daily_entries').upsert(
        {
          user_id: userId,
          entry_date: date,
          entry_payload: result.data,
          client_updated_at: record.clientUpdatedAt,
          deleted_at: null,
        },
        { onConflict: 'user_id,entry_date' }
      );
      if (error) {
        lastError = error.message;
        continue;
      }
      updates.push({ date, record: { ...record, dirty: false } });
    }
  }
  if (updates.length > 0) {
    const nextState: StoredEntriesState = {
      ...state,
      entriesByDate: { ...state.entriesByDate },
    };
    for (const { date, record } of updates) {
      nextState.entriesByDate[date] = record;
    }
    nextState.lastSuccessfulSyncAt = new Date().toISOString();
    nextState.lastSyncError = lastError;
    await writeStoredState(nextState);
  }
  return { error: lastError };
}

export async function syncNow(userId: string): Promise<{ error: string | null }> {
  const pullResult = await pullRemoteEntries(userId);
  if (pullResult.error) {
    const state = await getStoredState();
    await writeStoredState({
      ...state,
      lastSyncError: pullResult.error,
    });
    return pullResult;
  }
  return pushDirtyEntries(userId);
}
