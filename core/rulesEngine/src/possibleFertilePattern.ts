import {
  addDaysIso,
  calendarDayNumber,
  compareIsoDate,
  cycleDayForEntryIndex,
} from './calendar';
import {
  evaluateInterpretationSupport,
  type InterpretationSupportReason,
  type InterpretationSupportStatus,
} from './interpretationSupport';
import type { CycleBoundaryAssessment } from './cycleBoundary';
import type { CycleSlice } from './multiCycle';
import type { CycleResult, DailyEntry } from './types';

export const POSSIBLE_FERTILE_PATTERN_LIMITATION =
  'This chart-based estimate does not confirm ovulation, identify safe or infertile days, predict pregnancy, or provide pregnancy-avoidance guidance. Special contexts—including postpartum or breastfeeding, perimenopause, recent hormones, relevant medication effects, and persistent discharge—are not supported or accounted for in this first release.';

export const POSSIBLE_FERTILE_PATTERN_HISTORY_MINIMUM = 3;

export type PossibleFertilePatternState =
  | 'hidden'
  | 'developing'
  | 'bounded'
  | 'withheld';

export type PossibleFertilePatternEligibility =
  | 'eligible'
  | 'ineligible'
  | 'unknown';

export interface PossibleFertilePatternEligibilityOptions {
  /** Eligibility for contexts not represented by daily rows (for example postpartum). */
  contextEligibility?: PossibleFertilePatternEligibility;
  /** Eligibility of the clinically accepted Cycle Day 1 boundary. */
  cycleBoundaryEligibility?: PossibleFertilePatternEligibility;
}

/**
 * First-release policy for the accepted standard-context product assumption.
 * Special contexts remain expressly unsupported by the adjacent limitation;
 * the raw presentation builder continues to fail closed when called directly.
 */
export function buildFirstReleasePossibleFertilePatternEligibility(
  cycleBoundary: Pick<CycleBoundaryAssessment, 'eligibility'> | null | undefined,
): Required<PossibleFertilePatternEligibilityOptions> {
  return {
    contextEligibility: 'eligible',
    cycleBoundaryEligibility: cycleBoundary?.eligibility ?? 'unknown',
  };
}

export type PossibleFertilePatternReason =
  | 'no_mucus_signs'
  | 'pattern_developing'
  | 'eligible_retrospective_pattern'
  | 'context_ineligible'
  | 'context_eligibility_unknown'
  | 'cycle_boundary_ineligible'
  | 'cycle_boundary_eligibility_unknown'
  | InterpretationSupportReason;

export interface PossibleFertilePatternMarker {
  entryIndex: number;
  date: string | null;
  cycleDay: number;
}

export interface PossibleFertilePatternLimit {
  reason: PossibleFertilePatternReason;
  date: string | null;
  cycleDay: number | null;
  detail: string;
}

/**
 * One engine-owned presentation contract for Calendar, Cycle Detail, export,
 * accessibility, and Help. Observed sign arrays stay separate from derived
 * boundaries so a surface cannot mistake user facts for a bounded conclusion.
 */
export interface PossibleFertilePatternPresentation {
  state: PossibleFertilePatternState;
  heading: string | null;
  body: string | null;
  limitation: string | null;
  reason: PossibleFertilePatternReason;
  interpretationStatus: InterpretationSupportStatus;
  interpretationReason: InterpretationSupportReason;
  contextEligibility: PossibleFertilePatternEligibility;
  cycleBoundaryEligibility: PossibleFertilePatternEligibility;
  observedMucusSigns: PossibleFertilePatternMarker[];
  observedPeakTypeSigns: PossibleFertilePatternMarker[];
  start: PossibleFertilePatternMarker | null;
  peak: PossibleFertilePatternMarker | null;
  pPlus1: PossibleFertilePatternMarker | null;
  pPlus2: PossibleFertilePatternMarker | null;
  pPlus3: PossibleFertilePatternMarker | null;
  limit: PossibleFertilePatternLimit | null;
}

export type PossibleFertilePatternHistoryState =
  | 'available'
  | 'insufficient_eligible_cycles';

export interface PossibleFertilePatternCycleDayRange {
  minimum: number;
  maximum: number;
}

