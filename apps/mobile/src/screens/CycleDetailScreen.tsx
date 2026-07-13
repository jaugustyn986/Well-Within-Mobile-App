import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import {
  buildCalendarAlignedCycleDays,
  buildCycleComparisonNarrative,
  cycleDayForEntryIndex,
  evaluateInterpretationSupport,
} from 'core-rules-engine';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useCycleHistory } from '../hooks/useCycleHistory';
import { MucusChart } from '../components/MucusChart';
import { FertileTimeline } from '../components/FertileTimeline';
import { DailyLogList } from '../components/DailyLogList';
import { buildCyclePdfHtml } from '../utils/exportCyclePdf';
import { formatCyclePrimarySecondary } from '../utils/cycleDisplay';
import {
  BG_CARD, BG_PAGE,
  TEXT_PRIMARY, TEXT_MUTED, TEXT_SECONDARY,
  BORDER_CARD, ACCENT_WARM,
} from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CycleDetail'>;

export function CycleDetailScreen({ route, navigation }: Props): React.JSX.Element {
  const { cycleNumber } = route.params;
  const { cycles, loading, refresh } = useCycleHistory();
  const [exporting, setExporting] = useState(false);
  const [showIntercoursePrompt, setShowIntercoursePrompt] = useState(false);
  const [pendingIncludeIntercourse, setPendingIncludeIntercourse] = useState<boolean | null>(null);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const cycle = useMemo(
    () => cycles.find((c) => c.cycleNumber === cycleNumber) ?? null,
    [cycles, cycleNumber],
  );

  const headerLabels = useMemo(
    () => (cycle ? formatCyclePrimarySecondary(cycle, cycles) : { primary: '', secondary: '' }),
    [cycle, cycles],
  );

  const comparisonNarrative = useMemo(
    () => (cycle ? buildCycleComparisonNarrative(cycle, cycles) : ''),
    [cycle, cycles],
  );

  const alignedDays = useMemo(
    () => (cycle ? buildCalendarAlignedCycleDays(cycle) : []),
    [cycle],
  );

  const interpretation = useMemo(
    () => (cycle ? evaluateInterpretationSupport(cycle.entries, cycle.result) : null),
    [cycle],
  );

  const handleExport = useCallback(async (includeIntercourse: boolean) => {
    if (!cycle) return;
    setExporting(true);
    try {
      const { primary, secondary } = formatCyclePrimarySecondary(cycle, cycles);
      const headerSubtitle = `${primary} · ${secondary} · ${cycle.length} days`;
      const html = buildCyclePdfHtml(cycle, includeIntercourse, { headerSubtitle });
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, { mimeType: 'application/pdf' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'An error occurred while exporting.';
      Alert.alert('Export Failed', msg);
    } finally {
      setExporting(false);
    }
  }, [cycle, cycles]);

  const queueExport = useCallback((includeIntercourse: boolean) => {
    setPendingIncludeIntercourse(includeIntercourse);
    setShowIntercoursePrompt(false);
  }, []);

  const handlePromptDismiss = useCallback(() => {
    if (pendingIncludeIntercourse === null) {
      return;
    }
    const includeIntercourse = pendingIncludeIntercourse;
    setPendingIncludeIntercourse(null);
    void handleExport(includeIntercourse);
  }, [handleExport, pendingIncludeIntercourse]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!cycle) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Cycle not found.</Text>
      </SafeAreaView>
    );
  }

  const fertileEndLabel =
    cycle.result.fertileEndIndex !== null
      ? `Day ${cycleDayForEntryIndex(cycle.entries, cycle.result.fertileEndIndex)}`
      : '--';
  const interpretationLimited =
    interpretation?.status === 'blocked_by_missing' ||
    interpretation?.status === 'review_recommended';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.headerSide}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerPrimary} numberOfLines={2}>{headerLabels.primary}</Text>
          <Text style={styles.headerSecondary}>{headerLabels.secondary}</Text>
        </View>
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <Pressable
            style={[styles.exportBtn, exporting && styles.exportBtnDisabled]}
            onPress={() => setShowIntercoursePrompt(true)}
            disabled={exporting}
          >
            <Text style={styles.exportBtnText}>{exporting ? 'Exporting...' : 'Export'}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {interpretationLimited ? (
          <View style={styles.interpretationNotice}>
            <Text style={styles.interpretationNoticeTitle}>
              {interpretation?.status === 'review_recommended'
                ? 'Your chart shows more than one possible Peak pattern'
                : 'A few days need context'}
            </Text>
            <Text style={styles.interpretationNoticeBody}>
              {interpretation?.status === 'review_recommended'
                ? 'More than one Peak-type day is followed by the three-day pattern Well Within looks for, so the app isn’t choosing one Peak Day. Keep charting; we’ll check again whenever your observations change.'
                : 'Keep charting. If you remember an open day, you can add it; days marked not observed stay part of your record.'}
            </Text>
            <View style={styles.interpretationActions}>
              <Pressable
                onPress={() =>
                  navigation.navigate('Help', { initialSection: 'status_messages' })
                }
              >
                <Text style={styles.interpretationActionText}>Learn what this means</Text>
              </Pressable>
              {interpretation?.status === 'review_recommended' ? (
                <Pressable onPress={() => navigation.navigate('FindCare')}>
                  <Text style={styles.interpretationActionText}>Find charting support</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : (
          <>
            <View style={styles.statsRow}>
              <StatBox label="Length" value={`${cycle.length}d`} />
              <StatBox label="Peak Day" value={cycle.peakDay !== null ? `Day ${cycle.peakDay}` : '--'} />
              <StatBox label="Fertile End" value={fertileEndLabel} />
            </View>

            <View style={styles.comparisonCard}>
              <Text style={styles.comparisonText}>{comparisonNarrative}</Text>
            </View>
          </>
        )}

        <Pressable
          style={({ pressed }) => [styles.findCareCard, pressed && styles.findCareCardPressed]}
          onPress={() => navigation.navigate('FindCare')}
          accessibilityRole="button"
          accessibilityLabel="Find care resources"
        >
          <View style={styles.findCareText}>
            <Text style={styles.findCareTitle}>
              {interpretation?.status === 'review_recommended' ? 'Find charting support' : 'Find care'}
            </Text>
            <Text style={styles.findCareBody}>
              NaPro, NFP, and restorative care resources outside Well Within.
            </Text>
          </View>
          <View style={styles.findCareButton}>
            <Text style={styles.findCareButtonText}>Open</Text>
          </View>
        </Pressable>

        {!interpretationLimited ? (
          <>
            <MucusChart
              days={alignedDays}
              title="Your pattern this cycle"
            />
            <FertileTimeline cycle={cycle} />
          </>
        ) : null}
        <DailyLogList cycle={cycle} showInterpretation={!interpretationLimited} />
      </ScrollView>

      <Modal visible={showIntercoursePrompt} transparent animationType="fade" onDismiss={handlePromptDismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Export Cycle PDF</Text>
            <Text style={styles.modalBody}>Include intercourse markers in the export?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalBtnOutline}
                onPress={() => queueExport(false)}
              >
                <Text style={styles.modalBtnOutlineText}>No</Text>
              </Pressable>
              <Pressable
                style={styles.modalBtnFilled}
                onPress={() => queueExport(true)}
              >
                <Text style={styles.modalBtnFilledText}>Yes</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => setShowIntercoursePrompt(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function StatBox({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_PAGE },
  loadingText: { textAlign: 'center', marginTop: 100, color: TEXT_MUTED, fontSize: 15 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  headerSide: {
    width: 88,
    justifyContent: 'center',
  },
  headerSideRight: { alignItems: 'flex-end' },
  backBtn: { paddingRight: 8 },
  backArrow: { fontSize: 28, color: TEXT_PRIMARY, fontWeight: '300', lineHeight: 32 },
  headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  headerPrimary: {
    fontSize: 17,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    textAlign: 'center',
  },
  headerSecondary: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 2,
    textAlign: 'center',
  },
  exportBtn: {
    backgroundColor: ACCENT_WARM,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exportBtnDisabled: { opacity: 0.5 },
  exportBtnText: { color: BG_CARD, fontWeight: '600', fontSize: 13 },
  scrollContent: { paddingBottom: 32 },
  interpretationNotice: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: '#F7F0E8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  interpretationNoticeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  interpretationNoticeBody: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 21,
  },
  interpretationActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 14 },
  interpretationActionText: { fontSize: 13, fontWeight: '600', color: TEXT_PRIMARY },
  comparisonCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: BG_CARD,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  comparisonText: {
    fontSize: 15,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    lineHeight: 22,
  },
  findCareCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: BG_CARD,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 88,
  },
  findCareCardPressed: { opacity: 0.72 },
  findCareText: { flex: 1 },
  findCareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  findCareBody: {
    fontSize: 14,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  findCareButton: {
    minHeight: 44,
    minWidth: 64,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: ACCENT_WARM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  findCareButtonText: { color: BG_CARD, fontWeight: '600', fontSize: 14 },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: BG_CARD,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  statValue: { fontSize: 22, fontWeight: '600', color: TEXT_PRIMARY },
  statLabel: { fontSize: 11, color: TEXT_MUTED, marginTop: 2 },
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
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 8 },
  modalBody: { fontSize: 15, fontWeight: '400', color: TEXT_SECONDARY, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  modalButtons: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  modalBtnOutline: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER_CARD,
    alignItems: 'center',
  },
  modalBtnOutlineText: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
  modalBtnFilled: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: ACCENT_WARM,
    alignItems: 'center',
  },
  modalBtnFilledText: { fontSize: 15, fontWeight: '600', color: BG_CARD },
  modalCancel: { fontSize: 14, color: TEXT_MUTED, marginTop: 8 },
});
