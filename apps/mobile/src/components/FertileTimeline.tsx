import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  type PossibleFertilePatternMarker,
  type PossibleFertilePatternPresentation,
} from 'core-rules-engine';
import {
  BG_CARD,
  BG_POST_PEAK,
  FERTILE_ACCENT,
  PEAK_BORDER,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  BORDER_CARD,
  ACCENT_WARM,
} from '../theme/colors';
import { buildDevelopingPatternCardCopy } from './cycleHistoryPresentation';
import {
  formatFullDate,
  formatPossibleFertilePatternBody,
} from '../utils/dateDisplay';

interface Props {
  presentation: PossibleFertilePatternPresentation;
  isCurrentCycle: boolean;
  cycleStatus: 'complete' | 'in_progress' | 'no_peak';
  cycleDayByDate?: Readonly<Record<string, number>>;
  onLearnMore: () => void;
}

interface Milestone {
  label: string;
  marker: PossibleFertilePatternMarker;
  color: string;
  completed?: boolean;
}

const RETROSPECTIVE_NOTE =
  'A look back at what you recorded—not a prediction or confirmation of ovulation.';

function displayCycleDay(
  marker: PossibleFertilePatternMarker,
  cycleDayByDate: Readonly<Record<string, number>>,
): number {
  return marker.date ? cycleDayByDate[marker.date] ?? marker.cycleDay : marker.cycleDay;
}

function markerLabel(
  marker: PossibleFertilePatternMarker,
  cycleDayByDate: Readonly<Record<string, number>>,
): string {
  const cycleDay = displayCycleDay(marker, cycleDayByDate);
  return marker.date
    ? `${formatFullDate(marker.date)} · Cycle Day ${cycleDay}`
    : `Cycle Day ${cycleDay}`;
}

/**
 * Renders only the engine-owned possible-pattern presentation. In particular,
 * this component never derives a boundary from legacy fertile indices.
 */
export function FertileTimeline({
  presentation,
  isCurrentCycle,
  cycleStatus,
  cycleDayByDate = {},
  onLearnMore,
}: Props): React.JSX.Element | null {
  if (presentation.state === 'hidden' || !presentation.heading || !presentation.body) {
    return null;
  }

  const milestones: Milestone[] = [];
  if (presentation.state === 'bounded') {
    if (presentation.start) {
      milestones.push({
        label: 'First recorded mucus sign',
        marker: presentation.start,
        color: FERTILE_ACCENT,
      });
    }
    if (presentation.peak) {
      milestones.push({ label: 'Peak marker', marker: presentation.peak, color: PEAK_BORDER });
    }
    if (presentation.pPlus3) {
      milestones.push({
        label: 'P+3 recorded',
        marker: presentation.pPlus3,
        color: BG_POST_PEAK,
        completed: true,
      });
    }
  }

  const developingCopy = presentation.state === 'developing'
    ? buildDevelopingPatternCardCopy({
        reason: presentation.reason,
        isCurrentCycle,
        cycleStatus,
        observedPeakTypeCycleDays: presentation.observedPeakTypeSigns.map(
          (marker) => displayCycleDay(marker, cycleDayByDate),
        ),
        observedMucusCycleDays: presentation.observedMucusSigns.map(
          (marker) => displayCycleDay(marker, cycleDayByDate),
        ),
      })
    : null;

  if (developingCopy) {
    return (
      <View style={styles.noteCard}>
        <Text style={styles.noteEyebrow}>{developingCopy.eyebrow}</Text>
        <Text style={styles.noteHeading}>{developingCopy.heading}</Text>
        <Text style={styles.noteBody}>{developingCopy.meaning}</Text>
        <Text style={styles.noteNextStep}>{developingCopy.nextStep}</Text>
        <Pressable
          onPress={onLearnMore}
          accessibilityRole="button"
          accessibilityLabel={developingCopy.learnMoreLabel}
          hitSlop={6}
          style={({ pressed }) => [styles.learnMore, pressed && styles.learnMorePressed]}
        >
          <Text style={styles.learnMoreText}>{developingCopy.learnMoreLabel}</Text>
          <Text style={styles.learnMoreArrow}>{'›'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{presentation.heading}</Text>
      <View style={styles.card}>
        <Text style={styles.body}>{formatPossibleFertilePatternBody(presentation)}</Text>
        {presentation.limit ? (
          <Text style={styles.limit}>{presentation.limit.detail}</Text>
        ) : null}
        {milestones.length > 0 ? (
          <View style={styles.milestones}>
            {milestones.map((milestone, index) => (
              <View key={milestone.label} style={styles.milestoneRow}>
                <View style={[styles.dot, { backgroundColor: milestone.color }]}>
                  {milestone.completed ? <Text style={styles.completedCheck}>✓</Text> : null}
                </View>
                {index < milestones.length - 1 ? <View style={styles.line} /> : null}
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneLabel}>{milestone.label}</Text>
                  <Text style={styles.milestoneDay}>
                    {markerLabel(milestone.marker, cycleDayByDate)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}
        {presentation.limitation ? (
          <Text style={styles.limitation}>{RETROSPECTIVE_NOTE}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, marginTop: 16 },
  noteCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#F7F0E8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  noteEyebrow: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: TEXT_MUTED,
  },
  noteHeading: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginTop: 4,
  },
  noteBody: { fontSize: 14, color: TEXT_SECONDARY, lineHeight: 21, marginTop: 7 },
  noteNextStep: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 19,
    marginTop: 10,
  },
  heading: { fontSize: 21, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 8 },
  card: {
    backgroundColor: BG_CARD,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  body: { fontSize: 14, color: TEXT_SECONDARY, lineHeight: 21 },
  learnMore: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  learnMorePressed: { opacity: 0.55 },
  learnMoreText: { fontSize: 13, fontWeight: '600', color: ACCENT_WARM },
  learnMoreArrow: { fontSize: 18, lineHeight: 18, color: ACCENT_WARM, marginLeft: 4 },
  limit: { fontSize: 13, color: TEXT_MUTED, lineHeight: 19, marginTop: 10 },
  milestones: { marginTop: 16 },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    position: 'relative',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheck: {
    color: FERTILE_ACCENT,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
  },
  line: {
    position: 'absolute',
    left: 7,
    top: 17,
    width: 2,
    height: 22,
    backgroundColor: BORDER_CARD,
  },
  milestoneContent: { flex: 1 },
  milestoneLabel: { fontSize: 14, fontWeight: '600', color: TEXT_PRIMARY },
  milestoneDay: { fontSize: 13, color: TEXT_SECONDARY, marginTop: 1 },
  limitation: {
    fontSize: 12,
    color: TEXT_MUTED,
    lineHeight: 18,
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
  },
});