export interface PossibleFertilePatternHistoryPresentation {
  state: PossibleFertilePatternHistoryState;
  heading: string;
  body: string;
  /** All cycles whose cycle status is complete, regardless of pattern eligibility. */
  completedCycleCount: number;
  completedCycleNumbers: number[];
  /** Completed cycles that also have a bounded pattern available for comparison. */
  sampleSize: number;
  minimumSampleSize: number;
  eligibleCycleNumbers: number[];
  startCycleDays: PossibleFertilePatternCycleDayRange | null;
  peakCycleDays: PossibleFertilePatternCycleDayRange | null;
}

export interface BuildPossibleFertilePatternHistoryOptions {
  /**
   * Eligibility is explicit per cycle. Missing entries default to unknown and
   * therefore never contribute to a bounded history range.
   */
  eligibilityByCycleNumber?: Record<number, PossibleFertilePatternEligibilityOptions>;
}

function cycleStartIndexFromResult(result: CycleResult): number {
  const index = result.phaseLabels.findIndex((phase) => phase !== 'previous_cycle');
  return index >= 0 ? index : 0;
}

function markerAtIndex(
  entries: DailyEntry[],
  index: number | null,
  cycleStartIndex = 0,
): PossibleFertilePatternMarker | null {
  if (index === null || index < 0 || index >= entries.length) return null;
  return {
    entryIndex: index,
    date: entries[index]?.date ?? null,
    cycleDay: cycleDayForEntryIndex(
      entries.slice(cycleStartIndex),
      index - cycleStartIndex,
    ),
  };
}

function observedMarkers(
  entries: DailyEntry[],
  result: CycleResult,
  minimumRank: number,
): PossibleFertilePatternMarker[] {
  const startIndex = cycleStartIndexFromResult(result);
  const markers: PossibleFertilePatternMarker[] = [];
  for (let i = startIndex; i < entries.length; i += 1) {
    const rank = result.mucusRanks[i];
    if (entries[i]?.missing || rank === null || rank < minimumRank) continue;
    const marker = markerAtIndex(entries, i, startIndex);
    if (marker) markers.push(marker);
  }
  return markers;
}

function indexByDate(entries: DailyEntry[]): Map<string, number> {
  const map = new Map<string, number>();
  entries.forEach((entry, index) => {
    if (entry.date) map.set(entry.date, index);
  });
  return map;
}

function firstBleedingMucusIndex(entries: DailyEntry[], result: CycleResult): number | null {
  const startIndex = cycleStartIndexFromResult(result);
  for (let i = startIndex; i < entries.length; i += 1) {
    const bleeding = entries[i]?.bleeding;
    const rank = result.mucusRanks[i];
    if (
      !entries[i]?.missing &&
      (bleeding === 'light' || bleeding === 'spotting') &&
      rank !== null &&
      rank >= 1
    ) {
      return i;
    }
  }
  return null;
}

function firstMissingConfirmationDate(
  entries: DailyEntry[],
  result: CycleResult,
  absentOnly: boolean,
): string | null {
  if (result.peakCandidateIndex === null) return null;
  const candidateDate = entries[result.peakCandidateIndex]?.date;
  if (!candidateDate) return null;
  const dates = indexByDate(entries);
  for (let offset = 1; offset <= 3; offset += 1) {
    const date = addDaysIso(candidateDate, offset);
    const index = dates.get(date);
    if (absentOnly && index === undefined) return date;
    if (!absentOnly && index !== undefined && entries[index]?.missing) return date;
  }
  return null;
}

function firstEarlierBoundaryLimitDate(
  entries: DailyEntry[],
  result: CycleResult,
): string | null {
  if (result.fertileStartIndex === null) return null;
  const startIndex = cycleStartIndexFromResult(result);
  const cycleStartDate = entries[startIndex]?.date;
  const mucusStartDate = entries[result.fertileStartIndex]?.date;
  if (!cycleStartDate || !mucusStartDate) return null;

  const dates = indexByDate(entries);
  let date = cycleStartDate;
  while (compareIsoDate(date, mucusStartDate) < 0) {
    const index = dates.get(date);
    if (index === undefined || entries[index]?.missing) return date;
    date = addDaysIso(date, 1);
  }
  return null;
}

