/**
 * RULES ENGINE SPEC: docs/RULES_ENGINE_SPEC.md
 * Deterministic fertile start detection only. Predictive features are forbidden.
 */
export function detectFertileStart(ranks: Array<number | null>, startIndex = 0): number | null {
  for (let i = startIndex; i < ranks.length; i += 1) {
    if (ranks[i] !== null && ranks[i] >= 1) return i;
  }
  return null;
}
