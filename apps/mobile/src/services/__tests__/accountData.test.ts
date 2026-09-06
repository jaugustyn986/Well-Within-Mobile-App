declare const global: { AsyncStorageMock: Record<string, string> };

jest.mock('../../config/env', () => ({ hasSupabaseEnv: () => true }));

const mockGetSession = jest.fn();
const mockRpc = jest.fn();
const mockInvoke = jest.fn();
const mockSignOut = jest.fn();

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
    },
    rpc: (...args: unknown[]) => mockRpc(...args),
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

const session = {
  access_token: 'session-token',
  user: { id: 'account-123' },
};

beforeEach(() => {
  for (const key of Object.keys(global.AsyncStorageMock)) delete global.AsyncStorageMock[key];
  mockGetSession.mockReset().mockResolvedValue({ data: { session }, error: null });
  mockRpc.mockReset();
  mockInvoke.mockReset();
  mockSignOut.mockReset().mockResolvedValue({ error: null });
});

async function seedLocalEntry(): Promise<void> {
  const { saveDailyEntry } = await import('../storageV2');
  await saveDailyEntry('2026-07-11', { date: '2026-07-11', sensation: 'dry' });
}

describe('account data service', () => {
  test('deletes cloud chart data by current session and records the reset marker locally', async () => {
    const resetAt = '2026-07-11T20:00:00.000Z';
    mockRpc.mockResolvedValue({ data: resetAt, error: null });
    await seedLocalEntry();

    const { deleteBackedUpChartData } = await import('../accountData');
    const result = await deleteBackedUpChartData();

    expect(result.error).toBeNull();
    expect(mockRpc).toHaveBeenCalledWith('delete_my_chart_data');
    const { getStoredState } = await import('../storageV2');
    const state = await getStoredState();
    expect(state.entriesByDate).toEqual({});
    expect(state.lastCloudResetAt).toBe(resetAt);
  });

  test('preserves local chart data when the server does not delete the cloud copy', async () => {
    mockRpc.mockResolvedValue({ data: null, error: { message: 'Server unavailable' } });
    await seedLocalEntry();

    const { deleteBackedUpChartData } = await import('../accountData');
    const result = await deleteBackedUpChartData();

    expect(result.error).toBe('Server unavailable');
    const { getAllEntries } = await import('../storageV2');
    expect(await getAllEntries()).toHaveProperty('2026-07-11');
  });

  test('deletes the authenticated account before clearing local data and session', async () => {
    mockInvoke.mockResolvedValue({ data: { ok: true }, error: null });
    await seedLocalEntry();

    const { deleteCurrentAccount } = await import('../accountData');
    const result = await deleteCurrentAccount();

    expect(result.error).toBeNull();
    expect(mockInvoke).toHaveBeenCalledWith('delete-account', {
      method: 'POST',
      headers: { Authorization: 'Bearer session-token' },
    });
    expect(mockSignOut).toHaveBeenCalledWith({ scope: 'local' });
    const { getAllEntries } = await import('../storageV2');
    expect(await getAllEntries()).toEqual({});
  });

  test('does not clear local data or session when account deletion fails', async () => {
    mockInvoke.mockResolvedValue({ data: null, error: new Error('Deletion unavailable') });
    await seedLocalEntry();

    const { deleteCurrentAccount } = await import('../accountData');
    const result = await deleteCurrentAccount();

    expect(result.error).toBe('Deletion unavailable');
    expect(mockSignOut).not.toHaveBeenCalled();
    const { getAllEntries } = await import('../storageV2');
    expect(await getAllEntries()).toHaveProperty('2026-07-11');
  });

  test('reports incomplete local session cleanup after the server deletes the account', async () => {
    mockInvoke.mockResolvedValue({ data: { ok: true }, error: null });
    mockSignOut.mockResolvedValue({ error: { message: 'Local session cleanup failed' } });

    const { deleteCurrentAccount } = await import('../accountData');
    const result = await deleteCurrentAccount();

    expect(result.error).toContain('Your account was deleted');
    expect(result.error).toContain('Local session cleanup failed');
  });
});
