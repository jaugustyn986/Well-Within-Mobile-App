import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BG_CARD, BORDER_CARD, ACCENT_WARM, TEXT_SECONDARY, TEXT_SUBTLE } from '../theme/colors';

export type TabKey = 'calendar' | 'history';

interface Props {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function SegmentedToggle({ activeTab, onTabChange }: Props): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <Pressable
          style={[styles.tab, activeTab === 'calendar' && styles.tabActive]}
          onPress={() => onTabChange('calendar')}
        >
          <Text style={[styles.tabIcon, activeTab === 'calendar' && styles.tabIconActive]}>📅</Text>
          <Text style={[styles.tabLabel, activeTab === 'calendar' && styles.tabLabelActive]}>
            Calendar
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => onTabChange('history')}
        >
          <Text style={[styles.tabIcon, activeTab === 'history' && styles.tabIconActive]}>🕐</Text>
          <Text style={[styles.tabLabel, activeTab === 'history' && styles.tabLabelActive]}>
            Cycle History
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  pill: {
    flexDirection: 'row',
    backgroundColor: BG_CARD,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    padding: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 22,
    gap: 6,
  },
  tabActive: {
    backgroundColor: ACCENT_WARM,
  },
  tabIcon: { fontSize: 14, color: TEXT_SUBTLE },
  tabIconActive: { opacity: 1 },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_SECONDARY,
  },
  tabLabelActive: {
    color: BG_CARD,
  },
});
