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
  '\u2022 Record distinct changes you want to remember\n' +
  '\u2022 Well Within keeps each observation and uses the one with the most fertile signs for that day\u2019s chart';

export const HELP_SENSATION_APPEARANCE_TITLE = 'How do sensation and appearance work together?';

export const HELP_SENSATION_APPEARANCE_BODY =
  'Each day, you record what you feel (sensation) and what you see (appearance).\n\n' +
  'The app looks at both and places the strongest recorded observation on your chart.\n\n' +
  'Sensation includes dry, damp, wet, shiny, sticky, tacky, and stretchy.\n' +
  'Appearance includes brown, cloudy, clear, gummy, lubricative, pasty, red, and yellow.\n\n' +
  'When both are present, the app uses the strongest recorded sign from either one.\n\n' +
  'Examples:\n\n' +
  'Dry sensation with no mucus \u2192 dry day\n' +
  'Damp or sticky mucus \u2192 non-Peak mucus observation\n' +
  'Clear, stretchy, or lubricative mucus \u2192 peak-type pattern\n\n' +
  'If you record multiple observations in one day, the app keeps them all and uses the observation with the most fertile signs for that day\u2019s chart. Observation time helps organize your entries but does not change the result.\n\n' +
  'When bleeding is also recorded\n\n' +
  'Heavy, moderate, or light menstrual flow remains the primary chart sign. Spotting and brown stay visible alongside the dry, non-Peak, or Peak-type observation you record. A spotting or brown day can also carry a retrospective P+ marker when it is one of three completed observations after a possible Peak.';

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
  'Well Within marks it after you log three full days without another Peak-type mucus sign.\n\n' +
  'Spotting or brown does not erase a mucus observation. If a Peak-type sign is recorded with either one, the day remains a Peak-type observation. If no Peak-type sign is recorded, an explicitly completed spotting or brown observation can be one of the three follow-up days.\n\n' +
  'Peak Day is an observation-based charting marker. It does not confirm ovulation on its own.';

export interface HelpStatusMessageSection {
  title: string;
  body: string;
}

/** Glossary for status headlines (Understanding Your Chart). */
export const HELP_STATUS_MESSAGE_SECTIONS: readonly HelpStatusMessageSection[] = [
  {
    title: 'Your pattern is still taking shape',
    body:
      'No Peak-type pattern appears in the observations shown on the card yet. Keep charting normally; the card updates whenever an observation is added or changed.',
  },
  {
    title: 'A few days need context',
    body:
      'An open calendar date, a day marked not observed, or a saved day that still needs a sensation or appearance falls within a part of the chart Well Within uses to mark Peak or show a phase summary. If the saved observation is incomplete, open that date and choose a sensation—including Dry. A not-observed day can stay as it is. Either way, keep charting.',
  },
  {
    title: 'This day was marked not observed',
    body:
      'There is no observation for Well Within to interpret on this day. That is okay. Keep charting, and add an observation later only if you remember it.',
  },
  {
    title: 'Menstrual flow recorded',
    body:
      'This day is recorded as menstrual flow. Mucus can still be saved, but Well Within does not interpret it as Peak-type while flow is selected.',
  },
  {
    title: 'Spotting recorded',
    body:
      'Spotting stays visible alongside the sensation and appearance recorded for the day. A Peak-type sign remains Peak-type; a completed non-Peak observation may also carry a P+ marker when it follows the chart’s possible Peak.',
  },
  {
    title: 'Brown recorded',
    body:
      'Brown stays visible as a small B marker. The day’s fill still follows the dry, non-Peak, or Peak-type observation you recorded.',
  },
  {
    title: 'Your chart shows mucus signs',
    body:
      'Mucus signs are present in your observations, but the pattern does not show a Peak-type day yet. Keep charting as the pattern develops.',
  },
  {
    title: 'Your chart shows a possible Peak Day',
    body:
      'A Peak-type mucus sign is recorded in your chart. Well Within waits for three days without another Peak-type sign before marking that earlier day as Peak Day.',
  },
  {
    title: 'Your chart marks a Peak Day',
    body:
      'Well Within marks the last Peak-type day after you log three days without another Peak-type mucus sign. This is an interpretation of the observations in your chart, not confirmation of ovulation.',
  },
  {
    title: 'Your chart shows a post-Peak pattern',
    body:
      'Three days without another Peak-type mucus sign follow the Peak Day marked on your chart. Keep charting each day; the summary updates whenever you add or change an observation.',
  },
  {
    title: 'Your chart is ready when you are',
    body: 'Your first daily observation begins the chart. Start whenever you are ready.',
  },
];
