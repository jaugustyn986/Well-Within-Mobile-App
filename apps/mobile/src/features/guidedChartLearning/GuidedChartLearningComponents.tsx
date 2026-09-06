import React, { useMemo } from 'react';
import {
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ChartTipDefinition } from './guidedChartLearning';
import { LineIcon } from '../../components/LineIcon';
import {
  ACCENT_WARM,
  ACCENT_WARM_TINT,
  BANNER_TONE_POSITIVE_BG,
  BG_CARD,
  BG_PAGE,
  BORDER_CARD,
  FERTILE_ACCENT,
  TEXT_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from '../../theme/colors';

function SheetHandle(): React.JSX.Element {
  return <View style={sheetStyles.handle} />;
}

function useDismissPan(onDismiss: () => void) {
  return useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => (
      gesture.dy > 12 && Math.abs(gesture.dy) > Math.abs(gesture.dx)
    ),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy > 64 || gesture.vy > 0.8) onDismiss();
    },
  }), [onDismiss]);
}

export function FirstSaveConfirmationModal({
  visible,
  onLearn,
  onDismiss,
}: {
  visible: boolean;
  onLearn: () => void;
  onDismiss: () => void;
}): React.JSX.Element {
  const dismissPan = useDismissPan(onDismiss);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={sheetStyles.overlay}>
        <Pressable
          style={sheetStyles.scrim}
          onPress={onDismiss}
          accessibilityLabel="Dismiss first observation confirmation"
        />
        <View
          style={sheetStyles.sheet}
          accessibilityViewIsModal
          onAccessibilityEscape={onDismiss}
          {...dismissPan.panHandlers}
        >
          <SheetHandle />
          <View style={sheetStyles.successIcon}>
            <Text style={sheetStyles.successCheck}>✓</Text>
          </View>
          <Text style={sheetStyles.eyebrow}>FIRST OBSERVATION SAVED</Text>
          <Text style={sheetStyles.title}>Your chart has started</Text>
          <Text style={sheetStyles.body}>
            Your observation is now visible on the calendar. Want a quick explanation of its color and markers?
          </Text>
          <Pressable
            style={({ pressed }) => [
              sheetStyles.primaryButton,
              pressed && sheetStyles.pressed,
            ]}
            onPress={onLearn}
            accessibilityRole="button"
          >
            <Text style={sheetStyles.primaryButtonText}>See how it appears</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              sheetStyles.secondaryButton,
              pressed && sheetStyles.pressed,
            ]}
            onPress={onDismiss}
            accessibilityRole="button"
          >
            <Text style={sheetStyles.secondaryButtonText}>Not now</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function ContextualChartTip({
  lesson,
  onOpen,
  onMore,
}: {
  lesson: ChartTipDefinition;
  onOpen: () => void;
  onMore: () => void;
}): React.JSX.Element {
  return (
    <View style={tipStyles.section}>
      <View style={tipStyles.sectionHeader}>
        <Text style={tipStyles.eyebrow}>LEARN FROM YOUR CHART</Text>
        <Pressable
          style={({ pressed }) => [tipStyles.moreButton, pressed && tipStyles.pressed]}
          onPress={onMore}
          hitSlop={4}
          accessibilityRole="button"
          accessibilityLabel={`More options for ${lesson.title}`}
        >
          <Text style={tipStyles.moreText}>•••</Text>
        </Pressable>
      </View>
      <Pressable
        style={({ pressed }) => [tipStyles.row, pressed && tipStyles.pressed]}
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`${lesson.title}. ${lesson.summary}`}
      >
        <LineIcon name="calendar" size={16} />
        <View style={tipStyles.copy}>
          <Text style={tipStyles.title}>{lesson.title}</Text>
          <Text style={tipStyles.summary}>{lesson.summary}</Text>
        </View>
        <Text style={tipStyles.chevron}>{'›'}</Text>
      </Pressable>
    </View>
  );
}

