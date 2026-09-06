import type { CycleSlice, DailyEntry } from 'core-rules-engine';
import {
  CHART_TIPS,
  DEFAULT_GUIDED_CHART_LEARNING_PREFERENCES,
  selectContextualChartTip,
  shouldQueueFirstSaveAcknowledgement,
  shouldShowFirstCompletedChartAcknowledgement,
  type ChartTipId,
  type GuidedChartLearningPreferences,
} from '../guidedChartLearning';

function observedEntry(
  sensation: 'dry' | 'damp' | 'wet' = 'dry',
  appearances: DailyEntry['appearances'] = [],
): DailyEntry {
  return {
    date: '2026-08-23',
    observations: [{
      id: 'observation-1',
      sensation,
      appearances: appearances ?? [],
    }],
  };
}

function preferences(
  overrides: Partial<GuidedChartLearningPreferences> = {},
): GuidedChartLearningPreferences {
  return {
    ...DEFAULT_GUIDED_CHART_LEARNING_PREFERENCES,
    lessonProgress: {},
    ...overrides,
  };
}

function viewed(...ids: ChartTipId[]): GuidedChartLearningPreferences['lessonProgress'] {
  return Object.fromEntries(ids.map((id) => [
    id,
    { contentVersion: 1, status: 'viewed' as const },
  ]));
}

function completedCycle(): CycleSlice {
  return {
    cycleNumber: 1,
    startDate: '2026-07-01',
    endDate: '2026-07-28',
    entries: [],
    result: {} as CycleSlice['result'],
    length: 28,
    peakDay: null,
    lutealPhase: null,
    status: 'complete',
    cycleBoundary: {} as CycleSlice['cycleBoundary'],
  };
}

describe('guided chart learning eligibility', () => {
  it('shows nothing before a qualifying observation exists', () => {
    expect(selectContextualChartTip({
      entries: {},
      cycles: [],
      explanationTarget: null,
      preferences: preferences(),
    })).toBeNull();
  });

  it('starts with the standalone calendar treatment lesson', () => {
    expect(selectContextualChartTip({
      entries: { '2026-08-23': observedEntry('dry') },
      cycles: [],
      explanationTarget: null,
      preferences: preferences(),
    })?.id).toBe('observation-on-calendar');
  });

  it('makes the recorded-state distinction eligible after Dry or Not observed', () => {
    expect(selectContextualChartTip({
      entries: { '2026-08-23': { date: '2026-08-23', missing: true } },
      cycles: [],
      explanationTarget: null,
      preferences: preferences({
        lessonProgress: viewed('observation-on-calendar'),
      }),
    })?.id).toBe('dry-not-observed-open');
  });

  it('suppresses a lesson topic owned by the active summary', () => {
    expect(selectContextualChartTip({
      entries: { '2026-08-23': observedEntry('dry') },
      cycles: [],
      explanationTarget: 'status_messages',
      preferences: preferences({
        lessonProgress: viewed('observation-on-calendar'),
      }),
    })).toBeNull();
  });

  it('unlocks sensation and appearance after non-Dry mucus exists', () => {
    expect(selectContextualChartTip({
      entries: { '2026-08-23': observedEntry('wet', ['cloudy']) },
      cycles: [],
      explanationTarget: null,
      preferences: preferences({
        lessonProgress: viewed(
          'observation-on-calendar',
          'dry-not-observed-open',
        ),
      }),
    })?.id).toBe('sensation-and-appearance');
  });

  it('unlocks multiple-observation education without changing daily reduction', () => {
    const entry = observedEntry('damp');
    entry.observations = [
      { id: 'one', sensation: 'damp', appearances: [] },
      { id: 'two', sensation: 'wet', appearances: ['cloudy'] },
    ];

    expect(selectContextualChartTip({
      entries: { '2026-08-23': entry },
      cycles: [],
      explanationTarget: null,
      preferences: preferences({
        lessonProgress: viewed(
          'observation-on-calendar',
          'dry-not-observed-open',
          'sensation-and-appearance',
        ),
      }),
    })?.id).toBe('multiple-observations');
  });

  it('renders no Calendar lesson when tips are hidden or the finite set is exhausted', () => {
    const entries = { '2026-08-23': observedEntry('wet', ['cloudy']) };
    expect(selectContextualChartTip({
      entries,
      cycles: [],
      explanationTarget: null,
      preferences: preferences({ chartTipsEnabled: false }),
    })).toBeNull();

    expect(selectContextualChartTip({
      entries,
      cycles: [],
      explanationTarget: null,
      preferences: preferences({
        lessonProgress: viewed(
          'observation-on-calendar',
          'dry-not-observed-open',
          'sensation-and-appearance',
          'multiple-observations',
        ),
      }),
    })).toBeNull();
  });

  it('does not automatically resurface a lesson after a content-version change', () => {
    expect(selectContextualChartTip({
      entries: { '2026-08-23': observedEntry('dry') },
      cycles: [],
      explanationTarget: null,
      preferences: preferences({
        lessonProgress: {
          'observation-on-calendar': { contentVersion: 0, status: 'viewed' },
          'dry-not-observed-open': { contentVersion: 0, status: 'dismissed' },
        },
      }),
    })).toBeNull();
  });

  it('keeps every shipping lesson versioned and source-reviewed', () => {
    expect(CHART_TIPS).toHaveLength(5);
    CHART_TIPS.forEach((lesson) => {
      expect(lesson.contentVersion).toBeGreaterThan(0);
      expect(lesson.sourceLabel.length).toBeGreaterThan(10);
      expect(lesson.reviewStatus).toBe('approved-existing-product-contract');
    });
  });

  it('keeps the calendar walkthrough first and promises the complete visual guide', () => {
    expect(CHART_TIPS[0].id).toBe('observation-on-calendar');
    expect(CHART_TIPS[0].summary).toContain('colors, dots, borders, and labels');
    expect(CHART_TIPS[0].contentVersion).toBe(2);
  });
});