function cycleDayForDate(
  entries: DailyEntry[],
  result: CycleResult,
  date: string | null,
): number | null {
  if (!date) return null;
  const cycleStartIndex = cycleStartIndexFromResult(result);
  const cycleStartDate = entries[cycleStartIndex]?.date;
  return cycleStartDate ? calendarDayNumber(cycleStartDate, date) : null;
}

function limitDetail(
  reason: PossibleFertilePatternReason,
  date: string | null,
): string {
  const datePrefix = date ? `${date}: ` : '';
  switch (reason) {
    case 'calendar_gap':
      return `${datePrefix}no observation is recorded during the three-day Peak count.`;
    case 'not_observed':
      return `${datePrefix}this day is marked not observed during the three-day Peak count.`;
    case 'earlier_gap_limits_boundary':
      return `${datePrefix}an open or not-observed day limits the opening boundary.`;
    case 'bleeding_mucus_ambiguity':
      return `${datePrefix}mucus was recorded with light bleeding or spotting, which this release does not use to bound a possible pattern.`;
    case 'invalid_or_unresolved_dates':
      return 'One or more dates are missing, invalid, duplicated, or out of order.';
    case 'context_ineligible':
      return 'The recorded chart context is outside the accepted simple-pattern scope.';
    case 'context_eligibility_unknown':
      return 'The chart does not contain enough context to establish simple-pattern eligibility.';
    case 'cycle_boundary_ineligible':
      return 'The cycle boundary is outside the accepted first-release scope.';
    case 'cycle_boundary_eligibility_unknown':
      return 'The accepted Cycle Day 1 boundary has not been established for this chart.';
    default:
      return 'An unresolved pattern or chart context limits the boundary Well Within can show.';
  }
}

function limitForReason(
  entries: DailyEntry[],
  result: CycleResult,
  reason: PossibleFertilePatternReason,
): PossibleFertilePatternLimit {
  let date: string | null = null;
  if (reason === 'calendar_gap') {
    date = firstMissingConfirmationDate(entries, result, true);
  } else if (reason === 'not_observed') {
    date = firstMissingConfirmationDate(entries, result, false);
  } else if (reason === 'earlier_gap_limits_boundary') {
    date = firstEarlierBoundaryLimitDate(entries, result);
  } else if (reason === 'bleeding_mucus_ambiguity') {
    date = markerAtIndex(
      entries,
      firstBleedingMucusIndex(entries, result),
      cycleStartIndexFromResult(result),
    )?.date ?? null;
  }
  return {
    reason,
    date,
    cycleDay: cycleDayForDate(entries, result, date),
    detail: limitDetail(reason, date),
  };
}

function withheldPresentation(
  entries: DailyEntry[],
  result: CycleResult,
  observedMucusSigns: PossibleFertilePatternMarker[],
  observedPeakTypeSigns: PossibleFertilePatternMarker[],
  interpretationStatus: InterpretationSupportStatus,
  interpretationReason: InterpretationSupportReason,
  contextEligibility: PossibleFertilePatternEligibility,
  cycleBoundaryEligibility: PossibleFertilePatternEligibility,
  reason: PossibleFertilePatternReason,
): PossibleFertilePatternPresentation {
  const copy = (() => {
    if (reason === 'bleeding_mucus_ambiguity') {
      return {
        heading: 'Mucus and light bleeding were recorded together',
        body:
          'Both observations remain on your chart. Because they were recorded together, Well Within leaves the possible-pattern boundary open for review.',
      };
    }
    return {
      heading: 'A possible pattern cannot be bounded from this chart',
      body:
        'Your observations remain visible. An open day, unresolved pattern, or chart context limits the boundary Well Within can show.',
    };
  })();

  return {
    state: 'withheld',
    heading: copy.heading,
    body: copy.body,
    limitation: null,
    reason,
    interpretationStatus,
    interpretationReason,
    contextEligibility,
    cycleBoundaryEligibility,
    observedMucusSigns,
    observedPeakTypeSigns,
    start: null,
    peak: null,
    pPlus1: null,
    pPlus2: null,
    pPlus3: null,
    limit: limitForReason(entries, result, reason),
  };
}

/**
 * Builds the Phase 1C Possible fertile pattern model. Eligibility defaults to
 * unknown: callers must explicitly establish both context and cycle-boundary
 * eligibility before exact dates can be emitted.
 */
