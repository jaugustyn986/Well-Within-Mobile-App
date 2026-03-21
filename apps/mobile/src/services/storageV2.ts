import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyEntry } from 'core-rules-engine';
import { validateDailyEntry } from '../lib/validateEntry';

export const STORAGE_KEY_V1 = 'wellwithin_entries_state_v1';
const LEGACY_ENTRIES_KEY = 'holistic_cycle_entries';
const LEGACY_MIGRATION_KEY = 'holistic_cycle_migration_v3';
const MIGRATION_V2_DONE_KEY = 'wellwithin_entries_migration_v1_done';

export interface StoredEntryRecord {
  clientUpdatedAt: string;
  dirty: boolean;
  deleted?: boolean;
  entry: DailyEntry;
}

export interface StoredEntriesState {
  version: number;
  entriesByDate: Record<string, StoredEntryRecord>;
  lastSuccessfulSyncAt: string | null;
  lastSyncError: string | null;
}

const ENVELOPE_VERSION = 1;

function emptyState(): StoredEntriesState {
  return {
    version: ENVELOPE_VERSION,
    entriesByDate: {},
    lastSuccessfulSyncAt: null,
    lastSyncError: null,
  };
}

async function readState(): Promise<StoredEntriesState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY_V1);
  if (!raw) return emptyState();
  try {
    const parsed = JSON.parse(raw) as StoredEntriesState;
    if (typeof parsed.version !== 'number' || typeof parsed.entriesByDate !== 'object') {
      return emptyState();
    }
    return {
      version: parsed.version,
      entriesByDate: parsed.entriesByDate ?? {},
      lastSuccessfulSyncAt: parsed.lastSuccessfulSyncAt ?? null,
      lastSyncError: parsed.lastSyncError ?? null,
    };
  } catch {
    return emptyState();
  }
}

async function writeState(state: StoredEntriesState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_V1, JSON.stringify(state));
}

/**
 * Migrate from legacy keys (holistic_cycle_entries) into versioned envelope.
 * Does not delete or overwrite legacy data on failure.
 */
async function runLegacyMigrationIfNeeded(): Promise<void> {
  const done = await AsyncStorage.getItem(MIGRATION_V2_DONE_KEY);
  if (done === 'true') return;

  const legacyRaw = await AsyncStorage.getItem(LEGACY_ENTRIES_KEY);
  if (!legacyRaw) {
    await AsyncStorage.setItem(MIGRATION_V2_DONE_KEY, 'true');
    return;
  }

  let legacyEntries: Record<string, unknown>;
  try {
    legacyEntries = JSON.parse(legacyRaw) as Record<string, unknown>;
  } catch {
    await AsyncStorage.setItem(MIGRATION_V2_DONE_KEY, 'true');
    return;
  }

  const now = new Date().toISOString();
  const entriesByDate: Record<string, StoredEntryRecord> = {};

  for (const [date, raw] of Object.entries(legacyEntries)) {
    if (typeof date !== 'string' || !raw || typeof raw !== 'object') continue;
    const result = validateDailyEntry(raw);
    if (!result.success) continue;
    const entry = { ...result.data, date };
    entriesByDate[date] = {
      clientUpdatedAt: now,
      dirty: true,
      deleted: false,
      entry,
    };
  }

  const state: StoredEntriesState = {
    version: ENVELOPE_VERSION,
    entriesByDate,
    lastSuccessfulSyncAt: null,
    lastSyncError: null,
  };
  await writeState(state);
  await AsyncStorage.setItem(MIGRATION_V2_DONE_KEY, 'true');
}

/**
 * Call once at app init before using storageV2. Safe to call multiple times.
 */
export async function ensureMigrationDone(): Promise<void> {
  try {
    await runLegacyMigrationIfNeeded();
  } catch {
    // Do not overwrite legacy keys; do not set migration flag. Retry on next launch.
  }
}

export async function getStoredState(): Promise<StoredEntriesState> {
  await ensureMigrationDone();
  return readState();
}

export async function writeStoredState(state: StoredEntriesState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_V1, JSON.stringify(state));
}

// --- Adapter: Record<string, DailyEntry> for hooks ---

export type StoredEntries = Record<string, DailyEntry>;

export function getEntriesMapFromState(state: StoredEntriesState): StoredEntries {
  const out: StoredEntries = {};
  for (const [date, rec] of Object.entries(state.entriesByDate)) {
    if (rec.deleted) continue;
    out[date] = rec.entry;
  }
  return out;
}

export async function getAllEntries(): Promise<StoredEntries> {
  const state = await getStoredState();
  return getEntriesMapFromState(state);
}

export async function getDailyEntry(date: string): Promise<DailyEntry | null> {
  const state = await getStoredState();
  const rec = state.entriesByDate[date];
  if (!rec || rec.deleted) return null;
  return rec.entry;
}

export async function saveDailyEntry(date: string, entry: DailyEntry): Promise<void> {
  const state = await getStoredState();
  const now = new Date().toISOString();
  const fullEntry = { ...entry, date };
  state.entriesByDate[date] = {
    clientUpdatedAt: now,
    dirty: true,
    deleted: false,
    entry: fullEntry,
  };
  await writeState(state);
}

export async function deleteEntry(date: string): Promise<void> {
  const state = await getStoredState();
  const rec = state.entriesByDate[date];
  const now = new Date().toISOString();
  if (rec) {
    state.entriesByDate[date] = {
      ...rec,
      dirty: true,
      deleted: true,
      clientUpdatedAt: now,
    };
  } else {
    state.entriesByDate[date] = {
      clientUpdatedAt: now,
      dirty: true,
      deleted: true,
      entry: { date },
    };
  }
  await writeState(state);
}

export async function clearAllEntries(): Promise<void> {
  await writeState(emptyState());
}

export function entriesToSortedArray(stored: StoredEntries): DailyEntry[] {
  return Object.keys(stored)
    .sort()
    .map((key) => stored[key]);
}
