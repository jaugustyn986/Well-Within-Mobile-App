/**
 * RULES ENGINE SPEC: docs/RULES_ENGINE_SPEC.md
 * Deterministic fertile start detection only. Predictive features are forbidden.
 */
export function detectFertileStart(
  ranks: Array<number | null | undefined>,
  startIndex = 0,
): number | null {
  for (let i = startIndex; i < ranks.length; i += 1) {
    const rank = ranks[i];
    if (rank != null && rank >= 1) return i;
  }
  return null;
}
