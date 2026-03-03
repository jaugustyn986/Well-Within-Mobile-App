import { recalculateCycle } from '../src/recalc';
import { DailyEntry } from '../src/types';

const byRanks = (ranks: Array<number | null>): Array<DailyEntry | null> =>
  ranks.map((rank) => {
    if (rank === null) return { missing: true };
    return { mucusRankOverride: rank, bleeding: 'none' };
  });

describe('rules engine edge cases', () => {
  it('Always dry', () => {
    const result = recalculateCycle(byRanks([0, 0, 0, 0]));
    expect(result.fertileStartIndex).toBeNull();
    expect(result.peakIndex).toBeNull();
    expect(result.fertileEndIndex).toBeNull();
    expect(result.phaseLabels).toEqual(['dry', 'dry', 'dry', 'dry']);
  });

  it('Simple Peak', () => {
    const result = recalculateCycle(byRanks([0, 0, 1, 2, 3, 0, 0, 0]));
    expect(result.fertileStartIndex).toBe(2);
    expect(result.peakIndex).toBe(4);
    expect(result.fertileEndIndex).toBe(7);
    expect(result.phaseLabels).toEqual(['dry', 'dry', 'fertile', 'fertile', 'peak', 'fertile', 'fertile', 'fertile']);
  });

  it('Peak Reset', () => {
    const result = recalculateCycle(byRanks([0, 1, 3, 1, 3, 1, 0, 0, 0]));
    expect(result.peakIndex).toBe(4);
    expect(result.fertileStartIndex).toBe(1);
    expect(result.fertileEndIndex).toBe(7);
  });

  it('No Confirm (continuous 3s)', () => {
    const result = recalculateCycle(byRanks([0, 1, 3, 3, 3, 3]));
    expect(result.peakIndex).toBeNull();
    expect(result.fertileStartIndex).toBe(1);
    expect(result.fertileEndIndex).toBeNull();
  });

  it('Missing Day Blocks Confirmation', () => {
    const result = recalculateCycle(byRanks([0, 1, 3, null, 1, 0, 0]));
    expect(result.peakIndex).toBeNull();
  });

  it('Gradual Decline', () => {
    const result = recalculateCycle(byRanks([0, 1, 3, 2, 2, 1]));
    expect(result.peakIndex).toBe(2);
    expect(result.fertileEndIndex).toBe(5);
  });

  it('Continuous low-quality', () => {
    const result = recalculateCycle(byRanks([0, 1, 1, 1, 1, 1]));
    expect(result.peakIndex).toBeNull();
    expect(result.fertileStartIndex).toBe(1);
    expect(result.fertileEndIndex).toBeNull();
  });

  it('Multiple entries per day uses max rank', () => {
    const entries: DailyEntry[] = [
      { bleeding: 'none', observations: [{ sensation: 'damp', appearance: 'cloudy' }, { sensation: 'wet', appearance: 'cloudy' }] },
      { bleeding: 'none', observations: [{ sensation: 'dry', appearance: 'none' }, { sensation: 'slippery', appearance: 'cloudy' }] }
    ];
    const result = recalculateCycle(entries);
    expect(result.mucusRanks).toEqual([2, 3]);
  });

  it('heavy/moderate bleeding sequence starts a new cycle', () => {
    const entries: DailyEntry[] = [
      { bleeding: 'none', mucusRankOverride: 3 },
      { bleeding: 'none', mucusRankOverride: 1 },
      { bleeding: 'heavy', mucusRankOverride: 0 },
      { bleeding: 'moderate', mucusRankOverride: 0 },
      { bleeding: 'none', mucusRankOverride: 1 }
    ];
    const result = recalculateCycle(entries, { debug: true });
    expect(result.phaseLabels[0]).toBe('previous_cycle');
    expect(result.phaseLabels[1]).toBe('previous_cycle');
    expect(result.fertileStartIndex).toBe(4);
  });
});
