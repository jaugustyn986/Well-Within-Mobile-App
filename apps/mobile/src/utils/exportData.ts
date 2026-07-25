import {
  resolveDailyMucus,
  type DailyEntry,
} from 'core-rules-engine';

export interface WellWithinDataExportV2 {
  format: 'well-within-data';
  schemaVersion: 2;
  exportedAt: string;
  entriesByDate: Record<string, DailyEntry>;
}

function canonicalEntry(entry: DailyEntry, date: string): DailyEntry {
  const dayLevelEntry: DailyEntry = { ...entry };
  delete dayLevelEntry.sensation;
  delete dayLevelEntry.appearances;
  delete dayLevelEntry.frequency;
  if (entry.missing) return { ...dayLevelEntry, date };
  const observations = resolveDailyMucus({ ...entry, date }).observations;
  return {
    ...dayLevelEntry,
    date,
    observations,
  };
}

export function buildDataExport(
  entries: Record<string, DailyEntry>,
  exportedAt = new Date().toISOString(),
): WellWithinDataExportV2 {
  const entriesByDate = Object.fromEntries(
    Object.keys(entries)
      .sort()
      .map((date) => [date, canonicalEntry(entries[date], date)]),
  );
  return {
    format: 'well-within-data',
    schemaVersion: 2,
    exportedAt,
    entriesByDate,
  };
}
