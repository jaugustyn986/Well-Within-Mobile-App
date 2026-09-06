import { DailyEntry, MucusDayClassification, MucusDerivedDay } from './types';
import { resolveDailyMucus } from './observationResolution';

export function deriveMucusDay(
  entry: DailyEntry,
  rank: number | null,
): MucusDerivedDay {
  if (entry.missing || rank === null) {
    return {
      rank: null,
      isPeakType: false,
      isLubricative: false,
      isStretchy: false,
      classification: 'dry',
    };
  }

  const resolved = resolveDailyMucus(entry);
  const isStretchy = resolved.hasStretchy;
  const isLubricative = resolved.hasLubricative;

  const isPeakType = rank >= 3;

  let classification: MucusDayClassification;
  if (rank >= 3) classification = 'peak_type';
  else if (rank === 2) classification = 'fertile_mucus';
  else if (rank === 1) classification = 'low_mucus';
  else classification = 'dry';

  return {
    rank,
    isPeakType,
    isLubricative,
    isStretchy,
    classification,
  };
}

export function deriveMucusDerivedByDay(
  entries: DailyEntry[],
  ranks: Array<number | null>,
): MucusDerivedDay[] {
  return entries.map((e, i) => deriveMucusDay(e, ranks[i]));
}
