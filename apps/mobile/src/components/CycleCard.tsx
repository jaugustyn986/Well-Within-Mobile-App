import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CycleSlice } from 'core-rules-engine';
import { formatCyclePrimarySecondary } from '../utils/cycleDisplay';
import {
  BG_CARD, BG_DRY, BG_POST_PEAK, BG_MISSING,
  TEXT_PRIMARY, TEXT_MUTED,
  BORDER_CARD,
} from '../theme/colors';

interface Props {
  cycle: CycleSlice;
  allCycles: CycleSlice[];
  onPress: () => void;
}

function getStatusStyle(status: CycleSlice['status']): { bg: string; text: string; label: string } {
  switch (status) {
    case 'complete':
      return { bg: BG_DRY, text: '#15803d', label: 'Complete' };
    case 'in_progress':
      return { bg: BG_POST_PEAK, text: '#92400e', label: 'In Progress' };
    case 'no_peak':
      return { bg: BG_MISSING, text: TEXT_MUTED, label: 'No Peak' };
  }
}

export function CycleCard({ cycle, allCycles, onPress }: Props): JSX.Element {
  const statusInfo = getStatusStyle(cycle.status);
  const { primary, secondary } = useMemo(
    () => formatCyclePrimarySecondary(cycle, allCycles),
    [cycle, allCycles],
  );

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.primaryTitle} numberOfLines={2}>{primary}</Text>
        <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.badgeText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
        </View>
      </View>
      <Text style={styles.secondaryLine}>{secondary}</Text>
      <View style={styles.statsRow}>
        <StatPill label="Length" value={`${cycle.length}d`} />
        <StatPill label="Peak" value={cycle.peakDay !== null ? `Day ${cycle.peakDay}` : '--'} />
        <StatPill label="Luteal" value={cycle.lutealPhase !== null ? `${cycle.lutealPhase}d` : '--'} />
      </View>
    </Pressable>
  );
}

function StatPill({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG_CARD,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  primaryTitle: { fontSize: 16, fontWeight: '600', color: TEXT_PRIMARY, flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, flexShrink: 0 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  secondaryLine: { fontSize: 13, color: TEXT_MUTED, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  statPill: {
    backgroundColor: BG_MISSING,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: { fontSize: 14, fontWeight: '600', color: TEXT_PRIMARY },
  statLabel: { fontSize: 10, color: TEXT_MUTED, marginTop: 1 },
});
