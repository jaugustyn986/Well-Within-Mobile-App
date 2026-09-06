import type {
  CycleSlice,
  InterpretationSupportStatus,
} from 'core-rules-engine';

export type CycleCardStatusKey =
  | CycleSlice['status']
  | 'needs_review'
  | 'needs_context';

export function resolveCycleCardStatusKey(params: {
  cycleNumber: number;
  latestCycleNumber: number;
  cycleStatus: CycleSlice['status'];
  interpretationStatus: InterpretationSupportStatus;
}): CycleCardStatusKey {
  if (params.cycleNumber === params.latestCycleNumber) return 'in_progress';
  if (params.interpretationStatus === 'review_recommended') return 'needs_review';
  if (params.interpretationStatus === 'blocked_by_missing') return 'needs_context';
  return params.cycleStatus;
}
