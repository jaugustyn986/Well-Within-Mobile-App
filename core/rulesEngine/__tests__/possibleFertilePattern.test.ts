import {
  buildFirstReleasePossibleFertilePatternEligibility,
  buildPossibleFertilePatternHistoryPresentation,
  buildPossibleFertilePatternPresentation,
  POSSIBLE_FERTILE_PATTERN_LIMITATION,
} from '../src/possibleFertilePattern';
import { evaluateInterpretationSupport } from '../src/interpretationSupport';
import { splitIntoCycles, type CycleSlice } from '../src/multiCycle';
import { recalculateCycle } from '../src/recalc';
import type { DailyEntry } from '../src/types';

const ELIGIBLE = {
  contextEligibility: 'eligible' as const,
  cycleBoundaryEligibility: 'eligible' as const,
};

function simpleCompleteEntries(start = '2026-01-01'): DailyEntry[] {
  const day = (offset: number) => {
    const date = new Date(`${start}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  };
  return [
    { date: day(0), bleeding: 'heavy', mucusRankOverride: 0 },
    { date: day(1), bleeding: 'none', mucusRankOverride: 1 },
    { date: day(2), bleeding: 'none', mucusRankOverride: 3 },
    { date: day(3), bleeding: 'none', mucusRankOverride: 0 },
    { date: day(4), bleeding: 'none', mucusRankOverride: 0 },
    { date: day(5), bleeding: 'none', mucusRankOverride: 0 },
  ];
}

function completedCycle(
  cycleNumber: number,
  startDate: string,
  dryDaysBeforeMucus: number,
): CycleSlice {
  const day = (offset: number) => {
    const date = new Date(`${startDate}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  };
  const entries: DailyEntry[] = [
    { date: day(0), bleeding: 'heavy', mucusRankOverride: 0 },
    ...Array.from({ length: dryDaysBeforeMucus }, (_, index) => ({
      date: day(index + 1),
      bleeding: 'none' as const,
      mucusRankOverride: 0,
    })),
    {
      date: day(dryDaysBeforeMucus + 1),
      bleeding: 'none',
      mucusRankOverride: 1,
    },
    {
      date: day(dryDaysBeforeMucus + 2),
      bleeding: 'none',
      mucusRankOverride: 3,
    },
    ...Array.from({ length: 3 }, (_, index) => ({
      date: day(dryDaysBeforeMucus + 3 + index),
      bleeding: 'none' as const,
      mucusRankOverride: 0,
    })),
  ];
  const result = recalculateCycle(entries);
  return {
    cycleNumber,
    startDate,
    endDate: entries[entries.length - 1].date!,
    entries,
    result,
    length: entries.length,
    peakDay: result.peakIndex === null ? null : result.peakIndex + 1,
    lutealPhase: 3,
    status: 'complete',
    cycleBoundary: {
      index: 0,
      date: startDate,
      source: 'inferred_heavy_moderate',
      eligibility: 'eligible',
      reason: 'unambiguous_heavy_moderate_start',
    },
  };
}

describe('Phase 1C Possible fertile pattern presentation', () => {
  it('maps the first-release standard-context assumption from boundary evidence', () => {
    expect(
      buildFirstReleasePossibleFertilePatternEligibility({ eligibility: 'eligible' }),
    ).toEqual({
      contextEligibility: 'eligible',
      cycleBoundaryEligibility: 'eligible',
    });
    expect(buildFirstReleasePossibleFertilePatternEligibility(undefined)).toEqual({
      contextEligibility: 'eligible',
      cycleBoundaryEligibility: 'unknown',
    });
    expect(POSSIBLE_FERTILE_PATTERN_LIMITATION).toMatch(/postpartum|breastfeeding/);
    expect(POSSIBLE_FERTILE_PATTERN_LIMITATION).toMatch(/perimenopause/);
    expect(POSSIBLE_FERTILE_PATTERN_LIMITATION).toMatch(/medication/);
    expect(POSSIBLE_FERTILE_PATTERN_LIMITATION).toMatch(/persistent discharge/);
  });

  it('PFP-01 emits one bounded, evidence-separated model only with explicit eligibility', () => {
    const entries = simpleCompleteEntries();
    const result = recalculateCycle(entries);

    const defaultUnknown = buildPossibleFertilePatternPresentation(entries, result);
    expect(defaultUnknown.state).toBe('withheld');
    expect(defaultUnknown.start).toBeNull();
    expect(defaultUnknown.reason).toBe('context_eligibility_unknown');

    const presentation = buildPossibleFertilePatternPresentation(
      entries,
      result,
      ELIGIBLE,
    );
    expect(presentation).toMatchObject({
      state: 'bounded',
      heading: 'Possible fertile pattern',
      reason: 'eligible_retrospective_pattern',
      limitation: POSSIBLE_FERTILE_PATTERN_LIMITATION,
      start: { entryIndex: 1, date: '2026-01-02', cycleDay: 2 },
      peak: { entryIndex: 2, date: '2026-01-03', cycleDay: 3 },
      pPlus1: { entryIndex: 3, date: '2026-01-04', cycleDay: 4 },
      pPlus2: { entryIndex: 4, date: '2026-01-05', cycleDay: 5 },
      pPlus3: { entryIndex: 5, date: '2026-01-06', cycleDay: 6 },
    });
    expect(presentation.observedMucusSigns.map((marker) => marker.entryIndex)).toEqual([1, 2]);
    expect(presentation.observedPeakTypeSigns.map((marker) => marker.entryIndex)).toEqual([2]);
  });

  it('PFP-02 keeps a developing pattern unbounded', () => {
    const entries: DailyEntry[] = [
      { date: '2026-02-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-02-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-02-03', bleeding: 'none', mucusRankOverride: 3 },
    ];
    const presentation = buildPossibleFertilePatternPresentation(
      entries,
      recalculateCycle(entries),
      ELIGIBLE,
    );
    expect(presentation.state).toBe('developing');
    expect(presentation.heading).toBe('Possible fertile pattern may be developing');
    expect(presentation.start).toBeNull();
    expect(presentation.peak).toBeNull();
    expect(presentation.pPlus3).toBeNull();
    expect(presentation.limitation).toBeNull();
  });

  it('anchors exact marker Cycle Days to an inferred H/M boundary after a dry preamble', () => {
    const entries: DailyEntry[] = [
      { date: '2026-02-20', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-21', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-02-22', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-02-23', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-02-24', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-25', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-26', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const [cycle] = splitIntoCycles(entries);
    const presentation = buildPossibleFertilePatternPresentation(
      cycle.entries,
      cycle.result,
      buildFirstReleasePossibleFertilePatternEligibility(cycle.cycleBoundary),
    );
    expect(cycle.startDate).toBe('2026-02-21');
    expect(cycle.peakDay).toBe(3);
    expect(presentation).toMatchObject({
      state: 'bounded',
      start: { date: '2026-02-22', cycleDay: 2 },
      peak: { date: '2026-02-23', cycleDay: 3 },
      pPlus1: { date: '2026-02-24', cycleDay: 4 },
      pPlus2: { date: '2026-02-25', cycleDay: 5 },
      pPlus3: { date: '2026-02-26', cycleDay: 6 },
    });
  });

  it('PFP-03 keeps a completed pattern bounded after later non-Peak mucus', () => {
    const entries = [
      ...simpleCompleteEntries('2026-03-01'),
      { date: '2026-03-07', bleeding: 'none' as const, mucusRankOverride: 1 },
    ];
    const result = recalculateCycle(entries);
    expect(evaluateInterpretationSupport(entries, result)).toMatchObject({
      status: 'summary_available',
      reason: 'retrospective_summary_available',
    });
    const presentation = buildPossibleFertilePatternPresentation(entries, result, ELIGIBLE);
    expect(presentation.state).toBe('bounded');
    expect(presentation.reason).toBe('eligible_retrospective_pattern');
    expect(presentation.start?.date).toBe('2026-03-02');
    expect(presentation.pPlus3?.date).toBe('2026-03-06');

    const edited = entries.map((entry) =>
      entry.date === '2026-03-07' ? { ...entry, mucusRankOverride: 0 } : entry,
    );
    expect(
      buildPossibleFertilePatternPresentation(edited, recalculateCycle(edited), ELIGIBLE).state,
    ).toBe('bounded');
  });

  it('PFP-03 reopens a completed pattern for a later Peak-type sign', () => {
    const entries = [
      ...simpleCompleteEntries('2026-03-11'),
      { date: '2026-03-17', bleeding: 'none' as const, mucusRankOverride: 3 },
    ];
    const result = recalculateCycle(entries);
    const presentation = buildPossibleFertilePatternPresentation(entries, result, ELIGIBLE);

    expect(evaluateInterpretationSupport(entries, result)).toMatchObject({
      status: 'forming',
      reason: 'later_peak_type_reopens_pattern',
    });
    expect(presentation).toMatchObject({
      state: 'developing',
      reason: 'later_peak_type_reopens_pattern',
      interpretationReason: 'later_peak_type_reopens_pattern',
      start: null,
      pPlus3: null,
    });
    expect(presentation.body).toContain('later Peak-type sign');
  });

  it('PFP-03 moves the bounded presentation to the latest confirmed sequence', () => {
    const entries: DailyEntry[] = [
      ...simpleCompleteEntries('2026-04-01'),
      { date: '2026-04-07', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-04-08', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-04-09', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-04-10', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const presentation = buildPossibleFertilePatternPresentation(
      entries,
      recalculateCycle(entries),
      ELIGIBLE,
    );
    expect(presentation).toMatchObject({
      state: 'bounded',
      reason: 'eligible_retrospective_pattern',
      interpretationStatus: 'summary_available',
      start: { date: '2026-04-02', cycleDay: 2 },
      peak: { date: '2026-04-07', cycleDay: 7 },
      pPlus1: { date: '2026-04-08', cycleDay: 8 },
      pPlus2: { date: '2026-04-09', cycleDay: 9 },
      pPlus3: { date: '2026-04-10', cycleDay: 10 },
    });
    expect(presentation.observedPeakTypeSigns.map((marker) => marker.cycleDay)).toEqual([3, 7]);
  });

  it('PFP-04 names an earlier calendar gap and withholds exact boundaries', () => {
    const entries: DailyEntry[] = [
      { date: '2026-05-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-05-03', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-05-04', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-05-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-05-06', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-05-07', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const presentation = buildPossibleFertilePatternPresentation(
      entries,
      recalculateCycle(entries),
      ELIGIBLE,
    );
    expect(presentation.state).toBe('withheld');
    expect(presentation.reason).toBe('earlier_gap_limits_boundary');
    expect(presentation.limit).toMatchObject({
      date: '2026-05-02',
      cycleDay: 2,
    });
    expect(presentation.start).toBeNull();
  });

  it('PFP-04 names a not-observed date within the Peak count', () => {
    const entries: DailyEntry[] = [
      { date: '2026-06-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-06-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-06-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-06-04', bleeding: 'none', missing: true },
      { date: '2026-06-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-06-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const presentation = buildPossibleFertilePatternPresentation(
      entries,
      recalculateCycle(entries),
      ELIGIBLE,
    );
    expect(presentation.state).toBe('withheld');
    expect(presentation.reason).toBe('not_observed');
    expect(presentation.limit?.date).toBe('2026-06-04');
  });

  it('PFP-05 routes light/spotting plus mucus to review instead of a silent band', () => {
    const entries = simpleCompleteEntries('2026-07-01');
    entries[1] = { ...entries[1], bleeding: 'light', mucusRankOverride: 1 };
    const result = recalculateCycle(entries);
    expect(evaluateInterpretationSupport(entries, result)).toMatchObject({
      status: 'review_recommended',
      reason: 'bleeding_mucus_ambiguity',
    });
    const presentation = buildPossibleFertilePatternPresentation(entries, result, ELIGIBLE);
    expect(presentation.state).toBe('withheld');
    expect(presentation.reason).toBe('bleeding_mucus_ambiguity');
    expect(presentation.heading).toBe('Mucus and light bleeding were recorded together');
    expect(presentation.limit?.date).toBe('2026-07-02');
  });

  it('PFP-05 lets an explicit unsupported context withhold even a developing pattern', () => {
    const entries: DailyEntry[] = [
      { date: '2026-08-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-08-02', bleeding: 'none', mucusRankOverride: 1 },
    ];
    const presentation = buildPossibleFertilePatternPresentation(
      entries,
      recalculateCycle(entries),
      { ...ELIGIBLE, contextEligibility: 'ineligible' },
    );
    expect(presentation.state).toBe('withheld');
    expect(presentation.reason).toBe('context_ineligible');
  });

  it('PFP-05 leaves continuous and non-Peak-only observations unbounded', () => {
    const entries: DailyEntry[] = [
      { date: '2026-09-01', bleeding: 'heavy', mucusRankOverride: 0 },
      ...Array.from({ length: 8 }, (_, index) => ({
        date: `2026-09-${String(index + 2).padStart(2, '0')}`,
        bleeding: 'none' as const,
        mucusRankOverride: 1,
      })),
    ];
    const presentation = buildPossibleFertilePatternPresentation(
      entries,
      recalculateCycle(entries),
      ELIGIBLE,
    );
    expect(presentation.state).toBe('developing');
    expect(presentation.start).toBeNull();
    expect(presentation.peak).toBeNull();
    expect(presentation.pPlus3).toBeNull();
  });
});

describe('Phase 1C retrospective possible-pattern history', () => {
  const cycles = [
    completedCycle(1, '2026-01-01', 0),
    completedCycle(2, '2026-02-01', 1),
    completedCycle(3, '2026-03-01', 2),
  ];
  const eligibilityByCycleNumber = {
    1: ELIGIBLE,
    2: ELIGIBLE,
    3: ELIGIBLE,
  };

  it('PFP-06 emits raw Cycle Day ranges with N after three eligible cycles', () => {
    const history = buildPossibleFertilePatternHistoryPresentation(cycles, {
      eligibilityByCycleNumber,
    });
    expect(history).toMatchObject({
      state: 'available',
      completedCycleCount: 3,
      completedCycleNumbers: [1, 2, 3],
      sampleSize: 3,
      eligibleCycleNumbers: [1, 2, 3],
      startCycleDays: { minimum: 2, maximum: 4 },
      peakCycleDays: { minimum: 3, maximum: 5 },
    });
    expect(history.body).toContain('Across 3 eligible completed cycles');
    expect(history.body).toContain('Cycle Days 2–4');
    expect(history.body).toContain('Cycle Days 3–5');
    expect(history.body).not.toMatch(/usual|typically|expected|likely|average/i);
  });

  it('PFP-06 withholds ranges below three explicitly eligible cycles', () => {
    const history = buildPossibleFertilePatternHistoryPresentation(cycles.slice(0, 2), {
      eligibilityByCycleNumber,
    });
    expect(history.state).toBe('insufficient_eligible_cycles');
    expect(history.completedCycleCount).toBe(2);
    expect(history.sampleSize).toBe(2);
    expect(history.body).toContain('At least 3 eligible completed cycles');
  });

  it('defaults unknown cycle eligibility out of history aggregates', () => {
    const history = buildPossibleFertilePatternHistoryPresentation(cycles);
    expect(history.state).toBe('insufficient_eligible_cycles');
    expect(history.completedCycleCount).toBe(3);
    expect(history.sampleSize).toBe(0);
  });

  it('keeps a completed cycle distinct from an unavailable pattern range', () => {
    const base = completedCycle(1, '2026-04-01', 0);
    const entries: DailyEntry[] = [
      ...base.entries,
      { date: '2026-04-07', bleeding: 'none', mucusRankOverride: 3 },
    ];
    const cycle: CycleSlice = {
      ...base,
      endDate: '2026-04-07',
      entries,
      result: recalculateCycle(entries),
      length: entries.length,
    };

    const history = buildPossibleFertilePatternHistoryPresentation([cycle], {
      eligibilityByCycleNumber: { 1: ELIGIBLE },
    });

    expect(history.completedCycleCount).toBe(1);
    expect(history.completedCycleNumbers).toEqual([1]);
    expect(history.sampleSize).toBe(0);
    expect(history.eligibleCycleNumbers).toEqual([]);
  });

  it('keeps a completed cycle with later non-Peak mucus eligible for history', () => {
    const base = completedCycle(1, '2026-05-01', 0);
    const entries: DailyEntry[] = [
      ...base.entries,
      { date: '2026-05-07', bleeding: 'none', mucusRankOverride: 2 },
    ];
    const cycle: CycleSlice = {
      ...base,
      endDate: '2026-05-07',
      entries,
      result: recalculateCycle(entries),
      length: entries.length,
    };

    const history = buildPossibleFertilePatternHistoryPresentation([cycle], {
      eligibilityByCycleNumber: { 1: ELIGIBLE },
    });

    expect(history.sampleSize).toBe(1);
    expect(history.eligibleCycleNumbers).toEqual([1]);
  });
});
