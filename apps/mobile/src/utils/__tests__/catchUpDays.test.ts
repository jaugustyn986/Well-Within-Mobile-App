import { buildCurrentCycleCatchUpDates, formatCatchUpCount } from '../catchUpDays';
import type { DailyEntry } from 'core-rules-engine';
import type { StoredEntries } from '../../services/storageV2';

function sorted(entries: DailyEntry[]): DailyEntry[] {
  return [...entries].sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
}

function map(entries: DailyEntry[]): StoredEntries {
  return entries.reduce<StoredEntries>((acc, entry) => {
    if (entry.date) acc[entry.date] = entry;
    return acc;
  }, {});
}

describe('buildCurrentCycleCatchUpDates', () => {
  test('returns no catch-up dates before charting starts', () => {
    expect(buildCurrentCycleCatchUpDates([], {}, '2026-07-03')).toEqual([]);
  });

  test('includes interior gaps and trailing days through today', () => {
    const entries = sorted([
      { date: '2026-07-01', bleeding: 'moderate', sensation: 'dry' },
      { date: '2026-07-03', bleeding: 'none', sensation: 'wet' },
    ]);

    expect(buildCurrentCycleCatchUpDates(entries, map(entries), '2026-07-05')).toEqual([
      '2026-07-02',
      '2026-07-04',
      '2026-07-05',
    ]);
  });

  test('treats explicit not-observed rows as handled instead of reopening them forever', () => {
    const entries = sorted([
      { date: '2026-07-01', bleeding: 'moderate', sensation: 'dry' },
      { date: '2026-07-02', missing: true },
      { date: '2026-07-03', bleeding: 'none', sensation: 'stretchy' },
    ]);

    expect(buildCurrentCycleCatchUpDates(entries, map(entries), '2026-07-03')).toEqual([]);
  });

  test('matches engine cycle slices when leading days merge into the first flow cycle', () => {
    const entries = sorted([
      { date: '2026-06-28', bleeding: 'none', sensation: 'stretchy' },
      { date: '2026-07-01', bleeding: 'moderate', sensation: 'dry' },
      { date: '2026-07-03', bleeding: 'none', sensation: 'dry' },
    ]);

    expect(buildCurrentCycleCatchUpDates(entries, map(entries), '2026-07-04')).toEqual([
      '2026-06-29',
      '2026-06-30',
      '2026-07-02',
      '2026-07-04',
    ]);
  });
});

describe('formatCatchUpCount', () => {
  test('formats singular and plural day counts', () => {
    expect(formatCatchUpCount(1)).toBe('1 day');
    expect(formatCatchUpCount(3)).toBe('3 days');
  });
});
