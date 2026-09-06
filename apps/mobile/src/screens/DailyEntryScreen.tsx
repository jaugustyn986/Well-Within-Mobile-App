import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Pressable, Text } from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { EntryForm } from '../components/EntryForm';
import { DailyEntry } from 'core-rules-engine';
import {
  getAllEntries,
  getDailyEntry,
  saveDailyEntry,
  deleteEntry,
} from '../services/storageV2';
import { queueFirstSaveAcknowledgement } from '../features/guidedChartLearning/guidedChartLearningStorage';
import { useSync } from '../context/SyncProvider';
import { TEXT_SECONDARY } from '../theme/colors';

type ScreenRoute = RouteProp<RootStackParamList, 'DailyEntry'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'DailyEntry'>;

function previousDateString(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00');
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DailyEntryScreen(): React.JSX.Element {
  const route = useRoute<ScreenRoute>();
  const navigation = useNavigation<Nav>();
  const sync = useSync();
  const { date, intent } = route.params;
  const confirmingCycleStart = intent === 'confirm_cycle_start';
  const startAddingObservation = intent === 'add_observation';

  const [existing, setExisting] = useState<DailyEntry | null>(null);
  const [previousDayEntry, setPreviousDayEntry] = useState<DailyEntry | null>(null);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: confirmingCycleStart ? 'Confirm Cycle Start' : 'New Entry',
      headerRight: () => (
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={{ paddingHorizontal: 4, paddingVertical: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: TEXT_SECONDARY }}>Cancel</Text>
        </Pressable>
      ),
    });
  }, [confirmingCycleStart, navigation]);

  useEffect(() => {
    Promise.all([
      getDailyEntry(date),
      getDailyEntry(previousDateString(date)),
    ]).then(([entry, prevEntry]) => {
      setExisting(entry);
      setPreviousDayEntry(prevEntry);
      setLoaded(true);
    });
  }, [date]);

  const handleSave = useCallback(async (entry: DailyEntry) => {
    let entriesBeforeSave: Record<string, DailyEntry> = {};
    try {
      entriesBeforeSave = await getAllEntries();
    } catch {
      // The normal save remains authoritative if optional presentation-state
      // discovery cannot read the prior chart.
    }
    await saveDailyEntry(date, entry);
    try {
      await queueFirstSaveAcknowledgement({
        entriesBeforeSave,
        savedDate: date,
        previousEntry: existing,
        savedEntry: entry,
      });
    } catch {
      // The entry is already saved. Presentation-state failure must never block
      // the established return-to-Calendar flow or sync.
    }
    void sync?.syncNow();
    navigation.goBack();
  }, [date, existing, navigation, sync]);

  const handleDelete = useCallback(async () => {
    await deleteEntry(date);
    void sync?.syncNow();
    navigation.goBack();
  }, [date, navigation, sync]);

  if (!loaded) return <></>;

  return (
    <EntryForm
      initialEntry={existing}
      previousDayEntry={previousDayEntry}
      date={date}
      onSave={handleSave}
      onDelete={existing ? handleDelete : undefined}
      cycleStartReview={confirmingCycleStart}
      startAddingObservation={startAddingObservation}
      saveLabel={confirmingCycleStart ? 'Save cycle start' : undefined}
    />
  );
}
