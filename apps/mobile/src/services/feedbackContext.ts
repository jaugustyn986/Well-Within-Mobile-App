import {
  type CycleSlice,
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

/** Calendar-day difference: later − earlier (non-negative when later >= earlier). */
function calendarDaysFromTo(earlierIso: string, laterIso: string): number {
  const [ey, em, ed] = earlierIso.split('-').map(Number);
  const [ly, lm, ld] = laterIso.split('-').map(Number);
  const a = new Date(ey, em - 1, ed);
  const b = new Date(ly, lm - 1, ld);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
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
    days_since_last_entry = calendarDaysFromTo(lastEntry, calendarAsOfDate);
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
