import type {
  PossibleFertilePatternLimit,
  PossibleFertilePatternPresentation,
} from 'core-rules-engine';

/** Full conversational date for explanatory UI, without locale punctuation. */
export function formatFullDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;

  const formatted = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return formatted.replace(',', '');
}

export function formatPossibleFertilePatternBody(
  presentation: PossibleFertilePatternPresentation,
): string | null {
  if (
    presentation.state === 'bounded' &&
    presentation.start?.date &&
    presentation.pPlus3?.date
  ) {
    return `Based on your logged observations, a possible pattern is shown from ${formatFullDate(presentation.start.date)} through P+3 (${formatFullDate(presentation.pPlus3.date)}).`;
  }

  return presentation.body;
}

export function formatPossibleFertilePatternLimit(
  limit: PossibleFertilePatternLimit | null,
): string | null {
  if (!limit?.date) return limit?.detail ?? null;

  const prefix = `${limit.date}: `;
  const detail = limit.detail.startsWith(prefix)
    ? limit.detail.slice(prefix.length)
    : limit.detail;
  return `${formatFullDate(limit.date)}: ${detail}`;
}
