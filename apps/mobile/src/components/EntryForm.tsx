import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
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
  Sensation,
} from 'core-rules-engine';
import {
  BG_CARD, BG_PAGE, BG_MISSING,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_SUBTLE,
  BORDER_CARD, ACCENT_WARM, ACCENT_WARM_TINT, BRAND_NAME, ACCENT_RED,
} from '../theme/colors';
import {
  canSaveObservationEntry,
  initialSensationForEntry,
} from './entryObservationConfirmation';
import {
  applyEntryDeleteChoice,
  type EntryDeleteChoice,
} from './entryDeleteConfirmation';

interface Props {
  initialEntry?: DailyEntry | null;
  previousDayEntry?: DailyEntry | null;
  date: string;
  onSave: (entry: DailyEntry) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  saveLabel?: string;
  showMarkMissingButton?: boolean;
}

const SENSATION_OPTIONS: { value: Sensation; label: string; desc: string }[] = [
  { value: 'dry', label: 'Dry', desc: 'No sensation' },
  { value: 'damp', label: 'Damp', desc: 'Slightly moist without lubrication' },
  { value: 'wet', label: 'Wet', desc: 'Wet without lubrication' },
  { value: 'shiny', label: 'Shiny', desc: 'Shiny without lubrication' },
  { value: 'sticky', label: 'Sticky', desc: 'Holds together, does not stretch' },
  { value: 'tacky', label: 'Tacky', desc: 'Stretches slightly then breaks' },
  { value: 'stretchy', label: 'Stretchy', desc: 'Stretches 1 inch or more' },
];

