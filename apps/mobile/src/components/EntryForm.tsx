import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Appearance,
  BLEEDING_EDUCATION,
  BLEEDING_EDUCATION_NOTE,
  BleedingType,
  classifyFertility,
  computeMucusRank,
  DailyEntry,
  derivePrimaryDayClassFromEntry,
  Frequency,
  isValidObservationTime,
  MucusObservation,
  resolveDailyMucus,
  Sensation,
  sortMucusObservationsForDisplay,
  withMucusObservations,
} from 'core-rules-engine';
import {
  BG_CARD, BG_PAGE, BG_MISSING,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_SUBTLE,
  BORDER_CARD, ACCENT_WARM, ACCENT_WARM_TINT, BRAND_NAME, ACCENT_RED,
} from '../theme/colors';
import { formatFullDate } from '../utils/dateDisplay';
import {
  initialSensationForEntry,
  shouldShowObservationTimeEditor,
} from './entryObservationConfirmation';
import {
  applyEntryDeleteChoice,
  type EntryDeleteChoice,
} from './entryDeleteConfirmation';
import {
  menstrualFlowStartForSavedEntry,
  shouldShowMenstrualFlowStartQuestion,
  type MenstrualFlowStartChoice,
} from './entryMenstrualFlowStart';
import { ObservationGuideModal } from '../features/observationGuide/ObservationGuideModal';
import {
  APPEARANCE_GUIDE_OPTIONS,
  SENSATION_GUIDE_OPTIONS,
  type ObservationGuideTab,
} from '../features/observationGuide/observationGuide';

interface Props {
  initialEntry?: DailyEntry | null;
  previousDayEntry?: DailyEntry | null;
  date: string;
  onSave: (entry: DailyEntry) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  saveLabel?: string;
  showMarkMissingButton?: boolean;
  cycleStartReview?: boolean;
  startAddingObservation?: boolean;
}

interface DraftMucusObservation extends Omit<MucusObservation, 'sensation'> {
  sensation: Sensation | null;
}

const MULTIPLE_OBSERVATIONS_EDUCATION_KEY = 'well_within_multiple_observations_education_v1';

function createObservationId(): string {
  return `obs:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 10)}`;
}

function initialObservationDrafts(
  initialEntry: DailyEntry | null | undefined,
): DraftMucusObservation[] {
  const resolved = resolveDailyMucus(initialEntry ?? null);
  if (resolved.observations.length > 0) {
    return resolved.observations.map((observation) => ({ ...observation }));
  }
  return [{
    id: createObservationId(),
    sensation: initialSensationForEntry(initialEntry),
    appearances: [],
  }];
}

function formatObservationTime(value: string | undefined): string {
  if (!value || !isValidObservationTime(value)) return 'Time not recorded';
  const [hourValue, minute] = value.split(':').map(Number);
  const period = hourValue >= 12 ? 'PM' : 'AM';
  const hour = hourValue % 12 || 12;
  return `${hour}:${String(minute).padStart(2, '0')} ${period}`;
}

function currentLocalTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function observationSummary(observation: DraftMucusObservation): string {
  if (!observation.sensation) return 'Choose a sensation to finish this observation';
  const sensation = SENSATION_GUIDE_OPTIONS.find((option) => option.value === observation.sensation)?.label
    ?? observation.sensation;
  const appearance = observation.appearances.length > 0
    ? observation.appearances
        .map((value) => APPEARANCE_GUIDE_OPTIONS.find((option) => option.value === value)?.formLabel ?? value)
        .join(', ')
    : 'No appearance';
  const frequency = FREQUENCY_OPTIONS.find((option) => option.value === observation.frequency)?.label;
  return [sensation, appearance, frequency].filter(Boolean).join(' · ');
}

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 1, label: 'Once' },
  { value: 2, label: 'Twice' },
  { value: 3, label: 'Three times' },
  { value: 'all_day', label: 'All day' },
];

const MENSTRUAL_FLOW_START_OPTIONS: Array<{
  value: MenstrualFlowStartChoice;
  label: string;
}> = [
  { value: 'confirmed', label: 'Yes — my period began today' },
  { value: 'not_start', label: 'No — this was not the start' },
  { value: 'uncertain', label: "I'm not sure" },
];

const CLASSIFICATION_LABELS: Record<string, { title: string; desc: string; hint: string }> = {
  dry: {
    title: 'Dry Observation',
    desc: 'No mucus observed today.',
    hint: 'Dry day. Record as no mucus.',
  },
  early_fertile: {
    title: 'Mucus Observation',
    desc: 'A mucus sign was recorded.',
    hint: 'Continue recording what you observe each day.',
  },
  fertile: {
    title: 'Wetter Observation',
    desc: 'A wetter mucus sign was recorded.',
    hint: 'The chart places this sign in context with surrounding days.',
  },
  peak_type: {
    title: 'Peak-Type Observation',
    desc: 'Stretchy or lubricative mucus is present.',
    hint: 'Peak-type describes the observation; Peak Day is confirmed from the pattern over time.',
  },
};

