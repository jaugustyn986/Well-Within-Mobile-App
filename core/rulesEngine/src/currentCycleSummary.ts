import { addDaysIso, compareIsoDate, cycleDayForEntryIndex } from './calendar';
import { CycleComparisonStructured } from './cycleComparisonSummary';
import {
  evaluateInterpretationSupport,
  type InterpretationSupportReason,
  type InterpretationSupportStatus,
} from './interpretationSupport';
import {
  CycleResult,
  DailyEntry,
  InterpretationWarningId,
  PhaseLabel,
  PrimaryDayClass,
} from './types';

export type CycleSliceStatus = 'complete' | 'in_progress' | 'no_peak';

export type SummaryTone = 'neutral' | 'caution' | 'positive';

export type SummaryExplanationTarget =
  | 'peak_day'
  | 'status_messages'
  | null;

export type CompactSupportField =
  | 'guidance'
  | 'completeness'
  | 'interpretationNote'
  | 'baselineContext'
  | null;

export interface CurrentCycleSummary {
  /** 1-based cycle day for the focused row, or null when there are no entries. */
  cycleDay: number | null;
  headline: string;
  /** Warm capability line for the interpretation support state. */
  statusLine: string;
  /** Optional limitation or context shown directly beneath the evidence line. */
  supportingContext: string;
  completeness: string;
  guidance: string;
  summaryTone: SummaryTone;
  /** Non-null iff today is not in the slice and there is at least one entry. */
  focusQualification: string | null;
  interpretationNotes: string[];
  /** Tells the compact UI which single support line to render. */
  compactSupportField: CompactSupportField;
  /** Historical context from prior cycles (observational, never predictive). */
  baselineContext: string | null;
  /** What this app version can summarize; never a diagnosis or charting lock. */
  interpretationStatus: InterpretationSupportStatus;
  interpretationReason: InterpretationSupportReason;
  /** Contextual Help destination, or null when the compact card is self-contained. */
  explanationTarget: SummaryExplanationTarget;
}

export interface BuildCurrentCycleSummaryParams {
  entries: DailyEntry[];
  result: CycleResult;
  status: CycleSliceStatus;
  todayIndex: number | null;
  /**
   * Device "today" (YYYY-MM-DD). When set on an in-progress slice, days after the
   * last logged date through this date with no stored row count as missing (matches
   * empty cells on the calendar grid).
   */
  calendarAsOfDate?: string;
  /** Prior-cycle comparison data; enables baseline context lines. */
  baselineComparison?: CycleComparisonStructured;
}

const FOCUS_QUALIFICATION =
  'No entry today. Showing your last logged day.';

/** Last three slice indices ending at focusIndex (inclusive), per RULES_ENGINE_SPEC. */
function recentWindowHasGap(
  entries: DailyEntry[],
  result: CycleResult,
  focusIndex: number,
): boolean {
  const firstDate = entries[0]?.date;
  const focusDate = entries[focusIndex]?.date;
  if (firstDate && focusDate) {
    const indexByDate = new Map<string, number>();
    entries.forEach((entry, index) => {
      if (entry.date) indexByDate.set(entry.date, index);
    });
    for (let offset = 0; offset <= 2; offset += 1) {
      const date = addDaysIso(focusDate, -offset);
      if (compareIsoDate(date, firstDate) < 0) continue;
      const index = indexByDate.get(date);
      if (index === undefined) return true;
      if (entries[index]?.missing === true) return true;
      if (result.phaseLabels[index] === 'missing') return true;
    }
    return false;
  }

  const start = Math.max(0, focusIndex - 2);
  for (let i = start; i <= focusIndex; i++) {
    if (entries[i]?.missing === true) return true;
    if (result.phaseLabels[i] === 'missing') return true;
  }
  return false;
}

const WARNING_COPY: Record<InterpretationWarningId, string> = {
  uncertain_fertile_start:
    'Where the chart picks up fertile opening, a gap or missing day earlier in the cycle means that boundary is a little less certain.',
  calendar_gap_blocks_peak_confirmation:
    'There is a calendar gap in the three days after your Peak-type day, so Peak cannot be confirmed from what is logged yet.',
  missing_blocks_peak_confirmation:
    'A missing day in the three days after your Peak-type day means Peak cannot be confirmed until those observations are in.',
  peak_confirmation_incomplete:
    'Peak is not confirmed yet — keep logging; the three days after your Peak-type sign need to show the usual post-Peak pattern.',
};

