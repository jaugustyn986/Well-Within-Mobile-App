import React, { useCallback, useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  buildCalendarAlignedCycleDays,
  buildFirstReleasePossibleFertilePatternEligibility,
  buildPossibleFertilePatternPresentation,
} from 'core-rules-engine';
import { useCycleHistory } from '../hooks/useCycleHistory';
import { useCurrentCycleSummaryFromCycles } from '../hooks/useCurrentCycleSummary';
import { MucusChart } from '../components/MucusChart';
import { StatusBanner } from '../components/StatusBanner';
import { shouldShowRetrospectivePeakMarkers } from '../components/dayPresentationContract';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Timeline'>;

export function TimelineScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const cycleHistory = useCycleHistory();
  const cycleSummary = useCurrentCycleSummaryFromCycles(cycleHistory.cycles);
  const currentCycle = cycleHistory.cycles[cycleHistory.cycles.length - 1] ?? null;
  const alignedDays = useMemo(
    () => (currentCycle ? buildCalendarAlignedCycleDays(currentCycle) : []),
    [currentCycle],
  );
  const showDerivedMarkers = useMemo(() => {
    if (!currentCycle) return false;
    const presentation = buildPossibleFertilePatternPresentation(
      currentCycle.entries,
      currentCycle.result,
      buildFirstReleasePossibleFertilePatternEligibility(currentCycle.cycleBoundary),
    );
    return shouldShowRetrospectivePeakMarkers(presentation);
  }, [currentCycle]);

  useFocusEffect(
    useCallback(() => {
      cycleHistory.refresh();
    }, [cycleHistory.refresh]),
  );

  if (cycleHistory.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!currentCycle) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.empty}>No entries yet. Start charting to see your timeline.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <StatusBanner
          summary={cycleSummary}
          onUnderstandStatus={() =>
            navigation.navigate('Help', {
              initialSection: cycleSummary.explanationTarget ?? 'status_messages',
            })
          }
          onFindChartingSupport={() => navigation.navigate('FindCare')}
        />
        <MucusChart days={alignedDays} showDerivedMarkers={showDerivedMarkers} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loading: { textAlign: 'center', marginTop: 100, color: '#94a3b8', fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 100, color: '#94a3b8', fontSize: 14, paddingHorizontal: 32 },
});
