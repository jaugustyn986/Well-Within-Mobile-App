import {
  derivedPatternMarkerLabel,
  getDayPresentationEvidence,
} from '../dayPresentationContract';

describe('dayPresentationContract', () => {
  it('keeps a post-peak rank-3 row as a recorded Peak-type sign', () => {
    expect(getDayPresentationEvidence({
      mucusRank: 3,
      phaseLabel: 'post_peak',
      showDerivedMarkers: false,
    })).toEqual({
      recordedState: 'peak_type',
      derivedMarker: null,
    });
  });

  it('shows Peak Day and P+ markers only when the bounded presentation allows them', () => {
    const openPeak = getDayPresentationEvidence({
      mucusRank: 3,
      phaseLabel: 'peak_confirmed',
      showDerivedMarkers: false,
    });
    const boundedPeak = getDayPresentationEvidence({
      mucusRank: 3,
      phaseLabel: 'peak_confirmed',
      showDerivedMarkers: true,
    });
    const openP3 = getDayPresentationEvidence({
      mucusRank: 0,
      phaseLabel: 'p_plus_3',
      showDerivedMarkers: false,
    });

    expect(openPeak.derivedMarker).toBeNull();
    expect(boundedPeak.derivedMarker).toBe('peak_day');
    expect(derivedPatternMarkerLabel(boundedPeak.derivedMarker)).toBe('Peak Day');
    expect(openP3.derivedMarker).toBeNull();
  });
});
