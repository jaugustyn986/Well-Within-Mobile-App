import { findConfirmedPeakSequenceIndices } from './peak';
import { calendarDaysBetween, compareIsoDate } from './calendar';
import type { CycleResult, DailyEntry, InterpretationWarningId } from './types';

export type InterpretationSupportStatus =
  | 'forming'
  | 'summary_available'
  | 'blocked_by_missing'
  | 'review_recommended';

export type InterpretationSupportReason =
  | 'insufficient_pattern_data'
  | 'retrospective_summary_available'
  | 'calendar_gap'
  | 'not_observed'
  | 'earlier_gap_limits_boundary'
  | 'later_peak_type_reopens_pattern'
  | 'bleeding_mucus_ambiguity'
  | 'invalid_or_unresolved_dates';

export interface InterpretationSupport {
  status: InterpretationSupportStatus;
  reason: InterpretationSupportReason;
  confirmedPeakSequenceCount: number;
}

const MISSING_BLOCKERS: InterpretationWarningId[] = [
  'calendar_gap_blocks_peak_confirmation',
  'missing_blocks_peak_confirmation',
  'uncertain_fertile_start',
];

function cycleStartIndexFromResult(result: CycleResult): number {
  const index = result.phaseLabels.findIndex((phase) => phase !== 'previous_cycle');
  return index >= 0 ? index : 0;
}

function hasBleedingWithMucusRequiringReview(
  entries: DailyEntry[],
  result: CycleResult,
  cycleStartIndex: number,
): boolean {
  for (let i = cycleStartIndex; i < entries.length; i += 1) {
    if (entries[i]?.missing) continue;
    const bleeding = entries[i]?.bleeding;
    const rank = result.mucusRanks[i];
    if ((bleeding === 'light' || bleeding === 'spotting') && rank !== null && rank >= 1) {
      return true;
    }
  }
  return false;
}

function hasResolvedCurrentCycleDates(
  entries: DailyEntry[],
  cycleStartIndex: number,
): boolean {
  let previousDate: string | null = null;
  for (let i = cycleStartIndex; i < entries.length; i += 1) {
    const date = entries[i]?.date;
    if (!date || calendarDaysBetween(date, date) === null) return false;
    if (previousDate !== null && compareIsoDate(date, previousDate) <= 0) return false;
    previousDate = date;
  }
  return true;
}

/**
 * Describes what this version of Well Within can safely summarize. This is a
 * product capability state, not a diagnosis or a clinical pattern label.
 */
export function evaluateInterpretationSupport(
  entries: DailyEntry[],
  result: CycleResult,
): InterpretationSupport {
  const cycleStartIndex = cycleStartIndexFromResult(result);
  const confirmedPeakSequenceCount = findConfirmedPeakSequenceIndices(
    entries,
    result.mucusRanks,
    cycleStartIndex,
  ).length;

  if (hasBleedingWithMucusRequiringReview(entries, result, cycleStartIndex)) {
    return {
      status: 'review_recommended',
      reason: 'bleeding_mucus_ambiguity',
      confirmedPeakSequenceCount,
    };
  }

  const blockingWarning = MISSING_BLOCKERS.find((warning) =>
    result.interpretationWarnings.includes(warning),
  );
  if (blockingWarning) {
    const reason: InterpretationSupportReason =
      blockingWarning === 'calendar_gap_blocks_peak_confirmation'
        ? 'calendar_gap'
        : blockingWarning === 'missing_blocks_peak_confirmation'
          ? 'not_observed'
          : 'earlier_gap_limits_boundary';
    return {
      status: 'blocked_by_missing',
      reason,
      confirmedPeakSequenceCount,
    };
  }

  // Exact date boundaries must never be emitted from synthetic, duplicate, or
  // out-of-order dates. Forming charts remain chartable; the gate matters once
  // a retrospective result would otherwise be available.
  if (result.peakConfirmed && !hasResolvedCurrentCycleDates(entries, cycleStartIndex)) {
    return {
      status: 'review_recommended',
      reason: 'invalid_or_unresolved_dates',
      confirmedPeakSequenceCount,
    };
  }

  // A later Peak-type observation immediately supersedes an earlier completed
  // candidate. Until the latest candidate completes its own three-day count,
  // preserve the existing "reopened" presentation rather than falling back to
  // the earlier Peak or describing the chart as a brand-new pattern.
  if (!result.peakConfirmed && confirmedPeakSequenceCount > 0) {
    return {
      status: 'forming',
      reason: 'later_peak_type_reopens_pattern',
      confirmedPeakSequenceCount,
    };
  }

  if (result.peakConfirmed && result.fertileEndIndex !== null) {
    return {
      status: 'summary_available',
      reason: 'retrospective_summary_available',
      confirmedPeakSequenceCount,
    };
  }

  return {
    status: 'forming',
    reason: 'insufficient_pattern_data',
    confirmedPeakSequenceCount,
  };
}
