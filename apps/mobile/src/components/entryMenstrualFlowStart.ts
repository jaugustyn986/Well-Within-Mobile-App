import type {
  BleedingType,
  DailyEntry,
  MenstrualFlowStart,
} from 'core-rules-engine';

export type MenstrualFlowStartChoice = MenstrualFlowStart;

const IMMEDIATELY_CONTINUING_FLOW = new Set<BleedingType>([
  'light',
  'moderate',
  'heavy',
]);

export function shouldShowMenstrualFlowStartQuestion(params: {
  bleeding: BleedingType;
  previousDayEntry?: DailyEntry | null;
  existingMarker?: MenstrualFlowStartChoice;
}): boolean {
  const { bleeding, previousDayEntry, existingMarker } = params;
  if (bleeding !== 'light') return false;
  if (existingMarker !== undefined) return true;
  return !IMMEDIATELY_CONTINUING_FLOW.has(previousDayEntry?.bleeding ?? 'none');
}

export function menstrualFlowStartForSavedEntry(params: {
  showQuestion: boolean;
  selected: MenstrualFlowStartChoice | null;
}): MenstrualFlowStartChoice | undefined {
  if (!params.showQuestion) return undefined;
  return params.selected ?? 'uncertain';
}
