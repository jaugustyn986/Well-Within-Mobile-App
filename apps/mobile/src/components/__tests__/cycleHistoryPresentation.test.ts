import type {
  PossibleFertilePatternHistoryPresentation,
} from 'core-rules-engine';
import {
  buildCycleHistoryCardCopy,
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
    expect(copy.meaning).toContain('does not yet show the later observations');
    expect(copy.nextStep).toContain('Keep recording one observation each day');
  });

  it('states that a completed cycle remains complete when its pattern range is unavailable', () => {
    const copy = buildDevelopingPatternCardCopy({
      reason: 'pattern_developing',
      isCurrentCycle: false,
      cycleStatus: 'complete',
    });

    expect(copy.heading).toBe('Your observations are saved');
    expect(copy.meaning).toContain('does not show one completed start-through-P+3 pattern');
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
    expect(copy.meaning).toContain('daily observations—not separate Peak Days');
    expect(copy.meaning).toContain('leaves this pattern open');
    expect(copy.nextStep).toContain('cycle remains complete in History');
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

describe('buildCycleHistoryCardCopy', () => {
  const insufficient: PossibleFertilePatternHistoryPresentation = {
    state: 'insufficient_eligible_cycles',
    heading: 'Possible fertile pattern history',
    body: 'At least 3 eligible completed cycles are needed.',
    completedCycleCount: 1,
    completedCycleNumbers: [1],
    sampleSize: 1,
    minimumSampleSize: 3,
    eligibleCycleNumbers: [1],
    startCycleDays: { minimum: 8, maximum: 8 },
    peakCycleDays: { minimum: 14, maximum: 14 },
  };

  it('turns a one-cycle threshold into progress, purpose, and next action', () => {
    const copy = buildCycleHistoryCardCopy(insufficient);

    expect(copy.heading).toBe('Building your pattern history');
    expect(copy.progressLabel).toBe('1 completed cycle');
    expect(copy.body).toContain('starts comparing timing after 3 completed cycles');
    expect(copy.nextStep).toContain('2 more completed pattern ranges are needed');
  });

  it('does not erase a completed cycle when no bounded range is available', () => {
    const copy = buildCycleHistoryCardCopy({
      ...insufficient,
      sampleSize: 0,
      eligibleCycleNumbers: [],
      startCycleDays: null,
      peakCycleDays: null,
    });

    expect(copy.progressLabel).toBe('1 completed cycle');
    expect(copy.body).toContain('0 have a completed start-through-P+3 range');
    expect(copy.benefit).toContain('still be complete and stay in History');
    expect(copy.nextStep).toContain('Open the completed cycle below');
  });

  it('labels available ranges as retrospective rather than predictive', () => {
    const copy = buildCycleHistoryCardCopy({
      ...insufficient,
      state: 'available',
      completedCycleCount: 3,
      completedCycleNumbers: [1, 2, 3],
      sampleSize: 3,
      eligibleCycleNumbers: [1, 2, 3],
      body: 'Across 3 eligible completed cycles, the first sign occurred on Cycle Days 8–10.',
    });

    expect(copy.heading).toBe('Your recorded pattern history');
    expect(copy.benefit).toContain('do not predict');
  });
});
