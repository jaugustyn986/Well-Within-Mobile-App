import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  buildCalendarAlignedCycleDays,
  mucusChartStrengthLabel,
  type CycleSlice,
  type DailyEntry,
  type PrimaryDayClass,
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

function getDayCircleColor(
  evidence: DayPresentationEvidence,
  primaryDayClass: PrimaryDayClass,
): string {
  if (primaryDayClass === 'menstrual_flow' || primaryDayClass === 'spotting') {
    return BG_BLEEDING;
  }
  if (evidence.recordedState === 'missing') return BG_MISSING;
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

function bleedingObservationLabel(entry: DailyEntry): string | null {
  if (entry.bleeding === 'spotting') return 'Spotting';
  if (entry.bleeding === 'brown') return 'Brown';
  if (entry.bleeding && entry.bleeding !== 'none') return `Bleeding (${entry.bleeding})`;
  return null;
}

function dailyObservationLabel(entry: DailyEntry | null, rank: number | null): string {
  if (!entry) return 'No entry';
  const bleedingLabel = bleedingObservationLabel(entry);
  const layeredBleeding = entry.bleeding === 'spotting' || entry.bleeding === 'brown';

  if (rank === null) {
    return bleedingLabel ? `${bleedingLabel} · Observation incomplete` : 'Observation incomplete';
  }
  if (!layeredBleeding && bleedingLabel) return bleedingLabel;
  if (rank >= 1 && bleedingLabel) return `${getRankLabel(rank)} · ${bleedingLabel}`;
  if (entry.bleeding === 'spotting') return 'Spotting';
  if (entry.bleeding === 'brown') return 'Dry · Brown';
  return getRankLabel(rank);
}

export function DailyLogList({ cycle, showDerivedMarkers = false }: Props): React.JSX.Element {
  const days = buildCalendarAlignedCycleDays(cycle);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Daily Log</Text>
      <View style={styles.card}>
        {days.map((day) => {
          const { entry, phaseLabel: phase, mucusRank: rank } = day;
          const evidence = getDayPresentationEvidence({
            mucusRank: rank,
            phaseLabel: phase,
            showDerivedMarkers,
          });
          const isPeak = evidence.derivedMarker === 'peak_day';
          const circleColor = getDayCircleColor(evidence, day.primaryDayClass);
          const dotColor = evidence.recordedState === 'mucus'
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
                  {dailyObservationLabel(entry, rank)}
                  {rank !== null && rank >= 1 && entry?.frequency
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
