import type {
  RecordedCycleHistorySummary,
} from 'core-rules-engine';
import {
  buildCycleHistoryOverviewCopy,
  buildDevelopingPatternCardCopy,
} from '../cycleHistoryPresentation';

describe('buildDevelopingPatternCardCopy', () => {
  it('tells a current-cycle user why there are no dates and what to do next', () => {
    const copy = buildDevelopingPatternCardCopy({
      reason: 'pattern_developing',
      isCurrentCycle: true,
      cycleStatus: 'in_progress',
    });

    expect(copy.heading).toBe('This cycle’s pattern is still taking shape');
    expect(copy.meaning).toContain('needs a few more daily observations');
    expect(copy.nextStep).toContain('Keep recording one observation each day');
  });

  it('states that a completed cycle remains complete when its pattern range is unavailable', () => {
    const copy = buildDevelopingPatternCardCopy({
      reason: 'pattern_developing',
      isCurrentCycle: false,
      cycleStatus: 'complete',
    });

    expect(copy.heading).toBe('Your observations are saved');
    expect(copy.meaning).toContain('does not have enough chart detail');
    expect(copy.nextStep).toContain('remains complete in History');
  });

  it('explains when a later Peak-type sign reopened an earlier count', () => {
    const copy = buildDevelopingPatternCardCopy({
      reason: 'later_peak_type_reopens_pattern',
      isCurrentCycle: false,
      cycleStatus: 'complete',
      observedPeakTypeCycleDays: [11, 19],
      observedMucusCycleDays: [1, 2, 6, 7, 8, 9, 10, 11, 13, 14, 18, 19],
    });

    expect(copy.eyebrow).toBe('Pattern note');
    expect(copy.heading).toBe('Two Peak-type signs were recorded');
    expect(copy.meaning).toContain('Cycle Days 11 and 19');
    expect(copy.meaning).toContain('daily observations, not separate Peak Days');
    expect(copy.meaning).toContain('keeps this pattern open');
    expect(copy.nextStep).toContain('cycle stays complete in History');
    expect(copy.learnMoreLabel).toBe('How Peak Day is identified');
  });

  it('uses Peak-type language in the compact reopened fallback', () => {
    const copy = buildDevelopingPatternCardCopy({
      reason: 'later_peak_type_reopens_pattern',
      isCurrentCycle: false,
      cycleStatus: 'complete',
      observedPeakTypeCycleDays: [11],
      observedMucusCycleDays: [8, 11, 18],
    });

    expect(copy.heading).toBe('A later Peak-type sign was recorded');
    expect(copy.meaning).toContain('another Peak-type sign');
    expect(copy.meaning).toContain('Cycle Day 18');
    expect(copy.nextStep).toContain('no change is needed');
  });
});

describe('buildCycleHistoryOverviewCopy', () => {
  const insufficient: RecordedCycleHistorySummary = {
    state: 'insufficient_comparable_cycles',
    completedCycleCount: 1,
    completedCycleNumbers: [1],
    sampleSize: 1,
    minimumSampleSize: 3,
    includedCycleNumbers: [1],
    excludedCompletedCycleCount: 0,
    cycleLengths: null,
    firstMucusCycleDays: null,
    peakCycleDays: null,
    daysAfterPeak: null,
  };

  it('keeps completed cycles visible while a comparison is taking shape', () => {
    const copy = buildCycleHistoryOverviewCopy(insufficient);

    expect(copy.summaryHeading).toBe('Cycle Summary');
    expect(copy.stats).toEqual([{ value: '1', label: 'Completed cycles' }]);
    expect(copy.patternsHeading).toBe('Your pattern history is taking shape');
    expect(copy.progressLabel).toBe('1 of 3 cycles ready');
    expect(copy.body).toContain('After 3 completed cycles have enough detail');
    expect(copy.inclusionNote).toBe('Based on 1 completed chart with enough detail.');
  });

  it('explains why a saved completed cycle is not yet compared', () => {
    const copy = buildCycleHistoryOverviewCopy({
      ...insufficient,
      sampleSize: 0,
      includedCycleNumbers: [],
      excludedCompletedCycleCount: 1,
    });

    expect(copy.patternsHeading).toBe('Your completed cycles are saved');
    expect(copy.progressLabel).toBe('0 of 3 cycles ready');
    expect(copy.body).toContain('do not have enough chart detail');
    expect(copy.inclusionNote).toBe(
      'Compared 0 of 1 completed cycles. Open a cycle below to see why one was not included.',
    );
  });

  it('shows a concise summary and raw recorded ranges without forecasting', () => {
    const copy = buildCycleHistoryOverviewCopy({
      ...insufficient,
      state: 'available',
      completedCycleCount: 4,
      completedCycleNumbers: [1, 2, 3, 4],
      sampleSize: 3,
      includedCycleNumbers: [1, 2, 3],
      excludedCompletedCycleCount: 1,
      cycleLengths: { minimum: 27, maximum: 31 },
      firstMucusCycleDays: { minimum: 8, maximum: 10 },
      peakCycleDays: { minimum: 14, maximum: 16 },
      daysAfterPeak: { minimum: 12, maximum: 14 },
    });

    expect(copy.stats).toEqual([
      { value: '4', label: 'Completed cycles' },
      { value: '3', label: 'Charts compared' },
      { value: '27–31 days', label: 'Cycle length' },
    ]);
    expect(copy.patternsHeading).toBe('What your charts have shown');
    expect(copy.patterns).toEqual([
      { label: 'First mucus sign', value: 'Cycle Days 8–10' },
      { label: 'Peak marker', value: 'Cycle Days 14–16' },
      { label: 'Peak to next cycle', value: '12–14 days' },
    ]);
    expect(copy.inclusionNote).toContain('Compared 3 of 4 completed cycles');
    expect(copy.limitation).toContain('not a prediction');
    expect(JSON.stringify(copy)).not.toMatch(/average|usual|typical|consistent|variation/i);
  });

  it('welcomes a user whose first cycle is still in progress', () => {
    const copy = buildCycleHistoryOverviewCopy({
      ...insufficient,
      completedCycleCount: 0,
      completedCycleNumbers: [],
      sampleSize: 0,
      includedCycleNumbers: [],
      excludedCompletedCycleCount: 0,
    });

    expect(copy.stats).toEqual([]);
    expect(copy.patternsHeading).toBe('Your history is just getting started');
    expect(copy.body).toContain('Once this cycle is complete');
    expect(copy.progressLabel).toBeNull();
  });
});
