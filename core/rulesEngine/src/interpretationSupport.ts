import { findConfirmedPeakSequenceIndices } from './peak';
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
  | 'multiple_confirmed_peak_sequences';

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

/**
 * Describes what this version of Well Within can safely summarize. This is a
 * product capability state, not a diagnosis or a clinical pattern label.
 */
export function evaluateInterpretationSupport(
  entries: DailyEntry[],
  result: CycleResult,
): InterpretationSupport {
  const confirmedPeakSequenceCount = findConfirmedPeakSequenceIndices(
    entries,
    result.mucusRanks,
    cycleStartIndexFromResult(result),
  ).length;

  if (confirmedPeakSequenceCount > 1) {
    return {
      status: 'review_recommended',
      reason: 'multiple_confirmed_peak_sequences',
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
