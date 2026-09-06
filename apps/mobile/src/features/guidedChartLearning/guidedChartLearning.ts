import {
  type CycleSlice,
  type DailyEntry,
  resolveDailyMucus,
} from 'core-rules-engine';

export type ChartTipId =
  | 'observation-on-calendar'
  | 'dry-not-observed-open'
  | 'sensation-and-appearance'
  | 'multiple-observations'
  | 'completed-chart-review';

export type ChartTipTopicId =
  | 'calendar-treatments'
  | 'recorded-versus-open'
  | 'sensation-and-appearance'
  | 'multiple-observations'
  | 'completed-chart-review';

export type ChartTipTrigger =
  | 'first-qualifying-save'
  | 'dry-or-not-observed'
  | 'first-mucus-observation'
  | 'multiple-observations'
  | 'first-completed-chart';

export type ChartTipSourceSection =
  | 'calendar_colors'
  | 'status_messages'
  | 'sensation_appearance'
  | 'observe'
  | null;

export interface ChartTipDefinition {
  id: ChartTipId;
  topicId: ChartTipTopicId;
  contentVersion: number;
  trigger: ChartTipTrigger;
  title: string;
  summary: string;
  body: string;
  sourceLabel: string;
  sourceSection: ChartTipSourceSection;
  reviewStatus: 'approved-existing-product-contract';
  calendarEligible: boolean;
}

export type ChartTipProgressStatus = 'viewed' | 'dismissed';

export interface ChartTipProgress {
  contentVersion: number;
  status: ChartTipProgressStatus;
}

export interface GuidedChartLearningPreferences {
  chartTipsEnabled: boolean;
  lessonProgress: Partial<Record<ChartTipId, ChartTipProgress>>;
  firstSaveAcknowledged: boolean;
  pendingFirstSaveAcknowledgement: boolean;
  firstCompletedChartAcknowledged: boolean;
}

export const DEFAULT_GUIDED_CHART_LEARNING_PREFERENCES:
GuidedChartLearningPreferences = {
  chartTipsEnabled: true,
  lessonProgress: {},
  firstSaveAcknowledged: false,
  pendingFirstSaveAcknowledgement: false,
  firstCompletedChartAcknowledged: false,
};

export const CHART_TIPS: readonly ChartTipDefinition[] = [
  {
    id: 'observation-on-calendar',
    topicId: 'calendar-treatments',
    contentVersion: 2,
    trigger: 'first-qualifying-save',
    title: 'How your observation appears on the calendar',
    summary: 'See what the colors, dots, borders, and labels mean.',
    body:
      'The calendar reflects what you saved. Day colors show the strongest recorded observation, while dots, borders, and small labels add supporting chart context.',
    sourceLabel: 'CalendarGrid, calendar day presentation, and Calendar color guide',
    sourceSection: 'calendar_colors',
    reviewStatus: 'approved-existing-product-contract',
    calendarEligible: true,
  },
  {
    id: 'dry-not-observed-open',
    topicId: 'recorded-versus-open',
    contentVersion: 1,
    trigger: 'dry-or-not-observed',
    title: 'Dry, Not observed, and no entry are different',
    summary: 'Learn what each state tells you—and what it does not.',
    body:
      'Dry means you intentionally recorded a Dry sensation. Not observed means you saved that you did not make an observation. No entry means nothing has been saved for that date. Well Within keeps these states distinct because they provide different chart context.',
    sourceLabel: 'Current missing-day, status-message, and Calendar presentation contracts',
    sourceSection: 'status_messages',
    reviewStatus: 'approved-existing-product-contract',
    calendarEligible: true,
  },
  {
    id: 'sensation-and-appearance',
    topicId: 'sensation-and-appearance',
    contentVersion: 1,
    trigger: 'first-mucus-observation',
    title: 'How sensation and appearance work together',
    summary: 'Learn how what you feel and what you see work together.',
    body:
      'Each day, you record what you feel as sensation and what you see as appearance. The app looks at both and places the strongest recorded observation on your chart. Dry records no mucus; damp or sticky records a non-Peak mucus observation; clear, stretchy, or lubricative records a Peak-type sign.',
    sourceLabel: 'Existing sensation and appearance education copy',
    sourceSection: 'sensation_appearance',
    reviewStatus: 'approved-existing-product-contract',
    calendarEligible: true,
  },
  {
    id: 'multiple-observations',
    topicId: 'multiple-observations',
    contentVersion: 1,
    trigger: 'multiple-observations',
    title: 'What happens when you record more than one observation',
    summary: 'Every observation stays in the day; the chart reflects the strongest recorded sign.',
    body:
      'If you record multiple observations in one day, Well Within keeps them all and uses the observation with the most fertile signs for that day’s chart. Observation time helps organize your entries but does not change the result.',
    sourceLabel: 'Existing multiple-observation entry and Help copy',
    sourceSection: 'observe',
    reviewStatus: 'approved-existing-product-contract',
    calendarEligible: true,
  },
  {
    id: 'completed-chart-review',
    topicId: 'completed-chart-review',
    contentVersion: 1,
    trigger: 'first-completed-chart',
    title: 'What you can review in a completed chart',
    summary: 'Look back at saved observations and retrospective markers in one cycle.',
    body:
      'A completed chart keeps the observations you saved and any retrospective markers Well Within can show from that record. Open a cycle in History to review its chart, daily log, and export options.',
    sourceLabel: 'Existing Cycle History, Cycle Detail, daily log, and export presentation',
    sourceSection: null,
    reviewStatus: 'approved-existing-product-contract',
    calendarEligible: false,
  },
] as const;

