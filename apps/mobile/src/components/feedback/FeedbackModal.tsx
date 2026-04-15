import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import type { CycleSlice } from 'core-rules-engine';

import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_CONFIDENCE,
  FEEDBACK_TYPES,
  submitFeedback,
  type FeedbackCategory,
  type FeedbackConfidence,
  type FeedbackType,
} from '../../services/feedback';
import { buildFeedbackCycleContext } from '../../services/feedbackContext';
import {
  ACCENT_WARM,
  ACCENT_WARM_TINT,
  BG_CARD,
  BG_PAGE,
  BORDER_CARD,
  TEXT_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from '../../theme/colors';

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export type FeedbackModalProps = {
  visible: boolean;
  onClose: () => void;
  /** For analytics / review; default Settings. */
  sourceScreen?: string;
  /** In-memory cycle slices from useCycleHistory (no raw storage reads in modal). */
  cycles: CycleSlice[];
};

export function FeedbackModal({
  visible,
  onClose,
  sourceScreen = 'Settings',
  cycles,
}: FeedbackModalProps): JSX.Element {
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [confidence, setConfidence] = useState<FeedbackConfidence | null>(null);
  const [message, setMessage] = useState('');
  const [includeContext, setIncludeContext] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const successCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const messageBlockY = useRef(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  const calendarAsOfDate = useMemo(() => todayString(), []);

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

  useEffect(
    () => () => {
      if (successCloseTimer.current) clearTimeout(successCloseTimer.current);
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFeedbackType(null);
    setCategory(null);
    setConfidence(null);
    setMessage('');
    setIncludeContext(false);
    setErrorText(null);
    setSuccess(false);
  }, []);

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible, resetForm]);

  const handleClose = useCallback(() => {
    if (submitting) return;
    onClose();
  }, [submitting, onClose]);

  const canSubmit =
    feedbackType !== null && category !== null && !submitting && !success;

  const onSubmit = useCallback(async () => {
    if (!canSubmit || feedbackType === null || category === null) return;
    setSubmitting(true);
    setErrorText(null);
    const cycleContext = includeContext
      ? buildFeedbackCycleContext(cycles, calendarAsOfDate)
      : null;
    try {
      await submitFeedback({
        sourceScreen,
        feedbackType,
        category,
        confidence,
        message: message.trim() || null,
        includeCycleContext: includeContext,
        cycleContext,
      });
      setSuccess(true);
      if (successCloseTimer.current) clearTimeout(successCloseTimer.current);
      successCloseTimer.current = setTimeout(() => {
        successCloseTimer.current = null;
        onClose();
      }, 1200);
    } catch {
      setErrorText('Couldn’t send feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [
    canSubmit,
    feedbackType,
    category,
    confidence,
    message,
    includeContext,
    cycles,
    calendarAsOfDate,
    sourceScreen,
    onClose,
  ]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalRoot}>
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            Keyboard.dismiss();
            handleClose();
          }}
          accessibilityLabel="Close feedback"
        />
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 8 : 0}
        >
        <View style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Send Feedback</Text>
              <Pressable onPress={handleClose} hitSlop={12} accessibilityRole="button">
                <Text style={styles.closeBtn}>✕</Text>
              </Pressable>
            </View>

            {success ? (
              <Text style={styles.successText}>Feedback sent</Text>
            ) : (
              <ScrollView
                ref={scrollRef}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  styles.scrollContent,
                  { paddingBottom: 8 + keyboardHeight },
                ]}
              >
                <Text style={styles.label}>Feedback type *</Text>
                <View style={styles.typeRow}>
                  {FEEDBACK_TYPES.map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => setFeedbackType(t)}
                      style={[styles.typeChip, feedbackType === t && styles.typeChipOn]}
                    >
                      <Text
                        style={[styles.typeChipText, feedbackType === t && styles.typeChipTextOn]}
                        numberOfLines={2}
                      >
                        {t}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.label}>Category *</Text>
                <View style={styles.categoryBox}>
                  <ScrollView
                    nestedScrollEnabled
                    style={styles.categoryScroll}
                    keyboardShouldPersistTaps="handled"
                  >
                    {FEEDBACK_CATEGORIES.map((c) => (
                      <Pressable
                        key={c}
                        onPress={() => setCategory(c)}
                        style={[styles.catRow, category === c && styles.catRowOn]}
                      >
                        <Text style={[styles.catText, category === c && styles.catTextOn]}>{c}</Text>
                        {category === c ? <Text style={styles.check}>✓</Text> : null}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                <Text style={styles.label}>Confidence (optional)</Text>
                <View style={styles.confRow}>
                  <Pressable
                    style={[styles.confChip, confidence === null && styles.confChipOn]}
                    onPress={() => setConfidence(null)}
                  >
                    <Text style={[styles.confChipText, confidence === null && styles.confChipTextOn]}>
                      No preference
                    </Text>
                  </Pressable>
                  {FEEDBACK_CONFIDENCE.map((c) => (
                    <Pressable
                      key={c}
                      style={[styles.confChip, confidence === c && styles.confChipOn]}
                      onPress={() => setConfidence(c)}
                    >
                      <Text style={[styles.confChipText, confidence === c && styles.confChipTextOn]} numberOfLines={2}>
                        {c === 'This matches what I expected' ? 'As expected' : 'Feels wrong'}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <View
                  onLayout={(e) => {
                    messageBlockY.current = e.nativeEvent.layout.y;
                  }}
                >
                  <Text style={styles.label}>Message (optional)</Text>
                  <TextInput
                    style={styles.input}
                    multiline
                    maxLength={1000}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Anything else you’d like to share…"
                    placeholderTextColor={TEXT_MUTED}
                    textAlignVertical="top"
                    onFocus={() => {
                      const scroll = () => {
                        scrollRef.current?.scrollTo({
                          y: Math.max(0, messageBlockY.current - 12),
                          animated: true,
                        });
                      };
                      setTimeout(scroll, Platform.OS === 'ios' ? 120 : 80);
                      setTimeout(scroll, Platform.OS === 'ios' ? 340 : 260);
                    }}
                  />
                </View>
                <Text style={styles.counter}>{message.length} / 1000</Text>

                <View style={styles.toggleBlock}>
                  <View style={styles.toggleTextWrap}>
                    <Text style={styles.toggleLabel}>
                      Include cycle context to improve this feedback
                    </Text>
                    <Text style={styles.toggleHelp}>
                      Includes cycle length, phase, and data completeness. No personal notes.
                    </Text>
                  </View>
                  <Switch value={includeContext} onValueChange={setIncludeContext} />
                </View>

                {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

                <Pressable
                  style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
                  onPress={() => void onSubmit()}
                  disabled={!canSubmit}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitBtnText}>Submit feedback</Text>
                  )}
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
    maxHeight: '100%',
  },
  sheetWrap: {
    maxHeight: '92%',
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
  },
  sheet: {
    backgroundColor: BG_CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
    maxHeight: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY },
  closeBtn: { fontSize: 18, color: TEXT_MUTED, padding: 4 },
  scrollContent: { paddingBottom: 8 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SECONDARY,
    marginBottom: 8,
    marginTop: 4,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  typeChip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    backgroundColor: BG_PAGE,
    maxWidth: '100%',
  },
  typeChipOn: {
    borderColor: ACCENT_WARM,
    backgroundColor: ACCENT_WARM_TINT,
  },
  typeChipText: { fontSize: 13, color: TEXT_SECONDARY, fontWeight: '500' },
  typeChipTextOn: { color: TEXT_PRIMARY },
  categoryBox: {
    borderWidth: 1,
    borderColor: BORDER_CARD,
    borderRadius: 12,
    marginBottom: 12,
    maxHeight: 200,
    overflow: 'hidden',
  },
  categoryScroll: { maxHeight: 200 },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER_CARD,
  },
  catRowOn: { backgroundColor: ACCENT_WARM_TINT },
  catText: { fontSize: 15, color: TEXT_PRIMARY, flex: 1, paddingRight: 8 },
  catTextOn: { fontWeight: '600' },
  check: { fontSize: 16, color: ACCENT_WARM, fontWeight: '700' },
  confRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  confChip: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    backgroundColor: BG_PAGE,
  },
  confChipOn: { borderColor: ACCENT_WARM, backgroundColor: ACCENT_WARM_TINT },
  confChipText: { fontSize: 12, color: TEXT_SECONDARY, fontWeight: '500', maxWidth: 120 },
  confChipTextOn: { color: TEXT_PRIMARY, fontWeight: '600' },
  input: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: TEXT_PRIMARY,
    backgroundColor: BG_PAGE,
  },
  counter: { fontSize: 12, color: TEXT_MUTED, textAlign: 'right', marginTop: 4, marginBottom: 8 },
  toggleBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
    marginTop: 4,
  },
  toggleTextWrap: { flex: 1 },
  toggleLabel: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 4 },
  toggleHelp: { fontSize: 13, color: TEXT_MUTED, lineHeight: 18 },
  errorText: { fontSize: 14, color: '#b91c1c', marginBottom: 10 },
  submitBtn: {
    backgroundColor: ACCENT_WARM,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  successText: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    textAlign: 'center',
    paddingVertical: 24,
    fontWeight: '500',
  },
});
