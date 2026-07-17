import type { MetricCardItem } from './MetricCardGrid';

interface CycleOverviewValues {
  length: number;
  peakDay: number | null;
  peakToNextCycleDays: number | null;
  showDerivedPattern: boolean;
}

function formatDays(days: number): string {
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

export function buildCycleOverviewMetrics({
  length,
  peakDay,
  peakToNextCycleDays,
  showDerivedPattern,
}: CycleOverviewValues): MetricCardItem[] {
  return [
    {
      value: formatDays(length),
      label: 'Cycle length',
      icon: 'calendar-check',
      tone: 'blush',
    },
    {
      value: showDerivedPattern && peakDay !== null ? `Day ${peakDay}` : '—',
      label: 'Peak marker',
      icon: 'peak-curve',
      tone: 'cream',
    },
    {
      value: showDerivedPattern && peakToNextCycleDays !== null
        ? formatDays(peakToNextCycleDays)
        : '—',
      label: 'Peak to next cycle',
      icon: 'sprout',
      tone: 'sage',
    },
  ];
}
