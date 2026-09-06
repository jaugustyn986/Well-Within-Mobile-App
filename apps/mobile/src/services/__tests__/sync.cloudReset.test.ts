declare const global: { AsyncStorageMock: Record<string, string> };

jest.mock('../../config/env', () => ({ hasSupabaseEnv: () => true }));

let cloudResetAt: string | null = null;
const mockUpsert = jest.fn();

const mockSupabase = {
  from: (table: string) => table === 'profiles'
    ? {
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({
              data: cloudResetAt ? { chart_data_deleted_at: cloudResetAt } : null,
              error: null,
            }),
          }),
        }),
      }
    : {
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        upsert: (...args: unknown[]) => mockUpsert(...args),
      },
};

jest.mock('../../lib/supabase', () => ({ supabase: mockSupabase }));

beforeEach(() => {
  cloudResetAt = null;
  mockUpsert.mockReset().mockResolvedValue({ data: null, error: null });
  for (const key of Object.keys(global.AsyncStorageMock)) delete global.AsyncStorageMock[key];
  global.AsyncStorageMock.wellwithin_entries_migration_v1_done = 'true';
});

async function writeLocalState(lastCloudResetAt: string | null): Promise<void> {
  const { STORAGE_KEY_V1 } = await import('../storageV2');
  global.AsyncStorageMock[STORAGE_KEY_V1] = JSON.stringify({
    version: 1,
    entriesByDate: {
      '2026-07-10': {
        clientUpdatedAt: '2026-07-10T12:00:00.000Z',
        dirty: true,
        deleted: false,
        entry: { date: '2026-07-10', sensation: 'dry' },
      },
    },
    lastSuccessfulSyncAt: null,
    lastSyncError: null,
    lastCloudResetAt,
  });
}

describe('sync cloud deletion marker', () => {
  test('clears stale local entries before push when another device deleted chart data', async () => {
    cloudResetAt = '2026-07-11T20:00:00.000Z';
    await writeLocalState(null);

    const { syncNow } = await import('../sync');
    const result = await syncNow('account-123');

    expect(result.error).toBeNull();
    expect(mockUpsert).not.toHaveBeenCalled();
    const { getStoredState } = await import('../storageV2');
    const state = await getStoredState();
    expect(state.entriesByDate).toEqual({});
    expect(state.lastCloudResetAt).toBe(cloudResetAt);
  });

  test('allows entries created after the device has acknowledged the reset to sync', async () => {
    cloudResetAt = '2026-07-11T20:00:00.000Z';
    await writeLocalState(cloudResetAt);

    const { syncNow } = await import('../sync');
    const result = await syncNow('account-123');

    expect(result.error).toBeNull();
    expect(mockUpsert).toHaveBeenCalledTimes(1);
    const { getStoredState } = await import('../storageV2');
    expect((await getStoredState()).entriesByDate['2026-07-10']?.dirty).toBe(false);
  });
});
