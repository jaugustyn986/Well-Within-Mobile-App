import React, { useCallback, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  ACCENT_WARM,
  ACCENT_WARM_TINT,
  BG_CARD,
  BG_MISSING,
  BG_PAGE,
  BORDER_CARD,
  TEXT_MUTED,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_SUBTLE,
} from '../theme/colors';

interface CareResource {
  title: string;
  subtitle: string;
  domain: string;
  url: string;
}

const RESOURCES: CareResource[] = [
  {
    title: 'NaPro / FertilityCare',
    subtitle: 'Find centers and resources related to chart-based care.',
    domain: 'fertilitycare.org',
    url: 'https://www.fertilitycare.org/find-a-center/',
  },
  {
    title: 'NFP instruction',
    subtitle: 'Find instructors for natural family planning.',
    domain: 'usccb.org',
    url: 'https://www.usccb.org/topics/natural-family-planning/nfp-national-providers',
  },
  {
    title: 'Restorative care',
    subtitle: 'Search a directory for FABM-aware clinicians.',
    domain: 'naturalwomanhood.org',
    url: 'https://naturalwomanhood.org/find-a-doctor/',
  },
  {
    title: 'FABM professionals',
    subtitle: 'Browse educators and clinicians familiar with fertility awareness.',
    domain: 'factsaboutfertility.org',
    url: 'https://www.factsaboutfertility.org/physician-clinician-educator-directory/',
  },
];

export function FindCareScreen(): JSX.Element {
  const [externalOpenConfirmed, setExternalOpenConfirmed] = useState(false);
  const [pendingResource, setPendingResource] = useState<CareResource | null>(null);

  const openResource = useCallback(async (resource: CareResource) => {
    try {
      await WebBrowser.openBrowserAsync(resource.url);
    } catch (e: unknown) {
      Alert.alert(
        'Link did not open',
        'You can try again in a moment.',
        [{ text: 'Close', style: 'cancel' }],
      );
    }
  }, []);

  const handleResourcePress = useCallback((resource: CareResource) => {
    if (externalOpenConfirmed) {
      void openResource(resource);
      return;
    }

    setPendingResource(resource);
  }, [externalOpenConfirmed, openResource]);

  const handleConfirmOpen = useCallback(() => {
    if (!pendingResource) return;
    const resource = pendingResource;
    setExternalOpenConfirmed(true);
    setPendingResource(null);
    void openResource(resource);
  }, [openResource, pendingResource]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>NaPro and NFP support</Text>
      <Text style={styles.intro}>
        These outside resources can help you look for charting instruction or restorative
        reproductive care.
      </Text>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Private by design</Text>
        <Text style={styles.noticeText}>
          Well Within does not send your chart or personal data to these sites.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Care resources</Text>

      {RESOURCES.map((resource) => (
        <Pressable
          key={resource.url}
          style={({ pressed }) => [styles.resourceCard, pressed && styles.resourceCardPressed]}
          onPress={() => handleResourcePress(resource)}
          accessibilityRole="button"
          accessibilityLabel={`Open ${resource.title}`}
        >
          <View style={styles.resourceText}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <Text style={styles.resourceSubtitle} numberOfLines={2}>
              {resource.subtitle}
            </Text>
            <Text style={styles.resourceDomain}>Opens {resource.domain}</Text>
          </View>
          <View style={styles.openPill}>
            <Text style={styles.openText}>Open</Text>
          </View>
        </Pressable>
      ))}

      <Text style={styles.footerText}>
        Well Within does not provide medical care and is not affiliated with these
        organizations. Before choosing care, verify credentials, training, availability,
        and fit directly with the provider or organization.
      </Text>

      <Modal visible={pendingResource !== null} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Open outside Well Within?</Text>
            <Text style={styles.modalBody}>
              This opens in your browser. Your chart stays private unless you export or share it.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalBtnOutline}
                onPress={() => setPendingResource(null)}
                accessibilityRole="button"
                accessibilityLabel="Cancel opening external resource"
              >
                <Text style={styles.modalBtnOutlineText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.modalBtnFilled}
                onPress={handleConfirmOpen}
                accessibilityRole="button"
                accessibilityLabel="Open external resource"
              >
                <Text style={styles.modalBtnFilledText}>Open</Text>
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
  heading: {
    fontSize: 28,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  intro: {
    fontSize: 15,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 16,
  },
  noticeCard: {
    backgroundColor: BG_MISSING,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    marginBottom: 22,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 14,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 10,
  },
  resourceCard: {
    minHeight: 88,
    backgroundColor: BG_CARD,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resourceCardPressed: { opacity: 0.72 },
  resourceText: { flex: 1 },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },
  resourceSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  resourceDomain: {
    fontSize: 12,
    fontWeight: '400',
    color: TEXT_SUBTLE,
    marginTop: 8,
  },
  openPill: {
    minWidth: 64,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: ACCENT_WARM_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openText: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_WARM,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '400',
    color: TEXT_MUTED,
    lineHeight: 19,
    marginTop: 10,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 15,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalBtnOutline: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER_CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnOutlineText: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
  modalBtnFilled: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: ACCENT_WARM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnFilledText: { fontSize: 15, fontWeight: '600', color: BG_CARD },
});
