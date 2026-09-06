import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
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
  POSSIBLE_FERTILE_PATTERN_LIMITATION,
} from 'core-rules-engine';
import { useResetOnboarding } from '../navigation/AppNavigator';
import { FeedbackModal } from '../components/feedback/FeedbackModal';
import { LineIcon, type IconName } from '../components/LineIcon';
import { useCycleHistory } from '../hooks/useCycleHistory';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  BG_BLEEDING, BG_DRY, BG_NO_ENTRY, BG_PEAK_TYPE, BG_POST_PEAK, BG_PAGE, BG_CARD,
  FERTILE_ACCENT, PEAK_BORDER, BORDER_CARD, BORDER_TODAY, INTERCOURSE_ICON,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, ACCENT_WARM,
} from '../theme/colors';
import { CHART_TIPS } from '../features/guidedChartLearning/guidedChartLearning';
import {
  getGuidedChartLearningPreferences,
  setChartTipsEnabled,
} from '../features/guidedChartLearning/guidedChartLearningStorage';

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
    id: 'possible_fertile_pattern',
    title: 'What does “possible fertile pattern” mean?',
    icon: 'chart',
    content:
      'A possible fertile pattern is a look back at what you recorded in a cycle. When the chart has enough detail, Well Within may show the first recorded mucus sign through P+3. When a day is open, marked Not observed, incomplete, or the cycle start is unclear, the app tells you what is missing and does not show pattern dates.\n\n' +
      'Spotting or brown can share a day with its dry, non-Peak, or Peak-type observation. A completed non-Peak day can carry a P+ marker; spotting or brown alone does not extend or reopen a completed pattern. A later Peak-type sign does.\n\n' +
      'This first release does not ask about or account for the special contexts listed below. A possible-pattern date may still appear because Well Within cannot detect them from the chart alone. Treat it only as chart context; a qualified practitioner can help interpret these situations.\n\n' +
      POSSIBLE_FERTILE_PATTERN_LIMITATION,
  },
  {
    id: 'calendar_colors',
    title: 'Calendar color guide',
    icon: 'grid',
    renderContent: () => <ColorGuideSwatches />,
  },
];

type HelpNav = NativeStackNavigationProp<RootStackParamList, 'Help'>;

