import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  BLEEDING_EDUCATION,
  BLEEDING_EDUCATION_NOTE,
  HELP_COLOR_GUIDE_NON_PEAK_MUCUS,
  HELP_COLOR_GUIDE_PEAK_TYPE_MUCUS,
  HELP_BLEEDING_TYPES_TITLE,
  HELP_HOW_TO_OBSERVE_BODY,
  HELP_HOW_TO_OBSERVE_TITLE,
  HELP_SENSATION_APPEARANCE_BODY,
  HELP_SENSATION_APPEARANCE_TITLE,
  HELP_STATUS_MESSAGE_SECTIONS,
  HELP_TRYING_TO_CONCEIVE_BODY,
  HELP_WHAT_IS_PEAK_DAY_BODY,
  HELP_WHAT_IS_PEAK_DAY_TITLE,
} from 'core-rules-engine';
import { useResetOnboarding } from '../navigation/AppNavigator';
import { FeedbackModal } from '../components/feedback/FeedbackModal';
import { LineIcon, type IconName } from '../components/LineIcon';
import { useCycleHistory } from '../hooks/useCycleHistory';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  BG_BLEEDING, BG_DRY, BG_NO_ENTRY, BG_PEAK_TYPE, BG_POST_PEAK, BG_PAGE, BG_CARD,
  FERTILE_ACCENT, PEAK_BORDER, BORDER_CARD, BORDER_TODAY, INTERCOURSE_ICON,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
} from '../theme/colors';

interface AccordionItemData {
  id: string;
  title: string;
  icon: IconName;
  content?: string;
  renderContent?: () => React.JSX.Element;
}

const SECTIONS: AccordionItemData[] = [
  {
    id: 'observe',
    title: HELP_HOW_TO_OBSERVE_TITLE,
    icon: 'eye',
    content: HELP_HOW_TO_OBSERVE_BODY,
  },
  {
    id: 'sensation_appearance',
    title: HELP_SENSATION_APPEARANCE_TITLE,
    icon: 'droplet',
    content: HELP_SENSATION_APPEARANCE_BODY,
  },
  {
    id: 'bleeding',
    title: HELP_BLEEDING_TYPES_TITLE,
    icon: 'droplet',
    renderContent: () => <BleedingGuide />,
  },
  {
    id: 'peak_day',
    title: HELP_WHAT_IS_PEAK_DAY_TITLE,
    icon: 'sparkle',
    content: HELP_WHAT_IS_PEAK_DAY_BODY,
  },
  {
    id: 'trying_to_conceive',
    title: 'When should we try to conceive?',
    icon: 'heart',
    content: HELP_TRYING_TO_CONCEIVE_BODY,
  },
  {
    id: 'status_messages',
    title: 'What do the status messages mean?',
    icon: 'chart',
    renderContent: () => <StatusMessageSections />,
  },
  {
    id: 'calendar_colors',
    title: 'Calendar color guide',
    icon: 'grid',
    renderContent: () => <ColorGuideSwatches />,
  },
];

type HelpNav = NativeStackNavigationProp<RootStackParamList, 'Help'>;

function SwatchRow({ bg, dotColor, borderColor, label }: {
  bg: string; dotColor?: string; borderColor?: string; label: string;
}): React.JSX.Element {
  return (
    <View style={swatchStyles.row}>
      <View style={[
        swatchStyles.swatch,
        { backgroundColor: bg },
        borderColor ? { borderWidth: 2, borderColor } : { borderWidth: 1, borderColor: BORDER_CARD },
      ]}>
        {dotColor && <View style={[swatchStyles.dot, { backgroundColor: dotColor }]} />}
      </View>
      <Text style={swatchStyles.label}>{label}</Text>
    </View>
  );
}

function StatusMessageSections(): React.JSX.Element {
  return (
    <View style={statusHelpStyles.container}>
      {HELP_STATUS_MESSAGE_SECTIONS.map((section, i) => (
        <View key={section.title + i} style={statusHelpStyles.block}>
          <Text style={statusHelpStyles.sectionTitle}>{section.title}</Text>
          <Text style={statusHelpStyles.sectionBody}>{section.body}</Text>
        </View>
      ))}
    </View>
  );
}

function BleedingGuide(): React.JSX.Element {
  return (
    <View style={bleedingHelpStyles.container}>
      {BLEEDING_EDUCATION.map((item) => (
        <View key={item.value} style={bleedingHelpStyles.block}>
          <Text style={bleedingHelpStyles.title}>
            {item.label}{item.code ? ` (${item.code})` : ''}
          </Text>
          <Text style={bleedingHelpStyles.body}>{item.description}</Text>
        </View>
      ))}
      <Text style={bleedingHelpStyles.note}>{BLEEDING_EDUCATION_NOTE}</Text>
    </View>
  );
}

const bleedingHelpStyles = StyleSheet.create({
  container: { gap: 14 },
  block: { gap: 3 },
  title: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY, lineHeight: 20 },
  body: { fontSize: 14, color: TEXT_SECONDARY, lineHeight: 21 },
  note: {
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 20,
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
    paddingTop: 12,
  },
});

const statusHelpStyles = StyleSheet.create({
  container: { gap: 18 },
  block: { gap: 6 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    lineHeight: 20,
  },
  sectionBody: {
    fontSize: 15,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    lineHeight: 22,
  },
});

