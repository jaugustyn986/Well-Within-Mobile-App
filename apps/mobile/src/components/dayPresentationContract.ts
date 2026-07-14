import type {
  PhaseLabel,
  PossibleFertilePatternPresentation,
} from 'core-rules-engine';

export type RecordedChartState = 'missing' | 'dry' | 'mucus' | 'peak_type';

export type DerivedPatternMarker =
  | 'peak_day'
  | 'p_plus_1'
  | 'p_plus_2'
  | 'p_plus_3'
  | null;

export interface DayPresentationEvidence {
  recordedState: RecordedChartState;
  derivedMarker: DerivedPatternMarker;
}

/**
 * Peak/P+ markers are retrospective date markers and do not require an exact
 * Cycle Day 1 boundary. Exact possible-pattern ranges and cycle-day statistics
 * remain gated separately by a bounded presentation.
 */
export function shouldShowRetrospectivePeakMarkers(
  presentation: PossibleFertilePatternPresentation,
): boolean {
  return presentation.contextEligibility === 'eligible' &&
    presentation.interpretationStatus === 'summary_available';
}

/**
 * Shared presentation contract for observation facts versus retrospective
 * pattern markers. A surface may style these layers differently, but it must
 * not turn an engine phase into a different recorded observation.
 */
export function getDayPresentationEvidence(params: {
  mucusRank: number | null | undefined;
  phaseLabel: PhaseLabel | undefined;
  showDerivedMarkers: boolean;
}): DayPresentationEvidence {
  const { mucusRank, phaseLabel, showDerivedMarkers } = params;

  let recordedState: RecordedChartState;
  if (mucusRank === null || mucusRank === undefined || phaseLabel === 'missing') {
    recordedState = 'missing';
  } else if (mucusRank >= 3) {
    recordedState = 'peak_type';
  } else if (mucusRank >= 1) {
    recordedState = 'mucus';
  } else {
    recordedState = 'dry';
  }

  let derivedMarker: DerivedPatternMarker = null;
  if (showDerivedMarkers) {
    switch (phaseLabel) {
      case 'peak_confirmed':
        derivedMarker = 'peak_day';
        break;
      case 'p_plus_1':
      case 'p_plus_2':
      case 'p_plus_3':
        derivedMarker = phaseLabel;
        break;
      default:
        derivedMarker = null;
    }
  }

  return { recordedState, derivedMarker };
}

export function derivedPatternMarkerLabel(marker: DerivedPatternMarker): string | null {
  switch (marker) {
    case 'peak_day': return 'Peak Day';
    case 'p_plus_1': return 'P+1';
    case 'p_plus_2': return 'P+2';
    case 'p_plus_3': return 'P+3';
    default: return null;
  }
}