function SwatchRow({ bg, dotColor, markerText, markerPosition = 'observation', borderColor, label }: {
  bg: string;
  dotColor?: string;
  markerText?: string;
  markerPosition?: 'observation' | 'pattern';
  borderColor?: string;
  label: string;
}): React.JSX.Element {
  return (
    <View style={swatchStyles.row}>
      <View style={[
        swatchStyles.swatch,
        { backgroundColor: bg },
        borderColor ? { borderWidth: 2, borderColor } : { borderWidth: 1, borderColor: BORDER_CARD },
      ]}>
        {dotColor && <View style={[swatchStyles.dot, { backgroundColor: dotColor }]} />}
        {markerText ? (
          <Text style={[
            swatchStyles.marker,
            markerPosition === 'pattern'
              ? swatchStyles.patternMarker
              : swatchStyles.observationMarker,
          ]}>
            {markerText}
          </Text>
        ) : null}
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
      <SwatchRow
        bg={BG_DRY}
        dotColor={FERTILE_ACCENT}
        markerText="S/B"
        label="Spotting or brown recorded with mucus"
      />
      <SwatchRow bg={BG_DRY} markerText="B" label="Dry observation with brown recorded" />
      <SwatchRow bg={BG_BLEEDING} markerText="S" label="Dry observation with spotting recorded" />
      <SwatchRow bg={BG_PEAK_TYPE} label={HELP_COLOR_GUIDE_PEAK_TYPE_MUCUS} />
      <SwatchRow bg={BG_PEAK_TYPE} borderColor={PEAK_BORDER} label="Peak marker identified retrospectively" />
      <SwatchRow
        bg={BG_POST_PEAK}
        markerText="P+1"
        markerPosition="pattern"
        label="Retrospective P+1 marker"
      />
      <SwatchRow bg={BG_NO_ENTRY} borderColor={BORDER_TODAY} label="Today" />
      <View style={swatchStyles.row}>
        <View style={[swatchStyles.swatch, { borderWidth: 1, borderColor: BORDER_CARD, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 14 }}>{INTERCOURSE_ICON}</Text>
        </View>
        <Text style={swatchStyles.label}>Intercourse recorded</Text>
      </View>
      <Text style={swatchStyles.note}>
        Color shows the strongest recorded observation. A dot preserves non-Peak mucus; S/B preserves spotting or brown; P+ labels are retrospective markers that can share the same day.
      </Text>
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
  marker: {
    position: 'absolute', left: 4,
    fontSize: 8, lineHeight: 10, fontWeight: '700', color: TEXT_PRIMARY,
  },
  observationMarker: { top: 2 },
  patternMarker: { bottom: 2 },
  label: { fontSize: 14, color: TEXT_SECONDARY, flex: 1 },
  note: { fontSize: 13, color: TEXT_MUTED, lineHeight: 19, marginTop: 2 },
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

function ChartTipsArchive({
  enabled,
  onEnabledChange,
  onOpenLesson,
}: {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onOpenLesson: (lessonId: (typeof CHART_TIPS)[number]['id']) => void;
}): React.JSX.Element {
  return (
    <View style={chartTipStyles.container}>
      <View style={chartTipStyles.toggleRow}>
        <View style={chartTipStyles.toggleCopy}>
          <Text style={chartTipStyles.toggleTitle}>Show chart tips on Calendar</Text>
          <Text style={chartTipStyles.toggleBody}>
            This changes only the optional lesson below Today&apos;s Observation.
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onEnabledChange}
          trackColor={{ false: BORDER_CARD, true: ACCENT_WARM }}
          thumbColor={BG_CARD}
          accessibilityLabel="Show chart tips on Calendar"
        />
      </View>
      <Text style={chartTipStyles.archiveLabel}>BROWSE CHART TIPS</Text>
      {CHART_TIPS.map((lesson) => (
        <Pressable
          key={lesson.id}
          style={({ pressed }) => [
            chartTipStyles.lessonRow,
            pressed && chartTipStyles.pressed,
          ]}
          onPress={() => onOpenLesson(lesson.id)}
          accessibilityRole="button"
        >
          <View style={chartTipStyles.lessonCopy}>
            <Text style={chartTipStyles.lessonTitle}>{lesson.title}</Text>
            <Text style={chartTipStyles.lessonSummary}>{lesson.summary}</Text>
          </View>
          <Text style={chartTipStyles.chevron}>{'›'}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function HelpScreen(): React.JSX.Element {
  const navigation = useNavigation<HelpNav>();
  const route = useRoute<RouteProp<RootStackParamList, 'Help'>>();
  const resetOnboarding = useResetOnboarding();
  const { cycles } = useCycleHistory();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [chartTipsEnabled, setChartTipsEnabledState] = useState(true);
  const initialSection = route.params?.initialSection;
  useEffect(() => {
    void getGuidedChartLearningPreferences().then((preferences) => {
      setChartTipsEnabledState(preferences.chartTipsEnabled);
    });
  }, []);

  const handleChartTipsEnabledChange = (enabled: boolean) => {
    setChartTipsEnabledState(enabled);
    void setChartTipsEnabled(enabled);
  };

  const sections: AccordionItemData[] = [
    ...SECTIONS,
    {
      id: 'chart_tips',
      title: 'Chart tips',
      icon: 'calendar',
      renderContent: () => (
        <ChartTipsArchive
          enabled={chartTipsEnabled}
          onEnabledChange={handleChartTipsEnabledChange}
          onOpenLesson={(lessonId) => navigation.navigate('ChartTip', {
            lessonId,
            source: 'help',
          })}
        />
      ),
    },
  ];

  const orderedSections = initialSection
    ? [
        ...sections.filter((section) => section.id === initialSection),
        ...sections.filter((section) => section.id !== initialSection),
      ]
    : sections;

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

const chartTipStyles = StyleSheet.create({
  container: { gap: 0 },
  toggleRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 14,
  },
  toggleCopy: { flex: 1 },
  toggleTitle: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '600',
  },
  toggleBody: {
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  archiveLabel: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
  },
  lessonRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
    paddingVertical: 9,
  },
  lessonCopy: { flex: 1, paddingRight: 10 },
  lessonTitle: {
    color: TEXT_PRIMARY,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  lessonSummary: {
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  chevron: {
    color: TEXT_MUTED,
    fontSize: 22,
    fontWeight: '300',
  },
  pressed: { opacity: 0.64 },
});
