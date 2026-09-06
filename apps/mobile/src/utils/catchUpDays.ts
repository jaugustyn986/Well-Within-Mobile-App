import { addDaysIso, compareIsoDate, splitIntoCycles } from 'core-rules-engine';
import type { DailyEntry } from 'core-rules-engine';
import type { StoredEntries } from '../services/storageV2';

export function buildCurrentCycleCatchUpDates(
  sortedEntries: DailyEntry[],
  entriesByDate: StoredEntries,
  asOfDate: string,
): string[] {
  if (sortedEntries.length === 0) return [];

  const cycles = splitIntoCycles(sortedEntries);
  const currentCycle = cycles[cycles.length - 1];
  if (!currentCycle?.startDate) return [];
  if (compareIsoDate(currentCycle.startDate, asOfDate) > 0) return [];

  const endDate =
    currentCycle.status === 'complete' && compareIsoDate(currentCycle.endDate, asOfDate) < 0
      ? currentCycle.endDate
      : asOfDate;

  const dates: string[] = [];
  for (let date = currentCycle.startDate; compareIsoDate(date, endDate) <= 0; date = addDaysIso(date, 1)) {
    const entry = entriesByDate[date];
    // An explicit `missing: true` row means the user already handled the date by
    // recording that it was not observed. Keep it as an interpretation limitation,
    // but do not trap the catch-up workflow in a permanent loop.
    if (!entry) {
      dates.push(date);
    }
  }

  return dates;
}

export function formatCatchUpCount(count: number): string {
  return count === 1 ? '1 day' : `${count} days`;
}
