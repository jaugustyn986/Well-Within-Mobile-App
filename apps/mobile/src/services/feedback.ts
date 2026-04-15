import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { hasSupabaseEnv } from '../config/env';
import { supabase } from '../lib/supabase';
import type { FeedbackCycleContext } from './feedbackContext';

export const FEEDBACK_TYPES = ['Issue', 'Something feels off', 'Suggestion'] as const;
export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export const FEEDBACK_CATEGORIES = [
  'Peak timing',
  'Fertile window',
  'Cycle summary',
  'Daily entry',
  'Sync / account',
  'Other',
] as const;
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export const FEEDBACK_CONFIDENCE = [
  'This matches what I expected',
  'This feels wrong',
] as const;
export type FeedbackConfidence = (typeof FEEDBACK_CONFIDENCE)[number];

export type UserFeedbackRow = {
  id?: string;
  created_at?: string;
  user_id: string | null;
  source_screen: string;
  feedback_type: FeedbackType;
  category: FeedbackCategory;
  confidence: FeedbackConfidence | null;
  message: string | null;
  include_cycle_context: boolean;
  cycle_context: FeedbackCycleContext | null;
  app_version: string | null;
  platform: string | null;
  schema_version?: number;
};

export type SubmitFeedbackInput = {
  sourceScreen: string;
  feedbackType: FeedbackType;
  category: FeedbackCategory;
  confidence: FeedbackConfidence | null;
  message: string | null;
  includeCycleContext: boolean;
  cycleContext: FeedbackCycleContext | null;
};

const APP_VERSION = Constants.expoConfig?.version ?? '0.1.0';

function isFeedbackType(v: string): v is FeedbackType {
  return (FEEDBACK_TYPES as readonly string[]).includes(v);
}

function isFeedbackCategory(v: string): v is FeedbackCategory {
  return (FEEDBACK_CATEGORIES as readonly string[]).includes(v);
}

function isFeedbackConfidence(v: string): v is FeedbackConfidence {
  return (FEEDBACK_CONFIDENCE as readonly string[]).includes(v);
}

export function submitFeedback(input: SubmitFeedbackInput): Promise<void> {
  if (!hasSupabaseEnv() || !supabase) {
    return Promise.reject(new Error('Feedback is unavailable.'));
  }

  if (!isFeedbackType(input.feedbackType)) {
    return Promise.reject(new Error('Invalid feedback type.'));
  }
  if (!isFeedbackCategory(input.category)) {
    return Promise.reject(new Error('Invalid category.'));
  }
  if (input.confidence !== null && !isFeedbackConfidence(input.confidence)) {
    return Promise.reject(new Error('Invalid confidence.'));
  }

  const msg = input.message?.trim() ?? '';
  if (msg.length > 1000) {
    return Promise.reject(new Error('Message too long.'));
  }

  const cycle_context =
    input.includeCycleContext && input.cycleContext ? input.cycleContext : null;

  return (async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user?.id ?? null;

    const row = {
      user_id: uid,
      source_screen: input.sourceScreen,
      feedback_type: input.feedbackType,
      category: input.category,
      confidence: input.confidence,
      message: msg.length > 0 ? msg : null,
      include_cycle_context: input.includeCycleContext,
      cycle_context,
      app_version: APP_VERSION,
      platform: Platform.OS,
      schema_version: 1,
    };

    const { error } = await supabase.from('user_feedback').insert(row);
    if (error) throw error;
  })();
}