export function buildPossibleFertilePatternPresentation(
  entries: DailyEntry[],
  result: CycleResult,
  options: PossibleFertilePatternEligibilityOptions = {},
): PossibleFertilePatternPresentation {
  const support = evaluateInterpretationSupport(entries, result);
  const contextEligibility = options.contextEligibility ?? 'unknown';
  const cycleBoundaryEligibility = options.cycleBoundaryEligibility ?? 'unknown';
  const observedMucusSigns = observedMarkers(entries, result, 1);
  const observedPeakTypeSigns = observedMarkers(entries, result, 3);

  if (observedMucusSigns.length === 0) {
    return {
      state: 'hidden',
      heading: null,
      body: null,
      limitation: null,
      reason: 'no_mucus_signs',
      interpretationStatus: support.status,
      interpretationReason: support.reason,
      contextEligibility,
      cycleBoundaryEligibility,
      observedMucusSigns,
      observedPeakTypeSigns,
      start: null,
      peak: null,
      pPlus1: null,
      pPlus2: null,
      pPlus3: null,
      limit: null,
    };
  }

  if (contextEligibility === 'ineligible') {
    return withheldPresentation(
      entries,
      result,
      observedMucusSigns,
      observedPeakTypeSigns,
      support.status,
      support.reason,
      contextEligibility,
      cycleBoundaryEligibility,
      'context_ineligible',
    );
  }

  if (cycleBoundaryEligibility === 'ineligible') {
    return withheldPresentation(
      entries,
      result,
      observedMucusSigns,
      observedPeakTypeSigns,
      support.status,
      support.reason,
      contextEligibility,
      cycleBoundaryEligibility,
      'cycle_boundary_ineligible',
    );
  }

  if (support.status === 'blocked_by_missing' || support.status === 'review_recommended') {
    return withheldPresentation(
      entries,
      result,
      observedMucusSigns,
      observedPeakTypeSigns,
      support.status,
      support.reason,
      contextEligibility,
      cycleBoundaryEligibility,
      support.reason,
    );
  }

  if (support.status === 'forming') {
    return {
      state: 'developing',
      heading: 'Possible fertile pattern may be developing',
      body:
        support.reason === 'later_peak_type_reopens_pattern'
          ? 'A later Peak-type sign was recorded after the earlier P+3 count. Keep charting while the new three-day follow-up develops.'
          : 'Mucus signs are present. Keep charting as the pattern develops.',
      limitation: null,
      reason: support.reason === 'later_peak_type_reopens_pattern'
        ? support.reason
        : 'pattern_developing',
      interpretationStatus: support.status,
      interpretationReason: support.reason,
      contextEligibility,
      cycleBoundaryEligibility,
      observedMucusSigns,
      observedPeakTypeSigns,
      start: null,
      peak: null,
      pPlus1: null,
      pPlus2: null,
      pPlus3: null,
      limit: null,
    };
  }

  if (contextEligibility === 'unknown') {
    return withheldPresentation(
      entries,
      result,
      observedMucusSigns,
      observedPeakTypeSigns,
      support.status,
      support.reason,
      contextEligibility,
      cycleBoundaryEligibility,
      'context_eligibility_unknown',
    );
  }

  if (cycleBoundaryEligibility === 'unknown') {
    return withheldPresentation(
      entries,
      result,
      observedMucusSigns,
      observedPeakTypeSigns,
      support.status,
      support.reason,
      contextEligibility,
      cycleBoundaryEligibility,
      'cycle_boundary_eligibility_unknown',
    );
  }

  const cycleStartIndex = cycleStartIndexFromResult(result);
  const start = markerAtIndex(entries, result.fertileStartIndex, cycleStartIndex);
  const peak = markerAtIndex(entries, result.peakIndex, cycleStartIndex);
  const pPlus3 = markerAtIndex(entries, result.fertileEndIndex, cycleStartIndex);
  const dates = indexByDate(entries);
  const peakDate = peak?.date ?? null;
  const pPlus1 = peakDate
    ? markerAtIndex(
        entries,
        dates.get(addDaysIso(peakDate, 1)) ?? null,
        cycleStartIndex,
      )
    : null;
  const pPlus2 = peakDate
    ? markerAtIndex(
        entries,
        dates.get(addDaysIso(peakDate, 2)) ?? null,
        cycleStartIndex,
      )
    : null;

  if (!start?.date || !peak?.date || !pPlus1?.date || !pPlus2?.date || !pPlus3?.date) {
    return withheldPresentation(
      entries,
      result,
      observedMucusSigns,
      observedPeakTypeSigns,
      support.status,
      support.reason,
      contextEligibility,
      cycleBoundaryEligibility,
      'invalid_or_unresolved_dates',
    );
  }

  return {
    state: 'bounded',
    heading: 'Possible fertile pattern',
    body:
      `Based on your logged observations, a possible pattern is shown from ${start.date} ` +
      `through P+3 (${pPlus3.date}).`,
    limitation: POSSIBLE_FERTILE_PATTERN_LIMITATION,
    reason: 'eligible_retrospective_pattern',
    interpretationStatus: support.status,
    interpretationReason: support.reason,
    contextEligibility,
    cycleBoundaryEligibility,
    observedMucusSigns,
    observedPeakTypeSigns,
    start,
    peak,
    pPlus1,
    pPlus2,
    pPlus3,
    limit: null,
  };
}

