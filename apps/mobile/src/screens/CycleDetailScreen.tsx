import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import {
  buildCalendarAlignedCycleDays,
  buildFirstReleasePossibleFertilePatternEligibility,
  buildPossibleFertilePatternPresentation,
} from 'core-rules-engine';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useCycleHistory } from '../hooks/useCycleHistory';
import { MucusChart } from '../components/MucusChart';
import { FertileTimeline } from '../components/FertileTimeline';
import { DailyLogList } from '../components/DailyLogList';
import { shouldShowRetrospectivePeakMarkers } from '../components/dayPresentationContract';
import { CycleStartResolutionCard } from '../components/CycleStartResolutionCard';
import { findCycleStartResolution } from '../components/cycleStartResolution';
import { buildCyclePdfHtml } from '../utils/exportCyclePdf';
import { formatCyclePrimarySecondary } from '../utils/cycleDisplay';
import { formatPossibleFertilePatternLimit } from '../utils/dateDisplay';
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

  const alignedDays = useMemo(
    () => (cycle ? buildCalendarAlignedCycleDays(cycle) : []),
    [cycle],
  );
  const cycleDayByDate = useMemo(
    () => Object.fromEntries(alignedDays.map((day) => [day.date, day.cycleDay])),
    [alignedDays],
  );

  const possibleFertilePattern = useMemo(
    () => (cycle
      ? buildPossibleFertilePatternPresentation(
          cycle.entries,
          cycle.result,
          buildFirstReleasePossibleFertilePatternEligibility(cycle.cycleBoundary),
        )
      : null),
    [cycle],
  );
  const cycleStartResolution = useMemo(
    () => (cycle ? findCycleStartResolution(cycle) : null),
    [cycle],
  );

  const handleExport = useCallback(async (includeIntercourse: boolean) => {
    if (!cycle) return;
    setExporting(true);
    try {
      const { primary, secondary } = formatCyclePrimarySecondary(cycle, cycles);
      const headerSubtitle = cycleStartResolution
        ? `${secondary} · Start date needs confirmation`
        : `${primary} · ${secondary} · ${cycle.length} days`;
      const html = buildCyclePdfHtml(cycle, includeIntercourse, { headerSubtitle });
      const { uri } = await Print.printToFileAsync({ html });
      await shareAsync(uri, { mimeType: 'application/pdf' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'An error occurred while exporting.';
      Alert.alert('Export Failed', msg);
    } finally {
      setExporting(false);
    }
  }, [cycle, cycles, cycleStartResolution]);

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

  const interpretationLimited =
    possibleFertilePattern?.interpretationStatus === 'blocked_by_missing' ||
    possibleFertilePattern?.interpretationStatus === 'review_recommended';
  const showDerivedMarkers = possibleFertilePattern
    ? shouldShowRetrospectivePeakMarkers(possibleFertilePattern)
    : false;
  const showFindCareNearTop =
    possibleFertilePattern?.interpretationStatus === 'review_recommended';
  const cycleStatusLabel = cycle.status === 'complete' ? 'Complete' : 'In progress';
  const headerPrimary = cycleStartResolution
    ? `Cycle ${cycle.cycleNumber}`
    : headerLabels.primary;
  const headerSecondary = cycleStartResolution
    ? `${cycleStatusLabel} · Start date needs confirmation`
    : `${headerLabels.secondary} · ${cycle.length} days · ${cycleStatusLabel}`;

  const findCareCard = (
    <Pressable
      style={({ pressed }) => [styles.findCareCard, pressed && styles.findCareCardPressed]}
      onPress={() => navigation.navigate('FindCare')}
      accessibilityRole="button"
      accessibilityLabel="Find care resources"
    >
      <View style={styles.findCareText}>
        <Text style={styles.findCareTitle}>
          {showFindCareNearTop ? 'Find charting support' : 'Find care'}
        </Text>
        <Text style={styles.findCareBody}>
          NaPro, NFP, and restorative care resources outside Well Within.
        </Text>
      </View>
      <View style={styles.findCareButton}>
        <Text style={styles.findCareButtonText}>Open</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.headerSide}
          accessibilityRole="button"
          accessibilityLabel="Back to cycle history"
        >
          <Text style={styles.backArrow}>{'‹'}</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerPrimary} numberOfLines={2}>{headerPrimary}</Text>
          <Text style={styles.headerSecondary}>{headerSecondary}</Text>
        </View>
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <Pressable
            style={[styles.exportBtn, exporting && styles.exportBtnDisabled]}
            onPress={() => setShowIntercoursePrompt(true)}
            disabled={exporting}
            accessibilityRole="button"
            accessibilityLabel="Export cycle PDF"
            accessibilityState={{ disabled: exporting }}
          >
            <Text style={styles.exportBtnText}>{exporting ? 'Exporting...' : 'Export'}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {interpretationLimited ? (
          <View style={styles.interpretationNotice}>
            <Text style={styles.interpretationNoticeTitle}>
              {possibleFertilePattern?.heading ?? 'A few days need context'}
            </Text>
            <Text style={styles.interpretationNoticeBody}>
              {possibleFertilePattern?.body
                ?? 'Keep charting. If you remember an open day, you can add it; days marked not observed stay part of your record.'}
            </Text>
            {possibleFertilePattern?.limit ? (
              <Text style={styles.interpretationNoticeDetail}>
                {formatPossibleFertilePatternLimit(possibleFertilePattern.limit)}
              </Text>
            ) : null}
            <View style={styles.interpretationActions}>
              <Pressable
                onPress={() =>
                  navigation.navigate('Help', { initialSection: 'status_messages' })
                }
                accessibilityRole="button"
                accessibilityLabel="Learn what this chart status means"
              >
                <Text style={styles.interpretationActionText}>Learn what this means</Text>
              </Pressable>
              {possibleFertilePattern?.interpretationStatus === 'review_recommended' ? (
                <Pressable
                  onPress={() => navigation.navigate('FindCare')}
                  accessibilityRole="button"
                  accessibilityLabel="Find charting support"
                >
                  <Text style={styles.interpretationActionText}>Find charting support</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}

        {showFindCareNearTop ? findCareCard : null}

        {cycleStartResolution ? (
          <CycleStartResolutionCard
            resolution={cycleStartResolution}
            onResolve={() => navigation.navigate('DailyEntry', {
              date: cycleStartResolution.date,
              existingEntry: true,
              intent: 'confirm_cycle_start',
            })}
          />
        ) : null}

        <MucusChart
          days={alignedDays}
          title="Recorded mucus pattern"
          showDerivedMarkers={showDerivedMarkers}
        />
        {!interpretationLimited && possibleFertilePattern && !cycleStartResolution ? (
          <FertileTimeline
            presentation={possibleFertilePattern}
            isCurrentCycle={cycle.cycleNumber === cycles[cycles.length - 1]?.cycleNumber}
            cycleStatus={cycle.status}
            cycleDayByDate={cycleDayByDate}
            onLearnMore={() =>
              navigation.navigate('Help', {
                initialSection: possibleFertilePattern.reason === 'later_peak_type_reopens_pattern'
                  ? 'peak_day'
                  : 'possible_fertile_pattern',
              })
            }
          />
        ) : null}
        <DailyLogList cycle={cycle} showDerivedMarkers={showDerivedMarkers} />
        {!showFindCareNearTop ? findCareCard : null}
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
                accessibilityRole="button"
                accessibilityLabel="Export without intercourse markers"
              >
                <Text style={styles.modalBtnOutlineText}>No</Text>
              </Pressable>
              <Pressable
                style={styles.modalBtnFilled}
                onPress={() => queueExport(true)}
                accessibilityRole="button"
                accessibilityLabel="Export with intercourse markers"
              >
                <Text style={styles.modalBtnFilledText}>Yes</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => setShowIntercoursePrompt(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancel export"
            >
              <Text style={styles.modalCancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  scrollContent: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    paddingBottom: 32,
  },
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
  interpretationNoticeDetail: {
    fontSize: 13,
    color: TEXT_MUTED,
    lineHeight: 19,
    marginTop: 8,
  },
  interpretationActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 14 },
  interpretationActionText: { fontSize: 13, fontWeight: '600', color: TEXT_PRIMARY },
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
