import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import {
  BG_PAGE,
  BG_CARD,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  BORDER_CARD,
  ACCENT_WARM,
  ACCENT_WARM_TINT,
} from '../theme/colors';

export function AuthScreen(): JSX.Element {
  const auth = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      navigation.goBack();
    }
  }, [auth?.user, navigation]);

  const handleSendMagicLink = useCallback(async () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    setSending(true);
    try {
      const { error } = await auth?.signInWithOtp(trimmed) ?? { error: new Error('Not available') };
      if (error) {
        Alert.alert('Could not send link', error.message);
        return;
      }
      Alert.alert(
        'Check your email',
        'Check your email for a sign-in link. Tap the link to sign in.'
      );
    } finally {
      setSending(false);
    }
  }, [email, auth]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Sign in with email</Text>
        <Text style={styles.subtitle}>
          We'll send you a link to sign in. No password needed.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={TEXT_MUTED}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!sending}
        />
        <Pressable
          style={[styles.button, sending && styles.buttonDisabled]}
          onPress={handleSendMagicLink}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send magic link</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_PAGE, justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: BG_CARD,
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER_CARD,
  },
  title: { fontSize: 20, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 8 },
  subtitle: { fontSize: 15, color: TEXT_SECONDARY, marginBottom: 20, lineHeight: 22 },
  input: {
    borderWidth: 1,
    borderColor: BORDER_CARD,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },
  button: {
    backgroundColor: ACCENT_WARM,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
