/**
 * Sync test: sign-in on second device restores remote data (empty local + pull = local matches remote).
 */

declare const global: { AsyncStorageMock: Record<string, string> };

jest.mock('../../config/env', () => ({ hasSupabaseEnv: () => true }));

const remoteRows = [
  {
    entry_date: '2025-01-01',
    entry_payload: { date: '2025-01-01', bleeding: 'light' },
    client_updated_at: '2025-01-01T12:00:00Z',
    deleted_at: null,
  },
  {
    entry_date: '2025-01-02',
    entry_payload: { date: '2025-01-02', sensation: 'dry' },
    client_updated_at: '2025-01-02T12:00:00Z',
    deleted_at: null,
  },
];

const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: remoteRows, error: null }),
      }),
    }),
  }),
};
jest.mock('../../lib/supabase', () => ({ supabase: mockSupabase }));

beforeEach(() => {
  const store = global.AsyncStorageMock;
  for (const key of Object.keys(store)) delete store[key];
});

describe('sync - second device restore', () => {
  test('empty local + pull with remote rows leaves local matching remote', async () => {
    const store = global.AsyncStorageMock;
    const { STORAGE_KEY_V1, getStoredState, getAllEntries } = await import('../storageV2');
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
    expect(state.entriesByDate['2025-01-01']?.entry).toMatchObject({ date: '2025-01-01', bleeding: 'light' });
    expect(state.entriesByDate['2025-01-02']?.entry).toMatchObject({ date: '2025-01-02', sensation: 'dry' });
    const entries = await getAllEntries();
    expect(Object.keys(entries)).toHaveLength(2);
  });
});
