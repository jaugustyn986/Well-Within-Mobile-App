import { computeMucusRank } from '../src/rank';

describe('computeMucusRank', () => {
  it('maps dry+none to 0', () => {
    expect(computeMucusRank({ sensation: 'dry', appearance: 'none' })).toBe(0);
  });

  it('maps slippery or clear/stretchy to 3', () => {
    expect(computeMucusRank({ sensation: 'slippery', appearance: 'cloudy' })).toBe(3);
    expect(computeMucusRank({ sensation: 'damp', appearance: 'clear' })).toBe(3);
    expect(computeMucusRank({ sensation: 'wet', appearance: 'stretchy' })).toBe(3);
  });

  it('maps wet to 2, damp to 1', () => {
    expect(computeMucusRank({ sensation: 'wet', appearance: 'cloudy' })).toBe(2);
    expect(computeMucusRank({ sensation: 'damp', appearance: 'cloudy' })).toBe(1);
  });

  it('returns null for missing entry and max for multi-observations', () => {
    expect(computeMucusRank(null)).toBeNull();
    expect(computeMucusRank({ missing: true })).toBeNull();
    expect(
      computeMucusRank({
        observations: [
          { sensation: 'damp', appearance: 'cloudy' },
          { sensation: 'wet', appearance: 'cloudy' }
        ]
      })
    ).toBe(2);
  });

  it('uses clamped override when supplied', () => {
    expect(computeMucusRank({ mucusRankOverride: 9 })).toBe(3);
    expect(computeMucusRank({ mucusRankOverride: -3 })).toBe(0);
  });
});