export function EntryForm({
  initialEntry,
  previousDayEntry,
  date,
  onSave,
  onDelete,
  saveLabel = 'Save Entry',
  showMarkMissingButton = false,
  cycleStartReview = false,
  startAddingObservation = false,
}: Props): React.JSX.Element {
  const [missing, setMissing] = useState(initialEntry?.missing ?? false);
  const [bleeding, setBleeding] = useState<BleedingType>(initialEntry?.bleeding ?? 'none');
  const [menstrualFlowStart, setMenstrualFlowStart] =
    useState<MenstrualFlowStartChoice | null>(initialEntry?.menstrualFlowStart ?? null);
  const [observations, setObservations] = useState<DraftMucusObservation[]>(
    () => initialObservationDrafts(initialEntry),
  );
  const [activeObservationId, setActiveObservationId] = useState(
    () => observations[0]?.id ?? '',
  );
  const [showBleedingInfo, setShowBleedingInfo] = useState(false);
  const [showFreqInfo, setShowFreqInfo] = useState(false);
  const [showNotesInfo, setShowNotesInfo] = useState(false);
  const [intercourse, setIntercourse] = useState(initialEntry?.intercourse ?? false);
  const [notes, setNotes] = useState(initialEntry?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showMultipleObservationInfo, setShowMultipleObservationInfo] = useState(false);
  const [showObservationHelp, setShowObservationHelp] = useState(false);
  const [observationGuideTab, setObservationGuideTab] = useState<ObservationGuideTab | null>(null);
  const [observationToRemove, setObservationToRemove] = useState<string | null>(null);

  const [sameAsYesterday, setSameAsYesterday] = useState(false);
  const preToggleSnapshot = useRef<{
    observation: DraftMucusObservation;
  } | null>(null);
  const handledStartAdding = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const notesBlockY = useRef(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  const activeObservation = observations.find(
    (observation) => observation.id === activeObservationId,
  ) ?? observations[0];
  const multiObservation = observations.length > 1;
  const showObservationTimeEditor = activeObservation
    ? shouldShowObservationTimeEditor(observations.length, activeObservation.observedAt)
    : false;
  const completeObservations = useMemo(
    () => observations.filter(
      (observation): observation is DraftMucusObservation & { sensation: Sensation } =>
        observation.sensation !== null,
    ),
    [observations],
  );
  const resolvedDraft = useMemo(
    () => resolveDailyMucus({
      date,
      observations: completeObservations,
    }),
    [completeObservations, date],
  );
  const sortedObservationCards = useMemo(() => {
    const sortedComplete = sortMucusObservationsForDisplay(completeObservations);
    const byId = new Map(observations.map((observation) => [observation.id, observation]));
    const ordered = sortedComplete
      .map((observation) => byId.get(observation.id))
      .filter((observation): observation is DraftMucusObservation => Boolean(observation));
    const orderedIds = new Set(ordered.map((observation) => observation.id));
    return [
      ...ordered,
      ...observations.filter((observation) => !orderedIds.has(observation.id)),
    ];
  }, [completeObservations, observations]);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const showSameAsYesterday =
    !missing &&
    !multiObservation &&
    !initialEntry &&
    previousDayEntry != null &&
    !previousDayEntry.missing;
  const canAddObservation = observations.every(
    (observation) => observation.sensation !== null
      && isValidObservationTime(observation.observedAt),
  );

  const updateObservation = useCallback((
    id: string,
    updater: (observation: DraftMucusObservation) => DraftMucusObservation,
  ) => {
    setObservations((current) => current.map(
      (observation) => observation.id === id ? updater(observation) : observation,
    ));
  }, []);

  const handleSameAsYesterday = useCallback((on: boolean) => {
    if (!activeObservation) return;
    if (on && previousDayEntry) {
      const representative = resolveDailyMucus(previousDayEntry).representative;
      preToggleSnapshot.current = { observation: { ...activeObservation } };
      updateObservation(activeObservation.id ?? '', (observation) => ({
        ...observation,
        sensation: representative?.sensation ?? initialSensationForEntry(previousDayEntry),
        appearances: [...(representative?.appearances ?? [])],
        frequency: representative?.frequency,
      }));
    } else if (!on && preToggleSnapshot.current) {
      const snapshot = preToggleSnapshot.current.observation;
      updateObservation(activeObservation.id ?? '', () => snapshot);
      preToggleSnapshot.current = null;
    }
    setSameAsYesterday(on);
  }, [activeObservation, previousDayEntry, updateObservation]);

  const rank = useMemo(
    () => (
      missing || completeObservations.length === 0
        ? null
        : computeMucusRank({ observations: completeObservations })
    ),
    [completeObservations, missing],
  );

  const selectedBleedingEducation = useMemo(
    () => BLEEDING_EDUCATION.find((item) => item.value === bleeding) ?? BLEEDING_EDUCATION[0],
    [bleeding],
  );

  const showMenstrualFlowStartQuestion = shouldShowMenstrualFlowStartQuestion({
    bleeding,
    previousDayEntry,
    existingMarker: initialEntry?.menstrualFlowStart,
  });

  const classInfo = useMemo(() => {
    if (missing || completeObservations.length === 0 || rank === null) return null;
    const draft = withMucusObservations(
      { bleeding },
      completeObservations,
    );
    const primary = derivePrimaryDayClassFromEntry(draft, rank);
    if (primary === 'menstrual_flow') {
      return {
        title: 'Menstrual flow day',
        desc: 'Bleeding is logged as menstrual flow. Mucus is still recorded but is not interpreted as Peak-type for this day.',
        hint: 'Record flow and any sensations; continue your daily observations.',
      };
    }
    if (primary === 'spotting') {
      return {
        title: 'Spotting recorded',
        desc: 'Light bleeding or spotting without full flow.',
        hint: 'Your dry or mucus observation stays separate from the spotting you recorded.',
      };
    }
    const classification = classifyFertility(draft);
    const base = CLASSIFICATION_LABELS[classification] ?? null;
    if (!base || (bleeding !== 'spotting' && bleeding !== 'brown')) return base;
    const bleedingLabel = bleeding === 'brown' ? 'Brown was' : 'Spotting was';
    return {
      ...base,
      desc: `${base.desc} ${bleedingLabel} also recorded.`,
      hint: 'Both observations stay visible on your chart; the mucus sign determines the mucus pattern shown for this day.',
    };
  }, [missing, rank, bleeding, completeObservations]);

  const displayDate = formatFullDate(date);

  const toggleAppearance = (value: Appearance) => {
    if (!activeObservation?.id) return;
    if (value === 'none') {
      updateObservation(activeObservation.id, (observation) => ({
        ...observation,
        appearances: [],
      }));
      return;
    }
    updateObservation(activeObservation.id, (observation) => {
      const filtered = observation.appearances.filter((appearance) => appearance !== 'none');
      if (filtered.includes(value)) {
        return { ...observation, appearances: filtered.filter((appearance) => appearance !== value) };
      }
      return { ...observation, appearances: [...filtered, value] };
    });
  };

  const performAddObservation = useCallback(() => {
    const id = createObservationId();
    setObservations((current) => [
      ...current,
      { id, sensation: null, appearances: [] },
    ]);
    setActiveObservationId(id);
    setSameAsYesterday(false);
  }, []);

  const requestAddObservation = useCallback(async () => {
    const hasSeenEducation = await AsyncStorage.getItem(MULTIPLE_OBSERVATIONS_EDUCATION_KEY);
    if (hasSeenEducation === 'true') {
      performAddObservation();
      return;
    }
    setShowMultipleObservationInfo(true);
  }, [performAddObservation]);

  const confirmAddObservation = useCallback(async () => {
    await AsyncStorage.setItem(MULTIPLE_OBSERVATIONS_EDUCATION_KEY, 'true');
    setShowMultipleObservationInfo(false);
    performAddObservation();
  }, [performAddObservation]);

  useEffect(() => {
    if (!startAddingObservation || handledStartAdding.current) return;
    handledStartAdding.current = true;
    void requestAddObservation();
  }, [requestAddObservation, startAddingObservation]);

  const removeObservation = useCallback(() => {
    if (!observationToRemove || observations.length <= 1) return;
    const next = observations.filter((observation) => observation.id !== observationToRemove);
    setObservations(next);
    if (activeObservationId === observationToRemove) {
      setActiveObservationId(next[0]?.id ?? '');
    }
    setObservationToRemove(null);
    AccessibilityInfo.announceForAccessibility('Mucus observation removed. Daily chart result updated.');
  }, [activeObservationId, observationToRemove, observations]);

  const selectBleeding = (value: BleedingType) => {
    if (value !== 'light' || bleeding !== 'light') {
      setMenstrualFlowStart(null);
    }
    setBleeding(value);
  };

  const saveEntry = useCallback(async (entry: DailyEntry) => {
    if (saving) return;
    setSaving(true);
    try {
      await onSave(entry);
    } finally {
      setSaving(false);
    }
  }, [onSave, saving]);

  const handleSave = () => {
    if (missing) {
      void saveEntry({ date, missing: true });
      return;
    }
    if (
      observations.length === 0
      || observations.some((observation) => observation.sensation === null)
      || observations.some((observation) => !isValidObservationTime(observation.observedAt))
    ) return;
    const savedMenstrualFlowStart = menstrualFlowStartForSavedEntry({
      showQuestion: showMenstrualFlowStartQuestion,
      selected: menstrualFlowStart,
    });
    const complete = observations as Array<DraftMucusObservation & { sensation: Sensation }>;
    void saveEntry(withMucusObservations({
      date,
      bleeding,
      ...(savedMenstrualFlowStart
        ? { menstrualFlowStart: savedMenstrualFlowStart }
        : {}),
      intercourse,
      notes: notes.trim() || undefined,
    }, complete));
  };

  const handleMarkMissing = () => {
    void saveEntry({ date, missing: true });
  };

  const handleDeleteChoice = useCallback(async (choice: EntryDeleteChoice) => {
    if (!onDelete || deleting) return;
    if (choice === 'confirm') setDeleting(true);
    try {
      await applyEntryDeleteChoice(choice, onDelete);
      setShowDeleteConfirmation(false);
    } finally {
      if (choice === 'confirm') setDeleting(false);
    }
  }, [deleting, onDelete]);

  const canSave = missing || (
    observations.length > 0
    && observations.every((observation) => observation.sensation !== null)
    && observations.every((observation) => isValidObservationTime(observation.observedAt))
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 48 : 0}
    >
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + keyboardHeight }]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Observation</Text>
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>{displayDate}</Text>
        </View>
      </View>

      {cycleStartReview ? (
        <View style={styles.cycleStartReviewCard}>
          <Text style={styles.cycleStartReviewTitle}>Confirm this cycle’s start</Text>
          <Text style={styles.cycleStartReviewBody}>
            Review the bleeding entry below, then answer “Did your period begin today?”
            Saving this day updates the cycle automatically.
          </Text>
        </View>
      ) : null}

      <View style={styles.missingRow}>
        <Text style={styles.missingLabel}>Did you observe today?</Text>
        <Switch value={!missing} onValueChange={(v) => setMissing(!v)} />
      </View>

      {showSameAsYesterday ? (
        <View style={styles.sameAsYesterdayRow}>
          <Text style={styles.missingLabel}>Same as yesterday?</Text>
          <Switch value={sameAsYesterday} onValueChange={handleSameAsYesterday} />
        </View>
      ) : null}

      {missing ? (
        <View style={styles.missingNote}>
          <Text style={styles.missingNoteText}>
            This day will be marked as missing. Missing days cannot confirm Peak.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Bleeding</Text>
              <Pressable
                onPress={() => setShowBleedingInfo(!showBleedingInfo)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`${showBleedingInfo ? 'Hide' : 'Show'} bleeding type guide`}
                accessibilityHint="Explains the Creighton-aligned bleeding categories"
                accessibilityState={{ expanded: showBleedingInfo }}
              >
                <View style={styles.infoBubble}>
                  <Text style={styles.infoBubbleText}>i</Text>
                </View>
              </Pressable>
            </View>
            <View style={styles.pillRow}>
              {BLEEDING_EDUCATION.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[styles.pill, bleeding === opt.value && styles.pillSelected]}
                  onPress={() => selectBleeding(opt.value)}
                  accessibilityRole="radio"
                  accessibilityLabel={opt.code ? `${opt.label}, ${opt.code}` : opt.label}
                  accessibilityState={{ selected: bleeding === opt.value }}
                >
                  <Text style={[styles.pillText, bleeding === opt.value && styles.pillTextSelected]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.bleedingSelectionHelp} accessibilityLiveRegion="polite">
              <Text style={styles.bleedingSelectionTitle}>
                {selectedBleedingEducation.label}
                {selectedBleedingEducation.code ? ` (${selectedBleedingEducation.code})` : ''}
              </Text>
              <Text style={styles.bleedingSelectionDescription}>
                {selectedBleedingEducation.description}
              </Text>
            </View>
            {showBleedingInfo && (
              <View style={styles.bleedingGuide}>
                {BLEEDING_EDUCATION.map((item) => (
                  <View key={item.value} style={styles.bleedingGuideItem}>
                    <Text style={styles.bleedingGuideTitle}>
                      {item.label}{item.code ? ` (${item.code})` : ''}
                    </Text>
                    <Text style={styles.bleedingGuideDescription}>{item.description}</Text>
                  </View>
                ))}
                <Text style={styles.bleedingGuideNote}>{BLEEDING_EDUCATION_NOTE}</Text>
              </View>
            )}
            {showMenstrualFlowStartQuestion ? (
              <View style={styles.flowStartCard}>
                <Text style={styles.flowStartTitle}>Did your period begin today?</Text>
                <Text style={styles.flowStartHelp}>
                  Choose Yes only if this was the first day of true menstrual flow—not isolated spotting or brown discharge.
                </Text>
                <View style={styles.flowStartOptions} accessibilityRole="radiogroup">
                  {MENSTRUAL_FLOW_START_OPTIONS.map((option) => {
                    const selected = menstrualFlowStart === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        style={styles.flowStartOption}
                        onPress={() => setMenstrualFlowStart(option.value)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        accessibilityLabel={option.label}
                      >
                        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                          {selected ? <View style={styles.radioInner} /> : null}
                        </View>
                        <Text style={styles.flowStartOptionText}>{option.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </View>

          {multiObservation ? (
            <View style={styles.section}>
              <View style={styles.observationHeadingRow}>
                <View>
                  <Text style={styles.observationHeading}>
                    Mucus observations ({observations.length})
                  </Text>
                  <Text style={styles.observationHelper}>
                    The observation with the most fertile signs is used for the day&apos;s chart.
                  </Text>
                </View>
                <Pressable
                  onPress={() => setShowObservationHelp(true)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="About multiple mucus observations"
                >
                  <View style={styles.infoBubble}>
                    <Text style={styles.infoBubbleText}>i</Text>
                  </View>
                </Pressable>
              </View>
              <View style={styles.observationCards}>
                {sortedObservationCards.map((observation) => {
                  const active = observation.id === activeObservation?.id;
                  const usedForChart = observation.id === resolvedDraft.representative?.id;
                  return (
                    <Pressable
                      key={observation.id}
                      style={[styles.observationCard, active && styles.observationCardActive]}
                      onPress={() => setActiveObservationId(observation.id ?? '')}
                      accessibilityRole="button"
                      accessibilityState={{ expanded: active }}
                      accessibilityLabel={`${formatObservationTime(observation.observedAt)}. ${observationSummary(observation)}${usedForChart ? '. Used for chart' : ''}`}
                    >
                      <View style={styles.observationCardHeader}>
                        <Text style={styles.observationTime}>
                          {formatObservationTime(observation.observedAt)}
                        </Text>
                        {usedForChart ? (
                          <View style={styles.chartResultBadge}>
                            <Text style={styles.chartResultBadgeText}>Used for chart</Text>
                          </View>
                        ) : null}
                        <Text style={styles.observationChevron}>{active ? '⌃' : '›'}</Text>
                      </View>
                      <Text style={styles.observationSummary}>{observationSummary(observation)}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          {showObservationTimeEditor && activeObservation ? (
            <View style={styles.timeSection}>
              <Text style={styles.fieldLabel}>Time observed (optional)</Text>
              <Text style={styles.timeHelper}>
                Choose when you observed this. Leave blank if you don&apos;t remember.
              </Text>
              <View style={styles.timeRow}>
                <TextInput
                  style={styles.timeInput}
                  value={activeObservation.observedAt ?? ''}
                  onChangeText={(value) => updateObservation(
                    activeObservation.id ?? '',
                    (observation) => ({
                      ...observation,
                      observedAt: value.replace(/[^0-9:]/g, '').slice(0, 5) || undefined,
                    }),
                  )}
                  placeholder="HH:MM"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  accessibilityLabel="Time observed, optional, 24 hour format"
                />
                <Pressable
                  style={styles.currentTimeButton}
                  onPress={() => updateObservation(
                    activeObservation.id ?? '',
                    (observation) => ({ ...observation, observedAt: currentLocalTime() }),
                  )}
                  accessibilityRole="button"
                >
                  <Text style={styles.currentTimeButtonText}>Use current time</Text>
                </Pressable>
              </View>
              {!isValidObservationTime(activeObservation.observedAt) ? (
                <Text style={styles.timeError}>Use 24-hour time, such as 08:15 or 20:30.</Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.section}>
            <View style={styles.fieldHeadingRow}>
              <Text style={styles.fieldLabel}>Sensation</Text>
              <Pressable
                style={({ pressed }) => [styles.guideButton, pressed && styles.guideButtonPressed]}
                onPress={() => setObservationGuideTab('sensation')}
                accessibilityRole="button"
                accessibilityLabel="View sensation guide"
              >
                <Text style={styles.guideButtonText}>View Guide</Text>
              </Pressable>
            </View>
            <View style={styles.cardGrid}>
              {SENSATION_GUIDE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[styles.card, activeObservation?.sensation === opt.value && styles.cardSelected]}
                  onPress={() => activeObservation?.id && updateObservation(
                    activeObservation.id,
                    (observation) => ({ ...observation, sensation: opt.value }),
                  )}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: activeObservation?.sensation === opt.value }}
                >
                  <Text style={[styles.cardTitle, activeObservation?.sensation === opt.value && styles.cardTitleSelected]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.cardDesc}>{opt.formDescription}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.fieldHeadingRow}>
              <Text style={styles.fieldLabel}>Appearance</Text>
              <Pressable
                style={({ pressed }) => [styles.guideButton, pressed && styles.guideButtonPressed]}
                onPress={() => setObservationGuideTab('appearance')}
                accessibilityRole="button"
                accessibilityLabel="View appearance guide"
              >
                <Text style={styles.guideButtonText}>View Guide</Text>
              </Pressable>
            </View>
            <View style={styles.pillRow}>
              {APPEARANCE_GUIDE_OPTIONS.map((opt) => {
                const isNone = opt.value === 'none';
                const selected = isNone
                  ? (activeObservation?.appearances.length ?? 0) === 0
                  : activeObservation?.appearances.includes(opt.value) ?? false;
                return (
                  <Pressable
                    key={opt.value}
                    style={[styles.pill, selected && styles.pillSelected]}
                    onPress={() => toggleAppearance(opt.value)}
                  >
                    <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                      {opt.formLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Observed During the Day</Text>
              <Pressable onPress={() => setShowFreqInfo(!showFreqInfo)} hitSlop={8}>
                <View style={styles.infoBubble}>
                  <Text style={styles.infoBubbleText}>i</Text>
                </View>
              </Pressable>
            </View>
            {showFreqInfo && (
              <Text style={styles.infoTooltip}>
                How many times you noticed this observation during the day.
              </Text>
            )}
            <View style={styles.pillRow}>
              {FREQUENCY_OPTIONS.map((opt) => (
                <Pressable
                  key={String(opt.value)}
                  style={[styles.pill, activeObservation?.frequency === opt.value && styles.pillSelected]}
                  onPress={() => activeObservation?.id && updateObservation(
                    activeObservation.id,
                    (observation) => ({
                      ...observation,
                      frequency: observation.frequency === opt.value ? undefined : opt.value,
                    }),
                  )}
                >
                  <Text style={[styles.pillText, activeObservation?.frequency === opt.value && styles.pillTextSelected]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {multiObservation ? (
            <Pressable
              style={styles.removeObservationButton}
              onPress={() => setObservationToRemove(activeObservation?.id ?? null)}
              accessibilityRole="button"
              accessibilityLabel="Remove this mucus observation"
            >
              <Text style={styles.removeObservationText}>Remove mucus observation</Text>
            </Pressable>
          ) : null}

          <Pressable
            style={[styles.addObservationButton, !canAddObservation && styles.addObservationButtonDisabled]}
            onPress={() => void requestAddObservation()}
            disabled={!canAddObservation}
            accessibilityRole="button"
            accessibilityLabel="Add another mucus observation"
            accessibilityState={{ disabled: !canAddObservation }}
          >
            <Text style={styles.addObservationText}>+ Add another mucus observation</Text>
          </Pressable>

          <View style={styles.intercourseRow}>
            <Text style={styles.fieldLabel}>Intercourse Today?</Text>
            <Switch value={intercourse} onValueChange={setIntercourse} />
          </View>
          {intercourse && (
            <Text style={styles.seminalTip}>
              Tip: Seminal fluid can resemble mucus. For the most accurate observation,
              check before intercourse or note any difference in sensation.
            </Text>
          )}

          <View
            style={styles.section}
            onLayout={(e) => {
              notesBlockY.current = e.nativeEvent.layout.y;
            }}
          >
            <View style={styles.labelRow}>
              <Text style={styles.fieldLabel}>Notes (Optional)</Text>
              <Pressable onPress={() => setShowNotesInfo(!showNotesInfo)} hitSlop={8}>
                <View style={styles.infoBubble}>
                  <Text style={styles.infoBubbleText}>i</Text>
                </View>
              </Pressable>
            </View>
            {showNotesInfo && (
              <Text style={styles.infoTooltip}>
                Use notes to record PMS symptoms, mood, energy levels, or anything else you want to remember about this day.
              </Text>
            )}
            <TextInput
              style={styles.notesInput}
              placeholder="Any additional observations, symptoms, or notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
              onFocus={() => {
                const scrollNotesIntoView = () => {
                  scrollRef.current?.scrollTo({
                    y: Math.max(0, notesBlockY.current - 16),
                    animated: true,
                  });
                };
                setTimeout(scrollNotesIntoView, Platform.OS === 'ios' ? 120 : 80);
                setTimeout(scrollNotesIntoView, Platform.OS === 'ios' ? 320 : 250);
              }}
            />
          </View>

          {classInfo && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryType}>{classInfo.title}</Text>
              <Text style={styles.summaryDesc}>{classInfo.desc}</Text>
              <Text style={styles.summaryHint}>{classInfo.hint}</Text>
            </View>
          )}
        </>
      )}

      {onDelete && (
        <Pressable
          style={styles.deleteBtn}
          onPress={() => setShowDeleteConfirmation(true)}
          accessibilityRole="button"
          accessibilityLabel="Delete daily entry"
          accessibilityHint="Opens a confirmation before deleting this entire day"
        >
          <Text style={styles.deleteText}>Delete Daily Entry</Text>
        </Pressable>
      )}
    </ScrollView>
    <View style={styles.stickyFooter}>
      {!missing && observations.some((observation) => observation.sensation === null) ? (
        <Text style={styles.observationConfirmationPrompt} accessibilityLiveRegion="polite">
          Finish or remove this mucus observation before saving.
        </Text>
      ) : null}
      {!missing && observations.some((observation) => !isValidObservationTime(observation.observedAt)) ? (
        <Text style={styles.observationConfirmationPrompt} accessibilityLiveRegion="polite">
          Correct the observation time or leave it blank before saving.
        </Text>
      ) : null}
      {showMarkMissingButton && !missing ? (
        <Pressable style={styles.markMissingBtn} onPress={handleMarkMissing} disabled={saving}>
          <Text style={styles.markMissingText}>I do not remember this day</Text>
        </Pressable>
      ) : null}
      <Pressable
        style={[styles.saveBtnSticky, (!canSave || saving) && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={!canSave || saving}
        accessibilityState={{ disabled: !canSave || saving }}
      >
        <Text style={styles.saveText}>{saving ? 'Saving...' : saveLabel}</Text>
      </Pressable>
    </View>
    <Modal
      visible={showDeleteConfirmation}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!deleting) void handleDeleteChoice('cancel');
      }}
    >
      <View
        style={styles.modalOverlay}
        accessibilityViewIsModal
        onAccessibilityEscape={() => {
          if (!deleting) void handleDeleteChoice('cancel');
        }}
      >
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Delete this daily entry?</Text>
          <Text style={styles.modalBody}>
            This removes all mucus observations and day details for {displayDate} from your chart. This action cannot be undone.
          </Text>
          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalBtnOutline, deleting && styles.modalBtnDisabled]}
              onPress={() => void handleDeleteChoice('cancel')}
              disabled={deleting}
              accessibilityRole="button"
            >
              <Text style={styles.modalBtnOutlineText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.modalBtnDanger, deleting && styles.modalBtnDisabled]}
              onPress={() => void handleDeleteChoice('confirm')}
              disabled={deleting}
              accessibilityRole="button"
            >
              <Text style={styles.modalBtnDangerText}>
                {deleting ? 'Deleting...' : 'Delete Daily Entry'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
    <Modal
      visible={showMultipleObservationInfo}
      transparent
      animationType="fade"
      onRequestClose={() => setShowMultipleObservationInfo(false)}
    >
      <View style={styles.modalOverlay} accessibilityViewIsModal>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Multiple mucus observations</Text>
          <Text style={styles.modalBody}>
            Log mucus as it changes during the day. Bleeding, intercourse, and notes still apply to the whole day. Well Within keeps every mucus observation and uses the one with the most fertile signs for that day&apos;s chart.
          </Text>
          <View style={styles.modalButtons}>
            <Pressable
              style={styles.modalBtnOutline}
              onPress={() => setShowMultipleObservationInfo(false)}
              accessibilityRole="button"
            >
              <Text style={styles.modalBtnOutlineText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.modalBtnFilled}
              onPress={() => void confirmAddObservation()}
              accessibilityRole="button"
            >
              <Text style={styles.modalBtnFilledText}>Add observation</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
    <Modal
      visible={showObservationHelp}
      transparent
      animationType="fade"
      onRequestClose={() => setShowObservationHelp(false)}
    >
      <View style={styles.modalOverlay} accessibilityViewIsModal>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>About multiple mucus observations</Text>
          <Text style={styles.modalBody}>
            Mucus can change during the day. You can save each distinct observation instead of deciding which one had the most fertile signs.{`\n\n`}Well Within keeps every observation and uses the one with the most fertile signs for that date&apos;s mucus result. Bleeding, menstrual flow start, intercourse, and notes are recorded once for the whole day.{`\n\n`}Time is optional and only helps organize observations. It does not affect the chart result.
          </Text>
          <Pressable
            style={[styles.modalBtnFilled, styles.modalBtnStandalone]}
            onPress={() => setShowObservationHelp(false)}
            accessibilityRole="button"
          >
            <Text style={styles.modalBtnFilledText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
    <Modal
      visible={observationToRemove !== null}
      transparent
      animationType="fade"
      onRequestClose={() => setObservationToRemove(null)}
    >
      <View style={styles.modalOverlay} accessibilityViewIsModal>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Remove this mucus observation?</Text>
          <Text style={styles.modalBody}>
            The rest of this day will stay saved. Well Within will update the day&apos;s chart result using the remaining observations.
          </Text>
          <View style={styles.modalButtons}>
            <Pressable
              style={styles.modalBtnOutline}
              onPress={() => setObservationToRemove(null)}
              accessibilityRole="button"
            >
              <Text style={styles.modalBtnOutlineText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.modalBtnDanger}
              onPress={removeObservation}
              accessibilityRole="button"
            >
              <Text style={styles.modalBtnDangerText}>Remove observation</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
    <ObservationGuideModal
      visible={observationGuideTab !== null}
      initialTab={observationGuideTab ?? 'appearance'}
      onClose={() => setObservationGuideTab(null)}
    />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: { flex: 1 },
  scroll: { flex: 1, backgroundColor: BG_CARD },
  scrollContent: { padding: 16, paddingBottom: 120 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 21, fontWeight: '600', color: TEXT_PRIMARY },
  dateBox: {
    borderWidth: 1, borderColor: BORDER_CARD, borderRadius: 8,
    padding: 12, marginTop: 8,
  },
  dateText: { fontSize: 15, fontWeight: '400', color: TEXT_PRIMARY },
  cycleStartReviewCard: {
    marginTop: 12,
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ACCENT_WARM,
    backgroundColor: ACCENT_WARM_TINT,
  },
  cycleStartReviewTitle: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
  cycleStartReviewBody: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: TEXT_SECONDARY,
  },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: TEXT_SECONDARY, marginBottom: 8 },
  fieldHeadingRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  guideButton: {
    minHeight: 32,
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
  guideButtonPressed: { opacity: 0.55 },
  guideButtonText: { color: ACCENT_WARM, fontSize: 13, fontWeight: '600' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: BORDER_CARD,
  },
  pillSelected: { backgroundColor: ACCENT_WARM_TINT, borderColor: ACCENT_WARM },
  pillText: { fontSize: 14, fontWeight: '400', color: TEXT_SECONDARY },
  pillTextSelected: { color: BRAND_NAME, fontWeight: '600' },
  bleedingSelectionHelp: {
    backgroundColor: BG_PAGE,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  bleedingSelectionTitle: { fontSize: 13, fontWeight: '600', color: TEXT_PRIMARY },
  bleedingSelectionDescription: { fontSize: 12, color: TEXT_SUBTLE, lineHeight: 18, marginTop: 2 },
  bleedingGuide: {
    backgroundColor: BG_CARD,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    gap: 10,
  },
  flowStartCard: {
    backgroundColor: BG_PAGE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    padding: 12,
    marginTop: 12,
  },
  flowStartTitle: { fontSize: 14, fontWeight: '600', color: TEXT_PRIMARY },
  flowStartHelp: { fontSize: 12, color: TEXT_SUBTLE, lineHeight: 18, marginTop: 4 },
  flowStartOptions: { marginTop: 10, gap: 10 },
  flowStartOption: { flexDirection: 'row', alignItems: 'center', minHeight: 30 },
  flowStartOptionText: { flex: 1, fontSize: 14, color: TEXT_SECONDARY, lineHeight: 20 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BORDER_CARD,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: { borderColor: ACCENT_WARM },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: ACCENT_WARM },
  bleedingGuideItem: { gap: 2 },
  bleedingGuideTitle: { fontSize: 13, fontWeight: '600', color: TEXT_PRIMARY },
  bleedingGuideDescription: { fontSize: 12, color: TEXT_SECONDARY, lineHeight: 18 },
  bleedingGuideNote: {
    fontSize: 12,
    color: TEXT_SUBTLE,
    lineHeight: 18,
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
    paddingTop: 10,
  },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: {
    width: '47%',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    backgroundColor: BG_CARD,
  },
  cardSelected: { backgroundColor: ACCENT_WARM_TINT, borderColor: ACCENT_WARM },
  cardTitle: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
  cardTitleSelected: { color: BRAND_NAME },
  cardDesc: { fontSize: 11, color: TEXT_SUBTLE, marginTop: 2 },
  intercourseRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: ACCENT_WARM_TINT, padding: 16, borderRadius: 10, marginTop: 16,
  },
  seminalTip: {
    fontSize: 12, color: '#92400e', backgroundColor: '#fffbeb',
    padding: 10, borderRadius: 8, marginTop: 8,
  },
  notesInput: {
    borderWidth: 1, borderColor: BORDER_CARD, borderRadius: 8,
    padding: 12, minHeight: 80, textAlignVertical: 'top', fontSize: 14, color: TEXT_PRIMARY,
  },
  summaryBox: {
    backgroundColor: BG_PAGE, padding: 16, borderRadius: 10,
    marginTop: 16, borderWidth: 1, borderColor: BORDER_CARD,
  },
  summaryType: { fontSize: 16, fontWeight: '600', color: TEXT_PRIMARY },
  summaryDesc: { fontSize: 14, fontWeight: '400', color: TEXT_SECONDARY, marginTop: 4, lineHeight: 22 },
  summaryHint: { fontSize: 14, fontWeight: '400', color: TEXT_SUBTLE, marginTop: 8, fontStyle: 'italic' },
  stickyFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: BG_CARD,
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
  },
  saveBtnSticky: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: ACCENT_WARM,
  },
  saveBtnDisabled: { opacity: 0.65 },
  saveText: { fontSize: 15, color: BG_CARD, fontWeight: '600' },
  observationConfirmationPrompt: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  markMissingBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 8,
  },
  markMissingText: { fontSize: 14, color: TEXT_SUBTLE, fontWeight: '500' },
  deleteBtn: { alignItems: 'center', marginTop: 24 },
  deleteText: { fontSize: 14, color: ACCENT_RED, fontWeight: '500' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  modalCard: {
    backgroundColor: BG_CARD,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 10 },
  modalBody: {
    fontSize: 15,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalBtnOutline: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER_CARD,
    alignItems: 'center',
  },
  modalBtnOutlineText: { fontSize: 14, color: TEXT_SECONDARY, fontWeight: '600' },
  modalBtnFilled: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: ACCENT_WARM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnFilledText: { fontSize: 14, color: BG_CARD, fontWeight: '600', textAlign: 'center' },
  modalBtnStandalone: { flex: 0 },
  modalBtnDanger: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: ACCENT_RED,
    alignItems: 'center',
  },
  modalBtnDangerText: { fontSize: 14, color: BG_CARD, fontWeight: '600' },
  modalBtnDisabled: { opacity: 0.6 },
  missingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: BG_MISSING, borderRadius: 10, marginTop: 16,
  },
  sameAsYesterdayRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: BG_MISSING, borderRadius: 10, marginTop: 8,
  },
  missingLabel: { fontSize: 14, fontWeight: '500', color: TEXT_SECONDARY },
  missingNote: { backgroundColor: '#fef3c7', padding: 12, borderRadius: 8, marginTop: 8 },
  missingNoteText: { fontSize: 14, fontWeight: '400', color: '#92400e', lineHeight: 22 },
  observationHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  observationHeading: { fontSize: 17, fontWeight: '600', color: TEXT_PRIMARY },
  observationHelper: { fontSize: 12, color: TEXT_SUBTLE, lineHeight: 18, marginTop: 3 },
  observationCards: { gap: 8, marginTop: 10 },
  observationCard: {
    borderWidth: 1,
    borderColor: BORDER_CARD,
    borderRadius: 10,
    backgroundColor: BG_CARD,
    padding: 12,
    minHeight: 64,
  },
  observationCardActive: { borderColor: ACCENT_WARM, backgroundColor: ACCENT_WARM_TINT },
  observationCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  observationTime: { flex: 1, fontSize: 14, fontWeight: '600', color: TEXT_PRIMARY },
  observationSummary: { fontSize: 13, color: TEXT_SECONDARY, marginTop: 4, lineHeight: 18 },
  observationChevron: { fontSize: 19, color: ACCENT_WARM },
  chartResultBadge: {
    backgroundColor: BG_MISSING,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chartResultBadgeText: { fontSize: 10, fontWeight: '600', color: TEXT_SECONDARY },
  timeSection: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    borderRadius: 10,
    padding: 12,
    backgroundColor: BG_PAGE,
  },
  timeHelper: { fontSize: 12, color: TEXT_SUBTLE, lineHeight: 18, marginBottom: 8 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeInput: {
    width: 92,
    minHeight: 44,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: TEXT_PRIMARY,
    backgroundColor: BG_CARD,
  },
  currentTimeButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: ACCENT_WARM_TINT,
  },
  currentTimeButtonText: { fontSize: 13, fontWeight: '600', color: ACCENT_WARM },
  timeError: { fontSize: 12, color: ACCENT_RED, marginTop: 6 },
  addObservationButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    borderRadius: 10,
    backgroundColor: BG_PAGE,
  },
  addObservationText: { fontSize: 14, fontWeight: '600', color: ACCENT_WARM },
  addObservationButtonDisabled: { opacity: 0.5 },
  removeObservationButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  removeObservationText: { fontSize: 13, fontWeight: '500', color: ACCENT_RED },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  infoBubble: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: BG_MISSING, justifyContent: 'center', alignItems: 'center',
  },
  infoBubbleText: { fontSize: 11, fontWeight: '700', color: TEXT_SUBTLE },
  infoTooltip: {
    fontSize: 12, color: TEXT_SUBTLE, backgroundColor: BG_PAGE,
    padding: 8, borderRadius: 8, marginBottom: 8,
  },
});
