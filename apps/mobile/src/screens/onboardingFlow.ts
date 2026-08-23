export type OnboardingSlideKind =
  | 'identity'
  | 'chart_context'
  | 'observation'
  | 'privacy'
  | 'first_action';

export interface OnboardingSlideDefinition {
  id: string;
  kind: OnboardingSlideKind;
  headline: string;
  body: string;
}

export const ONBOARDING_SLIDES: readonly OnboardingSlideDefinition[] = [
  {
    id: 'welcome',
    kind: 'identity',
    headline: 'well within',
    body: 'Observation-based fertility charting. Private by design.',
  },
  {
    id: 'chart-context',
    kind: 'chart_context',
    headline: 'See your observations become a chart',
    body:
      'Each entry becomes part of a readable calendar. Well Within shows possible patterns from surrounding days—not a forecast.',
  },
  {
    id: 'observation-basics',
    kind: 'observation',
    headline: 'Start with what you notice',
    body:
      'Choose the sensation that best matches what you observed. Add appearance details when they apply.',
  },
  {
    id: 'privacy',
    kind: 'privacy',
    headline: 'Your chart stays in your control',
    body:
      'Well Within is local-first. Backup is optional, and your chart remains yours to export or delete.',
  },
  {
    id: 'first-action',
    kind: 'first_action',
    headline: 'Ready for today’s observation?',
    body:
      'Your first entry becomes the beginning of your chart. You can return and edit it later.',
  },
] as const;

export function onboardingPrimaryActionLabel(activeIndex: number): string {
  return activeIndex === ONBOARDING_SLIDES.length - 1
    ? 'Record today’s observation'
    : 'Continue';
}

export function localDateString(date: Date = new Date()): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function buildFirstEntryParams(date: Date = new Date()): {
  date: string;
  existingEntry: false;
} {
  return {
    date: localDateString(date),
    existingEntry: false,
  };
}
