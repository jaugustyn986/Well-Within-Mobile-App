import { DailyEntry, BleedingClass, BrownBleedingContext } from './types';

/**
 * Per-day bleeding classification for the current cycle slice (standard rules).
 */
export function deriveBleedingMetadata(
  entries: DailyEntry[],
  cycleStartIndex: number,
  peakConfirmed: boolean,
  fertileEndIndex: number | null,
): {
  bleedingClassByDay: BleedingClass[];
  brownBleedingContextByDay: (BrownBleedingContext | null)[];
} {
  const n = entries.length;
  const bleedingClassByDay: BleedingClass[] = new Array(n).fill('none');
  const brownBleedingContextByDay: (BrownBleedingContext | null)[] = new Array(n).fill(null);

  for (let i = 0; i < n; i += 1) {
    const b = entries[i]?.bleeding ?? 'none';

    if (b === 'brown') {
      bleedingClassByDay[i] = 'brown_discharge';
      let ctx: BrownBleedingContext = 'mid_cycle';
      if (cycleStartIndex > 0 && i === cycleStartIndex - 1) {
        ctx = 'pre_flow';
      } else if (peakConfirmed && fertileEndIndex !== null && i > fertileEndIndex) {
        ctx = 'post_peak';
      }
      brownBleedingContextByDay[i] = ctx;
      continue;
    }

    if (i < cycleStartIndex) continue;

    if (b === 'heavy' || b === 'moderate') {
      bleedingClassByDay[i] =
        i === cycleStartIndex ? 'cycle_start_flow' : 'continuing_menses';
      continue;
    }

    if (b === 'light') {
      bleedingClassByDay[i] = 'continuing_menses';
      continue;
    }

    if (b === 'spotting') {
      bleedingClassByDay[i] =
        peakConfirmed && fertileEndIndex !== null && i > fertileEndIndex
          ? 'post_peak_spotting'
          : 'spotting';
    }
  }

  return { bleedingClassByDay, brownBleedingContextByDay };
}
