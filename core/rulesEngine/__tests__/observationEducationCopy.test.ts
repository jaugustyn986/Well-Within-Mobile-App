import {
  BLEEDING_EDUCATION,
  BLEEDING_EDUCATION_NOTE,
  HELP_COLOR_GUIDE_PEAK_TYPE_MUCUS,
  HELP_HOW_TO_OBSERVE_BODY,
  HELP_SENSATION_APPEARANCE_BODY,
  HELP_SENSATION_APPEARANCE_TITLE,
  HELP_STATUS_MESSAGE_SECTIONS,
  HELP_WHAT_IS_PEAK_DAY_BODY,
  HELP_WHAT_IS_PEAK_DAY_TITLE,
  mucusChartStrengthLabel,
  PDF_CHART_STRENGTH_HEADER,
} from '../src/observationEducationCopy';

describe('mucusChartStrengthLabel', () => {
  it('maps ranks 0–3 to user-facing chart labels', () => {
    expect(mucusChartStrengthLabel(0)).toBe('Dry');
    expect(mucusChartStrengthLabel(1)).toBe('Damp');
    expect(mucusChartStrengthLabel(2)).toBe('Wet');
    expect(mucusChartStrengthLabel(3)).toBe('Peak-type');
  });

  it('returns whenMissing for null, undefined, or out-of-range', () => {
    expect(mucusChartStrengthLabel(null, '--')).toBe('--');
    expect(mucusChartStrengthLabel(undefined, '')).toBe('');
    expect(mucusChartStrengthLabel(99, 'x')).toBe('x');
  });

  it('truncates toward zero', () => {
    expect(mucusChartStrengthLabel(2.9)).toBe('Wet');
  });
});

describe('observationEducationCopy', () => {
  it('exports non-empty help strings for guardrails', () => {
    expect(PDF_CHART_STRENGTH_HEADER.length).toBeGreaterThan(0);
    expect(HELP_HOW_TO_OBSERVE_BODY).toContain('Note the sensation');
    expect(HELP_HOW_TO_OBSERVE_BODY).not.toMatch(/vulva/i);
    expect(HELP_SENSATION_APPEARANCE_TITLE.length).toBeGreaterThan(0);
    expect(HELP_SENSATION_APPEARANCE_BODY).toContain('lubricative');
    expect(HELP_SENSATION_APPEARANCE_BODY).not.toMatch(/Type\s*[0-3]/i);
    expect(HELP_STATUS_MESSAGE_SECTIONS.length).toBe(11);
    expect(HELP_STATUS_MESSAGE_SECTIONS.some((section) => section.title.includes('Menstrual'))).toBe(true);
    expect(HELP_STATUS_MESSAGE_SECTIONS.some((section) => section.title.includes('more than one possible'))).toBe(false);
    expect(HELP_WHAT_IS_PEAK_DAY_TITLE.length).toBeGreaterThan(0);
    expect(HELP_WHAT_IS_PEAK_DAY_BODY).toContain('three full days');
    expect(HELP_WHAT_IS_PEAK_DAY_BODY).toContain('Spotting or brown does not erase');
    expect(HELP_COLOR_GUIDE_PEAK_TYPE_MUCUS).toContain('grey');
  });

  it('maps every stored bleeding value to Creighton-aligned education', () => {
    expect(BLEEDING_EDUCATION).toEqual([
      expect.objectContaining({ value: 'none', label: 'None', code: null }),
      expect.objectContaining({ value: 'spotting', label: 'Spotting', code: 'VL' }),
      expect.objectContaining({ value: 'light', label: 'Light', code: 'L' }),
      expect.objectContaining({ value: 'moderate', label: 'Moderate', code: 'M' }),
      expect.objectContaining({ value: 'heavy', label: 'Heavy', code: 'H' }),
      expect.objectContaining({ value: 'brown', label: 'Brown', code: 'B' }),
    ]);
    expect(BLEEDING_EDUCATION.every((item) => item.description.length > 0)).toBe(true);
    expect(BLEEDING_EDUCATION_NOTE).toMatch(/describe what you observe/i);
    expect(BLEEDING_EDUCATION_NOTE).not.toMatch(/diagnos|condition|disease/i);
  });
});
