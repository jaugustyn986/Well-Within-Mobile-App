import { recalculateCycle } from '../src/recalc';
import {
  derivePrimaryDayClassAtIndex,
  derivePrimaryDayClassFromEntry,
} from '../src/primaryDayClass';
import { BleedingClass } from '../src/types';

describe('primaryDayClassByDay', () => {
  it('classifies moderate bleeding with rank 3 as menstrual_flow, not peak candidate', () => {
    const r = recalculateCycle([
      { date: '2026-01-01', bleeding: 'moderate', mucusRankOverride: 3 },
    ]);
    expect(r.primaryDayClassByDay[0]).toBe('menstrual_flow');
    expect(r.peakCandidateIndex).toBeNull();
    expect(r.peakIndex).toBeNull();
  });

  it('post-peak spotting with mucus uses mucus tier, not menstrual red class', () => {
    const r = recalculateCycle([
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 2 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 2 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-07', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-08', bleeding: 'spotting', mucusRankOverride: 2 },
    ]);
    const idx = 7;
    expect(r.bleedingClassByDay[idx]).toBe('post_peak_spotting');
    expect(r.primaryDayClassByDay[idx]).toBe('mucus_observed');
  });
});

describe('derivePrimaryDayClassFromEntry (draft / form preview)', () => {
  it('heavy bleeding forces menstrual_flow regardless of rank', () => {
    expect(
      derivePrimaryDayClassFromEntry(
        { bleeding: 'heavy', sensation: 'wet', appearances: ['lubricative'] },
        3,
      ),
    ).toBe('menstrual_flow');
  });

  it('spotting with rank 0 stays spotting; brown follows mucus tier', () => {
    expect(derivePrimaryDayClassFromEntry({ bleeding: 'spotting' }, 0)).toBe('spotting');
    expect(derivePrimaryDayClassFromEntry({ bleeding: 'brown' }, 3)).toBe('peak_type');
  });

  it('treats no bleeding like mucus-only for preview', () => {
    expect(derivePrimaryDayClassFromEntry({ bleeding: 'none' }, 2)).toBe('mucus_observed');
  });
});

describe('derivePrimaryDayClassAtIndex', () => {
  it('uses mucus tier for brown_discharge and intermenstrual bleed classes', () => {
    const entries = [{ bleeding: 'none' as const }];
    expect(
      derivePrimaryDayClassAtIndex(0, entries, [3], ['brown_discharge' as BleedingClass]),
    ).toBe('peak_type');
    expect(
      derivePrimaryDayClassAtIndex(0, entries, [2], ['intermenstrual' as BleedingClass]),
    ).toBe('mucus_observed');
  });

  it('post_peak_spotting with rank 0 stays spotting', () => {
    expect(
      derivePrimaryDayClassAtIndex(
        0,
        [{ bleeding: 'none' }],
        [0],
        ['post_peak_spotting' as BleedingClass],
      ),
    ).toBe('spotting');
  });

  it('classifies plain spotting with rank 0 as spotting', () => {
    expect(
      derivePrimaryDayClassAtIndex(
        0,
        [{ bleeding: 'none' }],
        [0],
        ['spotting' as BleedingClass],
      ),
    ).toBe('spotting');
  });
});
