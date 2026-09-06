import {
  menstrualFlowStartForSavedEntry,
  shouldShowMenstrualFlowStartQuestion,
} from '../entryMenstrualFlowStart';

describe('menstrual-flow start question', () => {
  it('appears for potentially leading light flow', () => {
    expect(shouldShowMenstrualFlowStartQuestion({
      bleeding: 'light',
      previousDayEntry: { date: '2026-01-01', bleeding: 'spotting' },
    })).toBe(true);
    expect(shouldShowMenstrualFlowStartQuestion({
      bleeding: 'light',
      previousDayEntry: null,
    })).toBe(true);
  });

  it.each(['light', 'moderate', 'heavy'] as const)(
    'stays hidden for light flow continuing after %s flow',
    (previousBleeding) => {
      expect(shouldShowMenstrualFlowStartQuestion({
        bleeding: 'light',
        previousDayEntry: { date: '2026-01-01', bleeding: previousBleeding },
      })).toBe(false);
    },
  );

  it.each(['spotting', 'brown', 'none', 'moderate', 'heavy'] as const)(
    'stays hidden when the current bleeding value is %s',
    (bleeding) => {
      expect(shouldShowMenstrualFlowStartQuestion({ bleeding })).toBe(false);
    },
  );

  it('remains visible while editing an existing light-flow marker', () => {
    expect(shouldShowMenstrualFlowStartQuestion({
      bleeding: 'light',
      previousDayEntry: { date: '2026-01-01', bleeding: 'heavy' },
      existingMarker: 'confirmed',
    })).toBe(true);
  });

  it('saves an unanswered visible question as uncertain and clears a hidden one', () => {
    expect(menstrualFlowStartForSavedEntry({
      showQuestion: true,
      selected: null,
    })).toBe('uncertain');
    expect(menstrualFlowStartForSavedEntry({
      showQuestion: false,
      selected: 'confirmed',
    })).toBeUndefined();
  });
});
