import { recalculateCycle } from './recalc';
import { evaluateInterpretationSupport } from './interpretationSupport';
import {
  resolveCycleBoundaries,
  type CycleBoundaryAssessment,
} from './cycleBoundary';
import {
  addDaysIso,
  calendarDayNumber,
  calendarDatesInclusive,
  calendarDaysBetween,
  calendarSpanLength,
  cycleDayForEntryIndex,
} from './calendar';
import { CycleResult, DailyEntry, PhaseLabel } from './types';

export interface CycleSlice {
  cycleNumber: number;
  startDate: string;
  endDate: string;
  entries: DailyEntry[];
  result: CycleResult;
  length: number;
  peakDay: number | null;
  lutealPhase: number | null;
  status: 'complete' | 'in_progress' | 'no_peak';
  /** Evidence and first-release eligibility for this cycle's Cycle Day 1. */
  cycleBoundary: CycleBoundaryAssessment;
}

export interface CycleSummary {
  cyclesTracked: number;
  avgLength: number | null;
  shortestLength: number | null;
  longestLength: number | null;
  avgPeakDay: number | null;
  avgLutealPhase: number | null;
}

export interface CalendarAlignedCycleDay {
  date: string;
  cycleDay: number;
  entryIndex: number | null;
  entry: DailyEntry | null;
  mucusRank: number | null;
  phaseLabel: PhaseLabel;
}

/** True when a completed cycle is eligible for derived history aggregates. */
export function cycleHasSummaryAvailable(cycle: CycleSlice): boolean {
  if (cycle.status !== 'complete') return false;
  const hasFullEngineResult =
    Array.isArray(cycle.result.mucusRanks) &&
    Array.isArray(cycle.result.phaseLabels) &&
    typeof cycle.result.peakConfirmed === 'boolean';
  // Keeps manually constructed/legacy CycleSlice consumers deterministic while
  // production slices always take the support-state path below.
  if (!hasFullEngineResult) return true;
  return evaluateInterpretationSupport(cycle.entries, cycle.result).status === 'summary_available';
}

/** Expands a cycle to one slot per calendar date so gaps remain visible. */
export function buildCalendarAlignedCycleDays(
  cycle: CycleSlice,
): CalendarAlignedCycleDay[] {
  const dates = calendarDatesInclusive(cycle.startDate, cycle.endDate);
  if (dates.length === 0) {
    return cycle.entries.map((entry, entryIndex) => ({
      date: entry.date ?? '',
      cycleDay: entryIndex + 1,
      entryIndex,
      entry,
      mucusRank: cycle.result.mucusRanks[entryIndex] ?? null,
      phaseLabel: cycle.result.phaseLabels[entryIndex] ?? 'missing',
    }));
  }

  const indexByDate = new Map<string, number>();
  cycle.entries.forEach((entry, index) => {
    if (entry.date) indexByDate.set(entry.date, index);
  });

  return dates.map((date, cycleDayIndex) => {
    const entryIndex = indexByDate.get(date) ?? null;
    if (entryIndex === null) {
      return {
        date,
        cycleDay: cycleDayIndex + 1,
        entryIndex: null,
        entry: null,
        mucusRank: null,
        phaseLabel: 'missing' as const,
      };
    }
    return {
      date,
      cycleDay: cycleDayIndex + 1,
      entryIndex,
      entry: cycle.entries[entryIndex],
      mucusRank: cycle.result.mucusRanks[entryIndex] ?? null,
      phaseLabel: cycle.result.phaseLabels[entryIndex] ?? 'missing',
    };
  });
}

/**
 * Splits a sorted array of DailyEntry into individual cycles.
 * A new legacy cycle starts on the first H/M day not preceded by H/M.
 * An explicit confirmed true-flow day can establish an earlier light-flow
 * boundary and suppress a later H/M reset in that same flow run.
 *
 * Unmarked leading days preserve their legacy grouping; boundary eligibility
 * separately records whether an exact Cycle Day 1 is supported.
 */
