import React from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { CalendarAlignedCycleDay, PhaseLabel } from 'core-rules-engine';
import {
  BG_CARD, BG_DRY, BG_MISSING, BG_POST_PEAK, BG_PEAK_TYPE,
  FERTILE_ACCENT, PEAK_BORDER,
  TEXT_PRIMARY, TEXT_MUTED, TEXT_SUBTLE,
  BORDER_CARD, INTERCOURSE_ICON,
} from '../theme/colors';
import { getDayPresentationEvidence } from './dayPresentationContract';

interface Props {
  days: CalendarAlignedCycleDay[];
  title?: string;
  showDerivedMarkers?: boolean;
}

function getBarColor(
  rank: number | null,
  phase: PhaseLabel,
  showDerivedMarkers: boolean,
): string {
  const evidence = getDayPresentationEvidence({
    mucusRank: rank,
    phaseLabel: phase,
    showDerivedMarkers,
  });
  if (
    evidence.derivedMarker === 'p_plus_1' ||
    evidence.derivedMarker === 'p_plus_2' ||
    evidence.derivedMarker === 'p_plus_3'
  ) {
    return BG_POST_PEAK;
  }
  switch (evidence.recordedState) {
    case 'missing': return BG_MISSING;
    case 'peak_type': return BG_PEAK_TYPE;
    case 'mucus': return FERTILE_ACCENT;
    default: return BG_DRY;
  }
}

const MAX_RANK = 3;
const BAR_HEIGHT = 120;

export function MucusChart({
  days,
  title,
  showDerivedMarkers = false,
}: Props): React.JSX.Element {
  const { width } = useWindowDimensions();
  const compactColumns = width < 600 && days.length <= 24;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? 'Recorded mucus pattern'}</Text>
      <Text style={styles.subtitle}>
        {showDerivedMarkers
          ? 'Bars show daily observations. The outline marks the Peak Day identified from the surrounding entries.'
          : 'Bars show the strongest mucus sign recorded for each day.'}
      </Text>

      <View style={styles.yAxis}>
        <Text style={styles.yLabel}>Peak-type</Text>
        <Text style={styles.yLabel}>Wet</Text>
        <Text style={styles.yLabel}>Damp</Text>
        <Text style={styles.yLabel}>Dry</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollArea}>
        <View style={styles.chartRow}>
          {days.map((day) => {
            const rank = day.mucusRank;
            const height = rank !== null ? (rank / MAX_RANK) * BAR_HEIGHT : 0;
            const evidence = getDayPresentationEvidence({
              mucusRank: rank,
              phaseLabel: day.phaseLabel,
              showDerivedMarkers,
            });
            const color = getBarColor(rank, day.phaseLabel, showDerivedMarkers);
            const isPeak = evidence.derivedMarker === 'peak_day';
            const hasIntercourse = !!day.entry?.intercourse;

            return (
              <View
                key={day.date}
                style={[styles.barCol, compactColumns && styles.barColCompact]}
              >
                {hasIntercourse && (
                  <Text style={styles.roseAboveBar}>{INTERCOURSE_ICON}</Text>
                )}
                <View style={styles.barArea}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(height, 4),
                        backgroundColor: color,
                      },
                      compactColumns && styles.barCompact,
                      isPeak && styles.peakBar,
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.dayLabel,
                    compactColumns && styles.dayLabelCompact,
                    isPeak && styles.peakDayLabel,
                  ]}
                >
                  {day.cycleDay}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <LegendDot color={BG_MISSING} label="Missing" />
        <LegendDot color={BG_DRY} label="Dry" />
        <LegendDot color={FERTILE_ACCENT} label="Mucus" />
        <LegendDot color={BG_PEAK_TYPE} label="Peak-type sign" />
        {showDerivedMarkers ? (
          <LegendDot color={BG_PEAK_TYPE} outlineColor={PEAK_BORDER} label="Peak Day" />
        ) : null}
        {showDerivedMarkers ? <LegendDot color={BG_POST_PEAK} label="P+1–P+3" /> : null}
      </View>
    </View>
  );
}

function LegendDot({
  color,
  outlineColor,
  label,
}: {
  color: string;
  outlineColor?: string;
  label: string;
}): React.JSX.Element {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          { backgroundColor: color },
          outlineColor ? { borderColor: outlineColor, borderWidth: 2 } : null,
        ]}
      />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG_CARD, borderRadius: 12, padding: 16,
    marginHorizontal: 16, marginTop: 16,
  },
  title: { fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY },
  subtitle: { fontSize: 12, lineHeight: 17, color: TEXT_MUTED, marginTop: 3, marginBottom: 12 },
  yAxis: {
    position: 'absolute', left: 16, top: 78,
    height: BAR_HEIGHT, justifyContent: 'space-between',
  },
  yLabel: { fontSize: 9, color: TEXT_MUTED },
  scrollArea: { marginLeft: 50 },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', height: BAR_HEIGHT + 32 },
  barCol: { alignItems: 'center', marginHorizontal: 2, width: 24 },
  barColCompact: { marginHorizontal: 1, width: 11 },
  barArea: { height: BAR_HEIGHT, justifyContent: 'flex-end' },
  bar: { width: 16, borderRadius: 4 },
  barCompact: { width: 9, borderRadius: 3 },
  peakBar: { borderWidth: 2, borderColor: PEAK_BORDER },
  roseAboveBar: { fontSize: 10, marginBottom: 2 },
  dayLabel: { fontSize: 10, color: TEXT_MUTED, marginTop: 4 },
  dayLabelCompact: { fontSize: 8 },
  peakDayLabel: { color: PEAK_BORDER, fontWeight: '600' },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    gap: 10,
    rowGap: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 4, borderWidth: 1, borderColor: BORDER_CARD },
  legendText: { fontSize: 11, color: TEXT_SUBTLE },
});
