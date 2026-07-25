import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  mucusChartStrengthLabel,
  resolveDailyMucus,
  DailyEntry,
  PrimaryDayClass,
} from 'core-rules-engine';
import {
  BG_CARD, BG_MISSING,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, TEXT_SUBTLE,
  BORDER_CARD, ACCENT_WARM, ACCENT_WARM_TINT,
} from '../theme/colors';

interface Props {
  entry: DailyEntry | null;
  mucusRank: number | null;
  /** From engine `primaryDayClassByDay`; when null, label falls back to rank only. */
  primaryDayClass?: PrimaryDayClass | null;
  date: string;
  onReview: () => void;
  onAddObservation: () => void;
}

function layeredBleedingLabel(entry: DailyEntry): string | null {
  if (entry.bleeding === 'spotting') return 'spotting';
  if (entry.bleeding === 'brown') return 'brown';
  return null;
}

function getMucusLabel(
  entry: DailyEntry,
  rank: number | null,
  primary: PrimaryDayClass | null | undefined,
): string {
  const bleedingLabel = layeredBleedingLabel(entry);
  if (bleedingLabel && rank !== null && rank >= 1) {
    return `${mucusChartStrengthLabel(rank, 'Mucus')} + ${bleedingLabel}`;
  }
  if (primary === 'menstrual_flow') return 'Menstrual flow';
  if (primary === 'spotting') return 'Spotting';
  if (entry.bleeding === 'brown' && rank === 0) return 'Dry + brown';
  if (entry.bleeding === 'brown' && rank === null) return 'Brown · observation incomplete';
  return mucusChartStrengthLabel(rank, 'No observation');
}

function getFertilityHint(
  entry: DailyEntry,
  rank: number | null,
  primary: PrimaryDayClass | null | undefined,
): string {
  const bleedingLabel = layeredBleedingLabel(entry);
  if (bleedingLabel && rank !== null && rank >= 1) {
    const sign = rank >= 3 ? 'Peak-type sign' : 'mucus sign';
    return `A ${sign} and ${bleedingLabel} were both recorded. The chart keeps both observations.`;
  }
  if (primary === 'menstrual_flow') {
    return 'Logged as menstrual flow; mucus is not read as Peak-type for this day.';
  }
  if (primary === 'spotting') {
    return 'Spotting noted with a dry observation.';
  }
  if (entry.bleeding === 'brown' && rank === 0) {
    return 'A dry observation and brown were both recorded.';
  }
  if (entry.bleeding === 'brown' && rank === null) {
    return 'Choose a sensation to complete this observation.';
  }
  switch (rank) {
    case 0: return 'Dry observation recorded.';
    case 1: return 'A mucus sign was recorded.';
    case 2: return 'A wetter mucus sign was recorded.';
    case 3: return 'A Peak-type sign was recorded.';
    default: return '';
  }
}

export function TodayEntryCard({
  entry,
  mucusRank,
  primaryDayClass,
  date,
  onReview,
  onAddObservation,
}: Props): React.JSX.Element {
  const monthDay = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const observationCount = resolveDailyMucus(entry).observations.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Observation</Text>
        <Text style={styles.date}>{monthDay}</Text>
      </View>
      {entry?.missing ? (
        <View style={styles.body}>
          <Text style={styles.primaryLabel}>Not observed</Text>
          <Text style={styles.hint}>This day is marked as not observed.</Text>
          <Pressable
            style={[styles.primaryAction, styles.standaloneAction]}
            onPress={onReview}
            accessibilityRole="button"
            accessibilityLabel="Review today's daily entry"
          >
            <Text style={styles.primaryActionText}>Review day</Text>
          </Pressable>
        </View>
      ) : entry ? (
        <View style={styles.body}>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{getMucusLabel(entry, mucusRank, primaryDayClass)}</Text>
            </View>
            {entry.intercourse && (
              <View style={[styles.tag, styles.intercourseTag]}>
                <Text style={styles.tagText}>Intercourse</Text>
              </View>
            )}
          </View>
          <Text style={styles.hint}>{getFertilityHint(entry, mucusRank, primaryDayClass)}</Text>
          {observationCount > 1 ? (
            <Text style={styles.observationCount}>
              {observationCount} mucus observations · chart result shown above
            </Text>
          ) : null}
          <View style={styles.actionRow}>
            <Pressable
              style={styles.primaryAction}
              onPress={onReview}
              accessibilityRole="button"
              accessibilityLabel="Review today's daily entry"
            >
              <Text style={styles.primaryActionText}>Review day</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryAction}
              onPress={onAddObservation}
              accessibilityRole="button"
              accessibilityLabel="Add another mucus observation for today"
            >
              <Text style={styles.secondaryActionText}>+ Add observation</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.body}>
          <Text style={styles.hint}>No observation recorded yet.</Text>
          <Pressable
            style={[styles.primaryAction, styles.standaloneAction]}
            onPress={onReview}
            accessibilityRole="button"
            accessibilityLabel="Record today's daily entry"
          >
            <Text style={styles.primaryActionText}>Record today</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG_CARD,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: TEXT_PRIMARY },
  date: { fontSize: 14, color: TEXT_MUTED },
  body: { marginTop: 8 },
  tags: { flexDirection: 'row', gap: 8 },
  tag: {
    backgroundColor: BG_MISSING,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  intercourseTag: { backgroundColor: ACCENT_WARM_TINT },
  tagText: { fontSize: 12, color: TEXT_SECONDARY },
  hint: { fontSize: 14, fontWeight: '400', color: TEXT_SUBTLE, marginTop: 8 },
  primaryLabel: { fontSize: 16, fontWeight: '600', color: TEXT_PRIMARY },
  observationCount: { fontSize: 13, color: TEXT_MUTED, marginTop: 6 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  primaryAction: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: ACCENT_WARM,
  },
  standaloneAction: { marginTop: 14 },
  primaryActionText: { fontSize: 14, fontWeight: '600', color: BG_CARD },
  secondaryAction: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: ACCENT_WARM_TINT,
  },
  secondaryActionText: { fontSize: 13, fontWeight: '600', color: ACCENT_WARM },
});
