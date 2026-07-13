import { splitIntoCycles, type DailyEntry } from 'core-rules-engine';
import { buildCyclePdfHtml } from '../exportCyclePdf';

describe('buildCyclePdfHtml calendar-day output', () => {
  it('keeps missing calendar dates visible instead of compressing entry rows', () => {
    const entries: DailyEntry[] = [
      { date: '2026-01-01', bleeding: 'heavy', mucusRankOverride: 0 },
      { date: '2026-01-03', bleeding: 'none', mucusRankOverride: 1 },
    ];
    const [cycle] = splitIntoCycles(entries);

    const html = buildCyclePdfHtml(cycle, false);
    const tableBody = html.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? '';
    const rows = tableBody.match(/<tr style="background:[\s\S]*?<\/tr>/g) ?? [];
    const missingDayRow = rows.find((row) => row.includes('2026-01-02')) ?? '';

    expect(cycle.length).toBe(3);
    expect(rows).toHaveLength(3);
    expect(missingDayRow).toContain('>2</td>');
    expect(html).toContain('focuses on recorded observations');
    expect(html).not.toContain('Chart Strength</th>');
    expect(html).not.toContain('>Phase</th>');
  });

  it('keeps a review-recommended chart exportable without derived conclusions', () => {
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

    expect(html).toContain('Your chart shows more than one possible Peak pattern');
    expect(html).toContain('focuses on recorded observations');
    expect(html).not.toContain('>Code</th>');
    expect(html).not.toContain('>Phase</th>');
  });
});