const WARNING_ORDER: InterpretationWarningId[] = [
  'uncertain_fertile_start',
  'calendar_gap_blocks_peak_confirmation',
  'missing_blocks_peak_confirmation',
  'peak_confirmation_incomplete',
];

function buildInterpretationNotes(result: CycleResult): string[] {
  const seen = new Set<InterpretationWarningId>();
  const notes: string[] = [];
  for (const id of WARNING_ORDER) {
    if (!result.interpretationWarnings.includes(id)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    notes.push(WARNING_COPY[id]);
  }
  return notes;
}


function eachIsoDayInclusive(from: string, to: string): string[] {
  if (compareIsoDate(from, to) > 0) return [];
  const out: string[] = [];
  let cur = from;
  while (compareIsoDate(cur, to) <= 0) {
    out.push(cur);
    cur = addDaysIso(cur, 1);
  }
  return out;
}

function countDaysWithoutEntry(
  loggedDates: Set<string>,
  from: string,
  to: string,
): number {
  return eachIsoDayInclusive(from, to).filter((d) => !loggedDates.has(d)).length;
}

/**
 * Matches calendar "missing" UX: explicit `missing: true` rows plus calendar days in the
 * slice span (first→last logged date) with no row, plus trailing unlogged days through
 * `calendarAsOfDate` for in-progress cycles.
 */
/** Exported for feedback context parity with calendar completeness UX. */
export function countCompletenessMissing(params: {
  entries: DailyEntry[];
  status: CycleSliceStatus;
  calendarAsOfDate?: string;
}): number {
  const { entries, status, calendarAsOfDate } = params;
  const loggedDates = new Set(
    entries.map((e) => e.date ?? '').filter((d) => d.length > 0),
  );
  const explicit = entries.reduce(
    (n, e) => n + (e.missing === true ? 1 : 0),
    0,
  );
  const first = entries[0]?.date ?? '';
  const last = entries[entries.length - 1]?.date ?? '';
  if (!first || !last) return explicit;

  const interiorGaps = countDaysWithoutEntry(loggedDates, first, last);

  let trailingGaps = 0;
  if (
    calendarAsOfDate &&
    status !== 'complete' &&
    compareIsoDate(last, calendarAsOfDate) < 0
  ) {
    const trailStart = addDaysIso(last, 1);
    trailingGaps = countDaysWithoutEntry(
      loggedDates,
      trailStart,
      calendarAsOfDate,
    );
  }

  return explicit + interiorGaps + trailingGaps;
}

function isFocusMissing(
  entries: DailyEntry[],
  focusIndex: number,
  phase: PhaseLabel,
): boolean {
  const e = entries[focusIndex];
  return phase === 'missing' || e?.missing === true || e == null;
}

function missingSupportLine(reason: InterpretationSupportReason): string {
  switch (reason) {
    case 'calendar_gap':
      return 'An open date falls within the three days Well Within uses to mark a Peak Day, so no Peak Day is shown from this pattern.';
    case 'not_observed':
      return 'A day marked not observed falls within the three days Well Within uses to mark a Peak Day, so no Peak Day is shown from this pattern.';
    case 'earlier_gap_limits_boundary':
      return 'An earlier open or not-observed day makes where this pattern begins less clear, so no phase summary is shown from it.';
    default:
      return 'One or more open or not-observed days limit what Well Within can show from this pattern.';
  }
}

function buildBaselineContext(
  phase: PhaseLabel,
  cycleDay: number,
  comparison?: CycleComparisonStructured,
): string | null {
  if (!comparison) return null;
  if (comparison.priorSampleSize < 2) return null;

  switch (phase) {
    case 'dry':
    case 'previous_cycle': {
      const avg = comparison.avgFertileStartDay;
      if (avg !== null && cycleDay < avg) {
        return `Your cycles have typically shown fertile signs starting around day ${avg}.`;
      }
      return null;
    }
    case 'fertile_open': {
      const avg = comparison.avgPeakDay;
      if (avg !== null) {
        return `Peak has usually occurred around day ${avg} in your previous cycles.`;
      }
      return null;
    }
    case 'peak_confirmed':
    case 'post_peak': {
      if (
        comparison.peakVsPrior !== 'similar' &&
        comparison.peakVsPrior !== 'not_comparable'
      ) {
        const dir = comparison.peakVsPrior === 'later' ? 'later' : 'earlier';
        return `Peak occurred ${dir} than your usual pattern.`;
      }
      return null;
    }
    default:
      return null;
  }
}

function resolveCompactSupportField(
  interpretationLimited: boolean,
  focusMissing: boolean,
  interpretationNotes: string[],
  missingCount: number,
  baselineContext: string | null,
): CompactSupportField {
  if (focusMissing && interpretationNotes.length > 0) return 'interpretationNote';
  if (interpretationLimited && missingCount > 0) return 'completeness';
  if (baselineContext) return 'baselineContext';
  return 'guidance';
}

/**
 * Deterministic calendar header summary for the current (last) cycle slice.
 * See docs/RULES_ENGINE_SPEC.md and docs/CURRENT_CYCLE_SUMMARY_MATRIX.md (headline/support/baseline matrix).
 */
export function buildCurrentCycleSummary(
  params: BuildCurrentCycleSummaryParams,
): CurrentCycleSummary {
  const { entries, result, status, todayIndex, calendarAsOfDate, baselineComparison } = params;

  if (entries.length === 0) {
    return {
      cycleDay: null,
      headline: 'Your chart is ready when you are',
      statusLine: 'Your first observation gives Well Within a place to begin.',
      supportingContext: '',
      completeness: '',
      guidance: 'Log today’s observation when you’re ready.',
      summaryTone: 'neutral',
      focusQualification: null,
      interpretationNotes: [],
      compactSupportField: 'guidance',
      baselineContext: null,
      interpretationStatus: 'forming',
      interpretationReason: 'insufficient_pattern_data',
      explanationTarget: null,
    };
  }

  const focusIndex =
    todayIndex !== null
      ? todayIndex
      : Math.max(0, entries.length - 1);

  const phase = result.phaseLabels[focusIndex] ?? 'dry';
  const primaryClass: PrimaryDayClass =
    result.primaryDayClassByDay[focusIndex] ?? 'dry';
  const missingCount = countCompletenessMissing({
    entries,
    status,
    calendarAsOfDate,
  });
  const focusMissing = isFocusMissing(entries, focusIndex, phase);
  const recentWindowMissing = recentWindowHasGap(entries, result, focusIndex);
  const interpretationSupport = evaluateInterpretationSupport(entries, result);

  const focusQualification =
    todayIndex === null ? FOCUS_QUALIFICATION : null;
  const cycleDay = cycleDayForEntryIndex(entries, focusIndex);

  let statusLine = 'Keep charting';

  const interpretationNotes = buildInterpretationNotes(result);

  let headline: string;
  let guidance: string;
  let summaryTone: SummaryTone;
  let supportingContext = '';
  let explanationTarget: SummaryExplanationTarget = null;

  const peakCycleDay =
    result.peakIndex === null
      ? null
      : cycleDayForEntryIndex(entries, result.peakIndex);
  const peakCandidateCycleDay =
    result.peakCandidateIndex === null
      ? null
      : cycleDayForEntryIndex(entries, result.peakCandidateIndex);
  const focusShowsConfirmedPeak =
    interpretationSupport.status === 'summary_available' &&
    peakCycleDay !== null &&
    (phase === 'peak_confirmed' ||
      phase === 'p_plus_1' ||
      phase === 'p_plus_2' ||
      phase === 'p_plus_3' ||
      phase === 'post_peak');

  if (focusShowsConfirmedPeak) {
    const showsPostPeak = phase === 'p_plus_3' || phase === 'post_peak';
    headline = showsPostPeak
      ? 'Your chart shows a post-Peak pattern'
      : `Your chart marks Cycle Day ${peakCycleDay} as Peak Day`;
    statusLine =
      `You logged a Peak-type mucus sign on Cycle Day ${peakCycleDay}, followed by three days without another one. ` +
      `Well Within marked Cycle Day ${peakCycleDay} as Peak Day.`;
    supportingContext =
      'This reflects your chart; it does not confirm ovulation.';
    guidance =
      'Keep charting daily. This summary updates when your observations change.';
    summaryTone = showsPostPeak ? 'positive' : 'neutral';
    explanationTarget = 'peak_day';
  } else if (interpretationSupport.status === 'review_recommended') {
    headline = 'Your chart shows more than one possible Peak pattern';
    statusLine =
      'More than one Peak-type day is followed by the three-day pattern Well Within looks for.';
    supportingContext =
      'Well Within isn’t choosing one Peak Day from these observations.';
    guidance =
      'Keep charting; we’ll check again whenever you add or update an observation.';
    summaryTone = 'caution';
    explanationTarget = 'status_messages';
  } else if (interpretationSupport.status === 'blocked_by_missing') {
    headline = 'A few days need context';
    statusLine = missingSupportLine(interpretationSupport.reason);
    guidance =
      'Keep charting. If you remember an open day, you can add it; days marked not observed stay part of your record.';
    summaryTone = 'caution';
    explanationTarget = 'status_messages';
  } else if (focusMissing) {
    headline = 'This day was marked not observed';
    statusLine = 'There is no observation to interpret for this day.';
    guidance =
      'That’s okay—keep charting. You can add an observation later if you remember it.';
    summaryTone = 'caution';
    explanationTarget = 'status_messages';
  } else if (primaryClass === 'menstrual_flow') {
    headline = 'Menstrual flow recorded';
    statusLine = 'This day is recorded as menstrual flow.';
    guidance =
      'Mucus may still be saved, but Well Within does not interpret it as Peak-type while flow is selected.';
    summaryTone = 'neutral';
  } else if (primaryClass === 'spotting') {
    headline = 'Spotting recorded';
    statusLine = 'This day is recorded as light bleeding or spotting.';
    guidance =
      'Your mucus signs remain part of the day’s observation.';
    summaryTone = 'neutral';
  } else if (phase === 'fertile_unconfirmed_peak') {
    if (peakCandidateCycleDay !== null) {
      headline = 'Your chart shows a possible Peak Day';
      statusLine =
        `You logged a Peak-type mucus sign on Cycle Day ${peakCandidateCycleDay}. ` +
        'Well Within waits for three days without another Peak-type sign before marking a Peak Day.';
      guidance = 'Keep charting daily as the pattern develops.';
      explanationTarget = 'peak_day';
    } else {
      headline = 'Your chart shows mucus signs';
      statusLine =
        'Mucus signs are present, but the pattern does not show a Peak-type day yet.';
      guidance = 'Keep charting daily as the pattern develops.';
    }
    summaryTone = 'caution';
  } else {
    summaryTone = 'neutral';

    if (phase === 'fertile_open') {
      headline = 'Your chart shows mucus signs';
      statusLine =
        'Mucus signs are present, but the pattern does not show a Peak-type day yet.';
      guidance = 'Keep charting daily as the pattern develops.';
    } else {
      headline = 'Your pattern is still taking shape';
      statusLine = 'No mucus signs are recorded for this day.';
      guidance =
        'Keep charting daily. This card will update as your observations change.';
    }
  }

  let completeness: string;
  if (missingCount === 0) {
    completeness = 'No gaps in your chart this cycle';
  } else if (missingCount === 1) {
    completeness = '1 day still open in this cycle';
  } else {
    completeness = `${missingCount} days still open in this cycle`;
  }

  const interpretationLimited =
    interpretationSupport.status === 'blocked_by_missing' ||
    interpretationSupport.status === 'review_recommended' ||
    recentWindowMissing;
  const suppressBaseline =
    focusMissing ||
    primaryClass === 'menstrual_flow' ||
    interpretationSupport.status !== 'summary_available';
  const baselineContext = suppressBaseline
    ? null
    : buildBaselineContext(
        phase,
        cycleDay,
        baselineComparison,
      );

  const compactSupportField = resolveCompactSupportField(
    interpretationLimited,
    focusMissing,
    interpretationNotes,
    missingCount,
    baselineContext,
  );

  const resolvedCompactSupportField =
    interpretationSupport.status === 'blocked_by_missing' ||
    interpretationSupport.status === 'review_recommended'
      ? 'guidance'
      : compactSupportField;

  return {
    cycleDay,
    headline,
    statusLine,
    supportingContext,
    completeness,
    guidance,
    summaryTone,
    focusQualification,
    interpretationNotes,
    compactSupportField: resolvedCompactSupportField,
    baselineContext,
    interpretationStatus: interpretationSupport.status,
    interpretationReason: interpretationSupport.reason,
    explanationTarget,
  };
}
