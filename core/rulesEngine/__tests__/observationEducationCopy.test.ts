import {
  HELP_HOW_TO_OBSERVE_BODY,
  HELP_SENSATION_APPEARANCE_BODY,
  HELP_SENSATION_APPEARANCE_TITLE,
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
  });
});
