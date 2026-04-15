import type { DailyEntry } from 'core-rules-engine';
import { splitIntoCycles } from 'core-rules-engine';
import { buildFeedbackCycleContext } from '../feedbackContext';

describe('buildFeedbackCycleContext', () => {
  it('returns null-shaped fields when there are no cycles', () => {
    const ctx = buildFeedbackCycleContext([], '2025-06-15');
    expect(ctx).toEqual({
      cycle_length: null,
      peak_detected: null,
      current_phase: null,
      missing_days_count: null,
      cycles_tracked: 0,
      days_since_last_entry: null,
    });
  });

  it('derives context from split cycles for a fixed calendar date', () => {
    const entries: DailyEntry[] = [
      {
        date: '2025-06-01',
        bleeding: 'heavy',
        sensation: 'dry',
        appearances: [],
      },
      {
        date: '2025-06-10',
        bleeding: 'none',
        sensation: 'dry',
        appearances: [],
      },
    ];
    const cycles = splitIntoCycles(entries);
    const ctx = buildFeedbackCycleContext(cycles, '2025-06-10');
    expect(ctx.cycle_length).toBe(2);
    expect(typeof ctx.peak_detected).toBe('boolean');
    expect(ctx.cycles_tracked).toBeGreaterThanOrEqual(0);
    expect(ctx.current_phase).toBeTruthy();
    expect(ctx.days_since_last_entry).toBe(0);
  });
});
