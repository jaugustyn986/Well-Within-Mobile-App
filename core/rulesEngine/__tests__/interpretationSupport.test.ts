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

  it('uses the latest candidate after two separated sequences qualify', () => {
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
      status: 'summary_available',
      reason: 'retrospective_summary_available',
      confirmedPeakSequenceCount: 2,
    });

    const edited = entries.map((entry) =>
      entry.date === '2026-01-06' ? { ...entry, mucusRankOverride: 2 } : entry,
    );
    expect(evaluate(edited)).toMatchObject({
      status: 'summary_available',
      reason: 'retrospective_summary_available',
    });

    const removedLaterMucus = entries.map((entry) =>
      entry.date === '2026-01-06' ? { ...entry, mucusRankOverride: 0 } : entry,
    );
    expect(evaluate(removedLaterMucus).status).toBe('summary_available');
  });

  it('reopens while a later Peak-type candidate is still forming', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-07', bleeding: 'none', mucusRankOverride: 0 },
    ];
    expect(evaluate(entries)).toEqual({
      status: 'forming',
      reason: 'later_peak_type_reopens_pattern',
      confirmedPeakSequenceCount: 1,
    });
  });

  it('keeps the summary available when later non-Peak mucus follows P+3', () => {
    const entries: DailyEntry[] = [
      { date: '2026-02-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-02-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-02-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-02-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-06', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-07', bleeding: 'none', mucusRankOverride: 1 },
    ];
    expect(evaluate(entries)).toEqual({
      status: 'summary_available',
      reason: 'retrospective_summary_available',
      confirmedPeakSequenceCount: 1,
    });
  });

  it('routes light or spotting plus mucus to review', () => {
    const entries: DailyEntry[] = [
      { date: '2026-03-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-03-02', bleeding: 'spotting', mucusRankOverride: 1 },
      { date: '2026-03-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-03-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-03-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-03-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    expect(evaluate(entries)).toMatchObject({
      status: 'review_recommended',
      reason: 'bleeding_mucus_ambiguity',
    });
  });
});
