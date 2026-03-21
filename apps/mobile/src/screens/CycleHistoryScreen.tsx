import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useCycleHistory } from '../hooks/useCycleHistory';
import { CycleSummaryPanel } from '../components/CycleSummaryPanel';
import { PatternInsights } from '../components/PatternInsights';
import { PeakAlignedOverlay } from '../components/PeakAlignedOverlay';
import { CycleCard } from '../components/CycleCard';
import { LineIcon } from '../components/LineIcon';
import { BG_PAGE, TEXT_MUTED, TEXT_PRIMARY } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CycleHistory'>;

export function CycleHistoryScreen(): JSX.Element {
  const navigation = useNavigation<Nav>();
  const { cycles, summary, insights, loading, refresh } = useCycleHistory();

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const goToDetail = useCallback(
    (cycleNumber: number) => navigation.navigate('CycleDetail', { cycleNumber }),
    [navigation],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (cycles.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={{ marginBottom: 16 }}>
            <LineIcon name="chart" size={48} />
          </View>
          <Text style={styles.emptyTitle}>Cycle History</Text>
          <Text style={styles.emptyText}>
            Your cycles will show here once you begin charting.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const reversedCycles = [...cycles].reverse();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CycleSummaryPanel summary={summary} />
        <PatternInsights insights={insights} />
        <PeakAlignedOverlay cycles={cycles} onCyclePress={goToDetail} />

        <View style={styles.cardsSection}>
          <Text style={styles.cardsHeading}>Your Cycles</Text>
          {reversedCycles.map((c) => (
            <CycleCard
              key={c.cycleNumber}
              cycle={c}
              allCycles={cycles}
              onPress={() => goToDetail(c.cycleNumber)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_PAGE },
  loading: { textAlign: 'center', marginTop: 100, color: TEXT_MUTED, fontSize: 15 },
  scrollContent: { paddingBottom: 32 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 21, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 8 },
  emptyText: { fontSize: 15, fontWeight: '400', color: TEXT_MUTED, textAlign: 'center', lineHeight: 22 },
  cardsSection: { marginHorizontal: 16, marginTop: 24 },
  cardsHeading: { fontSize: 21, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 8 },
});
