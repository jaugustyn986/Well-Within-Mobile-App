import { getCalendarDayPresentation } from '../calendarDayPresentation';
import {
  buildPossibleFertilePatternPresentation,
  buildFirstReleasePossibleFertilePatternEligibility,
  splitIntoCycles,
  type DailyEntry,
} from 'core-rules-engine';
import {
  BG_DRY,
  BG_PEAK_TYPE,
  BG_POST_PEAK,
  FERTILE_ACCENT,
} from '../../theme/colors';
import { shouldShowRetrospectivePeakMarkers } from '../dayPresentationContract';

describe('getCalendarDayPresentation', () => {
  const base = {
    date: '2026-07-13',
    hasEntry: true,
    isToday: false,
  } as const;

  it('shows a non-bleeding P+3 mucus observation as yellow with a mucus dot', () => {
    const presentation = getCalendarDayPresentation({
      ...base,
      phaseLabel: 'p_plus_3',
      primaryDayClass: 'mucus_observed',
      mucusRank: 1,
      bleeding: 'none',
      showDerivedMarkers: true,
    });

    expect(presentation.backgroundColor).toBe(BG_POST_PEAK);
    expect(presentation.indicatorColor).toBe(FERTILE_ACCENT);
    expect(presentation.showsSpottingMarker).toBe(false);
    expect(presentation.stateLabel).toBe('P+3, Damp mucus recorded');
  });

  it('preserves spotting and mucus when the engine withholds a P+3 display', () => {
    const presentation = getCalendarDayPresentation({
      ...base,
      phaseLabel: 'dry',
      primaryDayClass: 'mucus_observed',
      mucusRank: 1,
      bleeding: 'spotting',
    });

    expect(presentation.backgroundColor).toBe(BG_DRY);
    expect(presentation.indicatorColor).toBe(FERTILE_ACCENT);
    expect(presentation.showsSpottingMarker).toBe(true);
    expect(presentation.stateLabel).toBe('Spotting and damp mucus recorded');
  });

  it('does not label later mucus as one of the three P+ days', () => {
    const presentation = getCalendarDayPresentation({
      ...base,
      phaseLabel: 'post_peak',
      primaryDayClass: 'mucus_observed',
      mucusRank: 2,
      bleeding: 'none',
    });

    expect(presentation.backgroundColor).toBe(BG_DRY);
    expect(presentation.stateLabel).toBe('Wet mucus recorded');
  });

  it('keeps a later Peak-type observation gray when a prior pattern was reopened', () => {
    const presentation = getCalendarDayPresentation({
      ...base,
      phaseLabel: 'post_peak',
      primaryDayClass: 'peak_type',
      mucusRank: 3,
      bleeding: 'none',
      showDerivedMarkers: false,
    });

    expect(presentation.backgroundColor).toBe(BG_PEAK_TYPE);
    expect(presentation.showsPeakMarker).toBe(false);
    expect(presentation.stateLabel).toBe('Peak-type mucus recorded');
  });

  it('withholds the old Peak Day marker when the pattern presentation is open', () => {
    const presentation = getCalendarDayPresentation({
      ...base,
      phaseLabel: 'peak_confirmed',
      primaryDayClass: 'peak_type',
      mucusRank: 3,
      bleeding: 'none',
      showDerivedMarkers: false,
    });

    expect(presentation.backgroundColor).toBe(BG_PEAK_TYPE);
    expect(presentation.showsPeakMarker).toBe(false);
    expect(presentation.stateLabel).toBe('Peak-type mucus recorded');
  });

  it('moves June Peak/P+ presentation to the latest qualifying Peak-type sign', () => {
    const entries: DailyEntry[] = Array.from({ length: 22 }, (_, index) => ({
      date: `2026-06-${String(index + 1).padStart(2, '0')}`,
      bleeding: index === 2
        ? ('light' as const)
        : index === 3
          ? ('moderate' as const)
          : ('none' as const),
      mucusRankOverride: index === 10 || index === 18
        ? 3
        : index === 0 || index === 1
          ? 2
        : index === 20
          ? 1
          : index === 21
            ? 2
            : 0,
    }));
    const [cycle] = splitIntoCycles(entries);
    const result = cycle.result;
    const pattern = buildPossibleFertilePatternPresentation(
      cycle.entries,
      result,
      buildFirstReleasePossibleFertilePatternEligibility(cycle.cycleBoundary),
    );
    const showDerivedMarkers = shouldShowRetrospectivePeakMarkers(pattern);
    const present = (index: number) => getCalendarDayPresentation({
      date: entries[index].date!,
      hasEntry: true,
      isToday: false,
      phaseLabel: result.phaseLabels[index],
      primaryDayClass: result.primaryDayClassByDay[index],
      mucusRank: result.mucusRanks[index],
      bleeding: entries[index].bleeding,
      showDerivedMarkers,
    });

    expect(pattern).toMatchObject({
      state: 'withheld',
      reason: 'cycle_boundary_eligibility_unknown',
      interpretationStatus: 'summary_available',
    });
    expect(showDerivedMarkers).toBe(true);
    expect(present(10)).toMatchObject({
      backgroundColor: BG_PEAK_TYPE,
      showsPeakMarker: false,
      stateLabel: 'Peak-type mucus recorded',
    });
    expect(present(18)).toMatchObject({
      backgroundColor: BG_PEAK_TYPE,
      showsPeakMarker: true,
      stateLabel: 'Peak Day, Peak-type mucus recorded',
    });
    expect(present(19)).toMatchObject({
      backgroundColor: BG_POST_PEAK,
      stateLabel: 'P+1, Dry observation',
    });
    expect(present(20)).toMatchObject({
      backgroundColor: BG_POST_PEAK,
      indicatorColor: FERTILE_ACCENT,
      stateLabel: 'P+2, Damp mucus recorded',
    });
    expect(present(21)).toMatchObject({
      backgroundColor: BG_POST_PEAK,
      indicatorColor: FERTILE_ACCENT,
      stateLabel: 'P+3, Wet mucus recorded',
    });
  });
});
