import {
  buildCycleComparisonNarrative,
  buildCycleComparisonStructured,
  getPriorCompleted,
} from '../src/cycleComparisonSummary';
import { CycleSlice } from '../src/multiCycle';
import { CycleResult } from '../src/types';

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

describe('getPriorCompleted', () => {
  it('returns only completed cycles before current', () => {
    const all = [
      makeSlice({ cycleNumber: 1, status: 'complete', length: 28 }),
      makeSlice({ cycleNumber: 2, status: 'complete', length: 30 }),
      makeSlice({ cycleNumber: 3, status: 'in_progress', length: 5, lutealPhase: null }),
    ];
    const priors = getPriorCompleted(all[2], all);
    expect(priors.map((c) => c.cycleNumber)).toEqual([1, 2]);
  });
});

describe('buildCycleComparisonNarrative', () => {
  it('asks for two completed cycles when fewer exist', () => {
    const current = makeSlice({ cycleNumber: 1, status: 'in_progress', length: 5, lutealPhase: null });
    const text = buildCycleComparisonNarrative(current, [current]);
    expect(text).toContain('at least two cycles');
  });

  it('handles no earlier completed priors', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28 });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 28 });
    const text = buildCycleComparisonNarrative(c1, [c1, c2]);
    expect(text).toContain('Not enough earlier');
  });

  it('compares when priors exist', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28, peakDay: 14 });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 28, peakDay: 14 });
    const c3 = makeSlice({ cycleNumber: 3, status: 'complete', length: 32, peakDay: 16 });
    const text = buildCycleComparisonNarrative(c3, [c1, c2, c3]);
    expect(text.length).toBeGreaterThan(10);
    expect(text).not.toContain('at least two cycles');
  });
});

describe('buildCycleComparisonStructured', () => {
  it('marks length not_comparable for in-progress current', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28 });
    const cur = makeSlice({
      cycleNumber: 2,
      status: 'in_progress',
      length: 5,
      lutealPhase: null,
      peakDay: null,
    });
    const s = buildCycleComparisonStructured(cur, [c1, cur]);
    expect(s.lengthVsPrior).toBe('not_comparable');
  });

  it('computes avgPeakDay from prior completed cycles', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28, peakDay: 14 });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 30, peakDay: 16 });
    const cur = makeSlice({ cycleNumber: 3, status: 'in_progress', length: 8, peakDay: null, lutealPhase: null });
    const s = buildCycleComparisonStructured(cur, [c1, c2, cur]);
    expect(s.avgPeakDay).toBe(15);
  });

  it('returns null avgPeakDay when no prior peaks', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28, peakDay: null, lutealPhase: null });
    const cur = makeSlice({ cycleNumber: 2, status: 'in_progress', length: 5, peakDay: null, lutealPhase: null });
    const s = buildCycleComparisonStructured(cur, [c1, cur]);
    expect(s.avgPeakDay).toBeNull();
  });

  it('computes avgFertileStartDay from prior results', () => {
    const resultWithFertile = { ...emptyResult, fertileStartIndex: 7 } as CycleResult;
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28, result: resultWithFertile });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 30, result: { ...emptyResult, fertileStartIndex: 9 } as CycleResult });
    const cur = makeSlice({ cycleNumber: 3, status: 'in_progress', length: 5, peakDay: null, lutealPhase: null });
    const s = buildCycleComparisonStructured(cur, [c1, c2, cur]);
    expect(s.avgFertileStartDay).toBe(9);
  });

  it('returns null avgFertileStartDay when no prior fertile data', () => {
    const resultNoFertile = { ...emptyResult, fertileStartIndex: null } as CycleResult;
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28, result: resultNoFertile });
    const cur = makeSlice({ cycleNumber: 2, status: 'in_progress', length: 5, peakDay: null, lutealPhase: null });
    const s = buildCycleComparisonStructured(cur, [c1, cur]);
    expect(s.avgFertileStartDay).toBeNull();
  });

  it('marks pattern variation as low when prior lengths are close', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28 });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 29 });
    const cur = makeSlice({ cycleNumber: 3, status: 'in_progress', length: 5, peakDay: null, lutealPhase: null });
    const s = buildCycleComparisonStructured(cur, [c1, c2, cur]);
    expect(s.patternVariation).toBe('low');
  });

  it('marks pattern variation as moderate when spread is mid-range', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28 });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 35 });
    const cur = makeSlice({ cycleNumber: 3, status: 'in_progress', length: 5, peakDay: null, lutealPhase: null });
    const s = buildCycleComparisonStructured(cur, [c1, c2, cur]);
    expect(s.patternVariation).toBe('moderate');
  });

  it('marks pattern variation as high when spread exceeds a week', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28 });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 40 });
    const cur = makeSlice({ cycleNumber: 3, status: 'in_progress', length: 5, peakDay: null, lutealPhase: null });
    const s = buildCycleComparisonStructured(cur, [c1, c2, cur]);
    expect(s.patternVariation).toBe('high');
  });

  it('compares luteal phase when current and priors have luteal data', () => {
    const c1 = makeSlice({
      cycleNumber: 1,
      status: 'complete',
      length: 28,
      peakDay: 14,
      lutealPhase: 14,
    });
    const c2 = makeSlice({
      cycleNumber: 2,
      status: 'complete',
      length: 28,
      peakDay: 14,
      lutealPhase: 14,
    });
    const cur = makeSlice({
      cycleNumber: 3,
      status: 'complete',
      length: 28,
      peakDay: null,
      lutealPhase: 18,
    });
    const s = buildCycleComparisonStructured(cur, [c1, c2, cur]);
    expect(s.lutealVsPrior).toBe('longer');
  });
});

