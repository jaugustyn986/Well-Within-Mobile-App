import type { DailyEntry } from 'core-rules-engine';
import {
  canSaveObservationEntry,
  initialSensationForEntry,
} from '../entryObservationConfirmation';

describe('entry observation confirmation', () => {
  test('a new entry has no fabricated default sensation', () => {
    expect(initialSensationForEntry(null)).toBeNull();
  });

  test('an existing entry keeps its saved sensation for fast editing', () => {
    expect(initialSensationForEntry({ sensation: 'wet' })).toBe('wet');
  });

  test('a legacy existing entry without sensation remains editable as dry', () => {
    const legacyEntry: DailyEntry = { bleeding: 'none' };
    expect(initialSensationForEntry(legacyEntry)).toBe('dry');
  });

  test('an observed new entry cannot save until a sensation is chosen', () => {
    expect(canSaveObservationEntry(false, null)).toBe(false);
    expect(canSaveObservationEntry(false, 'dry')).toBe(true);
    expect(canSaveObservationEntry(false, 'wet')).toBe(true);
  });

  test('a missing day can save without a sensation', () => {
    expect(canSaveObservationEntry(true, null)).toBe(true);
  });
});
