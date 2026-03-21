/**
 * User-facing help and chart labels derived from the same rules as the engine.
 * Keep aligned with docs/RULES_ENGINE_SPEC.md, rank.ts, and creightonCode.ts.
 */

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
  'You choose one sensation and can select one or more appearances. The app reads them the same way every time: it looks at what you felt, what you saw on the tissue, and keeps the stronger fertile signal.\n\n' +
  'Sensation gives a baseline: dry is the quietest day; damp, shiny, and wet are moist without stretch; sticky and tacky are thicker or slightly stretching; stretchy is clearly stretching.\n\n' +
  'Appearance adds what you see: cloudy, gummy, pasty, or yellow nudges the day toward fertile-looking mucus; clear, cloudy/clear, or lubricative are the strongest visible signs. Brown and red do not add that same fertile strength for the chart.\n\n' +
  'There is one special pairing: if you mark lubricative and your sensation is damp, shiny, or wet, the app treats that as peak-type mucus \u2014 the same idea as stretchy.\n\n' +
  'Under your entry, the short summary (dry, early fertile, fertile, or peak-type) follows the method\u2019s base categories from your sensation and that lubricative rule. The calendar and dots use the combined strength of sensation and appearance. Usually they line up; occasionally a very clear or lubricative look on the tissue can make the calendar look stronger while the summary still reflects the base category \u2014 both come from the same observation you logged.';

export const HELP_TRYING_TO_CONCEIVE_BODY =
  'Best timing:\n' +
  'Have intercourse every 1\u20132 days starting when you first see non-dry mucus on your chart (the first day that is not a dry day) and continue through Peak Day.\n\n' +
  'The fertile window is approximately 6 days before ovulation through 1 day after. Your chances are highest 1\u20132 days before ovulation.\n\n' +
  'Tip: Don\u2019t wait for peak-type mucus to start. Sperm can survive in fertile mucus for several days, so starting when you first notice fertile signs improves your chances.';

/** Color guide: day with non-peak mucus signal (green dot on calendar). */
export const HELP_COLOR_GUIDE_NON_PEAK_MUCUS =
  'Non-peak mucus (green dot on calendar)';

/** Color guide: peak-type mucus (blue calendar treatment). */
export const HELP_COLOR_GUIDE_PEAK_TYPE_MUCUS =
  'Peak-type mucus (blue calendar days)';
