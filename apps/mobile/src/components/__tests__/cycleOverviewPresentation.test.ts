import { buildCycleOverviewMetrics } from '../cycleOverviewPresentation';

describe('buildCycleOverviewMetrics', () => {
  it('shows the approved retrospective values for a supported completed cycle', () => {
    expect(buildCycleOverviewMetrics({
      length: 21,
      peakDay: 14,
      peakToNextCycleDays: 7,
      showDerivedPattern: true,
    })).toMatchObject([
      { value: '21 days', label: 'Cycle length' },
      { value: 'Day 14', label: 'Peak marker' },
      { value: '7 days', label: 'Peak to next cycle' },
    ]);
  });

  it('keeps cycle length visible without surfacing unsupported derived markers', () => {
    expect(buildCycleOverviewMetrics({
      length: 11,
      peakDay: 8,
      peakToNextCycleDays: null,
      showDerivedPattern: false,
    })).toMatchObject([
      { value: '11 days', label: 'Cycle length' },
      { value: '—', label: 'Peak marker' },
      { value: '—', label: 'Peak to next cycle' },
    ]);
  });
});
