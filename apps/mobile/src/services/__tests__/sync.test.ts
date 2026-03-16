/**
 * Sync tests: empty remote does not wipe local.
 * Supabase and env are mocked so pull returns empty rows.
 */

declare const global: { AsyncStorageMock: Record<string, string> };

jest.mock('../../config/env', () => ({ hasSupabaseEnv: () => true }));

const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  }),
};
jest.mock('../../lib/supabase', () => ({ supabase: mockSupabase }));

beforeEach(() => {
  const store = global.AsyncStorageMock;
  for (const key of Object.keys(store)) delete store[key];
});

describe('sync - empty remote does not wipe local', () => {
  test('after pull with zero rows, local entries unchanged', async () => {
    const store = global.AsyncStorageMock;
    const { STORAGE_KEY_V1, getStoredState } = await import('../storageV2');
    const migrationDoneKey = 'wellwithin_entries_migration_v1_done';
    store[migrationDoneKey] = 'true';
    const existingState = {
      version: 1,
      entriesByDate: {
        '2025-01-01': {
          clientUpdatedAt: '2025-01-01T10:00:00Z',
          dirty: false,
          deleted: false,
          entry: { date: '2025-01-01', bleeding: 'none' },
        },
      },
      lastSuccessfulSyncAt: null,
      lastSyncError: null,
    };
    store[STORAGE_KEY_V1] = JSON.stringify(existingState);

    const { pullRemoteEntries } = await import('../sync');
    const result = await pullRemoteEntries('user-123');
    expect(result.error).toBeNull();
    const state = await getStoredState();
    expect(state.entriesByDate['2025-01-01']).toBeDefined();
    expect(state.entriesByDate['2025-01-01'].entry).toMatchObject({
      date: '2025-01-01',
      bleeding: 'none',
    });
  });
});
