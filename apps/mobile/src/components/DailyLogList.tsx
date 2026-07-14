import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  buildCalendarAlignedCycleDays,
  mucusChartStrengthLabel,
  type CycleSlice,
} from 'core-rules-engine';
import {
  BG_BLEEDING, BG_CARD, BG_DRY, BG_MISSING, BG_PEAK_TYPE, BG_POST_PEAK,
  FERTILE_ACCENT, PEAK_BORDER,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_CARD, INTERCOURSE_ICON,
} from '../theme/colors';
import {
  derivedPatternMarkerLabel,
  getDayPresentationEvidence,
  type DayPresentationEvidence,
} from './dayPresentationContract';

interface Props {
  cycle: CycleSlice;
  showDerivedMarkers?: boolean;
}

function getDayCircleColor(evidence: DayPresentationEvidence, bleeding: boolean): string {
  if (evidence.recordedState === 'missing') return BG_MISSING;
  if (bleeding) return BG_BLEEDING;
  if (
    evidence.derivedMarker === 'p_plus_1' ||
    evidence.derivedMarker === 'p_plus_2' ||
    evidence.derivedMarker === 'p_plus_3'
  ) {
    return BG_POST_PEAK;
  }
  if (evidence.recordedState === 'peak_type') return BG_PEAK_TYPE;
  return BG_DRY;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getRankLabel(rank: number | null): string {
  return mucusChartStrengthLabel(rank, '--');
}

export function DailyLogList({ cycle, showDerivedMarkers = false }: Props): React.JSX.Element {
  const days = buildCalendarAlignedCycleDays(cycle);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Daily Log</Text>
      <View style={styles.card}>
        {days.map((day) => {
          const { entry, phaseLabel: phase, mucusRank: rank } = day;
          const bleeding = entry?.bleeding !== undefined && entry.bleeding !== 'none';
          const spottingWithMucus = entry?.bleeding === 'spotting' && rank !== null && rank >= 1;
          const evidence = getDayPresentationEvidence({
            mucusRank: rank,
            phaseLabel: phase,
            showDerivedMarkers,
          });
          const isPeak = evidence.derivedMarker === 'peak_day';
          const circleColor = getDayCircleColor(evidence, bleeding);
          const dotColor = !bleeding && evidence.recordedState === 'mucus'
            ? FERTILE_ACCENT
            : null;
          const markerLabel = derivedPatternMarkerLabel(evidence.derivedMarker);

          return (
            <View key={day.date} style={[styles.row, isPeak && styles.peakRow]}>
              <View style={[styles.dayCircle, { backgroundColor: circleColor }]}>
                {dotColor && <View style={[styles.dayDot, { backgroundColor: dotColor }]} />}
                <Text style={styles.dayNum}>{day.cycleDay}</Text>
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.dateText}>{formatDate(day.date)}</Text>
                <Text style={styles.rankText}>
                  {!entry
                    ? 'No entry'
                    : spottingWithMucus
                      ? `Spotting + ${getRankLabel(rank)}`
                      : bleeding
                        ? `Bleeding (${entry.bleeding})`
                        : getRankLabel(rank)}
                  {!bleeding && entry?.frequency
                    ? ` ${entry.frequency === 'all_day' ? 'AD' : `x${entry.frequency}`}`
                    : ''}
                </Text>
              </View>
              <View style={styles.rowRight}>
                {entry?.intercourse && (
                  <Text style={styles.roseIcon}>{INTERCOURSE_ICON}</Text>
                )}
                {markerLabel ? (
                  <View style={styles.phaseBadge}>
                    <Text style={styles.phaseBadgeText}>{markerLabel}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, marginTop: 16 },
  heading: { fontSize: 21, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 8 },
  card: {
    backgroundColor: BG_CARD,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_CARD,
  },
  peakRow: {
    borderWidth: 1.5,
    borderColor: PEAK_BORDER,
    borderRadius: 8,
    marginHorizontal: -4,
    paddingHorizontal: 4,
    borderBottomWidth: 1.5,
  },
  dayCircle: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10,
  },
  dayDot: {
    width: 6, height: 6, borderRadius: 3,
    position: 'absolute', top: 2, right: 2,
  },
  dayNum: { fontSize: 12, fontWeight: '600', color: TEXT_PRIMARY },
  rowContent: { flex: 1 },
  dateText: { fontSize: 13, color: TEXT_PRIMARY },
  rankText: { fontSize: 12, color: TEXT_SECONDARY, marginTop: 1 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  roseIcon: { fontSize: 12 },
  phaseBadge: {
    backgroundColor: BG_MISSING,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  phaseBadgeText: { fontSize: 10, fontWeight: '500', color: TEXT_MUTED },
});
