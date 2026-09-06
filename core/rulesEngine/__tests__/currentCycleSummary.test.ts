import { buildCurrentCycleSummary } from '../src/currentCycleSummary';
import { CycleComparisonStructured } from '../src/cycleComparisonSummary';
import { recalculateCycle } from '../src/recalc';
import { DailyEntry } from '../src/types';

function sliceResult(entries: DailyEntry[]) {
  return recalculateCycle(entries);
}

describe('buildCurrentCycleSummary', () => {
  it('surfaces interpretationNotes from engine warnings', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 1 },
    ];
    const result = sliceResult(entries);
    result.interpretationWarnings.push('uncertain_fertile_start');
    const summary = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 1,
    });
    expect(result.interpretationWarnings).toContain('uncertain_fertile_start');
    expect(summary.interpretationNotes).toHaveLength(1);
    expect(summary.interpretationNotes[0]).toContain('fertile');
  });


  it('returns empty-state summary when there are no entries', () => {
    const r = sliceResult([]);
    const s = buildCurrentCycleSummary({
      entries: [],
      result: r,
      status: 'no_peak',
      todayIndex: null,
    });
    expect(s.cycleDay).toBeNull();
    expect(s.headline).toBe('Your chart is ready when you are');
    expect(s.statusLine).toBe(
      'Your first observation gives Well Within a place to begin.',
    );
    expect(s.supportingContext).toBe('');
    expect(s.completeness).toBe('');
    expect(s.guidance).toBe('Log today’s observation when you’re ready.');
    expect(s.focusQualification).toBeNull();
    expect(s.summaryTone).toBe('neutral');
    expect(s.interpretationNotes).toEqual([]);
    expect(s.explanationTarget).toBeNull();
  });

  it('uses shortened focus qualification when todayIndex is null', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: null,
    });
    expect(s.focusQualification).toBe(
      'No entry today. Showing your last logged day.',
    );
    expect(s.cycleDay).toBe(2);
  });

  it('uses elapsed calendar dates for cycle day when a row is absent', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 1,
    });
    expect(s.cycleDay).toBe(3);
  });

  it('does not present confidence language when a recent calendar date is absent', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 2,
    });
    expect(s.statusLine).toBe('No mucus signs are recorded for this day.');
    expect(s.statusLine).not.toContain('confidence');
  });

  it('omits focusQualification when todayIndex is set', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 1,
    });
    expect(s.focusQualification).toBeNull();
    expect(s.cycleDay).toBe(2);
  });

  it('prefers missing-data headline over no_peak status', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', missing: true, mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 1,
    });
    expect(s.headline).toBe('This day was marked not observed');
    expect(s.statusLine).toBe(
      'There is no observation to interpret for this day.',
    );
    expect(s.supportingContext).toBe('');
    expect(s.summaryTone).toBe('caution');
    expect(s.explanationTarget).toBe('status_messages');
  });

  it('uses phase headline for no_peak when focus day is charted', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 2,
    });
    expect(s.headline).toBe('Your pattern is still taking shape');
    expect(s.statusLine).toBe('No mucus signs are recorded for this day.');
    expect(s.supportingContext).toBe('');
    expect(s.guidance).toContain('This card will update');
    expect(s.summaryTone).toBe('neutral');
  });

  it('completeness counts days marked missing: true', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', missing: true, mucusRankOverride: 0 },
      { date: '2026-01-03', missing: true, mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 2,
    });
    expect(s.completeness).toBe('2 days still open in this cycle');
  });

  it('handles an undated legacy row without losing its not-observed state', () => {
    const entries: DailyEntry[] = [
      { bleeding: 'heavy', mucusRankOverride: 0 },
      { missing: true, mucusRankOverride: 0 },
      { bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 2,
    });
    expect(s.cycleDay).toBe(3);
    expect(s.completeness).toBe('1 day still open in this cycle');
    expect(s.baselineContext).toBeNull();
  });

  it('completeness counts calendar gaps between first and last logged dates', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 1,
    });
    expect(s.completeness).toBe('1 day still open in this cycle');
  });

  it('completeness counts unlogged days after last entry through calendarAsOfDate for in-progress cycles', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 0,
      calendarAsOfDate: '2026-01-04',
    });
    expect(s.completeness).toBe('3 days still open in this cycle');
  });

  it('uses fertile headline and guidance for no_peak single day with mucus', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'none', mucusRankOverride: 1 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 0,
    });
    expect(s.supportingContext).toBe('');
    expect(s.headline).toBe('Your chart shows mucus signs');
    expect(s.statusLine).toContain('does not show a Peak-type day yet');
    expect(s.guidance).toContain('pattern develops');
  });

  it('explains a possible Peak Day without crowding the card', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 3 },
    ];
    const result = sliceResult(entries);
    expect(result.phaseLabels[3]).toBe('fertile_unconfirmed_peak');
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 3,
    });
    expect(s.headline).toBe('Your chart shows a possible Peak Day');
    expect(s.statusLine).toContain('Cycle Day 4 has a Peak-type sign');
    expect(s.statusLine).toContain('waits three days');
    expect(s.supportingContext).toBe('');
    expect(s.guidance).toBe('Keep charting daily as the pattern develops.');
    expect(s.explanationTarget).toBe('peak_day');
  });

  it('keeps menstrual-flow messaging observational and concise', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 1 },
    ];
    const s = buildCurrentCycleSummary({
      entries,
      result: sliceResult(entries),
      status: 'no_peak',
      todayIndex: 0,
    });
    expect(s.headline).toBe('Menstrual flow recorded');
    expect(s.statusLine).toBe('This day is recorded as menstrual flow.');
    expect(s.guidance).toContain('does not interpret it as Peak-type');
    expect(s.explanationTarget).toBeNull();
  });

  it('keeps spotting messaging observational and concise', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'spotting', mucusRankOverride: 0 },
    ];
    const s = buildCurrentCycleSummary({
      entries,
      result: sliceResult(entries),
      status: 'no_peak',
      todayIndex: 0,
    });
    expect(s.headline).toBe('Spotting recorded');
    expect(s.statusLine).toContain('spotting with a dry observation');
    expect(s.guidance).toContain('does not replace');
    expect(s.explanationTarget).toBeNull();
  });

  it('asks for the missing sensation when an incomplete spotting day blocks P+ follow-up', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-03', bleeding: 'spotting' },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 2,
    });

    expect(s.interpretationStatus).toBe('blocked_by_missing');
    expect(s.interpretationReason).toBe('incomplete_observation');
    expect(s.headline).toBe('Spotting recorded');
    expect(s.statusLine).toBe(
      'Choose a sensation—including Dry—to complete this observation.',
    );
    expect(s.guidance).toContain('will not count toward the three-day Peak follow-up');
    expect(s.explanationTarget).toBeNull();
  });

  it('p_plus_2: explains why the chart marks Peak Day', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    expect(result.phaseLabels[4]).toBe('p_plus_2');
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 4,
    });
    expect(s.headline).toBe('Your chart marks Cycle Day 3 as Peak Day');
    expect(s.statusLine).toBe(
      'Cycle Day 3 was the last Peak-type sign before three days without another one, so your chart marks it as Peak Day.',
    );
    expect(s.supportingContext).toBe(
      'This reflects what you recorded; it does not confirm ovulation.',
    );
    expect(s.guidance).toBe(
      'Keep charting daily. This summary updates when your observations change.',
    );
    expect(s.explanationTarget).toBe('peak_day');
  });

  it('p_plus_3: explains the post-Peak pattern without claiming ovulation', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    expect(result.phaseLabels[5]).toBe('p_plus_3');
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 5,
    });
    expect(s.headline).toBe('Your chart shows a post-Peak pattern');
    expect(s.statusLine).toBe(
      'Cycle Day 3 was the last Peak-type sign before three days without another one, so your chart marks it as Peak Day.',
    );
    expect(s.supportingContext).toBe(
      'This reflects what you recorded; it does not confirm ovulation.',
    );
    expect(s.guidance).toBe(
      'Keep charting daily. This summary updates when your observations change.',
    );
    expect(s.guidance).not.toContain('non-peak-type');
    expect(s.summaryTone).toBe('positive');
  });

  it('peak_confirmed: names the marked Peak Day and supporting observations', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    expect(result.phaseLabels[2]).toBe('peak_confirmed');
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 2,
    });
    expect(s.headline).toBe('Your chart marks Cycle Day 3 as Peak Day');
    expect(s.statusLine).toContain('before three days without another one');
    expect(s.supportingContext).toContain('does not confirm ovulation');
    expect(s.guidance).toContain('Keep charting daily');
  });

  it('post_peak phase explains evidence and the next step', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-07', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const idx = 6;
    expect(result.phaseLabels[idx]).toBe('post_peak');
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: idx,
    });
    expect(s.headline).toBe('Your chart shows a post-Peak pattern');
    expect(s.statusLine).toContain('Cycle Day 3 was the last Peak-type sign');
    expect(s.supportingContext).toContain('does not confirm ovulation');
    expect(s.guidance).toContain('summary updates');
  });

  it('keeps an earlier post-P+3 summary when later non-Peak mucus is recorded', () => {
    const entries: DailyEntry[] = [
      { date: '2026-02-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-02-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-02-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-02-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-06', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-07', bleeding: 'none', mucusRankOverride: 1 },
    ];
    const s = buildCurrentCycleSummary({
      entries,
      result: sliceResult(entries),
      status: 'in_progress',
      todayIndex: 6,
      possibleFertilePatternEligibility: {
        contextEligibility: 'eligible',
        cycleBoundaryEligibility: 'eligible',
      },
    });
    expect(s.interpretationStatus).toBe('summary_available');
    expect(s.interpretationReason).toBe('retrospective_summary_available');
    expect(s.headline).toBe('Your chart shows a post-Peak pattern');
    expect(s.possibleFertilePattern.state).toBe('bounded');
    expect(s.possibleFertilePattern.start?.date).toBe('2026-02-02');
    expect(s.possibleFertilePattern.pPlus3?.date).toBe('2026-02-06');
  });

  it('reopens an earlier post-P+3 summary for a later Peak-type sign', () => {
    const entries: DailyEntry[] = [
      { date: '2026-02-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-02-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-02-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-02-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-06', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-07', bleeding: 'none', mucusRankOverride: 3 },
    ];
    const s = buildCurrentCycleSummary({
      entries,
      result: sliceResult(entries),
      status: 'in_progress',
      todayIndex: 6,
      possibleFertilePatternEligibility: {
        contextEligibility: 'eligible',
        cycleBoundaryEligibility: 'eligible',
      },
    });
    expect(s.interpretationStatus).toBe('forming');
    expect(s.interpretationReason).toBe('later_peak_type_reopens_pattern');
    expect(s.headline).toBe('Possible fertile pattern may be developing');
    expect(s.statusLine).toContain('later Peak-type sign');
    expect(s.possibleFertilePattern.state).toBe('developing');
  });

  it('avoids confidence language when a recent observation is missing', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', missing: true, mucusRankOverride: 0 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 4,
    });
    expect(s.headline).not.toBe('This day was marked not observed');
    expect(s.statusLine).toBe('No mucus signs are recorded for this day.');
  });

  it('zero missing entries uses tightened completeness copy', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 0,
    });
    expect(s.completeness).toBe('No gaps in your chart this cycle');
  });
});

