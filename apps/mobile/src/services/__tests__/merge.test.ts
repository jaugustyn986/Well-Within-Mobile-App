import { mergeOne } from '../merge';
import type { StoredEntryRecord } from '../storageV2';
import type { RemoteRow } from '../merge';

const date = '2025-01-15';

describe('mergeOne', () => {
  test('only local exists - keep local', () => {
    const local: StoredEntryRecord = {
      clientUpdatedAt: '2025-01-15T10:00:00Z',
      dirty: true,
      deleted: false,
      entry: { date, bleeding: 'light' },
    };
    const result = mergeOne(date, local, undefined);
    expect(result).toEqual(local);
  });

  test('only remote exists and not deleted - adopt remote', () => {
    const remote: RemoteRow = {
      entry_date: date,
      entry_payload: { date, sensation: 'dry' },
      client_updated_at: '2025-01-15T12:00:00Z',
      deleted_at: null,
    };
    const result = mergeOne(date, undefined, remote);
    expect(result?.entry).toMatchObject({ date, sensation: 'dry' });
    expect(result?.dirty).toBe(false);
    expect(result?.deleted).toBe(false);
  });

  test('only remote exists and deleted - tombstone', () => {
    const remote: RemoteRow = {
      entry_date: date,
      entry_payload: {},
      client_updated_at: '2025-01-15T12:00:00Z',
      deleted_at: '2025-01-15T12:00:00Z',
    };
    const result = mergeOne(date, undefined, remote);
    expect(result?.deleted).toBe(true);
    expect(result?.dirty).toBe(false);
  });

  test('remote newer than local wins', () => {
    const local: StoredEntryRecord = {
      clientUpdatedAt: '2025-01-15T10:00:00Z',
      dirty: false,
      deleted: false,
      entry: { date, bleeding: 'light' },
    };
    const remote: RemoteRow = {
      entry_date: date,
      entry_payload: { date, bleeding: 'heavy' },
      client_updated_at: '2025-01-15T14:00:00Z',
      deleted_at: null,
    };
    const result = mergeOne(date, local, remote);
    expect(result?.entry).toMatchObject({ bleeding: 'heavy' });
    expect(result?.clientUpdatedAt).toBe('2025-01-15T14:00:00Z');
  });

  test('local newer than remote wins', () => {
    const local: StoredEntryRecord = {
      clientUpdatedAt: '2025-01-15T14:00:00Z',
      dirty: true,
      deleted: false,
      entry: { date, bleeding: 'heavy' },
    };
    const remote: RemoteRow = {
      entry_date: date,
      entry_payload: { date, bleeding: 'light' },
      client_updated_at: '2025-01-15T10:00:00Z',
      deleted_at: null,
    };
    const result = mergeOne(date, local, remote);
    expect(result).toEqual(local);
  });

  test('tie prefers remote (clean)', () => {
    const ts = '2025-01-15T12:00:00Z';
    const local: StoredEntryRecord = {
      clientUpdatedAt: ts,
      dirty: true,
      deleted: false,
      entry: { date, bleeding: 'light' },
    };
    const remote: RemoteRow = {
      entry_date: date,
      entry_payload: { date, bleeding: 'heavy' },
      client_updated_at: ts,
      deleted_at: null,
    };
    const result = mergeOne(date, local, remote);
    expect(result?.entry).toMatchObject({ bleeding: 'heavy' });
    expect(result?.dirty).toBe(false);
  });

  test('delete beats equal-timestamp update (no resurrection)', () => {
    const ts = '2025-01-15T12:00:00Z';
    const local: StoredEntryRecord = {
      clientUpdatedAt: ts,
      dirty: false,
      deleted: false,
      entry: { date, bleeding: 'light' },
    };
    const remote: RemoteRow = {
      entry_date: date,
      entry_payload: {},
      client_updated_at: ts,
      deleted_at: ts,
    };
    const result = mergeOne(date, local, remote);
    expect(result?.deleted).toBe(true);
  });

  test('local deleted and remote updated, tie - prefer delete', () => {
    const ts = '2025-01-15T12:00:00Z';
    const local: StoredEntryRecord = {
      clientUpdatedAt: ts,
      dirty: true,
      deleted: true,
      entry: { date },
    };
    const remote: RemoteRow = {
      entry_date: date,
      entry_payload: { date, bleeding: 'light' },
      client_updated_at: ts,
      deleted_at: null,
    };
    const result = mergeOne(date, local, remote);
    expect(result?.deleted).toBe(true);
  });
});
