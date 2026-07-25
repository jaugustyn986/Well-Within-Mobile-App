import {
  isValidObservationTime,
  type DailyEntry,
  type Sensation,
} from 'core-rules-engine';

export function initialSensationForEntry(initialEntry?: DailyEntry | null): Sensation | null {
  if (!initialEntry) return null;
  return initialEntry.sensation ?? null;
}

export function canSaveObservationEntry(
  missing: boolean,
  sensation: Sensation | null,
): boolean {
  return missing || sensation !== null;
}

export function shouldShowObservationTimeEditor(
  observationCount: number,
  observedAt: string | undefined,
): boolean {
  return observationCount > 1
    || (observedAt !== undefined && !isValidObservationTime(observedAt));
}
