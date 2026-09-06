import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  buildFirstReleasePossibleFertilePatternEligibility,
  buildPossibleFertilePatternPresentation,
  evaluateInterpretationSupport,
  type CycleSlice,
} from 'core-rules-engine';
import { formatCyclePrimarySecondary } from '../utils/cycleDisplay';
import {
  BG_CARD, BG_DRY, BG_POST_PEAK, BG_MISSING,
  TEXT_PRIMARY, TEXT_MUTED, TEXT_SECONDARY,
  BORDER_CARD, ACCENT_WARM, ACCENT_WARM_TINT,
} from '../theme/colors';
import {
  buildCycleStartResolutionCopy,
  findCycleStartResolution,
} from './cycleStartResolution';
import {
  CycleMetricIcon,
  type CycleMetricIconName,
} from './CycleMetricIcon';
import {
  resolveCycleCardStatusKey,
  type CycleCardStatusKey,
} from './cycleCardPresentation';

interface Props {
  cycle: CycleSlice;
  allCycles: CycleSlice[];
  onPress: () => void;
  onResolveCycleStart?: (date: string) => void;
}

interface StatusStyle {
  bg: string;
  text: string;
  label: string;
  icon: CycleMetricIconName;
}

const STATUS_CONTEXT_BG = '#F4DFE2';
const STATUS_CONTEXT_TEXT = '#7A3E4A';

function getStatusStyle(status: CycleCardStatusKey): StatusStyle {
  switch (status) {
    case 'complete':
      return {
        bg: BG_DRY,
        text: '#15803d',
        label: 'Complete',
        icon: 'calendar-check',
      };
    case 'in_progress':
      return {
        bg: BG_POST_PEAK,
        text: '#92400e',
        label: 'In Progress',
        icon: 'calendar-progress',
      };
    case 'no_peak':
      return {
        bg: STATUS_CONTEXT_BG,
        text: STATUS_CONTEXT_TEXT,
        label: 'Peak not confirmed',
        icon: 'calendar-question',
      };
    case 'needs_review':
      return {
        bg: STATUS_CONTEXT_BG,
        text: STATUS_CONTEXT_TEXT,
        label: 'Needs review',
        icon: 'calendar-question',
      };
    case 'needs_context':
      return {
        bg: STATUS_CONTEXT_BG,
        text: STATUS_CONTEXT_TEXT,
        label: 'Needs context',
        icon: 'calendar-question',
      };
  }
}

