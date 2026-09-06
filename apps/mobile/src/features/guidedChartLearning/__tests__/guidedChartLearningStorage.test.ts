declare const global: { AsyncStorageMock: Record<string, string> };

import {
  GUIDED_CHART_LEARNING_STORAGE_KEY,
  acknowledgeFirstCompletedChart,
  acknowledgeFirstSave,
  getGuidedChartLearningPreferences,
  markChartTip,
  queueFirstSaveAcknowledgement,
  setChartTipsEnabled,
} from '../guidedChartLearningStorage';

describe('guided chart learning device-local preferences', () => {
  beforeEach(() => {
    for (const key of Object.keys(global.AsyncStorageMock)) {
      delete global.AsyncStorageMock[key];
    }
  });

  it('uses safe defaults for missing or invalid local state', async () => {
    expect(await getGuidedChartLearningPreferences()).toEqual({
      chartTipsEnabled: true,
      lessonProgress: {},
      firstSaveAcknowledged: false,
      pendingFirstSaveAcknowledgement: false,
      firstCompletedChartAcknowledged: false,
    });

    global.AsyncStorageMock[GUIDED_CHART_LEARNING_STORAGE_KEY] = 'not-json';
    expect((await getGuidedChartLearningPreferences()).chartTipsEnabled).toBe(true);
  });

  it('stores only presentation preferences and lesson/version progress', async () => {
    await markChartTip('observation-on-calendar', 1, 'viewed');
    await setChartTipsEnabled(false);
    await acknowledgeFirstCompletedChart();

    expect(await getGuidedChartLearningPreferences()).toEqual({
      chartTipsEnabled: false,
      lessonProgress: {
        'observation-on-calendar': { contentVersion: 1, status: 'viewed' },
      },
      firstSaveAcknowledged: false,
      pendingFirstSaveAcknowledgement: false,
      firstCompletedChartAcknowledged: true,
    });
    expect(global.AsyncStorageMock[GUIDED_CHART_LEARNING_STORAGE_KEY]).not.toContain(
      '2026-08-23',
    );
  });

  it('queues and consumes the first-save presentation state once', async () => {
    const entry = {
      date: '2026-08-23',
      observations: [{ id: 'one', sensation: 'dry' as const, appearances: [] }],
    };
    await expect(queueFirstSaveAcknowledgement({
      entriesBeforeSave: {},
      savedDate: '2026-08-23',
      previousEntry: null,
      savedEntry: entry,
    })).resolves.toBe(true);
    expect(
      (await getGuidedChartLearningPreferences()).pendingFirstSaveAcknowledgement,
    ).toBe(true);

    await acknowledgeFirstSave();
    const consumed = await getGuidedChartLearningPreferences();
    expect(consumed.firstSaveAcknowledged).toBe(true);
    expect(consumed.pendingFirstSaveAcknowledgement).toBe(false);

    await expect(queueFirstSaveAcknowledgement({
      entriesBeforeSave: {},
      savedDate: '2026-08-24',
      previousEntry: null,
      savedEntry: entry,
    })).resolves.toBe(false);
  });
});
