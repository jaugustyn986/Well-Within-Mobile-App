import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { CalendarAlignedCycleDay, PhaseLabel } from 'core-rules-engine';
import {
  BG_CARD, BG_DRY, BG_MISSING, BG_POST_PEAK, BG_PEAK_TYPE,
  FERTILE_ACCENT, PEAK_BORDER,
  TEXT_PRIMARY, TEXT_MUTED, TEXT_SUBTLE,
  BORDER_CARD, INTERCOURSE_ICON,
} from '../theme/colors';

interface Props {
  days: CalendarAlignedCycleDay[];
  title?: string;
}

function getBarColor(rank: number | null, phase: PhaseLabel): string {
  if (rank === null || phase === 'missing') return BG_MISSING;
  if (phase === 'p_plus_1' || phase === 'p_plus_2' || phase === 'p_plus_3') return BG_POST_PEAK;
  if (rank >= 3) return BG_PEAK_TYPE;
  if (rank >= 1) return FERTILE_ACCENT;
  return BG_DRY;
}

const MAX_RANK = 3;
const BAR_HEIGHT = 120;

export function MucusChart({ days, title }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? 'Mucus Pattern'}</Text>

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
            const color = getBarColor(rank, day.phaseLabel);
            const isPeak = day.phaseLabel === 'peak_confirmed';
            const hasIntercourse = !!day.entry?.intercourse;

            return (
              <View key={day.date} style={styles.barCol}>
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
                      isPeak && styles.peakBar,
                    ]}
                  />
                </View>
                <Text style={[styles.dayLabel, isPeak && styles.peakDayLabel]}>
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
        <LegendDot color={BG_PEAK_TYPE} label="Peak-type" />
        <LegendDot color={BG_POST_PEAK} label="Post-Peak" />
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }): React.JSX.Element {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG_CARD, borderRadius: 12, padding: 16,
    marginHorizontal: 16, marginTop: 16,
  },
  title: { fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 12 },
  yAxis: {
    position: 'absolute', left: 16, top: 44,
    height: BAR_HEIGHT, justifyContent: 'space-between',
  },
  yLabel: { fontSize: 9, color: TEXT_MUTED },
  scrollArea: { marginLeft: 50 },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', height: BAR_HEIGHT + 32 },
  barCol: { alignItems: 'center', marginHorizontal: 2, width: 24 },
  barArea: { height: BAR_HEIGHT, justifyContent: 'flex-end' },
  bar: { width: 16, borderRadius: 4 },
  peakBar: { borderWidth: 2, borderColor: PEAK_BORDER },
  roseAboveBar: { fontSize: 10, marginBottom: 2 },
  dayLabel: { fontSize: 10, color: TEXT_MUTED, marginTop: 4 },
  peakDayLabel: { color: PEAK_BORDER, fontWeight: '600' },
  legend: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 4, borderWidth: 1, borderColor: BORDER_CARD },
  legendText: { fontSize: 11, color: TEXT_SUBTLE },
});
