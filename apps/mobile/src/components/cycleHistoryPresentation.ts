import type {
  CycleSlice,
  PossibleFertilePatternReason,
  RecordedCycleHistorySummary,
} from 'core-rules-engine';

export interface DevelopingPatternCardCopy {
  eyebrow: string;
  heading: string;
  meaning: string;
  nextStep: string;
  learnMoreLabel: string;
}

function formatCycleDays(days: number[]): string {
  if (days.length === 1) return `Cycle Day ${days[0]}`;
  if (days.length === 2) return `Cycle Days ${days[0]} and ${days[1]}`;
  return `Cycle Days ${days.slice(0, -1).join(', ')}, and ${days[days.length - 1]}`;
}

function numberWord(count: number): string {
  if (count === 2) return 'Two';
  if (count === 3) return 'Three';
  return String(count);
}

export function buildDevelopingPatternCardCopy(params: {
  reason: PossibleFertilePatternReason;
  isCurrentCycle: boolean;
  cycleStatus: CycleSlice['status'];
  observedPeakTypeCycleDays?: number[];
  observedMucusCycleDays?: number[];
}): DevelopingPatternCardCopy {
  const {
    reason,
    isCurrentCycle,
    cycleStatus,
    observedPeakTypeCycleDays = [],
    observedMucusCycleDays = [],
  } = params;
  const reopened = reason === 'later_peak_type_reopens_pattern';
  const latestMucusDay = observedMucusCycleDays[observedMucusCycleDays.length - 1] ?? null;

  if (reopened && observedPeakTypeCycleDays.length >= 2) {
    const count = observedPeakTypeCycleDays.length;
    return {
      eyebrow: 'Pattern note',
      heading: `${numberWord(count)} Peak-type signs were recorded`,
      meaning:
        `Peak-type signs are daily observations, not separate Peak Days. You recorded them on ${formatCycleDays(observedPeakTypeCycleDays)}. ` +
        'A later sign appeared after P+3, so the app keeps this pattern open instead of choosing a Peak Day.',
      nextStep: cycleStatus === 'complete'
        ? 'If those entries look right, no change is needed. This cycle stays complete in History.'
        : 'If those entries look right, keep charting. This note updates when an observation changes.',
      learnMoreLabel: 'How Peak Day is identified',
    };
  }

  if (reopened) {
    return {
      eyebrow: 'Pattern note',
      heading: 'A later Peak-type sign was recorded',
      meaning:
        `${latestMucusDay !== null ? `You recorded another Peak-type sign on Cycle Day ${latestMucusDay}` : 'You recorded another Peak-type sign'} ` +
        'after P+3. The app keeps this pattern open instead of choosing a Peak Day.',
      nextStep: cycleStatus === 'complete'
        ? 'If that entry looks right, no change is needed. This cycle stays complete in History.'
        : 'If that entry looks right, keep charting. This note updates when an observation changes.',
      learnMoreLabel: 'How Peak Day is identified',
    };
  }

  if (cycleStatus === 'complete') {
    return {
      eyebrow: 'Pattern note',
      heading: 'Your observations are saved',
      meaning:
        'Mucus signs were recorded, but this cycle does not have enough chart detail to show one clear pattern.',
      nextStep:
        'If the daily entries look right, no change is needed. This cycle remains complete in History.',
      learnMoreLabel: 'How pattern ranges work',
    };
  }

  if (isCurrentCycle) {
    return {
      eyebrow: 'Pattern note',
      heading: 'This cycle’s pattern is still taking shape',
      meaning:
        'Mucus signs are recorded. Keep charting—the app needs a few more daily observations before it can show a clear pattern.',
      nextStep:
        'Keep recording one observation each day. This note updates whenever an entry changes.',
      learnMoreLabel: 'How pattern ranges work',
    };
  }

  return {
    eyebrow: 'Pattern note',
    heading: 'Your observations are saved',
    meaning:
      'Mucus signs are recorded, but this chart does not have enough detail to show one clear pattern.',
    nextStep:
      'If the daily entries look right, no change is needed. Keep charting future cycles normally.',
    learnMoreLabel: 'How pattern ranges work',
  };
}

