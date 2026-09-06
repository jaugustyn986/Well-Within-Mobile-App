import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { compareIsoDate } from 'core-rules-engine';
import type { DailyEntry } from 'core-rules-engine';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { EntryForm } from '../components/EntryForm';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  entriesToSortedArray,
  getAllEntries,
  saveDailyEntry,
  type StoredEntries,
} from '../services/storageV2';
import { useSync } from '../context/SyncProvider';
import { buildCurrentCycleCatchUpDates, formatCatchUpCount } from '../utils/catchUpDays';
import {
  ACCENT_WARM,
  ACCENT_WARM_TINT,
  BG_CARD,
  BG_PAGE,
  BORDER_CARD,
  TEXT_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_SUBTLE,
} from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'CatchUpMissingDays'>;

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function previousDateString(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00');
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function displayShortDate(isoDate: string): string {
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function nextDateAfter(currentDate: string, dates: string[]): string | null {
  return dates.find((date) => compareIsoDate(date, currentDate) > 0) ?? dates[0] ?? null;
}

export function CatchUpMissingDaysScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const sync = useSync();
  const asOfDate = useMemo(() => todayString(), []);
  const [entries, setEntries] = useState<StoredEntries>({});
  const [catchUpDates, setCatchUpDates] = useState<string[]>([]);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [initialCount, setInitialCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const loadCatchUpDates = useCallback(async (preferredNextDate?: string | null) => {
    const stored = await getAllEntries();
    const sorted = entriesToSortedArray(stored);
    const dates = buildCurrentCycleCatchUpDates(sorted, stored, asOfDate);

    setEntries(stored);
    setCatchUpDates(dates);
    setInitialCount((prev) => (prev === 0 ? dates.length : prev));
    setActiveDate((current) => {
      if (preferredNextDate && dates.includes(preferredNextDate)) return preferredNextDate;
      if (current && dates.includes(current)) return current;
      return dates[0] ?? null;
    });
    setLoaded(true);
  }, [asOfDate]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Done</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    void loadCatchUpDates();
  }, [loadCatchUpDates]);

  const activeEntry = activeDate ? entries[activeDate] ?? null : null;
  const previousDayEntry = activeDate ? entries[previousDateString(activeDate)] ?? null : null;
  const remainingCount = catchUpDates.length;
  const handledCount = Math.max(0, initialCount - remainingCount);
  const progressLabel = initialCount > 0
    ? `${Math.min(handledCount + 1, initialCount)} of ${initialCount}`
    : '';

  const handleSave = useCallback(async (entry: DailyEntry) => {
    if (!activeDate) return;
    await saveDailyEntry(activeDate, entry);
    void sync?.syncNow();

    const stored = await getAllEntries();
    const sorted = entriesToSortedArray(stored);
    const dates = buildCurrentCycleCatchUpDates(sorted, stored, asOfDate);
    const nextDate = nextDateAfter(activeDate, dates);

    setEntries(stored);
    setCatchUpDates(dates);
    setActiveDate(nextDate);
  }, [activeDate, asOfDate, sync]);

  const handleSkip = useCallback(() => {
    if (!activeDate) return;
    const nextDate = nextDateAfter(activeDate, catchUpDates.filter((date) => date !== activeDate));
    if (nextDate) {
      setActiveDate(nextDate);
    } else {
      navigation.goBack();
    }
  }, [activeDate, catchUpDates, navigation]);

  if (!loaded) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.loading}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!activeDate) {
    return (
      <SafeAreaView style={styles.centered}>
        <View style={styles.completeCard}>
          <Text style={styles.completeTitle}>Your chart is up to date.</Text>
          <Text style={styles.completeText}>
            All open days in this cycle are handled. Your calendar and summary will reflect the updates.
          </Text>
          <Pressable style={styles.doneButton} onPress={() => navigation.goBack()}>
            <Text style={styles.doneButtonText}>Back to calendar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressCard}>
        <View style={styles.progressTopRow}>
          <Text style={styles.eyebrow}>{progressLabel}</Text>
          <Text style={styles.remaining}>{formatCatchUpCount(remainingCount)} open</Text>
        </View>
        <Text style={styles.title}>Catch up on open days</Text>
        <Text style={styles.description}>
          Add what you remember for {displayShortDate(activeDate)}, or mark the day as not observed.
        </Text>
        <View style={styles.dateRow}>
          {catchUpDates.slice(0, 6).map((date) => (
            <View key={date} style={[styles.datePill, date === activeDate && styles.datePillActive]}>
              <Text style={[styles.datePillText, date === activeDate && styles.datePillTextActive]}>
                {displayShortDate(date)}
              </Text>
            </View>
          ))}
        </View>
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip this day for now</Text>
        </Pressable>
      </View>

      <EntryForm
        key={activeDate}
        initialEntry={activeEntry}
        previousDayEntry={previousDayEntry}
        date={activeDate}
        onSave={handleSave}
        saveLabel={remainingCount > 1 ? 'Save and continue' : 'Save and finish'}
        showMarkMissingButton
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_PAGE },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG_PAGE,
    padding: 24,
  },
  loading: { color: TEXT_MUTED, fontSize: 15 },
  headerButton: { paddingHorizontal: 4, paddingVertical: 8 },
  headerButtonText: { fontSize: 16, fontWeight: '500', color: TEXT_SECONDARY },
  progressCard: {
    backgroundColor: BG_CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_CARD,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eyebrow: {
    color: TEXT_SUBTLE,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  remaining: { color: TEXT_MUTED, fontSize: 12, fontWeight: '500' },
  title: { color: TEXT_PRIMARY, fontSize: 20, fontWeight: '600' },
  description: { color: TEXT_SUBTLE, fontSize: 14, lineHeight: 20, marginTop: 4 },
  dateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  datePill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    backgroundColor: BG_PAGE,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  datePillActive: { backgroundColor: ACCENT_WARM_TINT, borderColor: ACCENT_WARM },
  datePillText: { color: TEXT_SUBTLE, fontSize: 11, fontWeight: '500' },
  datePillTextActive: { color: TEXT_PRIMARY },
  skipButton: { alignSelf: 'flex-start', marginTop: 10, paddingVertical: 4 },
  skipText: { color: TEXT_SUBTLE, fontSize: 13, fontWeight: '500' },
  completeCard: {
    backgroundColor: BG_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    padding: 18,
    width: '100%',
  },
  completeTitle: { color: TEXT_PRIMARY, fontSize: 20, fontWeight: '600' },
  completeText: { color: TEXT_SUBTLE, fontSize: 14, lineHeight: 21, marginTop: 8 },
  doneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: ACCENT_WARM,
    marginTop: 18,
  },
  doneButtonText: { color: BG_CARD, fontSize: 15, fontWeight: '600' },
});
