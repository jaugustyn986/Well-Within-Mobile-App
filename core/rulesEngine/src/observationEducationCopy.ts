/**
 * User-facing help and chart labels derived from the same rules as the engine.
 * Keep aligned with docs/RULES_ENGINE_SPEC.md, rank.ts, and creightonCode.ts.
 */

import type { BleedingType } from './types';

export interface BleedingEducationItem {
  value: BleedingType;
  label: string;
  code: 'H' | 'M' | 'L' | 'VL' | 'B' | null;
  description: string;
}

/** Creighton-aligned recording labels. These describe observations, not their cause. */
export const BLEEDING_EDUCATION: readonly BleedingEducationItem[] = [
  {
    value: 'none',
    label: 'None',
    code: null,
    description: 'No red, brown, or black bleeding observed.',
  },
  {
    value: 'spotting',
    label: 'Spotting',
    code: 'VL',
    description: 'Very light red bleeding. Also record any mucus you observe.',
  },
  {
    value: 'light',
    label: 'Light',
    code: 'L',
    description: 'Light red flow. Also record any mucus you observe.',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    code: 'M',
    description: 'Moderate red flow.',
  },
  {
    value: 'heavy',
    label: 'Heavy',
    code: 'H',
    description: 'Heavy red flow.',
  },
  {
    value: 'brown',
    label: 'Brown',
    code: 'B',
    description: 'Brown or black bleeding or discharge.',
  },
];

export const HELP_BLEEDING_TYPES_TITLE = 'What do the bleeding types mean?';

export const BLEEDING_EDUCATION_NOTE =
  'These categories describe what you observe, not why bleeding is happening. If you are unsure which category to use, review your chart with a trained practitioner.';

/** Column header for PDF / tables: chart strength from mucusRank (not numeric rank). */
export const PDF_CHART_STRENGTH_HEADER = 'Chart';

/**
 * Short label for calendar / daily log / PDF row from internal mucus rank (0–3).
 * Internal values are unchanged; this is presentation only.
 */
export function mucusChartStrengthLabel(
  rank: number | null | undefined,
  whenMissing = '',
): string {
  if (rank === null || rank === undefined) return whenMissing;
  const r = Math.trunc(rank);
  switch (r) {
    case 0:
      return 'Dry';
    case 1:
      return 'Damp';
    case 2:
      return 'Wet';
    case 3:
      return 'Peak-type';
    default:
      return whenMissing;
  }
}

export const HELP_HOW_TO_OBSERVE_TITLE = 'How do I make my observation?';

export const HELP_HOW_TO_OBSERVE_BODY =
  'Use folded toilet tissue and wipe front to back.\n\n' +
  '\u2022 Note the sensation (what you feel)\n' +
  '\u2022 Note the appearance of any mucus on the tissue (what you see)\n' +
  '\u2022 Check before and after toileting throughout the day\n' +
  '\u2022 Make a final observation at bedtime\n' +
  '\u2022 Record the most fertile sign you noticed all day \u2014 not just the last check';

export const HELP_SENSATION_APPEARANCE_TITLE = 'How do sensation and appearance work together?';

export const HELP_SENSATION_APPEARANCE_BODY =
  'Each day, you record what you feel (sensation) and what you see (appearance).\n\n' +
  'The app looks at both and places the strongest recorded observation on your chart.\n\n' +
  'Sensation includes dry, damp, wet, shiny, sticky, tacky, and stretchy.\n' +
  'Appearance includes brown, cloudy, clear, gummy, lubricative, pasty, red, and yellow.\n\n' +
  'When both are present, the app uses the strongest recorded sign from either one.\n\n' +
  'Examples:\n\n' +
  'Dry sensation with no mucus \u2192 dry day\n' +
  'Damp or sticky mucus \u2192 early fertile pattern\n' +
  'Clear, stretchy, or lubricative mucus \u2192 peak-type pattern\n\n' +
  'If you record multiple observations in one day, the app uses the most fertile one.\n\n' +
  'During your period\n\n' +
  'If you are experiencing menstrual flow, bleeding is the primary sign. Mucus observations during this time are not used to identify fertility.';

export const HELP_TRYING_TO_CONCEIVE_BODY =
  'Your chart can help you discuss the timing of observed fertile signs with a qualified fertility-awareness educator or clinician.\n\n' +
  'Well Within records and interprets observations. It does not confirm ovulation, predict pregnancy chances, or replace individualized care.';

/** Color guide: day with non-peak mucus signal (green dot on calendar). */
export const HELP_COLOR_GUIDE_NON_PEAK_MUCUS =
  'Non-peak mucus (green dot on calendar)';

/** Color guide: peak-type mucus (warm grey calendar tile). */
export const HELP_COLOR_GUIDE_PEAK_TYPE_MUCUS =
  'Peak-type mucus (warm grey calendar days)';

export const HELP_WHAT_IS_PEAK_DAY_TITLE = 'What is the Peak Day?';

export const HELP_WHAT_IS_PEAK_DAY_BODY =
  'The Peak Day is the last day of peak-type mucus (clear, stretchy, or lubricative).\n\n' +
  'It is only confirmed after three full days of lower-quality observations.\n\n' +
  'Peak Day is an observation-based charting marker. It does not confirm ovulation on its own.';

export interface HelpStatusMessageSection {
  title: string;
  body: string;
}

/** Glossary for status headlines (Understanding Your Chart). */
export const HELP_STATUS_MESSAGE_SECTIONS: readonly HelpStatusMessageSection[] = [
  {
    title: 'Menstrual flow',
    body:
      'You\u2019re in your period. Bleeding is the primary sign during this time, and fertility is not assessed.',
  },
  {
    title: 'Tracking',
    body:
      'You\u2019re recording observations, but no fertile signs have been identified yet.',
  },
  {
    title: 'Fertile pattern',
    body:
      'Mucus has been observed. This may be the start of your fertile window.',
  },
  {
    title: 'Fertile pattern \u2014 Peak not confirmed yet',
    body:
      'Fertile signs are present, but Peak has not been confirmed. The pattern is still developing.',
  },
  {
    title: 'Peak day identified',
    body:
      'A Peak Day has been identified from your observations and confirmed after three lower-quality days.',
  },
  {
    title: 'Post-peak phase',
    body:
      'Three days of lower-quality mucus follow the identified Peak Day.',
  },
  {
    title: 'Missing observation',
    body:
      'A required observation is missing. This can prevent the app from confirming Peak or identifying the fertile window accurately.',
  },
];
