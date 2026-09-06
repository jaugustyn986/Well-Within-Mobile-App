import { calendarDaysBetween } from './calendar';
import type { DailyEntry } from './types';

export type CycleBoundaryEligibility = 'eligible' | 'ineligible' | 'unknown';

export type CycleBoundarySource =
  | 'confirmed_true_flow'
  | 'inferred_heavy_moderate'
  | 'legacy_group_start';

export type CycleBoundaryReason =
  | 'confirmed_true_flow_start'
  | 'unambiguous_heavy_moderate_start'
  | 'ambiguous_leading_light_flow'
  | 'uncertain_start_marker'
  | 'explicit_not_start'
  | 'missing_preceding_date'
  | 'invalid_confirmed_start_marker'
  | 'duplicate_confirmed_start_marker'
  | 'invalid_or_unresolved_dates'
  | 'no_resolved_flow_start';

/**
 * Boundary evidence for one legacy cycle group. `index` is the best internal
 * start candidate; `date` is emitted only when that candidate is exact enough
 * for first-release presentation eligibility.
 */
export interface CycleBoundaryAssessment {
  index: number;
  date: string | null;
  source: CycleBoundarySource;
  eligibility: CycleBoundaryEligibility;
  reason: CycleBoundaryReason;
}

export interface ResolvedCycleGroup {
  /** Preserves the existing grouping behavior for unmarked legacy entries. */
  groupStartIndex: number;
  boundary: CycleBoundaryAssessment;
}

export interface CycleBoundaryResolution {
  groups: ResolvedCycleGroup[];
  currentCycleStartIndex: number;
  currentCycleBoundary: CycleBoundaryAssessment | null;
  datesStrictlyIncreasing: boolean;
}

function isHeavyOrModerate(entry: DailyEntry | undefined): boolean {
  return entry?.bleeding === 'heavy' || entry?.bleeding === 'moderate';
}

function isTrueFlow(entry: DailyEntry | undefined): boolean {
  return (
    entry?.bleeding === 'light' ||
    entry?.bleeding === 'moderate' ||
    entry?.bleeding === 'heavy'
  );
}

function hasValidDate(entry: DailyEntry | undefined): entry is DailyEntry & { date: string } {
  return Boolean(
    entry?.date && calendarDaysBetween(entry.date, entry.date) === 0,
  );
}

function datesAreStrictlyIncreasing(entries: readonly DailyEntry[]): boolean {
  for (let i = 0; i < entries.length; i += 1) {
    if (!hasValidDate(entries[i])) return false;
    if (i === 0) continue;
    const difference = calendarDaysBetween(entries[i - 1].date!, entries[i].date!);
    if (difference === null || difference <= 0) return false;
  }
  return true;
}

function isConsecutive(entries: readonly DailyEntry[], earlier: number, later: number): boolean {
  const earlierDate = entries[earlier]?.date;
  const laterDate = entries[later]?.date;
  return Boolean(
    earlierDate &&
    laterDate &&
    calendarDaysBetween(earlierDate, laterDate) === 1,
  );
}

function legacyStarts(entries: readonly DailyEntry[]): number[] {
  const starts = [0];
  for (let i = 1; i < entries.length; i += 1) {
    if (isHeavyOrModerate(entries[i]) && !isHeavyOrModerate(entries[i - 1])) {
      starts.push(i);
    }
  }

  // Preserve the existing behavior that folds a leading light/spotting prefix
  // into the first H/M group instead of emitting a bogus short cycle.
  while (starts.length >= 2) {
    const firstHasHeavyOrModerate = entries
      .slice(starts[0], starts[1])
      .some(isHeavyOrModerate);
    if (firstHasHeavyOrModerate) break;
    starts.splice(1, 1);
  }
  return starts;
}

function flowRunStart(entries: readonly DailyEntry[], index: number): number {
  let start = index;
  while (
    start > 0 &&
    isTrueFlow(entries[start - 1]) &&
    isTrueFlow(entries[start]) &&
    isConsecutive(entries, start - 1, start)
  ) {
    start -= 1;
  }
  return start;
}

function exactAssessment(
  entries: readonly DailyEntry[],
  index: number,
  source: CycleBoundarySource,
  eligibility: CycleBoundaryEligibility,
  reason: CycleBoundaryReason,
): CycleBoundaryAssessment {
  return {
    index,
    date: eligibility === 'eligible' ? entries[index]?.date ?? null : null,
    source,
    eligibility,
    reason,
  };
}

function assessInferredBoundary(
  entries: readonly DailyEntry[],
  index: number,
): CycleBoundaryAssessment {
  const marker = entries[index]?.menstrualFlowStart;
  if (marker === 'not_start') {
    return exactAssessment(
      entries,
      index,
      'inferred_heavy_moderate',
      'ineligible',
      'explicit_not_start',
    );
  }
  if (marker === 'uncertain') {
    return exactAssessment(
      entries,
      index,
      'inferred_heavy_moderate',
      'unknown',
      'uncertain_start_marker',
    );
  }
  if (index > 0) {
    if (!isConsecutive(entries, index - 1, index)) {
      return exactAssessment(
        entries,
        index,
        'inferred_heavy_moderate',
        'unknown',
        'missing_preceding_date',
      );
    }
    if (
      entries[index - 1]?.bleeding === 'light' &&
      entries[index - 1]?.menstrualFlowStart !== 'not_start'
    ) {
      return exactAssessment(
        entries,
        index,
        'inferred_heavy_moderate',
        'unknown',
        entries[index - 1]?.menstrualFlowStart === 'uncertain'
          ? 'uncertain_start_marker'
          : 'ambiguous_leading_light_flow',
      );
    }
  }
  return exactAssessment(
    entries,
    index,
    'inferred_heavy_moderate',
    'eligible',
    'unambiguous_heavy_moderate_start',
  );
}

