import {
  calendarDayNumber,
  calendarDaysBetween,
  calendarSpanLength,
  calendarDatesInclusive,
  cycleDayForEntryIndex,
} from '../src/calendar';

describe('calendar day math', () => {
  it('counts elapsed calendar dates without compressing gaps', () => {
    expect(calendarDaysBetween('2026-01-01', '2026-01-03')).toBe(2);
    expect(calendarDayNumber('2026-01-01', '2026-01-03')).toBe(3);
    expect(calendarSpanLength('2026-01-01', '2026-01-03')).toBe(3);
  });

  it('handles leap days and signed differences deterministically', () => {
    expect(calendarDaysBetween('2028-02-28', '2028-03-01')).toBe(2);
    expect(calendarDaysBetween('2028-03-01', '2028-02-28')).toBe(-2);
  });

  it('expands an inclusive calendar range for gap-aware presenters', () => {
    expect(calendarDatesInclusive('2026-01-30', '2026-02-02')).toEqual([
      '2026-01-30',
      '2026-01-31',
      '2026-02-01',
      '2026-02-02',
    ]);
  });

  it('uses entry dates for cycle-day labels and falls back to row order', () => {
    expect(
      cycleDayForEntryIndex(
        [{ date: '2026-01-01' }, { date: '2026-01-04' }],
        1,
      ),
    ).toBe(4);
    expect(cycleDayForEntryIndex([{}, {}], 1)).toBe(2);
  });
});