function ColorGuideSwatches(): React.JSX.Element {
  return (
    <View style={swatchStyles.container}>
      <SwatchRow bg={BG_NO_ENTRY} label="No entry logged" />
      <SwatchRow bg={BG_BLEEDING} label="Bleeding day" />
      <SwatchRow bg={BG_DRY} label="Dry day (no mucus)" />
      <SwatchRow bg={BG_DRY} dotColor={FERTILE_ACCENT} label={HELP_COLOR_GUIDE_NON_PEAK_MUCUS} />
      <SwatchRow bg={BG_PEAK_TYPE} label={HELP_COLOR_GUIDE_PEAK_TYPE_MUCUS} />
      <SwatchRow bg={BG_PEAK_TYPE} borderColor={PEAK_BORDER} label="Confirmed Peak Day" />
      <SwatchRow bg={BG_POST_PEAK} label="Post-Peak (P+1, P+2, P+3)" />
      <SwatchRow bg={BG_NO_ENTRY} borderColor={BORDER_TODAY} label="Today" />
      <View style={swatchStyles.row}>
        <View style={[swatchStyles.swatch, { borderWidth: 1, borderColor: BORDER_CARD, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 14 }}>{INTERCOURSE_ICON}</Text>
        </View>
        <Text style={swatchStyles.label}>Intercourse recorded</Text>
      </View>
    </View>
  );
}

const swatchStyles = StyleSheet.create({
  container: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  swatch: {
    width: 32, height: 32, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4, position: 'absolute', top: 4, right: 4 },
  label: { fontSize: 14, color: TEXT_SECONDARY, flex: 1 },
});

function AccordionItem({ item, initialOpen }: {
  item: AccordionItemData;
  initialOpen: boolean;
}): React.JSX.Element {
  const [open, setOpen] = useState(initialOpen);
  useEffect(() => {
    if (initialOpen) setOpen(true);
  }, [initialOpen]);
  return (
    <View style={styles.accordionItem}>
      <Pressable style={styles.accordionHeader} onPress={() => setOpen(!open)}>
        <View style={styles.accordionIconWrap}>
          <LineIcon name={item.icon} size={20} />
        </View>
        <Text style={styles.accordionTitle}>{item.title}</Text>
        <Text style={styles.chevron}>{open ? '\u2227' : '\u2228'}</Text>
      </Pressable>
      {open && (
        <View style={styles.accordionBody}>
          {item.renderContent ? item.renderContent() : (
            <Text style={styles.accordionContent}>{item.content}</Text>
          )}
        </View>
      )}
    </View>
  );
}

export function HelpScreen(): React.JSX.Element {
  const navigation = useNavigation<HelpNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'Help'>>();
  const resetOnboarding = useResetOnboarding();
  const { cycles } = useCycleHistory();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const initialSection = route.params?.initialSection;
  const orderedSections = initialSection
    ? [
        ...SECTIONS.filter((section) => section.id === initialSection),
        ...SECTIONS.filter((section) => section.id !== initialSection),
      ]
    : SECTIONS;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Understanding Your Chart</Text>
      {orderedSections.map((section) => (
        <AccordionItem
          key={section.id}
          item={section}
          initialOpen={initialSection === section.id}
        />
      ))}
      <Pressable
        style={styles.findCareFooter}
        onPress={() => navigation.navigate('FindCare')}
        accessibilityRole="button"
        accessibilityLabel="Find care and instruction"
      >
        <Text style={styles.findCareTitle}>Find care and instruction</Text>
        <Text style={styles.findCareText}>External NaPro, NFP, and restorative-care resources</Text>
      </Pressable>
      <Pressable
        style={styles.feedbackFooter}
        onPress={() => setShowFeedbackModal(true)}
      >
        <Text style={styles.feedbackTitle}>Still confused?</Text>
        <Text style={styles.feedbackText}>Tell us what felt unclear</Text>
      </Pressable>
      {resetOnboarding && (
        <Pressable style={styles.showOnboarding} onPress={resetOnboarding.resetOnboarding}>
          <Text style={styles.showOnboardingText}>Show onboarding again</Text>
        </Pressable>
      )}
      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        sourceScreen="Help"
        initialFeedbackType="Suggestion"
        initialCategory="Other"
        cycles={cycles}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: BG_PAGE },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 28, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 16, letterSpacing: -0.2 },
  accordionItem: {
    backgroundColor: BG_CARD, borderRadius: 12,
    marginBottom: 8, overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
  },
  accordionIconWrap: { marginRight: 10 },
  accordionTitle: { flex: 1, fontSize: 15, fontWeight: '500', color: TEXT_PRIMARY },
  chevron: { fontSize: 16, color: TEXT_MUTED },
  accordionBody: { paddingHorizontal: 16, paddingBottom: 16 },
  accordionContent: { fontSize: 15, fontWeight: '400', color: TEXT_SECONDARY, lineHeight: 22 },
  feedbackFooter: {
    backgroundColor: BG_CARD,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  feedbackTitle: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 4 },
  feedbackText: { fontSize: 14, color: TEXT_MUTED },
  findCareFooter: {
    backgroundColor: BG_CARD,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    minHeight: 72,
  },
  findCareTitle: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 4 },
  findCareText: { fontSize: 14, color: TEXT_MUTED, lineHeight: 20 },
  showOnboarding: {
    marginTop: 24, padding: 14, backgroundColor: BORDER_CARD, borderRadius: 10, alignItems: 'center',
  },
  showOnboardingText: { fontSize: 14, color: TEXT_SECONDARY, fontWeight: '500' },
});
