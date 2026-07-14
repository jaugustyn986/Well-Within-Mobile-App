import { resolveCycleBoundaries } from '../src/cycleBoundary';
import { buildCalendarAlignedCycleDays, splitIntoCycles } from '../src/multiCycle';
import { recalculateCycle } from '../src/recalc';
import type { DailyEntry } from '../src/types';

describe('cycle boundary resolution', () => {
  it('uses confirmed leading light as Cycle Day 1 and does not let later H/M override it', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'none', mucusRankOverride: 0 },
      {
        date: '2026-01-02',
        bleeding: 'light',
        menstrualFlowStart: 'confirmed',
        mucusRankOverride: 0,
      },
      { date: '2026-01-03', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-04', bleeding: 'moderate', mucusRankOverride: 0 },
      { date: '2026-01-05', bleeding: 'none', mucusRankOverride: 1 },
    ];

    const resolution = resolveCycleBoundaries(entries);
    expect(resolution.groups).toHaveLength(1);
    expect(resolution.currentCycleStartIndex).toBe(1);
    expect(resolution.currentCycleBoundary).toMatchObject({
      index: 1,
      date: '2026-01-02',
      source: 'confirmed_true_flow',
      eligibility: 'eligible',
      reason: 'confirmed_true_flow_start',
    });

    const result = recalculateCycle(entries);
    expect(result.phaseLabels[0]).toBe('previous_cycle');
    expect(result.phaseLabels[1]).toBe('dry');
    expect(result.phaseLabels[2]).toBe('dry');
    expect(result.fertileStartIndex).toBe(4);

    const [cycle] = splitIntoCycles(entries);
    expect(cycle.startDate).toBe('2026-01-02');
    expect(cycle.length).toBe(4);
    expect(cycle.entries[0].date).toBe('2026-01-02');
    expect(cycle.cycleBoundary).toMatchObject({
      index: 0,
      date: '2026-01-02',
      eligibility: 'eligible',
    });
  });

  it('anchors an eligible inferred H/M boundary after a stored dry preamble', () => {
    const entries: DailyEntry[] = [
      { date: '2026-02-01', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-02', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-03', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-02-04', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-02-05', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-02-06', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-07', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-08', bleeding: 'none', mucusRankOverride: 0 },
    ];

    const [cycle] = splitIntoCycles(entries);
    expect(cycle.cycleBoundary).toMatchObject({
      index: 2,
      date: '2026-02-03',
      eligibility: 'eligible',
      reason: 'unambiguous_heavy_moderate_start',
    });
    expect(cycle.startDate).toBe('2026-02-03');
    expect(cycle.length).toBe(6);
    expect(cycle.peakDay).toBe(3);
    expect(buildCalendarAlignedCycleDays(cycle)[0]).toMatchObject({
      date: '2026-02-03',
      cycleDay: 1,
      entryIndex: 2,
    });
  });

  it('preserves legacy leading-light grouping but marks the boundary unknown', () => {
    const entries: DailyEntry[] = [
      { date: '2026-03-01', bleeding: 'light', mucusRankOverride: 0 },
      { date: '2026-03-02', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-03-03', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const [cycle] = splitIntoCycles(entries);
    expect(cycle.entries[0].date).toBe('2026-03-01');
    expect(cycle.startDate).toBe('2026-03-01');
    expect(cycle.cycleBoundary).toMatchObject({
      index: 1,
      date: null,
      eligibility: 'unknown',
      reason: 'ambiguous_leading_light_flow',
    });
  });

  it('treats an explicitly not-start leading light as an eligible H/M boundary', () => {
    const resolution = resolveCycleBoundaries([
      {
        date: '2026-04-01',
        bleeding: 'light',
        menstrualFlowStart: 'not_start',
      },
      { date: '2026-04-02', bleeding: 'moderate' },
    ]);
    expect(resolution.currentCycleBoundary).toMatchObject({
      index: 1,
      date: '2026-04-02',
      eligibility: 'eligible',
      reason: 'unambiguous_heavy_moderate_start',
    });
  });

  it('keeps an uncertain leading light unresolved', () => {
    const resolution = resolveCycleBoundaries([
      {
        date: '2026-05-01',
        bleeding: 'light',
        menstrualFlowStart: 'uncertain',
      },
      { date: '2026-05-02', bleeding: 'heavy' },
    ]);
    expect(resolution.currentCycleBoundary).toMatchObject({
      index: 1,
      date: null,
      eligibility: 'unknown',
      reason: 'uncertain_start_marker',
    });
  });

  it.each([
    ['not_start', 'ineligible', 'explicit_not_start'],
    ['uncertain', 'unknown', 'uncertain_start_marker'],
  ] as const)(
    'honors an H/M %s marker without inventing an exact boundary',
    (menstrualFlowStart, eligibility, reason) => {
      const resolution = resolveCycleBoundaries([
        {
          date: '2026-05-10',
          bleeding: 'heavy',
          menstrualFlowStart,
        },
      ]);
      expect(resolution.currentCycleBoundary).toMatchObject({
        date: null,
        eligibility,
        reason,
      });
    },
  );

  it('rejects a lone confirmed marker that contradicts earlier unmarked true flow', () => {
    const resolution = resolveCycleBoundaries([
      { date: '2026-05-20', bleeding: 'light' },
      {
        date: '2026-05-21',
        bleeding: 'heavy',
        menstrualFlowStart: 'confirmed',
      },
    ]);
    expect(resolution.currentCycleBoundary).toMatchObject({
      date: null,
      eligibility: 'ineligible',
      reason: 'invalid_confirmed_start_marker',
    });
  });

  it('orders separate confirmed flow starts and suppresses a later H/M reset', () => {
    const resolution = resolveCycleBoundaries([
      {
        date: '2026-05-25',
        bleeding: 'heavy',
        menstrualFlowStart: 'confirmed',
      },
      { date: '2026-05-26', bleeding: 'none' },
      {
        date: '2026-06-20',
        bleeding: 'light',
        menstrualFlowStart: 'confirmed',
      },
      { date: '2026-06-21', bleeding: 'heavy' },
    ]);
    expect(resolution.groups.map((group) => group.boundary)).toMatchObject([
      { index: 0, date: '2026-05-25', eligibility: 'eligible' },
      { index: 2, date: '2026-06-20', eligibility: 'eligible' },
    ]);
    expect(resolution.currentCycleStartIndex).toBe(2);
  });

  it.each(['spotting', 'brown', 'none'] as const)(
    'rejects a confirmed marker on %s',
    (bleeding) => {
      const resolution = resolveCycleBoundaries([
        {
          date: '2026-06-01',
          bleeding,
          menstrualFlowStart: 'confirmed',
        },
        { date: '2026-06-02', bleeding: 'heavy' },
      ]);
      expect(resolution.currentCycleBoundary).toMatchObject({
        date: null,
        eligibility: 'ineligible',
        reason: 'invalid_confirmed_start_marker',
      });
    },
  );

  it('rejects duplicate confirmed markers in one true-flow run', () => {
    const resolution = resolveCycleBoundaries([
      {
        date: '2026-07-01',
        bleeding: 'light',
        menstrualFlowStart: 'confirmed',
      },
      {
        date: '2026-07-02',
        bleeding: 'heavy',
        menstrualFlowStart: 'confirmed',
      },
    ]);
    expect(resolution.currentCycleStartIndex).toBe(0);
    expect(resolution.currentCycleBoundary).toMatchObject({
      date: null,
      eligibility: 'ineligible',
      reason: 'duplicate_confirmed_start_marker',
    });
  });

  it.each<{ label: string; entries: DailyEntry[] }>([
    {
      label: 'duplicate',
      entries: [
        { date: '2026-08-01', bleeding: 'heavy' },
        { date: '2026-08-01', bleeding: 'none' },
      ],
    },
    {
      label: 'out-of-order',
      entries: [
        { date: '2026-08-02', bleeding: 'heavy' },
        { date: '2026-08-01', bleeding: 'none' },
      ],
    },
    {
      label: 'missing',
      entries: [
        { bleeding: 'heavy' },
        { date: '2026-08-02', bleeding: 'none' },
      ],
    },
  ])('fails closed for $label dates', ({ entries }) => {
    const resolution = resolveCycleBoundaries(entries);
    expect(resolution.datesStrictlyIncreasing).toBe(false);
    expect(resolution.currentCycleBoundary).toMatchObject({
      date: null,
      eligibility: 'ineligible',
      reason: 'invalid_or_unresolved_dates',
    });
  });
});
