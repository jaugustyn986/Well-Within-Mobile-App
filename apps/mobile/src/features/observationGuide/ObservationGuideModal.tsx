import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ACCENT_WARM,
  ACCENT_WARM_TINT,
  BANNER_TONE_POSITIVE_BG,
  BG_CARD,
  BG_MISSING,
  BG_PAGE,
  BORDER_CARD,
  FERTILE_ACCENT,
  TEXT_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_SUBTLE,
} from '../../theme/colors';
import {
  appearanceOptionsForGroup,
  sensationOptionsForGroup,
  type AppearanceGuideOption,
  type ObservationGuideTab,
  type SensationGuideOption,
} from './observationGuide';

interface Props {
  visible: boolean;
  initialTab: ObservationGuideTab;
  onClose: () => void;
}

function GuideRows({
  options,
}: {
  options: readonly (SensationGuideOption | AppearanceGuideOption)[];
}): React.JSX.Element {
  return (
    <View style={styles.rowList}>
      {options.map((option) => (
        <View key={option.value} style={styles.definitionRow}>
          <Text style={styles.definitionLabel}>{option.label}</Text>
          <Text style={styles.definitionDescription}>{option.guideDescription}</Text>
        </View>
      ))}
    </View>
  );
}

function GuideGroup({
  title,
  guidance,
  options,
}: {
  title: string;
  guidance: string;
  options: readonly (SensationGuideOption | AppearanceGuideOption)[];
}): React.JSX.Element {
  return (
    <View style={styles.group}>
      <View style={styles.groupHeading}>
        <Text style={styles.groupTitle}>{title}</Text>
        <Text style={styles.groupGuidance}>{guidance}</Text>
      </View>
      <GuideRows options={options} />
    </View>
  );
}

function AppearanceGuide(): React.JSX.Element {
  return (
    <>
      <View style={styles.noneCard}>
        <View style={styles.noneIcon}>
          <Text style={styles.noneIconText}>—</Text>
        </View>
        <View style={styles.noneCopy}>
          <Text style={styles.noneTitle}>Nothing visible?</Text>
          <Text style={styles.noneBody}>Choose None if you did not see mucus on the tissue.</Text>
        </View>
      </View>
      <GuideGroup
        title="Clarity"
        guidance="Choose the closest match"
        options={appearanceOptionsForGroup('clarity')}
      />
      <GuideGroup
        title="Texture or feeling"
        guidance="If it applies"
        options={appearanceOptionsForGroup('texture')}
      />
      <GuideGroup
        title="Color"
        guidance="If you noticed one"
        options={appearanceOptionsForGroup('color')}
      />
    </>
  );
}

function SensationGuide(): React.JSX.Element {
  return (
    <>
      <GuideGroup
        title="Moisture or surface"
        guidance="Choose the strongest quality"
        options={sensationOptionsForGroup('moisture')}
      />
      <GuideGroup
        title="Stretch"
        guidance="How far it stretched"
        options={sensationOptionsForGroup('stretch')}
      />
    </>
  );
}

export function ObservationGuideModal({
  visible,
  initialTab,
  onClose,
}: Props): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ObservationGuideTab>(initialTab);

  useEffect(() => {
    if (visible) setActiveTab(initialTab);
  }, [initialTab, visible]);

  const isAppearance = activeTab === 'appearance';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.headerAction, pressed && styles.pressed]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Back to daily entry"
          >
            <Text style={styles.headerActionText}>{'‹ Entry'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Observation Guide</Text>
          <Pressable
            style={({ pressed }) => [styles.headerAction, styles.doneAction, pressed && styles.pressed]}
            onPress={onClose}
            accessibilityRole="button"
          >
            <Text style={[styles.headerActionText, styles.doneText]}>Done</Text>
          </Pressable>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            {isAppearance ? 'Compare what you noticed' : 'Compare the observation'}
          </Text>
          <Text style={styles.intro}>
            {isAppearance
              ? 'Choose every term that fits. Compare similar words by clarity, texture or feeling, and color—and skip any group that does not apply.'
              : 'Use moisture, surface appearance, and stretch to choose the strongest quality you observed.'}
          </Text>
          <View style={styles.segmented} accessibilityRole="tablist">
            {(['sensation', 'appearance'] as const).map((tab) => {
              const selected = activeTab === tab;
              const label = tab === 'sensation' ? 'Sensation' : 'Appearance';
              return (
                <Pressable
                  key={tab}
                  style={[styles.segment, selected && styles.segmentSelected]}
                  onPress={() => setActiveTab(tab)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {isAppearance ? <AppearanceGuide /> : <SensationGuide />}
          <Text style={styles.boundaryNote}>
            These words describe what you observed; they do not diagnose a condition. If you are unsure, choose the closest match or review your chart with a trained practitioner.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG_PAGE },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_CARD,
    backgroundColor: BG_PAGE,
  },
  headerAction: {
    width: 76,
    minHeight: 44,
    justifyContent: 'center',
  },
  doneAction: { alignItems: 'flex-end' },
  headerActionText: { color: ACCENT_WARM, fontSize: 15, fontWeight: '500' },
  doneText: { fontWeight: '700' },
  headerTitle: { color: TEXT_PRIMARY, fontSize: 14, fontWeight: '700' },
  scroll: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
  },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  intro: {
    color: TEXT_SECONDARY,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  segmented: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 12,
    backgroundColor: BG_MISSING,
    marginTop: 20,
    marginBottom: 22,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  segmentSelected: {
    backgroundColor: BG_CARD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  segmentText: { color: TEXT_MUTED, fontSize: 13, fontWeight: '600' },
  segmentTextSelected: { color: TEXT_PRIMARY },
  noneCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#DCE8DF',
    borderRadius: 12,
    backgroundColor: BANNER_TONE_POSITIVE_BG,
    padding: 14,
    marginBottom: 24,
  },
  noneIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: ACCENT_WARM_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noneIconText: { color: FERTILE_ACCENT, fontSize: 17, fontWeight: '700' },
  noneCopy: { flex: 1 },
  noneTitle: { color: TEXT_PRIMARY, fontSize: 14, fontWeight: '600' },
  noneBody: { color: TEXT_SECONDARY, fontSize: 13, lineHeight: 18, marginTop: 2 },
  group: { marginTop: 2, marginBottom: 24 },
  groupHeading: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  groupTitle: { color: TEXT_PRIMARY, fontSize: 15, fontWeight: '700' },
  groupGuidance: {
    flexShrink: 1,
    color: TEXT_MUTED,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'right',
  },
  rowList: { borderTopWidth: 1, borderTopColor: BORDER_CARD },
  definitionRow: {
    minHeight: 62,
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_CARD,
  },
  definitionLabel: { color: TEXT_PRIMARY, fontSize: 15, fontWeight: '600' },
  definitionDescription: {
    color: TEXT_SUBTLE,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  boundaryNote: {
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
  },
  pressed: { opacity: 0.58 },
});
