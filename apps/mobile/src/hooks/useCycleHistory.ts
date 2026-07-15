import { useCallback, useEffect, useState } from 'react';
import {
  CycleSlice,
  RecordedCycleHistorySummary,
  buildFirstReleasePossibleFertilePatternEligibility,
  buildRecordedCycleHistorySummary,
  splitIntoCycles,
} from 'core-rules-engine';
import { getAllEntries, entriesToSortedArray } from '../services/storageV2';

interface CycleHistoryData {
  cycles: CycleSlice[];
  recordedHistorySummary: RecordedCycleHistorySummary;
  loading: boolean;
  refresh: () => Promise<void>;
}

const EMPTY_HISTORY = buildRecordedCycleHistorySummary([]);

export function useCycleHistory(): CycleHistoryData {
  const [cycles, setCycles] = useState<CycleSlice[]>([]);
  const [recordedHistorySummary, setRecordedHistorySummary] =
    useState<RecordedCycleHistorySummary>(EMPTY_HISTORY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const stored = await getAllEntries();
    const sorted = entriesToSortedArray(stored);
    const slices = splitIntoCycles(sorted);
    setCycles(slices);
    const eligibilityByCycleNumber = Object.fromEntries(
      slices.map((cycle) => [
        cycle.cycleNumber,
        buildFirstReleasePossibleFertilePatternEligibility(cycle.cycleBoundary),
      ]),
    );
    setRecordedHistorySummary(
      buildRecordedCycleHistorySummary(slices, {
        eligibilityByCycleNumber,
      }),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { cycles, recordedHistorySummary, loading, refresh };
}
