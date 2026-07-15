import type {
  CycleSlice,
  PossibleFertilePatternHistoryPresentation,
  PossibleFertilePatternReason,
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

export interface CycleHistoryCardCopy {
  heading: string;
  progressLabel: string;
  body: string;
  benefit: string;
}

function formatHistoryCycleDayRange(
  range: NonNullable<PossibleFertilePatternHistoryPresentation['startCycleDays']>,
): string {
  return range.minimum === range.maximum
    ? `on Cycle Day ${range.minimum}`
    : `between Cycle Days ${range.minimum}–${range.maximum}`;
}

export function buildCycleHistoryCardCopy(
  history: PossibleFertilePatternHistoryPresentation,
): CycleHistoryCardCopy {
  if (history.state === 'available' && history.startCycleDays && history.peakCycleDays) {
    return {
      heading: 'What your past cycles have shown',
      progressLabel: `${history.sampleSize} cycles compared`,
      body:
        `Your first mucus sign appeared ${formatHistoryCycleDayRange(history.startCycleDays)}. ` +
        `Peak Day appeared ${formatHistoryCycleDayRange(history.peakCycleDays)}.`,
      benefit:
        'Use this to compare what you recorded from cycle to cycle. Every cycle can be different.',
    };
  }

  const notIncluded = Math.max(0, history.completedCycleCount - history.sampleSize);
  const notIncludedLabel = notIncluded === 1
    ? '1 completed cycle cannot be included yet.'
    : `${notIncluded} completed cycles cannot be included yet.`;

  return {
    heading: 'Your pattern history is taking shape',
    progressLabel: `${history.sampleSize} of ${history.minimumSampleSize} cycles ready`,
    body:
      `After ${history.minimumSampleSize} completed cycles show a clear pattern, you’ll be able to compare when mucus signs and Peak Day appeared across your charts.`,
    benefit: notIncluded > 0
      ? `${notIncludedLabel} Open a cycle below to see why.`
      : 'Keep charting—this view will grow as your cycles are completed.',
  };
}