export function ChartTipOptionsModal({
  visible,
  lesson,
  onDismissLesson,
  onHideAll,
  onCancel,
}: {
  visible: boolean;
  lesson: ChartTipDefinition | null;
  onDismissLesson: () => void;
  onHideAll: () => void;
  onCancel: () => void;
}): React.JSX.Element {
  const dismissPan = useDismissPan(onCancel);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={sheetStyles.overlay}>
        <Pressable
          style={sheetStyles.scrim}
          onPress={onCancel}
          accessibilityLabel="Close chart tip options"
        />
        <View
          style={[sheetStyles.sheet, sheetStyles.optionSheet]}
          accessibilityViewIsModal
          onAccessibilityEscape={onCancel}
          {...dismissPan.panHandlers}
        >
          <SheetHandle />
          <Text style={sheetStyles.optionTitle}>Chart tip options</Text>
          {lesson ? (
            <Text style={sheetStyles.optionContext}>{lesson.title}</Text>
          ) : null}
          <Pressable
            style={({ pressed }) => [sheetStyles.optionRow, pressed && sheetStyles.pressed]}
            onPress={onDismissLesson}
            accessibilityRole="button"
          >
            <Text style={sheetStyles.optionRowText}>Not relevant to me</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [sheetStyles.optionRow, pressed && sheetStyles.pressed]}
            onPress={onHideAll}
            accessibilityRole="button"
          >
            <Text style={[sheetStyles.optionRowText, sheetStyles.hideText]}>Hide chart tips</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [sheetStyles.cancelButton, pressed && sheetStyles.pressed]}
            onPress={onCancel}
            accessibilityRole="button"
          >
            <Text style={sheetStyles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function FirstCompletedChartAcknowledgement({
  onReview,
  onDismiss,
}: {
  onReview: () => void;
  onDismiss: () => void;
}): React.JSX.Element {
  return (
    <View style={milestoneStyles.card}>
      <View style={milestoneStyles.headerRow}>
        <Text style={milestoneStyles.eyebrow}>FIRST COMPLETED CHART</Text>
        <Pressable
          style={({ pressed }) => [
            milestoneStyles.dismiss,
            pressed && milestoneStyles.pressed,
          ]}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss first completed chart acknowledgement"
        >
          <Text style={milestoneStyles.dismissText}>×</Text>
        </Pressable>
      </View>
      <Text style={milestoneStyles.title}>Your first completed chart is ready to review</Text>
      <Text style={milestoneStyles.body}>
        Look back at the observations and retrospective markers saved in this chart.
      </Text>
      <Pressable
        style={({ pressed }) => [
          milestoneStyles.reviewButton,
          pressed && milestoneStyles.pressed,
        ]}
        onPress={onReview}
        accessibilityRole="button"
      >
        <Text style={milestoneStyles.reviewText}>Review this chart ›</Text>
      </Pressable>
    </View>
  );
}

const sheetStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(63, 58, 54, 0.42)',
  },
  sheet: {
    backgroundColor: BG_CARD,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  optionSheet: { paddingBottom: 22 },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER_CARD,
    marginBottom: 18,
  },
  successIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BANNER_TONE_POSITIVE_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  successCheck: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    color: FERTILE_ACCENT,
  },
  eyebrow: {
    color: ACCENT_WARM,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    marginTop: 7,
    color: TEXT_PRIMARY,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: -0.25,
  },
  body: {
    marginTop: 10,
    color: TEXT_SECONDARY,
    fontSize: 15,
    lineHeight: 23,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: ACCENT_WARM,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    color: BG_CARD,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: ACCENT_WARM,
    fontSize: 15,
    fontWeight: '600',
  },
  optionTitle: {
    color: TEXT_PRIMARY,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '600',
  },
  optionContext: {
    color: TEXT_MUTED,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
    paddingBottom: 14,
  },
  optionRow: {
    minHeight: 54,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
  },
  optionRowText: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '500',
  },
  hideText: { color: ACCENT_WARM },
  cancelButton: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: ACCENT_WARM_TINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  cancelText: {
    color: TEXT_SECONDARY,
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: { opacity: 0.64 },
});

const tipStyles = StyleSheet.create({
  section: {
    backgroundColor: BG_PAGE,
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionHeader: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: ACCENT_WARM,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.15,
  },
  moreButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  moreText: {
    color: TEXT_MUTED,
    fontSize: 15,
    letterSpacing: 2,
  },
  row: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: BG_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  copy: { flex: 1 },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  summary: {
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  chevron: {
    color: TEXT_MUTED,
    fontSize: 24,
    fontWeight: '300',
  },
  pressed: { opacity: 0.64 },
});

const milestoneStyles = StyleSheet.create({
  card: {
    backgroundColor: BANNER_TONE_POSITIVE_BG,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: FERTILE_ACCENT,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  headerRow: {
    minHeight: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    color: FERTILE_ACCENT,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.05,
  },
  dismiss: {
    minWidth: 44,
    minHeight: 44,
    marginTop: -10,
    marginRight: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    color: TEXT_MUTED,
    fontSize: 23,
    lineHeight: 26,
    fontWeight: '300',
  },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  body: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  reviewButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: -9,
  },
  reviewText: {
    color: FERTILE_ACCENT,
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: { opacity: 0.64 },
});
