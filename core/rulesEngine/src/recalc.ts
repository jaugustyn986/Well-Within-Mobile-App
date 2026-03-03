import { detectFertileStart } from './fertileWindow';
import { detectPeak } from './peak';
import { computeMucusRank } from './rank';
import { CycleResult, DailyEntry } from './types';

interface RecalcOptions {
  debug?: boolean;
}

function findCurrentCycleStart(entries: Array<DailyEntry | null>): number {
  let startIndex = 0;
  for (let i = 0; i < entries.length - 1; i += 1) {
    const bleeding = entries[i]?.bleeding;
    const nextBleeding = entries[i + 1]?.bleeding;
    const currentIsCycleStart = (bleeding === 'heavy' || bleeding === 'moderate') &&
      (nextBleeding === 'heavy' || nextBleeding === 'moderate');

    if (currentIsCycleStart) {
      startIndex = i;
    }
  }
  return startIndex;
}

/**
 * RULES ENGINE SPEC: docs/RULES_ENGINE_SPEC.md
 * Recompute whole cycle on every edit. Predictive behavior is forbidden.
 */
export function recalculateCycle(entries: Array<DailyEntry | null>, options: RecalcOptions = {}): CycleResult {
  const phaseLabels = new Array(entries.length).fill('dry');
  const mucusRanks = entries.map((entry) => computeMucusRank(entry));
  const cycleStartIndex = findCurrentCycleStart(entries);

  const fertileStartIndex = detectFertileStart(mucusRanks, cycleStartIndex);
  const { peakIndex, fertileEndIndex } = detectPeak(mucusRanks, cycleStartIndex);

  for (let i = 0; i < entries.length; i += 1) {
    const rank = mucusRanks[i];
    if (i < cycleStartIndex) {
      phaseLabels[i] = 'previous_cycle';
      continue;
    }

    if (entries[i]?.missing || entries[i] === null || rank === null) {
      phaseLabels[i] = 'missing';
      continue;
    }

    phaseLabels[i] = rank >= 1 ? 'mucus' : 'dry';

    if (peakIndex !== null && i === peakIndex) phaseLabels[i] = 'peak';
    if (fertileStartIndex !== null && fertileEndIndex !== null && i >= fertileStartIndex && i <= fertileEndIndex) {
      phaseLabels[i] = i === peakIndex ? 'peak' : 'fertile';
    }
  }

  if (options.debug) {
    // eslint-disable-next-line no-console
    console.debug({ cycleStartIndex, mucusRanks, fertileStartIndex, peakIndex, fertileEndIndex, phaseLabels });
  }

  return { peakIndex, fertileStartIndex, fertileEndIndex, phaseLabels, mucusRanks };
}