/**
 * Resolves cycle grouping and Cycle Day 1 evidence in one place. Legacy rows
 * retain their established grouping, while an explicit valid true-flow start
 * can move CD1 to light flow and prevents later H/M in that flow run from
 * overriding it. Invalid evidence remains usable for grouping but never opens
 * an exact first-release boundary.
 */
export function resolveCycleBoundaries(
  entries: readonly DailyEntry[],
): CycleBoundaryResolution {
  if (entries.length === 0) {
    return {
      groups: [],
      currentCycleStartIndex: 0,
      currentCycleBoundary: null,
      datesStrictlyIncreasing: true,
    };
  }

  const datesStrictlyIncreasing = datesAreStrictlyIncreasing(entries);
  const invalidConfirmedIndices = new Set<number>();
  const confirmedByRunStart = new Map<number, number[]>();

  entries.forEach((entry, index) => {
    if (entry.menstrualFlowStart !== 'confirmed') return;
    if (!isTrueFlow(entry) || entry.missing) {
      invalidConfirmedIndices.add(index);
      return;
    }
    const runStart = flowRunStart(entries, index);
    const indices = confirmedByRunStart.get(runStart) ?? [];
    indices.push(index);
    confirmedByRunStart.set(runStart, indices);
  });

  const duplicateConfirmedIndices = new Set<number>();
  confirmedByRunStart.forEach((indices) => {
    if (indices.length <= 1) return;
    indices.forEach((index) => duplicateConfirmedIndices.add(index));
  });

  const validConfirmedIndices = [...confirmedByRunStart.entries()]
    .flatMap(([runStart, indices]) => {
      const firstIndex = indices[0];
      if (indices.length > 1) return [firstIndex];
      const hasContradictoryEarlierFlow = entries
        .slice(runStart, firstIndex)
        .some((earlier) => (
          isHeavyOrModerate(earlier) ||
          earlier.menstrualFlowStart !== 'not_start'
        ));
      if (hasContradictoryEarlierFlow) {
        invalidConfirmedIndices.add(firstIndex);
        return [];
      }
      return [firstIndex];
    })
    .sort((a, b) => a - b);
  const validConfirmedSet = new Set(validConfirmedIndices);

  const starts = legacyStarts(entries).filter((index) => {
    if (!isHeavyOrModerate(entries[index])) return true;
    const runStart = flowRunStart(entries, index);
    return !validConfirmedIndices.some(
      (confirmedIndex) => confirmedIndex >= runStart && confirmedIndex < index,
    );
  });
  validConfirmedIndices.forEach((index) => starts.push(index));
  starts.sort((a, b) => a - b);
  const uniqueStarts = starts.filter(
    (index, position) => position === 0 || index !== starts[position - 1],
  );

  // A first confirmed boundary excludes an earlier prefix that contains no
  // H/M flow; those rows are not silently relabeled as days in the new cycle.
  if (
    uniqueStarts.length >= 2 &&
    uniqueStarts[0] === 0 &&
    validConfirmedSet.has(uniqueStarts[1]) &&
    !entries.slice(0, uniqueStarts[1]).some(isHeavyOrModerate)
  ) {
    uniqueStarts.shift();
  }

  const groups: ResolvedCycleGroup[] = uniqueStarts.map(
    (groupStartIndex, groupIndex) => {
      const end = uniqueStarts[groupIndex + 1] ?? entries.length;
      let boundary: CycleBoundaryAssessment;
      if (validConfirmedSet.has(groupStartIndex)) {
        boundary = exactAssessment(
          entries,
          groupStartIndex,
          'confirmed_true_flow',
          'eligible',
          'confirmed_true_flow_start',
        );
      } else {
        let inferredIndex = -1;
        for (let i = groupStartIndex; i < end; i += 1) {
          if (
            isHeavyOrModerate(entries[i]) &&
            (i === 0 || !isHeavyOrModerate(entries[i - 1]))
          ) {
            inferredIndex = i;
            break;
          }
        }
        boundary = inferredIndex >= 0
          ? assessInferredBoundary(entries, inferredIndex)
          : exactAssessment(
              entries,
              groupStartIndex,
              'legacy_group_start',
              'unknown',
              'no_resolved_flow_start',
            );
      }

      const groupHasInvalidMarker = [
        ...invalidConfirmedIndices,
        ...duplicateConfirmedIndices,
      ].some((index) => index >= groupStartIndex && index < end);
      if (!datesStrictlyIncreasing || groupHasInvalidMarker) {
        const reason: CycleBoundaryReason = !datesStrictlyIncreasing
          ? 'invalid_or_unresolved_dates'
          : [...duplicateConfirmedIndices].some(
              (index) => index >= groupStartIndex && index < end,
            )
            ? 'duplicate_confirmed_start_marker'
            : 'invalid_confirmed_start_marker';
        boundary = exactAssessment(
          entries,
          boundary.index,
          boundary.source,
          'ineligible',
          reason,
        );
      }

      return { groupStartIndex, boundary };
    },
  );

  const currentCycleBoundary = groups[groups.length - 1]?.boundary ?? null;
  return {
    groups,
    currentCycleStartIndex: currentCycleBoundary?.index ?? 0,
    currentCycleBoundary,
    datesStrictlyIncreasing,
  };
}
