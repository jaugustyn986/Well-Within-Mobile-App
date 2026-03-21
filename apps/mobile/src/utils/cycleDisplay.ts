import { CycleSlice } from 'core-rules-engine';

export function maxCycleNumber(cycles: CycleSlice[]): number {
  if (cycles.length === 0) return 0;
  return Math.max(...cycles.map((c) => c.cycleNumber));
}

/** True when this slice is the chronologically latest (active) cycle. */
export function isOngoingCycle(cycle: CycleSlice, allCycles: CycleSlice[]): boolean {
  return cycle.cycleNumber === maxCycleNumber(allCycles);
}

function formatShort(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Primary line: date range or start-only for ongoing cycle.
 * Secondary: "Cycle N" — same rules for list cards and detail header.
 */
export function formatCyclePrimarySecondary(
  cycle: CycleSlice,
  allCycles: CycleSlice[],
): { primary: string; secondary: string } {
  const secondary = `Cycle ${cycle.cycleNumber}`;
  if (isOngoingCycle(cycle, allCycles)) {
    return { primary: formatShort(cycle.startDate), secondary };
  }
  const start = formatShort(cycle.startDate);
  const end = formatShort(cycle.endDate);
  return { primary: `${start} – ${end}`, secondary };
}
