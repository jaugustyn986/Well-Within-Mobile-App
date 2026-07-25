import { DailyEntry } from './types';
import { resolveDailyMucus } from './observationResolution';

/**
 * RULES ENGINE SPEC: docs/RULES_ENGINE_SPEC.md
 * Deterministic rank mapping only. Predictive features are forbidden.
 */
export function computeMucusRank(entry: DailyEntry | null): number | null {
  if (!entry || entry.missing) return null;

  if (typeof entry.mucusRankOverride === 'number') {
    return Math.max(0, Math.min(3, Math.trunc(entry.mucusRankOverride)));
  }

  return resolveDailyMucus(entry).rank;
}
