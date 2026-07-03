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
    if (!entry || entry.missing === true) {
      dates.push(date);
    }
  }

  return dates;
}

export function formatCatchUpCount(count: number): string {
  return count === 1 ? '1 day' : `${count} days`;
}