export function splitIntoCycles(entries: DailyEntry[]): CycleSlice[] {
  if (entries.length === 0) return [];

  const resolution = resolveCycleBoundaries(entries);
  const boundaries = resolution.groups.map((group) => group.groupStartIndex);

  const slices: CycleSlice[] = [];

  for (let b = 0; b < boundaries.length; b++) {
    const start = boundaries[b];
    const end = b + 1 < boundaries.length ? boundaries[b + 1] : entries.length;
    const cycleEntries = entries.slice(start, end);

    if (cycleEntries.length === 0) continue;

    const resolvedBoundary = resolution.groups[b].boundary;
    const localBoundaryIndex = Math.max(0, resolvedBoundary.index - start);
    const result = recalculateCycle(cycleEntries);
    const isLastCycle = b === boundaries.length - 1;
    const startDate = resolvedBoundary.date ?? cycleEntries[0].date ?? '';
    const peakDate = result.peakIndex !== null
      ? cycleEntries[result.peakIndex]?.date ?? ''
      : '';
    const anchoredPeakDay = peakDate
      ? calendarDayNumber(startDate, peakDate)
      : null;
    const peakDay = result.peakIndex !== null
      ? anchoredPeakDay ?? cycleDayForEntryIndex(cycleEntries, result.peakIndex)
      : null;
    const lastLoggedDate = cycleEntries[cycleEntries.length - 1].date ?? '';
    const nextGroup = !isLastCycle ? resolution.groups[b + 1] : null;
    const nextStartDate = nextGroup
      ? nextGroup.boundary.date ?? entries[nextGroup.groupStartIndex]?.date ?? ''
      : '';
    const canUseNextBoundary =
      nextStartDate.length > 0 &&
      calendarDaysBetween(startDate, nextStartDate) !== null;
    const endDate = canUseNextBoundary
      ? addDaysIso(nextStartDate, -1)
      : lastLoggedDate;
    const calendarLength = calendarSpanLength(startDate, endDate);
    const length = calendarLength !== null ? calendarLength : cycleEntries.length;

    let lutealPhase: number | null = null;
    if (result.peakIndex !== null && peakDay !== null && !isLastCycle) {
      const daysToNextCycle = calendarDaysBetween(peakDate, nextStartDate);
      lutealPhase = daysToNextCycle !== null
        ? Math.max(0, daysToNextCycle - 1)
        : Math.max(0, length - peakDay);
    }

    let status: CycleSlice['status'];
    if (result.peakIndex !== null && !isLastCycle) {
      status = 'complete';
    } else if (result.peakIndex !== null) {
      status = 'in_progress';
    } else {
      status = 'no_peak';
    }

    slices.push({
      cycleNumber: b + 1,
      startDate,
      endDate,
      entries: cycleEntries,
      result,
      length,
      peakDay,
      lutealPhase,
      status,
      cycleBoundary: {
        ...resolvedBoundary,
        index: localBoundaryIndex,
      },
    });
  }

  return slices;
}

/**
 * Computes aggregate summary statistics across all tracked cycles.
 */
export function computeCycleSummary(cycles: CycleSlice[]): CycleSummary {
  if (cycles.length === 0) {
    return {
      cyclesTracked: 0,
      avgLength: null,
      shortestLength: null,
      longestLength: null,
      avgPeakDay: null,
      avgLutealPhase: null,
    };
  }

  const completedCycles = cycles.filter(cycleHasSummaryAvailable);
  const lengths = completedCycles.map((c) => c.length);
  const peakDays = completedCycles.filter((c) => c.peakDay !== null).map((c) => c.peakDay!);
  const lutealPhases = completedCycles.filter((c) => c.lutealPhase !== null).map((c) => c.lutealPhase!);

  return {
    cyclesTracked: completedCycles.length,
    avgLength: lengths.length > 0 ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) : null,
    shortestLength: lengths.length > 0 ? Math.min(...lengths) : null,
    longestLength: lengths.length > 0 ? Math.max(...lengths) : null,
    avgPeakDay: peakDays.length > 0 ? Math.round(peakDays.reduce((a, b) => a + b, 0) / peakDays.length) : null,
    avgLutealPhase: lutealPhases.length > 0 ? Math.round(lutealPhases.reduce((a, b) => a + b, 0) / lutealPhases.length) : null,
  };
}

/**
 * Generates human-readable insight strings from cycle history.
 * Requires at least 2 completed cycles for meaningful output.
 */
export function generateInsights(cycles: CycleSlice[]): string[] {
  const completed = cycles.filter(cycleHasSummaryAvailable);
  if (completed.length < 2) return [];

  const insights: string[] = [];

  const peakDays = completed.filter((c) => c.peakDay !== null).map((c) => c.peakDay!);
  if (peakDays.length >= 2) {
    const minP = Math.min(...peakDays);
    const maxP = Math.max(...peakDays);
    insights.push(
      minP === maxP
        ? `Peak day has consistently occurred on cycle day ${minP}.`
        : `Peak day has ranged from cycle day ${minP} to ${maxP}.`
    );

  }

  const lutealPhases = completed.filter((c) => c.lutealPhase !== null).map((c) => c.lutealPhase!);
  if (lutealPhases.length >= 2) {
    const avg = Math.round(lutealPhases.reduce((a, b) => a + b, 0) / lutealPhases.length);
    insights.push(`Average luteal phase is ${avg} days.`);
  }

  const lengths = completed.map((c) => c.length);
  if (lengths.length >= 2) {
    const range = Math.max(...lengths) - Math.min(...lengths);
    if (range <= 3) {
      insights.push('Your cycles have been very consistent.');
    } else if (range <= 7) {
      insights.push('Your cycles show moderate variation.');
    } else {
      insights.push('Your cycles show significant variation in length.');
    }
  }

  return insights;
}
