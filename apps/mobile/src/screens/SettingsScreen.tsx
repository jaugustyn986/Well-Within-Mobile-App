import React, { useCallback, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import { shareAsync } from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FeedbackModal } from '../components/feedback/FeedbackModal';
import {
  getAccountDataConfirmation,
  type AccountDataAction,
} from '../components/accountDataConfirmation';
import { useCycleHistory } from '../hooks/useCycleHistory';
import { getAllEntries, clearAllEntries } from '../services/storageV2';
import { deleteBackedUpChartData, deleteCurrentAccount } from '../services/accountData';
import { useAuth } from '../context/AuthProvider';
import { useSync } from '../context/SyncProvider';
import { hasSupabaseEnv } from '../config/env';
import { LineIcon, type IconName } from '../components/LineIcon';
import { buildDataExport } from '../utils/exportData';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  BG_PAGE, BG_CARD,
  TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED,
  BORDER_CARD, ACCENT_RED, ACCENT_WARM, ACCENT_WARM_TINT,
} from '../theme/colors';

const APP_VERSION = Constants.expoConfig?.version ?? '0.1.0';

const PRIVACY_ITEMS: { icon: IconName; text: string }[] = [
  { icon: 'device', text: 'Your chart is stored on this device by default. Sign in only if you want optional cloud backup.' },
  { icon: 'analytics', text: 'Pattern calculations happen in the app using the observations you record.' },
  { icon: 'shield', text: 'Feedback is optional. Cycle context is included only when you turn it on.' },
  { icon: 'shield', text: 'No third-party ad tracking is used' },
  { icon: 'lock', text: 'You can clear, delete, or export your data at any time.' },
];

