import { detectFertileStart, detectFertileStartDetailed } from '../src/fertileWindow';
import { DailyEntry } from '../src/types';

describe('detectFertileStartDetailed', () => {
  it('marks uncertain when a calendar day is missing between cycle start and first mucus', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy' },
      { date: '2026-01-03', bleeding: 'none' },
    ];
    const ranks = [0, 1];
    const r = detectFertileStartDetailed(entries, ranks, 0);
    expect(r.fertileStartIndex).toBe(1);
    expect(r.fertileStartReason).toBe('uncertain_due_to_missing');
  });

  it('marks uncertain when a logged day before first mucus is missing', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy' },
      { date: '2026-01-02', bleeding: 'none', missing: true },
      { date: '2026-01-03', bleeding: 'none' },
    ];
    const ranks = [0, 0, 1];
    const r = detectFertileStartDetailed(entries, ranks, 0);
    expect(r.fertileStartIndex).toBe(2);
    expect(r.fertileStartReason).toBe('uncertain_due_to_missing');
  });
});

describe('detectFertileStart', () => {
  it('returns first day with rank >= 1', () => {
    expect(detectFertileStart([0, 0, 1, 2])).toBe(2);
  });

  it('returns null for all dry/missing', () => {
    expect(detectFertileStart([0, 0, null, 0])).toBeNull();
  });

  it('respects start index', () => {
    expect(detectFertileStart([1, 0, 0, 2], 2)).toBe(3);
  });
});
