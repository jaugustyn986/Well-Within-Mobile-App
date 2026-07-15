import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PossibleFertilePatternHistoryPresentation } from 'core-rules-engine';
import {
  BG_CARD,
  BG_MISSING,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  BORDER_CARD,
} from '../theme/colors';
import { buildCycleHistoryCardCopy } from './cycleHistoryPresentation';

interface Props {
  history: PossibleFertilePatternHistoryPresentation;
}

export function CycleSummaryPanel({ history }: Props): React.JSX.Element {
  const copy = buildCycleHistoryCardCopy(history);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{copy.heading}</Text>
      <View style={styles.card}>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>{copy.progressLabel}</Text>
        </View>
        <Text style={styles.body}>{copy.body}</Text>
        <Text style={styles.supportingBody}>{copy.benefit}</Text>
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
  supportingBody: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 19,
    marginTop: 10,
  },
});
