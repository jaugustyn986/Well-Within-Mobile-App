import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BG_CARD, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, BORDER_CARD } from '../theme/colors';

interface Props {
  insights: string[];
}

export function PatternInsights({ insights }: Props): JSX.Element {
  if (insights.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Your Patterns</Text>
        <View style={styles.card}>
          <Text style={styles.emptyText}>
            Pattern insights will appear once at least two complete cycles are recorded.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Patterns</Text>
      <View style={styles.card}>
        {insights.map((text, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text style={styles.insightText}>{text}</Text>
          </View>
        ))}
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
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  bulletRow: { flexDirection: 'row', marginBottom: 8 },
  bullet: { fontSize: 15, color: TEXT_SECONDARY, marginRight: 8, lineHeight: 22 },
  insightText: { fontSize: 15, fontWeight: '400', color: TEXT_SECONDARY, flex: 1, lineHeight: 22 },
  emptyText: { fontSize: 15, fontWeight: '400', color: TEXT_MUTED, textAlign: 'center', lineHeight: 22 },
});