const APPEARANCE_OPTIONS: { value: Appearance; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'brown', label: 'Brown' },
  { value: 'cloudy', label: 'Cloudy (white)' },
  { value: 'cloudy_clear', label: 'Cloudy/Clear' },
  { value: 'gummy', label: 'Gummy' },
  { value: 'clear', label: 'Clear' },
  { value: 'lubricative', label: 'Lubricative' },
  { value: 'pasty', label: 'Pasty' },
  { value: 'red', label: 'Red' },
  { value: 'yellow', label: 'Yellow' },
];

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 1, label: 'Once' },
  { value: 2, label: 'Twice' },
  { value: 3, label: 'Three times' },
  { value: 'all_day', label: 'All day' },
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
}: Props): JSX.Element {
  const [missing, setMissing] = useState(initialEntry?.missing ?? false);
  const [bleeding, setBleeding] = useState<BleedingType>(initialEntry?.bleeding ?? 'none');
  const [sensation, setSensation] = useState<Sensation | null>(
    initialSensationForEntry(initialEntry),
  );
  const [appearances, setAppearances] = useState<Appearance[]>(initialEntry?.appearances ?? []);
  const [frequency, setFrequency] = useState<Frequency | undefined>(initialEntry?.frequency);
  const [showBleedingInfo, setShowBleedingInfo] = useState(false);
  const [showFreqInfo, setShowFreqInfo] = useState(false);
  const [showNotesInfo, setShowNotesInfo] = useState(false);
  const [intercourse, setIntercourse] = useState(initialEntry?.intercourse ?? false);
  const [notes, setNotes] = useState(initialEntry?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [sameAsYesterday, setSameAsYesterday] = useState(false);
  const preToggleSnapshot = useRef<{
    sensation: Sensation | null;
    appearances: Appearance[];
  } | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const notesBlockY = useRef(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

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
    !initialEntry &&
    previousDayEntry != null &&
    !previousDayEntry.missing;

  const handleSameAsYesterday = useCallback((on: boolean) => {
    if (on && previousDayEntry) {
      preToggleSnapshot.current = { sensation, appearances: [...appearances] };
      setSensation(previousDayEntry.sensation ?? 'dry');
      setAppearances(previousDayEntry.appearances ?? []);
    } else if (!on && preToggleSnapshot.current) {
      setSensation(preToggleSnapshot.current.sensation);
      setAppearances(preToggleSnapshot.current.appearances);
      preToggleSnapshot.current = null;
    }
    setSameAsYesterday(on);
  }, [previousDayEntry, sensation, appearances]);

  const rank = useMemo(
    () => (
      missing || sensation === null
        ? null
        : computeMucusRank({ sensation, appearances })
    ),
    [sensation, appearances, missing],
  );

  const selectedBleedingEducation = useMemo(
    () => BLEEDING_EDUCATION.find((item) => item.value === bleeding) ?? BLEEDING_EDUCATION[0],
    [bleeding],
  );

  const classInfo = useMemo(() => {
    if (missing || sensation === null || rank === null) return null;
    const draft: DailyEntry = { bleeding, sensation, appearances };
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
        title: 'Spotting',
        desc: 'Light bleeding or spotting without full flow.',
        hint: 'Note sensation and appearance alongside spotting.',
      };
    }
    const classification = classifyFertility({ sensation, appearances });
    return CLASSIFICATION_LABELS[classification] ?? null;
  }, [missing, rank, bleeding, sensation, appearances]);

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const toggleAppearance = (value: Appearance) => {
    if (value === 'none') {
      setAppearances([]);
      return;
    }
    setAppearances((prev) => {
      const filtered = prev.filter((a) => a !== 'none');
      if (filtered.includes(value)) {
        return filtered.filter((a) => a !== value);
      }
      return [...filtered, value];
    });
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
    if (sensation === null) return;
    void saveEntry({
      date,
      bleeding,
      sensation,
      appearances: appearances.length > 0 ? appearances : undefined,
      frequency,
      intercourse,
      notes: notes.trim() || undefined,
    });
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

  const canSave = canSaveObservationEntry(missing, sensation);

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
                  onPress={() => setBleeding(opt.value)}
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
          </View>

          <View style={styles.mostFertileNote}>
            <Text style={styles.mostFertileText}>
              Record your most fertile observation of the day — not just the most recent.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Sensation</Text>
            <View style={styles.cardGrid}>
              {SENSATION_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={[styles.card, sensation === opt.value && styles.cardSelected]}
                  onPress={() => setSensation(opt.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: sensation === opt.value }}
                >
                  <Text style={[styles.cardTitle, sensation === opt.value && styles.cardTitleSelected]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.cardDesc}>{opt.desc}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Appearance</Text>
            <View style={styles.pillRow}>
              {APPEARANCE_OPTIONS.map((opt) => {
                const isNone = opt.value === 'none';
                const selected = isNone
                  ? appearances.length === 0
                  : appearances.includes(opt.value);
                return (
                  <Pressable
                    key={opt.value}
                    style={[styles.pill, selected && styles.pillSelected]}
                    onPress={() => toggleAppearance(opt.value)}
                  >
                    <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                      {opt.label}
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
                  style={[styles.pill, frequency === opt.value && styles.pillSelected]}
                  onPress={() => setFrequency(frequency === opt.value ? undefined : opt.value)}
                >
                  <Text style={[styles.pillText, frequency === opt.value && styles.pillTextSelected]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

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
          accessibilityLabel="Delete entry"
          accessibilityHint="Opens a confirmation before deleting this observation"
        >
          <Text style={styles.deleteText}>Delete Entry</Text>
        </Pressable>
      )}
    </ScrollView>
    <View style={styles.stickyFooter}>
      {!missing && sensation === null ? (
        <Text style={styles.observationConfirmationPrompt} accessibilityLiveRegion="polite">
          Choose a sensation — including Dry — to confirm today&apos;s observation.
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
          <Text style={styles.modalTitle}>Delete this entry?</Text>
          <Text style={styles.modalBody}>
            This removes the observation for {displayDate} from your chart. This action cannot be undone.
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
                {deleting ? 'Deleting...' : 'Delete Entry'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
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
  fieldLabel: { fontSize: 14, fontWeight: '600', color: TEXT_SECONDARY, marginBottom: 8 },
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
  mostFertileNote: {
    backgroundColor: '#f0fdf4', borderLeftWidth: 3, borderLeftColor: '#16a34a',
    padding: 10, borderRadius: 8, marginTop: 16,
  },
  mostFertileText: { fontSize: 12, color: '#166534', fontStyle: 'italic' },
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
