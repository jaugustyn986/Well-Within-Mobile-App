/**
 * Flow bleeding types: days treated as menstrual flow for fertile opening and peak candidacy.
 * Spotting and brown are recorded as a separate observation layer;
 * their accompanying mucus observation continues to drive mucus/Peak logic.
 * See docs/RULES_ENGINE_SPEC.md — Fertile start, Peak candidate.
 */
const FLOW_BLEEDING = new Set(['heavy', 'moderate', 'light']);

export function blocksFertileOpening(bleeding: string | undefined): boolean {
  return FLOW_BLEEDING.has(bleeding ?? 'none');
}
