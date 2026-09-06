import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyEntry } from 'core-rules-engine';
import {
  DEFAULT_GUIDED_CHART_LEARNING_PREFERENCES,
  type ChartTipId,
  type ChartTipProgressStatus,
  type GuidedChartLearningPreferences,
  shouldQueueFirstSaveAcknowledgement,
} from './guidedChartLearning';

export const GUIDED_CHART_LEARNING_STORAGE_KEY =
  'well_within_guided_chart_learning_v1';

function copyDefaults(): GuidedChartLearningPreferences {
  return {
    ...DEFAULT_GUIDED_CHART_LEARNING_PREFERENCES,
    lessonProgress: {},
  };
}

function parsePreferences(raw: string | null): GuidedChartLearningPreferences {
  if (!raw) return copyDefaults();

  try {
    const parsed = JSON.parse(raw) as Partial<GuidedChartLearningPreferences>;
    const lessonProgress = (
      parsed.lessonProgress
      && typeof parsed.lessonProgress === 'object'
      && !Array.isArray(parsed.lessonProgress)
    ) ? parsed.lessonProgress : {};

    return {
      chartTipsEnabled: parsed.chartTipsEnabled !== false,
      lessonProgress,
      firstSaveAcknowledged: parsed.firstSaveAcknowledged === true,
      pendingFirstSaveAcknowledgement:
        parsed.pendingFirstSaveAcknowledgement === true,
      firstCompletedChartAcknowledged:
        parsed.firstCompletedChartAcknowledged === true,
    };
  } catch {
    return copyDefaults();
  }
}

export async function getGuidedChartLearningPreferences(): Promise<GuidedChartLearningPreferences> {
  return parsePreferences(await AsyncStorage.getItem(GUIDED_CHART_LEARNING_STORAGE_KEY));
}

async function updatePreferences(
  update: (
    current: GuidedChartLearningPreferences,
  ) => GuidedChartLearningPreferences,
): Promise<GuidedChartLearningPreferences> {
  const current = await getGuidedChartLearningPreferences();
  const next = update(current);
  await AsyncStorage.setItem(GUIDED_CHART_LEARNING_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function markChartTip(
  lessonId: ChartTipId,
  contentVersion: number,
  status: ChartTipProgressStatus,
): Promise<GuidedChartLearningPreferences> {
  return updatePreferences((current) => ({
    ...current,
    lessonProgress: {
      ...current.lessonProgress,
      [lessonId]: { contentVersion, status },
    },
  }));
}

export async function setChartTipsEnabled(
  enabled: boolean,
): Promise<GuidedChartLearningPreferences> {
  return updatePreferences((current) => ({
    ...current,
    chartTipsEnabled: enabled,
  }));
}

export async function queueFirstSaveAcknowledgement(params: {
  entriesBeforeSave: Record<string, DailyEntry>;
  savedDate: string;
  previousEntry: DailyEntry | null;
  savedEntry: DailyEntry;
}): Promise<boolean> {
  const preferences = await getGuidedChartLearningPreferences();
  if (!shouldQueueFirstSaveAcknowledgement({ ...params, preferences })) {
    return false;
  }

  await updatePreferences((current) => ({
    ...current,
    pendingFirstSaveAcknowledgement: true,
  }));
  return true;
}

export async function acknowledgeFirstSave(): Promise<GuidedChartLearningPreferences> {
  return updatePreferences((current) => ({
    ...current,
    firstSaveAcknowledged: true,
    pendingFirstSaveAcknowledgement: false,
  }));
}

export async function acknowledgeFirstCompletedChart(): Promise<GuidedChartLearningPreferences> {
  return updatePreferences((current) => ({
    ...current,
    firstCompletedChartAcknowledged: true,
  }));
}
