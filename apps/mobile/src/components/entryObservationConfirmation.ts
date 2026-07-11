import type { DailyEntry, Sensation } from 'core-rules-engine';

export function initialSensationForEntry(initialEntry?: DailyEntry | null): Sensation | null {
  if (!initialEntry) return null;
  return initialEntry.sensation ?? 'dry';
}

export function canSaveObservationEntry(
  missing: boolean,
  sensation: Sensation | null,
): boolean {
  return missing || sensation !== null;
}
