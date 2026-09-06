import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import {
  chartTipById,
  type ChartTipDefinition,
} from './guidedChartLearning';
import { markChartTip } from './guidedChartLearningStorage';
import {
  ACCENT_WARM,
  ACCENT_WARM_TINT,
  BANNER_TONE_POSITIVE_BG,
  BG_BLEEDING,
  BG_CARD,
  BG_DRY,
  BG_MISSING,
  BG_NO_ENTRY,
  BG_PAGE,
  BG_PEAK_TYPE,
  BG_POST_PEAK,
  BORDER_CARD,
  FERTILE_ACCENT,
  INTERCOURSE_ICON,
  PEAK_BORDER,
  TEXT_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ChartTip'>;

function CalendarTreatment({
  day,
  label,
  backgroundColor,
  dot,
  borderColor,
  markerText,
  markerPosition = 'top',
  icon,
  compact = false,
}: {
  day: string;
  label: string;
  backgroundColor: string;
  dot?: boolean;
  borderColor?: string;
  markerText?: string;
  markerPosition?: 'top' | 'bottom';
  icon?: string;
  compact?: boolean;
}): React.JSX.Element {
  return (
    <View style={[exampleStyles.calendarTreatment, compact && exampleStyles.calendarGuideTreatment]}>
      <View style={[
        exampleStyles.calendarDay,
        { backgroundColor },
        borderColor ? { borderWidth: 2, borderColor } : null,
      ]}>
        <Text style={exampleStyles.calendarDayNumber}>{day}</Text>
        {dot ? <View style={exampleStyles.dot} /> : null}
        {markerText ? (
          <Text style={[
            exampleStyles.marker,
            markerPosition === 'bottom' ? exampleStyles.markerBottom : exampleStyles.markerTop,
          ]}>
            {markerText}
          </Text>
        ) : null}
        {icon ? <Text style={exampleStyles.iconMarker}>{icon}</Text> : null}
      </View>
      <Text style={exampleStyles.calendarLabel}>{label}</Text>
    </View>
  );
}

function TipExample({
  lesson,
  calendarStep,
}: {
  lesson: ChartTipDefinition;
  calendarStep: 1 | 2;
}): React.JSX.Element {
  if (lesson.id === 'observation-on-calendar') {
    if (calendarStep === 2) {
      return (
        <View style={exampleStyles.card}>
          <Text style={exampleStyles.eyebrow}>SUPPORTING MARKERS</Text>
          <View style={exampleStyles.calendarGuideGrid}>
            <CalendarTreatment
              compact
              day="14"
              label="Peak Day"
              backgroundColor={BG_PEAK_TYPE}
              borderColor={PEAK_BORDER}
            />
            <CalendarTreatment
              compact
              day="15"
              label="P+ day"
              backgroundColor={BG_POST_PEAK}
              markerText="P+1"
              markerPosition="bottom"
            />
            <CalendarTreatment
              compact
              day="16"
              label="Spotting / brown"
              backgroundColor={BG_DRY}
              dot
              markerText="S/B"
            />
            <CalendarTreatment
              compact
              day="17"
              label="Intercourse"
              backgroundColor={BG_NO_ENTRY}
              icon={INTERCOURSE_ICON}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={exampleStyles.card}>
        <Text style={exampleStyles.eyebrow}>HOW SAVED DAYS APPEAR</Text>
        <View style={exampleStyles.calendarGuideGrid}>
          <CalendarTreatment compact day="13" label="No entry" backgroundColor={BG_NO_ENTRY} />
          <CalendarTreatment compact day="14" label="Bleeding" backgroundColor={BG_BLEEDING} />
          <CalendarTreatment compact day="15" label="Dry" backgroundColor={BG_DRY} />
          <CalendarTreatment compact day="16" label="Non-Peak mucus" backgroundColor={BG_DRY} dot />
          <CalendarTreatment compact day="17" label="Peak-type sign" backgroundColor={BG_PEAK_TYPE} />
          <CalendarTreatment
            compact
            day="18"
            label="P+ day"
            backgroundColor={BG_POST_PEAK}
            markerText="P+1"
            markerPosition="bottom"
          />
        </View>
      </View>
    );
  }

  if (lesson.id === 'dry-not-observed-open') {
    return (
      <View style={exampleStyles.card}>
        <Text style={exampleStyles.eyebrow}>THESE STATES STAY DISTINCT</Text>
        <View style={exampleStyles.calendarRow}>
          <CalendarTreatment day="14" label="No entry" backgroundColor={BG_NO_ENTRY} />
          <CalendarTreatment day="15" label="Dry" backgroundColor={BG_DRY} />
          <CalendarTreatment day="16" label="Not observed" backgroundColor={BG_MISSING} />
        </View>
      </View>
    );
  }

  if (lesson.id === 'sensation-and-appearance') {
    return (
      <View style={exampleStyles.card}>
        <Text style={exampleStyles.eyebrow}>ONE OBSERVATION, TWO DETAILS</Text>
        <View style={exampleStyles.detailRow}>
          <Text style={exampleStyles.detailLabel}>Sensation</Text>
          <Text style={exampleStyles.detailValue}>What you feel</Text>
        </View>
        <View style={exampleStyles.detailRow}>
          <Text style={exampleStyles.detailLabel}>Appearance</Text>
          <Text style={exampleStyles.detailValue}>What you see</Text>
        </View>
      </View>
    );
  }

  if (lesson.id === 'multiple-observations') {
    return (
      <View style={exampleStyles.card}>
        <Text style={exampleStyles.eyebrow}>ONE DAY CAN KEEP EACH OBSERVATION</Text>
        <View style={exampleStyles.detailRow}>
          <Text style={exampleStyles.detailLabel}>8:00 AM</Text>
          <Text style={exampleStyles.detailValue}>Damp</Text>
        </View>
        <View style={exampleStyles.detailRow}>
          <Text style={exampleStyles.detailLabel}>6:00 PM</Text>
          <Text style={exampleStyles.detailValue}>Wet · Cloudy</Text>
        </View>
        <Text style={exampleStyles.exampleNote}>
          Both remain in the day. The chart uses the strongest recorded sign.
        </Text>
      </View>
    );
  }

  return (
    <View style={exampleStyles.card}>
      <Text style={exampleStyles.eyebrow}>ONE COMPLETED CHART</Text>
      {['Recorded chart', 'Daily observation log', 'Export options'].map((label) => (
        <View key={label} style={exampleStyles.checkRow}>
          <Text style={exampleStyles.check}>✓</Text>
          <Text style={exampleStyles.checkLabel}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

function deeperHelpLabel(lesson: ChartTipDefinition): string {
  if (lesson.id === 'observation-on-calendar') return 'Open the full calendar color guide';
  if (lesson.id === 'dry-not-observed-open') return 'Open the chart status guide';
  if (lesson.id === 'sensation-and-appearance') return 'Open the full sensation and appearance guide';
  if (lesson.id === 'multiple-observations') return 'Open the observation guide';
  return '';
}

export function ChartTipScreen({ route, navigation }: Props): React.JSX.Element {
  const lesson = chartTipById(route.params.lessonId);
  const fromHelp = route.params.source === 'help';
  const calendarLesson = lesson.id === 'observation-on-calendar';
  const [calendarStep, setCalendarStep] = useState<1 | 2>(1);

  useEffect(() => {
    setCalendarStep(1);
    void markChartTip(lesson.id, lesson.contentVersion, 'viewed');
  }, [lesson.contentVersion, lesson.id]);

  const returnToSource = () => {
    if (!fromHelp) {
      navigation.navigate('Calendar', {
        restoreScrollY: route.params.returnScrollY,
      });
      return;
    }
    navigation.goBack();
  };

  const title = calendarLesson
    ? (calendarStep === 1 ? 'How your observation appears' : 'Read the supporting markers')
    : lesson.title;
  const body = calendarLesson
    ? (
        calendarStep === 1
          ? 'Each saved day uses a color for the strongest observation recorded. A green dot keeps non-Peak mucus visible on a Dry-colored day.'
          : 'Borders and small labels add context without replacing what you recorded. Peak and P+ markers appear retrospectively when the chart supports them.'
      )
    : lesson.body;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.icon}>
          <View style={styles.iconDot} />
        </View>
        <Text style={styles.eyebrow}>
          {calendarLesson ? `CHART TIP · ${calendarStep} OF 2` : 'CHART TIP'}
        </Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <TipExample lesson={lesson} calendarStep={calendarStep} />
        <View style={styles.note}>
          <Text style={styles.noteText}>
            {calendarLesson && calendarStep === 2
              ? 'The calendar reflects saved observations. Retrospective markers add chart context; they do not confirm ovulation.'
              : 'Well Within updates the chart from saved observations. It does not fill in an observation you did not record.'}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          onPress={() => {
            if (calendarLesson && calendarStep === 1) {
              setCalendarStep(2);
              return;
            }
            returnToSource();
          }}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>
            {calendarLesson && calendarStep === 1
              ? 'Next: markers'
              : (calendarLesson ? 'Done' : (fromHelp ? 'Back to chart tips' : 'Back to my chart'))}
          </Text>
        </Pressable>
        {calendarLesson ? (
          <Pressable
            style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}
            onPress={() => {
              if (calendarStep === 1 || fromHelp) {
                returnToSource();
                return;
              }
              navigation.navigate('Help', { initialSection: 'chart_tips' });
            }}
            accessibilityRole="button"
          >
            <Text style={styles.helpButtonText}>
              {calendarStep === 1
                ? (fromHelp ? 'Back to chart tips' : 'Back to my chart')
                : (fromHelp ? 'Back to chart tips' : 'Review later in Chart Tips')}
            </Text>
          </Pressable>
        ) : lesson.sourceSection ? (
          <Pressable
            style={({ pressed }) => [styles.helpButton, pressed && styles.pressed]}
            onPress={() => navigation.navigate('Help', {
              initialSection: lesson.sourceSection ?? undefined,
            })}
            accessibilityRole="button"
          >
            <Text style={styles.helpButtonText}>{deeperHelpLabel(lesson)}</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_PAGE },
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 36,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: BANNER_TONE_POSITIVE_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  iconDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: FERTILE_ACCENT,
    backgroundColor: BG_DRY,
  },
  eyebrow: {
    color: ACCENT_WARM,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.15,
  },
  title: {
    color: TEXT_PRIMARY,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginTop: 8,
  },
  body: {
    color: TEXT_SECONDARY,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 15,
  },
  note: {
    backgroundColor: BANNER_TONE_POSITIVE_BG,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginTop: 16,
  },
  noteText: {
    color: TEXT_SECONDARY,
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: ACCENT_WARM,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  primaryButtonText: {
    color: BG_CARD,
    fontSize: 16,
    fontWeight: '600',
  },
  helpButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButtonText: {
    color: ACCENT_WARM,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  pressed: { opacity: 0.64 },
});

const exampleStyles = StyleSheet.create({
  card: {
    backgroundColor: BG_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    padding: 14,
    marginTop: 20,
  },
  eyebrow: {
    color: TEXT_MUTED,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  calendarRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  calendarGuideGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  calendarTreatment: {
    flex: 1,
    alignItems: 'center',
  },
  calendarGuideTreatment: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '30%',
  },
  calendarDay: {
    width: '100%',
    maxWidth: 96,
    minHeight: 54,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayNumber: {
    color: TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: FERTILE_ACCENT,
    position: 'absolute',
    top: 7,
    right: 7,
  },
  marker: {
    position: 'absolute',
    left: 5,
    color: TEXT_PRIMARY,
    fontSize: 8,
    lineHeight: 11,
    fontWeight: '700',
  },
  markerTop: { top: 4 },
  markerBottom: { bottom: 4 },
  iconMarker: {
    position: 'absolute',
    right: 5,
    bottom: 4,
    fontSize: 14,
  },
  calendarLabel: {
    color: TEXT_MUTED,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  detailRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
  },
  detailLabel: {
    color: TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  detailValue: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    textAlign: 'right',
    flexShrink: 1,
  },
  exampleNote: {
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 18,
    backgroundColor: ACCENT_WARM_TINT,
    borderRadius: 9,
    padding: 10,
    marginTop: 10,
  },
  checkRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
  },
  check: {
    color: FERTILE_ACCENT,
    fontSize: 14,
    fontWeight: '700',
  },
  checkLabel: {
    color: TEXT_SECONDARY,
    fontSize: 14,
  },
});
