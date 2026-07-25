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

  test('validates the light-flow start marker without stripping it', () => {
    const result = validateDailyEntry({
      date: '2025-01-01',
      bleeding: 'light',
      menstrualFlowStart: 'uncertain',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.menstrualFlowStart).toBe('uncertain');
    }
    expect(isValidDailyEntry({ menstrualFlowStart: 'invalid' })).toBe(false);
  });

  test('preserves canonical observation metadata and rejects malformed times', () => {
    const result = validateDailyEntry({
      date: '2026-07-18',
      observations: [{
        id: 'obs-1',
        observedAt: '08:15',
        sensation: 'damp',
        appearances: ['cloudy'],
        frequency: 1,
      }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.observations?.[0]).toEqual({
        id: 'obs-1',
        observedAt: '08:15',
        sensation: 'damp',
        appearances: ['cloudy'],
        frequency: 1,
      });
    }
    expect(isValidDailyEntry({
      observations: [{ sensation: 'damp', appearances: [], observedAt: '8:15 AM' }],
    })).toBe(false);
  });

  test('rejects duplicate observation IDs before they reach the editor', () => {
    const observation = {
      id: 'duplicate-id',
      sensation: 'damp' as const,
      appearances: ['cloudy'] as const,
    };
    const result = validateDailyEntry({
      observations: [observation, { ...observation, sensation: 'wet' }],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Mucus observation IDs must be unique');
    }
  });

  test('isValidDailyEntry type guard', () => {
    expect(isValidDailyEntry({})).toBe(true);
    expect(isValidDailyEntry({ bleeding: 'heavy' })).toBe(true);
    expect(isValidDailyEntry({ bleeding: 'invalid' })).toBe(false);
  });
});