const CHART_TIP_BY_ID = new Map<ChartTipId, ChartTipDefinition>(
  CHART_TIPS.map((tip) => [tip.id, tip]),
);

export function chartTipById(id: ChartTipId): ChartTipDefinition {
  return CHART_TIP_BY_ID.get(id) ?? CHART_TIPS[0];
}

export function isQualifyingIntentionalEntry(entry: DailyEntry | null): boolean {
  return entry != null && !entry.missing && resolveDailyMucus(entry).observations.length > 0;
}

function hasQualifyingEntry(entries: Record<string, DailyEntry>): boolean {
  return Object.values(entries).some(isQualifyingIntentionalEntry);
}

function hasDryOrNotObserved(entries: Record<string, DailyEntry>): boolean {
  return Object.values(entries).some((entry) => (
    entry.missing === true || (!entry.missing && resolveDailyMucus(entry).rank === 0)
  ));
}

function hasMucusObservation(entries: Record<string, DailyEntry>): boolean {
  return Object.values(entries).some((entry) => {
    const resolved = resolveDailyMucus(entry);
    return !entry.missing && resolved.rank !== null && resolved.rank > 0;
  });
}

function hasMultipleObservations(entries: Record<string, DailyEntry>): boolean {
  return Object.values(entries).some(
    (entry) => !entry.missing && resolveDailyMucus(entry).observations.length > 1,
  );
}

function triggerIsEligible(
  trigger: ChartTipTrigger,
  entries: Record<string, DailyEntry>,
  cycles: CycleSlice[],
): boolean {
  switch (trigger) {
    case 'first-qualifying-save':
      return hasQualifyingEntry(entries);
    case 'dry-or-not-observed':
      return hasDryOrNotObserved(entries);
    case 'first-mucus-observation':
      return hasMucusObservation(entries);
    case 'multiple-observations':
      return hasMultipleObservations(entries);
    case 'first-completed-chart':
      return cycles.some((cycle) => cycle.status === 'complete');
  }
}

function topicOwnedBySummary(
  topicId: ChartTipTopicId,
  explanationTarget: string | null,
): boolean {
  if (explanationTarget !== 'status_messages') return false;
  return (
    topicId === 'recorded-versus-open'
    || topicId === 'sensation-and-appearance'
    || topicId === 'multiple-observations'
  );
}

function lessonIsComplete(
  tip: ChartTipDefinition,
  progress: GuidedChartLearningPreferences['lessonProgress'],
): boolean {
  // Content does not automatically resurface when its version changes. A future
  // product decision must explicitly clear or migrate this progress record.
  return progress[tip.id] != null;
}

export function selectContextualChartTip(params: {
  entries: Record<string, DailyEntry>;
  cycles: CycleSlice[];
  explanationTarget: string | null;
  preferences: GuidedChartLearningPreferences;
}): ChartTipDefinition | null {
  const { entries, cycles, explanationTarget, preferences } = params;
  if (!preferences.chartTipsEnabled) return null;

  return CHART_TIPS.find((tip) => (
    tip.calendarEligible
    && !lessonIsComplete(tip, preferences.lessonProgress)
    && triggerIsEligible(tip.trigger, entries, cycles)
    && !topicOwnedBySummary(tip.topicId, explanationTarget)
  )) ?? null;
}

export function firstCompletedCycle(cycles: CycleSlice[]): CycleSlice | null {
  return cycles.find((cycle) => cycle.status === 'complete') ?? null;
}

export function shouldShowFirstCompletedChartAcknowledgement(
  cycles: CycleSlice[],
  preferences: GuidedChartLearningPreferences,
): boolean {
  return (
    !preferences.firstCompletedChartAcknowledged
    && firstCompletedCycle(cycles) !== null
  );
}

export function shouldQueueFirstSaveAcknowledgement(params: {
  entriesBeforeSave: Record<string, DailyEntry>;
  savedDate: string;
  previousEntry: DailyEntry | null;
  savedEntry: DailyEntry;
  preferences: GuidedChartLearningPreferences;
}): boolean {
  const {
    entriesBeforeSave,
    savedDate,
    previousEntry,
    savedEntry,
    preferences,
  } = params;

  if (
    preferences.firstSaveAcknowledged
    || preferences.pendingFirstSaveAcknowledgement
    || previousEntry !== null
    || !isQualifyingIntentionalEntry(savedEntry)
  ) {
    return false;
  }

  return !Object.entries(entriesBeforeSave).some(
    ([date, entry]) => date !== savedDate && isQualifyingIntentionalEntry(entry),
  );
}
