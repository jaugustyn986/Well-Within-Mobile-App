import {
  mucusChartStrengthLabel,
  type BleedingType,
  type PhaseLabel,
  type PrimaryDayClass,
} from 'core-rules-engine';
import {
  BG_BLEEDING,
  BG_DRY,
  BG_NO_ENTRY,
  BG_PEAK_TYPE,
  BG_POST_PEAK,
  FERTILE_ACCENT,
} from '../theme/colors';
import {
  derivedPatternMarkerLabel,
  getDayPresentationEvidence,
} from './dayPresentationContract';

export interface CalendarDayInfo {
  date: string;
  hasEntry: boolean;
  phaseLabel?: PhaseLabel;
  isToday: boolean;
  /** Engine primary class; drives color with phase/mucus (not raw bleeding alone). */
  primaryDayClass?: PrimaryDayClass;
  mucusRank?: number | null;
  bleeding?: BleedingType;
  intercourse?: boolean;
  observationCount?: number;
  /** Retrospective Peak/P+ markers are shown only for a bounded presentation. */
  showDerivedMarkers?: boolean;
}

export interface CalendarDayPresentation {
  backgroundColor: string;
  indicatorColor: string | null;
  /** Compact observation marker shown independently from the day fill. */
  bleedingMarker: 'S' | 'B' | null;
  /** Retrospective marker shown independently from the recorded observation. */
  patternMarkerLabel: 'P+1' | 'P+2' | 'P+3' | null;
  /** @deprecated Prefer bleedingMarker. Retained for presentation consumers during migration. */
  showsSpottingMarker: boolean;
  showsPeakMarker: boolean;
  stateLabel: string;
}

function backgroundForDay(day: CalendarDayInfo): string {
  if (!day.hasEntry) return BG_NO_ENTRY;

  const primary = day.primaryDayClass;
  if (primary === 'menstrual_flow' || primary === 'spotting') return BG_BLEEDING;
  if (primary === 'missing') return BG_NO_ENTRY;

  const evidence = getDayPresentationEvidence({
    mucusRank: day.mucusRank,
    phaseLabel: day.phaseLabel,
    showDerivedMarkers: day.showDerivedMarkers === true,
  });

  if (
    evidence.derivedMarker === 'p_plus_1' ||
    evidence.derivedMarker === 'p_plus_2' ||
    evidence.derivedMarker === 'p_plus_3'
  ) {
    return BG_POST_PEAK;
  }

  switch (evidence.recordedState) {
    case 'peak_type': return BG_PEAK_TYPE;
    case 'missing': return BG_NO_ENTRY;
    default: return BG_DRY;
  }
}

function indicatorForDay(day: CalendarDayInfo): string | null {
  if (!day.hasEntry) return null;
  const primary = day.primaryDayClass;
  if (primary === 'menstrual_flow' || primary === 'spotting') return null;
  const evidence = getDayPresentationEvidence({
    mucusRank: day.mucusRank,
    phaseLabel: day.phaseLabel,
    showDerivedMarkers: day.showDerivedMarkers === true,
  });
  return evidence.recordedState === 'mucus' ? FERTILE_ACCENT : null;
}

function stateLabelForDay(day: CalendarDayInfo): string {
  if (!day.hasEntry) return 'No entry';
  if (day.primaryDayClass === 'missing' || day.phaseLabel === 'missing') {
    if (day.bleeding === 'brown') {
      return 'Brown recorded; choose a sensation to complete the observation';
    }
    if (day.bleeding === 'spotting') {
      return 'Spotting recorded; choose a sensation to complete the observation';
    }
    return 'Not observed';
  }

  const evidence = getDayPresentationEvidence({
    mucusRank: day.mucusRank,
    phaseLabel: day.phaseLabel,
    showDerivedMarkers: day.showDerivedMarkers === true,
  });
  const prefix = derivedPatternMarkerLabel(evidence.derivedMarker);
  const rank = day.mucusRank;
  const hasMucus = rank !== null && rank !== undefined && rank >= 1;
  const bleedingLabel = day.bleeding === 'spotting'
    ? 'Spotting'
    : day.bleeding === 'brown'
      ? 'Brown'
      : null;
  const mucusLabel = hasMucus
    ? `${mucusChartStrengthLabel(rank, 'Mucus')} mucus recorded`
    : null;

  let observation: string;
  if (bleedingLabel && mucusLabel) {
    observation = `${mucusLabel}; ${bleedingLabel.toLowerCase()} also recorded`;
  } else if (day.bleeding === 'spotting' || day.primaryDayClass === 'spotting') {
    observation = 'Spotting recorded';
  } else if (day.bleeding === 'brown') {
    observation = 'Dry observation; brown also recorded';
  } else if (day.primaryDayClass === 'menstrual_flow') {
    observation = 'Menstrual flow recorded';
  } else if (mucusLabel) {
    observation = mucusLabel;
  } else {
    observation = 'Dry observation';
  }

  return prefix ? `${prefix}, ${observation}` : observation;
}

/**
 * Presentation-only mapping. The fill shows the engine chart state, while the
 * dot and S/B marker preserve mucus and spotting/brown observations recorded together.
 */
export function getCalendarDayPresentation(
  day: CalendarDayInfo,
): CalendarDayPresentation {
  const evidence = getDayPresentationEvidence({
    mucusRank: day.mucusRank,
    phaseLabel: day.phaseLabel,
    showDerivedMarkers: day.showDerivedMarkers === true,
  });
  const patternLabel = derivedPatternMarkerLabel(evidence.derivedMarker);
  return {
    backgroundColor: backgroundForDay(day),
    indicatorColor: indicatorForDay(day),
    bleedingMarker: day.hasEntry
      ? day.bleeding === 'spotting'
        ? 'S'
        : day.bleeding === 'brown'
          ? 'B'
          : null
      : null,
    patternMarkerLabel:
      patternLabel === 'P+1' || patternLabel === 'P+2' || patternLabel === 'P+3'
        ? patternLabel
        : null,
    showsSpottingMarker: day.hasEntry && day.bleeding === 'spotting',
    showsPeakMarker: evidence.derivedMarker === 'peak_day',
    stateLabel: stateLabelForDay(day),
  };
}