function range(values: number[]): PossibleFertilePatternCycleDayRange | null {
  if (values.length === 0) return null;
  return {
    minimum: Math.min(...values),
    maximum: Math.max(...values),
  };
}

function cycleDayPhrase(
  label: string,
  value: PossibleFertilePatternCycleDayRange,
): string {
  return value.minimum === value.maximum
    ? `${label} Cycle Day ${value.minimum}`
    : `${label} Cycle Days ${value.minimum}–${value.maximum}`;
}

/**
 * Builds retrospective raw ranges only. It emits no averages, normative labels,
 * active-cycle placement, or future prediction.
 */
export function buildPossibleFertilePatternHistoryPresentation(
  cycles: CycleSlice[],
  options: BuildPossibleFertilePatternHistoryOptions = {},
): PossibleFertilePatternHistoryPresentation {
  const completedCycles = cycles.filter((cycle) => cycle.status === 'complete');
  const completedCycleNumbers = completedCycles.map((cycle) => cycle.cycleNumber);
  const eligible = cycles.flatMap((cycle) => {
    if (cycle.status !== 'complete') return [];
    const presentation = buildPossibleFertilePatternPresentation(
      cycle.entries,
      cycle.result,
      options.eligibilityByCycleNumber?.[cycle.cycleNumber],
    );
    if (presentation.state !== 'bounded' || !presentation.start || !presentation.peak) {
      return [];
    }
    return [{
      cycleNumber: cycle.cycleNumber,
      startCycleDay: presentation.start.cycleDay,
      peakCycleDay: presentation.peak.cycleDay,
    }];
  });

  const sampleSize = eligible.length;
  const startCycleDays = range(eligible.map((item) => item.startCycleDay));
  const peakCycleDays = range(eligible.map((item) => item.peakCycleDay));
  const eligibleCycleNumbers = eligible.map((item) => item.cycleNumber);

  if (
    sampleSize < POSSIBLE_FERTILE_PATTERN_HISTORY_MINIMUM ||
    !startCycleDays ||
    !peakCycleDays
  ) {
    return {
      state: 'insufficient_eligible_cycles',
      heading: 'Possible fertile pattern history',
      body:
        `At least ${POSSIBLE_FERTILE_PATTERN_HISTORY_MINIMUM} eligible completed cycles are needed ` +
        'before Well Within shows retrospective ranges.',
      completedCycleCount: completedCycles.length,
      completedCycleNumbers,
      sampleSize,
      minimumSampleSize: POSSIBLE_FERTILE_PATTERN_HISTORY_MINIMUM,
      eligibleCycleNumbers,
      startCycleDays,
      peakCycleDays,
    };
  }

  return {
    state: 'available',
    heading: 'Possible fertile pattern history',
    body:
      `Across ${sampleSize} eligible completed cycles, the first recorded mucus sign occurred on ` +
      `${cycleDayPhrase('', startCycleDays).trim()}, and the Peak marker occurred on ` +
      `${cycleDayPhrase('', peakCycleDays).trim()}.`,
    completedCycleCount: completedCycles.length,
    completedCycleNumbers,
    sampleSize,
    minimumSampleSize: POSSIBLE_FERTILE_PATTERN_HISTORY_MINIMUM,
    eligibleCycleNumbers,
    startCycleDays,
    peakCycleDays,
  };
}
