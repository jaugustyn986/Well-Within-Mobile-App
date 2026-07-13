import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CurrentCycleSummary, SummaryTone } from 'core-rules-engine';
import {
  BG_CARD_GRADIENT_START,
  BANNER_TONE_CAUTION_BG,
  BANNER_TONE_POSITIVE_BG,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_SUBTLE,
  TEXT_MUTED,
} from '../theme/colors';

interface Props {
  summary: CurrentCycleSummary;
  onUnderstandStatus?: () => void;
  onFindChartingSupport?: () => void;
}

function backgroundForTone(tone: SummaryTone): string {
  switch (tone) {
    case 'caution':
      return BANNER_TONE_CAUTION_BG;
    case 'positive':
      return BANNER_TONE_POSITIVE_BG;
    default:
      return BG_CARD_GRADIENT_START;
  }
}

export function StatusBanner({
  summary,
  onUnderstandStatus,
  onFindChartingSupport,
}: Props): React.JSX.Element {
  const bg = backgroundForTone(summary.summaryTone);
  const { cycleDay } = summary;
  const supportLine = summary.guidance;
  const completenessLabel =
    summary.completeness === 'No gaps in your chart this cycle'
      ? 'All days charted so far'
      : summary.completeness;
  const metadata = [
    cycleDay !== null ? `Cycle Day ${cycleDay}` : null,
    completenessLabel.length > 0 ? completenessLabel : null,
  ].filter((value): value is string => value !== null).join(' · ');
  const showStatusActions = summary.explanationTarget !== null;
  const understandLabel =
    summary.explanationTarget === 'peak_day' &&
    summary.interpretationStatus === 'summary_available'
      ? 'See why your chart shows this'
      : summary.explanationTarget === 'peak_day'
        ? 'How Peak Day is identified'
        : 'Learn what this means';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.content}>
        {summary.focusQualification ? (
          <Text style={styles.focusQualification}>{summary.focusQualification}</Text>
        ) : null}
        <Text style={styles.headline}>{summary.headline}</Text>
        <Text style={styles.statusLine}>{summary.statusLine}</Text>
        {summary.supportingContext ? (
          <Text style={styles.supportingContext}>{summary.supportingContext}</Text>
        ) : null}
        {metadata ? (
          <Text style={styles.metadata}>{metadata}</Text>
        ) : null}
        {supportLine ? (
          <Text style={styles.supportLine}>{supportLine}</Text>
        ) : null}
        {showStatusActions && onUnderstandStatus ? (
          <View style={styles.actions}>
            <Text
              accessibilityRole="button"
              onPress={onUnderstandStatus}
              style={styles.actionText}
            >
              {understandLabel}
            </Text>
            {summary.interpretationStatus === 'review_recommended' && onFindChartingSupport ? (
              <Text
                accessibilityRole="button"
                onPress={onFindChartingSupport}
                style={styles.actionText}
              >
                Find charting support
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  content: {
    width: '100%',
    maxWidth: 680,
  },
  focusQualification: {
    fontSize: 12,
    fontWeight: '400',
    color: TEXT_MUTED,
    marginBottom: 6,
    lineHeight: 16,
  },
  headline: {
    fontSize: 21,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    letterSpacing: -0.2,
  },
  statusLine: {
    fontSize: 14,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    marginTop: 10,
    lineHeight: 22,
  },
  supportingContext: {
    fontSize: 13,
    fontWeight: '400',
    color: TEXT_SUBTLE,
    marginTop: 6,
    lineHeight: 19,
  },
  metadata: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT_SUBTLE,
    marginTop: 10,
    lineHeight: 18,
  },
  supportLine: {
    fontSize: 14,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    marginTop: 10,
    lineHeight: 22,
  },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 14 },
  actionText: { fontSize: 13, fontWeight: '600', color: TEXT_PRIMARY },
});
