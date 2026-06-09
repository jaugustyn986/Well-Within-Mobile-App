jest.mock('../../config/env', () => ({ hasSupabaseEnv: () => true }));

jest.mock('expo-constants', () => ({
  expoConfig: { version: '9.9.9' },
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

const mockInsert = jest.fn();
const mockGetSession = jest.fn();

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
    from: () => ({
      insert: (...args: unknown[]) => mockInsert(...args),
    }),
  },
}));

import { normalizeContactEmail, submitFeedback } from '../feedback';

describe('feedback contact email', () => {
  beforeEach(() => {
    mockInsert.mockReset();
    mockGetSession.mockReset();
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockInsert.mockResolvedValue({ error: null });
  });

  it('normalizes blank and valid optional emails', () => {
    expect(normalizeContactEmail(null)).toBeNull();
    expect(normalizeContactEmail('   ')).toBeNull();
    expect(normalizeContactEmail(' USER@Example.COM ')).toBe('user@example.com');
  });

  it('rejects invalid optional emails before insert', async () => {
    await expect(
      submitFeedback({
        sourceScreen: 'Help',
        feedbackType: 'Suggestion',
        category: 'Other',
        confidence: null,
        message: 'The guide was unclear.',
        contactEmail: 'not-an-email',
        contactPermission: true,
        includeCycleContext: false,
        cycleContext: null,
      }),
    ).rejects.toThrow('Invalid contact email.');

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('includes contact fields when the user provides an email', async () => {
    await submitFeedback({
      sourceScreen: 'CalendarStatus',
      feedbackType: 'Something feels off',
      category: 'Cycle summary',
      confidence: 'This feels wrong',
      message: 'The phase looks wrong today.',
      contactEmail: ' Tester@Example.com ',
      contactPermission: true,
      includeCycleContext: false,
      cycleContext: null,
    });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        contact_email: 'tester@example.com',
        contact_permission: true,
        source_screen: 'CalendarStatus',
      }),
    );
  });

  it('stores null contact fields when no email is provided', async () => {
    await submitFeedback({
      sourceScreen: 'Settings',
      feedbackType: 'Issue',
      category: 'Other',
      confidence: null,
      message: null,
      contactEmail: '',
      contactPermission: false,
      includeCycleContext: false,
      cycleContext: null,
    });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        contact_email: null,
        contact_permission: null,
      }),
    );
  });

  it('does not store an email when contact permission is false', async () => {
    await submitFeedback({
      sourceScreen: 'Settings',
      feedbackType: 'Issue',
      category: 'Other',
      confidence: null,
      message: 'Please follow up only when allowed.',
      contactEmail: 'user@example.com',
      contactPermission: false,
      includeCycleContext: false,
      cycleContext: null,
    });

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        contact_email: null,
        contact_permission: false,
      }),
    );
  });
});