export interface CycleHistoryStatCopy {
  value: string;
  label: string;
}

export interface CycleHistoryPatternCopy {
  label: string;
  value: string;
}

export interface CycleHistoryOverviewCopy {
  summaryHeading: string;
  stats: CycleHistoryStatCopy[];
  patternsHeading: string;
  progressLabel: string | null;
  body: string | null;
  patterns: CycleHistoryPatternCopy[];
  inclusionNote: string;
  limitation: string | null;
}

function formatCycleDayRange(
  range: NonNullable<RecordedCycleHistorySummary['firstMucusCycleDays']>,
): string {
  return range.minimum === range.maximum
    ? `Cycle Day ${range.minimum}`
    : `Cycle Days ${range.minimum}–${range.maximum}`;
}

function formatDayRange(
  range: NonNullable<RecordedCycleHistorySummary['cycleLengths']>,
): string {
  return range.minimum === range.maximum
    ? `${range.minimum} ${range.minimum === 1 ? 'day' : 'days'}`
    : `${range.minimum}–${range.maximum} days`;
}

function excludedCycleNote(summary: RecordedCycleHistorySummary): string {
  const excluded = summary.excludedCompletedCycleCount;
  if (excluded === 0) {
    return `Based on ${summary.sampleSize} completed ${summary.sampleSize === 1 ? 'chart' : 'charts'} with enough detail.`;
  }
  if (excluded === 1) {
    return `Compared ${summary.sampleSize} of ${summary.completedCycleCount} completed cycles. Open a cycle below to see why one was not included.`;
  }
  return `Compared ${summary.sampleSize} of ${summary.completedCycleCount} completed cycles. Open a cycle below to see why ${excluded} were not included.`;
}

export function buildCycleHistoryOverviewCopy(
  summary: RecordedCycleHistorySummary,
): CycleHistoryOverviewCopy {
  const completedStat: CycleHistoryStatCopy = {
    value: String(summary.completedCycleCount),
    label: 'Completed cycles',
  };

  if (
    summary.state === 'available' &&
    summary.cycleLengths &&
    summary.firstMucusCycleDays &&
    summary.peakCycleDays &&
    summary.daysAfterPeak
  ) {
    return {
      summaryHeading: 'Cycle Summary',
      stats: [
        completedStat,
        { value: String(summary.sampleSize), label: 'Charts compared' },
        { value: formatDayRange(summary.cycleLengths), label: 'Cycle length' },
        { value: formatDayRange(summary.daysAfterPeak), label: 'After Peak' },
      ],
      patternsHeading: 'What your charts have shown',
      progressLabel: null,
      body: null,
      patterns: [
        {
          label: 'First mucus sign',
          value: formatCycleDayRange(summary.firstMucusCycleDays),
        },
        {
          label: 'Peak Day',
          value: formatCycleDayRange(summary.peakCycleDays),
        },
      ],
      inclusionNote: excludedCycleNote(summary),
      limitation:
        'A look back at what you recorded—not a prediction or confirmation of ovulation.',
    };
  }

  if (summary.completedCycleCount === 0) {
    return {
      summaryHeading: 'Cycle Summary',
      stats: [],
      patternsHeading: 'Your history is just getting started',
      progressLabel: null,
      body: 'Once this cycle is complete, you’ll be able to look back at it here.',
      patterns: [],
      inclusionNote: 'Keep charting—this view will grow with your completed cycles.',
      limitation: null,
    };
  }

  const noComparableCycles = summary.sampleSize === 0;

  return {
    summaryHeading: 'Cycle Summary',
    stats: [completedStat],
    patternsHeading: noComparableCycles
      ? 'Your completed cycles are saved'
      : 'Your pattern history is taking shape',
    progressLabel: `${summary.sampleSize} of ${summary.minimumSampleSize} cycles ready`,
    body: noComparableCycles
      ? 'These cycles do not have enough chart detail for a pattern comparison yet.'
      : `After ${summary.minimumSampleSize} completed cycles have enough detail, you’ll be able to compare what their charts showed.`,
    patterns: [],
    inclusionNote: excludedCycleNote(summary),
    limitation: null,
  };
}
