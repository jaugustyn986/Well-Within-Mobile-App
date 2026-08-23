import {
  ONBOARDING_SLIDES,
  buildFirstEntryParams,
  localDateString,
  onboardingPrimaryActionLabel,
} from '../onboardingFlow';

describe('onboarding activation flow', () => {
  it('moves from identity to value before teaching entry mechanics', () => {
    expect(ONBOARDING_SLIDES.map((slide) => slide.kind)).toEqual([
      'identity',
      'chart_context',
      'observation',
      'privacy',
      'first_action',
    ]);
  });

  it('sets honest expectations about chart context and privacy', () => {
    const chartContext = ONBOARDING_SLIDES.find(
      (slide) => slide.kind === 'chart_context',
    );
    const privacy = ONBOARDING_SLIDES.find((slide) => slide.kind === 'privacy');

    expect(chartContext?.body).toContain('not a forecast');
    expect(privacy?.body).toContain('local-first');
    expect(privacy?.body).toContain('export or delete');
  });

  it('uses a distinct first-entry action only on the final screen', () => {
    ONBOARDING_SLIDES.slice(0, -1).forEach((_, index) => {
      expect(onboardingPrimaryActionLabel(index)).toBe('Continue');
    });

    expect(onboardingPrimaryActionLabel(ONBOARDING_SLIDES.length - 1)).toBe(
      'Record today’s observation',
    );
  });

  it('builds the first-entry destination using the user’s local date', () => {
    const localEvening = new Date(2026, 6, 26, 23, 30);

    expect(localDateString(localEvening)).toBe('2026-07-26');
    expect(buildFirstEntryParams(localEvening)).toEqual({
      date: '2026-07-26',
      existingEntry: false,
    });
  });
});
