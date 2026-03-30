/**
 * Local-calendar helpers for YYYY-MM-DD (no timezone conversion).
 */

export function compareIsoDate(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function addDaysIso(iso: string, delta: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d + delta);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
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
