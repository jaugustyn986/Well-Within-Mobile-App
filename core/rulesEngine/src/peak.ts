import { addDaysIso, entryDateOrSynthetic } from './calendar';
import { blocksFertileOpening } from './flowBleeding';
import { DailyEntry } from './types';

function peakTypeIndicesFrom(
  entries: DailyEntry[],
  ranks: Array<number | null>,
  startIndex: number,
): number[] {
  const peakTypeIndices: number[] = [];
  for (let i = startIndex; i < entries.length; i += 1) {
    if (entries[i]?.missing) continue;
    if (blocksFertileOpening(entries[i]?.bleeding)) continue;
    if (ranks[i] === 3) peakTypeIndices.push(i);
  }
  return peakTypeIndices.sort((a, b) =>
    entryDateOrSynthetic(entries[a]?.date, a).localeCompare(
      entryDateOrSynthetic(entries[b]?.date, b),
    ),
  );
}

function candidateHasThreeLowerCalendarDays(
  entries: DailyEntry[],
  ranks: Array<number | null>,
  dateToIndex: Map<string, number>,
  candidateIndex: number,
): boolean {
  const candidateDate = entryDateOrSynthetic(
    entries[candidateIndex]?.date,
    candidateIndex,
  );
  const candidateRank = ranks[candidateIndex];
  if (candidateRank === null || candidateRank === undefined) return false;

  for (let offset = 1; offset <= 3; offset += 1) {
    const index = dateToIndex.get(addDaysIso(candidateDate, offset));
    if (index === undefined || entries[index]?.missing) return false;
    const rank = ranks[index];
    if (rank === null || rank === undefined || rank >= candidateRank) return false;
  }
  return true;
}

/**
 * Returns every Peak-type row that independently satisfies the engine's existing
 * three-lower-calendar-days rule. More than one is a product support limitation;
 * this helper does not decide which clinical Peak is correct.
 */
export function findConfirmedPeakSequenceIndices(
  entries: DailyEntry[],
  ranks: Array<number | null>,
  startIndex: number,
): number[] {
  const dateToIndex = new Map<string, number>();
  for (let i = 0; i < entries.length; i += 1) {
    dateToIndex.set(entryDateOrSynthetic(entries[i]?.date, i), i);
  }
  return peakTypeIndicesFrom(entries, ranks, startIndex).filter((candidateIndex) =>
    candidateHasThreeLowerCalendarDays(entries, ranks, dateToIndex, candidateIndex),
  );
}

/**
 * RULES ENGINE SPEC: docs/RULES_ENGINE_SPEC.md
 * Peak confirmed using three consecutive calendar days after peak-type day.
 */
export function detectPeak(
  entries: DailyEntry[],
  ranks: Array<number | null>,
  startIndex: number,
): {
  peakCandidateIndex: number | null;
  peakIndex: number | null;
  fertileEndIndex: number | null;
} {
  const n = entries.length;
  const dateToIndex = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    const d = entryDateOrSynthetic(entries[i]?.date, i);
    dateToIndex.set(d, i);
  }

  const peakTypeIndices = peakTypeIndicesFrom(entries, ranks, startIndex);

  let peakCandidateIndex: number | null =
    peakTypeIndices.length > 0 ? peakTypeIndices[peakTypeIndices.length - 1] : null;

  for (const cand of peakTypeIndices) {
    peakCandidateIndex = cand;
    const D = entryDateOrSynthetic(entries[cand]?.date, cand);
    const ok = candidateHasThreeLowerCalendarDays(entries, ranks, dateToIndex, cand);
    if (ok) {
      const endIdx = dateToIndex.get(addDaysIso(D, 3));
      if (endIdx === undefined) {
        return { peakCandidateIndex: cand, peakIndex: null, fertileEndIndex: null };
      }
      return {
        peakCandidateIndex: cand,
        peakIndex: cand,
        fertileEndIndex: endIdx,
      };
    }
  }

  return {
    peakCandidateIndex,
    peakIndex: null,
    fertileEndIndex: null,
  };
}
