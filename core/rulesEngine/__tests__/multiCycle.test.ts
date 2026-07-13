import {
  computeCycleSummary,
  buildCalendarAlignedCycleDays,
  CycleSlice,
  generateInsights,
  splitIntoCycles,
} from '../src/multiCycle';
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
    expect(cycles[0].length).toBe(31);
    expect(cycles[0].endDate).toBe('2026-01-31');
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
    expect(cycles[0].length).toBe(9);
    expect(cycles[0].endDate).toBe('2026-01-09');
    expect(cycles[1].length).toBe(1);
  });

  it('uses elapsed calendar days for length, Peak day, luteal phase, and completed end date', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-07', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-08', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-01', bleeding: 'heavy', mucusRankOverride: 0 },
    ];
    const [completed] = splitIntoCycles(entries);
    expect(completed.length).toBe(31);
    expect(completed.endDate).toBe('2026-01-31');
    expect(completed.peakDay).toBe(5);
    expect(completed.lutealPhase).toBe(26);
    const aligned = buildCalendarAlignedCycleDays(completed);
    expect(aligned).toHaveLength(31);
    expect(aligned[1]).toMatchObject({
      date: '2026-01-02',
      cycleDay: 2,
      entryIndex: null,
      phaseLabel: 'missing',
    });
    expect(aligned[4]).toMatchObject({
      date: '2026-01-05',
      cycleDay: 5,
      entryIndex: 2,
      phaseLabel: 'peak_confirmed',
    });
  });

  it('uses the first through last logged dates for an in-progress span', () => {
    const [cycle] = splitIntoCycles([
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
    ]);
    expect(cycle.length).toBe(5);
    expect(cycle.endDate).toBe('2026-01-05');
  });
});

describe('computeCycleSummary', () => {
  it('excludes a review-recommended cycle from derived history aggregates', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-07', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-08', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-09', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-01', bleeding: 'heavy', mucusRankOverride: 0 },
    ];
    const [reviewCycle] = splitIntoCycles(entries);
    expect(reviewCycle.status).toBe('complete');
    expect(computeCycleSummary([reviewCycle]).cyclesTracked).toBe(0);
  });

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

describe('generateInsights', () => {
  it('never invents a fertile-opening day from Peak minus five', () => {
    const cycles: CycleSlice[] = [
      makeSlice({ cycleNumber: 1, status: 'complete', length: 28, peakDay: 14 }),
      makeSlice({ cycleNumber: 2, status: 'complete', length: 30, peakDay: 16 }),
    ];
    const insights = generateInsights(cycles);
    expect(insights).toContain('Peak day has ranged from cycle day 14 to 16.');
    expect(insights.join(' ')).not.toContain('Fertile window typically opens');
  });
});
