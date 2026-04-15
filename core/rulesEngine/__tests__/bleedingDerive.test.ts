import { deriveBleedingMetadata } from '../src/bleedingDerive';
import { DailyEntry } from '../src/types';

function entry(bleeding: DailyEntry['bleeding']): DailyEntry {
  return { bleeding };
}

describe('deriveBleedingMetadata', () => {
  it('classifies brown the day before cycle start as pre_flow', () => {
    const entries: DailyEntry[] = [
      entry('brown'),
      entry('heavy'),
      entry('none'),
    ];
    const { brownBleedingContextByDay } = deriveBleedingMetadata(entries, 1, false, null);
    expect(brownBleedingContextByDay[0]).toBe('pre_flow');
  });

  it('classifies brown after fertile end as post_peak when peak is confirmed', () => {
    const entries: DailyEntry[] = [
      entry('heavy'),
      ...Array.from({ length: 6 }, () => entry('none')),
      entry('brown'),
    ];
    const fertileEndIndex = 5;
    const { brownBleedingContextByDay } = deriveBleedingMetadata(
      entries,
      0,
      true,
      fertileEndIndex,
    );
    expect(brownBleedingContextByDay[7]).toBe('post_peak');
  });

  it('uses mid_cycle for brown when not pre-flow and not post-peak', () => {
    const entries: DailyEntry[] = [entry('heavy'), entry('brown'), entry('none')];
    const { brownBleedingContextByDay } = deriveBleedingMetadata(entries, 1, false, null);
    expect(brownBleedingContextByDay[1]).toBe('mid_cycle');
  });

  it('maps heavy on cycle start to cycle_start_flow and later heavy to continuing_menses', () => {
    const entries: DailyEntry[] = [entry('heavy'), entry('heavy')];
    const { bleedingClassByDay } = deriveBleedingMetadata(entries, 0, false, null);
    expect(bleedingClassByDay[0]).toBe('cycle_start_flow');
    expect(bleedingClassByDay[1]).toBe('continuing_menses');
  });

  it('treats post-peak spotting when peak confirmed and past fertile end', () => {
    const entries: DailyEntry[] = [
      entry('heavy'),
      ...Array.from({ length: 5 }, () => entry('none')),
      entry('spotting'),
    ];
    const { bleedingClassByDay } = deriveBleedingMetadata(entries, 0, true, 5);
    expect(bleedingClassByDay[6]).toBe('post_peak_spotting');
  });
});
