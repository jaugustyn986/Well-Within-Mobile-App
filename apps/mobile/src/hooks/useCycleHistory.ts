import { useCallback, useEffect, useState } from 'react';
import {
  CycleSlice,
  PossibleFertilePatternHistoryPresentation,
  buildFirstReleasePossibleFertilePatternEligibility,
  buildPossibleFertilePatternHistoryPresentation,
  splitIntoCycles,
} from 'core-rules-engine';
import { getAllEntries, entriesToSortedArray } from '../services/storageV2';

interface CycleHistoryData {
  cycles: CycleSlice[];
  possibleFertilePatternHistory: PossibleFertilePatternHistoryPresentation;
  loading: boolean;
  refresh: () => Promise<void>;
}

const EMPTY_HISTORY = buildPossibleFertilePatternHistoryPresentation([]);

export function useCycleHistory(): CycleHistoryData {
  const [cycles, setCycles] = useState<CycleSlice[]>([]);
  const [possibleFertilePatternHistory, setPossibleFertilePatternHistory] =
    useState<PossibleFertilePatternHistoryPresentation>(EMPTY_HISTORY);
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
    setPossibleFertilePatternHistory(
      buildPossibleFertilePatternHistoryPresentation(slices, {
        eligibilityByCycleNumber,
      }),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { cycles, possibleFertilePatternHistory, loading, refresh };
}
