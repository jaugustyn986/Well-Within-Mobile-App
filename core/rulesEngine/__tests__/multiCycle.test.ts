import { computeCycleSummary, CycleSlice, splitIntoCycles } from '../src/multiCycle';
import { CycleResult, DailyEntry } from '../src/types';

const emptyResult = {} as CycleResult;

function makeSlice(
  overrides: Partial<CycleSlice> &
    Pick<CycleSlice, 'cycleNumber' | 'status' | 'length'>,
): CycleSlice {
  return {
    startDate: '2025-01-01',
    endDate: '2025-01-28',
    entries: [],
    result: emptyResult,
    peakDay: 14,
    lutealPhase: 14,
    ...overrides,
  };
}

describe('splitIntoCycles', () => {
  it('merges leading non–heavy/moderate prefix into the first period cycle', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'light', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-01', bleeding: 'heavy', mucusRankOverride: 0 },
    ];
    const cycles = splitIntoCycles(entries);
    expect(cycles.length).toBe(2);
    expect(cycles[0].length).toBe(3);
    expect(cycles[0].startDate).toBe('2026-01-01');
    expect(cycles[1].startDate).toBe('2026-02-01');
  });

  it('does not merge when the first slice already includes heavy or moderate', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-10', bleeding: 'heavy', mucusRankOverride: 0 },
    ];
    const cycles = splitIntoCycles(entries);
    expect(cycles.length).toBe(2);
    expect(cycles[0].length).toBe(2);
    expect(cycles[1].length).toBe(1);
  });
});

describe('computeCycleSummary', () => {
  it('sets cyclesTracked to completed cycles only, not in-progress', () => {
    const cycles: CycleSlice[] = [
      makeSlice({ cycleNumber: 1, status: 'complete', length: 28 }),
      makeSlice({ cycleNumber: 2, status: 'in_progress', length: 5, lutealPhase: null }),
    ];
    const s = computeCycleSummary(cycles);
    expect(s.cyclesTracked).toBe(1);
    expect(s.avgLength).toBe(28);
  });

  it('returns zeros when no cycles', () => {
    const s = computeCycleSummary([]);
    expect(s.cyclesTracked).toBe(0);
    expect(s.avgLength).toBeNull();
  });
});
