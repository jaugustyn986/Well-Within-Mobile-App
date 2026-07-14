import {
  buildCurrentCycleSummary,
  recalculateCycle,
  type DailyEntry,
} from '../src';

function sequence(lastBleeding: 'none' | 'spotting'): DailyEntry[] {
  return [
    { date: '2026-07-08', bleeding: 'heavy', mucusRankOverride: 0 },
    { date: '2026-07-09', bleeding: 'none', mucusRankOverride: 3 },
    { date: '2026-07-10', bleeding: 'none', mucusRankOverride: 3 },
    { date: '2026-07-11', bleeding: 'none', mucusRankOverride: 2 },
    { date: '2026-07-12', bleeding: 'none', mucusRankOverride: 2 },
    { date: '2026-07-13', bleeding: lastBleeding, mucusRankOverride: 1 },
  ];
}

describe('two gray, two yellow, then mucus regression', () => {
  it('keeps an ordinary third lower day in P+3', () => {
    const result = recalculateCycle(sequence('none'));

    expect(result.phaseLabels.slice(1)).toEqual([
      'fertile_open',
      'peak_confirmed',
      'p_plus_1',
      'p_plus_2',
      'p_plus_3',
    ]);
    expect(result.primaryDayClassByDay[5]).toBe('mucus_observed');
  });

  it('preserves spotting plus mucus and routes the summary to review', () => {
    const entries = sequence('spotting');
    const result = recalculateCycle(entries);
    const summary = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 5,
      possibleFertilePatternEligibility: {
        contextEligibility: 'eligible',
        cycleBoundaryEligibility: 'eligible',
      },
    });

    expect(result.phaseLabels.slice(1)).toEqual([
      'fertile_open',
      'peak_confirmed',
      'p_plus_1',
      'p_plus_2',
      'dry',
    ]);
    expect(result.primaryDayClassByDay[5]).toBe('mucus_observed');
    expect(summary.interpretationStatus).toBe('review_recommended');
    expect(summary.interpretationReason).toBe('bleeding_mucus_ambiguity');
    expect(summary.headline).toBe('Mucus and light bleeding were recorded together');
    expect(summary.statusLine).toContain('leaves the possible-pattern boundary open for review');
  });
});
