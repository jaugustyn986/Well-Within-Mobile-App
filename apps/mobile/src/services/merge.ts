import type { DailyEntry } from '../../../../core/rulesEngine/src/types';
import type { StoredEntryRecord } from './storageV2';

export interface RemoteRow {
  entry_date: string;
  entry_payload: unknown;
  client_updated_at: string;
  deleted_at: string | null;
}

/**
 * Pure merge for one date: local record vs remote row → merged local record.
 * Date-level last-writer-wins by client_updated_at; tie → prefer remote (clean).
 * Delete (tombstone) wins when timestamps equal (no resurrection).
 */
export function mergeOne(
  date: string,
  local: StoredEntryRecord | undefined,
  remote: RemoteRow | undefined
): StoredEntryRecord | null {
  const localDeleted = local?.deleted === true;
  const remoteDeleted = Boolean(remote?.deleted_at);
  const localTs = local?.clientUpdatedAt ?? '';
  const remoteTs = remote?.client_updated_at ?? '';

  if (!remote) {
    return local ?? null;
  }
  if (!local) {
    if (remoteDeleted) {
      return { clientUpdatedAt: remoteTs, dirty: false, deleted: true, entry: { date } };
    }
    return {
      clientUpdatedAt: remoteTs,
      dirty: false,
      deleted: false,
      entry: { ...(remote.entry_payload as DailyEntry), date },
    };
  }

  const cmp = localTs.localeCompare(remoteTs);
  if (cmp > 0) {
    return local;
  }
  if (cmp < 0) {
    if (remoteDeleted) {
      return { clientUpdatedAt: remoteTs, dirty: false, deleted: true, entry: { date } };
    }
    return {
      clientUpdatedAt: remoteTs,
      dirty: false,
      deleted: false,
      entry: { ...(remote.entry_payload as DailyEntry), date },
    };
  }
  if (localDeleted || remoteDeleted) {
    return { clientUpdatedAt: remoteTs, dirty: false, deleted: true, entry: { date } };
  }
  return {
    clientUpdatedAt: remoteTs,
    dirty: false,
    deleted: false,
    entry: { ...(remote.entry_payload as DailyEntry), date },
  };
}
