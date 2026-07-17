import { resolveCycleCardStatusKey } from '../cycleCardPresentation';

describe('resolveCycleCardStatusKey', () => {
  it('labels the latest cycle as in progress even before a Peak is confirmed', () => {
    expect(resolveCycleCardStatusKey({
      cycleNumber: 4,
      latestCycleNumber: 4,
      cycleStatus: 'no_peak',
      interpretationStatus: 'summary_available',
    })).toBe('in_progress');
  });

  it('keeps a prior cycle without a confirmed Peak distinct from the active cycle', () => {
    expect(resolveCycleCardStatusKey({
      cycleNumber: 3,
      latestCycleNumber: 4,
      cycleStatus: 'no_peak',
      interpretationStatus: 'summary_available',
    })).toBe('no_peak');
  });

  it('preserves context and review states for prior cycles', () => {
    expect(resolveCycleCardStatusKey({
      cycleNumber: 2,
      latestCycleNumber: 4,
      cycleStatus: 'complete',
      interpretationStatus: 'blocked_by_missing',
    })).toBe('needs_context');
  });
});
