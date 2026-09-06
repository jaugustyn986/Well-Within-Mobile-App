import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  buildCycleStartResolutionCopy,
  type CycleStartResolution,
} from './cycleStartResolution';
import {
  ACCENT_WARM,
  ACCENT_WARM_TINT,
  BORDER_CARD,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from '../theme/colors';

interface Props {
  resolution: CycleStartResolution;
  onResolve: () => void;
}

export function CycleStartResolutionCard({
  resolution,
  onResolve,
}: Props): React.JSX.Element {
  const copy = useMemo(
    () => buildCycleStartResolutionCopy(resolution),
    [resolution],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Cycle start</Text>
      <Text style={styles.heading}>{copy.heading}</Text>
      <Text style={styles.evidence}>{copy.evidence}</Text>
      <Text style={styles.explanation}>{copy.explanation}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={copy.actionLabel}
        onPress={onResolve}
        style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
      >
        <Text style={styles.actionText}>{copy.actionLabel}</Text>
        <Text style={styles.actionArrow}>{'›'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    backgroundColor: ACCENT_WARM_TINT,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: ACCENT_WARM,
  },
  heading: {
    marginTop: 4,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  evidence: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: TEXT_PRIMARY,
  },
  explanation: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: TEXT_SECONDARY,
  },
  action: {
    minHeight: 44,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  actionPressed: { opacity: 0.6 },
  actionText: { fontSize: 14, fontWeight: '600', color: ACCENT_WARM },
  actionArrow: { marginLeft: 5, fontSize: 19, lineHeight: 19, color: ACCENT_WARM },
});
