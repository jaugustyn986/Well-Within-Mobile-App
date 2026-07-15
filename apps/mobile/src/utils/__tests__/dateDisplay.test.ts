import {
  formatFullDate,
  formatPossibleFertilePatternBody,
  formatPossibleFertilePatternLimit,
} from '../dateDisplay';
import type { PossibleFertilePatternPresentation } from 'core-rules-engine';

describe('date display', () => {
  it('uses the full conversational app format without a comma', () => {
    expect(formatFullDate('2026-06-06')).toBe('June 6 2026');
  });

  it('formats exact possible-pattern dates while preserving Cycle Day context', () => {
    const presentation = {
      state: 'bounded',
      body: 'raw engine body',
      start: { entryIndex: 0, date: '2026-06-06', cycleDay: 4 },
      pPlus3: { entryIndex: 7, date: '2026-06-13', cycleDay: 11 },
    } as PossibleFertilePatternPresentation;

    expect(formatPossibleFertilePatternBody(presentation)).toBe(
      'We noticed a possible pattern in what you recorded, from June 6 2026 through P+3 on June 13 2026.',
    );
  });

  it('formats the date prefix on a limiting observation', () => {
    expect(formatPossibleFertilePatternLimit({
      reason: 'not_observed',
      date: '2026-06-09',
      cycleDay: 7,
      detail: '2026-06-09: this day is marked not observed.',
    })).toBe('June 9 2026: this day is marked not observed.');
  });
});