describe('compact support field + baseline context', () => {
  const baseComparison: CycleComparisonStructured = {
    lengthVsPrior: 'similar',
    peakVsPrior: 'similar',
    lutealVsPrior: 'similar',
    patternVariation: 'low',
    priorSampleSize: 3,
    completedCyclesTotal: 3,
    avgPeakDay: 15,
    avgFertileStartDay: 11,
  };

  it('empty state: compactSupportField is guidance, no baseline', () => {
    const r = sliceResult([]);
    const s = buildCurrentCycleSummary({
      entries: [],
      result: r,
      status: 'no_peak',
      todayIndex: null,
    });
    expect(s.compactSupportField).toBe('guidance');
    expect(s.baselineContext).toBeNull();
  });

  it('forming dry pattern suppresses anticipatory baseline context', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'moderate', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-07', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-08', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 7,
      baselineComparison: baseComparison,
    });
    expect(s.baselineContext).toBeNull();
    expect(s.compactSupportField).toBe('guidance');
  });

  it('dry pattern without baseline: falls back to guidance', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 1,
    });
    expect(s.baselineContext).toBeNull();
    expect(s.compactSupportField).toBe('guidance');
  });

  it('dry pattern: no baseline when priorSampleSize < 2', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const lowSample: CycleComparisonStructured = {
      ...baseComparison,
      priorSampleSize: 1,
    };
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 1,
      baselineComparison: lowSample,
    });
    expect(s.baselineContext).toBeNull();
  });

  it('suppresses prior fertile timing when reviewing an earlier dry day', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-07', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    expect(result.phaseLabels[1]).toBe('dry');
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 1,
      baselineComparison: baseComparison,
    });
    expect(s.interpretationStatus).toBe('summary_available');
    expect(s.baselineContext).toBeNull();
    expect(s.compactSupportField).toBe('guidance');
  });

  it('omits prior fertile timing when the comparison has no fertile-start average', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-07', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const s = buildCurrentCycleSummary({
      entries,
      result: sliceResult(entries),
      status: 'in_progress',
      todayIndex: 1,
      baselineComparison: {
        ...baseComparison,
        avgFertileStartDay: null,
      },
    });
    expect(s.baselineContext).toBeNull();
    expect(s.compactSupportField).toBe('guidance');
  });

  it('fertile open with baseline: suppresses active-cycle average timing', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    expect(result.phaseLabels[1]).toBe('fertile_open');
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 1,
      baselineComparison: baseComparison,
    });
    expect(s.baselineContext).toBeNull();
    expect(s.compactSupportField).toBe('guidance');
  });

  it('P+1: clear next step, no baseline', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    expect(result.phaseLabels[3]).toBe('p_plus_1');
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 3,
      baselineComparison: baseComparison,
    });
    expect(s.baselineContext).toBeNull();
    expect(s.compactSupportField).toBe('guidance');
    expect(s.guidance).toContain('Keep charting daily');
  });

  it('P+2: clear next step, no baseline', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    expect(result.phaseLabels[4]).toBe('p_plus_2');
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 4,
      baselineComparison: baseComparison,
    });
    expect(s.baselineContext).toBeNull();
    expect(s.compactSupportField).toBe('guidance');
    expect(s.guidance).toContain('Keep charting daily');
  });

  it('P+3: no baseline, guidance about confirmation', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    expect(result.phaseLabels[5]).toBe('p_plus_3');
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 5,
      baselineComparison: baseComparison,
    });
    expect(s.baselineContext).toBeNull();
    expect(s.compactSupportField).toBe('guidance');
    expect(s.headline).toBe('Your chart shows a post-Peak pattern');
    expect(s.statusLine).toContain('Cycle Day 3 was the last Peak-type sign');
  });

  it('post-peak with later peak: keeps comparison timing out of the active summary', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-07', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    expect(result.phaseLabels[6]).toBe('post_peak');
    const laterComparison: CycleComparisonStructured = {
      ...baseComparison,
      peakVsPrior: 'later',
    };
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 6,
      baselineComparison: laterComparison,
    });
    expect(s.baselineContext).toBeNull();
    expect(s.compactSupportField).toBe('guidance');
  });

  it('missing day: limited summary, interpretationNote takes priority', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', missing: true, mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'no_peak',
      todayIndex: 1,
      baselineComparison: baseComparison,
    });
    expect(s.statusLine).toBe(
      'There is no observation to interpret for this day.',
    );
    expect(s.baselineContext).toBeNull();
  });

  it('limited summary suppresses baseline even when comparison is provided', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', missing: true, mucusRankOverride: 0 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 3,
      baselineComparison: baseComparison,
    });
    expect(s.statusLine).toBe('No mucus signs are recorded for this day.');
    expect(s.baselineContext).toBeNull();
  });

  it('peak_confirmed with similar peak: no baseline context', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const result = sliceResult(entries);
    expect(result.phaseLabels[2]).toBe('peak_confirmed');
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 2,
      baselineComparison: baseComparison,
    });
    expect(s.baselineContext).toBeNull();
    expect(s.compactSupportField).toBe('guidance');
  });

  it('dry cycle day past avgFertileStartDay: no baseline shown', () => {
    const entries: DailyEntry[] = Array.from({ length: 14 }, (_, i) => ({
      date: `2026-01-${String(i + 1).padStart(2, '0')}`,
      bleeding: i === 0 ? ('heavy' as const) : ('none' as const),
      mucusRankOverride: 0,
    }));
    const result = sliceResult(entries);
    const s = buildCurrentCycleSummary({
      entries,
      result,
      status: 'in_progress',
      todayIndex: 13,
      baselineComparison: baseComparison,
    });
    expect(s.baselineContext).toBeNull();
  });
});

