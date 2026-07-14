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
        `Peak-type signs are daily observations—not separate Peak Days. You recorded them on ${formatCycleDays(observedPeakTypeCycleDays)}. ` +
        'Because the later sign came after the earlier three-day follow-up (P+3), Well Within leaves this pattern open instead of selecting one Peak Day.',
      nextStep: cycleStatus === 'complete'
        ? 'If those entries look right, no change is needed. This cycle remains complete in History.'
        : 'If those entries look right, keep charting daily. This note updates whenever an observation changes.',
      learnMoreLabel: 'How Peak Day is identified',
    };
  }

  if (reopened) {
    return {
      eyebrow: 'Pattern note',
      heading: 'A later Peak-type sign was recorded',
      meaning:
        `${latestMucusDay !== null ? `You recorded another Peak-type sign on Cycle Day ${latestMucusDay}` : 'You recorded another Peak-type sign'} ` +
        'after the earlier three-day follow-up (P+3). Well Within leaves this pattern open instead of treating the earlier Peak Day as settled.',
      nextStep: cycleStatus === 'complete'
        ? 'If that entry looks right, no change is needed. This cycle remains complete in History.'
        : 'If that entry looks right, keep charting daily. This note updates whenever an observation changes.',
      learnMoreLabel: 'How Peak Day is identified',
    };
  }

  if (cycleStatus === 'complete') {
    return {
      eyebrow: 'Pattern note',
      heading: 'Your observations are saved',
      meaning:
        'Mucus signs were recorded, but this cycle does not show one completed start-through-P+3 pattern for a timing comparison.',
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
        'Mucus signs are recorded, but the chart does not yet show the later observations Well Within needs to complete a retrospective pattern.',
      nextStep:
        'Keep recording one observation each day. This note updates whenever an entry changes.',
      learnMoreLabel: 'How pattern ranges work',
    };
  }

  return {
    eyebrow: 'Pattern note',
    heading: 'Your observations are saved',
    meaning:
      'Mucus signs are recorded, but this chart does not contain one completed start-through-P+3 pattern.',
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
  nextStep: string;
}

export function buildCycleHistoryCardCopy(
  history: PossibleFertilePatternHistoryPresentation,
): CycleHistoryCardCopy {
  if (history.state === 'available') {
    return {
      heading: 'Your recorded pattern history',
      progressLabel: `${history.completedCycleCount} completed · ${history.sampleSize} compared`,
      body: history.body,
      benefit:
        'These are retrospective ranges from your saved charts. They do not predict where a future cycle will fall.',
      nextStep: 'Keep charting to add more completed cycles to this history.',
    };
  }

  const remaining = Math.max(0, history.minimumSampleSize - history.sampleSize);
  const completedLabel = history.completedCycleCount === 1
    ? '1 completed cycle'
    : `${history.completedCycleCount} completed cycles`;
  const comparableLabel = history.sampleSize === 1
    ? '1 has a completed start-through-P+3 range ready to compare'
    : `${history.sampleSize} have a completed start-through-P+3 range ready to compare`;
  const hasCompletedCycleWithoutRange = history.completedCycleCount > history.sampleSize;

  return {
    heading: 'Building your pattern history',
    progressLabel: completedLabel,
    body:
      `Well Within starts comparing timing after ${history.minimumSampleSize} completed cycles have a clear start-through-P+3 pattern. ` +
      `Of your completed cycles, ${comparableLabel}.`,
    benefit: hasCompletedCycleWithoutRange
      ? 'A cycle can still be complete and stay in History even when its pattern timing is not included in the comparison.'
      : 'These comparisons use completed charts only and do not predict a future cycle.',
    nextStep: hasCompletedCycleWithoutRange
      ? `Open the completed cycle below for its chart-specific note. Keep charting normally; ${remaining} more completed pattern ${remaining === 1 ? 'range is' : 'ranges are'} needed before History shows timing ranges.`
      : `Keep charting normally; ${remaining} more completed pattern ${remaining === 1 ? 'range is' : 'ranges are'} needed before History shows timing ranges.`,
  };
}
