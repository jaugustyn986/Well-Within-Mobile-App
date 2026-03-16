/**
 * Sync test: push partial failure only marks successful rows clean.
 * Mock upsert to fail on second call; two dirty rows → only first is marked clean.
 */

declare const global: { AsyncStorageMock: Record<string, string> };

jest.mock('../../config/env', () => ({ hasSupabaseEnv: () => true }));

let upsertCallCount = 0;
const mockFrom = () => ({
  upsert: (payload: unknown, _opts: unknown) => {
    upsertCallCount += 1;
    if (upsertCallCount === 2) {
      return Promise.resolve({ error: { message: 'Conflict' }, data: null });
    }
    return Promise.resolve({ error: null, data: payload });
  },
});

const mockSupabase = { from: mockFrom };
jest.mock('../../lib/supabase', () => ({ supabase: mockSupabase }));

beforeEach(() => {
  upsertCallCount = 0;
  const store = global.AsyncStorageMock;
  for (const key of Object.keys(store)) delete store[key];
});

describe('sync - push partial failure only marks successful rows clean', () => {
  test('when second upsert fails, only first row is marked clean', async () => {
    const store = global.AsyncStorageMock;
    const { STORAGE_KEY_V1, getStoredState } = await import('../storageV2');
    const migrationDoneKey = 'wellwithin_entries_migration_v1_done';
    store[migrationDoneKey] = 'true';
    store[STORAGE_KEY_V1] = JSON.stringify({
      version: 1,
      entriesByDate: {
        '2025-01-01': {
          clientUpdatedAt: '2025-01-01T10:00:00Z',
          dirty: true,
          deleted: false,
          entry: { date: '2025-01-01', bleeding: 'light' },
        },
        '2025-01-02': {
          clientUpdatedAt: '2025-01-02T10:00:00Z',
          dirty: true,
          deleted: false,
          entry: { date: '2025-01-02', sensation: 'dry' },
        },
      },
      lastSuccessfulSyncAt: null,
      lastSyncError: null,
    });

    const { pushDirtyEntries } = await import('../sync');
    await pushDirtyEntries('user-123');
    const state = await getStoredState();
    expect(state.entriesByDate['2025-01-01'].dirty).toBe(false);
    expect(state.entriesByDate['2025-01-02'].dirty).toBe(true);
  });
});
