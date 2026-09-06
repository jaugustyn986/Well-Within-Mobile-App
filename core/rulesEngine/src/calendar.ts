/**
 * Local-calendar helpers for YYYY-MM-DD (no timezone conversion).
 */

export function compareIsoDate(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

function isoDateUtcMs(iso: string): number | null {
  const match = ISO_DATE_RE.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const ms = Date.UTC(year, month - 1, day);
  const date = new Date(ms);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return ms;
}

/** Signed local-calendar difference: later - earlier, ignoring timezones and DST. */
export function calendarDaysBetween(earlierIso: string, laterIso: string): number | null {
  const earlier = isoDateUtcMs(earlierIso);
  const later = isoDateUtcMs(laterIso);
  if (earlier === null || later === null) return null;
  return Math.round((later - earlier) / DAY_MS);
}

/** One-based calendar day within a span, or null for invalid/reversed dates. */
export function calendarDayNumber(startIso: string, dateIso: string): number | null {
  const difference = calendarDaysBetween(startIso, dateIso);
  return difference !== null && difference >= 0 ? difference + 1 : null;
}

/** Inclusive number of calendar dates in a valid, non-reversed span. */
export function calendarSpanLength(startIso: string, endIso: string): number | null {
  return calendarDayNumber(startIso, endIso);
}

/** Inclusive, validated date range for gap-aware chart presenters. */
export function calendarDatesInclusive(startIso: string, endIso: string): string[] {
  const length = calendarSpanLength(startIso, endIso);
  if (length === null) return [];
  return Array.from({ length }, (_, index) => addDaysIso(startIso, index));
}

/**
 * One-based cycle-day label for a stored entry. Real dates preserve calendar gaps;
 * missing/invalid fixture dates retain the deterministic row-order fallback.
 */
export function cycleDayForEntryIndex(
  entries: ReadonlyArray<{ date?: string }>,
  index: number,
): number {
  if (index < 0 || index >= entries.length) return Math.max(1, index + 1);
  const startDate = entries[0]?.date;
  const entryDate = entries[index]?.date;
  if (startDate && entryDate) {
    const day = calendarDayNumber(startDate, entryDate);
    if (day !== null) return day;
  }
  return index + 1;
}

export function addDaysIso(iso: string, delta: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + delta));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

/** Deterministic fallback when `DailyEntry.date` is missing (tests/fixtures). */
export function syntheticDateForIndex(index: number): string {
  return addDaysIso('2000-01-01', index);
}

export function entryDateOrSynthetic(
  date: string | undefined,
  index: number,
): string {
  return date && date.length >= 10 ? date : syntheticDateForIndex(index);
}
