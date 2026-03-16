/**
 * Sync test: invalid remote payload is skipped (not merged).
 * Pull returns one valid and one invalid row; only valid is merged.
 */

declare const global: { AsyncStorageMock: Record<string, string> };

jest.mock('../../config/env', () => ({ hasSupabaseEnv: () => true }));

const validRow = {
  entry_date: '2025-01-01',
  entry_payload: { date: '2025-01-01', bleeding: 'light' },
  client_updated_at: '2025-01-01T12:00:00Z',
  deleted_at: null,
};
const invalidRow = {
  entry_date: '2025-01-02',
  entry_payload: { date: '2025-01-02', bleeding: 'invalid' },
  client_updated_at: '2025-01-02T12:00:00Z',
  deleted_at: null,
};

const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [validRow, invalidRow], error: null }),
      }),
    }),
  }),
};
jest.mock('../../lib/supabase', () => ({ supabase: mockSupabase }));

beforeEach(() => {
  const store = global.AsyncStorageMock;
  for (const key of Object.keys(store)) delete store[key];
});

describe('sync - invalid remote payload skipped', () => {
  test('pull with one valid and one invalid row only merges valid row', async () => {
    const store = global.AsyncStorageMock;
    const { STORAGE_KEY_V1, getStoredState } = await import('../storageV2');
    const migrationDoneKey = 'wellwithin_entries_migration_v1_done';
    store[migrationDoneKey] = 'true';
    store[STORAGE_KEY_V1] = JSON.stringify({
      version: 1,
      entriesByDate: {},
      lastSuccessfulSyncAt: null,
      lastSyncError: null,
    });

    const { pullRemoteEntries } = await import('../sync');
    const result = await pullRemoteEntries('user-123');
    expect(result.error).toBeNull();
    const state = await getStoredState();
    expect(state.entriesByDate['2025-01-01']).toBeDefined();
    expect(state.entriesByDate['2025-01-01'].entry).toMatchObject({ date: '2025-01-01', bleeding: 'light' });
    expect(state.entriesByDate['2025-01-02']).toBeUndefined();
  });
});
