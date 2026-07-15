import { splitIntoCycles, type DailyEntry } from 'core-rules-engine';
import { buildCyclePdfHtml } from '../exportCyclePdf';

describe('buildCyclePdfHtml calendar-day output', () => {
  const eligible = {
    contextEligibility: 'eligible' as const,
    cycleBoundaryEligibility: 'eligible' as const,
  };

  it('keeps missing calendar dates visible instead of compressing entry rows', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 1 },
    ];
    const [cycle] = splitIntoCycles(entries);

    const html = buildCyclePdfHtml(cycle, false);
    const tableBody = html.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? '';
    const rows = tableBody.match(/<tr style="background:[\s\S]*?<\/tr>/g) ?? [];
    const missingDayRow = rows.find((row) => row.includes('January 2 2026')) ?? '';

    expect(cycle.length).toBe(3);
    expect(rows).toHaveLength(3);
    expect(missingDayRow).toContain('>2</td>');
    expect(html).toContain('focuses on recorded observations');
    expect(html).not.toContain('Chart Strength</th>');
    expect(html).not.toContain('>Phase</th>');
  });

  it('exports the latest Peak and P+ count when separated sequences both qualify', () => {
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
    const [cycle] = splitIntoCycles(entries);
    const html = buildCyclePdfHtml(cycle, false);

    expect(cycle.peakDay).toBe(6);
    expect(html).toContain('Possible fertile pattern');
    expect(html).toContain('through P+3 on January 9 2026');
    expect(html).toContain('Peak marker');
    expect(html).not.toContain('>Code</th>');
    expect(html).toContain('>Phase</th>');
    expect(html).not.toContain('Fertile Window');
  });

  it('withholds exact pattern boundaries for an ambiguous leading light-flow start', () => {
    const entries: DailyEntry[] = [
      {
        date: '2026-02-01',
        bleeding: 'light',
        menstrualFlowStart: 'uncertain',
        mucusRankOverride: 0,
      },
      { date: '2026-02-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-02-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-02-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-02-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const [cycle] = splitIntoCycles(entries);
    const html = buildCyclePdfHtml(cycle, false);

    expect(html).toContain('Confirm when this cycle started');
    expect(html).toContain('Cycle Day 1 has not been confirmed');
    expect(html).toContain('focuses on recorded observations');
    expect(html).not.toContain('We noticed a possible pattern in what you recorded');
    expect(html).not.toContain('>Phase</th>');
    expect(html).not.toContain('Fertile Window');
  });

  it('renders the engine-owned bounded model for a supported standard-context chart', () => {
    const entries: DailyEntry[] = [
      { date: '2026-03-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-03-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-03-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-03-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-03-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-03-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const [cycle] = splitIntoCycles(entries);
    const html = buildCyclePdfHtml(cycle, false);

    expect(html).toContain('Possible fertile pattern');
    expect(html).toContain('from March 2 2026 through P+3 on March 6 2026');
    expect(html).toContain('does not confirm ovulation');
    expect(html).toContain('Peak marker');
    expect(html).toContain('>Phase</th>');
    expect(html).toContain('Mucus sign');
    expect(html).not.toContain('>Code</th>');
    expect(html).not.toContain('Luteal Phase');
    expect(html).not.toContain('Fertile Window');
  });

  it('accepts an explicitly confirmed leading light-flow start', () => {
    const entries: DailyEntry[] = [
      {
        date: '2026-03-11',
        bleeding: 'light',
        menstrualFlowStart: 'confirmed',
        mucusRankOverride: 0,
      },
      { date: '2026-03-12', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-03-13', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-03-14', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-03-15', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-03-16', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const [cycle] = splitIntoCycles(entries);
    const html = buildCyclePdfHtml(cycle, false);

    expect(html).toContain('Possible fertile pattern');
    expect(html).toContain('from March 12 2026 through P+3 on March 16 2026');
    expect(html).toContain('Special contexts—including postpartum or breastfeeding');
    expect(html).toContain('>Phase</th>');
  });

  it('keeps a bounded band when later non-Peak mucus is recorded', () => {
    const entries: DailyEntry[] = [
      { date: '2026-04-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-04-02', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-04-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-04-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-04-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-04-06', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-04-07', bleeding: 'none', mucusRankOverride: 1 },
    ];
    const [cycle] = splitIntoCycles(entries);
    const html = buildCyclePdfHtml(cycle, false, {
      possibleFertilePatternEligibility: eligible,
    });

    expect(html).toContain('Possible fertile pattern');
    expect(html).toContain('from April 2 2026 through P+3 on April 6 2026');
    expect(html).toContain('>Phase</th>');
  });

  it('removes a stale bounded band when a later Peak-type sign reopens the pattern', () => {
    const entries: DailyEntry[] = [
      { date: '2026-04-11', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-04-12', bleeding: 'none', mucusRankOverride: 1 },
      { date: '2026-04-13', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-04-14', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-04-15', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-04-16', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-04-17', bleeding: 'none', mucusRankOverride: 3 },
    ];
    const [cycle] = splitIntoCycles(entries);
    const html = buildCyclePdfHtml(cycle, false, {
      possibleFertilePatternEligibility: eligible,
    });

    expect(html).toContain('Possible fertile pattern may be developing');
    expect(html).toContain('later Peak-type sign was recorded after the earlier P+3 count');
    expect(html).not.toContain('from April 12 2026 through P+3');
    expect(html).not.toContain('>Phase</th>');
  });

  it('uses reason-specific review copy for light bleeding plus mucus', () => {
    const entries: DailyEntry[] = [
      { date: '2026-05-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-05-02', bleeding: 'light', mucusRankOverride: 1 },
      { date: '2026-05-03', bleeding: 'none', mucusRankOverride: 3 },
      { date: '2026-05-04', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-05-05', bleeding: 'none', mucusRankOverride: 0 },
      { date: '2026-05-06', bleeding: 'none', mucusRankOverride: 0 },
    ];
    const [cycle] = splitIntoCycles(entries);
    const html = buildCyclePdfHtml(cycle, false, {
      possibleFertilePatternEligibility: eligible,
    });

    expect(html).toContain('Light menstrual flow and mucus were recorded together');
    expect(html).toContain('light menstrual flow and mucus were recorded on the same day');
    expect(html).toContain('focuses on recorded observations');
    expect(html).not.toContain('>Phase</th>');
  });
});
