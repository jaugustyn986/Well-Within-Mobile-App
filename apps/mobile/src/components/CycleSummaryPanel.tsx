import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { RecordedCycleHistorySummary } from 'core-rules-engine';
import {
  BG_CARD,
  BG_MISSING,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  BORDER_CARD,
} from '../theme/colors';
import { MetricCardGrid, type MetricCardItem } from './MetricCardGrid';
import {
  buildCycleHistoryOverviewCopy,
  type CycleHistoryStatCopy,
} from './cycleHistoryPresentation';

interface Props {
  summary: RecordedCycleHistorySummary;
}

const PATTERN_ACCENTS = ['#D9AFA2', '#E4C38E', '#B9C8A8'];

function buildSummaryMetrics(stats: CycleHistoryStatCopy[]): MetricCardItem[] {
  const visualOrder: Array<Pick<MetricCardItem, 'icon' | 'tone'>> = [
    { icon: 'calendar-check', tone: 'blush' },
    { icon: 'comparison-chart', tone: 'cream' },
    { icon: 'calendar-range', tone: 'sage' },
  ];

  return stats.map((stat, index) => ({
    ...stat,
    ...(visualOrder[index] ?? visualOrder[visualOrder.length - 1]),
    fullWidth: stats.length === 1 || (stats.length === 3 && index === 2),
  }));
}

export function CycleSummaryPanel({ summary }: Props): React.JSX.Element {
  const copy = buildCycleHistoryOverviewCopy(summary);
  const hasStats = copy.stats.length > 0;
  const summaryMetrics = buildSummaryMetrics(copy.stats);

  return (
    <View style={styles.container}>
      {hasStats ? (
        <>
          <Text style={styles.heading}>{copy.summaryHeading}</Text>
          <MetricCardGrid items={summaryMetrics} layout="two-plus-wide" />
        </>
      ) : null}

      <Text style={[styles.patternsHeading, !hasStats && styles.patternsHeadingFirst]}>
        {copy.patternsHeading}
      </Text>
      <View style={styles.patternsCard}>
        {copy.progressLabel ? (
          <View style={styles.progressPill}>
            <Text style={styles.progressText}>{copy.progressLabel}</Text>
          </View>
        ) : null}

        {copy.body ? <Text style={styles.body}>{copy.body}</Text> : null}

        {copy.patterns.map((pattern, index) => (
          <View
            key={pattern.label}
            style={[
              styles.patternRow,
              { borderLeftColor: PATTERN_ACCENTS[index % PATTERN_ACCENTS.length] },
            ]}
          >
            <Text style={styles.patternLabel}>{pattern.label}</Text>
            <Text style={styles.patternValue}>{pattern.value}</Text>
          </View>
        ))}

        <Text
          style={[
            styles.inclusionNote,
            copy.body && copy.patterns.length === 0 && styles.inclusionNoteAfterBody,
          ]}
        >
          {copy.inclusionNote}
        </Text>

        {copy.limitation ? (
          <View style={styles.limitationSection}>
            <Text style={styles.limitationText}>{copy.limitation}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, marginTop: 16 },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 10,
  },
  patternsHeading: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginTop: 24,
    marginBottom: 8,
  },
  patternsHeadingFirst: { marginTop: 0 },
  patternsCard: {
    backgroundColor: BG_CARD,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  progressPill: {
    alignSelf: 'flex-start',
    backgroundColor: BG_MISSING,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  progressText: { fontSize: 11, fontWeight: '600', color: TEXT_MUTED },
  body: { fontSize: 14, color: TEXT_SECONDARY, lineHeight: 21 },
  patternRow: {
    backgroundColor: BG_MISSING,
    borderLeftWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 8,
  },
  patternLabel: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  patternValue: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginTop: 2,
  },
  inclusionNote: {
    fontSize: 13,
    lineHeight: 19,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  inclusionNoteAfterBody: { marginTop: 9 },
  limitationSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
  },
  limitationText: {
    fontSize: 12,
    lineHeight: 18,
    color: TEXT_MUTED,
  },
});
