import {
  buildFirstReleasePossibleFertilePatternEligibility,
  buildPossibleFertilePatternPresentation,
  splitIntoCycles,
  type DailyEntry,
} from 'core-rules-engine';
import {
  buildCycleStartResolutionCopy,
  findCycleStartResolution,
} from '../cycleStartResolution';

function legacyEntries(
  menstrualFlowStart?: DailyEntry['menstrualFlowStart'],
): DailyEntry[] {
  return [
    { date: '2026-06-01', bleeding: 'none', mucusRankOverride: 2 },
    { date: '2026-06-02', bleeding: 'none', mucusRankOverride: 2 },
    {
      date: '2026-06-03',
      bleeding: 'light',
      menstrualFlowStart,
      mucusRankOverride: 0,
    },
    { date: '2026-06-04', bleeding: 'moderate', mucusRankOverride: 0 },
    { date: '2026-06-05', bleeding: 'none', mucusRankOverride: 0 },
  ];
}

function legacyPatternEntries(
  menstrualFlowStart?: DailyEntry['menstrualFlowStart'],
): DailyEntry[] {
  return [
    ...legacyEntries(menstrualFlowStart),
    { date: '2026-06-06', bleeding: 'none', mucusRankOverride: 1 },
    { date: '2026-06-07', bleeding: 'none', mucusRankOverride: 3 },
    { date: '2026-06-08', bleeding: 'none', mucusRankOverride: 0 },
    { date: '2026-06-09', bleeding: 'none', mucusRankOverride: 0 },
    { date: '2026-06-10', bleeding: 'none', mucusRankOverride: 0 },
  ];
}

function patternState(
  menstrualFlowStart?: DailyEntry['menstrualFlowStart'],
): string {
  const [cycle] = splitIntoCycles(legacyPatternEntries(menstrualFlowStart));
  return buildPossibleFertilePatternPresentation(
    cycle.entries,
    cycle.result,
    buildFirstReleasePossibleFertilePatternEligibility(cycle.cycleBoundary),
  ).state;
}

describe('cycle start resolution UX', () => {
  it('routes an unanswered legacy leading-light boundary to the deciding date', () => {
    const [cycle] = splitIntoCycles(legacyEntries());
    const resolution = findCycleStartResolution(cycle);

    expect(cycle.cycleBoundary).toMatchObject({
      eligibility: 'unknown',
      reason: 'ambiguous_leading_light_flow',
    });
    expect(resolution).toEqual({
      date: '2026-06-03',
      followingFlowDate: '2026-06-04',
      state: 'unanswered',
    });
    expect(buildCycleStartResolutionCopy(resolution!)).toMatchObject({
      heading: 'Confirm when this cycle began',
      actionLabel: 'Confirm June 3 2026',
    });
  });

  it('explains an explicit unsure answer without pretending the boundary resolved', () => {
    const [cycle] = splitIntoCycles(legacyEntries('uncertain'));
    const resolution = findCycleStartResolution(cycle);

    expect(resolution?.state).toBe('uncertain');
    expect(buildCycleStartResolutionCopy(resolution!).explanation).toContain(
      'Cycle Day 1 must be confirmed',
    );
    expect(patternState('uncertain')).toBe('withheld');
  });

  it('treats adjacent calendar dates as contiguous across daylight-saving changes', () => {
    const [cycle] = splitIntoCycles([
      { date: '2026-03-07', bleeding: 'light', mucusRankOverride: 0 },
      { date: '2026-03-08', bleeding: 'moderate', mucusRankOverride: 0 },
    ]);

    expect(findCycleStartResolution(cycle)).toEqual({
      date: '2026-03-07',
      followingFlowDate: '2026-03-08',
      state: 'unanswered',
    });
  });

  it.each(['confirmed', 'not_start'] as const)(
    'removes the recovery prompt after a %s answer resolves the boundary',
    (answer) => {
      const [cycle] = splitIntoCycles(legacyEntries(answer));

      expect(cycle.cycleBoundary.eligibility).toBe('eligible');
      expect(findCycleStartResolution(cycle)).toBeNull();
      expect(patternState(answer)).toBe('bounded');
    },
  );
});