describe('interpretation support states', () => {
  it('turns a missing confirmation date into a non-stranding blocked state', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const s = buildCurrentCycleSummary({
      entries,
      result: sliceResult(entries),
      status: 'no_peak',
      todayIndex: 3,
    });
    expect(s.interpretationStatus).toBe('blocked_by_missing');
    expect(s.headline).toBe('One observation is missing');
    expect(s.statusLine).toContain('An observation is missing from the three days');
    expect(s.guidance).toContain('Keep charting');
    expect(s.statusLine).not.toContain('confidence');
    expect(s.explanationTarget).toBe('status_messages');
  });

  it('explains when a day marked not observed interrupts Peak confirmation', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-02', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-01-03', missing: true, mucusRankOverride: 0 },
      { date: '2026-01-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const s = buildCurrentCycleSummary({
      entries,
      result: sliceResult(entries),
      status: 'no_peak',
      todayIndex: 4,
    });
    expect(s.interpretationStatus).toBe('blocked_by_missing');
    expect(s.interpretationReason).toBe('not_observed');
    expect(s.headline).toBe('One day was not observed');
    expect(s.statusLine).toContain('is marked Not observed');
    expect(s.guidance).toContain('Keep charting');
  });

  it('summarizes the latest Peak when two separated sequences qualify', () => {
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
    const s = buildCurrentCycleSummary({
      entries,
      result: sliceResult(entries),
      status: 'in_progress',
      todayIndex: 8,
    });
    expect(s.interpretationStatus).toBe('summary_available');
    expect(s.headline).toBe('Your chart shows a post-Peak pattern');
    expect(s.statusLine).toContain('Cycle Day 6');
    expect(s.statusLine).toContain('before three days');
    expect(s.explanationTarget).toBe('peak_day');
  });
});