export function CycleCard({
  cycle,
  allCycles,
  onPress,
  onResolveCycleStart,
}: Props): React.JSX.Element {
  const interpretation = useMemo(
    () => evaluateInterpretationSupport(cycle.entries, cycle.result),
    [cycle],
  );
  const presentation = useMemo(
    () => buildPossibleFertilePatternPresentation(
      cycle.entries,
      cycle.result,
      buildFirstReleasePossibleFertilePatternEligibility(cycle.cycleBoundary),
    ),
    [cycle],
  );
  const showDerivedPattern =
    presentation.state === 'bounded' &&
    presentation.interpretationStatus === 'summary_available';
  const latestCycleNumber = Math.max(...allCycles.map((candidate) => candidate.cycleNumber));
  const statusKey = resolveCycleCardStatusKey({
    cycleNumber: cycle.cycleNumber,
    latestCycleNumber,
    cycleStatus: cycle.status,
    interpretationStatus: interpretation.status,
  });
  const statusInfo = getStatusStyle(statusKey);
  const interpretationLimited =
    interpretation.status === 'review_recommended' ||
    interpretation.status === 'blocked_by_missing';
  const { primary, secondary } = useMemo(
    () => formatCyclePrimarySecondary(cycle, allCycles),
    [cycle, allCycles],
  );
  const cycleStartResolution = useMemo(
    () => findCycleStartResolution(cycle),
    [cycle],
  );
  const cycleStartCopy = useMemo(
    () => cycleStartResolution
      ? buildCycleStartResolutionCopy(cycleStartResolution)
      : null,
    [cycleStartResolution],
  );
  const displayedPrimary = cycleStartResolution
    ? `Cycle ${cycle.cycleNumber}`
    : primary;
  const displayedSecondary = cycleStartResolution
    ? 'Start date needs confirmation'
    : secondary;

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.mainPressable, pressed && styles.pressed]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${displayedPrimary}. ${displayedSecondary}. ${statusInfo.label}`}
        accessibilityHint="Opens this cycle's chart details"
      >
        <View style={styles.contentRow}>
          <View style={styles.statusIcon} accessibilityElementsHidden>
            <CycleMetricIcon
              name={statusInfo.icon}
              size={44}
              backgroundColor={statusInfo.bg}
            />
          </View>
          <View style={styles.contentBody}>
            <View style={styles.topRow}>
              <Text style={styles.primaryTitle} numberOfLines={2}>{displayedPrimary}</Text>
              <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
                <Text style={[styles.badgeText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
              </View>
            </View>
            <Text style={styles.secondaryLine}>{displayedSecondary}</Text>
            {!cycleStartResolution ? (
              <View style={styles.statsRow}>
                <StatPill label="Length" value={`${cycle.length}d`} />
                <StatPill
                  label="Peak"
                  value={showDerivedPattern && cycle.peakDay !== null ? `Day ${cycle.peakDay}` : '--'}
                />
                <StatPill
                  label="After Peak"
                  value={showDerivedPattern && cycle.lutealPhase !== null ? `${cycle.lutealPhase}d` : '--'}
                />
                {presentation.reason === 'later_peak_type_reopens_pattern' ? (
                  <StatPill
                    label="Peak-type"
                    value={`${presentation.observedPeakTypeSigns.length} ${presentation.observedPeakTypeSigns.length === 1 ? 'sign' : 'signs'}`}
                  />
                ) : null}
              </View>
            ) : null}
            {interpretationLimited ? (
              <Text style={styles.limitationText}>
                {presentation.heading ?? 'This chart needs more context'}
              </Text>
            ) : null}
          </View>
          <Text style={styles.chevron} accessibilityElementsHidden>{'›'}</Text>
        </View>
      </Pressable>
      {cycleStartResolution && cycleStartCopy ? (
        <View style={styles.cycleStartSection}>
          <Text style={styles.cycleStartHeading}>{cycleStartCopy.heading}</Text>
          <Text style={styles.cycleStartText}>{cycleStartCopy.evidence}</Text>
          {onResolveCycleStart ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={cycleStartCopy.actionLabel}
              onPress={() => onResolveCycleStart(cycleStartResolution.date)}
              style={({ pressed }) => [styles.cycleStartAction, pressed && styles.pressed]}
            >
              <Text style={styles.cycleStartActionText}>{cycleStartCopy.actionLabel}</Text>
              <Text style={styles.cycleStartActionArrow}>{'›'}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function StatPill({ label, value }: { label: string; value: string }): React.JSX.Element {
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
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    overflow: 'hidden',
  },
  mainPressable: { padding: 16 },
  pressed: { opacity: 0.6 },
  contentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  statusIcon: { paddingTop: 1 },
  contentBody: { flex: 1, minWidth: 0 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  primaryTitle: { fontSize: 16, fontWeight: '600', color: TEXT_PRIMARY, flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, flexShrink: 0 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  secondaryLine: { fontSize: 13, color: TEXT_MUTED, marginTop: 4 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  statPill: {
    backgroundColor: BG_MISSING,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: { fontSize: 14, fontWeight: '600', color: TEXT_PRIMARY },
  statLabel: { fontSize: 10, color: TEXT_MUTED, marginTop: 1 },
  chevron: {
    color: TEXT_PRIMARY,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
    marginTop: 4,
  },
  limitationText: { fontSize: 13, color: TEXT_MUTED, lineHeight: 19, marginTop: 10 },
  cycleStartSection: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
    backgroundColor: ACCENT_WARM_TINT,
  },
  cycleStartHeading: { fontSize: 14, fontWeight: '600', color: TEXT_PRIMARY },
  cycleStartText: { marginTop: 3, fontSize: 12, lineHeight: 18, color: TEXT_SECONDARY },
  cycleStartAction: {
    minHeight: 36,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  cycleStartActionText: { fontSize: 13, fontWeight: '600', color: ACCENT_WARM },
  cycleStartActionArrow: { marginLeft: 4, fontSize: 18, lineHeight: 18, color: ACCENT_WARM },
});
