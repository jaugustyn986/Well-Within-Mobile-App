import type {
  Appearance,
  DailyEntry,
  MucusObservation,
} from './types';

export interface ResolvedDailyMucus {
  observations: MucusObservation[];
  representative: MucusObservation | null;
  representativeIndex: number | null;
  rank: number | null;
  hasStretchy: boolean;
  hasLubricative: boolean;
}

function sensationRank(sensation: string): number {
  switch (sensation) {
    case 'stretchy': return 3;
    case 'tacky':
    case 'wet': return 2;
    case 'sticky':
    case 'shiny':
    case 'damp': return 1;
    default: return 0;
  }
}

function appearanceBoost(appearances: Appearance[]): number {
  let rank = 0;
  for (const appearance of appearances) {
    if (
      appearance === 'clear'
      || appearance === 'cloudy_clear'
      || appearance === 'lubricative'
    ) {
      rank = Math.max(rank, 3);
    } else if (
      appearance === 'cloudy'
      || appearance === 'gummy'
      || appearance === 'pasty'
      || appearance === 'yellow'
    ) {
      rank = Math.max(rank, 1);
    }
  }
  return rank;
}

function lubricativePromotion(sensation: string, appearances: Appearance[]): number {
  if (!appearances.includes('lubricative')) return 0;
  return sensation === 'damp' || sensation === 'shiny' || sensation === 'wet' ? 3 : 0;
}

export function computeObservationRank(observation: MucusObservation): number {
  return Math.max(
    sensationRank(observation.sensation),
    appearanceBoost(observation.appearances),
    lubricativePromotion(observation.sensation, observation.appearances),
  );
}

export function isValidObservationTime(value: string | undefined): boolean {
  if (value === undefined) return true;
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function fallbackObservationId(entry: DailyEntry, index: number): string {
  return `legacy:${entry.date ?? 'undated'}:${index}`;
}

function copyObservation(
  entry: DailyEntry,
  observation: MucusObservation,
  index: number,
): MucusObservation {
  return {
    ...observation,
    id: observation.id ?? fallbackObservationId(entry, index),
    appearances: [...observation.appearances],
  };
}

function legacyObservation(entry: DailyEntry): MucusObservation | null {
  if (entry.sensation === undefined && entry.appearances === undefined) return null;
  return {
    id: fallbackObservationId(entry, 0),
    sensation: entry.sensation ?? 'dry',
    appearances: [...(entry.appearances ?? [])],
    frequency: entry.frequency,
  };
}

function timeValue(observation: MucusObservation): number {
  if (!isValidObservationTime(observation.observedAt) || !observation.observedAt) return -1;
  const [hours, minutes] = observation.observedAt.split(':').map(Number);
  return hours * 60 + minutes;
}

export function resolveDailyMucus(entry: DailyEntry | null): ResolvedDailyMucus {
  if (!entry || entry.missing) {
    return {
      observations: [],
      representative: null,
      representativeIndex: null,
      rank: null,
      hasStretchy: false,
      hasLubricative: false,
    };
  }

  const observations = entry.observations !== undefined
    ? entry.observations.map((observation, index) => copyObservation(entry, observation, index))
    : (() => {
        const legacy = legacyObservation(entry);
        return legacy ? [legacy] : [];
      })();

  let representativeIndex: number | null = null;
  let rank: number | null = null;
  observations.forEach((observation, index) => {
    const observationRank = computeObservationRank(observation);
    if (
      rank === null
      || observationRank > rank
      || observationRank === rank
    ) {
      representativeIndex = index;
      rank = observationRank;
    }
  });

  return {
    observations,
    representative: representativeIndex === null ? null : observations[representativeIndex],
    representativeIndex,
    rank,
    hasStretchy: observations.some((observation) => observation.sensation === 'stretchy'),
    hasLubricative: observations.some(
      (observation) => observation.appearances.includes('lubricative'),
    ),
  };
}

export function sortMucusObservationsForDisplay(
  observations: MucusObservation[],
): MucusObservation[] {
  return observations
    .map((observation, index) => ({ observation, index }))
    .sort((a, b) => {
      const aTime = timeValue(a.observation);
      const bTime = timeValue(b.observation);
      if (aTime >= 0 && bTime >= 0) return aTime - bTime || a.index - b.index;
      if (aTime >= 0) return -1;
      if (bTime >= 0) return 1;
      return a.index - b.index;
    })
    .map(({ observation }) => observation);
}

export function withMucusObservations(
  entry: DailyEntry,
  observations: MucusObservation[],
): DailyEntry {
  const dayLevelEntry: DailyEntry = { ...entry };
  delete dayLevelEntry.sensation;
  delete dayLevelEntry.appearances;
  delete dayLevelEntry.frequency;
  const next: DailyEntry = {
    ...dayLevelEntry,
    observations: observations.map((observation) => ({
      ...observation,
      appearances: [...observation.appearances],
    })),
  };
  const representative = resolveDailyMucus(next).representative;
  if (!representative) return next;
  return {
    ...next,
    sensation: representative.sensation,
    appearances: representative.appearances.length > 0
      ? [...representative.appearances]
      : undefined,
    frequency: representative.frequency,
  };
}