describe('first-save and first-completed-chart acknowledgement', () => {
  it('queues only a new first intentional non-missing save', () => {
    const savedEntry = observedEntry('dry');
    expect(shouldQueueFirstSaveAcknowledgement({
      entriesBeforeSave: {},
      savedDate: '2026-08-23',
      previousEntry: null,
      savedEntry,
      preferences: preferences(),
    })).toBe(true);

    expect(shouldQueueFirstSaveAcknowledgement({
      entriesBeforeSave: {},
      savedDate: '2026-08-23',
      previousEntry: savedEntry,
      savedEntry,
      preferences: preferences(),
    })).toBe(false);

    expect(shouldQueueFirstSaveAcknowledgement({
      entriesBeforeSave: {},
      savedDate: '2026-08-23',
      previousEntry: null,
      savedEntry: { date: '2026-08-23', missing: true },
      preferences: preferences(),
    })).toBe(false);
  });

  it('does not queue for an existing chart or an acknowledgement already handled', () => {
    const savedEntry = observedEntry('dry');
    expect(shouldQueueFirstSaveAcknowledgement({
      entriesBeforeSave: { '2026-08-22': observedEntry('damp') },
      savedDate: '2026-08-23',
      previousEntry: null,
      savedEntry,
      preferences: preferences(),
    })).toBe(false);

    expect(shouldQueueFirstSaveAcknowledgement({
      entriesBeforeSave: {},
      savedDate: '2026-08-23',
      previousEntry: null,
      savedEntry,
      preferences: preferences({ firstSaveAcknowledged: true }),
    })).toBe(false);
  });

  it('shows the completed-chart acknowledgement once when History has a completed chart', () => {
    expect(shouldShowFirstCompletedChartAcknowledgement(
      [completedCycle()],
      preferences(),
    )).toBe(true);
    expect(shouldShowFirstCompletedChartAcknowledgement(
      [completedCycle()],
      preferences({ firstCompletedChartAcknowledged: true }),
    )).toBe(false);
  });
});
