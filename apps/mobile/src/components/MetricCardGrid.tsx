import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CycleMetricIcon, type CycleMetricIconName } from './CycleMetricIcon';
import {
  BG_CARD,
  TEXT_MUTED,
  TEXT_PRIMARY,
} from '../theme/colors';

export type MetricCardTone = 'blush' | 'cream' | 'sage';

export interface MetricCardItem {
  label: string;
  value: string;
  icon: CycleMetricIconName;
  tone: MetricCardTone;
  fullWidth?: boolean;
}

interface Props {
  items: MetricCardItem[];
  layout: 'three-column' | 'two-plus-wide';
}

const TONES: Record<MetricCardTone, { tint: string; border: string }> = {
  blush: { tint: '#F4DFD8', border: '#EACFC6' },
  cream: { tint: '#F5E8D2', border: '#EED9B8' },
  sage: { tint: '#E2E9D8', border: '#CFDAC0' },
};

export function MetricCardGrid({ items, layout }: Props): React.JSX.Element {
  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const tone = TONES[item.tone];
        const fullWidth = layout === 'two-plus-wide' && item.fullWidth;

        return (
          <View
            key={item.label}
            style={[
              styles.card,
              layout === 'three-column' ? styles.cardThird : styles.cardHalf,
              fullWidth && styles.cardFull,
              { borderColor: tone.border },
            ]}
          >
            <CycleMetricIcon
              name={item.icon}
              size={50}
              backgroundColor={tone.tint}
            />
            <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
              {item.value}
            </Text>
            <Text style={styles.label} numberOfLines={2}>{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    minWidth: 0,
    minHeight: 142,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BG_CARD,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  cardThird: { flexBasis: '30%' },
  cardHalf: { flexBasis: '47%' },
  cardFull: { flexBasis: '100%', minHeight: 132 },
  value: {
    color: TEXT_PRIMARY,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  label: {
    color: TEXT_MUTED,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 3,
  },
});
