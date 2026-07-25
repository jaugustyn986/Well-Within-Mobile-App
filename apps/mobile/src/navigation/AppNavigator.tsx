import React, { useCallback, createContext, useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider } from '../context/AuthProvider';
import { SyncProvider } from '../context/SyncProvider';
import { CalendarScreen } from '../screens/CalendarScreen';
import { TimelineScreen } from '../screens/TimelineScreen';
import { CycleHistoryScreen } from '../screens/CycleHistoryScreen';
import { CycleDetailScreen } from '../screens/CycleDetailScreen';
import { DailyEntryScreen } from '../screens/DailyEntryScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { FindCareScreen } from '../screens/FindCareScreen';
import { EngineDemoScreen } from '../screens/EngineDemoScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { CatchUpMissingDaysScreen } from '../screens/CatchUpMissingDaysScreen';
import { TEXT_PRIMARY } from '../theme/colors';

export type RootStackParamList = {
  Calendar: undefined;
  Timeline: undefined;
  CycleHistory: undefined;
  CycleDetail: { cycleNumber: number };
  DailyEntry: {
    date: string;
    existingEntry?: boolean;
    intent?: 'confirm_cycle_start' | 'add_observation';
  };
  CatchUpMissingDays: undefined;
  Help: {
    initialSection?: 'peak_day' | 'status_messages' | 'possible_fertile_pattern';
  } | undefined;
  FindCare: undefined;
  Settings: undefined;
  Auth: undefined;
  EngineDemo: undefined;
};

const ONBOARDING_KEY = 'well_within_onboarding_done';
const ONBOARDING_KEY_LEGACY = 'holistic_cycle_onboarding_done';
const Stack = createNativeStackNavigator<RootStackParamList>();

type OnboardingContextValue = { resetOnboarding: () => void };
const OnboardingContext = createContext<OnboardingContextValue | null>(null);

function CalendarHeaderAction({ onPress }: { onPress: () => void }): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Return to Calendar"
      style={({ pressed }) => [styles.calendarHeaderAction, pressed && styles.pressed]}
    >
      <Text style={styles.calendarHeaderActionText}>{'‹ Calendar'}</Text>
    </Pressable>
  );
}

export function useResetOnboarding(): OnboardingContextValue | null {
  return useContext(OnboardingContext);
}

WebBrowser.maybeCompleteAuthSession();

export function AppNavigator(): React.JSX.Element {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      if (val === 'true') {
        setShowOnboarding(false);
        return;
      }
      AsyncStorage.getItem(ONBOARDING_KEY_LEGACY).then((legacyVal) => {
        if (legacyVal === 'true') {
          AsyncStorage.setItem(ONBOARDING_KEY, 'true');
          setShowOnboarding(false);
        } else {
          setShowOnboarding(true);
        }
      });
    });
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  }, []);

  const resetOnboarding = useCallback(() => {
    void AsyncStorage.removeItem(ONBOARDING_KEY).then(() => AsyncStorage.removeItem(ONBOARDING_KEY_LEGACY));
    setShowOnboarding(true);
  }, []);

  if (showOnboarding === null) return <></>;

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <AuthProvider>
    <SyncProvider>
    <OnboardingContext.Provider value={{ resetOnboarding }}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calendar">
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Timeline"
          component={TimelineScreen}
          options={{ title: 'Timeline' }}
        />
        <Stack.Screen
          name="CycleHistory"
          component={CycleHistoryScreen}
          options={{ title: 'Cycle History' }}
        />
        <Stack.Screen
          name="CycleDetail"
          component={CycleDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DailyEntry"
          component={DailyEntryScreen}
          options={{
            title: 'New Entry',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="CatchUpMissingDays"
          component={CatchUpMissingDaysScreen}
          options={{
            title: 'Catch Up',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={({ navigation }) => ({
            title: 'Understanding Your Chart',
            headerLeft: () => (
              <CalendarHeaderAction onPress={() => navigation.popToTop()} />
            ),
          })}
        />
        <Stack.Screen
          name="FindCare"
          component={FindCareScreen}
          options={({ navigation }) => ({
            title: 'Find Care',
            headerLeft: () => (
              <CalendarHeaderAction onPress={() => navigation.popToTop()} />
            ),
          })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: 'Sign in with email' }}
        />
        <Stack.Screen
          name="EngineDemo"
          component={EngineDemoScreen}
          options={{ title: 'Engine Demo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </OnboardingContext.Provider>
    </SyncProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  calendarHeaderAction: {
    minHeight: 44,
    justifyContent: 'center',
    paddingRight: 12,
  },
  calendarHeaderActionText: {
    color: TEXT_PRIMARY,
    fontSize: 15,
    fontWeight: '600',
  },
  pressed: { opacity: 0.55 },
});