describe('buildCycleComparisonNarrative – detailed wording', () => {
  it('notes longer and shorter cycle vs recent average', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28 });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 28 });
    const longer = makeSlice({ cycleNumber: 3, status: 'complete', length: 40, peakDay: 14 });
    expect(buildCycleComparisonNarrative(longer, [c1, c2, longer])).toContain('longer');
    const shorter = makeSlice({ cycleNumber: 3, status: 'complete', length: 20, peakDay: 14 });
    expect(buildCycleComparisonNarrative(shorter, [c1, c2, shorter])).toContain('shorter');
  });

  it('notes peak timing vs prior average (later, earlier, similar)', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28, peakDay: 14 });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 28, peakDay: 14 });
    const laterPeak = makeSlice({ cycleNumber: 3, status: 'complete', length: 32, peakDay: 18 });
    expect(buildCycleComparisonNarrative(laterPeak, [c1, c2, laterPeak])).toContain('later');
    const earlierPeak = makeSlice({ cycleNumber: 3, status: 'complete', length: 26, peakDay: 12 });
    expect(buildCycleComparisonNarrative(earlierPeak, [c1, c2, earlierPeak])).toContain('earlier');
    const similarPeak = makeSlice({ cycleNumber: 3, status: 'complete', length: 28, peakDay: 14 });
    const t = buildCycleComparisonNarrative(similarPeak, [c1, c2, similarPeak]);
    expect(t).toContain('in line with your usual pattern');
    expect(t).toContain('14');
  });

  it('appends cycle-length variation copy when the cycle is still in progress', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28 });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 28 });
    const cur = makeSlice({
      cycleNumber: 3,
      status: 'in_progress',
      length: 5,
      peakDay: null,
      lutealPhase: null,
    });
    const text = buildCycleComparisonNarrative(cur, [c1, c2, cur]);
    expect(text).toContain('still in progress');
    expect(text).toContain('steady');
  });

  it('uses moderate variation wording when prior lengths vary moderately', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28 });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 35 });
    const cur = makeSlice({
      cycleNumber: 3,
      status: 'in_progress',
      length: 8,
      peakDay: null,
      lutealPhase: null,
    });
    const text = buildCycleComparisonNarrative(cur, [c1, c2, cur]);
    expect(text).toContain('natural variation');
  });

  it('mentions luteal phase when peak is not compared but luteal differs', () => {
    const c1 = makeSlice({
      cycleNumber: 1,
      status: 'complete',
      length: 28,
      peakDay: null,
      lutealPhase: 14,
    });
    const c2 = makeSlice({
      cycleNumber: 2,
      status: 'complete',
      length: 28,
      peakDay: null,
      lutealPhase: 14,
    });
    const shorterLuteal = makeSlice({
      cycleNumber: 3,
      status: 'complete',
      length: 28,
      peakDay: null,
      lutealPhase: 10,
    });
    expect(buildCycleComparisonNarrative(shorterLuteal, [c1, c2, shorterLuteal])).toContain(
      'shorter',
    );
    const longerLuteal = makeSlice({
      cycleNumber: 3,
      status: 'complete',
      length: 28,
      peakDay: null,
      lutealPhase: 18,
    });
    expect(buildCycleComparisonNarrative(longerLuteal, [c1, c2, longerLuteal])).toContain(
      'longer',
    );
  });

  it('describes high length variation when combined with in-progress copy', () => {
    const c1 = makeSlice({ cycleNumber: 1, status: 'complete', length: 28 });
    const c2 = makeSlice({ cycleNumber: 2, status: 'complete', length: 40 });
    const cur = makeSlice({
      cycleNumber: 3,
      status: 'in_progress',
      length: 8,
      peakDay: null,
      lutealPhase: null,
    });
    const text = buildCycleComparisonNarrative(cur, [c1, c2, cur]);
    expect(text).toContain('still in progress');
    expect(text).toContain('varied more');
  });
});
