import { validateDailyEntry, isValidDailyEntry } from '../validateEntry';

describe('validateEntry', () => {
  test('valid entry passes', () => {
    const result = validateDailyEntry({ date: '2025-01-01', bleeding: 'light' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.bleeding).toBe('light');
  });

  test('invalid bleeding type fails', () => {
    const result = validateDailyEntry({ date: '2025-01-01', bleeding: 'invalid' });
    expect(result.success).toBe(false);
  });

  test('invalid sensation fails', () => {
    const result = validateDailyEntry({ sensation: 'slippery' });
    expect(result.success).toBe(false);
  });

  test('isValidDailyEntry type guard', () => {
    expect(isValidDailyEntry({})).toBe(true);
    expect(isValidDailyEntry({ bleeding: 'heavy' })).toBe(true);
    expect(isValidDailyEntry({ bleeding: 'invalid' })).toBe(false);
  });
});
