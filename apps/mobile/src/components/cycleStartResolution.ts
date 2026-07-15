import type { CycleSlice, DailyEntry } from 'core-rules-engine';
import { formatFullDate } from '../utils/dateDisplay';

export type CycleStartResolutionState = 'unanswered' | 'uncertain';

export interface CycleStartResolution {
  date: string;
  followingFlowDate: string | null;
  state: CycleStartResolutionState;
}

export interface CycleStartResolutionCopy {
  heading: string;
  evidence: string;
  explanation: string;
  actionLabel: string;
}

function isTrueFlow(entry: DailyEntry | undefined): boolean {
  return entry?.bleeding === 'light' ||
    entry?.bleeding === 'moderate' ||
    entry?.bleeding === 'heavy';
}

function isNextCalendarDay(earlier: string | undefined, later: string | undefined): boolean {
  if (!earlier || !later) return false;
  const earlierDate = new Date(`${earlier}T00:00:00.000Z`);
  const laterDate = new Date(`${later}T00:00:00.000Z`);
  if (Number.isNaN(earlierDate.getTime()) || Number.isNaN(laterDate.getTime())) return false;
  return laterDate.getTime() - earlierDate.getTime() === 24 * 60 * 60 * 1000;
}

/**
 * Finds the unanswered leading-light row that prevents an otherwise ordinary
 * heavy/moderate flow boundary from becoming Cycle Day 1. Other unresolved
 * boundary reasons remain non-automated and do not receive this targeted CTA.
 */
export function findCycleStartResolution(
  cycle: CycleSlice,
): CycleStartResolution | null {
  if (
    cycle.cycleBoundary.eligibility !== 'unknown' ||
    (
      cycle.cycleBoundary.reason !== 'ambiguous_leading_light_flow' &&
      cycle.cycleBoundary.reason !== 'uncertain_start_marker'
    )
  ) {
    return null;
  }

  const boundaryIndex = cycle.cycleBoundary.index;
  if (boundaryIndex < 0 || boundaryIndex >= cycle.entries.length) return null;

  let runStart = boundaryIndex;
  while (
    runStart > 0 &&
    isTrueFlow(cycle.entries[runStart - 1]) &&
    isTrueFlow(cycle.entries[runStart]) &&
    isNextCalendarDay(
      cycle.entries[runStart - 1]?.date,
      cycle.entries[runStart]?.date,
    )
  ) {
    runStart -= 1;
  }

  const leadingEntry = cycle.entries[runStart];
  if (leadingEntry?.bleeding !== 'light' || !leadingEntry.date) return null;
  if (
    leadingEntry.menstrualFlowStart === 'confirmed' ||
    leadingEntry.menstrualFlowStart === 'not_start'
  ) {
    return null;
  }

  return {
    date: leadingEntry.date,
    followingFlowDate: cycle.entries[boundaryIndex]?.date ?? null,
    state: leadingEntry.menstrualFlowStart === 'uncertain'
      ? 'uncertain'
      : 'unanswered',
  };
}

export function buildCycleStartResolutionCopy(
  resolution: CycleStartResolution,
): CycleStartResolutionCopy {
  const lightDate = formatFullDate(resolution.date);
  const followingDate = resolution.followingFlowDate
    ? formatFullDate(resolution.followingFlowDate)
    : null;

  return {
    heading: resolution.state === 'uncertain'
      ? 'Cycle start is still uncertain'
      : 'Confirm when this cycle began',
    evidence: followingDate
      ? `You recorded light bleeding on ${lightDate}, followed by fuller flow on ${followingDate}.`
      : `You recorded light bleeding on ${lightDate} before the rest of this cycle.`,
    explanation: resolution.state === 'uncertain'
      ? 'You chose “I’m not sure” for that day. Your chart stays saved, but Cycle Day 1 must be confirmed before this cycle can be compared in History.'
      : 'Tell us whether that was the first day of true menstrual flow. Your answer helps the app confirm Cycle Day 1 and decide whether this cycle can be compared in History.',
    actionLabel: resolution.state === 'uncertain'
      ? `Review ${lightDate}`
      : `Confirm ${lightDate}`,
  };
}
