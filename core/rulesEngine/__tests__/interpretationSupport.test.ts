import { evaluateInterpretationSupport } from '../src/interpretationSupport';
import { recalculateCycle } from '../src/recalc';
import type { DailyEntry } from '../src/types';

function evaluate(entries: DailyEntry[]) {
  return evaluateInterpretationSupport(entries, recalculateCycle(entries));
}

describe('evaluateInterpretationSupport', () => {
  it('keeps an incomplete standard chart in forming', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
    ];
    expect(evaluate(entries)).toMatchObject({
      status: 'forming',
      reason: 'insufficient_pattern_data',
    });
  });

  it('makes a retrospective summary available after one confirmed sequence', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
    ];
    expect(evaluate(entries)).toMatchObject({
      status: 'summary_available',
      confirmedPeakSequenceCount: 1,
    });
  });

  it('blocks automatic interpretation when a calendar gap interrupts confirmation', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
    ];
    expect(evaluate(entries)).toMatchObject({
      status: 'blocked_by_missing',
      reason: 'calendar_gap',
    });
  });

  it('recommends optional review instead of selecting between two confirmed sequences', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-07', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-08', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-09', bleeding: 'none', mucusRankOverride: 0 },
    ];
    expect(evaluate(entries)).toEqual({
      status: 'review_recommended',
      reason: 'multiple_confirmed_peak_sequences',
      confirmedPeakSequenceCount: 2,
    });

    const edited = entries.map((entry) =>
      entry.date === '2026-01-06' ? { ...entry, mucusRankOverride: 2 } : entry,
    );
    expect(evaluate(edited).status).toBe('summary_available');
  });
});