type SettingsNav = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export function SettingsScreen(): React.JSX.Element {
  const navigation = useNavigation<SettingsNav>();
  const auth = useAuth();
  const sync = useSync();
  const [pendingDataAction, setPendingDataAction] = useState<AccountDataAction | null>(null);
  const [processingDataAction, setProcessingDataAction] = useState<AccountDataAction | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const showBackupSync = hasSupabaseEnv();
  const { cycles: feedbackCycles } = useCycleHistory();

  const handleExportJson = useCallback(async () => {
    setExporting(true);
    try {
      const entries = await getAllEntries();
      const json = JSON.stringify(buildDataExport(entries), null, 2);
      const fileUri = FileSystem.cacheDirectory + 'well-within-data.json';
      await FileSystem.writeAsStringAsync(fileUri, json);
      await shareAsync(fileUri, { mimeType: 'application/json' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not export data.';
      Alert.alert('Export Failed', msg);
    } finally {
      setExporting(false);
    }
  }, []);

  const handleConfirmedDataAction = useCallback(async () => {
    const action = pendingDataAction;
    if (!action) return;
    const confirmation = getAccountDataConfirmation(action, Boolean(auth?.user));
    setPendingDataAction(null);
    setProcessingDataAction(action);
    try {
      if (action === 'local') {
        await clearAllEntries();
      } else {
        const result = action === 'cloud'
          ? await deleteBackedUpChartData()
          : await deleteCurrentAccount();
        if (result.error) {
          Alert.alert('Could Not Complete Deletion', result.error);
          return;
        }
      }
      Alert.alert(confirmation.successTitle, confirmation.successBody);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not clear data.';
      Alert.alert('Error', msg);
    } finally {
      setProcessingDataAction(null);
    }
  }, [auth?.user, pendingDataAction]);

  const confirmation = pendingDataAction
    ? getAccountDataConfirmation(pendingDataAction, Boolean(auth?.user))
    : null;

  const formatSyncTime = (iso: string | null) => {
    if (!iso) return 'Not synced yet';
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {showBackupSync && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Backup & Sync</Text>
          <Text style={styles.sectionSubtitle}>
            Keep using the app without an account, or sign in if you want optional cloud backup.
          </Text>
          {auth?.user ? (
            <>
              <Text style={styles.syncStatus}>
                {auth.user.email ? `Signed in as ${auth.user.email}` : 'Signed in'}
              </Text>
              <Text style={styles.syncMeta}>
                Last sync: {formatSyncTime(sync?.lastSyncedAt ?? null)}
              </Text>
              {sync?.lastSyncError ? (
                <Text style={styles.syncError}>{sync.lastSyncError}</Text>
              ) : null}
              <Pressable
                style={[styles.actionRow, { marginTop: 12 }]}
                onPress={() => void sync?.syncNow?.()}
                disabled={sync?.isSyncing}
                accessibilityRole="button"
                accessibilityLabel="Sync now"
                accessibilityState={{ disabled: sync?.isSyncing }}
              >
                <View style={styles.actionLeft}>
                  <View style={styles.actionIconCircle}>
                    <Text style={styles.actionIconText}>{'↻'}</Text>
                  </View>
                  <View>
                    <Text style={styles.actionTitle}>
                      {sync?.isSyncing ? 'Syncing...' : 'Sync now'}
                    </Text>
                  </View>
                </View>
              </Pressable>
              <Pressable
                style={[styles.actionRow, styles.dangerRow]}
                onPress={() => void auth?.signOut?.()}
                accessibilityRole="button"
                accessibilityLabel="Sign out"
              >
                <View style={styles.actionLeft}>
                  <Text style={[styles.actionTitle, styles.dangerText]}>Sign out</Text>
                </View>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={styles.actionRow}
              onPress={() => navigation.navigate('Auth')}
              accessibilityRole="button"
              accessibilityLabel="Sign in with email for optional cloud backup"
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIconCircle}>
                  <Text style={styles.actionIconText}>{'↑'}</Text>
                </View>
                <View>
                  <Text style={styles.actionTitle}>Sign in with email</Text>
                  <Text style={styles.actionSub}>Back up your data with a free account</Text>
                </View>
              </View>
              <Text style={styles.actionChevron}>{'›'}</Text>
            </Pressable>
          )}
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <Text style={styles.sectionSubtitle}>How your data works</Text>
        {PRIVACY_ITEMS.map((item, i) => (
          <View key={i} style={styles.privacyRow}>
            <LineIcon name={item.icon} size={20} />
            <Text style={styles.privacyText}>{item.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Care</Text>
        <Text style={styles.sectionSubtitle}>Outside resources</Text>
        <Pressable
          style={styles.actionRow}
          onPress={() => navigation.navigate('FindCare')}
          accessibilityRole="button"
          accessibilityLabel="Find care resources"
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconCircle}>
              <Text style={styles.actionIconText}>{'+'}</Text>
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Find Care</Text>
              <Text style={styles.actionSub}>NaPro, NFP, and restorative-care links</Text>
            </View>
          </View>
          <Text style={styles.actionChevron}>{'›'}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <Pressable
          style={styles.actionRow}
          onPress={handleExportJson}
          disabled={exporting}
          accessibilityRole="button"
          accessibilityLabel="Export data as JSON"
          accessibilityState={{ disabled: exporting }}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconCircle}>
              <Text style={styles.actionIconText}>{'↓'}</Text>
            </View>
            <View>
              <Text style={styles.actionTitle}>{exporting ? 'Exporting...' : 'Export Data'}</Text>
              <Text style={styles.actionSub}>Download your data as JSON</Text>
            </View>
          </View>
          <Text style={styles.actionChevron}>{'›'}</Text>
        </Pressable>

        <Pressable
          style={[styles.actionRow, styles.dangerRow]}
          onPress={() => setPendingDataAction('local')}
          disabled={processingDataAction !== null}
          accessibilityRole="button"
          accessibilityLabel={auth?.user ? 'Clear data from this device' : 'Clear all data'}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIconCircle, styles.dangerIconCircle]}>
              <Text style={styles.dangerIconText}>{'×'}</Text>
            </View>
            <View style={styles.actionText}>
              <Text style={[styles.actionTitle, styles.dangerText]}>
                {processingDataAction === 'local'
                  ? 'Clearing...'
                  : auth?.user ? 'Clear Data From This Device' : 'Clear All Data'}
              </Text>
              <Text style={styles.actionSub}>
                {auth?.user
                  ? 'Remove local observations; backed-up data is not deleted'
                  : 'Remove all observations and cycle history'}
              </Text>
            </View>
          </View>
          <Text style={styles.actionChevron}>{'›'}</Text>
        </Pressable>

        {auth?.user ? (
          <>
            <Pressable
              style={[styles.actionRow, styles.dangerRow]}
              onPress={() => setPendingDataAction('cloud')}
              disabled={processingDataAction !== null}
              accessibilityRole="button"
              accessibilityLabel="Delete backed-up chart data"
            >
              <View style={styles.actionLeft}>
                <View style={[styles.actionIconCircle, styles.dangerIconCircle]}>
                  <Text style={styles.dangerIconText}>{'×'}</Text>
                </View>
                <View style={styles.actionText}>
                  <Text style={[styles.actionTitle, styles.dangerText]}>
                    {processingDataAction === 'cloud' ? 'Deleting Chart Data...' : 'Delete Backed-Up Chart Data'}
                  </Text>
                  <Text style={styles.actionSub}>Permanently remove chart data across your signed-in devices</Text>
                </View>
              </View>
              <Text style={styles.actionChevron}>{'›'}</Text>
            </Pressable>

            <Pressable
              style={[styles.actionRow, styles.dangerRow]}
              onPress={() => setPendingDataAction('account')}
              disabled={processingDataAction !== null}
              accessibilityRole="button"
              accessibilityLabel="Permanently delete account"
            >
              <View style={styles.actionLeft}>
                <View style={[styles.actionIconCircle, styles.dangerIconCircle]}>
                  <Text style={styles.dangerIconText}>{'×'}</Text>
                </View>
                <View style={styles.actionText}>
                  <Text style={[styles.actionTitle, styles.dangerText]}>
                    {processingDataAction === 'account' ? 'Deleting Account...' : 'Delete Account'}
                  </Text>
                  <Text style={styles.actionSub}>Permanently remove your account and associated data</Text>
                </View>
              </View>
              <Text style={styles.actionChevron}>{'›'}</Text>
            </Pressable>
          </>
        ) : null}
      </View>

      {showBackupSync ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          <Pressable
            style={styles.actionRow}
            onPress={() => setShowFeedbackModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Send feedback"
          >
            <View style={styles.actionLeft}>
              <View style={styles.actionIconCircle}>
                <Text style={styles.actionIconText}>{'✉'}</Text>
              </View>
              <View>
                <Text style={styles.actionTitle}>Send Feedback</Text>
              </View>
            </View>
            <Text style={styles.actionChevron}>{'›'}</Text>
          </Pressable>
        </View>
      ) : null}

      <Text style={styles.versionText}>Well Within  ·  v{APP_VERSION}</Text>

      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        sourceScreen="Settings"
        cycles={feedbackCycles}
      />

      <Modal
        visible={confirmation !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingDataAction(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{confirmation?.title}</Text>
            <Text style={styles.modalBody}>{confirmation?.body}</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalBtnOutline}
                onPress={() => setPendingDataAction(null)}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={styles.modalBtnOutlineText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.modalBtnDanger}
                onPress={handleConfirmedDataAction}
                accessibilityRole="button"
                accessibilityLabel={confirmation?.confirmLabel ?? 'Confirm deletion'}
              >
                <Text style={styles.modalBtnDangerText}>{confirmation?.confirmLabel}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: BG_PAGE },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: BG_CARD,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 2 },
  sectionSubtitle: { fontSize: 14, color: TEXT_MUTED, marginBottom: 16 },
  privacyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  privacyText: { fontSize: 15, fontWeight: '400', color: TEXT_SECONDARY, flex: 1, lineHeight: 22 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: BORDER_CARD,
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  actionText: { flex: 1 },
  actionIconCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: ACCENT_WARM_TINT,
    justifyContent: 'center', alignItems: 'center',
  },
  actionIconText: { fontSize: 18, color: ACCENT_WARM, fontWeight: '600' },
  dangerIconCircle: { backgroundColor: '#fff1f2' },
  dangerIconText: { fontSize: 20, color: ACCENT_RED, fontWeight: '600' },
  actionTitle: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
  actionSub: { fontSize: 12, color: TEXT_MUTED, marginTop: 1 },
  actionChevron: { fontSize: 20, color: TEXT_MUTED },
  dangerRow: { borderTopWidth: 0, marginTop: 4 },
  dangerText: { color: ACCENT_RED },
  syncStatus: { fontSize: 15, color: TEXT_PRIMARY, marginBottom: 4 },
  syncMeta: { fontSize: 13, color: TEXT_MUTED, marginBottom: 4 },
  syncError: { fontSize: 13, color: ACCENT_RED, marginBottom: 8 },
  versionText: {
    fontSize: 13, color: TEXT_MUTED, textAlign: 'center', marginTop: 12,
  },
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
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 10 },
  modalBody: { fontSize: 15, fontWeight: '400', color: TEXT_SECONDARY, lineHeight: 22, marginBottom: 24 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalBtnOutline: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER_CARD,
    alignItems: 'center',
  },
  modalBtnOutlineText: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
  modalBtnDanger: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: ACCENT_RED,
    alignItems: 'center',
  },
  modalBtnDangerText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
});
