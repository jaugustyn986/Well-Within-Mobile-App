import {
  type CycleSlice,
  calendarDaysBetween,
  compareIsoDate,
  computeCycleSummary,
  countCompletenessMissing,
} from 'core-rules-engine';

export type FeedbackCycleContext = {
  cycle_length: number | null;
  peak_detected: boolean | null;
  current_phase: string | null;
  missing_days_count: number | null;
  cycles_tracked: number | null;
  days_since_last_entry: number | null;
};

function lastEntryDateAcrossCycles(cycles: CycleSlice[]): string | null {
  let max: string | null = null;
  for (const c of cycles) {
    for (const e of c.entries) {
      const d = e.date;
      if (!d) continue;
      if (!max || compareIsoDate(d, max) > 0) max = d;
    }
  }
  return max;
}

/**
 * Derives limited cycle metadata from in-memory engine state only.
 * Does not read storage or network.
 */
export function buildFeedbackCycleContext(
  cycles: CycleSlice[],
  calendarAsOfDate: string,
): FeedbackCycleContext {
  if (cycles.length === 0) {
    return {
      cycle_length: null,
      peak_detected: null,
      current_phase: null,
      missing_days_count: null,
      cycles_tracked: 0,
      days_since_last_entry: null,
    };
  }

  const summary = computeCycleSummary(cycles);
  const slice = cycles[cycles.length - 1];
  const todayIdx = slice.entries.findIndex((e) => e.date === calendarAsOfDate);
  const focusIndex =
    todayIdx >= 0 ? todayIdx : Math.max(0, slice.entries.length - 1);
  const phase = slice.result.phaseLabels[focusIndex] ?? null;

  const missing_days_count = countCompletenessMissing({
    entries: slice.entries,
    status: slice.status,
    calendarAsOfDate,
  });

  const lastEntry = lastEntryDateAcrossCycles(cycles);
  let days_since_last_entry: number | null = null;
  if (lastEntry && compareIsoDate(lastEntry, calendarAsOfDate) <= 0) {
    days_since_last_entry = calendarDaysBetween(lastEntry, calendarAsOfDate);
  }

  return {
    cycle_length: slice.length,
    peak_detected: slice.peakDay !== null,
    current_phase: phase,
    missing_days_count,
    cycles_tracked: summary.cyclesTracked,
    days_since_last_entry,
  };
}
