import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Pressable, Text } from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { EntryForm } from '../components/EntryForm';
import { DailyEntry } from 'core-rules-engine';
import { getDailyEntry, saveDailyEntry, deleteEntry } from '../services/storageV2';
import { TEXT_SECONDARY } from '../theme/colors';

type ScreenRoute = RouteProp<RootStackParamList, 'DailyEntry'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'DailyEntry'>;

export function DailyEntryScreen(): JSX.Element {
  const route = useRoute<ScreenRoute>();
  const navigation = useNavigation<Nav>();
  const { date } = route.params;

  const [existing, setExisting] = useState<DailyEntry | null>(null);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={{ paddingHorizontal: 4, paddingVertical: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: TEXT_SECONDARY }}>Cancel</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    getDailyEntry(date).then((entry) => {
      setExisting(entry);
      setLoaded(true);
    });
  }, [date]);

  const handleSave = useCallback(async (entry: DailyEntry) => {
    await saveDailyEntry(date, entry);
    navigation.goBack();
  }, [date, navigation]);

  const handleDelete = useCallback(async () => {
    await deleteEntry(date);
    navigation.goBack();
  }, [date, navigation]);

  if (!loaded) return <></>;

  return (
    <EntryForm
      initialEntry={existing}
      date={date}
      onSave={handleSave}
      onDelete={existing ? handleDelete : undefined}
    />
  );
}
